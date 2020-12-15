const express = require('express');
const Users = require('./../users/users-model');
const bcrypt = require('bcryptjs');
const router = express.Router();

const checkPayload = (req, res, next) => {
    console.log(req.body)
    if(!req.body.username || !req.body.password) {
        res.status(401).json('bad payload');
    } else {
        next();
    }
}

const checkUsernameUnique = async(req, res, next) => {
    try {
        const rows = await Users.getByUser({ username: req.body.username });
        if(!rows.length) {
            next();
        } else {
            res.status(401).json('username taken')
        }
    } catch(err) {
        res.status(500).json('something went wrong');
    }
}

const checkUsernameExists = async(req, res, next) => {
    try {
        const rows = await Users.getByUser({ username: req.body.username });
        if(rows.length) {
            req.userData = rows[0];
            next();
        } else {
            res.status(401).json('who is this?')
        }
    } catch(err) {
        res.status(500).json('something went wrong');
    }
}

router.post('/register', checkPayload, checkUsernameUnique, async (req, res) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = await Users.add({ username: req.body.username, password: hash })
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/login', checkPayload, checkUsernameExists, (req, res) => {
    const verifies = bcrypt.compareSync(req.body.password, req.userData.password);
    if(verifies) {
        req.session.user = req.userData;
        res.json(`You are logged in, ${req.userData.username}!`);
    } else {
        res.status(401).json('You shall not pass!');
    }
})

router.get('logout', (req, res) => {

})

module.exports = router;