const nodemailer = require("nodemailer");
const User = require('../models/user');
const passport = require('passport');

function authController() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'gabriel.deckow15@ethereal.email',
      pass: 'rnvtXxrzJAqmbBcGMz'
    }
  });

  return {
    // SIGN IN SETUP
    signin(req, resp) {
      resp.render('auth/signin');
    },

    postSignin(req, resp, next) {
      const { username, password } = req.body;

      // Validate request
      if (!username || !password) {
        req.flash('error', 'All fields are required');
        return resp.redirect('/signin');
      }

      passport.authenticate('local', (err, user, info) => {
        if (err) {
          req.flash('error', info.message);
          return next(err);
        }
        if (!user) {
          req.flash('error', info.message);
          return resp.redirect('/signin');
        }
        req.logIn(user, (err) => {
          if (err) {
            req.flash('error', info.message);
            return next(err);
          }

          return resp.redirect('/home');
        });
      })(req, resp, next);
    },

    home(req, resp) {
      resp.render('auth/home');
    },

    // SIGNUP SETUP
    signup(req, resp) {
      resp.render('auth/signup');
    },

    postSignup(req, resp) {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        req.flash('error', 'All fields are required');
        req.flash('username', username);
        req.flash('email', email);
        return resp.redirect('/');
      }

      // Check if email exists
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash('error', 'Email already taken');
          req.flash('username', username);
          req.flash('email', email);
          return resp.redirect('/');
        } else {
          User.register(
            {
              username: username,
              email: email
            },
            password,
            (err, user) => {
              if (err) {
                req.flash('error', 'Something went wrong');
                return resp.redirect('/');
              } else {
                // Send verification email
                const mailOptions = {
                  from: "abhaychauhan836481@gmail.com",
                  to: email,
                  subject: "Account Verification",
                  text: "Please verify your account by clicking the link: https://your-app-url/verify/" + user.id
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Email sent: " + info.response);
                  }
                });

                return resp.redirect('/signin');
              }
            }
          );
        }
      });
    },

    // RESET PASSWORD SETUP
    reset(req, resp) {
      resp.render('auth/reset');
    },

    resetPassword(req, resp) {
      User.findOne({ username: req.body.username }, (err, user) => {
        if (err || !user) {
          req.flash('error', 'Please check your password');
        } else {
          user.setPassword(req.body.newpassword, (err) => {
            if (err) {
              req.flash('error', 'Failed to reset password');
              return resp.redirect('/reset');
            } else {
              // Send password reset email
              const mailOptions = {
                from: "abhaychauhan836481@gmail.com",
                to: user.email,
                subject: "Password Reset",
                text: "Click the link to reset your password: https://your-app-url/reset-password/" + user.resetToken
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });

              return resp.redirect('/signin');
            }
          });
        }
      });
    },

    // LOGOUT
    logout(req, resp, next) {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        return resp.redirect('/');
      });
    },

    // GOOGLE AUTHENTICATION SETUP
    googleLogin(req, resp, next) {
      // Implement the Google authentication logic here
      passport.authenticate('google', { scope: ['profile', 'email'] })(req, resp, next);
    },

    googleCallback(req, resp, next) {
      // Implement the Google authentication callback logic here
      passport.authenticate('google', {
        successRedirect: '/home',
        failureRedirect: '/signin',
        failureFlash: true
      })(req, resp, next);
    }
  };
}

module.exports = authController;
