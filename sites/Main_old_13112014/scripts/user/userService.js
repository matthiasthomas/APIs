userModule.factory('UserService', ['$http', 'localStorageService',
	function($http, localStorageService) {
		return {
			login: function(inputs) {
				return $http.post(myApp.globals.serverUrl + "api/users/login", inputs);
			},
			logout: function(inputs) {
				return $http.post(myApp.globals.serverUrl + "api/users/logout", inputs);
			},
			register: function(inputs) {
				return $http.post(myApp.globals.serverUrl + "api/users", inputs);
			},
			isLoggedIn: function() {
				return $http.post(myApp.globals.serverUrl + "api/users/isLoggedIn", {
					'token': localStorageService.get('token')
				});
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/users");
			},
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/users/" + id);
			}
		};
	}
]);