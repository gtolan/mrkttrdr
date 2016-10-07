'use strict';

var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport(
//   'smtps://taskrunnerpayments%40gmail.com:wepEs7dudUcH@smtp.gmail.com');
var transporter = nodemailer.createTransport(
  'smtps://contact@taskmatch.ie:nERehasTU3rA+h@smtp.gmail.com');

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  });
};

/**
 * Signup welcome email
 */
exports.welcomeEmail = function (req, res) {

  var data = req.body;
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: data.emailFrom,
    to: data.emailTo,
    subject: data.subject,
    html: '<div class="panel" style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05); box-shadow: 0 1px 1px rgba(0,0,0,.05);"><div class="panel-header" style="padding: 10px 15px; border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px;background-color:#0086fe;color:white;"><img alt="Taskmatch" src="http://taskmatch.ie/modules/core/client/img/new1.png" style="margin-top:10px;height:30px;width:130px;left:30px;background-color:white;padding:5px;border-radius:5px;"><h4 style="font-size:12px;top:20px;text-align:right;padding:0px;margin-top:-18px;color:white;"><a style="color:white;" href="http://taskmatch.ie/settings/dashboard">My Profile</a></h4>\n</div> <div class="panel-body" style="color:#696969;text-align:center; padding: 15px;"> <h4 style="font-size:24px;"><b>Hello, <strong>' +
      data.contactName + '!</h4></strong>\n<p>You\'re now a part of the Taskmatch community where reliable workers are ready to help you with your tasks.</p><p>Did we forget to mention? It\'s <strong>completely free</strong> to try out and there\'s no obligation to hire.</p><br><p>So let\'s get started and get your first task posted!</p><br><a href="http://www.taskmatch.ie/tasks/create"><button style="background-color:#e40051;color:white;font-size:12px;text-transform:uppercase;padding: 8px;border-radius: 6px;">Get started now</button></a><br><h4 style="font-size:20px;padding: 0px;margin-top:3em;color: grey;">How about a few ideas to get you started?</h4><br></div> <div class="row" style="margin-right: -15px;margin-left: -15px;"> <div class="col-sm-6 col-md-4" style="@media (min-width: 768px).col-sm-6{width: 50%;};@media (min-width: 768px).col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9{float: left;};position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;"> <div class="thumbnail" style="display: block; padding: 4px; margin-bottom: 20px; line-height: 1.42857143; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; -webkit-transition: border .2s ease-in-out; -o-transition: border .2s ease-in-out; transition: border .2s ease-in-out;"> <img src="http://taskmatch.ie/modules/core/client/img/category/Cleaning.png" alt="..." style="height:200px;width:100%;display: block;"> <div class="caption" style="padding: 9px; color: #333;"> <h3 style="text-align:center;">House cleaning</h3> </div></div></div></div><div class="row" style="margin-right: -15px;margin-left: -15px;"> <div class="col-sm-6 col-md-4" style="@media (min-width: 768px).col-sm-6{width: 50%;};@media (min-width: 768px).col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9{float: left;};position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;"> <div class="thumbnail" style="display: block; padding: 4px; margin-bottom: 20px; line-height: 1.42857143; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; -webkit-transition: border .2s ease-in-out; -o-transition: border .2s ease-in-out; transition: border .2s ease-in-out;"> <img src="http://taskmatch.ie/modules/core/client/img/category/computerIT.png" alt="..." style="height: 200px;width:100%; display: block;"> <div class="caption" style="padding: 9px; color: #333;"> <h3 style="text-align:center;">Online and IT</h3> </div></div></div></div><div class="row" style="margin-right: -15px;margin-left: -15px;"> <div class="col-sm-6 col-md-4" style="@media (min-width: 768px).col-sm-6{width: 50%;};@media (min-width: 768px).col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9{float: left;};position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;"> <div class="thumbnail" style="display: block; padding: 4px; margin-bottom: 20px; line-height: 1.42857143; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; -webkit-transition: border .2s ease-in-out; -o-transition: border .2s ease-in-out; transition: border .2s ease-in-out;"> <img src="http://taskmatch.ie/modules/core/client/img/category/handyman.png" alt="..." style="height: 200px;width:100%;display: block;"> <div class="caption" style="padding: 9px; color: #333;"> <h3 style="text-align:center;">Handyman & DIY</h3> </div></div></div></div> <div class="panel-footer" style="padding: 10px 15px; border-top: 1px solid #ddd; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;height:auto;background-color:#0086fe;color:white;"><a href="https://twitter.com/Task_Match"><img style="height:2em;width:2em;float:right;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677290_twitter_circle_gray.png"></a><a href="https://www.facebook.com/TaskMatch-1528535830788580/info/?tab=page_info&edited=category"><img style="float:right;height:2em;width:2em;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677257_facebook_circle_gray.png"/></a><h4 class="main-info" style="text-align:center;font-size:13px;color:white;">Remember - It\'s free to post, with no obligation to hire </h4></div></div>'
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
  res.json(data);

};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }
                //this throws the [object%20Object] errror into path 
        // return res.redirect(redirectURL || sessionRedirectURL || '/');
        return res.redirect(redirectURL);
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
