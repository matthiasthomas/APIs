projectModule.factory('ProjectService', ['$http',
	function($http) {
		return {
			get: function(id) {
				return $http.get("http://www.akioo.co/api/projects/" + id);
			}
		};
	}
]);