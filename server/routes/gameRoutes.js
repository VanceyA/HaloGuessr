const express = require('express');
const router = express.Router();
const gameAPI = require('../controllers/gameApi');


router.post("/start", gameAPI.startGame);
router.patch("/guess", gameAPI.submitGuess);
router.get("/next", gameAPI.nextRound);


// Have finish game be part of nextRound logic, just a conditional that checks if it's the last round


// router.patch("/finish", gameAPI.finishGame);



module.exports = router; 