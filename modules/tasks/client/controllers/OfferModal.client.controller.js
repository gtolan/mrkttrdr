(function() {
  'use strict';

  angular
    .module('tasks')
    .controller('ModalOfferCtrl', ModalOfferCtrl);

  ModalOfferCtrl.$inject = ['$scope', '$state', 'Authentication', 'Menus', '$modal', '$log', 'OffersService'];

  function ModalOfferCtrl($scope, $state, Authentication, Menus, $modal, $log, OffersService) {

    $scope.authentication = Authentication;

    newOffer.$inject = ['OffersService'];

    function newOffer(OffersService) {
      return new OffersService();
    }
    getTask.$inject = ['$stateParams', 'TasksService'];

    function getTask($stateParams, TasksService) {
      return TasksService.get({
        taskId: $stateParams.taskId
      }).$promise;
    }
    $scope.cancel = function() {
      // $modalInstance.dismiss('cancel');
      $scope.$dismiss();
    };

    $scope.open = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'myOfferModalContent.html',
        controller: 'TasksController',
        size: size,
        controllerAs: 'vm',
        resolve: {
          taskResolve: getTask,
          // I added on 22/04/16 02:30ish..
          offerResolve: newOffer
        },
      });
      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }
})();



(function() {
  'use strict';
  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.
  angular.module('tasks').controller('ModalOfferInstanceCtrl', function($scope,
    $modalInstance, $stateParams, TasksService, $http) {
    var modal = this;

    // modal.dimiss = function(reason) {
    //   $modalInstance.dismiss(reason);
    // };

    $scope.ok = function() {
      $modalInstance.close($scope.selected.item);
    };

    // $scope.cancel = function() {
    //   $modalInstance.dismiss('cancel');
    // };

  });

})();