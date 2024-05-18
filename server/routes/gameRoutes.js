const express = require('express');
const router = express.Router();
const gameAPI = require('../controllers/gameApi');


router.post("/", gameAPI.startGame);
router.post("/rounds/:roundNumber/guesses", gameAPI.submitGuess);
router.get("/rounds/:roundNumber", gameAPI.nextRound);



module.exports = router; 