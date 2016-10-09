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
      image: '../modules/core/client/img/category/HogarEtece.png',
      url2: 'tasks.list({ myFilter : { marketing: true } })',
      image2: '../modules/core/client/img/category/ikeaEtece2.png',
      url3: 'tasks.list({ myFilter : { office: true } })',
      image3: '../modules/core/client/img/category/profesEtece.png'
    }, {
      url1: 'tasks.list({ myFilter : { DIY: true } })',
      image: '../modules/core/client/img/category/diyEtece.png',
      url2: 'tasks.list({ myFilter : { onlineIT: true } })',
      image2: '../modules/core/client/img/category/officeEtece3.png',
      url3: 'tasks.list({ myFilter : { photoEvents: true } })',
      image3: '../modules/core/client/img/category/Events2Etece.png'
    }, {
      url1: 'tasks.list({ myFilter : { moving: true } })',
      image: '../modules/core/client/img/category/Office.jpg',
      url2: 'tasks.list({ myFilter : { misc: true } })',
      image2: '../modules/core/client/img/lego.png',
      url3: 'tasks.list({ myFilter : { marketing: true } })',
      image3: '../modules/core/client/img/category/ikeaEtece2.png'
    }];
    // var slidesUiSref = $scope.slidesUiSref = [
    //   {  }

    // ]
    $scope.user = Authentication.user;

  }
]);