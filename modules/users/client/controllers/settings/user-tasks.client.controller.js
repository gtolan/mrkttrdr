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