const { Map, Location, HaloGame } = require('../models/mapModel');

const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");


function randomImageName(imageName) {
    return imageName + "_" + Date.now();
}

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

class adminAPI {
    static async uploadLocation(req, res) {
        console.log("req.body", req.body);
        console.log("req.file", req.file);
        try {
            const buffer = await sharp(req.file.buffer).resize({ width: 1920, height: 1080, fit: 'fill' }).toBuffer()

            const imageName = randomImageName(req.file.originalname);

            const params = {
                Bucket: bucketName,
                Key: imageName,
                Body: buffer,
                ContentType: req.file.mimetype
            };

            const command = new PutObjectCommand(params);

            await s3.send(command);

            const location = await Location.create({
                image: imageName,
                x: req.body.x,
                y: req.body.y,
                map: req.body.map,
                difficulty: req.body.difficulty
            });
            await location.save();

            const map = await Map.findOne({ _id: req.body.map });
            map.locations.push(location._id);
            await map.save();

            return res.status(201).json();
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

    static async uploadMap(req, res) {
        try {
            const buffer = await sharp(req.file.buffer).resize({ width: 1920, height: 1080, fit: 'fill' }).toBuffer()

            const imageName = randomImageName(req.file.originalname);

            const params = {
                Bucket: bucketName,
                Key: imageName,
                Body: buffer,
                ContentType: req.file.mimetype
            };

            const command = new PutObjectCommand(params);

            await s3.send(command);

            const map = await Map.create({
                image: imageName,
                x: req.body.x,
                y: req.body.y,
                map: req.body.map
            });
            await map.save();

            const haloGame = await HaloGame.findOne({ _id: req.body.haloGame });
            haloGame.maps.push(map._id);
            await haloGame.save();

            return res.status(201).json();
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


    static async deleteLocation(req, res) {
        try {
            const location = await Location.findOne({ _id: req.params.locationId });
            if (!location) {
                return res.status(404).send("Location not found");
            }

            const map = await Map.findOne({ _id: location.map });
            map.locations.remove(location._id);
            await map.save();

            const params = {
                Bucket: bucketName,
                Key: location.image
            };
            const command = new DeleteObjectCommand(params);
            await s3.send(command);


            await Location.deleteOne({ _id: req.params.locationId });
            return res.status(201).json();
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

// Delete map and all locations associated with it
    static async deleteMapandLocations(req, res) {
        try {
            const map = await Map.findOne({ _id: req.params.mapId });
            if (!map) {
                return res.status(404).send("Map not found");
            }
            

            const params = {
                Bucket: bucketName,
                Key: map.image
            };
            const command = new DeleteObjectCommand(params);
            await s3.send(command);

            const haloGame = await HaloGame.findOne({ _id: map.halo_game });
            haloGame.maps.remove(map._id);

            const mapId = map._id;

            await Map.deleteOne({ _id: req.params.mapId });

            await Location.deleteMany({ map: mapId });

            await haloGame.save();

            return res.status(201).send("Map deleted.");
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

module.exports = adminAPI;