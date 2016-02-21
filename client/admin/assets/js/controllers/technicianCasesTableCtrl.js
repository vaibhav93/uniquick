'use strict';
/**
 * controllers for for city
 
 * Simple table with sorting and filtering on AngularJS
 */
app.controller('technicianCasesTableCtrl', ["$scope", "$localStorage", "Role", "usSpinnerService", "$filter", "$timeout", "Upload", "ngTableParams", "Sale", "UQUser", "$q", "$modal", "Case",
    function($scope, $localStorage, Role, usSpinnerService, $filter, $timeout, $upload, ngTableParams, Sale, UQUser, $q, $modal, Case) {
        var promises = [];

        $scope.openModal = function(caseId) {
            var modalInstance = $modal.open({
                templateUrl: 'caseModal.html',
                controller: 'caseModalCtrl',
                resolve: {
                    sale: function() {
                        return Sale.findById({
                            id: saleId
                        }).$promise;
                    }
                }
            });
        };
        $scope.revertCase = function(caseId) {
            usSpinnerService.spin('spinner-1');
            Case.prototype$updateAttributes({
                    id: caseId
                }, {
                    level: 'supervisor',
                    assignedName: null,
                    assignedId: null
                }, function(updated) {
                    usSpinnerService.stop('spinner-1');
                    $scope.tableParams.reload();
                },
                function(err) {

                })

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
                // use build-in angular filter
                // if($stateParams.uQuserId && $localStorage.role =='users'){
                //     if(!$scope.start || !$scope.end){
                //         UQUser.sales({id:$stateParams.uQuserId}).$promise.then(function(data){

                //             applyData(data);                
                //         })
                //     } else {
                //         UQUser.sales({id:$stateParams.uQuserId,filter:{where:{saledate:{between:[$scope.start,$scope.end]}}}}).$promise.then(function(data){

                //             applyData(data);                
                //         })
                //     }
                // } else {
                //     if(!$scope.start || !$scope.end){
                //         Sale.find().$promise.then(function(data){

                //             applyData(data);                
                //         })
                //     } else {
                //         Sale.find({filter:{where:{saledate:{between:[$scope.start,$scope.end]}}}}).$promise.then(function(data){

                //             applyData(data);                
                //         })
                //     }

                // }
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

app.controller('caseModalCtrl', ["$scope", "$modalInstance", "sale", "Sale",
    function($scope, $modalInstance, sale, Sale) {
        $scope.sale = sale;
        $scope.user = Sale.uQUser({
            id: sale.id
        }, function(data) {
            // console.log(data);
        });

        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
]);