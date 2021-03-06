'use strict';
/**
 * controllers for for city
 
 * Simple table with sorting and filtering on AngularJS
 */
app.controller('userTableCtrl', ["$scope", "$filter", "$timeout", "Upload", "ngTableParams", "UQUser", "$q", "$modal",
    function($scope, $filter, $timeout, $upload, ngTableParams, UQUser, $q, $modal) {
        var promises = [];

        $scope.openModal = function(userId) {
            var modalInstance = $modal.open({
                templateUrl: 'changePass.html',
                controller: 'changePassCtrl',
                resolve: {
                    user: function() {
                        return UQUser.findById({
                            id: userId
                        }).$promise;
                    }
                }
            });
        };

        $scope.deleteUser = function(userId) {
            UQUser.deleteById({
                    id: userId
                },
                function(success) {
                    console.log('delete success');
                    $scope.tableParams.reload();
                },
                function(error) {
                    console.log('delete error :' + error)
                });
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

                UQUser.find(function(data) {
                    //success
                    // angular.forEach(data,function(vendor){
                    // promises.push(Vendor.businesses({id:vendor.id}).$promise.then(function(business){
                    // vendor.contact = business.contact;    
                    // }));
                    // Vendor.businesses({id:vendor.id}).$promise.then(function(business){
                    //     console.log(business.name);

                    // })
                    // });
                    // $q.all(promises).then(function(){
                    params.total(data.length);
                    var orderedData = params.filter() ? $filter('filter')(data, params.filter()) : data;
                    orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                    $scope.vendors = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    params.total(orderedData.length);
                    // set total for recalc pagination
                    $defer.resolve($scope.vendors);


                }, function(res) {
                    //failed
                    console.log(res);
                });

            }

        });




    }
]);

app.controller('changePassCtrl', ["$scope", "user", "UQUser", "$modalInstance", "$timeout",
    function($scope, user, UQUser, $modalInstance, $timeout) {
        $scope.newPassword;

        $scope.updatePassword = function() {
            if ($scope.newPassword.length > 0) {
                UQUser.prototype$updateAttributes({
                    id: user.id
                }, {
                    password: $scope.newPassword
                }, function() {
                    $timeout(function() {
                        $modalInstance.close()
                    }, 500);
                })
            }
        }
        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    }
])