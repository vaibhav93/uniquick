'use strict';
/**
 * controllers for for city

 * Simple table with sorting and filtering on AngularJS
 */
 app.controller('findSalesCtrl', ["$scope","$localStorage","$http","Sale", "UQUser","$timeout","usSpinnerService",
    function ($scope,$localStorage,$http, Sale,UQUser,$timeout,usSpinnerService) {
        $scope.availableSearchParams = [
        { key: "transactionid", name: "Transaction ID" },
        { key: "firstname", name: "First name" },
        { key: "lastname", name: "Last name" },
        { key: "email", name: "Email" },
        { key: "zipcode", name: "Zipcode" },
        { key: "amount", name: "Amount" },
        { key: "primaryno", name: "Contact" },

        ];

        $scope.searchResults = [];
        $scope.searchParams = {};
        $scope.search = function(){
            usSpinnerService.spin('spinner-1');
            // Sale.find({filter:where})
            $timeout(function(){
                // console.log($scope.searchParams);
                var filterArr = [];
                var filterCriteria = {};
                var filterKeys = Object.keys($scope.searchParams);
                angular.forEach($scope.searchParams, function(value, key) {
                    if(key !='query'){
                      if (key == 'firstname' || key =='lastname'){
                            filterCriteria[key] = {"like":'.*'+value+'.*',"options":"i"};
                      }
                      else  
                        filterCriteria[key] = value;
                      filterArr.push(filterCriteria);
                      filterCriteria = {};
                  }

              });
                // console.log(filterArr);
                Sale.find({filter:{where:{and:filterArr}}},function(sales){
                    usSpinnerService.stop('spinner-1');
                    $scope.searchResults = sales;
                    console.log($scope.searchResults);
                },function(err){
                    usSpinnerService.stop('spinner-1');
                    console.log(err);
                })    
            },1500);


        }
        

    }]);
