'use strict';
angular.module('users').controller('publicProfileSettings', ['$scope', '$http',
  '$location', 'Users', 'Authentication', '$modal', '$rootScope', '$filter',
  function($scope, $http, $location, Users, Authentication, $modal, $rootScope, $filter) {
    var user = $location.path();
    var userid = user.split("/");
    var orderBy = $filter('orderBy');
    $scope.predicate = 'created';
    $scope.reverse = true;
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse :
        false;
      $scope.predicate = predicate;
    };
    // console.log(userid[1]); -- user._id without '/'
    //console.log(Authentication.user); // the logged in user

    window.fbAsyncInit = function() {
      FB.init({
        appId: '564444857062476',
        xfbml: true,
        version: 'v2.7'
      });
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          console.log('Logged in.');
          //this is also currently resolving to the logged in user, however, it will be used to check against the user profile page with the logged in user... 
          //          FB.api('/' + Authentication.user.providerData.id + '/friends', 'GET', {},
          //            function(response) {
          //              var friendsOfFriends = response;
          //              console.log(friendsOfFriends);
          //            });
          FB.api(
            //"/{user-id}",
            "/" + $rootScope.profileUser.additionalProvidersData.facebook.id, { //this is resolving to the logged in users mutual friends, not the profile users mutual friends
              "fields": "context.fields(mutual_friends)"
            },
            function(response) {
              if (response && !response.error) {
                /* handle the result */
                var friendsofFriends = response;
                // console.log(friendsofFriends);
                // console.log(friendsofFriends.context.mutual_friends.data);
                // console.log(friendsofFriends.context.mutual_friends.data.length);
                var mutualFriendsNames = response.context.mutual_friends.data;
                var friendsofFriendsLength = friendsofFriends.context.mutual_friends.data.length;
                $scope.friendsofFriendsLength = friendsofFriendsLength;

                var profileMutualFriendsArray = [];

                for (var i = 0; i < mutualFriendsNames.length; i++) {
                  profileMutualFriendsArray.push(mutualFriendsNames[i].name);
                }

                $scope.profileMutualFriendsArray = profileMutualFriendsArray;
                console.log(profileMutualFriendsArray);
              }
            }
          );
        } else {
          //FB.login();
          console.log('not logged in with facebook');
        }
      });
    };
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));



    $http.get('api/users' + user).then(function(response) {
      // get all info on the user

      $scope.user = response.data;
      $rootScope.profileUser = response.data;
      // console.log($rootScope.profileUser);
      // console.log($rootScope.profileUser.additionalProvidersData);
      // console.log($rootScope.profileUser.additionalProvidersData.facebook.id);


      var profileUserName = response.data.displayName;
      var profileUserEmail = response.data.email;

      var userReviews = response.data.reviews;
      var numberOfReviews = userReviews.length;

      if (!response.data.reviews) {
        var numberOfReviews = 0;
      }
      $scope.numberOfReviews = numberOfReviews;
      var total = 0;
      // $scope.one = 1;
      var one = 0;
      var two = 0;
      var three = 0;
      var four = 0;
      var five = 0;
      for (var i = 0; i < userReviews.length; i++) {
        // console.log('I was rated ' + userReviews[i].rating);
        if (userReviews[i].rating === 1) {
          one += +1;
        } else if (userReviews[i].rating === 2) {
          two += +1;
        } else if (userReviews[i].rating === 3) {
          three += +1;
        } else if (userReviews[i].rating === 4) {
          four += +1;
        } else if (userReviews[i].rating === 5) {
          five += +1;
        }
        total += +userReviews[i].rating;
      }
      //      console.log(five);
      //      console.log(four);
      $scope.oneStars = one;
      $scope.twoStars = two;
      $scope.threeStars = three;
      $scope.fourStars = four;
      $scope.fiveStars = five;
      //      console.log(total); //accumlated total of all ratings
      //      console.log(total/numberOfReviews); //average user rating
      var userAverage = total / numberOfReviews;
      $scope.userAverage = userAverage;
      // console.log(userAverage);
      var positiveRating = (userAverage / 5) * 100;
      $scope.positiveRating = positiveRating;
      //      console.log(positiveRating);
    }); //end of get profile user request


    // scope settings for the stars tally
    $scope.five = 5;
    $scope.four = 4;
    $scope.three = 3;
    $scope.two = 2;
    $scope.one = 1;
    var allUserReviews = false;
    var userAverageRating = true;
    // $scope.rate = 5;
    $scope.max = 5;
    // rating on profile page is readonly. 
    $scope.isReadonly = true;
    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };
    //get tasks that were created by the user
    $http.get('api/tasks').then(function(response) {
      var respTasks = response.data;
      // console.log(respTasks);
      var taskTitles = [];
      var taskComments = [];
      var postedTasksTotal = 0;
      var completedTasksTotal = 0;
      var commentsPosted = 0;
      for (var i = 0; i < respTasks.length; i++) {
        // console.log(respTasks[i].title + ' task posted by ' + respTasks[i].user._id);
        if (respTasks[i].user._id == userid[1]) {
          console.log(respTasks[i].title + ' task posted by ' + respTasks[i].user._id);
          postedTasksTotal += +1;
          // console.log(postedTasksTotal);
          taskTitles.push(respTasks[i].title);

          if (respTasks[i].statusClosed === true) {
            completedTasksTotal += +1;
            // console.log(completedTasksTotal);
          }
        }
        $scope.completedTasksTotal = completedTasksTotal;
        $scope.postedTasksTotal = postedTasksTotal;
        console.log(completedTasksTotal);
      }

      var authenticatedUser = Authentication.user;
      console.log(authenticatedUser);
      console.log(user);
      $scope.authenticatedUser = authenticatedUser;
      $scope.taskTitles = taskTitles;

      $scope.requestAQuote = function() {
        $modal.open({
          templateUrl: 'modules/users/client/views/public-profile/request-quote.client.view.html',
          controller: 'requestAQuoteController',
          resolve: {
            profileUser: $rootScope.profileUser
          }
        });
      };

      $scope.uploadCoverPhoto = function() {
        $modal.open({
          templateUrl: 'modules/users/client/views/settings/change-cover-picture.client.view.html',
          controller: 'ChangeProfileCoverPictureController',
          resolve: {
            profileUser: $rootScope.profileUser
          }
        });
      };

    });//end of get tasks
  }
]);

'use strict';
angular.module('users').controller('requestAQuoteController', ['$scope', '$http',
  '$location', 'Users', 'Authentication', '$modal', 'profileUser', '$mdToast',
  function($scope, $http, $location, Users, Authentication, $modal, profileUser, $mdToast) {
    var user = Authentication.user;
    // console.log(profileUserEmail);
    // console.log(profileUser);

    //get tasks that were created by the user
    $http.get('api/tasks').then(function(response) {

      var respTasks = response.data;
      var taskTitles = [];
      var postedTasksTotal = 0;

      for (var i = 0; i < respTasks.length; i++) {
        if (respTasks[i].user._id === user._id) {

          // console.log(respTasks[i].title + ' task posted by ' + respTasks[i].user._id);
          postedTasksTotal += +1;
          taskTitles.push({
            title: respTasks[i].title,
            id: respTasks[i]._id
          });

        }
      }
      $scope.postedTasksTotal = postedTasksTotal;
      $scope.taskTitles = taskTitles;
      // console.log(taskTitles);
    });

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

    $scope.requestAQuoteAlert = function() {
      var data = ({
        contactName: profileUser.displayName,
        emailFrom: 'contact@taskmatch.ie',
        emailTo: profileUser.email,
        taskName: $scope.selectedTask.title,
        taskId: $scope.selectedTask.id,
        taskOwner: user.displayName
          // commentOwner: vm.authentication.user.displayName,
          // comment: vm.task.newComment,
      });
      $http.post('/api/users/' + user._id + '/request-quote-alert', data).success(
        function(data, status, headers, config) {
          swal("Success!",
              "You successfully requested a quote!",
              "success");
          $mdToast.show($mdToast.simple().content('Thanks, ' + user.displayName +
            '! You successfully requested a quote from ' + profileUser.displayName).position(
            $scope.getToastPosition()).hideDelay(5000));
        });

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
]);