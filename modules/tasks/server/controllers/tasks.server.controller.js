'use strict';
var moment = require('moment-timezone');
moment().tz("Europe/London").format();

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(
  'smtps://contact@taskmatch.ie:nERehasTU3rA+h@smtp.gmail.com');
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  Offer = mongoose.model('Offer'),
  errorHandler = require(path.resolve(
    './modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
//var nodemailer = require('nodemailer');
//var transporter = nodemailer.createTransporter();
/**
 * Create a Task
 */
exports.create = function(req, res) {
  var task = new Task(req.body);
  task.user = req.user;
  task.about = req.user.about;
  task.email = req.user.email;
  task.additionalProvidersData = req.user.additionalProvidersData;
  task.provider = req.user.provider;
  task.providerData = req.user.providerData;
  task.profileImageURL = req.user.profileImageURL;
  task.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(task);
    }
  });
};
/**
 * Show the current Task
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var task = req.task ? req.task.toJSON() : {};
  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  task.isCurrentUserOwner = req.user && task.user && task.user._id.toString() ===
    req.user._id.toString() ? true : false;
  res.jsonp(task);
};
/**
 * Update a Task
 */
exports.update = function(req, res) {
  var task = req.task;
  task = _.extend(task, req.body);
  task.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(task);
    }
  });
};
/**
 * Delete a Task
 */
exports.delete = function(req, res) {
  var task = req.task;
  task.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(task);
    }
  });
};
/**
 * List of Tasks
 */
exports.list = function(req, res) {
  Task.find().sort('-created').populate('user', 'displayName').exec(function(
    err, tasks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tasks);
    }
  });
};
/**
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Task is invalid'
    });
  }
  Task.findById(id).populate('user', 'displayName').exec(function(err, task) {
    if (err) {
      return next(err);
    } else if (!task) {
      return res.status(404).send({
        message: 'No Task with that identifier has been found'
      });
    }
    req.task = task;
    next();
  });
};
/**
 * Add a new comment
 */
exports.newCo = function(req, res) {
  Task.findOneAndUpdate({
    _id: req.params.taskId
  }, {
    '$push': {
      comments: req.body.comment
    }
  }, {
    new: true //to return updated document
  }).exec(function(error, task) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to add comment due to invalid params!'
      });
    }
    return res.status(200).send(task);
  });
};

/**
 * Hide a comment
 */
exports.removeComment = function(req, res) {
  var data = req.body;
  Task.update({_id: req.params.taskId }, {
    '$pull': { 'comments': { _id: data.commentID } }
  }, {
    new: true //to return updated document
  }).exec(function(error, task) {
    if (error) {
      return res.status(400).send({
        message: 'Failed to add comment due to invalid params!'
      });
    }
    return res.status(200).send(task);
  });
};


/**
 * Add a new offer
 */
// exports.newOffer = function(req, res) {
//   Offer.findOneAndUpdate({
//     _id: req.params.OfferId
//   }, {
//     '$push': {
//       offers: req.body.offer
//     }
//   }, {
//     new: true //to return updated document
//   }).exec(function(error, offer) {
//     if (error) {
//       return res.status(400).send({
//         message: 'Failed to add offer due to invalid params!'
//       });
//     }
//     return res.status(200).send(offer);
//   });
// };
/**
 * Send email alert when a comment is posted on a task
 */
exports.commentAlert = function(req, res) {
  var data = req.body;
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: data.emailFrom,
    to: data.emailTo,
    subject: 'New comment from ' + data.contactName + ' on your task ' +
      data.taskName,
    //    text: data.contactMessage,
    html: '<div class="panel" style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05); box-shadow: 0 1px 1px rgba(0,0,0,.05);"><div class="panel-header" style="padding: 10px 15px; border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px;background-color:#0086fe;color:white;"><img alt="Taskmatch" src="http://taskmatch.ie/modules/core/client/img/new1.png" style="margin-top:10px;height:30px;width:130px;left:30px;background-color:white;padding:5px;border-radius:5px;"><h4 style="font-size:12px;top:20px;text-align:right;padding:0px;margin-top:-18px;color:white;"><a style="color:white;" href="http://taskmatch.ie/settings/dashboard">My Profile</a></h4>\n</div> <div class="panel-body" style="color:#696969;text-align:center; padding: 15px;"> <h4 style="font-size:24px;"><b>Hello, <strong>' +
      data.taskOwner + '!</h4></strong>\n<p>' + data.commentOwner +
      ' has left the following comment: \n <blockquote style="    padding: 10px 20px;margin: 0 0 20px;font-size: 17.5px;border-left: 5px solid #eee;">' +
      data.comment +
      '</blockquote> on your task \n<a href="http://www.taskmatch.ie/tasks/' +
      data.taskId + '">' + data.taskName +
      '</a></p> \n <a href="http://www.taskmatch.ie/tasks/' + data.taskId +
      '"><button style="background-color:#e40051;color:white;font-size:12px;text-transform:uppercase;padding: 8px;border-radius: 6px;">Take a look</button></a> </div> \n <div class="panel-footer" style="padding: 10px 15px; border-top: 1px solid #ddd; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;height:auto;background-color:#0086fe;color:white;"><a href="https://twitter.com/Task_Match"><img style="height:2em;width:2em;float:right;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677290_twitter_circle_gray.png"></a><a href="https://www.facebook.com/TaskMatch-1528535830788580/info/?tab=page_info&edited=category"><img style="float:right;height:2em;width:2em;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677257_facebook_circle_gray.png"/></a><h4 class="main-info" style="text-align:center;font-size:13px;color:white;">Remember - It\'s free to post, with no obligation to hire </h4></div></div>'
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
 * Send email alert when a offer is posted on a task
 */
exports.offerAlert = function(req, res) {
  var data = req.body;
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: data.emailFrom,
    to: data.emailTo,
    subject: 'New offer from ' + data.contactName + ' on your task ' + data
      .taskName,
    html: '<div class="panel" style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05); box-shadow: 0 1px 1px rgba(0,0,0,.05);"><div class="panel-header" style="padding: 10px 15px; border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px;background-color:#0086fe;color:white;"><img alt="Taskmatch" src="http://taskmatch.ie/modules/core/client/img/new1.png" style="margin-top:10px;height:30px;width:130px;left:30px;background-color:white;padding:5px;border-radius:5px;"><h4 style="font-size:12px;top:20px;text-align:right;padding:0px;margin-top:-18px;color:white;"><a style="color:white;" href="http://taskmatch.ie/settings/dashboard">My Profile</a></h4>\n</div> <div class="panel-body" style="color:#696969;text-align:center; padding: 15px;"> <h4 style="font-size:24px;"><b>Hello, <strong>' +
      data.taskOwner + '!</h4></strong>\n<p>' + data.offerOwner +
      ' has left the following offer: \n <blockquote style="    padding: 10px 20px;margin: 0 0 20px;font-size: 17.5px;border-left: 5px solid #eee;">' +
      data.offerDesc +
      '</blockquote> on your task \n<a href="http://www.taskmatch.ie/tasks/' +
      data.taskId + '">' + data.taskName +
      '</a></p> \n <a href="http://www.taskmatch.ie/tasks/' + data.taskId +
      '"><button style="background-color:#e40051;color:white;font-size:12px;text-transform:uppercase;padding: 8px;border-radius: 6px;">Take a look</button></a> </div> \n <div class="panel-footer" style="padding: 10px 15px; border-top: 1px solid #ddd; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;height:auto;background-color:#0086fe;color:white;"><a href="https://twitter.com/Task_Match"><img style="height:2em;width:2em;float:right;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677290_twitter_circle_gray.png"></a><a href="https://www.facebook.com/TaskMatch-1528535830788580/info/?tab=page_info&edited=category"><img style="float:right;height:2em;width:2em;" src="http://taskmatch.ie/modules/users/client/img/profile/1460677257_facebook_circle_gray.png"/></a><h4 class="main-info" style="text-align:center;font-size:13px;color:white;">Remember - It\'s free to post, with no obligation to hire </h4></div></div>'
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
  res.json(data);
};
