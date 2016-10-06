'use strict';

angular.module('users').controller('UserReviewsCtrl', ['$scope', '$http', 'Authentication',
  function($scope, $http, Authentication) {

    var user = Authentication.user._id;

    $scope.isReadonly = true;
    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };

    var one = 0;
    var two = 0;
    var three = 0;
    var four = 0;
    var five = 0;
    // $scope.oneStars = one;
    // $scope.twoStars = two;
    // $scope.threeStars = three;
    // $scope.fourStars = four;
    // $scope.fiveStars = five;
    $scope.five = 5;
    $scope.four = 4;
    $scope.three = 3;
    $scope.two = 2;
    $scope.one = 1;

    $http.get('api/users/' + user).then(function(response) {
      // get all info on the user

      $scope.user = response.data;

      var profileUserName = response.data.displayName;
      var profileUserEmail = response.data.email;

      var userReviews = response.data.reviews;
      var numberOfReviews = userReviews.length;

      // if (!response.data.reviews) {
      //   var numberOfReviews = 0;
      // }
      $scope.numberOfReviews = numberOfReviews;
      var total = 0;
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
           // console.log(five);
           // console.log($scope.fiveStars);
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

  }
]);