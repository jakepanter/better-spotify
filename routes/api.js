const express = require('express');
const router = express.Router();
const Song = require('../models/song');

router.get('/songs', (req, res, next) => {
    Song.find()
        .then(data => res.json(data))
        .catch(next);
});

router.post('/songs', (req, res, next) => {
    if (req.body.name) {
        Song.create(req.body)
            .then(data => res.json(data))
            .catch(next);
    } else {
        res.json({
            error: 'The input field is empty',
        });
    }
});

router.delete('/songs/:id', (req, res, next) => {
    Song.findOneAndDelete({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(next);
});

module.exports = router;