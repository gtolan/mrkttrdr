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
        return Object.getOwnPropertyNames(element).find(function(x) {
          return x === search.substring(0, 2);
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