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