# nodejs-authentication

# Introduction

This is a Nodejs Authentication Project which is built using Nodejs, Expressjs, Ejs ,CSS, Javascript, Mongodb.

# Features

-User signup on this page ..Name,Email_ID, Password & Confirm password .
-User sign in on this page...Name and Password.
-User sign in using google authentication.
-User can reset or change password.Enter your name , Enter your old password and Enter new password. The Password store in mongoDB has encrypted

- nodejs-authentication
  |- controllers
     |- authController.js
  |- models
     |- User.js
  |- views
     |- index.ejs
     |- login.ejs
     |- register.ejs
     |- reset.ejs
  |- routes
     |- index.js
     |- users.js
- config
  |- passport.js
- public
  |- styles.css
- index.js
