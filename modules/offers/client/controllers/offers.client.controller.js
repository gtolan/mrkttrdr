(function() {
  'use strict';

  // Offers controller
  angular
    .module('offers')
    .controller('OffersController', OffersController);

  OffersController.$inject = ['$scope', '$state', '$http', 'Authentication', 'offerResolve', '$modal', '$mdToast', '$animate'];

  function OffersController($scope, $state, $http, Authentication, offer, $modal, $mdToast, $animate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.offer = offer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    $scope.totalAmount = vm.offer.offerPrice;

    $scope.isReadonly = true;
    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };

    var numberOfReviews = vm.offer.offerUserAverage.length;
    $scope.numberOfReviews = numberOfReviews;

    var total = 0;
    var one = 0;
    var two = 0;
    var three = 0;
    var four = 0;
    var five = 0;

    var offerUserAverage = vm.offer.offerUserAverage;

    for (var i = 0; i < offerUserAverage.length; i++) {
      if (offerUserAverage[i].rating === 1) {
        one += +1;
      } else if (offerUserAverage[i].rating === 2) {
        two += +1;
      } else if (offerUserAverage[i].rating === 3) {
        three += +1;
      } else if (offerUserAverage[i].rating === 4) {
        four += +1;
      } else if (offerUserAverage[i].rating === 5) {
        five += +1;
      }
      total += +offerUserAverage[i].rating;
      // console.log('total is ' + total);
      // console.log(five);
    }
    var userAverage = total / numberOfReviews;
    $scope.userAverage = userAverage;
    // console.log(userAverage);

    //toast  
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
    // end of toast
    $scope.checkout = function() {
      $modal.open({
        templateUrl: 'modules/offers/client/views/checkout.client.view.html',
        controller: 'CheckoutCtrl',
        resolve: {
          totalAmount: $scope.totalAmount,
          offer: offer
        }
      });
    };

    // Remove existing Offer
    function remove() {
      if (confirm('¿Estás seguro que quieres borrar la oferta?')) {
        vm.offer.$remove($state.go('offers.list'));
      }
    }

    // Save Offer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.offerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.offer._id) {
        vm.offer.$update(successCallback, errorCallback);
      } else {
        vm.offer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('offers.view', {
          offerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    //newcomment
    vm.newCo = function() {
      //new comment email alert
      vm.commentAlert = function() {
        function errorCallback(res) {
          vm.error = res.data.message;
        }

        //if logged in user is the task owner, set data vars as follows:  
        if (vm.authentication.user._id === vm.offer.taskOwnerUser) {
          var dataTaskOwner = ({
            contactName: vm.authentication.user.displayName,
            emailFrom: 'contact@taskmatch.ie',
            emailTo: vm.offer.offerOwnerEmail,
            messageTo: vm.offer.user.displayName,
            offerTitle: vm.offer.offerDesc,
            taskName: vm.offer.taskName,
            offerId: vm.offer._id,
            //            taskId: vm.offer._id,
            //            taskOwner: vm.offer.user.displayName,
            commentOwner: vm.authentication.user.displayName,
            comment: vm.offer.newComment
          });
          $http.post('/api/offers/' + offer._id + '/comment-alert',
            dataTaskOwner).success(function(data, status, headers,
            config) {
            // console.log('comment alert email has been sent');
            $mdToast.show($mdToast.simple().content('¡Gracias, ' +
              data.contactName +
              '! Has publicado un comentario con éxito').position(
              $scope.getToastPosition()).hideDelay(5000));
          });
          //if logged in user is the offer owner, set data vars as follows:      
        } else if (vm.authentication.user._id === vm.offer.user._id) {
          var dataOfferOwner = ({
            contactName: vm.authentication.user.displayName,
            emailFrom: 'contact@taskmatch.ie',
            emailTo: vm.offer.taskOwnerEmail,
            messageTo: vm.offer.taskOwnerDisplayName,
            offerTitle: vm.offer.offerDesc,
            taskName: vm.offer.taskName,
            //taskId: vm.offer._id,
            offerId: vm.offer._id,
            //taskOwner: vm.offer.user.displayName,
            commentOwner: vm.authentication.user.displayName,
            comment: vm.offer.newComment
          });
          $http.post('/api/offers/' + offer._id + '/comment-alert',
            dataOfferOwner).success(function(data, status, headers,
            config) {
            // console.log('comment alert email has been sent');
            $mdToast.show($mdToast.simple().content('¡Gracias, ' +
              data.contactName +
              '! Has publicado un comentario con éxito').position(
              $scope.getToastPosition()).hideDelay(5000));
          });
        } //end elseif
      }; //end new comment alert 
      $http.post('/api/offers/' + offer._id + '/new-comment', {
        comment: {
          comment: vm.offer.newComment,
          user: vm.authentication.user,
          profileImageURL: vm.authentication.user.profileImageURL,
          displayName: vm.authentication.user.displayName
        }
      }).then(successCallback, errorCallback);

      function successCallback(res) {
        vm.commentAlert();
        $state.transitionTo($state.current, $state.params, {
          reload: true,
          inherit: false,
          notify: true
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }; //close new comment function
    // on click of 'assign button' this is will 'offerAccepted' to true
    vm.assignTaskToThisUser = function() {
      vm.taskAssigned = function() {
        $http.put('/api/tasks/' + offer.taskId + '/status', {
          statusAssigned: true
        }).then(successCallback, errorCallback);
        swal('¡Enhorabuena!', '¡Has aceptado la oferta con éxito', 'success');

        function successCallback(res) {}

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      };
      vm.offerAccepted = function() {
        var data = ({
          contactName: vm.offer.displayName,
          emailFrom: 'contact@taskmatch.ie',
          emailTo: vm.offer.offerOwnerEmail,
          offerOwner: vm.offer.displayName,
          offerDesc: vm.offer.offerDesc,
          offerId: vm.offer._id,
          taskName: vm.offer.taskName,
          taskId: vm.offer.taskId,
          taskOwner: vm.authentication.user.displayName,
          subject: 'Your offer has been accepted on ' + vm.offer.taskName +
            ' - Get started ASAP!'
        });
        $http.post('/api/offers/' + offer._id + '/offer-accepted', data)
          .success(function(data, status, headers, config) {
            $state.transitionTo($state.current, $state.params, {
              reload: true,
              inherit: false,
              notify: true
            });
          });

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }; //end offer accepted alert 
      $http.post('/api/offers/' + offer._id, {
        offerAccepted: true
      }).then(successCallback, errorCallback);
      // console.log('You successfully accepted this offer!');

      function successCallback(res) {
        vm.offerAccepted();
        vm.taskAssigned();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }; //offer accepted == true
    // on click of 'assign button' this is will 'offerAccepted' to true
    vm.markTaskCompleted = function() {

      //start of leave a new review alert -- for offer owner, to leave review about task owner 
      vm.leaveAReviewAlert = function() {
        var data = ({
          subject: vm.offer.taskOwnerDisplayName + ' marked your offer as completed! Leave them a review now!',
          contactName: vm.offer.displayName,
          taskOwner: vm.offer.taskOwnerDisplayName,
          offerId: vm.offer._id,
          taskId: vm.offer.taskId,
          offerDesc: vm.offer.offerDesc,
          taskName: vm.offer.taskName,
          emailFrom: 'contact@taskmatch.ie', //vm.authentication.user.email,
          emailTo: vm.offer.offerOwnerEmail //vm.task.email, //-- still relevant
        });
        $http.post('/api/offers/' + offer._id + '/leave-a-new-review-alert', data).success(
          function(data, status, headers, config) {
            // console.log('sent');
          });

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }; //end leave a new review alert  

      $http.post('/api/tasks/' + offer.taskId + '/status', {
        statusClosed: true
      }).then(successCallback, errorCallback);
      swal('¡Enhorabuena!', '¡Has cumplido la tarea con éxito!', 'success');

      function successCallback(res) {
        vm.leaveAReviewAlert();
        $state.go('offers.review', {
          offerId: offer._id
        }); ///:offerId/accepted
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }; // end of mark task as completed


    // new review from the task owner to the offer owner user
    vm.newTaskReview = function() {

      //start of new review alert for the offer owner
      vm.reviewAlert = function() {
        var data = ({
          contactName: vm.authentication.user.displayName,
          emailFrom: 'contact@taskmatch.ie', //vm.authentication.user.email,
          emailTo: vm.offer.offerOwnerEmail, //vm.task.email, //-- still relevant
          contactMessage: 'Hi, ' + vm.offer.user.displayName +
            '! \n ' + vm.authentication.user.displayName +
            ' has left the following review: " ' + vm.review.comment +
            '" for your task "' + vm.offer.taskName +
            '" Login to Taskmatch.ie to view the review on your public profile. \n -- Thanks! from the Taskmatch.ie team'
        });
        $http.post('/api/offers/' + offer._id + '/review-alert', data).success(
          function(data, status, headers, config) {
            console.log('sent');
            $mdToast.show($mdToast.simple().content(
              'Gracias por tu reseña ' + data.contactName).position(
              $scope.getToastPosition()).hideDelay(5000));
          });

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }; //end new review alert for the offer owner

      // var user = $scope.user;
      // var reviewUser = vm.offer.taskOwnerUser; - this is if you wanna post into task owner
      var reviewUser = vm.offer.user._id; //this is for the offer owner - from task owner to offer owner review
      // leave a review for the person who created the task, left by the task runner/ task completer -- left for the taskOwnerUser, by the authentication user
      $http.post('/api/users/' + reviewUser, {
        review: {
          rating: vm.review.rating,
          comment: vm.review.comment,
          reviewFor: vm.offer.user._id,
          reviewBy: vm.authentication.user,
          displayName: vm.authentication.user.displayName, //who review is by --display name
          profileImageURL: vm.authentication.user.profileImageURL,
          taskId: vm.offer.taskId,
          taskName: vm.offer.taskName,
          offerId: vm.offer._id
        }
      }).then(successCallback, errorCallback);

      function successCallback(res) {
        vm.reviewAlert();
        swal('¡Enhorabuena!', 'Has dejado una reseña con éxito', 'success');
        $state.go('profile', {
          userId: vm.offer.user._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        alert('No ha funcionado' + res.data.message);
      }
    }; //end of the review from the task owner user to the offer owner user

    //new review from the offer owner to the task owner
    vm.newOfferTaskReview = function() {


      vm.markTaskOwnerReviewCompleted = function() {
        $http.post('/api/offers/' + offer._id + '/taskowner-review-completed', {
          taskOwnerReviewed: true
        }).then(successCallback, errorCallback);

      function successCallback(res) {
        // console.log('You successfully completed the review for this offer!');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        console.log(vm.error);
      }
      };

      //start of new review alert 
      vm.taskOwnerReviewAlert = function() {
        var data = ({
          contactName: vm.offer.taskOwnerDisplayName,
          emailFrom: 'contact@taskmatch.ie', //vm.authentication.user.email,
          emailTo: vm.offer.taskOwnerEmail,
          contactMessage: 'Hi, ' + vm.offer.taskOwnerDisplayName +
            '! \n ' + vm.offer.user.displayName +
            ' has left the following review: " ' + vm.review.comment +
            '" for your task "' + vm.offer.taskName +
            '" Login to Taskmatch.ie to view the review on your public profile. \n -- Thanks! from the Taskmatch.ie team'
        });
        $http.post('/api/offers/' + offer._id + '/taskOwner-review-alert', data).success(
          function(data, status, headers, config) {
            console.log('sent');
            $mdToast.show($mdToast.simple().content(
              'Gracias por tu reseña ' + data.contactName).position(
              $scope.getToastPosition()).hideDelay(5000));
          });

        function errorCallback(res) {
          vm.error = res.data.message;
        }
      }; //end new review alert  

      // var user = $scope.user;
      // var reviewUser = vm.offer.taskOwnerUser; - this is if you wanna post into task owner
      var reviewUser = vm.offer.taskOwnerUser; //this is for the task owner - from offer owner
        // leave a review for the person who created the task, left by the task runner/ task completer -- left for the taskOwnerUser, by the authentication user
      $http.post('/api/users/' + reviewUser, {
        review: {
          rating: vm.review.rating,
          comment: vm.review.comment,
          reviewFor: vm.offer.taskOwnerUser,
          reviewBy: vm.authentication.user,
          displayName: vm.authentication.user.displayName, //who the review is by - displayName
          profileImageURL: vm.authentication.user.profileImageURL,
          taskId: vm.offer.taskId,
          taskName: vm.offer.taskName,
          offerId: vm.offer._id
        }
      }).then(successCallback, errorCallback);

      function successCallback(res) {
        vm.taskOwnerReviewAlert();
        vm.markTaskOwnerReviewCompleted();
        swal('¡Enhorabuena!', 'Has dejado una reseña con éxito', 'success');
        $state.go('profile', {
          userId: vm.offer.taskOwnerUser
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        alert('No ha funcionado' + res.data.message);
      }
    }; //new review from the offer owner to the task owner
  }
})();