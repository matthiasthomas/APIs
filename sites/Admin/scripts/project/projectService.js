projectModule.factory('ProjectService', ['$http',
	function($http) {
		return {
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/projects/" + id);
			},
			post: function(project) {
				return $http.post(myApp.globals.serverUrl + "api/projects", project);
			},
			put: function(id, project) {
				return $http.put(myApp.globals.serverUrl + "api/projects/" + id, project);
			},
			delete: function(id) {
				return $http.delete(myApp.globals.serverUrl + "api/projects/" + id);
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/projects");
			},
			getForActiveUser: function() {
				return $http.get(myApp.globals.serverUrl + "api/projects/getForActiveUser");
			}
		};
	}
]);