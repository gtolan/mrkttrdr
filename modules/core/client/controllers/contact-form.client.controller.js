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