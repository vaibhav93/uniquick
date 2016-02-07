'use strict';
/**
 * controllers for for city
 
 * Simple table with sorting and filtering on AngularJS
 */
app.controller('findSalesCtrl', ["$scope", "$localStorage", "$http", "Sale", "UQUser", "$timeout", "usSpinnerService", "Customer",
    function($scope, $localStorage, $http, Sale, UQUser, $timeout, usSpinnerService, Customer) {
        $scope.availableSearchParams = [
            // { key: "transactionid", name: "Transaction ID" },
            {
                key: "firstname",
                name: "First name"
            }, {
                key: "lastname",
                name: "Last name"
            }, {
                key: "email",
                name: "Email"
            }, {
                key: "zipcode",
                name: "Zipcode"
            },
            // { key: "amount", name: "Amount" },
            {
                key: "primaryno",
                name: "Contact"
            },

        ];
        $scope.newCustomerFlag = false;
        $scope.searchResults = [];
        $scope.searchParams = {};
        $scope.search = function() {
            usSpinnerService.spin('spinner-1');
            // Sale.find({filter:where})
            $timeout(function() {
                // console.log($scope.searchParams);
                var filterArr = [];
                var filterCriteria = {};
                var filterKeys = Object.keys($scope.searchParams);
                angular.forEach($scope.searchParams, function(value, key) {
                    if (key != 'query') {
                        if (key == 'firstname' || key == 'lastname') {
                            filterCriteria[key] = {
                                "like": '.*' + value + '.*',
                                "options": "i"
                            };
                        } else
                            filterCriteria[key] = value;
                        filterArr.push(filterCriteria);
                        filterCriteria = {};
                    }

                });
                // console.log(filterArr);
                Customer.find({
                    filter: {
                        where: {
                            and: filterArr
                        }
                    }
                }, function(sales) {
                    usSpinnerService.stop('spinner-1');
                    $scope.searchResults = sales;
                    console.log($scope.searchResults);
                }, function(err) {
                    usSpinnerService.stop('spinner-1');
                    console.log(err);
                })
            }, 1500);


        }

        $scope.childObject = {
            sale: {
                firstname: '',
                lastname: '',
                primaryno: null,
                secondaryno: 0,
                address: '',
                state: '',
                zipcode: 0,
                email: ''
            },
            form: {

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
                        usSpinnerService.spin('spinner-2');

                        Customer.create($scope.childObject.sale, function(customer) {

                            $scope.childObject.form.reset(form);
                            Customer.cases.create({
                                id: customer.id
                            }, {
                                status: 'open'
                            }, function(newCase) {
                                console.log(newCase);
                                usSpinnerService.stop('spinner-2');
                            },function(err){
                                console.log(err);
                                usSpinnerService.stop('spinner-2');
                            })
                        }, function(err) {
                            usSpinnerService.stop('spinner-2');
                            console.log(err);
                        })


                        //your code for submit
                    }

                },
                reset: function(form) {


                    $scope.childObject.sale = {
                        firstname: '',
                        lastname: '',
                        primaryno: null,
                        secondaryno: 0,
                        address: '',
                        state: '',
                        zipcode: 0,
                        email: '',
                        saledate: null,
                        verificationdate: null,
                        transactionid: '',
                        paymentmode: '',
                        amount: ''
                    };
                    form.$setPristine(true);

                }
            }
        }


    }
]);