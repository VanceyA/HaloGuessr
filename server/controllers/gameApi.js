const { GameSession } = require('../models/gameSessionModel');
const { Map, Location } = require('../models/mapModel');
const { Leaderboard } = require('../models/leaderboardModel');
const { User } = require('../models/userModel');

const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

async function finishGame(req, res, gameSession) {
    if (gameSession.roundsCompleted >= 5) {
        gameSession.isFinished = true;
        await gameSession.save();
        return res.status(201).json({});
    }
}

class gameAPI {

    // Called when a new game is started
    static async startGame(req, res) {
        try {
            const locations = await Location.aggregate([
                { $sample: { size: 5 } }
            ]);

            if (locations.length < 5) {
                return res.status(500).send("Locations not generated properly. Please try again.");
            }

            const gameSession = await GameSession.create({
                locations: locations.map(location => location._id),
            });
            await gameSession.save();
            req.session.gameId = gameSession._id;

            const location = gameSession.locations[0];

            const map = await Map.findOne({ _id: location.map });

            const locationUrl = getSignedUrl({
                url: "https://d7y0fjouo6hu5.cloudfront.net/" + location.image,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
                keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID
            });

            const mapUrl = getSignedUrl({
                url: "https://d7y0fjouo6hu5.cloudfront.net/" + map.image,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
                keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID
            });


            return res.status(201).json({
                startGame: true,
                locationUrl: locationUrl,
                mapUrl: mapUrl,
                gameSessionId: gameSession._id
            });
        } catch (err) {
            if (err.errors) {
                var errorMessages = {};
                for (var fieldName in err.errors) {
                    errorMessages[fieldName] = err.errors[fieldName].message;
                }
                return res.status(422).json(errorMessages);
            } else {
                return res.status(500).send("Unknown server error");
            }
        }
    }

    static async submitGuess(req, res) {
        const gameId = req.session.gameId;
        const reqRoundNumber = req.params.roundNumber;
        try {
            const gameSession = await GameSession.findOne({ _id: gameId });
            if (!gameSession) {
                return res.status(404).send("Game not found");
            }
            const roundsCompleted = gameSession.roundsCompleted;

            if (reqRoundNumber != roundsCompleted) {
                return res.status(404).send("Round number not found");
            }

            const location = await Location.findById(gameSession.locations[roundsCompleted]);
            
            if (!location) {
                return res.status(404).send("Location not found");
            }

            // finish game logic
            let score = 0;
            const maxScore = 1000;
            const threshold = 2;
            const maxDiff = 10;
            const guessX = req.body.guessX;
            const guessY = req.body.guessY;
            const targetX = location.x;
            const targetY = location.y;

            const diff = Math.abs(guessX - targetX) + Math.abs(guessY - targetY);

            if (diff <= threshold) {
                score = maxScore;
            } else {
                score = Math.max(0, maxScore - (diff * (maxScore / (4 * maxDiff))));
            }

            // update score
            gameSession.score += score;

            // end guess, increase rounds completed
            gameSession.roundsCompleted++;
            await gameSession.save();
            return res.status(201).json({
                score: score
            });


        } catch (err) {
            if (err.errors) {
                var errorMessages = {};
                for (var fieldName in err.errors) {
                    errorMessages[fieldName] = err.errors[fieldName].message;
                }
                return res.status(422).json(errorMessages);
            } else {
                return res.status(500).send("Unknown server error");
            }
        }
    }

    static async nextRound(req, res) {
        const gameId = req.session.gameId;
        const reqRoundNumber = req.params.roundNumber;
        try {
            const gameSession = await GameSession.findOne({ _id: gameId });
            if (!gameSession) {
                return res.status(404).send("Game not found");
            }

            const roundsCompleted = gameSession.roundsCompleted;

            if (reqRoundNumber != roundsCompleted) {
                return res.status(404).send("Round number not found");
            }

            await finishGame(req, res, gameSession);

            const location = await Location.findOne({ _id: gameSession.locations[roundsCompleted]})
            .populate("map")
            .exec();
            
            if (!location) {
                return res.status(404).send("Location not found");
            }

            const locationUrl = getSignedUrl({
                url: "https://d7y0fjouo6hu5.cloudfront.net/" + location.image,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
                keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID
            });

            const mapUrl = getSignedUrl({
                url: "https://d7y0fjouo6hu5.cloudfront.net/" + location.map.image,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
                keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID
            });

            const data = {
                locationUrl: locationUrl,
                mapUrl: mapUrl
            }
            
            res.status(201).json(data);
        } catch (err) {
            if (err.errors) {
                var errorMessages = {};
                for (var fieldName in err.errors) {
                    errorMessages[fieldName] = err.errors[fieldName].message;
                }
                return res.status(422).json(errorMessages);
            } else {
                return res.status(500).send("Unknown server error");
            }
        }
    }
}

module.exports = gameAPI;