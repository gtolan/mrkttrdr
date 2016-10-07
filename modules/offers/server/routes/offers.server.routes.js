'use strict';

/**
 * Module dependencies
 */

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(
  'smtps://contact@taskmatch.ie:nERehasTU3rA+h@smtp.gmail.com');
var stripe = require('stripe')('sk_live_eWEKYPHu3hXm7TVWOJo4LKJF');
// var stripe = require('stripe')('sk_test_nsKqoS2c3q7o39WfyfGfArWW'); 

var offersPolicy = require('../policies/offers.server.policy'),
  offers = require('../controllers/offers.server.controller');

module.exports = function(app) {
  //Payment success
  app.route('/payment-success').post(offers.paymentSuccess);

  // Offers Routes
  app.route('/api/offers').all(offersPolicy.isAllowed)
    .get(offers.list)
    .post(offers.create);

  app.route('/api/offers/:offerId').all(offersPolicy.isAllowed)
    .get(offers.read)
    .put(offers.update)
    .delete(offers.delete)
    .post(offers.assignTaskToThisUser);

  // //Offer alerts
  app.route('/api/offers/:offerId/new-comment').all(offersPolicy.isAllowed).post(offers.newCo);
  app.route('/api/offers/:offerId/status-paid').put(offers.offerPaid);
  app.route('/api/offers/:offerId/comment-alert').all(offersPolicy.isAllowed).post(offers.commentAlert);
  // app.route('/api/users/:userId').post(offers.newTaskReview); -- this is the cause of the upload image problem
  app.route('/api/offers/:offerId/review-alert').post(offers.reviewAlert);
  //send reminder to leave a review to user from offer owner to task owner
  app.route('/api/offers/:offerId/taskOwner-review-alert').post(offers.taskOwnerReviewAlert);
  // //send review alert to user 
  app.route('/api/offers/:offerId/leave-a-new-review-alert').post(offers.leaveAReviewAlert);
  app.route('/api/offers/:offerId/taskowner-review-completed').post(offers.markTaskOwnerReviewCompleted);
  // //new charge with stripe API
  app.route('/api/offers/:offerId/new-charge').post(offers.newCharge);
  // //mark offer as accepted
  app.route('/api/offers/:offerId/offer-accepted').all(offersPolicy.isAllowed)
    .post(offers.offerAccepted);

  // Finish by binding the Offer middleware
  app.param('offerId', offers.offerByID);
};
