messageModule.factory('MessageService', ['$http',
	function($http) {
		return {
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/messages/" + id);
			},
			post: function(message) {
				return $http.post(myApp.globals.serverUrl + "api/messages", message);
			},
			put: function(id, message) {
				return $http.put(myApp.globals.serverUrl + "api/messages/" + id, message);
			},
			delete: function(id) {
				return $http.delete(myApp.globals.serverUrl + "api/messages/" + id);
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/messages");
			}
		};
	}
]);