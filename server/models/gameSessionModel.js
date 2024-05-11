const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSessionSchema = Schema({
  roundsCompleted: { type: Number, required: true, default: 0 },
  locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true }],
  startTime: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
});

const GameSession = mongoose.model('GameSession', gameSessionSchema);

module.exports = {
  GameSession: GameSession
};