'use strict';
module.exports = function(app) {
  // Root routing
  var core = require('../controllers/core.server.controller');
  // Define error pages
  app.route('/server-error').get(core.renderServerError);
  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);
  // Define application route
  app.route('/*').get(core.renderIndex);
  // Contact us page mailer
  app.route('/contact-form').post(core.sendMail);
  /**
   * Enable CORS (http://enable-cors.org/server_expressjs.html)
   * to allow different clients to request data from your server
   */
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
};