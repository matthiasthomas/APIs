myApp.factory('AuthService', ['$http',
	function($http) {
		return {
			login: function(inputs) {
				return $http.post(myApp.globals.serverUrl + "api/" + myApp.globals.projectName + "/users/login", inputs);
			},
			logout: function(inputs) {
				return $http.post(myApp.globals.serverUrl + "api/" + myApp.globals.projectName + "/users/logout", inputs);
			},
			register: function(inputs) {
				return $http.post(myApp.globals.serverUrl + "api/" + myApp.globals.projectName + "/users", inputs);
			}
		}
	}
]);