const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


// Sign up
exports.register = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  // Validate password match
  if (password !== confirmPassword) {
    req.flash('error_msg', 'Passwords do not match');
    res.redirect('/users/register');
  } else {
    // Check if email is already registered
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email is already registered');
          res.redirect('/users/register');
        } else {
          // Create new user
          const newUser = new User({
            name: name,
            email: email,
            password: password
          });
          // Hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      })
      .catch(err => console.log(err));
  }
};

// Sign in
exports.login = (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  };  

// Sign out
exports.logout = (req, res) => {
    req.logout(() => {
    req.flash('success_msg', 'You are logged out');  
      res.redirect('/');
    });
  };

// Reset password

exports.resetPassword = (req, res) => {
  const { email } = req.body;

  // Generate a new password or implement your own password reset logic here

  // Example: Generate a random password and update it in the database
  const newPassword = Math.random().toString(36).slice(-8);

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(newPassword, salt, (err, hash) => {
      if (err) throw err;

      // Update the user's password in the database
      User.findOneAndUpdate({ email: email }, { password: hash })
        .then(() => {
          // Send the new password to the user's email or implement your own notification logic here
          console.log('Password reset successful. New password: ' + newPassword);

          // Redirect the user to the login page with a success message
          req.flash('success_msg', 'Password reset successful. Check your email for the new password.');
          res.redirect('/users/login');
        })
        .catch(err => console.log(err));
    });
  });
};

