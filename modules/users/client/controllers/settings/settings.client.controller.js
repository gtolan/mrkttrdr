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
