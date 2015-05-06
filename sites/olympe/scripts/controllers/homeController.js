jadore.controller('HomeController', ['$scope', 'PropertyFactory',
	function($scope, PropertyFactory) {
		PropertyFactory.sixFirst().success(function(data) {
			if (data.success) {
				$scope.properties = data.properties;
			} else {
				console.log(data);
			}
		});

		$('#hero-container').height(window.innerHeight);
	}
]);