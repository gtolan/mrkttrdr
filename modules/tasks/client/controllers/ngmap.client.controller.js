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
