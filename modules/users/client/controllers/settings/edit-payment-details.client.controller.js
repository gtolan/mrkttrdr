(function() {
  'use strict';
  Stripe.setPublishableKey('pk_live_nycjXdZVMuyCeshiayQ32Ljb');
  angular.module('users').controller('EditPaymentDetailsController',
    EditPaymentDetailsController);
  EditPaymentDetailsController.$inject = ['Authentication', '$scope',
    '$mdToast', '$document', '$animate', '$http', '$window'
  ];

  function EditPaymentDetailsController(Authentication, $scope, $mdToast,
    $document, $animate, $http, $window) {
    $window.Stripe.setPublishableKey('pk_live_nycjXdZVMuyCeshiayQ32Ljb');
    $scope.user = Authentication.user;

    $scope.onSubmit = function() {
      $scope.processing = true;
    };
    // console.log($scope.user._id);
    $scope.stripeCallback = function(code, result) {
      $scope.processing = false;
      $scope.hideAlerts();
      if (result.error) {
        $scope.stripeError = result.error.message;
      } else {
        var stripeToken = result.id;
        //        var stripeToken = stripeToken;
        var data = ({
          stripeToken: result.id,
          customerName: $scope.user.displayName,
          customerEmail: $scope.user.email,
          userId: user._id,
          result: result
        });
        $scope.createNewCustomer = function() {
          $http.post('/api/users/' + user._id + '/create-new-customer',
            data).success(function(stripeToken, data, status, headers,
            config) {
            swal("Success!",
              "You successfully saved your payment details!",
              "success");
          }).error(function(data, status, headers, config) {
            console.log(status);
            swal("Oops...", "Something went wrong!", "error");
          });
        };
        var updateData = ({
          stripeToken: result.id,
          customerId: $scope.user.stripeCustomerId,
          customerName: $scope.user.displayName,
          customerEmail: $scope.user.email,
          userId: user._id,
          result: result
        });
        $scope.updateCustomer = function() {
          $http.post('/api/users/' + user._id + '/update-customer',
            updateData).success(function(stripeToken, data, status,
            headers, config) {
            swal("Success!",
              "You successfully updated your payment details!",
              "success");
          }).error(function(data, status, headers, config) {
            console.log(status);
            swal("Oops...", "Something went wrong!", "error");
          });
        };
        $scope.createNewCustomer();
      }
    };
    $scope.customerCharges = function() {
      var data = ({
        customerId: $scope.user.stripeCustomerId
      });
      var stripeCustomerId = $scope.user.stripeCustomerId;
      // console.log(stripeCustomerId);
      $http.post('/api/users/' + $scope.user._id + '/customer-charges',
        data).success(function(res, data, status, headers, config) {
        $scope.customerCharges = res;
      }).error(function(res, data, status, headers, config) {
        // console.log(status);
        console.log('error');
      });
    };
    $scope.customerCharges();


    $scope.customerDetails = function() {
      var customerDetailsData = ({
        customerId: $scope.user.stripeCustomerId
      });
      var stripeCustomerId = $scope.user.stripeCustomerId;
      // console.log(stripeCustomerId);
      $http.post('/api/users/' + $scope.user._id + '/customer-details',
        customerDetailsData).success(function(res, data, status, headers, config) {
        $scope.customerDetails = res;
      }).error(function(res, data, status, headers, config) {
        // console.log(status);
        console.log('error');
      });
    };
    $scope.customerDetails();

    $scope.updateReceivePayment = function() {
      var receivePaymentsData = ({
        payPalEmail: user.payPalEmail
      });
      $http.post('/api/users/' + user._id + '/receive-payments',
        receivePaymentsData).success(function(stripeToken, data, status,
        headers, config) {
        swal("Success!",
          "You successfully updated your PayPal details!",
          "success");
      }).error(function(data, status, headers, config) {
        console.log(status);
        swal("Oops...", "Something went wrong!", "error");
      });
    };

    $scope.hideAlerts = function() {
      $scope.stripeError = null;
      $scope.stripeToken = null;
    };
  }
})();