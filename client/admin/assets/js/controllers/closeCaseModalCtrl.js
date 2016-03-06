'use strict';
/** 
 * controller for AngularJS-Toaster
 */
app.controller('closeCaseModalCtrl', ["$scope", "$modalInstance", "thisCase", "Sale", "Case", "tableParams",
    function($scope, $modalInstance, thisCase, Sale, Case, tableParams) {
        $scope.thisCase = thisCase;

        $scope.ok = function() {
            Case.prototype$updateAttributes({
                    id: thisCase.id
                }, {
                    status: 'close',
                    closedate: Date.now(),
                    verificationdate: $scope.thisCase.verificationdate
                }, function(updated) {
                    // $scope.$emit('reloadTable2');
                    tableParams.reload();
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