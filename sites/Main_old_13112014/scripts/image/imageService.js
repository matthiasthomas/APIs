imageModule.factory('ImageService', ['$http',
	function($http) {
		return {
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/images/" + id);
			},
			post: function(image) {
				return $http.post(myApp.globals.serverUrl + "api/images", image);
			},
			put: function(id, image) {
				return $http.put(myApp.globals.serverUrl + "api/images/" + id, image);
			},
			delete: function(id) {
				return $http.delete(myApp.globals.serverUrl + "api/images/" + id);
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/images");
			}
		};
	}
]);