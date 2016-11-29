var app = angular.module('parentmyapp', ['ngRoute', 'datatables', 'datatables.bootstrap']);

app.config(function($routeProvider){
  $routeProvider

  
  .when('/',{
    templateUrl : 'Parent/parentDashboard.html',
    controller : 'ParentDashboardController'
  })
  
  .when('/profile',{
    templateUrl : 'Parent/parentProfile.html',
    controller : 'ParentProfileController'
  })
  
  .when('/event',{
    templateUrl : 'Parent/event.html',
    controller : 'EventController'
  })

  .otherwise({redirectTo: '/'});
});

app.factory('Scopes', function ($rootScope) {
    var mem = {};
 
    return {
        store: function (key, value) {
            mem[key] = value;
        },
        get: function (key) {
            return mem[key];
        }
    };
});

//Dashboard
app.controller('ParentDashboardController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {
  console.log('Hello from ParentDashboardController');
	
	refresh = function(){
		//session checking
			$http.get('/sessioncheckParent').success(function(response) {
			//console.log("I got the data I requested");
			//console.log(response);
			
		  
			if(response.toString() == 'not exist'){
				$rootScope.parent_username="";
			}
			else{
				username = response.toString();
				$rootScope.parent_username = response.toString();
				
				//get event id from parentnotificationlsit by parent usename  (Email)
				$http.get('/checkparentIdintoNoti/'+ $rootScope.parent_username).success(function(response) {
					console.log(response);
					
					$scope.notification = [];
					
					for(var i=0; i<response.length; i++){
						
						$http.get('/geteventlistnoti/'+ response[i].eventId).success(function(res) {
							console.log(res);
							$scope.notification.push(res);
						});
					}
				});
			}
		
		});
	}
	refresh();
	
	$scope.okayNotification = function(id, school)
	{
		$http.get('/parentprofile/'+$rootScope.parent_username).success(function(response) {
		console.log("I got the data I requested");

			$scope.user = response.schoolUsername;
		
			//insert into judge list
			$http.post('/judgelist/' + id + '/' + $rootScope.parent_username + '/' + response.schoolUsername).success(function(resp) {
				console.log(resp);
									
			});
		});	
		
		//delte entry from parent notification list
		$http.delete('/deleteparenteventnotification/' + id + '/' +$rootScope.parent_username).success(function(response) {
			refresh();
	});
	};
  
}]);

//view and edit profile
app.controller('ParentProfileController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
    console.log("Hello from ParentProfileController");
	
	$http.get('/parentprofile/'+$rootScope.parent_username).success(function(response) {
		console.log("I got the data I requested");

		$scope.user = response;
		
	});	
	
}]);

//event
app.controller('EventController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
    console.log("Hello from EventController");

	//get event id from judgelist by parent usename  (Email)
			$http.get('/findjudgelist/'+ $rootScope.parent_username).success(function(response) {
				console.log(response);
				
				$scope.eventlist = [];
				
				for(var i=0; i<response.length; i++){
					
					$http.get('/geteventlistnoti/'+ response[i].eventId).success(function(res) {
						console.log(res);
						$scope.eventlist.push(res);
					});
				}
			});
			
			$scope.reached = function(id){
			
				$http.put('/judgelist/' + $rootScope.parent_username +'/' + id).success(function(response) {
					document.getElementById("yesbutton").disabled = true;
				 });
			};
		
	
}]);
	