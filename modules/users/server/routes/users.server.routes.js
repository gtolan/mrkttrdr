'use strict';

var stripe = require('stripe')('sk_live_eWEKYPHu3hXm7TVWOJo4LKJF');

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');
  var offers = require('../controllers/offers.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/users/cover-picture').post(users.changeCoverPicture);
  app.route('/api/users/:userId').post(offers.newTaskReview); //leave a review in the user object
  app.route('/api/users/:userById/create-new-customer').post(users.createNewCustomer);
  app.route('/api/users/:userById/receive-payments').post(users.updateReceivePayment);
  app.route('/api/users/:userById/customer-charges').post(users.customerCharges);
  app.route('/api/users/:userById/customer-details').post(users.customerDetails);
  app.route('/api/users/:userById/request-quote-alert').post(users.requestAQuoteAlert);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
