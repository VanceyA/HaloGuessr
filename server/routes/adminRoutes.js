const express = require('express');
const router = express.Router();
const adminAPI = require('../controllers/adminApi');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const singleUpload = upload.single('image');

router.get("/maps", adminAPI.getMaps);


router.post("/locations", singleUpload, adminAPI.uploadLocation);
router.post("/maps", singleUpload, adminAPI.uploadMap);


router.delete("/locations/:locationId", adminAPI.deleteLocation);
router.delete("/maps/:mapId", adminAPI.deleteMapandLocations);

module.exports = router;