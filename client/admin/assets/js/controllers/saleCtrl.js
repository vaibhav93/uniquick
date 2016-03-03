'use strict';
/**
 * controllers for for city
 
 * Simple table with sorting and filtering on AngularJS
 */
app.controller('saleCtrl', ["$scope", "$filter", "$state", "SweetAlert", "$timeout", "Case", "UQUser", "usSpinnerService", "toaster", "Sale", "$localStorage", "$stateParams",
    function($scope, $filter, $state, SweetAlert, $timeout, Case, UQUser, usSpinnerService, toaster, Sale, $localStorage, $stateParams) {

        if ($stateParams.caseId) {
            Case.customer({
                id: $stateParams.caseId
            }, function(customer) {
                $scope.customer = customer;
            }, function(err) {
                console.log(err);
            })
        }
        $scope.sale = {
            saledate: null,
            verificationdate: null,
            transactionid: '',
            paymentmode: '',
            amount: '',
            recordlink: '',
            desc: '',
            status: 'Charged'
        };

        $scope.generatePassword = function(length) {
            var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
            var pass = "";
            for (var x = 0; x < length; x++) {
                var i = Math.floor(Math.random() * chars.length);
                pass += chars.charAt(i);
            }
            $scope.newUser.password = pass;
        }
        $scope.toasterSuccess = {
            type: 'success',
            title: 'Success',
            text: 'Sale registered'
        };
        $scope.toasterError = {
            type: 'error',
            title: 'Error',
            text: 'Transaction ID should be unique'
        };
        $scope.master = $scope.newUser;
        $scope.form = {

            submit: function(form) {

                //console.log($scope.sale);

                var firstError = null;
                if (form.$invalid) {

                    var field = null,
                        firstError = null;
                    for (field in form) {
                        if (field[0] != '$') {
                            if (firstError === null && !form[field].$valid) {
                                firstError = form[field].$name;
                            }

                            if (form[field].$pristine) {
                                form[field].$dirty = true;
                            }
                        }
                    }

                    angular.element('.ng-invalid[name=' + firstError + ']').focus();

                    // SweetAlert.swal("The form cannot be submitted because it contains validation errors!", "Errors are marked with a red, dashed border!", "error");
                    return;

                } else {
                    usSpinnerService.spin('spinner-1');
                    $scope.sale.amount = $scope.sale.amount.amount;
                    // $scope.sale.uQuserId = $localStorage.user.id;
                    UQUser.findById({
                            id: $localStorage.user.id
                        }, function(user) {
                            // $scope.sale.username = user.username;
                            //this is required to find user sales by ID
                            $scope.sale.uQUserId = user.id;
                            $scope.sale.user = user;
                            $scope.sale.status = 'Charged';
                            Case.sales.create({
                                id: $stateParams.caseId
                            }, $scope.sale, function(success) {
                                usSpinnerService.stop('spinner-1');
                                $scope.form.reset(form);
                                // console.log(success);
                                updateCase($localStorage.role);
                                // toaster.pop($scope.toasterSuccess.type, $scope.toasterSuccess.title, $scope.toasterSuccess.text);
                                SweetAlert.swal({
                                    title: "Sucess!",
                                    text: "Sale done",
                                    type: "success",
                                    confirmButtonColor: "#007AFF"
                                }, function(isConfirm) {
                                    $state.go('app.table.mysales');
                                });
                                // $state.go('app.table.mysales');
                            }, function(err) {
                                usSpinnerService.stop('spinner-1');

                                $scope.form.reset(form);
                                console.log('form submit error');
                                console.log(err);
                                toaster.pop($scope.toasterError.type, $scope.toasterError.title, $scope.toasterError.text);
                            });

                        },
                        function(err) {});
                    var test = function() {
                        console.log('yooooooooooooo');
                    }
                    var updateCase = function(role) {
                        if (role == 'technician') {
                            Case.prototype$updateAttributes({
                                    id: $stateParams.caseId
                                }, {
                                    level: 'supervisor',
                                    assignedName: null,
                                    assignedId: null
                                }, function(updated) {
                                    // usSpinnerService.stop('spinner-1');
                                    // $scope.tableParams.reload();
                                },
                                function(err) {

                                })
                        }
                    }


                    //your code for submit
                }

            },
            reset: function(form) {


                $scope.sale = {
                    saledate: null,
                    verificationdate: null,
                    transactionid: '',
                    paymentmode: '',
                    amount: '',
                    recordlink: '',
                    desc: ''
                };
                form.$setPristine(true);

            }
        };
        $scope.costs = [{
            amount: '$49.99'
        }, {
            amount: '$99.99'
        }, {
            amount: '$149.99'
        }, {
            amount: '$199.99'
        }, {
            amount: '$249.99'
        }, {
            amount: '$299.99'
        }, {
            amount: '$349.99'
        }, {
            amount: '$399.99'
        }, {
            amount: '$449.99'
        }, {
            amount: '$499.99'
        }, {
            amount: '$549.99'
        }, {
            amount: '$599.99'
        }, ];
        $scope.minDate = new Date();
        $scope.opensale = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedsale = !$scope.openedsale;
        };
        $scope.openverify = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedverify = !$scope.openedverify;
        };
        $scope.endOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = false;
            $scope.endOpened = !$scope.endOpened;
        };
        $scope.startOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endOpened = false;
            $scope.startOpened = !$scope.startOpened;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];


        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = !$scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            $scope.dt = d;
        };

        $scope.changed = function() {
            $log.log('Time changed to: ' + $scope.dt);
        };

        $scope.clear = function() {
            $scope.dt = null;
        };

    }
]);