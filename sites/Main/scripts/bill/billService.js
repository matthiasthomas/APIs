billModule.factory('BillService', ['$http',
	function($http) {
		return {
			get: function(id) {
				return $http.get(myApp.globals.serverUrl + "api/bills/" + id);
			},
			post: function(bill) {
				return $http.post(myApp.globals.serverUrl + "api/bills", bill);
			},
			put: function(id, bill) {
				return $http.put(myApp.globals.serverUrl + "api/bills/" + id, bill);
			},
			delete: function(id) {
				return $http.delete(myApp.globals.serverUrl + "api/bills/" + id);
			},
			all: function() {
				return $http.get(myApp.globals.serverUrl + "api/bills");
			}
		};
	}
]);