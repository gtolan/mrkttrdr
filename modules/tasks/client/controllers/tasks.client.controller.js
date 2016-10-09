(function() {
    'use strict';
    /*global escape: true */
    // Tasks controller
    moment.locale('es');

    angular.module('tasks').config(function($mdDateLocaleProvider) {

        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD/MM/YYYY');
        };
        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
    }).controller('ModalTaskCtrl', ModalTaskCtrl);
    ModalTaskCtrl.$inject = ['$scope', '$state', 'Authentication',
        'TasksService', '$modal', '$log', '$http'
    ];

    function ModalTaskCtrl($scope, $state, Authentication, TasksService,
        $modal, $log, $http) {
        newTask.$inject = ['TasksService'];

        function newTask(TasksService) {
                return new TasksService();
            }
            /* controller for drop button */
        $scope.authentication = Authentication;
        $scope.status = {
            isopen: false
        };
        $scope.toggled = function(open) {
            $log.log('Dropdown is now: ', open);
        };
        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };
        /* drop button end */
        $scope.cancel = function() {
            $scope.$dismiss();
        };
        $scope.myDate = new Date();
        $scope.minDate = new Date($scope.myDate.getFullYear(), $scope.myDate
            .getMonth() - 2, $scope.myDate.getDate());
        $scope.maxDate = new Date($scope.myDate.getFullYear(), $scope.myDate
            .getMonth() + 2, $scope.myDate.getDate());
        var app = this;
        /* nacho  modcontrol */
        app.closeAlert = function() {
            app.reason = null;
        };
        app.open = function(size) {
            var modalInstance = $modal.open({
                templateUrl: '../modules/tasks/client/views/createTaskModal.client.view.html',
                controller: 'TasksController',
                controllerAs: 'vm',
                resolve: {
                    taskResolve: newTask
                },
                size: size
            });
            modalInstance.result.then(function(data) {
                app.closeAlert();
                app.summary = data;
            }, function(reason) {
                app.reason = reason;
            });
        };
    }
})();
(function() {
    'use strict';
    // Tasks controller
    angular.module('tasks').controller('TasksController', TasksController).filter(
        'customFilter', function() {
            return function(items, search) {
                if (!search) {
                    return items;
                }
                return items.filter(function(element) {
                    // Ex: moving: true, becomes just 'moving'
                    //                return Object.getOwnPropertyNames(
                    //                    element).find(x => x == search.substring(
                    //                    0, search.indexOf(':')));
                    return Object.getOwnPropertyNames(
                        element).find(function(x) {
                        return x === search.substring(
                            0, search.indexOf(
                                ':'));
                    });
                });
            };
        });
    TasksController.$inject = ['$scope', '$state', 'Authentication',
        'taskResolve', '$http', '$modal', '$mdToast', '$animate'
    ];

    function TasksController($scope, $state, Authentication, task, $http,
        $modal, $mdToast, $animate) {
        $scope.minDate = new Date();
        $scope.format = 'dd/MM/yyyy';
        $scope.altInputFormats = ['d!/M!/yyyy'];
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var vm = this;
        vm.authentication = Authentication;
        vm.task = task;
        vm.created = moment(vm.task.created, "YYYY MM DD, h:mm:ss a").fromNow();
        vm.today = moment().format('MMMM Do YYYY, h:mm:ss a');
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        // $scope.locationCollapsed = true;
        vm.locationCollapsed = false;
        $scope.isReadonly = true;
        $scope.cancel = function() {
            // $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };
        $scope.data = {
                model: null
            }
            // vm.task.cleaning = true;
        $scope.taskCategories = [{
            'cat': 'Cleaning',
            'model': 'vm.task.cleaning',
            'value': true
        }, {
            'cat': 'Moving & Delivery',
            'model': 'vm.task.moving'
        }, {
            'cat': 'DIY',
            'model': 'vm.task.DIY'
        }, {
            'cat': 'Marketing & Design',
            'model': 'vm.task.marketing'
        }, {
            'cat': 'Online & IT',
            'model': 'vm.task.online'
        }, {
            'cat': 'Events & Photography',
            'model': 'vm.task.photoEvents'
        }, {
            'cat': 'Business & Admin',
            'model': 'vm.task.office'
        }, {
            'cat': 'Fun & Quirky',
            'model': 'vm.task.funQuirky'
        }, {
            'cat': 'Misc & Other',
            'model': 'vm.task.misc'
        }];

        function remove() {
                swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this task!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel please!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function(isConfirm) {
                    if (isConfirm) {
                        swal("Deleted!",
                            "La tarea ha sido borrada",
                            "success");
                        vm.task.$remove().then(function() {
                            $state.go('tasks.list', {}, {
                                reload: true
                            });
                        });
                    } else {
                        swal("Anulado", "La tarea está sana y salva",
                            "error");
                    }
                });
            }
            // Save Task

        function save(isValid) {
                if (!isValid) {
                    $scope.$broadcast('show-errors-check-validity',
                        'vm.form.taskForm');
                    return false;
                }
                // TODO: move create/update logic to service
                if (vm.task._id) {
                    vm.task.$update(successCallback, errorCallback);
                } else {
                    vm.task.$save(successCallback, errorCallback);
                }

                function successCallback(res) {
                    // $state.go('tasks.view', {
                    //     taskId: res._id
                    // });

                    $state.go('tasks.view', {taskId: res._id}, {
                                reload: true
                            });

                }

                function errorCallback(res) {
                    vm.error = res.data.message;
                }
            } //end of Save function
            //toast  
        $scope.toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition).filter(
                function(pos) {
                    return $scope.toastPosition[pos];
                }).join(' ');
        };
        // end of toast
        //newcomment
        vm.newCo = function() {
            //new comment email alert
            vm.commentAlert = function() {
                var data = ({
                    contactName: vm.authentication.user
                        .displayName,
                    emailFrom: 'contact@taskmatch.ie',
                    emailTo: vm.task.email,
                    taskName: vm.task.title,
                    taskId: vm.task._id,
                    taskOwner: vm.task.user.displayName,
                    commentOwner: vm.authentication.user
                        .displayName,
                    comment: vm.task.newComment,
                    contactMessage: 'Hi, ' + vm.task.user
                        .displayName + '! \n ' + vm.authentication
                        .user.displayName +
                        ' has left the following comment: " ' +
                        vm.task.newComment +
                        '" on your task "' + vm.task.title +
                        '" Login to Taskmatch.ie to view your task. \n -- Thanks! from the Taskmatch.ie team'
                });
                $http.post('/api/tasks/' + task._id +
                    '/comment-alert', data).success(
                    function(data, status, headers, config) {
                        // alert('comment alert email has been sent');
                        $mdToast.show($mdToast.simple().content(
                                '¡Gracias, ' + data.contactName +
                                '! Has publicado un comentario con éxito'
                            ).position($scope.getToastPosition())
                            .hideDelay(5000));
                    });

                function errorCallback(res) {
                    vm.error = res.data.message;
                }
            }; //end new comment alert 
            $http.post('/api/tasks/' + task._id, {
                comment: {
                    comment: vm.task.newComment,
                    user: vm.authentication.user,
                    profileImageURL: vm.authentication.user
                        .profileImageURL,
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
        //new offer
        vm.newOffer = function() {
            //send offer alert email    
            vm.offerAlert = function() {
                var data = ({
                    contactName: vm.authentication.user
                        .displayName,
                    emailFrom: 'contact@taskmatch.ie',
                    emailTo: vm.task.email,
                    taskOwner: vm.task.user.displayName,
                    offerOwner: vm.authentication.user.displayName,
                    offerDesc: vm.offer.offerDesc,
                    taskName: vm.task.title,
                    taskId: vm.task._id,
                    offerId: vm.offer._id
                });
                $http.post('/api/tasks/' + task._id +
                    '/offer-alert', data).success(function(
                    data, status, headers, config) {
                    // console.log('sent');
                    $mdToast.show($mdToast.simple().content(
                        'Gracias por tu oferta ' +
                        data.contactName).position(
                        $scope.getToastPosition()
                    ).hideDelay(5000));
                });

                function errorCallback(res) {
                    vm.error = res.data.message;
                }
            }; //end new offer alert    
            //new offer    
            $http.post('/api/offers', {
                taskId: vm.task._id,
                taskName: vm.task.title,
                taskDesc: vm.task.taskDesc,
                taskOwnerUser: vm.task.user,
                taskOwnerDisplayName: vm.task.user.displayName,
                taskOwnerEmail: vm.task.email,
                taskOwnerAbout: vm.task.about,
                taskOwnerAdditionalProvidersData: vm.task.additionalProvidersData,
                offerUser: vm.authentication.user,
                offerUserAverage: vm.authentication.user.reviews,
                offerOwnerEmail: vm.authentication.user.email,
                offerOwnerTelephone: vm.authentication.user
                    .phoneNumber,
                offerOwnerPayPal: vm.authentication.user.payPalEmail,
                taskOwnerUserProfileImageURL: vm.task.profileImageURL,
                offerDesc: vm.offer.offerDesc,
                offerPrice: vm.offer.offerPrice,
                // offerExpenses: vm.task.expenses,
                offerDate: vm.offer.offerDate,
                displayName: vm.authentication.user.displayName,
                profileImageURL: vm.authentication.user.profileImageURL,
                about: vm.authentication.user.about,
                provider: vm.authentication.user.provider,
                providerData: vm.authentication.providerData,
                additionalProvidersData: vm.authentication.user
                    .additionalProvidersData,
            }).then(successCallback, errorCallback);

            function successCallback(res) {
                swal("¡Enhorabuena!",
                    "¡Has enviado una oferta con éxito!",
                    "success");
                vm.offerAlert();
                $scope.$dismiss();
                $state.transitionTo($state.current, $state.params, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        };
        //close new offer function
        //facebook share this task
        $scope.fbshareCurrentPage = function() {
            window.open(
                'https://www.facebook.com/sharer/sharer.php?u=' +
                escape(window.location.href) + '&t=' + document
                .title, '',
                'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
            );
            return false;
        };
        //facebook share this task
        //report this task
        //$scope.toastPosition = {
        //      bottom: true,
        //      top: false,
        //      left: false,
        //      right: true
        //    };
        //      
        //    $scope.getToastPosition = function() {
        //      return Object.keys($scope.toastPosition).filter(function (pos) {
        //        return $scope.toastPosition[pos];
        //      }).join(' ');
        //    };
        //    vm.reportTask = function() {
        //        
        //      var data = ({
        //        contactName: this.contactName,
        //        contactEmail: this.contactEmail,
        //        contactMessage: this.contactMessage
        //      });
        //        
        //      $http.post('/report-task', data)
        //          .success(function (data, status, headers, config) {
        //            $mdToast.show(
        //                $mdToast.simple()
        //                .content('Thanks for your feedback ' + data.contactName 'we will look into this ASAP')
        //                .position($scope.getToastPosition())
        //                .hideDelay(5000)
        //            );   
        //      })
        //      .error (function (data, status, headers, config) {
        //          
        //      });
        //    };
        //report this task
        //get offers for taskId
        var offersOnThisTask = [];
        $http.get('api/offers').success(function(data, status) {
            // vm.task.offers = data;
            var allOffers = data;
            for (var i = 0; i < allOffers.length; i++) {
                if (allOffers[i].taskId === vm.task._id) {
                    offersOnThisTask.push(allOffers[i]);
                }
                vm.task.offers = offersOnThisTask; //this is for the ng-repeat of offers on the task
            }
            var total = 0;
            // console.log(offersOnThisTask.length);
            for (var i = 0; i < offersOnThisTask.length; i++) {
                if (offersOnThisTask[i].offerUserAverage) {
                    // console.log(offersOnThisTask[i].offerUserAverage.length);
                    var numberOfRatingsForOfferUser =
                        offersOnThisTask[i].offerUserAverage.length;
                    for (var e = 0; e < offersOnThisTask[i].offerUserAverage
                        .length; e++) {
                        total += +offersOnThisTask[i].offerUserAverage[
                            e].rating;
                    }
                    var userAverageRating = total /
                        numberOfRatingsForOfferUser;
                    vm.userAverageRating = userAverageRating;
                    // console.log(userAverageRating);
                    // console.log(total);
                } //end of if there is a offerUserAverage
            } //end of for var i = 0
        }); //end of get offers
        vm.removeComment = function() {
            // var removed = vm.task.comments.splice(this.$index, 1);
            // console.log(removed);
            //     var data = ({
            //     comment: removed,
            //     commentID: removed[0]._id,
            //     taskId: vm.task._id
            // });
            //     // console.log(vm.commentID);
            // $http.post('/api/tasks/' + vm.task._id +
            //         '/delete-comment', data).success(function(
            //         data, status, headers, config) {
            //             console.log('deleted the comment');
            //     });
            //     function errorCallback(res) {
            //         vm.error = res.data.message;
            //     }
            swal({
                title: "¿Estás seguro?",
                text: "¡No podrías recuperar el comentario una vez borrado!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "¡Sí, borrarlo!",
                cancelButtonText: "No, ¡anularlo por favor!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    var removed = vm.task.comments.splice(
                        this.$index, 1);
                    // console.log(removed);
                    var data = ({
                        comment: removed,
                        commentID: removed[0]._id,
                        taskId: vm.task._id
                    });
                    // console.log(vm.commentID);
                    $http.post('/api/tasks/' + vm.task._id +
                        '/delete-comment', data).success(
                        function(data, status, headers,
                            config) {
                            // console.log('deleted the comment');
                        });

                    function errorCallback(res) {
                        vm.error = res.data.message;
                    }
                    swal("¡Borrado!",
                        "El comentario ha sido borrado",
                        "success");
                } else {
                    swal("Anulado", "El comentario está sano y salvo",
                        "error");
                }
            });
        }
        vm.cancel = function() {
            vm.$dismiss();
        };
        vm.steps = ['one', 'two', 'three'];
        vm.step = 0;
        vm.isFirstStep = function() {
            return vm.step === 0;
        };
        vm.isLastStep = function() {
            return vm.step === (vm.steps.length - 1);
        };
        vm.isCurrentStep = function(step) {
            return vm.step === vm;
        };
        vm.setCurrentStep = function(step) {
            vm.step = step;
        };
        vm.getCurrentStep = function() {
            return vm.steps[vm.step];
        };
        vm.getNextLabel = function() {
            return (vm.isLastStep()) ? 'Submit' : 'Siguiente';
        };
        vm.handlePrevious = function() {
            vm.step -= (vm.isFirstStep()) ? 0 : 1;
        };
        vm.cancel = function() {
            vm.$dismiss();
        };
        vm.handleNext = function() {
            if (vm.isLastStep()) {
                vm.save(vm.form.taskForm.$valid);
                $scope.$dismiss();
            } else {
                vm.step += 1;
            }
        };
        if (vm.task.provider === 'facebook') {
            // console.log('user signed up using Facebook');
        }
    }
})();