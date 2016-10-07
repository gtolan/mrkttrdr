'use strict';

/**
 * Module dependencies
 */
var tasksPolicy = require('../policies/tasks.server.policy'),
  tasks = require('../controllers/tasks.server.controller');
// var offers = require('../offers/server/controllers/offers.server.controller');
// offers = require('../controllers/tasks.server.controller');
var offers = require('../controllers/offers.server.controller');

module.exports = function(app) {
  // Tasks Routes
  app.route('/api/tasks').all(tasksPolicy.isAllowed)
    .get(tasks.list)
    .post(tasks.create);

  app.route('/api/tasks/:taskId').all(tasksPolicy.isAllowed)
    .get(tasks.read)
    .put(tasks.update)
    .delete(tasks.delete)
    .post(tasks.newCo);

  app.route('/api/tasks/:taskId/status-paid').post(offers.taskPaid);
  
  app.route('/api/tasks/:taskId/status').all(tasksPolicy.isAllowed).post(
    offers.markTaskCompleted).put(offers.taskAssigned);  

  app.route('/api/tasks/:taskId/comment-alert').all(tasksPolicy.isAllowed)
      .post(tasks.commentAlert);
  app.route('/api/tasks/:taskId/delete-comment').all(tasksPolicy.isAllowed)
      .post(tasks.removeComment);    
    
  app.route('/api/tasks/:taskId/offer-alert').all(tasksPolicy.isAllowed)
      .post(tasks.offerAlert);    

  // Finish by binding the Task middleware
  app.param('taskId', tasks.taskByID);
};
