const mongoose = require('mongoose')
const { Schema } = mongoose;

const haloGameSchema = Schema({
    name: { type: String, required: true, unique: true },
    maps: [{ type: Schema.Types.ObjectId, ref: 'Map', required: true }],
});

const HaloGame = mongoose.model('HaloGame', haloGameSchema);

const mapSchema = Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    halo_game: { type: Schema.Types.ObjectId, ref: 'HaloGame', required: true },
});

const Map = mongoose.model('Map', mapSchema);


// x and y are percentages of the way through the map
const locationSchema = Schema({
    image: { type: String, required: true, unique: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    map: { type: Schema.Types.ObjectId, ref: 'Map', required: true },
    difficulty: { 
        type: String,
        required: true,
        enum: ['Easy', 'Normal', 'Heroic', 'Legendary', 'LASO']
    },
}, {
    toJSON: {
        versionKey: false,
        transform(doc, ret) {
            delete ret.x;
            delete ret.y;
        }
    }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = {
    Map: Map,
    Location: Location,
    HaloGame: HaloGame
};