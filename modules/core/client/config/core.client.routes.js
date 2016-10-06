'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home2.client.view.html'
    })
    .state('home2', {
      url: '/home2',
      templateUrl: 'modules/core/client/views/home2.client.view.html'
    })
    .state('findOutMore', {
      url: '/find-out-more',
      templateUrl: 'modules/core/client/views/TaskCategories.client.view.html'
    })
    .state('about', {
      url: '/about-us',
      templateUrl: 'modules/core/client/views/aboutUs.client.view.html'
    })
    .state('contact', {
      url: '/contact-us',
      templateUrl: 'modules/core/client/views/contactUs.client.view.html'
    })
    .state('newUser', {
      url: '/new-user-faq',
      templateUrl: 'modules/core/client/views/newUserFaq.client.view.html'
    })
    .state('priceGuide', {
      url: '/price-guide',
      templateUrl: 'modules/core/client/views/PriceGuide.client.view.html'
    })
    .state('marketplace', {
      url: '/marketplace-rules',
      templateUrl: 'modules/core/client/views/MarketPlaceRules.client.view.html'
    })
    .state('howsWorking', {
      url: '/how-it-works',
      templateUrl: 'modules/core/client/views/howsWorking.client.view.html'
    })
    .state('taskCategories', {
      url: '/task-categories',
      templateUrl: 'modules/core/client/views/TaskCategories.client.view.html'
    })
    .state('earnWithUs', {
      url: '/earn-with-us',
      templateUrl: 'modules/core/client/views/earn-about.client.view.html'
    })
    .state('investors', {
      url: '/investors',
      templateUrl: 'modules/core/client/views/investors.client.view.html'
    })
    .state('post', {
      url: '/posting-a-task',
      templateUrl: 'modules/core/client/views/posting.client.view.html'
    })
    .state('terms', {
      url: '/terms-conditions',
      templateUrl: 'modules/core/client/views/Terms.client.view.html'
    })
    .state('privacy', {
      url: '/privacy-policy',
      templateUrl: 'modules/core/client/views/Privacy.client.view.html'
    })
    .state('faqs', {
      url: '/faqs',
      templateUrl: 'modules/core/client/views/LearnMore.client.view.html'
    })
    .state('support', {
      url: '/support',
      templateUrl: 'modules/core/client/views/support.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    // .state('forbidden', {
    //   url: '/forbidden',
    //   templateUrl: 'modules/core/client/views/403.client.view.html',
    //   data: {
    //     ignoreState: true
    //   }
    // })
    .state('forbidden', {
      url: '/',
      onEnter: function($modal){
        $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalLoginCtrl',   
          data: {
            ignoreState: true
          }
        });
      }
    });
  }
]);
