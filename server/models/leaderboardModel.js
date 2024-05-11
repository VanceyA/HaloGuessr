const mongoose = require('mongoose');
const { Schema } = mongoose;

const leaderboardSchema = Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = {
    Leaderboard: Leaderboard
};