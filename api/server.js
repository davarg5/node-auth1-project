const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const server = express();
server.use(express.json());

const usersRouter = require('./users/users-router');


const authRouter = require('./auth/auth-router');


const config = {
    name: "sessionId", // the default would be sid, but that would reveal our stack
    secret: "keep it secret, keep it safe!", // to encrypt/decrypt the cookie
    cookie: {
      maxAge: 1000 * 60 * 60, // how long is the session valid for, in milliseconds
      secure: false, // used over https only, should be true in production
      httpOnly: true, // cannot access the cookie from JS using document.cookie
      // keep this true unless there is a good reason to let JS access the cookie
    },
    resave: false, // we might need to set this to true to avoid idle sessions being deleted
    saveUninitialized: false, // keep it false to avoid storing sessions and sending cookies for unmodified sessions
  };

server.use(session(config));
server.use(helmet());
server.use(cors());

server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.json({ server: 'up and running' })
})

module.exports = server;