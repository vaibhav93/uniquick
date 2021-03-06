'use strict';
/**
 * controllers for for city
 
 * Simple table with sorting and filtering on AngularJS
 */
app.controller('technicianCasesTableCtrl', ["$scope", "$rootScope", "$localStorage", "Role", "usSpinnerService", "$filter", "$timeout", "Upload", "ngTableParams", "Sale", "UQUser", "$q", "$modal", "Case",
    function($scope, $rootScope, $localStorage, Role, usSpinnerService, $filter, $timeout, $upload, ngTableParams, Sale, UQUser, $q, $modal, Case) {
        var promises = [];
        $rootScope.$on('reloadTable', function() {
            $scope.tableParams.reload()
        })
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
        $scope.revertCase = function(caseId) {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/revertModal.html',
                controller: 'revertModalCtrl',
                resolve: {
                    thisCase: function() {
                        return Case.findById({
                            id: caseId
                        }).$promise;
                    },
                    tableParams: function() {
                        return $scope.tableParams;
                    }

                },
                scope: $scope
            });
            //usSpinnerService.spin('spinner-1');


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
                                level: 'technician'
                            }, {
                                assignedId: $localStorage.user.id
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
app.controller('revertModalCtrl', ["$scope", "$modalInstance", "thisCase", "Sale", "Case", "$localStorage", "tableParams",

    function($scope, $modalInstance, thisCase, Sale, Case, $localStorage, tableParams) {
        $scope.thisCase = thisCase;

        $scope.ok = function() {
            Case.prototype$updateAttributes({
                    id: thisCase.id
                }, {
                    level: 'supervisor',
                    assignedName: null,
                    assignedId: null
                }, function(updated) {
                    //usSpinnerService.stop('spinner-1');
                    // $scope.$emit('reloadTable');
                    tableParams.reload();
                },
                function(err) {

                })
            if ($scope.text && $scope.text.length > 0) {
                Case.notes.create({
                        id: thisCase.id
                    }, {
                        text: $scope.text,
                        user: $localStorage.user
                    }, function(updated) {
                        // $scope.tableParams.reload();
                    },
                    function(err) {

                    })
            }
            $modalInstance.close();

        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    }
]);