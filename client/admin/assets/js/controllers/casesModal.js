'use strict';
/** 
 * controller for AngularJS-Toaster
 */
app.controller('caseModalCtrl', ["$scope", "$modalInstance", "sales", "Sale", "Case",
    function($scope, $modalInstance, sales, Sale, Case) {
        $scope.sales = sales;
        Sale.case({
            id: sales[0].id
        }, function(thisCase) {
            Case.notes({
                id: thisCase.id
            }, function(notes) {
                $scope.notes = notes;
            })
        })
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