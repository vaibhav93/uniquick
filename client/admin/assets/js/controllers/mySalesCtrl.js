'use strict';
/**
 * controllers for for city
 
 * Simple table with sorting and filtering on AngularJS
 */
app.controller('mySalesCtrl', ["$scope", "$localStorage", "Sale", "moment",

    function($scope, $localStorage, Sale, moment) {

        $scope.settled = Sale.find({
            filter: {
                where: {
                    and: [{
                        status: 'Settled'
                    }, {
                        uQUserId: $localStorage.user.id
                    }, {
                        saledate: {
                            gt: moment().startOf('month').toDate()
                        }
                    }]
                }
            }
        }, function(data) {
            $scope.settledTotal = calculateAmount(data);
        });
        $scope.charged = Sale.find({
            filter: {
                where: {
                    and: [{
                        status: 'Charged'
                    }, {
                        uQUserId: $localStorage.user.id
                    }, {
                        saledate: {
                            gt: moment().startOf('month').toDate()
                        }
                    }]
                }
            }
        }, function(data) {
            $scope.chargedTotal = calculateAmount(data);
        });
        $scope.refunded = Sale.find({
            filter: {
                where: {
                    and: [{
                        status: 'Refunded'
                    }, {
                        uQUserId: $localStorage.user.id
                    }, {
                        saledate: {
                            gt: moment().startOf('month').toDate()
                        }
                    }]
                }
            }
        }, function(data) {
            $scope.refundedTotal = calculateAmount(data);
        });
        $scope.chargeback = Sale.find({
            filter: {
                where: {
                    and: [{
                        status: 'Charge Back'
                    }, {
                        uQUserId: $localStorage.user.id
                    }, {
                        saledate: {
                            gt: moment().startOf('month').toDate()
                        }
                    }]
                }
            }
        }, function(data) {
            $scope.chargebackTotal = calculateAmount(data);
        });

        var calculateAmount = function(array) {
            var totalAmount = 0;
            var saleAmount
            angular.forEach(array, function(sale) {
                saleAmount = Number(sale.amount.substring(1));
                totalAmount = totalAmount + saleAmount;
            })
            return totalAmount.toFixed(2);
        };



    }
]);