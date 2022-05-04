const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { omit } = require('lodash');
const authorization = require('../../validation/authorization');
const keys = require('../../config/keys');

// Load input validation
const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');

// Mongoose models
const User = require('../../models/User');

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedPassword;
};

// @route POST api/register
// @desc Register new use.
// @access Private
router.post('/register', (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { company, email, department, password } = req.body;

  User.findOne({
    email: email,
  }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email is already registered.' });
    } else {
      const newUser = new User({
        company,
        email,
        department,
        password,
      });
      // Hash Password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          //Set password to hashed
          newUser.password = hash;
          //Save user
          try {
            const registeUser = await newUser.save();
            res.json(registeUser);
          } catch (err) {
            return next(boom.boomify(err));
          }
        });
      });
    }
  });
});

// @route POST api/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', async (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by name
  const user = await User.findOne({ email });
  // Check if user exists
  if (!user) {
    return res.status(401).json({ usernotfound: 'User not found' });
  }
  if (!user.status) {
    return res.status(401).json({ userBlock: 'User has been blocked !. please contact Admin.' });
  }
  // Check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    // Create JWT Payload
    const { role, status, _id, company, email, department } = user;
    // Sign token
    jwt.sign(
      { role, status, _id, company, email, department },
      keys.secretOrKey,
      {
        expiresIn: 604800, // 1 week in seconds
      },
      (err, token) => {
        console.log('~~~', { token });
        return res
          .cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          })
          .status(200)
          .json({ message: 'Logged in successfully' });
      }
    );
  } else {
    return res.status(401).json({ passwordincorrect: 'Password incorrect' });
  }
});

// @route POST api/logout
// @desc Logged out users
// @access Private
router.get('/logout', authorization, async (req, res, next) => {
  return res.clearCookie('access_token').status(200).json({ message: 'Successfully logged out.' });
});

// @route POST api/logout
// @desc Logged out users
// @access Private
router.get('/auth', authorization, async (req, res, next) => {
  return res.json(req.authUser);
});

// @route POST api/user
// @desc Return registered users
// @access Private
router.post('/user', authorization, async (req, res, next) => {
  try {
    const data = await User.find().select('-password -__v').sort('date').exec();
    res.json({ data });
  } catch (err) {
    return next(boom.boomify(err));
  }
});

//Delete user
router.delete('/user/:id', authorization, async (req, res, next) => {
  try {
    const data = await User.deleteOne({ _id: req.params.id });
    res.json(data);
  } catch (err) {
    return next(boom.boomify(err));
  }
});

// Edit existing user
router.put('/user/:id', authorization, async (req, res, next) => {
  try {
    let body;
    const { errors, isValid } = validateRegisterInput(req.body, true);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { comapany, email, department, status, role, password } = req.body;
    if (!password) {
      body = {
        comapany,
        email,
        department,
        status,
        role,
      };
    } else {
      const hashedPassword = await hashPassword(password);
      body = {
        comapany,
        email,
        department,
        status,
        role,
        password: hashedPassword,
      };
    }
    const data = await User.updateOne(
      { _id: req.params.id }, // Filter
      { $set: { ...body } }, // Update
      { upsert: true } // add document with req.body.id if not exists
    ).exec();
    res.json(data);
  } catch (err) {
    return next(boom.boomify(err));
  }
});

// Acknowledge Notice
router.put('/acknowledge-notice/:id', authorization, async (req, res, next) => {
  try {
    const { notice_id } = req.body;
    const data = User.updateOne(
      { _id: req.params.id },
      {
        $push: {
          acknowledge: notice_id,
        },
      },
      { upsert: true }
    ).exec();
    res.json(data);
  } catch (err) {
    return next(boom.boomify(err));
  }
});

// Get Acknowledged Notice By User
router.get('/acknowledge-notice/:id', authorization, async (req, res, next) => {
  try {
    const { notice_id } = req.body;
    const data = User.find({ _id: req.params.id, acknowledge: { $in: [notice_id] } }).exec();
    res.json(data);
  } catch (err) {
    return next(boom.boomify(err));
  }
});

module.exports = router;
