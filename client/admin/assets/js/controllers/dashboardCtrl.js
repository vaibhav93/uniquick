'use strict';
/** 
 * controllers used for the dashboard
 */
app.controller('dashboardCtrl', ["$scope", "$rootScope", "Sale", "UQUser", "$modal", "moment",

    function($scope, $rootScope, Sale, UQUser, $modal, moment) {


        $scope.settled = Sale.find({
            filter: {
                where: {
                    and: [{
                        status: 'Settled'
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