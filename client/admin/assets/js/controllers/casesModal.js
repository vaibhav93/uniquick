'use strict';
/** 
  * controller for AngularJS-Toaster
*/
app.controller('caseModalCtrl', ["$scope", "$modalInstance", "sales", "Sale",
    function($scope, $modalInstance, sales, Sale) {
        $scope.sales = sales;
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