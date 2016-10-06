(function() {
  'use strict';
  angular.module('users').controller('messagesController',
    messagesController);

  messagesController.$inject = ['TasksService', 'OffersService',
    '$scope', '$stateParams', '$filter', '$http', 'Authentication', '$rootScope'
  ];

  function messagesController(TasksService, OffersService, $scope,
    $stateParams, $filter, $http, Authentication, $rootScope) {

    var vm = this;
    var userId = Authentication.user._id;
    vm.user = Authentication.user;

    vm.tasks = TasksService.query();

    $http.get('api/offers').then(function(response) {

      var myOffers = [];

      var offersMessages = response.data;
      for (var i = 0; i < offersMessages.length; i++) {
        if (offersMessages[i].taskOwnerUser == userId) {
          myOffers.push(offersMessages[i]);
        }
      }
      $scope.myOffers = myOffers;
    });

  }
})();