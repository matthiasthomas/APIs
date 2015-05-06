userModule.factory('UserService', ['$http', 'localStorageService',
	function($http, localStorageService) {
		return {
			login: function(inputs) {
				return $http.post(myApp.globals.serverUrl + "api/users/login", inputs);
			},
			logout: function(inputs) {
				return $http.get(myApp.globals.serverUrl + "api/users/logout");
			},
			register: function(user) {
				return $http.post(myApp.globals.serverUrl + "api/users", user);
			},
			isLoggedIn: function() {
				return $http.post(myApp.globals.serverUrl + "api/users/isLoggedIn", {
					token: localStorageService.get('token')
				});
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/users");
			},
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/users/" + id);
			},
			put: function(user) {
				return $http.put(myApp.globals.serverUrl + "api/users/" + user._id, user);
			},
			delete: function(id) {
				return $http.delete(myApp.globals.serverUrl + "api/users/" + id);
			},
			forgotPassword: function(email) {
				return $http.post(myApp.globals.serverUrl + "api/users/forgot/" + email);
			},
			activeUser: function() {
				if (localStorageService.get('activeUser')) {
					return localStorageService.get('activeUser');
				} else {
					return null;
				}
			}
		};
	}
]);