jadore.factory('PropertyFactory', ['$http',
	function($http) {
		return {
			all: function() {
				return $http.get(jadore.globals.serverUrl + 'api/realestate/properties/?eq=projects,' + jadore.globals.project_id);
			},
			sixFirst: function() {
				return $http.get(jadore.globals.serverUrl + 'api/realestate/properties/?eq=projects,' + jadore.globals.project_id + '&limit=6');
			},
			get: function(id) {
				return $http.get(jadore.globals.serverUrl + 'api/realestate/properties/' + id);
			}
		};
	}
]);