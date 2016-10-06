'use strict';
angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  '$location', '$anchorScroll',
  function($scope, Authentication, $location, $anchorScroll) {
    // This provides Authentication context.
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
  
      
  }]).directive('aniScroll', function($window) {
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
    }).directive('aniView', function($window) {
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
    }).directive('loadedImg', function(){
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


