'use strict';
angular.module('core').controller('AccordionValuesCtrl', ['$scope',
  function($scope) {
    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
  }
]);