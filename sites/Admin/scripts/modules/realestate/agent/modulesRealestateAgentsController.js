modulesModule.controller('ModulesRealestateAgentsController', ['$scope', 'ModulesRealestateAgentService',
	function($scope, ModulesRealestateAgentService) {
		ModulesRealestateAgentService.getForActiveUser().success(function(data) {
			if (data.success) {
				$scope.agents = data.agents;
			} else {
				console.log(data);
			}
		});
	}
]);