const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = Schema({
    username: { type: String, required: true },
    gameHistory: [{ type: Schema.Types.ObjectId, ref: 'GameSession' }],
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User: User
};