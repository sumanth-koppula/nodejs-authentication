const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Local strategy
module.exports = function(passport) {
    passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        (email, password, done) => {
        User.findOne({ email: email })
            .then(user => {
            if (!user) {
                return done(null, false, { message: 'Incorrect email' });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                return done(null, user);
                } else {
                return done(null, false, { message: 'Incorrect password' });
                }
            });
            })
            .catch(err => console.log(err));
        }
    )
    );

    // Google strategy
    passport.use(
      new GoogleStrategy(
        {
          clientID: '726613280817-o9boh0fnft2fhafjh4c7cerc5aoj1v64.apps.googleusercontent.com',
          clientSecret: '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',
          callbackURL: '/users/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
          User.findOne({ email: profile.emails[0].value })
            .then(user => {
              if (user) {
                done(null, user);
              } else {
                const newUser = new User({
                  name: profile.displayName,
                  email: profile.emails[0].value,
                  password: '' // No password needed for Google authentication
                });
                newUser.save()
                  .then(user => {
                    done(null, user);
                  })
                  .catch(err => {
                    done(err, false, { message: 'Failed to create new user' });
                  });
              }
            })
            .catch(err => {
              done(err, false, { message: 'Failed to find user' });
            });
        }
      )
    );

    // Serialize and deserialize user
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
    
      passport.deserializeUser((id, done) => {
        User.findById(id)
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            done(err, null);
          });
      });
}