jadore.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/', {
		templateUrl: "views/home.html",
		controller: "HomeController"
	}).
	when('/property/:id', {
		templateUrl: 'views/property.html',
		controller: 'PropertyController'
	}).
	when('/mapTest', {
		templateUrl: 'views/mapTest.html',
		controller: 'PropertyController'
	}).
	when('/explore', {
		templateUrl: 'views/explore.html',
		controller: 'PropertyController'
	}).
	otherwise({
		redirectTo: '/'
	});
}]);