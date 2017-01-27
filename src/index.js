import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from './models/user';

import {
  MONGO_URI, AUDIENCE, ISSUER, EXPIRE_TIME, APP_SECRET, PORT
} from './config';

// Set up mongo connection
mongoose.connect(MONGO_URI, err=>{
  console.error(err);
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected'));

const app = express();
const router = express.Router();
const saltRounds = 10;

//CORS middleware
function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(methodOverride());

function createJwt(user) {
  const {email, password, roles} = user;

  let token = jwt.sign({
    email,
    roles,
    iss: ISSUER,
    aud: AUDIENCE,
    exp: Math.floor(Date.now() / 1000) + EXPIRE_TIME
  }, user.password);

  return { token };
}

/**
 * Do login if user has account otherwise create a new user
 * POST /api/v1/login
 * {
 *	"email":"me@email.com",
 *	"password": "qwerty"
 * }
 */
app.post('/api/v1/login', (req, res, next) => {

  // find the user
  User.findOne({ "email": req.body.email }, (err, dbUser) => {

    // if some error occours send the base error message
    if (err) {
      res.status(401).send("invalid user or password");
    }

    // if there is not user create one
    if (!dbUser) {

      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        User.create({ email: req.body.email, password: hash, roles: ["user"] }, (err, newUser) => {
          res.send(createJwt(newUser));
        })
      });
    }
    // if the user was found validate the password and create the jwt
    else {
      //check password
      bcrypt.compare(req.body.password, dbUser.password, (err, result) => {
        result ? res.send(createJwt(dbUser)) : res.status(401).send("invalid user or password");
      });
    }
  });
})

/**
 * Validate a JWT
 * POST /api/v1/validate
 * {
 *	"token":"token"
 * }
 */
app.post('/api/v1/validate', (req, res, next) => {

  let token = req.body.token;
  let decodedToken = jwt.decode(token);

  User.findOne({ "email": decodedToken.email }, (err, dbUser) => {

    if (!dbUser)
      return res.status(401).send("invalid token");

    jwt.verify(token, dbUser.password, (err, decoded) => {
      err ? res.status(500).send(err.message) : res.send(true);
    });
  });
})

/**
 * Grant a role to an user
 * POST /api/v1/grantrole
 * {
 *  "role": "master of universe",
 *  "email": "me@email.com",
 *  "secret": "secret_token"
 * }
 */
app.post("/api/v1/grantrole", (req, res, next) => {

  let {email, role, secret} = req.body;

  if (secret != APP_SECRET)
    return res.status(401).send("not allowed");

  User.findOne({ "email": email }, (err, dbUser) => {
    if (!dbUser)
      return res.status(401).send("invalid token");

    dbUser.roles.push(role);
    User.update({ _id: dbUser._id }, dbUser, (err, updatedUser) => {
      err ? res.status(500).send("error") : res.send(true);
    })
  });
});

/**
 * Revoke a role from an user
 * POST /api/v1/rovekerole
 * {
 *  "role": "master of universe",
 *  "email": "me@email.com",
 *  "secret": "secret_token"
 * }
 */
app.post("/api/v1/revokerole", (req, res, next) => {

  let {email, role, secret} = req.body;

  if (secret != APP_SECRET)
    return res.status(401).send("not allowed");

  User.findOne({ "email": email }, (err, dbUser) => {
    if (!dbUser)
      return res.status(401).send("invalid token");

    dbUser.roles = dbUser.roles.filter(x => x != role);
    User.update({ _id: dbUser._id }, dbUser, (err, updatedUser) => {
      err ? res.status(500).send("error") : res.send(true);
    })
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});