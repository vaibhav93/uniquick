'use strict';
/**
 * controllers for for city

 * Simple table with sorting and filtering on AngularJS
 */
 app.controller('salesTableCtrl', ["$scope","$localStorage","$http","$location", "$filter","$timeout", "Upload", "ngTableParams","Sale", "UQUser","$q","$modal","$stateParams",
    function ($scope,$localStorage,$http,$location,$filter,$timeout, $upload, ngTableParams, Sale,UQUser,$q,$modal,$stateParams) {
        var promises = [];
        
        $scope.openModal = function(saleId) {
            var modalInstance = $modal.open({
                templateUrl: 'saleModal.html',
                controller: 'salesModalCtrl',
                resolve: {
                    sale: function() {
                        return Sale.findById({id:saleId}).$promise;
                    }
                }
            });
        };
        $scope.deleteUser = function(userId){
            UQUser.deleteById({id:userId},
                function(success){console.log('delete success');$scope.tableParams.reload();},
                function(error){console.log('delete error :'+error)});
        }

        $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: 10, // count per page
        filter: {

        },
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {
            // use build-in angular filter
            if($stateParams.uQuserId && $localStorage.role =='users'){
                if(!$scope.start || !$scope.end){
                    UQUser.sales({id:$stateParams.uQuserId}).$promise.then(function(data){

                        applyData(data);                
                    })
                } else {
                    UQUser.sales({id:$stateParams.uQuserId,filter:{where:{saledate:{between:[$scope.start,$scope.end]}}}}).$promise.then(function(data){

                        applyData(data);                
                    })
                }
            } else {
                if(!$scope.start || !$scope.end){
                    Sale.find().$promise.then(function(data){

                        applyData(data);                
                    })
                } else {
                    Sale.find({filter:{where:{saledate:{between:[$scope.start,$scope.end]}}}}).$promise.then(function(data){

                        applyData(data);                
                    })
                }

            }

            var applyData = function(data){
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
$scope.today = function () {
    $scope.dt = new Date();
};
$scope.today();

$scope.clear = function () {
    $scope.dt = null;
};
$scope.csv = $location.protocol()+'://'+$location.host()+':'+$location.port()+'/api/file/export.csv';

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = !$scope.opened;
    };
    $scope.startOpened = false;
    $scope.endOpen = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = false;
        $scope.endOpened = !$scope.endOpened;
    };
    $scope.endChange = function(endDate){
        $scope.tableParams.reload();
        console.log(endDate);
    }
    $scope.startChange = function(startDate){
        $scope.tableParams.reload();
        console.log(startDate);
    }
    $scope.startOpen = function ($event) {
        console.log('opened');
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endOpened = false;
        $scope.startOpened = !$scope.startOpened;
        console.log($scope.startOpened);
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.hstep = 1;
    $scope.mstep = 15;

    // Time Picker
    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.update = function () {
        var d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        $scope.dt = d;
    };

    $scope.changed = function () {
        $log.log('Time changed to: ' + $scope.dt);
    };

    $scope.clear = function () {
        $scope.dt = null;
    };


}]);

app.controller('salesModalCtrl', ["$scope", "$modalInstance", "sale","Sale", function ($scope, $modalInstance, sale,Sale) {
    $scope.sale = sale;
    $scope.user = Sale.uQUser({id:sale.id},function(data){
        // console.log(data);
    });

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);