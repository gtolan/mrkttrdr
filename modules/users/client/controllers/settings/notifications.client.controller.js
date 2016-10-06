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