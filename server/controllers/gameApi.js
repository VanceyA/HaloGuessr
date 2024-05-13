const { GameSession } = require('../models/gameSessionModel');
const { Map, Location } = require('../models/mapModel');
const { Leaderboard } = require('../models/leaderboardModel');
const { User } = require('../models/userModel');

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});


class gameAPI {

    // Called when a new game is started
    static async startGame(req, res) {
        try {
            const locations = await Location.aggregate([
                { $sample: { size: 5 } }
            ])

            const gameSession = await GameSession.create({
                locations: locations.map(location => location._id),
            });
            await gameSession.save();
            req.session.gameId = gameSession._id;
            return res.status(201).json({
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
        try {
            const gameSession = await GameSession.findOne({ _id: gameId });
            if (!gameSession) {
                return res.status(404).send("Game not found");
            }
            const roundNumber = gameSession.roundNumber;
            const location = await Location.findById(gameSession.locations[roundNumber]);

            // finish game logic
            let score = 0;
            const guessX = req.body.guessX;
            const guessY = req.body.guessY;

            // Jon's score logic here
            




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
        try {
            const gameId = req.session.gameId;
            const gameSession = await GameSession.findOne({ _id: gameId });
            const roundNumber = gameSession.roundNumber;
            const location = await Location.findById(gameSession.locations[roundNumber]);
            // send picture of location and map image (can't just be link to s3)

            const getObjectParams = {
                Bucket: bucketName,
                Key: location.image
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            
            res.status(201).json();
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