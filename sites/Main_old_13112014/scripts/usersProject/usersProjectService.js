usersProjectModule.factory('UsersProjectService', ['$http', 'localStorageService',
	function($http, localStorageService) {
		return {
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/usersProjects");
			},
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/usersProjects/" + id);
			},
			getByUser: function(userId) {
				return $http.get(myApp.globals.serverUrl + "api/usersProjects/_user/" + userId);
			}
		};
	}
]);