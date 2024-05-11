const express = require('express');
const router = express.Router();
const adminAPI = require('../controllers/adminApi');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const singleUpload = upload.single('image');

router.post("/uploadLocation", singleUpload, adminAPI.uploadLocation);
router.post("/uploadMap", singleUpload, adminAPI.uploadMap);

router.delete("/deleteLocation/:locationId", adminAPI.deleteLocation);
router.delete("/deleteMap/:mapId", adminAPI.deleteMap);

module.exports = router;