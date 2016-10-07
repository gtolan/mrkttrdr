(function() {
  'use strict';

  angular.module('offers').controller('PaymentsController',
    PaymentsController).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('blue-grey');
  });
  PaymentsController.$inject = ['offerResolve', '$scope', '$state',
    'Authentication', '$http', '$mdToast', '$document', '$animate',
    '$location', '$rootScope', '$modal', '$window'
  ];

  function PaymentsController(offer, $scope, $state, Authentication, $http,
    $mdToast, $document, $animate, $location, $rootScope, $modal, $window) {
    $window.Stripe.setPublishableKey('pk_live_nycjXdZVMuyCeshiayQ32Ljb');
    // $window.Stripe.setPublishableKey('pk_test_rruSvaA8uHVcF1VISPEY8xFD');
    var vm = this;
    vm.authentication = Authentication;
    vm.offer = offer;
    $scope.amount = vm.offer.offerPrice + vm.offer.offerExpenses;
    // $scope.totalAmount = vm.offer.offerPrice;
    //    $scope.taskName = vm.offer.taskName;
    //    $scope.taskRunner = vm.offer.displayName;
    $scope.owner = vm.offer.user._id;
    // $scope.offerId = vm.offer._id;
    $scope.ownerName = vm.offer.user.displayName;
  }
})();


//CheckoutCtrl
(function() {
  'use strict';
  angular.module('offers').controller('CheckoutCtrl', CheckoutCtrl).config(
    function($mdThemingProvider) {
      $mdThemingProvider.theme('default').primaryPalette('blue-grey');
    });
  CheckoutCtrl.$inject = ['Authentication', '$scope', 'totalAmount', 'offer',
    '$mdToast', '$document', '$animate', '$http', '$state'
  ];

  function CheckoutCtrl(Authentication, $scope, totalAmount, offer, $mdToast,
    $document, $animate, $http, $state) {

    var vm = this;
    vm.offer = offer;
    $scope.user = Authentication.user;
    $scope.totalAmount = totalAmount;

    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition).filter(function(pos) {
        return $scope.toastPosition[pos];
      }).join(' ');
    };

    $scope.processing = false;

    $scope.cancel = function() {
      $scope.$dismiss();
    };

    // start newCharge function
    $scope.newCharge = function() {

      $scope.processing = true;

      var data = ({
        contactName: this.contactName,
        customerId: $scope.user.stripeCustomerId,
        totalAmount: $scope.totalAmount
      });

      $http.post('/api/offers/' + offer._id + '/new-charge', data)
        .success(function(res, charge, data, status,
          headers, config) {
          $scope.processing = false;
          $scope.success = true;
          $scope.taskPaid();
          $scope.paymentSuccess();
          swal('Congratulations!', 'You successfully paid to have your task completed! \n You can now contact the offer user to arrange task details. \n Remember to mark the task as completed to release TaskMatch funds', 'success');
          $scope.cancel();
          $scope.taskPaid();
          $scope.offerPaid();
          $state.go('offers.accepted', {
            offerId: offer._id
          });
        }).error(function(res, charge, data, status, headers, config) {
          sweetAlert('Oops...', 'Something went wrong!', 'error');
        });
    }; //end newCharge function

    $scope.taskPaid = function() {
      $http.post('/api/tasks/' + vm.offer.taskId + '/status-paid', {
        statusPaid: true
      }).then(successCallback, errorCallback);
      // swal("Success!", "You successfully accepted this offer!", "success");
      console.log('paid');

      function successCallback(res) {}

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
    $scope.offerPaid = function() {
      $http.put('/api/offers/' + vm.offer._id + '/status-paid', {
        statusPaid: true
      }).then(successCallback, errorCallback);
      // swal("Success!", "You successfully accepted this offer!", "success");
      console.log('marked the offer as status paid');

      function successCallback(res) {}

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
    // // //start paymentSuccess
    $scope.paymentSuccess = function() {
      var data = ({
        //contactName: vm.offer.user.displayName,
        emailFrom: 'contact@taskmatch.ie',
        emailTo: vm.offer.taskOwnerEmail,
        offerOwner: vm.offer.displayName,
        offerDesc: vm.offer.offerDesc,
        offerId: vm.offer._id,
        taskName: vm.offer.taskName,
        taskId: vm.offer.taskId,
        // taskOwner: $scope.user.displayName,
        subject: 'You successfully paid for ' + vm.offer.offerDesc + ' on your task ' + vm.offer.taskName,
      });

      $http.post('/payment-success', data)
        .success(function(data, status, headers, config) {
          $mdToast.show(
            $mdToast.simple()
            .content('Thanks for your payment ' + data.taskOwner)
            .position($scope.getToastPosition())
            .hideDelay(5000)
          );
        })
        .error(function(data, status, headers, config) {

        });
    };
    // // //end paymentSuccess
    $scope.hideAlerts = function() {
      $scope.stripeError = null;
      $scope.stripeToken = null;
    };
  }
})();