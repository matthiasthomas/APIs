modulesModule.factory('ModulesRealestateAgentService', ['$http',
	function($http) {
		return {
			post: function(agent) {
				return $http.post(myApp.globals.serverUrl + 'api/realestate/agents', agent);
			},
			getForActiveUser: function() {
				return $http.get(myApp.globals.serverUrl + "api/realestate/agents/getForActiveUser");
			}
		};
	}
]);