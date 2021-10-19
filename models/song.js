const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name field is required'],
    },
    artist: {
        type: String,
        required: [true, 'The artist field is required'],
    },
});

const Song = mongoose.model('song', SongSchema);

module.exports = Song;