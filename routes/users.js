const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

// Sign up
router.post('/register', authController.register);
router.get('/register', (req, res) => {
    res.render('register');
  });
  
// Sign in
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}));


router.get('/login', (req, res) => {
    res.render('login');
  });
// Sign out
router.get('/logout', authController.logout);

// Reset password
router.post('/reset', authController.resetPassword);
router.get('/reset', authController.resetPassword);

// Google login/signup (Social authentication)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
