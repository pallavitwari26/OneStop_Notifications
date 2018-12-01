const express = require('express');
const mongoose = require('mongoose');
const { createUser } = require('../controllers/auth');
const router = express.Router();
const { createToken } = require('../models/user');
const jwtVerifer = require('express-jwt');
const { secret } = require('../models/user');

mongoose.connect('mongodb://localhost:27017/onestop');

router.get('/', (req, res) => {
    res.send("Notification Home Page. This is cool");
});

router.get('/profile',jwtVerifer({secret: secret}), (req, res) => {
  res.send('You make it to home!')
})
router.post('/login', async function(req,res) {
    let {email, username, password, passwordConf} = req.body;
    if (email &&
        username &&
        password &&
        passwordConf && password === passwordConf) {
      return res.send(await createToken());
    }
    return res.send('Error');
});
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(500).send(err.message);
    }
});

router.get('/logout', function(req, res) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return err;
      } else {
        return res.redirect('/');
      }
    });
  }
});


router.get('/signup', function(res,req,next) {

});


module.exports = router;