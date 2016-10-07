'use strict';
angular.module('core').controller('ModalLoginCtrl', ['$scope', '$state',
  'Authentication', 'Menus', '$modal', '$log',
  function($scope, $state, Authentication, Menus, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function() {
            return $scope.items;
          }
        }
      });
      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }
]);
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
angular.module('core').controller('ModalInstanceCtrl', function($scope, Authentication,
  $modalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };
  $scope.authentication = Authentication;
  $scope.ok = function() {
    $modalInstance.close($scope.selected.item);
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});