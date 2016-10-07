'use strict';

var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport(
//   'smtps://taskrunnerpayments%40gmail.com:wepEs7dudUcH@smtp.gmail.com');
var transporter = nodemailer.createTransport(
  'smtps://contact@taskmatch.ie:nERehasTU3rA+h@smtp.gmail.com');

/**
 * Module dependencies.
 */
var stripe = require('stripe')('sk_live_eWEKYPHu3hXm7TVWOJo4LKJF');
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function(req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function(uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function(saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function(err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update cover picture
 */
exports.changeCoverPicture = function(req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function(uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.coverImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function(saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function(err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Create a new customer with stripe API
 */
exports.createNewCustomer = function(req, res) {

  var data = req.body;

  var stripeToken = data.stripeToken;
  var customerName = data.customerName;
  var customerEmail = data.customerEmail;
  var userId = data.userId;

  stripe.customers.create({
    source: stripeToken,
    description: customerName,
    email: customerEmail
  }).then(function(customer) {
    //      return stripe.charges.create({
    //        amount: 1000, // amount in cents, again
    //        currency: "eur",
    //        customer: customer.id
    //      });
    User.findOneAndUpdate({
      _id: userId
    }, {
      '$set': {
        stripeCustomerId: customer.id
      }
    }, {
      new: true //to return updated document
    }).exec(function(error, user) {
      if (error) {
        return res.status(400).send({
          message: 'Failed to add customer id due to invalid params!'
        });
      }
      return res.status(200).send(user);
    });
  }).then(function(charge) {
    // YOUR CODE: Save the customer ID and other info in a database for later!
  });
};


/**
 * Update an existing customer with PayPal email for receiving payments
 */
exports.updateReceivePayment = function(req, res) {

  var data = req.body;

  var payPalEmail = data.payPalEmail;
  var user = req.user;

  User.findOneAndUpdate({
    _id: user._id
  }, {
    '$set': {
      payPalEmail: payPalEmail
    }
  }, {
    new: true //to return updated document
  }).exec(function(error, user) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to add customer payPalEmail due to invalid params!'
      });
    }
    return res.status(200).send(user);
  });
};


/**
 * Update an existing customer with stripe API
 */
exports.updateCustomer = function(req, res) {

  var data = req.body;

  var customerId = data.customerId;
  var stripeToken = data.stripeToken;
  var customerName = data.customerName;
  var customerEmail = data.customerEmail;
  var userId = data.userId;

  stripe.customers.update(customerId, {
    source: stripeToken,
    description: customerName,
    email: customerEmail

  }, function(err, customer) {

    User.findOneAndUpdate({
      _id: userId
    }, {
      '$set': {
        stripeCustomerId: customer.id
      }
    }, {
      new: true //to return updated document
    }).exec(function(error, user) {
      if (error) {
        return res.status(400).send({
          message: 'Failed to add customer id due to invalid params!'
        });
      }
      return res.status(200).send(user);
    });
  }).then(function(charge) {
    // YOUR CODE: Save the customer ID and other info in a database for later!
  });
};


// /**
//  * Retrieve customer charges in Stripe API
//  */
exports.customerCharges = function(req, res) {

  var data = req.body;

  var customerId = data.customerId;

  stripe.customers.retrieve(customerId, function(err, customer) {
    var customer = customer;
  }).then(function(customer) {
    return stripe.charges.list({
        customer: customer.id
      },
      function(err, charges) {
        return res.status(200).send(charges);
        res(charges);
      }

    );
  });

};


// /**
//  * Retrieve customer details in Stripe API
//  */
exports.customerDetails = function(req, res) {

  var data = req.body;
  var customerId = data.customerId;

  stripe.customers.retrieve(customerId, function(err, customer) {}).then(function(customer) {
    return res.status(200).send(customer);
    res(customer);
  });

};

// // /**
// //  * Retrieve customer charges in Stripe API
// //  */
// exports.customerCharges = function(req, res) {

//   var customerId = req.body.stripeCustomerId;

//   stripe.charges.list(
//           { customer: stripeCustomerId },
//           include[]=total_count,

//           function(err, charges) {
//             // asynchronously called
//             var customerCharges = charges; 

//               if (err) {
//         return res.status(400).send({
//           message: 'Failed to retrieve customer charges due to invalid params!'
//         });
//       }
//       return res.status(200).send(charges);
//               res(charges);
//           }
//     );
// // //      .then(function(error, charges) {
// // //      
// // //      
// // //      
// // ////      function(error, charges) {
// // ////      if (error) {
// // ////        return res.status(400).send({
// // ////          message: 'Failed to retrieve customer charges due to invalid params!'
// // ////        });
// // ////      }
// // ////      return res.status(200).send(charges);
// // ////  };
//   };

/**
 * Send a request a quote email alert
 */
exports.requestAQuoteAlert = function(req, res) {
  var data = req.body;
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'taskrunnerpayments@gmail.com',
    to: data.emailTo,
    subject: 'New offer request from ' + data.taskOwner,
    html: '<div class="panel" style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05); box-shadow: 0 1px 1px rgba(0,0,0,.05);"><div class="panel-header" style="padding: 10px 15px; border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px;background-color:#0086fe;color:white;"><img alt="Taskmatch" src="http://taskmatch.ie/modules/core/client/img/new1.png" style="margin-top:10px;height:30px;width:130px;left:30px;background-color:white;padding:5px;border-radius:5px;"><h4 style="font-size:12px;top:20px;text-align:right;padding:0px;margin-top:-18px;color:white;"><a style="color:white;" href="http://taskmatch.ie/settings/dashboard">My Profile</a></h4>\n</div> <div class="panel-body" style="color:#696969;text-align:center; padding: 15px;"> <h4 style="font-size:24px;"><b>Hello, <strong>' +
      data.contactName + '!</h4></strong>\n<p>' + data.taskOwner +
      ' would like for you to make an offer on their task: \n <blockquote style="    padding: 10px 20px;margin: 0 0 20px;font-size: 17.5px;border-left: 5px solid #eee;">' +
      data.taskName +
      '</blockquote> \n<a href="http://www.taskmatch.ie/tasks/' +
      data.taskId + '">' + data.taskName +
      '</a></p> \n <a href="http://www.taskmatch.ie/offers/' + data.offerId +
      '"><button style="background-color:#e40051;color:white;font-size:12px;text-transform:uppercase;padding: 8px;border-radius: 6px;">Make an offer</button></a> </div> \n <div class="panel-footer" style="padding: 10px 15px; border-top: 1px solid #ddd; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;height:auto;background-color:#0086fe;color:white;"><a href="https://twitter.com/Task_Match"><img style="height:2em;width:2em;float:right;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677290_twitter_circle_gray.png"></a><a href="https://www.facebook.com/TaskMatch-1528535830788580/info/?tab=page_info&edited=category"><img style="float:right;height:2em;width:2em;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677257_facebook_circle_gray.png"/></a><h4 class="main-info" style="text-align:center;font-size:13px;color:white;">Remember - It\'s free to post, with no obligation to hire </h4></div></div>'
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
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};