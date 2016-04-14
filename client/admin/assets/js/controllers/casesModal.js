'use strict';
/** 
 * controller for AngularJS-Toaster
 */
app.controller('caseModalCtrl', ["$scope", "$modalInstance", "sales", "Sale", "Case", "caseId",
    function($scope, $modalInstance, sales, Sale, Case, caseId) {
        $scope.sales = sales;
        Case.customer({
            id: caseId
        }, function(customer) {
            $scope.customer = customer;
        })
        if (sales.length) {
            Sale.case({
                id: sales[0].id
            }, function(thisCase) {
                Case.notes({
                    id: thisCase.id
                }, function(notes) {
                    $scope.notes = notes;
                })
            })
        }
        // $scope.user = Sale.uQUser({
        //     id: sale.id
        // }, function(data) {
        //     // console.log(data);
        // });

        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
]);