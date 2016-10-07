'use strict';

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(
  'smtps://contact@taskmatch.ie:nERehasTU3rA+h@smtp.gmail.com');
var stripe = require('stripe')('sk_live_eWEKYPHu3hXm7TVWOJo4LKJF');

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Offer = mongoose.model('Offer'),
  Task = mongoose.model('Task'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Offer
 */
exports.create = function(req, res) {
  var offer = new Offer(req.body);
  offer.user = req.user;

  offer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(offer);
    }
  });
};

/**
 * Show the current Offer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var offer = req.offer ? req.offer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  offer.isCurrentUserOwner = req.user && offer.user && offer.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(offer);
};

/**
 * Update a Offer
 */
exports.update = function(req, res) {
  var offer = req.offer ;

  offer = _.extend(offer , req.body);

  offer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(offer);
    }
  });
};

/**
 * Delete an Offer
 */
exports.delete = function(req, res) {
  var offer = req.offer ;

  offer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(offer);
    }
  });
};

/**
 * List of Offers
 */
exports.list = function(req, res) { 
  Offer.find().sort('-created').populate('user', 'displayName').exec(function(err, offers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(offers);
    }
  });
};

/**
 * Offer middleware
 */
exports.offerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Offer is invalid'
    });
  }

  Offer.findById(id).populate('user', 'displayName').exec(function (err, offer) {
    if (err) {
      return next(err);
    } else if (!offer) {
      return res.status(404).send({
        message: 'No Offer with that identifier has been found'
      });
    }
    req.offer = offer;
    next();
  });
};

/**
 * Mark task as assigned
 */
exports.taskAssigned = function(req, res) {
  Task.findOneAndUpdate({
    _id: req.params.taskId
  }, {
    '$set': {
      statusAssigned: true
    }
  }, {
    new: true //to return updated document
  }).exec(function(error, task) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to mark task as complete due to invalid params!'
      });
    }
    return res.status(200).send(task);
  });
};

/**
 * Mark task as completed
 */
exports.markTaskCompleted = function(req, res) {
  Task.findOneAndUpdate({
    _id: req.params.taskId
  }, {
    '$set': {
      statusClosed: true
    }
  }, {
    new: true //to return updated document
  }).exec(function(error, task) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to mark task as complete due to invalid params!'
      });
    }
    return res.status(200).send(task);
  });
};

/**
 * Assign Offer to Task
 */
exports.assignTaskToThisUser = function(req, res) {
  Offer.findOneAndUpdate({
    _id: req.params.offerId
  }, {
    '$set': {
      offerAccepted: true
    }
  }, {
    new: true //to return updated document
  }).exec(function(error, offer) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to add offer due to invalid params!'
      });
    }
    return res.status(200).send(offer);
  });
  //     Task.findOneAndUpdate({ _id: req.params.taskId }, 
  //     {
  //       '$set': {
  //         statusAssigned: true
  //       }
  //     },
  //      {
  //       new: true //to return updated document
  //     })
  //     .exec(function(error, task) {
  //       if (error) {
  //         return res.status(400).send({ message: 'Failed to add offer due to invalid params!' });
  //       }
  //       transporter.sendMail(mailOptions, function(error, info){
  //     if(error){
  //         return console.log(error);
  //     }
  //     console.log('Message sent: ' + info.response);
  // });
  //       return res.status(200).send(task);
  //     });
};


/**
 * New User Review // this will insert into the offer owners reviews array -- woooohooo!!
 */
exports.newTaskReview = function(req, res) {
  User.findOneAndUpdate({
    _id: req.body.review.reviewFor
  }, {
    '$push': {
      reviews: req.body.review
    }
  }, {
    new: true //to return updated document
  }).exec(function(error, user) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to add review due to invalid params!'
      });
    }
    return res.status(200).send(user);
  });
};


/**
 * New User Review // this will insert into the task owners reviews array -- woooohooo!!
 */
exports.newOfferTaskReview = function(req, res) {
  User.findOneAndUpdate({
    _id: req.body.review.reviewFor
  }, {
    '$push': {
      reviews: req.body.review
    }
  }, {
    new: true //to return updated document
  }).exec(function(error, user) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to add review due to invalid params!'
      });
    }
    return res.status(200).send(user);
  });
};


/**
 * Send email alert when a new review is posted on a user from a task/offer
 */
exports.reviewAlert = function(req, res) {
  var data = req.body;
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: data.emailFrom,
    to: data.emailTo,
    subject: 'New review from ' + data.contactName + ' on your profile',
    text: data.contactMessage,
    html: data.contactMessage // html body
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
 * Send email alert when a new review is posted on a user from a task/offer
 */
exports.taskOwnerReviewAlert = function(req, res) {
  var data = req.body;
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: data.emailFrom,
    to: data.emailTo,
    subject: 'New review from ' + data.contactName + ' on your profile',
    text: data.contactMessage,
    html: data.contactMessage // html body
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
 * Send email alert to offer owner to leave a review about the task owner
 */
exports.leaveAReviewAlert = function(req, res) {
  var data = req.body;
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: data.emailFrom,
    to: data.emailTo,
    subject: data.subject,
    html: '<div class="panel" style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05); box-shadow: 0 1px 1px rgba(0,0,0,.05);"><div class="panel-header" style="padding: 10px 15px; border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px;background-color:#0086fe;color:white;"><img alt="Taskmatch" src="http://taskmatch.ie/modules/core/client/img/new1.png" style="margin-top:10px;height:30px;width:130px;left:30px;background-color:white;padding:5px;border-radius:5px;"><h4 style="font-size:12px;top:20px;text-align:right;padding:0px;margin-top:-18px;color:white;"><a style="color:white;" href="http://taskmatch.ie/settings/dashboard">My Profile</a></h4>\n</div> <div class="panel-body" style="color:#696969;text-align:center; padding: 15px;"> <h4 style="font-size:24px;"><b>Hello, <strong>' +      data.contactName + '!</h4></strong>\n<p>' + data.taskOwner +
      ' has marked your offer on their task: \n <blockquote style="    padding: 10px 20px;margin: 0 0 20px;font-size: 17.5px;border-left: 5px solid #eee;">' +
      data.taskName +
      '</blockquote><br> as completed! \n<a href="http://www.taskmatch.ie/tasks/' +
      data.taskId + '">' + data.taskName +
      '</a></p> \n <a href="http://www.taskmatch.ie/offers/' + data.offerId +
      '/review"><button style="background-color:#e40051;color:white;font-size:12px;text-transform:uppercase;padding: 8px;border-radius: 6px;">Leave them a review now</button></a> </div> \n <div class="panel-footer" style="padding: 10px 15px; border-top: 1px solid #ddd; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;height:auto;background-color:#0086fe;color:white;"><a href="https://twitter.com/Task_Match"><img style="height:2em;width:2em;float:right;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677290_twitter_circle_gray.png"></a><a href="https://www.facebook.com/TaskMatch-1528535830788580/info/?tab=page_info&edited=category"><img style="float:right;height:2em;width:2em;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677257_facebook_circle_gray.png"/></a><h4 class="main-info" style="text-align:center;font-size:13px;color:white;">Remember - It\'s free to post, with no obligation to hire </h4></div></div>'
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
 * Send email alert when a new review is posted on a user from a task/offer
 */
exports.offerAccepted = function(req, res) {
  var data = req.body;
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: data.emailFrom,
    to: data.emailTo,
    subject: data.subject,
    html: '<div class="panel" style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05); box-shadow: 0 1px 1px rgba(0,0,0,.05);"><div class="panel-header" style="padding: 10px 15px; border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px;background-color:#0086fe;color:white;"><img alt="Taskmatch" src="http://taskmatch.ie/modules/core/client/img/new1.png" style="margin-top:10px;height:30px;width:130px;left:30px;background-color:white;padding:5px;border-radius:5px;"><h4 style="font-size:12px;top:20px;text-align:right;padding:0px;margin-top:-18px;color:white;"><a style="color:white;" href="http://taskmatch.ie/settings/dashboard">My Profile</a></h4>\n</div> <div class="panel-body" style="color:#696969;text-align:center; padding: 15px;"> <h4 style="font-size:24px;"><b>Hello, <strong>' +      data.offerOwner + '!</h4></strong>\n<p>' + data.taskOwner +
      ' has accepted your offer: \n <blockquote style="    padding: 10px 20px;margin: 0 0 20px;font-size: 17.5px;border-left: 5px solid #eee;">' +
      data.offerDesc +
      '</blockquote> on their task \n<a href="http://www.taskmatch.ie/tasks/' +
      data.taskId + '">' + data.taskName +
      '</a></p> \n <a href="http://www.taskmatch.ie/offers/' + data.offerId +
      '/accepted"><button style="background-color:#e40051;color:white;font-size:12px;text-transform:uppercase;padding: 8px;border-radius: 6px;">Take a look</button></a> </div> \n <div class="panel-footer" style="padding: 10px 15px; border-top: 1px solid #ddd; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;height:auto;background-color:#0086fe;color:white;"><a href="https://twitter.com/Task_Match"><img style="height:2em;width:2em;float:right;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677290_twitter_circle_gray.png"></a><a href="https://www.facebook.com/TaskMatch-1528535830788580/info/?tab=page_info&edited=category"><img style="float:right;height:2em;width:2em;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677257_facebook_circle_gray.png"/></a><h4 class="main-info" style="text-align:center;font-size:13px;color:white;">Remember - It\'s free to post, with no obligation to hire </h4></div></div>'
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
 * Payment success email function
 **/
exports.paymentSuccess = function(req, res) {
  var data = req.body;
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: data.emailFrom,
    to: data.emailTo,
    subject: data.subject,
    html: '<div class="panel" style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05); box-shadow: 0 1px 1px rgba(0,0,0,.05);"><div class="panel-header" style="padding: 10px 15px; border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px;background-color:#0086fe;color:white;"><img alt="logo" src="http://taskmatch.ie/modules/core/client/img/taskmatch.png" style="margin-top:10px;height:30px;width:130px;left:30px;"><h4 style="font-size:12px;text-align: right;padding: 0px;margin-top: -18px;color: white;"><a style="color:white;" href="http://taskmatch.ie/settings/dashboard">My Profile</a></h4>\n</div> <div class="panel-body" style="color:#696969;text-align:center; padding: 15px;"> <h4 style="font-size:24px;"><b>Hello, <strong>' +
      data.taskOwner +
      '!</h4></strong>\n<p> You have successfully accepted and paid for' +
      data.offerOwner +
      '\'s offer: \n <blockquote style="    padding: 10px 20px;margin: 0 0 20px;font-size: 17.5px;border-left: 5px solid #eee;">' +
      data.offerDesc +
      '</blockquote> on your task \n<a href="http://www.taskmatch.ie/tasks/' +
      data.taskId + '">' + data.taskName +
      '</a></p> \n <a href="http://www.taskmatch.ie/offers/' + data.offerId +
      '/accepted"><button style="background-color:#e40051;color:white;font-size:12px;text-transform:uppercase;padding: 8px;border-radius: 6px;">Take a look</button></a> </div> \n <div class="panel-footer" style="padding: 10px 15px; border-top: 1px solid #ddd; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;height:auto;background-color:#0086fe;color:white;"><a href="https://twitter.com/Task_Match"><img style="height:2em;width:2em;float:right;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677290_twitter_circle_gray.png"></a><a href="https://www.facebook.com/TaskMatch-1528535830788580/info/?tab=page_info&edited=category"><img style="float:right;height:2em;width:2em;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677257_facebook_circle_gray.png"/></a><h4 class="main-info" style="text-align:center;font-size:13px;color:white;">Remember - It\'s free to post, with no obligation to hire </h4></div></div>'
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
 * Post a new charge
 */
exports.newCharge = function(req, res) {
  var data = req.body;

  var totalAmount = data.totalAmount;
  var customerId = data.customerId;


  stripe.customers.retrieve(customerId, function(err, customer) {
    //      var customer = customer;
  }).then(function(customer) {
    return stripe.charges.create({
      amount: totalAmount * 100, // amount in cents, again
      currency: 'eur',
      customer: customer.id
    }).then(function(err, charge) {
      // if (err) {
      //   return res.status(400).send({
      //     message: 'Failed to create customer charge due to invalid params!'
      //   });
      // }
      return res.status(200).send(charge);
      // res(charge);
    });
  });

};


/**
 * Mark task as paid for
 */
exports.taskPaid = function(req, res) {
  Task.findOneAndUpdate({
    _id: req.params.taskId
  }, {
    '$set': {
      statusPaid: true
    }
  }, {
    new: true //to return updated document
  }).exec(function(error, task) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to mark task as complete due to invalid params!'
      });
    }
    return res.status(200).send(task);
  });
};


/**
 * Mark offer as paid for
 */
exports.offerPaid = function(req, res) {
  Offer.findOneAndUpdate({
    _id: req.params.offerId
  }, {
    '$set': {
      statusPaid: true
    }
  }, {
    new: true //to return updated document
  }).exec(function(error, offer) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to add comment due to invalid params!'
      });
    }
    return res.status(200).send(offer);
  });
};


/**
 * Add a new comment
 */
exports.newCo = function(req, res) {
  Offer.findOneAndUpdate({
    _id: req.params.offerId
  }, {
    '$push': {
      comments: req.body.comment
    }
  }, {
    new: true //to return updated document
  }).exec(function(error, offer) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to add comment due to invalid params!'
      });
    }
    return res.status(200).send(offer);
  });
};
/**
 * Send email alert when a comment is posted on a task
 */
exports.commentAlert = function(req, res) {
  var data = req.body;
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: data.emailFrom,
    to: data.emailTo,
    subject: 'New comment from ' + data.contactName +
      ' on the assigned task ' + data.taskName,
    //    text: data.contactMessage,
    html: '<div class="panel" style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05); box-shadow: 0 1px 1px rgba(0,0,0,.05);"><div class="panel-header" style="padding: 10px 15px; border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px;background-color:#0086fe;color:white;"><img alt="Taskmatch" src="http://taskmatch.ie/modules/core/client/img/new1.png" style="margin-top:10px;height:30px;width:130px;left:30px;background-color:white;padding:5px;border-radius:5px;"><h4 style="font-size:12px;top:20px;text-align:right;padding:0px;margin-top:-18px;color:white;"><a style="color:white;" href="http://taskmatch.ie/settings/dashboard">My Profile</a></h4>\n</div> <div class="panel-body" style="color:#696969;text-align:center; padding: 15px;"> <h4 style="font-size:24px;"><b>Hello, <strong>' +      data.messageTo + '!</h4></strong>\n<p>' + data.commentOwner +
      ' has left the following comment: \n <blockquote style="    padding: 10px 20px;margin: 0 0 20px;font-size: 17.5px;border-left: 5px solid #eee;">' +
      data.comment +
      '</blockquote> on your task \n<a href="http://www.taskmatch.ie/tasks/' +
      data.taskId + '">' + data.taskName +
      '</a></p> \n <a href="http://www.taskmatch.ie/offers/' + data.offerId +
      '/accepted"><button style="background-color:#e40051;color:white;font-size:12px;text-transform:uppercase;padding: 8px;border-radius: 6px;">Take a look</button></a> </div> \n <div class="panel-footer" style="padding: 10px 15px; border-top: 1px solid #ddd; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;height:auto;background-color:#0086fe;color:white;"><a href="https://twitter.com/Task_Match"><img style="height:2em;width:2em;float:right;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677290_twitter_circle_gray.png"></a><a href="https://www.facebook.com/TaskMatch-1528535830788580/info/?tab=page_info&edited=category"><img style="float:right;height:2em;width:2em;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677257_facebook_circle_gray.png"/></a><h4 class="main-info" style="text-align:center;font-size:13px;color:white;">Remember - It\'s free to post, with no obligation to hire </h4></div></div>'
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
  res.json(data);
};
