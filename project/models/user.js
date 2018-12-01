const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs   = require('fs');
const jwt   = require('jsonwebtoken');
var auth = require('../controllers/auth');
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

 
//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 12, function (err, hash){
    if (err) {
      return err;
    }
    user.password = hash;
    next();
  })
});


var User = mongoose.model('User', UserSchema);

//creating a token 
var privateKEY  = fs.readFileSync('project/controllers/private.key', 'utf8');
var publicKEY  = fs.readFileSync('project/controllers/public.key', 'utf8'); 
// change secret to be more complicated 
const secret = 'secret';
async function createToken() {
  let expirationDate = Math.floor(Date.now() / 1000) + 3600;
  var token = jwt.sign({ userID: auth.createUser.email, exp: expirationDate}, secret);
  return token;
}
module.exports.createToken = createToken;
module.exports.secret = secret;



