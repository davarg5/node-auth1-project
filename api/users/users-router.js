const express = require('express');

const router = express.Router();

const Users = require('./users-model');

const restricted = (req, res, next) => {
    if(req.session && req.session.user) {
        next()
    } else {
        res.status(401).json('You shall not pass!');
    }
}

router.get('/', restricted, (req, res) => {
    Users.getAll()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({ message: err })
        })
})

module.exports = router;
