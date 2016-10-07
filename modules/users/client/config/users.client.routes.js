'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('profile', {
        url: '/:userId',
        templateUrl: 'modules/users/client/views/public-profile/profile.client.view.html'
      })
      .state('myTasks', {
        url: '/:userId/my-tasks',
        templateUrl: 'modules/users/client/views/public-profile/user-tasks.client.view.html',
        controller: 'userTasksController',
        controllerAs: 'vm',
        params: {
          //          myFilter: null - this wasn't loading all the tasks on load
          myFilter: {
            statusOpen: true
          }
          //            selectedCat: null
        }
      })
      .state('settings.dashboard', {
        url: '/dashboard',
        templateUrl: 'modules/users/client/views/settings/dashboard.client.view.html'
      })
      .state('settings.tasks', {
        url: '/my-tasks',
        templateUrl: 'modules/users/client/views/public-profile/user-tasks.client.view.html',
        controller: 'userTasksController',
        controllerAs: 'vm',
        params: {
          //          myFilter: null - this wasn't loading all the tasks on load
          myFilter: {
            statusOpen: true
          }
          //            selectedCat: null
        }
      })
      .state('settings.reviews', {
        url: '/my-reviews',
        templateUrl: 'modules/users/client/views/settings/reviews.client.view.html',
        controller: 'UserReviewsCtrl'
      })
      .state('settings.messages', {
        url: '/messages',
        templateUrl: 'modules/users/client/views/settings/messages.client.view.html',
        controller: 'messagesController'
      })
      .state('settings.notifications', {
        url: '/notifications',
        templateUrl: 'modules/users/client/views/settings/notifications.client.view.html',
        controller: 'notificationsController'
      })
      .state('settings.alerts', {
        url: '/alerts',
        templateUrl: 'modules/users/client/views/settings/alerts.client.view.html',
        controller: 'alertsController',
        controllerAs: 'vm',
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.payments', {
        url: '/payments',
        templateUrl: 'modules/users/client/views/settings/edit-payment-details.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);