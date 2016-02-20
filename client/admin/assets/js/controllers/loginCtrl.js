'use strict';
/** 
  * Controller for login
*/
app.controller('LoginCtrl', ["UQUser","$scope","$state","$rootScope","$localStorage","toaster","ngAuthorize", 
	function (UQUser,$scope,$state,$rootScope,$localStorage,toaster,ngAuthorize) {
	    $scope.toaster = {
        type: 'error',
        title: 'Invalid login',
        text: 'Unauthorized access'
    };

	$scope.credentials = {
    username: '',
    password: ''
  	};
  	$rootScope.$on('$stateChangePermissionDenied',function(){
  		toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
  	});

	$scope.login = function (){
		$scope.loginResult = UQUser.login($scope.credentials,
			function(res) {
			$localStorage.accessToken = res.id;
			$rootScope.user = res.user; 
			$localStorage.user = res.user;
      ngAuthorize.redirect().then(function(data){
        $localStorage.role = data.data;
        if(data.data=='admin')
          $state.go('app.dashboard');       
        else if (data.data == 'agent')
          $state.go('app.table.findsales')
        else if (data.data == 'supervisor')
          $state.go('app.table.openCases')
        else
          $state.go('app.table.technicianCases')
      });
        	
      }, function(res) {
        //console.log('invalid login');
      	toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
        $state.go('login.signin');
      });		
	};

	
}]);