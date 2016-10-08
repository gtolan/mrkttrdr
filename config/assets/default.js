'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'http://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css',
        'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css',
        'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,300',
 'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css',
        'public/lib/angular-material/angular-material.min.css',
        'http://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/3.1.1/ng-tags-input.min.css'
          
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.min.js',
        'http://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js',
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-114/svg-assets-cache.js',
        'public/lib/angular-scroll-animate/dist/angular-scroll-animate.js',
        'public/lib/ngmap/build/scripts/ng-map.min.js',
        'public/lib/angular-payments/lib/angular-payments.min.js',
        // 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment-with-locales.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/3.1.1/ng-tags-input.min.js',          
        'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js',
        'public/lib/angular-material/angular-material.js',
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCDH-3Phrzi_Fogc5ku3AEslD8ShJfeIig&libraries=places,visualization,drawing,geometry',
        'https://js.stripe.com/v2/',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js',
        'public/lib/angular-counter-master/js/angular-counter.js',
        'public/lib/angular-counter-master/js/jquery.easing.min.js',
        'public/lib/angular-counter-master/js/angular-counter-with-easing.min.js',
        'public/lib/angular-counter-master/js/*.js',
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.bundle.js',
        'public/lib/angular-chart.js/angular-chart.min.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
