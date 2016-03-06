'use strict';
/**
 * controllers for for city
 
 * Simple table with sorting and filtering on AngularJS
 */
app.controller('pickCasesTableCtrl', ["$scope", "$localStorage", "Role", "usSpinnerService", "$filter", "$timeout", "Upload", "ngTableParams", "Sale", "UQUser", "$q", "$modal", "Case",
    function($scope, $localStorage, Role, usSpinnerService, $filter, $timeout, $upload, ngTableParams, Sale, UQUser, $q, $modal, Case) {
        var promises = [];

        $scope.openModal = function(caseId) {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/caseModal.html',
                controller: 'caseModalCtrl',
                resolve: {
                    sales: function() {
                        return Case.sales({
                            id: caseId
                        }).$promise;
                    }
                }
            });
        };
        $scope.closeCase = function(caseId) {
            //usSpinnerService.spin('spinner-1');
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/closeCaseModal.html',
                controller: 'closeCaseModalCtrl',
                resolve: {
                    thisCase: function() {
                        return Case.findById({
                            id: caseId
                        }).$promise;
                    }
                }
            });

        }
        $scope.assign = function(caseId) {
            usSpinnerService.spin('spinner-1');
            Case.prototype$updateAttributes({
                    id: caseId
                }, {
                    level: 'technician',
                    assigned: $scope.person.selected
                }, function(updated) {
                    usSpinnerService.stop('spinner-1');
                    $scope.tableParams.reload();
                },
                function(err) {

                })
        }
        $scope.person = {};
        $scope.list = {
            people: []
        }

        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: 10, // count per page
            filter: {

            },
        }, {
            total: 0, // length of data
            getData: function($defer, params) {
                Case.find({
                    filter: {
                        where: {
                            and: [{
                                status: 'open'
                            }, {
                                level: 'supervisor'
                            }]

                        }
                    }
                }, function(data) {
                    angular.forEach(data, function(case1) {
                        Case.customer({
                            id: case1.id
                        }, function(customer) {
                            case1.customer = customer;
                        });
                        Case.sales({
                            id: case1.id
                        }, function(sales) {
                            case1.sale = sales[0];
                        })
                    });
                    applyData(data);
                })
                var applyData = function(data) {
                    params.total(data.length);
                    var orderedData = params.filter() ? $filter('filter')(data, params.filter()) : data;
                    orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                    $scope.vendors = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    params.total(orderedData.length);
                    // set total for recalc pagination
                    $defer.resolve($scope.vendors);

                }

            }


        });

    }
]);
app.controller('closeCaseCtrl', ["$scope", "$modalInstance", "thisCase", "Sale", "Case",
    function($scope, $modalInstance, thisCase, Sale, Case) {
        $scope.thisCase = thisCase;

        $scope.ok = function() {
            Case.prototype$updateAttributes({
                    id: thisCase.id
                }, {
                    status: 'close',
                    closedate: Date.now(),
                    verificationdate: $scope.thisCase.verificationdate
                }, function(updated) {
                    $scope.tableParams.reload();
                },
                function(err) {

                })
            Case.sales({
                id: thisCase.id
            }, function(sales) {
                angular.forEach(sales, function(sale) {
                    Sale.prototype$updateAttributes({
                        id: sale.id
                    }, {
                        status: 'Settled'
                    }, function(updatedSale) {
                        //console.log(updatedSale);
                    })
                })
            });
            $modalInstance.close();

        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

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