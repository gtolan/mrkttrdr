'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ngMap', 'ngMaterial', 'angularPayments', 'ngTagsInput', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'angular-scroll-animate', 'counter', 'chart.js'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
  'use strict';

  app.registerModule('offers');
})(ApplicationConfiguration);

(function (app) {
  'use strict';

  app.registerModule('tasks');
})(ApplicationConfiguration);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

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
      onEnter: ["$modal", function($modal){
        $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalLoginCtrl',   
          data: {
            ignoreState: true
          }
        });
      }]
    });
  }
]);

'use strict';
angular.module('core').controller('AccordionValuesCtrl', ['$scope',
  function($scope) {
    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
  }
]);
'use strict';
angular.module('core').controller('FAQCollapseCtrl', ['$scope',
  function($scope) {
    $scope.PostingCollapsed = true;
    $scope.completingCollapsed = true;
  }
]);
'use strict';
angular.module('core').controller('ContactFormController', ['$scope',
  '$mdToast', '$animate', '$document', '$http',
  function($scope, $mdToast, $document, $animate, $http) {
    $scope.toastPosition = {
      bottom: true,
      top: false,
      left: false,
      right: true
    };
    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition).filter(function(pos) {
        return $scope.toastPosition[pos];
      }).join(' ');
    };
    this.sendMail = function() {
      var data = ({
        contactName: this.contactName,
        contactEmail: this.contactEmail,
        contactMessage: this.contactMessage
      });
      $http.post('/contact-form', data).success(function(data, status,
        headers, config) {
        $mdToast.show($mdToast.simple().content(
          'Thanks for your message ' + data.contactName).position(
          $scope.getToastPosition()).hideDelay(5000));
      }).error(function(data, status, headers, config) {});
    };
  }
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    var loginOrTask = function() {
      if($scope.authentication.user) {
        console.log('logged in');
      }
      else if (!$scope.authentication.user) {
        console.log('not logged in');
      }
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';
angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  '$location', '$anchorScroll',
  function($scope, Authentication, $location, $anchorScroll) {
    // This provides Authentication context.
    DialogController.$inject = ["$scope", "$mdDialog"];
    $scope.authentication = Authentication;
      $scope.footerCollapsedRowOne = true;
      $scope.footerCollapsedRowTwo = true;
      $scope.footerCollapsedRowThree = true;
      $scope.footerCollapsedRowFour = true;
      
    $scope.source =  '../modules/core/client/img/BGdark.png';
    /* New User FAQ End */
    $scope.gotoTasks = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('tasksAnchor');
      // call $anchorScroll()
      $anchorScroll();
    };
    /*PriceGuidePage*/
    $scope.gotoTopPriceGuide = function() {
      $location.hash('TopPriceGuideAnchor');
      $anchorScroll();
    };
    $scope.gotoHandy = function() {
      $location.hash('HandyAnchor');
      $anchorScroll();
    };
    $scope.gotoDelivery = function() {
      $location.hash('DeliveryAnchor');
      $anchorScroll();
    };
    $scope.gotoCleaning = function() {
      $location.hash('CleaningAnchor');
      $anchorScroll();
    };
    $scope.gotoGardening = function() {
      $location.hash('GardeningAnchor');
      $anchorScroll();
    };
    $scope.gotoDesign = function() {
      $location.hash('DesignAnchor');
      $anchorScroll();
    };
    $scope.gotoOffice = function() {
      $location.hash('OfficeAnchor');
      $anchorScroll();
    };
    $scope.gotoComputer = function() {
      $location.hash('ComputerAnchor');
      $anchorScroll();
    };
    $scope.gotoResearch = function() {
      $location.hash('ResearchAnchor');
      $anchorScroll();
    };
    $scope.gotoPromo = function() {
      $location.hash('PromoAnchor');
      $anchorScroll();
    };
    $scope.gotoFurniture = function() {
      $location.hash('FurnitureAnchor');
      $anchorScroll();
    };
    /*PriceGuidePage End*/
    /* New User FAQ*/
    $scope.gotoWhatisTaskM = function() {
      $location.hash('WhatisTaskMAnchor');
      $anchorScroll();
    };
    $scope.gotoWhatTaskCan = function() {
      $location.hash('WhatTaskCanAnchor');
      $anchorScroll();
    };
    $scope.gotoHowCanComplete = function() {
      $location.hash('HowCanCompleteAnchor');
      $anchorScroll();
    };
    $scope.gotoMuchCost = function() {
      $location.hash('MuchCostAnchor');
      $anchorScroll();
    };
    $scope.gotoHaveToHire = function() {
      $location.hash('HaveToHireAnchor');
      $anchorScroll();
    };
    $scope.gotoTrustQuality = function() {
      $location.hash('TrustQualityAnchor');
      $anchorScroll();
    };
    $scope.gotoChoosePerson = function() {
      $location.hash('ChoosePersonAnchor');
      $anchorScroll();
    };
    $scope.gotoKnowPay = function() {
      $location.hash('KnowPayAnchor');
      $anchorScroll();
    };
    $scope.gotoDiscussTasks = function() {
      $location.hash('DiscussTasksAnchor');
      $anchorScroll();
    };
    $scope.gotoPayOptions = function() {
      $location.hash('PayOptionsAnchor');
      $anchorScroll();
    };
    $scope.gotoWorkAndEarn = function() {
      $location.hash('WorkAndEarnAnchor');
      $anchorScroll();
    };
    $scope.gotoStartEarning = function() {
      $location.hash('StartEarningAnchor');
      $anchorScroll();
    };
    $scope.gotoRecievePayment = function() {
      $location.hash('RecievePaymentAnchor');
      $anchorScroll();
    };
    $scope.gotoNewFAQTop = function() {
      $location.hash('NewFAQTopAnchor');
      $anchorScroll();
    };
   //homepage slider
    $scope.myInterval = 10000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [{
      url1: 'link.list',
      image1: '../modules/core/client/img/carousel/antena.png',
      title1: '',
      description1: '',
      url2: 'link.list',
      image2: '../modules/core/client/img/carousel/elmundo.jpg',
      title2: '',
      description2: '',
      url3: 'link.list',
      image3: '../modules/core/client/img/carousel/elpais.png',
      title3: '',
      description3: '',
      url4: 'link.list',
      image4: '../modules/core/client/img/carousel/telecinco.jpg',
      title4: 'Marketplace',
      description4: ''
 
        
    }, {
      
      url1: 'link.list',
      image1: '../modules/core/client/img/carousel/telemadrid.png',
      title1: '',
      description1: '',
      url2: 'link.list',
      image2: '../modules/core/client/img/carousel/tv3.png',
      title2: '',
      description2: '',
      url3: 'link.list',
      image3: '../modules/core/client/img/carousel/bbc.png',
      title3: '',
      description3: '',
      url4: 'link.list',
      image4: '../modules/core/client/img/carousel/elmundo.jpg',
      title4: '',
      description4: ''
    },{
      url1: 'link.list',
      image1: '../modules/core/client/img/carousel/elpais.png',
      title1: '',
      description1: '',
      url2: 'link.list',
      image2: '../modules/core/client/img/carousel/telemadrid.png',
      title2: '',
      description2: '',
      url3: 'link.list',
      image3: '../modules/core/client/img/carousel/tv3.png',
      title3: '',
      description3: '',
      url4: 'link.list',
      image4: '../modules/core/client/img/carousel/bbc.png',
      title4: '',
      description4: ''
 
    }];
      
      
    $scope.status = '  ';
    $scope.customFullscreen = false;


    $scope.showTabDialog = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'tabDialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
            .then(function(answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });
    };

    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
      $scope.states = ('Mardid Barcelona Sevilla Malaga Valencia Bilbao Zaragoza ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });
     
      
    }
      
    /*scroll */
        $scope.getScrollOffsets = function(w) {
            // Use the specified window or the current window if no argument 
            w = w || window;
            // This works for all browsers except IE versions 8 and before
            if (w.pageXOffset !== null) {
                return {
                    x: w.pageXOffset,
                    y: w.pageYOffset
                };
            }
            // For IE (or any browser) in Standards mode
            var d = w.document;
            if (document.compatMode === 'CSS1Compat') {
                return {
                    x: d.documentElement.scrollLeft,
                    y: d.documentElement.scrollTop
                };
            }
            // For browsers in Quirks mode
            return {
                x: d.body.scrollLeft,
                y: d.body.scrollTop
            };
        };
        $scope.getPosition = function(e) {
            return {
                x: e[0].offsetLeft,
                y: e[0].offsetTop
            };
        };
        $scope.getViewPortSize = function(w) {
            return {
                x: Math.max(document.documentElement.clientWidth, w
                    .innerWidth || 0),
                y: Math.max(document.documentElement.clientHeight,
                    w.innerHeight || 0)
            };
        };
  
      
  }]).directive('aniScroll', ["$window", function($window) {
        return {
            restrict: 'A',
            controller: 'HomeController',
            transclude: true,
            replace: true,
            template: '<div ng-transclude ng-show=\'show\'></div>',
            scope: {
                show: '@',
            },
            link: function(scope, element, attrs) {

                angular.element($window).bind('scroll', function() {
                    var targetOffset = attrs.aniScroll;
                    var offset = scope.getScrollOffsets($window);
                    if (offset.y >= targetOffset) {
                        scope.show = true;
                    } else {
                        scope.show = false;
                    }
                    scope.$apply();
                });
            }
        };
    }]).directive('aniView', ["$window", function($window) {
        return {
            restrict: 'A',
            controller: 'HomeController',
            transclude: true,
            replace: true,
            template: '<div ng-transclude ng-show=\'show\'></div>',
            scope: {
                show: '@',
            },
            link: function(scope, element, attrs) {

                angular.element($window).bind('scroll', function() {
                    var position = scope.getPosition(element);
                    var offset = scope.getScrollOffsets($window);
                    var viewport = scope.getViewPortSize($window);
                    var coverage = {
                        x: parseInt(viewport.x + offset.x),
                        y: parseInt(viewport.y + offset.y)
                    };
                    if (coverage.y >= position.y && coverage.x >= position.x) {
                        scope.show = true;
                    } else {
                        scope.show = false;
                    }
                    scope.$apply();
                });
            }
        };
    }]).directive('loadedImg', function(){
        return {
            restrict: 'E',
            scope: {
                src: '='
            },
            replace: true,
            template: '<img ng-src="{{src}}" class="none realBG animated fadeIn"/>',
            link: function(scope, ele, attr){
                ele.on('load', function(){
                    ele.removeClass('none');
                });           
            }
        };
    }).directive('countUp', ['$compile',function($compile,$timeout) {
    return {
        restrict: 'E',
        replace: false,
        scope: {
            countTo: "=countTo",
            interval: '=interval'
        },
        controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
            $scope.millis =0;
            if ($element.html().trim().length === 0) {
                $element.append($compile('<span>{{millis / 1000}}</span>')($scope));
            } else {
                $element.append($compile($element.contents())($scope));
            }

            var i=0;
            function timeloop () {
                setTimeout(function () {
                    $scope.millis++;
                    $scope.$digest();
                    i++;
                    if (i<$scope.countTo) {
                        timeloop();
                    }
                }, $scope.interval)
            }
            timeloop();
        }]
    }}]);



'use strict';
angular.module('core').controller('ModalLoginCtrl', ['$scope', '$state',
  'Authentication', 'Menus', '$modal', '$log',
  function($scope, $state, Authentication, Menus, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function() {
            return $scope.items;
          }
        }
      });
      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }
]);
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
angular.module('core').controller('ModalInstanceCtrl', ["$scope", "Authentication", "$modalInstance", "items", function($scope, Authentication,
  $modalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };
  $scope.authentication = Authentication;
  $scope.ok = function() {
    $modalInstance.close($scope.selected.item);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);
'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

(function () {
  'use strict';

  angular
    .module('offers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('offers', {
        abstract: true,
        url: '/offers',
        template: '<ui-view/>'
      })
      .state('offers.list', {
        url: '',
        templateUrl: 'modules/offers/client/views/list-offers.client.view.html',
        controller: 'OffersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Offers List'
        }
      })
      .state('offers.create', {
        url: '/create',
        templateUrl: 'modules/offers/client/views/form-offer.client.view.html',
        controller: 'OffersController',
        controllerAs: 'vm',
        resolve: {
          offerResolve: newOffer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Offers Create'
        }
      })
      .state('offers.edit', {
        url: '/:offerId/edit',
        templateUrl: 'modules/offers/client/views/form-offer.client.view.html',
        controller: 'OffersController',
        controllerAs: 'vm',
        resolve: {
          offerResolve: getOffer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Offer {{ offerResolve.name }}'
        }
      })
      .state('offers.view', {
        url: '/:offerId',
        templateUrl: 'modules/offers/client/views/view-offer.client.view.html',
        controller: 'OffersController',
        controllerAs: 'vm',
        resolve: {
          offerResolve: getOffer
        },
        data:{
          pageTitle: 'Offer {{ articleResolve.name }}'
        }
      })
      .state('offers.accepted', {
      url: '/:offerId/accepted',
      templateUrl: 'modules/offers/client/views/view-accepted-offer.client.view.html',
      controller: 'OffersController',
      controllerAs: 'vm',
      resolve: {
        offerResolve: getOffer
      },
      data: {
        pageTitle: 'Offer {{ articleResolve.name }}'
      }
    }).state('offers.payment', {
      url: '/:offerId/accepted/payment',
      templateUrl: 'modules/offers/client/views/accepted-offer-payment.client.view.html',
      controller: 'PaymentsController',
      controllerAs: 'vm',
      resolve: {
        offerResolve: getOffer
      },
      data: {
        pageTitle: 'Offer {{ articleResolve.name }}'
      }
    }).state('offers.review', {
      url: '/:offerId/review',
      templateUrl: 'modules/offers/client/views/leave-review-offer.client.view.html',
      controller: 'OffersController',
      controllerAs: 'vm',
      resolve: {
        offerResolve: getOffer
      }
    });
  }

  getOffer.$inject = ['$stateParams', 'OffersService'];

  function getOffer($stateParams, OffersService) {
    return OffersService.get({
      offerId: $stateParams.offerId
    }).$promise;
  }

  newOffer.$inject = ['OffersService'];

  function newOffer(OffersService) {
    return new OffersService();
  }
})();

(function () {
  'use strict';

  angular
    .module('offers')
    .controller('OffersListController', OffersListController);

  OffersListController.$inject = ['OffersService'];

  function OffersListController(OffersService) {
    var vm = this;

    vm.offers = OffersService.query();
  }
})();

(function() {
  'use strict';

  // Offers controller
  angular
    .module('offers')
    .controller('OffersController', OffersController);

  OffersController.$inject = ['$scope', '$state', '$http', 'Authentication', 'offerResolve', '$modal', '$mdToast', '$animate'];

  function OffersController($scope, $state, $http, Authentication, offer, $modal, $mdToast, $animate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.offer = offer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    $scope.totalAmount = vm.offer.offerPrice;
    // console.log($scope.totalAmount);
    // $scope.taskName = vm.offer.taskName;
    // $scope.taskRunner = vm.offer.displayName;

    $scope.isReadonly = true;
    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };

    var numberOfReviews = vm.offer.offerUserAverage.length;
    $scope.numberOfReviews = numberOfReviews;

    var total = 0;
    var one = 0;
    var two = 0;
    var three = 0;
    var four = 0;
    var five = 0;

    var offerUserAverage = vm.offer.offerUserAverage;
    // console.log(offerUserAverage);

    for (var i = 0; i < offerUserAverage.length; i++) {
      if (offerUserAverage[i].rating === 1) {
        one += +1;
      } else if (offerUserAverage[i].rating === 2) {
        two += +1;
      } else if (offerUserAverage[i].rating === 3) {
        three += +1;
      } else if (offerUserAverage[i].rating === 4) {
        four += +1;
      } else if (offerUserAverage[i].rating === 5) {
        five += +1;
      }
      total += +offerUserAverage[i].rating;
      // console.log('total is ' + total);
      // console.log(five);
    }
    var userAverage = total / numberOfReviews;
    $scope.userAverage = userAverage;
    // console.log(userAverage);

    //toast  
    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition).filter(function(pos) {
        return $scope.toastPosition[pos];
      }).join(' ');
    };
    // end of toast
    $scope.checkout = function() {
      $modal.open({
        templateUrl: 'modules/offers/client/views/checkout.client.view.html',
        controller: 'CheckoutCtrl',
        resolve: {
          totalAmount: $scope.totalAmount,
          offer: offer
        }
      });
    };

    // Remove existing Offer
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.offer.$remove($state.go('offers.list'));
      }
    }

    // Save Offer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.offerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.offer._id) {
        vm.offer.$update(successCallback, errorCallback);
      } else {
        vm.offer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('offers.view', {
          offerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    //newcomment
    vm.newCo = function() {
      //new comment email alert
      vm.commentAlert = function() {
        function errorCallback(res) {
          vm.error = res.data.message;
        }

        //if logged in user is the task owner, set data vars as follows:  
        if (vm.authentication.user._id === vm.offer.taskOwnerUser) {
          var dataTaskOwner = ({
            contactName: vm.authentication.user.displayName,
            emailFrom: 'contact@taskmatch.ie',
            emailTo: vm.offer.offerOwnerEmail,
            messageTo: vm.offer.user.displayName,
            offerTitle: vm.offer.offerDesc,
            taskName: vm.offer.taskName,
            offerId: vm.offer._id,
            //            taskId: vm.offer._id,
            //            taskOwner: vm.offer.user.displayName,
            commentOwner: vm.authentication.user.displayName,
            comment: vm.offer.newComment
          });
          $http.post('/api/offers/' + offer._id + '/comment-alert',
            dataTaskOwner).success(function(data, status, headers,
            config) {
            console.log('comment alert email has been sent');
            $mdToast.show($mdToast.simple().content('Thanks, ' +
              data.contactName +
              '! You successfully posted a comment').position(
              $scope.getToastPosition()).hideDelay(5000));
          });
          //if logged in user is the offer owner, set data vars as follows:      
        } else if (vm.authentication.user._id === vm.offer.user._id) {
          var dataOfferOwner = ({
            contactName: vm.authentication.user.displayName,
            emailFrom: 'contact@taskmatch.ie',
            emailTo: vm.offer.taskOwnerEmail,
            messageTo: vm.offer.taskOwnerDisplayName,
            offerTitle: vm.offer.offerDesc,
            taskName: vm.offer.taskName,
            //taskId: vm.offer._id,
            offerId: vm.offer._id,
            //taskOwner: vm.offer.user.displayName,
            commentOwner: vm.authentication.user.displayName,
            comment: vm.offer.newComment
          });
          $http.post('/api/offers/' + offer._id + '/comment-alert',
            dataOfferOwner).success(function(data, status, headers,
            config) {
            console.log('comment alert email has been sent');
            $mdToast.show($mdToast.simple().content('Thanks, ' +
              data.contactName +
              '! You successfully posted a comment').position(
              $scope.getToastPosition()).hideDelay(5000));
          });
        } //end elseif
      }; //end new comment alert 
      $http.post('/api/offers/' + offer._id + '/new-comment', {
        comment: {
          comment: vm.offer.newComment,
          user: vm.authentication.user,
          profileImageURL: vm.authentication.user.profileImageURL,
          displayName: vm.authentication.user.displayName
        }
      }).then(successCallback, errorCallback);

      function successCallback(res) {
        vm.commentAlert();
        $state.transitionTo($state.current, $state.params, {
          reload: true,
          inherit: false,
          notify: true
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }; //close new comment function
    // on click of 'assign button' this is will 'offerAccepted' to true
    vm.assignTaskToThisUser = function() {
      vm.taskAssigned = function() {
        $http.put('/api/tasks/' + offer.taskId + '/status', {
          statusAssigned: true
        }).then(successCallback, errorCallback);
        swal('Success!', 'You successfully accepted this offer!', 'success');

        function successCallback(res) {}

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      };
      vm.offerAccepted = function() {
        var data = ({
          contactName: vm.offer.displayName,
          emailFrom: 'contact@taskmatch.ie',
          emailTo: vm.offer.offerOwnerEmail,
          offerOwner: vm.offer.displayName,
          offerDesc: vm.offer.offerDesc,
          offerId: vm.offer._id,
          taskName: vm.offer.taskName,
          taskId: vm.offer.taskId,
          taskOwner: vm.authentication.user.displayName,
          subject: 'Your offer has been accepted on ' + vm.offer.taskName +
            ' - Get started ASAP!'
        });
        $http.post('/api/offers/' + offer._id + '/offer-accepted', data)
          .success(function(data, status, headers, config) {
            $state.transitionTo($state.current, $state.params, {
              reload: true,
              inherit: false,
              notify: true
            });
          });

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }; //end offer accepted alert 
      $http.post('/api/offers/' + offer._id, {
        offerAccepted: true
      }).then(successCallback, errorCallback);
      console.log('You successfully accepted this offer!');

      function successCallback(res) {
        vm.offerAccepted();
        vm.taskAssigned();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }; //offer accepted == true
    // on click of 'assign button' this is will 'offerAccepted' to true
    vm.markTaskCompleted = function() {

      //start of leave a new review alert -- for offer owner, to leave review about task owner 
      vm.leaveAReviewAlert = function() {
        var data = ({
          subject: vm.offer.taskOwnerDisplayName + ' marked your offer as completed! Leave them a review now!',
          contactName: vm.offer.displayName,
          taskOwner: vm.offer.taskOwnerDisplayName,
          offerId: vm.offer._id,
          taskId: vm.offer.taskId,
          offerDesc: vm.offer.offerDesc,
          taskName: vm.offer.taskName,
          emailFrom: 'contact@taskmatch.ie', //vm.authentication.user.email,
          emailTo: vm.offer.offerOwnerEmail //vm.task.email, //-- still relevant
        });
        $http.post('/api/offers/' + offer._id + '/leave-a-new-review-alert', data).success(
          function(data, status, headers, config) {
            console.log('sent');
          });

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }; //end leave a new review alert  

      $http.post('/api/tasks/' + offer.taskId + '/status', {
        statusClosed: true
      }).then(successCallback, errorCallback);
      swal('Success!', 'You successfully completed this task!', 'success');

      function successCallback(res) {
        vm.leaveAReviewAlert();
        $state.go('offers.review', {
          offerId: offer._id
        }); ///:offerId/accepted
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }; // end of mark task as completed


    // new review from the task owner to the offer owner user
    vm.newTaskReview = function() {

      //start of new review alert for the offer owner
      vm.reviewAlert = function() {
        var data = ({
          contactName: vm.authentication.user.displayName,
          emailFrom: 'contact@taskmatch.ie', //vm.authentication.user.email,
          emailTo: vm.offer.offerOwnerEmail, //vm.task.email, //-- still relevant
          contactMessage: 'Hi, ' + vm.offer.user.displayName +
            '! \n ' + vm.authentication.user.displayName +
            ' has left the following review: " ' + vm.review.comment +
            '" for your task "' + vm.offer.taskName +
            '" Login to Taskmatch.ie to view the review on your public profile. \n -- Thanks! from the Taskmatch.ie team'
        });
        $http.post('/api/offers/' + offer._id + '/review-alert', data).success(
          function(data, status, headers, config) {
            console.log('sent');
            $mdToast.show($mdToast.simple().content(
              'Thanks for your review ' + data.contactName).position(
              $scope.getToastPosition()).hideDelay(5000));
          });

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }; //end new review alert for the offer owner

      // var user = $scope.user;
      // var reviewUser = vm.offer.taskOwnerUser; - this is if you wanna post into task owner
      var reviewUser = vm.offer.user._id; //this is for the offer owner - from task owner to offer owner review
      // leave a review for the person who created the task, left by the task runner/ task completer -- left for the taskOwnerUser, by the authentication user
      $http.post('/api/users/' + reviewUser, {
        review: {
          rating: vm.review.rating,
          comment: vm.review.comment,
          reviewFor: vm.offer.user._id,
          reviewBy: vm.authentication.user,
          displayName: vm.authentication.user.displayName, //who review is by --display name
          profileImageURL: vm.authentication.user.profileImageURL,
          taskId: vm.offer.taskId,
          taskName: vm.offer.taskName,
          offerId: vm.offer._id
        }
      }).then(successCallback, errorCallback);

      function successCallback(res) {
        vm.reviewAlert();
        swal('Success!', 'You successfully left a review!', 'success');
        $state.go('profile', {
          userId: vm.offer.user._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        alert('your request did not work!' + res.data.message);
      }
    }; //end of the review from the task owner user to the offer owner user

    //new review from the offer owner to the task owner
    vm.newOfferTaskReview = function() {


      vm.markTaskOwnerReviewCompleted = function() {
        $http.post('/api/offers/' + offer._id + '/taskowner-review-completed', {
          taskOwnerReviewed: true
        }).then(successCallback, errorCallback);

      function successCallback(res) {
        console.log('You successfully completed the review for this offer!');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        console.log(vm.error);
      }
      };

      //start of new review alert 
      vm.taskOwnerReviewAlert = function() {
        var data = ({
          contactName: vm.offer.taskOwnerDisplayName,
          emailFrom: 'contact@taskmatch.ie', //vm.authentication.user.email,
          emailTo: vm.offer.taskOwnerEmail,
          contactMessage: 'Hi, ' + vm.offer.taskOwnerDisplayName +
            '! \n ' + vm.offer.user.displayName +
            ' has left the following review: " ' + vm.review.comment +
            '" for your task "' + vm.offer.taskName +
            '" Login to Taskmatch.ie to view the review on your public profile. \n -- Thanks! from the Taskmatch.ie team'
        });
        $http.post('/api/offers/' + offer._id + '/taskOwner-review-alert', data).success(
          function(data, status, headers, config) {
            console.log('sent');
            $mdToast.show($mdToast.simple().content(
              'Thanks for your review ' + data.contactName).position(
              $scope.getToastPosition()).hideDelay(5000));
          });

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }; //end new review alert  

      // var user = $scope.user;
      // var reviewUser = vm.offer.taskOwnerUser; - this is if you wanna post into task owner
      var reviewUser = vm.offer.taskOwnerUser; //this is for the task owner - from offer owner
        // leave a review for the person who created the task, left by the task runner/ task completer -- left for the taskOwnerUser, by the authentication user
      $http.post('/api/users/' + reviewUser, {
        review: {
          rating: vm.review.rating,
          comment: vm.review.comment,
          reviewFor: vm.offer.taskOwnerUser,
          reviewBy: vm.authentication.user,
          displayName: vm.authentication.user.displayName, //who the review is by - displayName
          profileImageURL: vm.authentication.user.profileImageURL,
          taskId: vm.offer.taskId,
          taskName: vm.offer.taskName,
          offerId: vm.offer._id
        }
      }).then(successCallback, errorCallback);

      function successCallback(res) {
        vm.taskOwnerReviewAlert();
        vm.markTaskOwnerReviewCompleted();
        swal('Success!', 'You successfully left a review!', 'success');
        $state.go('profile', {
          userId: vm.offer.taskOwnerUser
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        alert('your request did not work!' + res.data.message);
      }
    }; //new review from the offer owner to the task owner
  }
})();
(function() {
  'use strict';

  angular.module('offers').controller('PaymentsController',
    PaymentsController).config(["$mdThemingProvider", function($mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('blue-grey');
  }]);
  PaymentsController.$inject = ['offerResolve', '$scope', '$state',
    'Authentication', '$http', '$mdToast', '$document', '$animate',
    '$location', '$rootScope', '$modal', '$window'
  ];

  function PaymentsController(offer, $scope, $state, Authentication, $http,
    $mdToast, $document, $animate, $location, $rootScope, $modal, $window) {
    $window.Stripe.setPublishableKey('pk_live_nycjXdZVMuyCeshiayQ32Ljb');
    // $window.Stripe.setPublishableKey('pk_test_rruSvaA8uHVcF1VISPEY8xFD');
    var vm = this;
    vm.authentication = Authentication;
    vm.offer = offer;
    $scope.amount = vm.offer.offerPrice + vm.offer.offerExpenses;
    // $scope.totalAmount = vm.offer.offerPrice;
    //    $scope.taskName = vm.offer.taskName;
    //    $scope.taskRunner = vm.offer.displayName;
    $scope.owner = vm.offer.user._id;
    // $scope.offerId = vm.offer._id;
    $scope.ownerName = vm.offer.user.displayName;
  }
})();


//CheckoutCtrl
(function() {
  'use strict';
  angular.module('offers').controller('CheckoutCtrl', CheckoutCtrl).config(
    ["$mdThemingProvider", function($mdThemingProvider) {
      $mdThemingProvider.theme('default').primaryPalette('blue-grey');
    }]);
  CheckoutCtrl.$inject = ['Authentication', '$scope', 'totalAmount', 'offer',
    '$mdToast', '$document', '$animate', '$http', '$state'
  ];

  function CheckoutCtrl(Authentication, $scope, totalAmount, offer, $mdToast,
    $document, $animate, $http, $state) {

    var vm = this;
    vm.offer = offer;
    $scope.user = Authentication.user;
    $scope.totalAmount = totalAmount;

    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition).filter(function(pos) {
        return $scope.toastPosition[pos];
      }).join(' ');
    };

    $scope.processing = false;

    $scope.cancel = function() {
      $scope.$dismiss();
    };

    // start newCharge function
    $scope.newCharge = function() {

      $scope.processing = true;

      var data = ({
        contactName: this.contactName,
        customerId: $scope.user.stripeCustomerId,
        totalAmount: $scope.totalAmount
      });

      $http.post('/api/offers/' + offer._id + '/new-charge', data)
        .success(function(res, charge, data, status,
          headers, config) {
          $scope.processing = false;
          $scope.success = true;
          $scope.taskPaid();
          $scope.paymentSuccess();
          swal('Congratulations!', 'You successfully paid to have your task completed! \n You can now contact the offer user to arrange task details. \n Remember to mark the task as completed to release TaskMatch funds', 'success');
          $scope.cancel();
          $scope.taskPaid();
          $scope.offerPaid();
          $state.go('offers.accepted', {
            offerId: offer._id
          });
        }).error(function(res, charge, data, status, headers, config) {
          sweetAlert('Oops...', 'Something went wrong!', 'error');
        });
    }; //end newCharge function

    $scope.taskPaid = function() {
      $http.post('/api/tasks/' + vm.offer.taskId + '/status-paid', {
        statusPaid: true
      }).then(successCallback, errorCallback);
      // swal("Success!", "You successfully accepted this offer!", "success");
      console.log('paid');

      function successCallback(res) {}

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
    $scope.offerPaid = function() {
      $http.put('/api/offers/' + vm.offer._id + '/status-paid', {
        statusPaid: true
      }).then(successCallback, errorCallback);
      // swal("Success!", "You successfully accepted this offer!", "success");
      console.log('marked the offer as status paid');

      function successCallback(res) {}

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
    // // //start paymentSuccess
    $scope.paymentSuccess = function() {
      var data = ({
        //contactName: vm.offer.user.displayName,
        emailFrom: 'contact@taskmatch.ie',
        emailTo: vm.offer.taskOwnerEmail,
        offerOwner: vm.offer.displayName,
        offerDesc: vm.offer.offerDesc,
        offerId: vm.offer._id,
        taskName: vm.offer.taskName,
        taskId: vm.offer.taskId,
        // taskOwner: $scope.user.displayName,
        subject: 'You successfully paid for ' + vm.offer.offerDesc + ' on your task ' + vm.offer.taskName,
      });

      $http.post('/payment-success', data)
        .success(function(data, status, headers, config) {
          $mdToast.show(
            $mdToast.simple()
            .content('Thanks for your payment ' + data.taskOwner)
            .position($scope.getToastPosition())
            .hideDelay(5000)
          );
        })
        .error(function(data, status, headers, config) {

        });
    };
    // // //end paymentSuccess
    $scope.hideAlerts = function() {
      $scope.stripeError = null;
      $scope.stripeToken = null;
    };
  }
})();
//Offers service used to communicate Offers REST endpoints
(function () {
  'use strict';

  angular
    .module('offers')
    .factory('OffersService', OffersService);

  OffersService.$inject = ['$resource'];

  function OffersService($resource) {
    return $resource('api/offers/:offerId', {
      offerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('tasks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'TAREAS',
      state: 'tasks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tasks', {
      title: 'Buscar Tareas',
      state: 'tasks.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tasks', {
      title: 'Encargar Tarea',
      state: 'tasks.create',
      roles: ['user']
    });
  }
})();

(function() {
  'use strict';
  angular.module('tasks').config(routeConfig);
  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider.state('tasks', {
      abstract: true,
      url: '/tasks',
      template: '<ui-view/>'
    }).state('tasks.list', {
      url: '',
      templateUrl: 'modules/tasks/client/views/list-tasks.client.view.html',
      controller: 'TasksListController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Browse Tasks'
      },
      params: {
        //          myFilter: null - this wasn't loading all the tasks on load
        // myFilter: {
        //   statusAssigned: false
        // }
        myFilter: {
          statusOpen: true 
        }        
        //            selectedCat: null
      }
    }).state('tasks.create', {
      url: '/create',
      templateUrl: 'modules/tasks/client/views/form-task.client.view.html',
      controller: 'TasksController',
      controllerAs: 'vm',
      resolve: {
        taskResolve: newTask
      },
      data: {
        roles: ['user', 'admin'],
        pageTitle: 'Tasks Create'
      }
    }).state('tasks.edit', {
      url: '/:taskId/edit',
      templateUrl: 'modules/tasks/client/views/form-task.client.view.html',
      controller: 'TasksController',
      controllerAs: 'vm',
      resolve: {
        taskResolve: getTask
      },
      data: {
        roles: ['user', 'admin'],
        pageTitle: 'Edit Task {{ taskResolve.name }}'
      }
    }).state('tasks.view', {
      url: '/:taskId',
      templateUrl: 'modules/tasks/client/views/view-task.client.view.html',
      parent: 'tasks.list',
      controller: 'TasksController',
      controllerAs: 'vm',
      resolve: {
        taskResolve: getTask
      },
      data: {
        pageTitle: 'Task {{ articleResolve.name }}'
      }
    });
  }
  getTask.$inject = ['$stateParams', 'TasksService'];

  function getTask($stateParams, TasksService) {
    return TasksService.get({
      taskId: $stateParams.taskId
    }).$promise;
  } //end getTask 
  newTask.$inject = ['TasksService'];

  function newTask(TasksService) {
    return new TasksService();
  } //end newTask

  function getOffer($stateParams, OffersService) {
    return OffersService.get({
      offerId: $stateParams.offerId
    }).$promise;
  } //end of getOffer
  newOffer.$inject = ['OffersService']; //end of inject newOffer
  function newOffer(OffersService) {
    return new OffersService();
  } //end of newOffer  
})();
(function() {
  'use strict';

  angular
    .module('tasks')
    .controller('ModalOfferCtrl', ModalOfferCtrl);

  ModalOfferCtrl.$inject = ['$scope', '$state', 'Authentication', 'Menus', '$modal', '$log', 'OffersService'];

  function ModalOfferCtrl($scope, $state, Authentication, Menus, $modal, $log, OffersService) {

    $scope.authentication = Authentication;

    newOffer.$inject = ['OffersService'];

    function newOffer(OffersService) {
      return new OffersService();
    }
    getTask.$inject = ['$stateParams', 'TasksService'];

    function getTask($stateParams, TasksService) {
      return TasksService.get({
        taskId: $stateParams.taskId
      }).$promise;
    }
    $scope.cancel = function() {
      // $modalInstance.dismiss('cancel');
      $scope.$dismiss();
    };

    $scope.open = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'myOfferModalContent.html',
        controller: 'TasksController',
        size: size,
        controllerAs: 'vm',
        resolve: {
          taskResolve: getTask,
          // I added on 22/04/16 02:30ish..
          offerResolve: newOffer
        },
      });
      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }
})();



(function() {
  'use strict';
  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.
  angular.module('tasks').controller('ModalOfferInstanceCtrl', ["$scope", "$modalInstance", "$stateParams", "TasksService", "$http", function($scope,
    $modalInstance, $stateParams, TasksService, $http) {
    var modal = this;

    // modal.dimiss = function(reason) {
    //   $modalInstance.dismiss(reason);
    // };

    $scope.ok = function() {
      $modalInstance.close($scope.selected.item);
    };

    // $scope.cancel = function() {
    //   $modalInstance.dismiss('cancel');
    // };

  }]);

})();
(function() {
  'use strict';
  angular.module('tasks').controller('TasksListController',
    TasksListController).filter('customFilter', function() {
    return function(items, search) {
      if (!search) {
        return items;
      }
      return items.filter(function(element) {
        // Ex: moving: true, becomes just 'moving'
        //                return Object.getOwnPropertyNames(
        //                    element).find(x => x == search.substring(
        //                    0, search.indexOf(':')));
        //attempt 1      
        return Object.getOwnPropertyNames(element).find(function(x) {
          return x === search.substring(0, search.indexOf(':'));
        });
        //attempt 2 
        // return Object.getOwnPropertyNames(element).find(function(x) {
        //   return x === search.substring(0, 2);
        // });      
      });
    };
  }).filter('priceFilter', function() {
    return function(items, search) {
      if (!search) {
        return items;
      }
      return items.filter(function(element) {
        return Object.getOwnPropertyNames(element).find(function(x) {
          return x === search.substring(0,1);
        });

        });
    };
  });
  TasksListController.$inject = ['TasksService', 'OffersService',
    '$scope', '$stateParams', '$filter', '$http'
  ];

  function TasksListController(TasksService, OffersService, $scope,
    $stateParams, $filter, $http) {
    var vm = this;
    $scope.taskCategories = [{
      'cat': 'All',
      'filter': ''
    }, {
      'cat': 'Cleaning',
      'filter': 'cleaning: true'
    }, {
      'cat': 'Moving & Delivery',
      'filter': 'moving: true'
    }, {
      'cat': 'DIY',
      'filter': 'DIY: true'
    }, {
      'cat': 'Marketing & Design',
      'filter': 'marketing: true'
    }, {
      'cat': 'Digital & IT',
      'filter': 'onlineIT: true'
    }, {
      'cat': 'Events & Photography',
      'filter': 'photoEvents: true'
    }, {
      'cat': 'Business & Admin',
      'filter': 'office: true'
    }, {
      'cat': 'Fun & Quirky',
      'filter': 'funQuirky: true'
    }, {
      'cat': 'Misc & Other ',
      'filter': 'misc: true'
    }];
    vm.tasks = TasksService.query();

    var offersOnMyTasks = [];

    //get offers for taskId
    $http.get('api/offers', {}).success(function(data, status) {
      var respOffers = data;

      // for (var i = 0; i < respOffers.length; i++) {
      //   if (respOffers[i].taskOwnerUser === vm.task.user._id) {
      //     offersOnMyTasks.push(respOffers[i]);
      //   }
      // }
      // console.log(vm.tasks.offers.length);
    });
    //    vm.tasks.offers = OffersService.query();
    $scope.myFilter = $stateParams.myFilter;
    var orderBy = $filter('orderBy');
    $scope.predicate = 'created';
    $scope.reverse = true;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse :
        false;
      $scope.predicate = predicate;
    };
  }
})();
(function() {
    'use strict';
    // Tasks controller
    angular.module('tasks').directive('enterDirective', function() {
      return {
        link: function(scope, element, attrs) {
          $(element).keypress(function(e) {
            if (e.keyCode == 13) {
              console.log("Enter pressed " + element.val())
            }
          });
        }
      }
    }).config(["$mdDateLocaleProvider", function($mdDateLocaleProvider) {

        // $mdDateLocaleProvider.formatDate = function(date) {
        //   return moment(date).format('YYYY-MM-DD');
        // };
            $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD/MM/YYYY');
        };

        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
      };

    }]).controller('ModalTaskCtrl', ModalTaskCtrl); ModalTaskCtrl.$inject = ['$scope', '$state', 'Authentication', '$modal',
    '$log', '$http', 'TasksService'
  ];

  function ModalTaskCtrl($scope, $state, Authentication, $modal, $log, $http,
    TasksService) {
    newTask.$inject = ['TasksService'];

    function newTask(TasksService) {
      return new TasksService();
    }

    //    vm.task.dueDate = new Date();
    $scope.authentication = Authentication;
    $scope.minDate = new Date();
    $scope.format = 'dd/MM/yyyy';
    $scope.altInputFormats = ['d!/M!/yyyy'];
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    var app = this;

    app.closeAlert = function() {
      app.reason = null;
    };
    app.open = function(size) {
      var modalInstance = $modal.open({
        templateUrl: '/modules/tasks/client/views/createTaskModal.client.view.html',
        controller: 'TasksController',
        controllerAs: 'vm',
        resolve: {
          taskResolve: newTask
        },
        size: size
      });
      modalInstance.result.then(function(data) {
        app.closeAlert();
        app.summary = data;
      }, function(reason) {
        app.reason = reason;
      });
    };

    // app.loginOrTask = function() {
    //   console.log('you clicked me');
    //   // if($scope.authentication.user) {
    //   //   console.log('logged in');

    //   //   app.open();

    //   // }
    //   // else if (!$scope.authentication.user) {
    //   //   console.log('not logged in');
    //   //   openLogin();

    //   // }
    // };

  }
})();
(function () {
  'use strict';

  angular
    .module('tasks')
    .controller('NgMapController', NgMapController);

  NgMapController.$inject = ['TasksService', '$scope', '$state', 'Authentication', '$http', 'Users', '$compile', 'NgMap'];

  function NgMapController(TasksService, $scope, $state, Authentication, $http, Users, $compile, NgMap) {
    $scope.locationCollapsed = true;
    
    var vm = this;
    $scope.addressMapCenter = "Madrid, Spain";
    vm.tasks = TasksService.query();
    NgMap.getMap().then(function(map) {
      $scope.map = map;
      $scope.tasks = [];
    });
    $scope.showCity = function(event, task) {
      $scope.selectedTask = task;
      $scope.map.showInfoWindow('myInfoWindow', this);
      
    };
  }
})();

(function() {
    'use strict';
    /*global escape: true */
    // Tasks controller
    moment.locale('es');

    angular.module('tasks').config(["$mdDateLocaleProvider", function($mdDateLocaleProvider) {

        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD/MM/YYYY');
        };
        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
    }]).controller('ModalTaskCtrl', ModalTaskCtrl);
    ModalTaskCtrl.$inject = ['$scope', '$state', 'Authentication',
        'TasksService', '$modal', '$log', '$http'
    ];

    function ModalTaskCtrl($scope, $state, Authentication, TasksService,
        $modal, $log, $http) {
        newTask.$inject = ['TasksService'];

        function newTask(TasksService) {
                return new TasksService();
            }
            /* controller for drop button */
        $scope.authentication = Authentication;
        $scope.status = {
            isopen: false
        };
        $scope.toggled = function(open) {
            $log.log('Dropdown is now: ', open);
        };
        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };
        /* drop button end */
        $scope.cancel = function() {
            $scope.$dismiss();
        };
        $scope.myDate = new Date();
        $scope.minDate = new Date($scope.myDate.getFullYear(), $scope.myDate
            .getMonth() - 2, $scope.myDate.getDate());
        $scope.maxDate = new Date($scope.myDate.getFullYear(), $scope.myDate
            .getMonth() + 2, $scope.myDate.getDate());
        var app = this;
        /* nacho  modcontrol */
        app.closeAlert = function() {
            app.reason = null;
        };
        app.open = function(size) {
            var modalInstance = $modal.open({
                templateUrl: '../modules/tasks/client/views/createTaskModal.client.view.html',
                controller: 'TasksController',
                controllerAs: 'vm',
                resolve: {
                    taskResolve: newTask
                },
                size: size
            });
            modalInstance.result.then(function(data) {
                app.closeAlert();
                app.summary = data;
            }, function(reason) {
                app.reason = reason;
            });
        };
    }
})();
(function() {
    'use strict';
    // Tasks controller
    angular.module('tasks').controller('TasksController', TasksController).filter(
        'customFilter', function() {
            return function(items, search) {
                if (!search) {
                    return items;
                }
                return items.filter(function(element) {
                    // Ex: moving: true, becomes just 'moving'
                    //                return Object.getOwnPropertyNames(
                    //                    element).find(x => x == search.substring(
                    //                    0, search.indexOf(':')));
                    return Object.getOwnPropertyNames(
                        element).find(function(x) {
                        return x === search.substring(
                            0, search.indexOf(
                                ':'));
                    });
                });
            };
        });
    TasksController.$inject = ['$scope', '$state', 'Authentication',
        'taskResolve', '$http', '$modal', '$mdToast', '$animate'
    ];

    function TasksController($scope, $state, Authentication, task, $http,
        $modal, $mdToast, $animate) {
        $scope.minDate = new Date();
        $scope.format = 'dd/MM/yyyy';
        $scope.altInputFormats = ['d!/M!/yyyy'];
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var vm = this;
        vm.authentication = Authentication;
        vm.task = task;
        vm.created = moment(vm.task.created, "YYYY MM DD, h:mm:ss a").fromNow();
        vm.today = moment().format('MMMM Do YYYY, h:mm:ss a');
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        // $scope.locationCollapsed = true;
        vm.locationCollapsed = false;
        $scope.isReadonly = true;
        $scope.cancel = function() {
            // $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };
        $scope.data = {
                model: null
            }
            // vm.task.cleaning = true;
        $scope.taskCategories = [{
            'cat': 'Cleaning',
            'model': 'vm.task.cleaning',
            'value': true
        }, {
            'cat': 'Moving & Delivery',
            'model': 'vm.task.moving'
        }, {
            'cat': 'DIY',
            'model': 'vm.task.DIY'
        }, {
            'cat': 'Marketing & Design',
            'model': 'vm.task.marketing'
        }, {
            'cat': 'Online & IT',
            'model': 'vm.task.online'
        }, {
            'cat': 'Events & Photography',
            'model': 'vm.task.photoEvents'
        }, {
            'cat': 'Business & Admin',
            'model': 'vm.task.office'
        }, {
            'cat': 'Fun & Quirky',
            'model': 'vm.task.funQuirky'
        }, {
            'cat': 'Misc & Other',
            'model': 'vm.task.misc'
        }];

        function remove() {
                swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this task!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel please!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function(isConfirm) {
                    if (isConfirm) {
                        swal("Deleted!",
                            "La tarea ha sido borrada",
                            "success");
                        vm.task.$remove().then(function() {
                            $state.go('tasks.list', {}, {
                                reload: true
                            });
                        });
                    } else {
                        swal("Cancelled", "Your task is safe",
                            "error");
                    }
                });
            }
            // Save Task

        function save(isValid) {
                if (!isValid) {
                    $scope.$broadcast('show-errors-check-validity',
                        'vm.form.taskForm');
                    return false;
                }
                // TODO: move create/update logic to service
                if (vm.task._id) {
                    vm.task.$update(successCallback, errorCallback);
                } else {
                    vm.task.$save(successCallback, errorCallback);
                }

                function successCallback(res) {
                    // $state.go('tasks.view', {
                    //     taskId: res._id
                    // });

                    $state.go('tasks.view', {taskId: res._id}, {
                                reload: true
                            });

                }

                function errorCallback(res) {
                    vm.error = res.data.message;
                }
            } //end of Save function
            //toast  
        $scope.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition).filter(
                function(pos) {
                    return $scope.toastPosition[pos];
                }).join(' ');
        };
        // end of toast
        //newcomment
        vm.newCo = function() {
            //new comment email alert
            vm.commentAlert = function() {
                var data = ({
                    contactName: vm.authentication.user
                        .displayName,
                    emailFrom: 'contact@taskmatch.ie',
                    emailTo: vm.task.email,
                    taskName: vm.task.title,
                    taskId: vm.task._id,
                    taskOwner: vm.task.user.displayName,
                    commentOwner: vm.authentication.user
                        .displayName,
                    comment: vm.task.newComment,
                    contactMessage: 'Hi, ' + vm.task.user
                        .displayName + '! \n ' + vm.authentication
                        .user.displayName +
                        ' has left the following comment: " ' +
                        vm.task.newComment +
                        '" on your task "' + vm.task.title +
                        '" Login to Taskmatch.ie to view your task. \n -- Thanks! from the Taskmatch.ie team'
                });
                $http.post('/api/tasks/' + task._id +
                    '/comment-alert', data).success(
                    function(data, status, headers, config) {
                        // alert('comment alert email has been sent');
                        $mdToast.show($mdToast.simple().content(
                                'Thanks, ' + data.contactName +
                                '! You successfully posted a comment'
                            ).position($scope.getToastPosition())
                            .hideDelay(5000));
                    });

                function errorCallback(res) {
                    vm.error = res.data.message;
                }
            }; //end new comment alert 
            $http.post('/api/tasks/' + task._id, {
                comment: {
                    comment: vm.task.newComment,
                    user: vm.authentication.user,
                    profileImageURL: vm.authentication.user
                        .profileImageURL,
                    displayName: vm.authentication.user.displayName
                }
            }).then(successCallback, errorCallback);

            function successCallback(res) {
                vm.commentAlert();
                $state.transitionTo($state.current, $state.params, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }; //close new comment function
        //new offer
        vm.newOffer = function() {
            //send offer alert email    
            vm.offerAlert = function() {
                var data = ({
                    contactName: vm.authentication.user
                        .displayName,
                    emailFrom: 'contact@taskmatch.ie',
                    emailTo: vm.task.email,
                    taskOwner: vm.task.user.displayName,
                    offerOwner: vm.authentication.user.displayName,
                    offerDesc: vm.offer.offerDesc,
                    taskName: vm.task.title,
                    taskId: vm.task._id,
                    offerId: vm.offer._id
                });
                $http.post('/api/tasks/' + task._id +
                    '/offer-alert', data).success(function(
                    data, status, headers, config) {
                    // console.log('sent');
                    $mdToast.show($mdToast.simple().content(
                        'Thanks for your offer ' +
                        data.contactName).position(
                        $scope.getToastPosition()
                    ).hideDelay(5000));
                });

                function errorCallback(res) {
                    vm.error = res.data.message;
                }
            }; //end new offer alert    
            //new offer    
            $http.post('/api/offers', {
                taskId: vm.task._id,
                taskName: vm.task.title,
                taskDesc: vm.task.taskDesc,
                taskOwnerUser: vm.task.user,
                taskOwnerDisplayName: vm.task.user.displayName,
                taskOwnerEmail: vm.task.email,
                taskOwnerAbout: vm.task.about,
                taskOwnerAdditionalProvidersData: vm.task.additionalProvidersData,
                offerUser: vm.authentication.user,
                offerUserAverage: vm.authentication.user.reviews,
                offerOwnerEmail: vm.authentication.user.email,
                offerOwnerTelephone: vm.authentication.user
                    .phoneNumber,
                offerOwnerPayPal: vm.authentication.user.payPalEmail,
                taskOwnerUserProfileImageURL: vm.task.profileImageURL,
                offerDesc: vm.offer.offerDesc,
                offerPrice: vm.offer.offerPrice,
                // offerExpenses: vm.task.expenses,
                offerDate: vm.offer.offerDate,
                displayName: vm.authentication.user.displayName,
                profileImageURL: vm.authentication.user.profileImageURL,
                about: vm.authentication.user.about,
                provider: vm.authentication.user.provider,
                providerData: vm.authentication.providerData,
                additionalProvidersData: vm.authentication.user
                    .additionalProvidersData,
            }).then(successCallback, errorCallback);

            function successCallback(res) {
                swal("Success!",
                    "You successfully posted an offer!",
                    "success");
                vm.offerAlert();
                $scope.$dismiss();
                $state.transitionTo($state.current, $state.params, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        };
        //close new offer function
        //facebook share this task
        $scope.fbshareCurrentPage = function() {
            window.open(
                'https://www.facebook.com/sharer/sharer.php?u=' +
                escape(window.location.href) + '&t=' + document
                .title, '',
                'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
            );
            return false;
        };
        //facebook share this task
        //report this task
        //$scope.toastPosition = {
        //      bottom: true,
        //      top: false,
        //      left: false,
        //      right: true
        //    };
        //      
        //    $scope.getToastPosition = function() {
        //      return Object.keys($scope.toastPosition).filter(function (pos) {
        //        return $scope.toastPosition[pos];
        //      }).join(' ');
        //    };
        //    vm.reportTask = function() {
        //        
        //      var data = ({
        //        contactName: this.contactName,
        //        contactEmail: this.contactEmail,
        //        contactMessage: this.contactMessage
        //      });
        //        
        //      $http.post('/report-task', data)
        //          .success(function (data, status, headers, config) {
        //            $mdToast.show(
        //                $mdToast.simple()
        //                .content('Thanks for your feedback ' + data.contactName 'we will look into this ASAP')
        //                .position($scope.getToastPosition())
        //                .hideDelay(5000)
        //            );   
        //      })
        //      .error (function (data, status, headers, config) {
        //          
        //      });
        //    };
        //report this task
        //get offers for taskId
        var offersOnThisTask = [];
        $http.get('api/offers').success(function(data, status) {
            // vm.task.offers = data;
            var allOffers = data;
            for (var i = 0; i < allOffers.length; i++) {
                if (allOffers[i].taskId === vm.task._id) {
                    offersOnThisTask.push(allOffers[i]);
                }
                vm.task.offers = offersOnThisTask; //this is for the ng-repeat of offers on the task
            }
            var total = 0;
            // console.log(offersOnThisTask.length);
            for (var i = 0; i < offersOnThisTask.length; i++) {
                if (offersOnThisTask[i].offerUserAverage) {
                    // console.log(offersOnThisTask[i].offerUserAverage.length);
                    var numberOfRatingsForOfferUser =
                        offersOnThisTask[i].offerUserAverage.length;
                    for (var e = 0; e < offersOnThisTask[i].offerUserAverage
                        .length; e++) {
                        total += +offersOnThisTask[i].offerUserAverage[
                            e].rating;
                    }
                    var userAverageRating = total /
                        numberOfRatingsForOfferUser;
                    vm.userAverageRating = userAverageRating;
                    // console.log(userAverageRating);
                    // console.log(total);
                } //end of if there is a offerUserAverage
            } //end of for var i = 0
        }); //end of get offers
        vm.removeComment = function() {
            // var removed = vm.task.comments.splice(this.$index, 1);
            // console.log(removed);
            //     var data = ({
            //     comment: removed,
            //     commentID: removed[0]._id,
            //     taskId: vm.task._id
            // });
            //     // console.log(vm.commentID);
            // $http.post('/api/tasks/' + vm.task._id +
            //         '/delete-comment', data).success(function(
            //         data, status, headers, config) {
            //             console.log('deleted the comment');
            //     });
            //     function errorCallback(res) {
            //         vm.error = res.data.message;
            //     }
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this comment!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    var removed = vm.task.comments.splice(
                        this.$index, 1);
                    // console.log(removed);
                    var data = ({
                        comment: removed,
                        commentID: removed[0]._id,
                        taskId: vm.task._id
                    });
                    // console.log(vm.commentID);
                    $http.post('/api/tasks/' + vm.task._id +
                        '/delete-comment', data).success(
                        function(data, status, headers,
                            config) {
                            // console.log('deleted the comment');
                        });

                    function errorCallback(res) {
                        vm.error = res.data.message;
                    }
                    swal("Deleted!",
                        "The comment has been been deleted.",
                        "success");
                } else {
                    swal("Cancelled", "The comment is safe",
                        "error");
                }
            });
        }
        vm.cancel = function() {
            vm.$dismiss();
        };
        vm.steps = ['one', 'two', 'three'];
        vm.step = 0;
        vm.isFirstStep = function() {
            return vm.step === 0;
        };
        vm.isLastStep = function() {
            return vm.step === (vm.steps.length - 1);
        };
        vm.isCurrentStep = function(step) {
            return vm.step === vm;
        };
        vm.setCurrentStep = function(step) {
            vm.step = step;
        };
        vm.getCurrentStep = function() {
            return vm.steps[vm.step];
        };
        vm.getNextLabel = function() {
            return (vm.isLastStep()) ? 'Submit' : 'Siguiente';
        };
        vm.handlePrevious = function() {
            vm.step -= (vm.isFirstStep()) ? 0 : 1;
        };
        vm.cancel = function() {
            vm.$dismiss();
        };
        vm.handleNext = function() {
            if (vm.isLastStep()) {
                vm.save(vm.form.taskForm.$valid);
                $scope.$dismiss();
            } else {
                vm.step += 1;
            }
        };
        if (vm.task.provider === 'facebook') {
            // console.log('user signed up using Facebook');
        }
    }
})();
//Tasks service used to communicate Tasks REST endpoints
(function () {
  'use strict';

  angular
    .module('tasks')
    .factory('TasksService', TasksService);

  TasksService.$inject = ['$resource'];

  function TasksService($resource) {
    return $resource('api/tasks/:taskId', {
      taskId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manejar usuarios',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

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
'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin', 
  function($scope, $filter, Admin) {

  $scope.labelsPieChart = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.pieData = [300, 500, 100];  
      
    $scope.labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
  $scope.series = ['Series A', 'Series B'];

  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40, 70, 68],
    [28, 48, 40, 19, 86, 27, 90, 95, 92]
  ];
      
    (function(w, d, s, g, js, fs) {
      g = w.gapi || (w.gapi = {});
      g.analytics = {
        q: [],
        ready: function(f) {
          this.q.push(f);
        }
      };
      js = d.createElement(s);
      fs = d.getElementsByTagName(s)[0];
      js.src = 'https://apis.google.com/js/platform.js';
      fs.parentNode.insertBefore(js, fs);
      js.onload = function() {
        g.load('analytics');
      };
    }(window, document, 'script'));

    gapi.analytics.ready(function() {

      /**
       * Authorize the user immediately if the user has already granted access.
       * If no access has been created, render an authorize button inside the
       * element with the ID "embed-api-auth-container".
       */
      gapi.analytics.auth.authorize({
        container: 'embed-api-auth-container',
        clientid: '1052279473598-phulcego9iht7kr7l7lp4es8gkflb63v.apps.googleusercontent.com'
      });


      /**
       * Create a new ViewSelector instance to be rendered inside of an
       * element with the id "view-selector-container".
       */
      var viewSelector = new gapi.analytics.ViewSelector({
        container: 'view-selector-container'
      });

      // Render the view selector to the page.
      viewSelector.execute();

      /**
       * Create a table chart showing top browsers for users to interact with.
       * Clicking on a row in the table will update a second timeline chart with
       * data from the selected browser.
       */
      var mainChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:browser',
          'metrics': 'ga:sessions',
          'sort': '-ga:sessions',
          'max-results': '6'
        },
        chart: {
          type: 'TABLE',
          container: 'main-chart-container',
          options: {
            width: '100%'
          }
        }
      });


      /**
       * Create a timeline chart showing sessions over time for the browser the
       * user selected in the main chart.
       */
      var breakdownChart = new gapi.analytics.googleCharts.DataChart({
        query: {
          'dimensions': 'ga:date',
          'metrics': 'ga:sessions',
          'start-date': '7daysAgo',
          'end-date': 'yesterday'
        },
        chart: {
          type: 'LINE',
          container: 'breakdown-chart-container',
          options: {
            width: '100%'
          }
        }
      });


      /**
       * Store a refernce to the row click listener variable so it can be
       * removed later to prevent leaking memory when the chart instance is
       * replaced.
       */
      var mainChartRowClickListener;


      /**
       * Update both charts whenever the selected view changes.
       */
      viewSelector.on('change', function(ids) {
        var options = {
          query: {
            ids: ids
          }
        };

        // Clean up any event listeners registered on the main chart before
        // rendering a new one.
        if (mainChartRowClickListener) {
          google.visualization.events.removeListener(mainChartRowClickListener);
        }

        mainChart.set(options).execute();
        breakdownChart.set(options);

        // Only render the breakdown chart if a browser filter has been set.
        if (breakdownChart.get().query.filters) breakdownChart.execute();
      });


      /**
       * Each time the main chart is rendered, add an event listener to it so
       * that when the user clicks on a row, the line chart is updated with
       * the data from the browser in the clicked row.
       */
      mainChart.on('success', function(response) {

        var chart = response.chart;
        var dataTable = response.dataTable;

        // Store a reference to this listener so it can be cleaned up later.
        mainChartRowClickListener = google.visualization.events
          .addListener(chart, 'select', function(event) {

            // When you unselect a row, the "select" event still fires
            // but the selection is empty. Ignore that case.
            if (!chart.getSelection().length) return;

            var row = chart.getSelection()[0].row;
            var browser = dataTable.getValue(row, 0);
            var options = {
              query: {
                filters: 'ga:browser==' + browser
              },
              chart: {
                options: {
                  title: browser
                }
              }
            };

            breakdownChart.set(options).execute();
          });
      });

    });
      

    Admin.query(function(data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function() {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function() {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function() {
      $scope.figureOutItemsToDisplay();
    };
  }
                                                    
 
]);
'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    $scope.cancel = function() {
            $scope.$dismiss();
        };

    // If user is signed in then redirect back home
    // if ($scope.authentication.user) {
    //   $location.path('/');
    // }


    $scope.welcomeEmail = function() {
        var data = ({
          subject: 'Hi, ' + $scope.authentication.user.displayName + '! Welcome to Taskmatch.ie',
          contactName: $scope.authentication.user.displayName,
          emailFrom: 'contact@taskmatch.ie',
          emailTo: $scope.authentication.user.email,
          subject: 'Welcome to Taskmatch.ie!'
        });
        $http.post('/api/auth/welcome-email', data).success(
          function(data, status, headers, config) {
            console.log('sent');
          });

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }; //end leave a new review alert


    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        $scope.welcomeEmail();

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'settings.dashboard', $state.previous.params);
        $scope.cancel();

      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';
angular.module('users').controller('publicProfileSettings', ['$scope', '$http',
  '$location', 'Users', 'Authentication', '$modal', '$rootScope', '$filter',
  function($scope, $http, $location, Users, Authentication, $modal, $rootScope, $filter) {
    var user = $location.path();
    var userid = user.split("/");
    var orderBy = $filter('orderBy');
    $scope.predicate = 'created';
    $scope.reverse = true;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse :
        false;
      $scope.predicate = predicate;
    };
    // console.log(userid[1]); -- user._id without '/'
    //console.log(Authentication.user); // the logged in user

    window.fbAsyncInit = function() {
      FB.init({
        appId: '564444857062476',
        xfbml: true,
        version: 'v2.7'
      });
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          console.log('Logged in.');
          //this is also currently resolving to the logged in user, however, it will be used to check against the user profile page with the logged in user... 
          //          FB.api('/' + Authentication.user.providerData.id + '/friends', 'GET', {},
          //            function(response) {
          //              var friendsOfFriends = response;
          //              console.log(friendsOfFriends);
          //            });
          FB.api(
            //"/{user-id}",
            "/" + $rootScope.profileUser.additionalProvidersData.facebook.id, { //this is resolving to the logged in users mutual friends, not the profile users mutual friends
              "fields": "context.fields(mutual_friends)"
            },
            function(response) {
              if (response && !response.error) {
                /* handle the result */
                var friendsofFriends = response;
                // console.log(friendsofFriends);
                // console.log(friendsofFriends.context.mutual_friends.data);
                // console.log(friendsofFriends.context.mutual_friends.data.length);
                var mutualFriendsNames = response.context.mutual_friends.data;
                var friendsofFriendsLength = friendsofFriends.context.mutual_friends.data.length;
                $scope.friendsofFriendsLength = friendsofFriendsLength;

                var profileMutualFriendsArray = [];

                for (var i = 0; i < mutualFriendsNames.length; i++) {
                  profileMutualFriendsArray.push(mutualFriendsNames[i].name);
                }

                $scope.profileMutualFriendsArray = profileMutualFriendsArray;
                console.log(profileMutualFriendsArray);
              }
            }
          );
        } else {
          //FB.login();
          console.log('not logged in with facebook');
        }
      });
    };
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));



    $http.get('api/users' + user).then(function(response) {
      // get all info on the user

      $scope.user = response.data;
      $rootScope.profileUser = response.data;
      // console.log($rootScope.profileUser);
      // console.log($rootScope.profileUser.additionalProvidersData);
      // console.log($rootScope.profileUser.additionalProvidersData.facebook.id);


      var profileUserName = response.data.displayName;
      var profileUserEmail = response.data.email;

      var userReviews = response.data.reviews;
      var numberOfReviews = userReviews.length;

      if (!response.data.reviews) {
        var numberOfReviews = 0;
      }
      $scope.numberOfReviews = numberOfReviews;
      var total = 0;
      // $scope.one = 1;
      var one = 0;
      var two = 0;
      var three = 0;
      var four = 0;
      var five = 0;
      for (var i = 0; i < userReviews.length; i++) {
        // console.log('I was rated ' + userReviews[i].rating);
        if (userReviews[i].rating === 1) {
          one += +1;
        } else if (userReviews[i].rating === 2) {
          two += +1;
        } else if (userReviews[i].rating === 3) {
          three += +1;
        } else if (userReviews[i].rating === 4) {
          four += +1;
        } else if (userReviews[i].rating === 5) {
          five += +1;
        }
        total += +userReviews[i].rating;
      }
      //      console.log(five);
      //      console.log(four);
      $scope.oneStars = one;
      $scope.twoStars = two;
      $scope.threeStars = three;
      $scope.fourStars = four;
      $scope.fiveStars = five;
      //      console.log(total); //accumlated total of all ratings
      //      console.log(total/numberOfReviews); //average user rating
      var userAverage = total / numberOfReviews;
      $scope.userAverage = userAverage;
      // console.log(userAverage);
      var positiveRating = (userAverage / 5) * 100;
      $scope.positiveRating = positiveRating;
      //      console.log(positiveRating);
    }); //end of get profile user request


    // scope settings for the stars tally
    $scope.five = 5;
    $scope.four = 4;
    $scope.three = 3;
    $scope.two = 2;
    $scope.one = 1;
    var allUserReviews = false;
    var userAverageRating = true;
    // $scope.rate = 5;
    $scope.max = 5;
    // rating on profile page is readonly. 
    $scope.isReadonly = true;
    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };
    //get tasks that were created by the user
    $http.get('api/tasks').then(function(response) {
      var respTasks = response.data;
      // console.log(respTasks);
      var taskTitles = [];
      var taskComments = [];
      var postedTasksTotal = 0;
      var completedTasksTotal = 0;
      var commentsPosted = 0;
      for (var i = 0; i < respTasks.length; i++) {
        // console.log(respTasks[i].title + ' task posted by ' + respTasks[i].user._id);
        if (respTasks[i].user._id == userid[1]) {
          console.log(respTasks[i].title + ' task posted by ' + respTasks[i].user._id);
          postedTasksTotal += +1;
          // console.log(postedTasksTotal);
          taskTitles.push(respTasks[i].title);

          if (respTasks[i].statusClosed === true) {
            completedTasksTotal += +1;
            // console.log(completedTasksTotal);
          }
        }
        $scope.completedTasksTotal = completedTasksTotal;
        $scope.postedTasksTotal = postedTasksTotal;
        console.log(completedTasksTotal);
      }

      var authenticatedUser = Authentication.user;
      console.log(authenticatedUser);
      console.log(user);
      $scope.authenticatedUser = authenticatedUser;
      $scope.taskTitles = taskTitles;

      $scope.requestAQuote = function() {
        $modal.open({
          templateUrl: 'modules/users/client/views/public-profile/request-quote.client.view.html',
          controller: 'requestAQuoteController',
          resolve: {
            profileUser: $rootScope.profileUser
          }
        });
      };

      $scope.uploadCoverPhoto = function() {
        $modal.open({
          templateUrl: 'modules/users/client/views/settings/change-cover-picture.client.view.html',
          controller: 'ChangeProfileCoverPictureController',
          resolve: {
            profileUser: $rootScope.profileUser
          }
        });
      };

    });//end of get tasks
  }
]);

'use strict';
angular.module('users').controller('requestAQuoteController', ['$scope', '$http',
  '$location', 'Users', 'Authentication', '$modal', 'profileUser', '$mdToast',
  function($scope, $http, $location, Users, Authentication, $modal, profileUser, $mdToast) {
    var user = Authentication.user;
    // console.log(profileUserEmail);
    // console.log(profileUser);

    //get tasks that were created by the user
    $http.get('api/tasks').then(function(response) {

      var respTasks = response.data;
      var taskTitles = [];
      var postedTasksTotal = 0;

      for (var i = 0; i < respTasks.length; i++) {
        if (respTasks[i].user._id === user._id) {

          // console.log(respTasks[i].title + ' task posted by ' + respTasks[i].user._id);
          postedTasksTotal += +1;
          taskTitles.push({
            title: respTasks[i].title,
            id: respTasks[i]._id
          });

        }
      }
      $scope.postedTasksTotal = postedTasksTotal;
      $scope.taskTitles = taskTitles;
      // console.log(taskTitles);
    });

    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition).filter(function(pos) {
        return $scope.toastPosition[pos];
      }).join(' ');
    };

    $scope.requestAQuoteAlert = function() {
      var data = ({
        contactName: profileUser.displayName,
        emailFrom: 'contact@taskmatch.ie',
        emailTo: profileUser.email,
        taskName: $scope.selectedTask.title,
        taskId: $scope.selectedTask.id,
        taskOwner: user.displayName
          // commentOwner: vm.authentication.user.displayName,
          // comment: vm.task.newComment,
      });
      $http.post('/api/users/' + user._id + '/request-quote-alert', data).success(
        function(data, status, headers, config) {
          swal("Success!",
              "You successfully requested a quote!",
              "success");
          $mdToast.show($mdToast.simple().content('Thanks, ' + user.displayName +
            '! You successfully requested a quote from ' + profileUser.displayName).position(
            $scope.getToastPosition()).hideDelay(5000));
        });

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
]);
angular.module('users').controller('alertsController', ['$scope', '$http', 'Authentication',
  function($scope, $http, Authentication) {
    var vm = this;
    var userId = Authentication.user._id;
    vm.user = Authentication.user;

    $http.get('api/users/' + userId).then(function(response) {
      var tags = [];
      var alerts = response.data.alerts;

      for (var i = 0; i < alerts.length; i++) {
        // console.log('Task posted by ' + tasksMessages[i].user._id);
        tags.push(alerts[i]);
        // console.log(myTasks);
      }
      console.log(tags);
      $scope.tags = tags;
    });

  }
]).filter('filterByTags', function() {
  return function(items, tags) {
    var filtered = [];
    (items || []).forEach(function(item) {
      var matches = tags.some(function(tag) {
        return (item.indexOf(tag.text) > -1);
      });
      if (matches) {
        filtered.push(item);
      }
    });
    return filtered;
  };
});


// 'use strict';

// angular.module('users').controller('alertsController', ['TasksService', '$scope', '$http', 'Authentication', '$rootScope', '$window',
//   function (TasksService, $scope, $http, Authentication, $rootScope, $window) {
//     var vm = this;
//     vm.tasks = TasksService.query();
//     var userId = Authentication.user._id;
//     vm.user = Authentication.user;

//     $http.get('api/offers').then(function(response) {

//       var myOffers = [];

//       var offersMessages = response.data;
//       $rootScope.offersMessages = offersMessages;

//       for (var i = 0; i < offersMessages.length; i++) {
//         if (offersMessages[i].user._id === userId) {
//           // console.log('Offer posted by ' + offersMessages[i].user._id);
//           myOffers.push(offersMessages[i]);
//         }
//       }
//       $scope.myOffers = myOffers;
//     // console.log($scope.myOffers);
//     });

//     console.log($scope.myOffers);

//     $http.get('api/users/' + userId).then(function(response) {
//      var alerts = response.data.alerts;
//       // console.log(alerts);
//       // $rootScope.alerts = response.data.alerts;
//       vm.alerts = response.data.alerts;
//       console.log(vm.alerts);
//       $rootScope.alerts = vm.alerts;
//       console.log($rootScope.alerts);
//     }); //end of get request
//     console.log(vm.alerts);
//     console.log($rootScope.alerts);

//   }
// ]).filter('customFilter', function() {
//       return function(items, alerts) {
//         if (!alerts) {
//           return items;
//         }
//         return items.filter(function(element) {
//         // Ex: moving: true, becomes just 'moving'
//         //                return Object.getOwnPropertyNames(
//         //                    element).find(x => x == search.substring(
//         //                    0, search.indexOf(':')));
//           return Object.getOwnPropertyNames(element).find(function(x) {
//             return x === alerts.substring(0, alerts.indexOf(':'));
//           });
//         });
//       };
//     });



// // (function() {
// //   'use strict';
// //   angular.module('users').controller('alertsController',
// //     alertsController).filter('filterByTags', function () {
// //   return function (items, alerts) {
// //     var filtered = [];
// //     (items || []).forEach(function (item) {
// //       var matches = alerts.some(function (alert) {
// //         return (item.data1.indexOf(alert.text) > -1) ||
// //                (item.data2.indexOf(alert.text) > -1);
// //       });
// //       if (matches) {
// //         filtered.push(item);
// //       }
// //     });
// //     return filtered;
// //   };
// // });
// //   alertsController.$inject = ['TasksService', 'OffersService',
// //     '$scope', '$stateParams', '$filter', '$http', 'Authentication', '$rootScope'
// //   ];

// //   function alertsController(TasksService, OffersService, $scope,
// //     $stateParams, $filter, $http, Authentication, $rootScope) {

// //     var vm = this;
// //     vm.tasks = TasksService.query();
// //     var userId = Authentication.user._id;
// //     vm.user = Authentication.user;

// //     $http.get('api/users/' + userId).then(function(response) {
// //       var alerts = response.data.alerts;
// //       console.log(alerts);
// //       $rootScope.alerts = alerts;
// //     });
// //     console.log($rootScope.alerts);
// //     // console.log(userId);

// //     $scope.myFilter = $stateParams.myFilter;
// //     var orderBy = $filter('orderBy');
// //     $scope.predicate = 'created';
// //     $scope.reverse = true;
// //     $scope.order = function(predicate) {
// //       $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse :
// //         false;
// //       $scope.predicate = predicate;
// //     }

// //   }
// // })();



// // (function() {
// //   'use strict';
// //   angular.module('users').controller('alertsController',
// //     alertsController).filter('filterByTags', function () {
// //   return function (items, user.alerts) {
// //     var filtered = [];
// //     (items || []).forEach(function (item) {
// //       var matches = tags.some(function (user.alert) {
// //         return (item.data1.indexOf(user.alert.text) > -1) ||
// //                (item.data2.indexOf(user.alert.text) > -1);
// //       });
// //       if (matches) {
// //         filtered.push(item);
// //       }
// //     });
// //     return filtered;
// //   };
// // });

// //   alertsController.$inject = ['TasksService', 'OffersService',
// //     '$scope', '$stateParams', '$filter', '$http', 'Authentication'
// //   ];

// //   function alertsController(TasksService, OffersService, $scope,
// //     $stateParams, $filter, $http, Authentication) {

// //     var vm = this;
// //     vm.tasks = TasksService.query();
// //     var userId = Authentication.user._id;
// //     vm.user = Authentication.user;
// //     // console.log(userId);

// //     console.log(vm.tasks);

// //     $scope.myFilter = $stateParams.myFilter;
// //     var orderBy = $filter('orderBy');
// //     $scope.predicate = 'created';
// //     $scope.reverse = true;
// //     $scope.order = function(predicate) {
// //       $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse :
// //         false;
// //       $scope.predicate = predicate;
// //     };

// //     // $http.get('api/tasks').then(function(response) {
// //     //   var respTasks = response.data;
// //     //   var postedTasksTotal = 0;
// //     //   var completedTasksTotal = 0;
// //     //   var statusAssignedTotal = 0;
// //     //   var statusOpenTotal = 0;

// //     //   for (var i = 0; i < respTasks.length; i++) {
// //     //     if (respTasks[i].user._id === userId) {
// //     //       // console.log('Task posted by ' + respTasks[i].user._id);
// //     //       postedTasksTotal += +1;
// //     //     } else if (respTasks[i].user._id === userId && respTasks[i].statusClosed === true) {
// //     //       console.log('task' + respTasks[i].title + 'completed');
// //     //       completedTasksTotal += +1;
// //     //     } else if (respTasks[i].user._id === userId && respTasks[i].statusAssigned === true) {
// //     //       console.log('task' + respTasks[i].title + 'assigned');
// //     //       statusAssignedTotal += +1;
// //     //     } else if (respTasks[i].user._id === userId && respTasks[i].statusOpen === true) {
// //     //       console.log('task' + respTasks[i].title + 'Open');
// //     //       statusOpenTotal += +1;
// //     //     }
// //     //   }


// //     //   $scope.completedTasksTotal = completedTasksTotal;
// //     //   $scope.postedTasksTotal = postedTasksTotal;
// //     //   $scope.statusAssignedTotal = statusAssignedTotal;
// //     //   $scope.statusOpenTotal = statusOpenTotal;
// //     //   vm.statusOpenTotal = statusOpenTotal;
// //     // });
// //   }
// // })();
'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfileCoverPictureController', ['$scope', '$timeout', '$window', 'Authentication', '$state', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, $state, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.coverImageURL;

    $scope.cancel = function() {
            // $modalInstance.dismiss('cancel');
      $scope.$dismiss();
    };

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/cover-picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
      //Close the modal
      $scope.cancel();
      //Refresh the page 
      $state.transitionTo($state.current, $state.params, {
        reload: true,
        inherit: false,
        notify: true
      });
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('DashboardController', ['$scope', 'Authentication', '$http', '$location', 'Users', '$rootScope',
  function($scope, Authentication, $http, $location, Users, $rootScope) {
    window.fbAsyncInit = function() {
      FB.init({
        appId: '564444857062476',
        xfbml: true,
        version: 'v2.7'
      });

      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          console.log('Hi, you are logged in.');
          FB.api(
            '/me/friends',
            'GET', {},
            function(response) {
              $rootScope.mutualFriends = response;
              console.log(response);
              var mutualFriends = response.data;
              var mutualFriendsArray = [];

              for (var i = 0; i < mutualFriends.length; i++) {
                mutualFriendsArray.push(mutualFriends[i].name);
              }
              // console.log(mutualFriendsArray);
              $scope.mutualFriendsArray = mutualFriendsArray;
            }
          );
        } else {
          //FB.login();
          console.log('not logged in with facebook');
        }
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    var vm = this;
    var userId = Authentication.user._id;

    var notificationsList = [];
    var notificationsFull = [];

    //get all tasks
    $http.get('api/tasks').then(function(response) {
      var respTasks = response.data;
      var allTasks = response.data;
      // console.log(allTasks);
      $scope.allTasks = allTasks;
      // notificationsList.push(respTasks);
      // console.log(notificationsList);
      // var notificationsFull = notificationsList[0].concat(notificationsList[1]);
      // console.log(notificationsFull);
      var postedTasksTotal = 0;
      var completedTasksTotal = 0;
      var statusAssignedTotal = 0;
      var statusPostedAwaitingPayment = 0;
      var statusOpenTotal = 0;

      for (var i = 0; i < respTasks.length; i++) {
        if (respTasks[i].user._id == userId) {
          // console.log('Task posted by ' + respTasks[i].user._id);
          postedTasksTotal += +1;

          if (respTasks[i].statusClosed === true) {
            completedTasksTotal += +1;
          } else if (respTasks[i].statusAssigned === true) {
            statusAssignedTotal += +1;
          }
           else if (respTasks[i].statusAssigned === true && respTasks[i].statusPaid === false) {
            statusPostedAwaitingPayment += +1;
          }
           else if (respTasks[i].statusOpen === true) {
            statusOpenTotal += +1;
          }
        }

        $scope.respTasks = respTasks;
      $scope.completedTasksTotal = completedTasksTotal;
      $scope.postedTasksTotal = postedTasksTotal;
      $scope.statusAssignedTotal = statusAssignedTotal;
      $scope.statusPostedAwaitingPayment = statusPostedAwaitingPayment;
      $scope.statusOpenTotal = statusOpenTotal;
      }
      // $scope.respTasks = respTasks;
      // $scope.completedTasksTotal = completedTasksTotal;
      // $scope.postedTasksTotal = postedTasksTotal;
      // $scope.statusAssignedTotal = statusAssignedTotal;
      // $scope.statusPostedAwaitingPayment = statusPostedAwaitingPayment;
      // $scope.statusOpenTotal = statusOpenTotal;
      // vm.statusOpenTotal = statusOpenTotal;
      // $scope.notificationsFull = notificationsFull;
    }); //get all tasks

    // // get all offers
    var offersOnMyTasks = [];
    //get all offers
    $http.get('api/offers').then(function(response) {
      var respOffers = response.data;
      // notificationsList.push(respOffers);
      // console.log(notificationsList);
      var postedOffersTotal = 0;
      var offerAcceptedTotal = 0;
      var completedOffersTotal = 0;

      for (var i = 0; i < respOffers.length; i++) {
        if (respOffers[i].taskOwnerUser === userId) {
          // postedOffersTotal += +1;
          offersOnMyTasks.push(respOffers[i]);

          if (respOffers[i].offerClosed === true) {
            completedOffersTotal += +1;
          } else if (respOffers[i].offerAccepted === true) {
            offerAcceptedTotal += +1;
          }
          // else if (respOffers[i].offerOpen === true) {
          //   statusOpenTotal += +1;
          // }
        }
      }
      $scope.offersOnMyTasks = offersOnMyTasks;
      // console.log(offersOnMyTasks);
      $scope.respOffers = respOffers;
      $scope.postedOffersTotal = postedOffersTotal;
      $scope.completedOffersTotal = completedOffersTotal;
      $scope.offerAcceptedTotal = offerAcceptedTotal;
    });//end of get all offers and offers totals

    $scope.notificationsList = notificationsList;

    $scope.myInterval = 10000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [{
      url1: 'tasks.list({ myFilter : { cleaning: true } })',
      image: '../modules/core/client/img/category/Cleaning.png',
      url2: 'tasks.list({ myFilter : { moving: true } })',
      image2: '../modules/core/client/img/category/MovingDelivery.png',
      url3: 'tasks.list({ myFilter : { DIY: true } })',
      image3: '../modules/core/client/img/category/handyman.png'
    }, {
      url1: 'tasks.list({ myFilter : { marketing: true } })',
      image: '../modules/core/client/img/category/Marketing.png',
      url2: 'tasks.list({ myFilter : { funQuirky: true } })',
      image2: '../modules/core/client/img/category/FunQuirky.png',
      url3: 'tasks.list({ myFilter : { photoEvents: true } })',
      image3: '../modules/core/client/img/category/EventsPhotography.png'
    }, {
      url1: 'tasks.list({ myFilter : { onlineIT: true } })',
      image: '../modules/core/client/img/category/computerIT.png',
      url2: 'tasks.list({ myFilter : { office: true } })',
      image2: '../modules/core/client/img/category/Office.png',
      url3: 'tasks.list({ myFilter : { misc: true } })',
      image3: '../modules/core/client/img/category/Others.png'
    }];
    // var slidesUiSref = $scope.slidesUiSref = [
    //   {  }

    // ]
    $scope.user = Authentication.user;

  }
]);
(function() {
  'use strict';
  Stripe.setPublishableKey('pk_live_nycjXdZVMuyCeshiayQ32Ljb');
  angular.module('users').controller('EditPaymentDetailsController',
    EditPaymentDetailsController);
  EditPaymentDetailsController.$inject = ['Authentication', '$scope',
    '$mdToast', '$document', '$animate', '$http', '$window'
  ];

  function EditPaymentDetailsController(Authentication, $scope, $mdToast,
    $document, $animate, $http, $window) {
    $window.Stripe.setPublishableKey('pk_live_nycjXdZVMuyCeshiayQ32Ljb');
    $scope.user = Authentication.user;

    $scope.onSubmit = function() {
      $scope.processing = true;
    };
    // console.log($scope.user._id);
    $scope.stripeCallback = function(code, result) {
      $scope.processing = false;
      $scope.hideAlerts();
      if (result.error) {
        $scope.stripeError = result.error.message;
      } else {
        var stripeToken = result.id;
        //        var stripeToken = stripeToken;
        var data = ({
          stripeToken: result.id,
          customerName: $scope.user.displayName,
          customerEmail: $scope.user.email,
          userId: user._id,
          result: result
        });
        $scope.createNewCustomer = function() {
          $http.post('/api/users/' + user._id + '/create-new-customer',
            data).success(function(stripeToken, data, status, headers,
            config) {
            swal("Success!",
              "You successfully saved your payment details!",
              "success");
          }).error(function(data, status, headers, config) {
            console.log(status);
            swal("Oops...", "Something went wrong!", "error");
          });
        };
        var updateData = ({
          stripeToken: result.id,
          customerId: $scope.user.stripeCustomerId,
          customerName: $scope.user.displayName,
          customerEmail: $scope.user.email,
          userId: user._id,
          result: result
        });
        $scope.updateCustomer = function() {
          $http.post('/api/users/' + user._id + '/update-customer',
            updateData).success(function(stripeToken, data, status,
            headers, config) {
            swal("Success!",
              "You successfully updated your payment details!",
              "success");
          }).error(function(data, status, headers, config) {
            console.log(status);
            swal("Oops...", "Something went wrong!", "error");
          });
        };
        $scope.createNewCustomer();
      }
    };
    $scope.customerCharges = function() {
      var data = ({
        customerId: $scope.user.stripeCustomerId
      });
      var stripeCustomerId = $scope.user.stripeCustomerId;
      // console.log(stripeCustomerId);
      $http.post('/api/users/' + $scope.user._id + '/customer-charges',
        data).success(function(res, data, status, headers, config) {
        $scope.customerCharges = res;
      }).error(function(res, data, status, headers, config) {
        // console.log(status);
        console.log('error');
      });
    };
    $scope.customerCharges();


    $scope.customerDetails = function() {
      var customerDetailsData = ({
        customerId: $scope.user.stripeCustomerId
      });
      var stripeCustomerId = $scope.user.stripeCustomerId;
      // console.log(stripeCustomerId);
      $http.post('/api/users/' + $scope.user._id + '/customer-details',
        customerDetailsData).success(function(res, data, status, headers, config) {
        $scope.customerDetails = res;
      }).error(function(res, data, status, headers, config) {
        // console.log(status);
        console.log('error');
      });
    };
    $scope.customerDetails();

    $scope.updateReceivePayment = function() {
      var receivePaymentsData = ({
        payPalEmail: user.payPalEmail
      });
      $http.post('/api/users/' + user._id + '/receive-payments',
        receivePaymentsData).success(function(stripeToken, data, status,
        headers, config) {
        swal("Success!",
          "You successfully updated your PayPal details!",
          "success");
      }).error(function(data, status, headers, config) {
        console.log(status);
        swal("Oops...", "Something went wrong!", "error");
      });
    };

    $scope.hideAlerts = function() {
      $scope.stripeError = null;
      $scope.stripeToken = null;
    };
  }
})();
'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication', '$state',
  function ($scope, $http, $location, Users, Authentication, $state) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

    $scope.showHints = true;
      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');
        swal("Success!", "You successfully updated your profile!", "success");
        $state.transitionTo($state.current, $state.params, {
          reload: true,
          inherit: false,
          notify: true
        });
        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

(function() {
  'use strict';
  angular.module('users').controller('messagesController',
    messagesController);

  messagesController.$inject = ['TasksService', 'OffersService',
    '$scope', '$stateParams', '$filter', '$http', 'Authentication', '$rootScope'
  ];

  function messagesController(TasksService, OffersService, $scope,
    $stateParams, $filter, $http, Authentication, $rootScope) {

    var vm = this;
    var userId = Authentication.user._id;
    vm.user = Authentication.user;

    vm.tasks = TasksService.query();

    $http.get('api/offers').then(function(response) {

      var myOffers = [];

      var offersMessages = response.data;
      for (var i = 0; i < offersMessages.length; i++) {
        if (offersMessages[i].taskOwnerUser == userId) {
          myOffers.push(offersMessages[i]);
        }
      }
      $scope.myOffers = myOffers;
    });

  }
})();
'use strict';

angular.module('users').controller('notificationsController', ['$scope', 'Authentication', '$http', '$location', 'Users', '$rootScope', '$filter',
  function($scope, Authentication, $http, $location, Users, $rootScope, $filter) {
    var vm = this;
    var userId = Authentication.user._id;
    var orderBy = $filter('orderBy');
    $scope.predicate = 'created';
    $scope.reverse = true;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse :
        false;
      $scope.predicate = predicate;
    };

    var myTasks = [];
    $http.get('api/tasks').then(function(response) {
      var respTasks = response.data;
      var postedTasksTotal = 0;
      var completedTasksTotal = 0;
      var statusAssignedTotal = 0;
      var statusOpenTotal = 0;

      for (var i = 0; i < respTasks.length; i++) {
        if (respTasks[i].user._id === userId) {
          // console.log('Task posted by ' + respTasks[i].user._id);
          postedTasksTotal += +1;
          myTasks.push(respTasks[i]);
          // console.log(myTasks);

        } else if (respTasks[i].user._id === userId && respTasks[i].statusClosed === true) {
          console.log('task' + respTasks[i].title + 'completed');
          completedTasksTotal += +1;
        } else if (respTasks[i].user._id === userId && respTasks[i].statusAssigned === true) {
          console.log('task' + respTasks[i].title + 'assigned');
          statusAssignedTotal += +1;
        } else if (respTasks[i].user._id === userId && respTasks[i].statusOpen === true) {
          console.log('task' + respTasks[i].title + 'Open');
          statusOpenTotal += +1;
        }
      }


      $scope.completedTasksTotal = completedTasksTotal;
      $scope.postedTasksTotal = postedTasksTotal;
      $scope.statusAssignedTotal = statusAssignedTotal;
      $scope.statusOpenTotal = statusOpenTotal;
      vm.statusOpenTotal = statusOpenTotal;
      $scope.myTasks = myTasks;
      console.log(myTasks);
    });




    var notificationsList = [];
    var notificationsFull = [];
    //get all tasks
    // $http.get('api/tasks').then(function(response) {
    //   var respTasks = response.data;
    //   notificationsList.push(respTasks);
    //   // console.log(notificationsList);
    //   var notificationsFull = notificationsList[0].concat(notificationsList[1]);
    //   // console.log(notificationsFull);
    //   var postedTasksTotal = 0;
    //   var completedTasksTotal = 0;
    //   var statusAssignedTotal = 0;
    //   var statusOpenTotal = 0;

    //   for (var i = 0; i < respTasks.length; i++) {
    //     if (respTasks[i].user._id === userId) {
    //       // console.log('Task posted by ' + respTasks[i].user._id);
    //       postedTasksTotal += +1;
    //       if (respTasks[i].statusClosed === true) {
    //         completedTasksTotal += +1;
    //       } else if (respTasks[i].statusAssigned === true) {
    //         statusAssignedTotal += +1;
    //       } else if (respTasks[i].statusOpen === true) {
    //         statusOpenTotal += +1;
    //       }
    //     }
    //   }
    //   $scope.respTasks = respTasks;
    //   $scope.completedTasksTotal = completedTasksTotal;
    //   $scope.postedTasksTotal = postedTasksTotal;
    //   $scope.statusAssignedTotal = statusAssignedTotal;
    //   $scope.statusOpenTotal = statusOpenTotal;
    //   vm.statusOpenTotal = statusOpenTotal;
    //   $scope.notificationsFull = notificationsFull;
    // }); //get all tasks

    var offersOnMyTasks = [];
    //get all offers
    $http.get('api/offers').then(function(response) {
      var respOffers = response.data;
      notificationsList.push(respOffers);
      // console.log(notificationsList);
      var postedOffersTotal = 0;
      var offerAcceptedTotal = 0;
      var completedOffersTotal = 0;

      for (var i = 0; i < respOffers.length; i++) {
        if (respOffers[i].taskOwnerUser === userId) {
          // postedOffersTotal += +1;
          offersOnMyTasks.push(respOffers[i]);

          if (respOffers[i].offerClosed === true) {
            completedOffersTotal += +1;
          } else if (respOffers[i].offerAccepted === true) {
            offerAcceptedTotal += +1;
          }
          // else if (respOffers[i].offerOpen === true) {
          //   statusOpenTotal += +1;
          // }
        }
      }
      $scope.offersOnMyTasks = offersOnMyTasks;
      // console.log(offersOnMyTasks);
      $scope.respOffers = respOffers;
      $scope.postedOffersTotal = postedOffersTotal;
      $scope.completedOffersTotal = completedOffersTotal;
      $scope.offerAcceptedTotal = offerAcceptedTotal;
    });
    // get all offers

    $scope.notificationsList = notificationsList;
    // console.log(notificationsList);
    // console.log($scope.notificationsList);
    // console.log(notificationsList[0]);
    // console.log(notificationsList[1]);
    // var notificationsFull = notificationsList[0].concat(notificationsList[1]);
    // console.log(notificationsFull);
    $scope.user = Authentication.user;

  }
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication', '$timeout', '$mdSidenav', 
  function ($scope, Authentication, $timeout, $mdSidenav) {
    $scope.user = Authentication.user;
      
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      }
    }
  }
]);

'use strict';

angular.module('users').controller('UserReviewsCtrl', ['$scope', '$http', 'Authentication',
  function($scope, $http, Authentication) {

    var user = Authentication.user._id;

    $scope.isReadonly = true;
    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };

    var one = 0;
    var two = 0;
    var three = 0;
    var four = 0;
    var five = 0;
    // $scope.oneStars = one;
    // $scope.twoStars = two;
    // $scope.threeStars = three;
    // $scope.fourStars = four;
    // $scope.fiveStars = five;
    $scope.five = 5;
    $scope.four = 4;
    $scope.three = 3;
    $scope.two = 2;
    $scope.one = 1;

    $http.get('api/users/' + user).then(function(response) {
      // get all info on the user

      $scope.user = response.data;

      var profileUserName = response.data.displayName;
      var profileUserEmail = response.data.email;

      var userReviews = response.data.reviews;
      var numberOfReviews = userReviews.length;

      // if (!response.data.reviews) {
      //   var numberOfReviews = 0;
      // }
      $scope.numberOfReviews = numberOfReviews;
      var total = 0;
      var one = 0;
      var two = 0;
      var three = 0;
      var four = 0;
      var five = 0;
      for (var i = 0; i < userReviews.length; i++) {
        // console.log('I was rated ' + userReviews[i].rating);
        if (userReviews[i].rating === 1) {
          one += +1;
        } else if (userReviews[i].rating === 2) {
          two += +1;
        } else if (userReviews[i].rating === 3) {
          three += +1;
        } else if (userReviews[i].rating === 4) {
          four += +1;
        } else if (userReviews[i].rating === 5) {
          five += +1;
        }
        total += +userReviews[i].rating;
      }
           // console.log(five);
           // console.log($scope.fiveStars);
      //      console.log(four);
      $scope.oneStars = one;
      $scope.twoStars = two;
      $scope.threeStars = three;
      $scope.fourStars = four;
      $scope.fiveStars = five;
      //      console.log(total); //accumlated total of all ratings
      //      console.log(total/numberOfReviews); //average user rating
      var userAverage = total / numberOfReviews;
      $scope.userAverage = userAverage;
      // console.log(userAverage);
      var positiveRating = (userAverage / 5) * 100;
      $scope.positiveRating = positiveRating;
      //      console.log(positiveRating);
    }); //end of get profile user request

  }
]);
(function() {
  'use strict';
  angular.module('users').controller('userTasksController',
    userTasksController).filter('customFilter', function() {
    return function(items, search) {
      if (!search) {
        return items;
      }
      return items.filter(function(element) {
        return Object.getOwnPropertyNames(element).find(function(x) {
          return x === search.substring(0, search.indexOf(':'));
        });
      });
    };
  });
  userTasksController.$inject = ['TasksService', 'OffersService',
    '$scope', '$stateParams', '$filter', '$http', 'Authentication'
  ];

  function userTasksController(TasksService, OffersService, $scope,
    $stateParams, $filter, $http, Authentication) {

    var vm = this;
    var userId = Authentication.user._id;
    vm.user = Authentication.user;

    $scope.taskCategories = [{
      'cat': 'All',
      'filter': ''
    }, {
      'cat': 'Cleaning',
      'filter': 'cleaning: true'
    }, {
      'cat': 'Moving & Delivery',
      'filter': 'moving: true'
    }, {
      'cat': 'DIY',
      'filter': 'DIY: true'
    }, {
      'cat': 'Marketing & Design',
      'filter': 'marketing: true'
    }, {
      'cat': 'Digital & IT',
      'filter': 'onlineIT: true'
    }, {
      'cat': 'Events & Photography',
      'filter': 'photoEvents: true'
    }, {
      'cat': 'Business & Admin',
      'filter': 'office: true'
    }, {
      'cat': 'Fun & Quirky',
      'filter': 'funQuirky: true'
    }, {
      'cat': 'Misc & Other ',
      'filter': 'misc: true'
    }];

    $scope.myFilter = $stateParams.myFilter;
    var orderBy = $filter('orderBy');
    $scope.predicate = 'created';
    $scope.reverse = true;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse :
        false;
      $scope.predicate = predicate;
    };
    $scope.quantity = 10;

    $http.get('api/tasks').then(function(response) {
      var respTasks = response.data;
      var myTasks = [];

      for (var i = 0; i < respTasks.length; i++) {
        if (respTasks[i].user._id === userId) {
          myTasks.push(respTasks[i]);
        } 
      $scope.myTasks = myTasks;
    }
    });

    

  }
})();
'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
