const express = require('express');
const router = express.Router();
const gameAPI = require('../controllers/gameApi');


router.post("/start", gameAPI.startGame);
router.patch("/guess", gameAPI.submitGuess);
router.get("/next", gameAPI.nextRound);

router.patch("/finish", gameAPI.finishGame);



module.exports = router; 