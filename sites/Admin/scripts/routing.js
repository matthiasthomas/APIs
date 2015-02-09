myApp.config(['$provide', '$routeProvider',
	function($provide, $routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'views/index.html',
			controller: 'IndexController'
		}).
		when('/login', {
			templateUrl: 'views/user/login.html',
			controller: 'LoginController',
			publicAccess: true
		}).
		when('/forgot', {
			templateUrl: 'views/user/forgotpassword.html',
			controller: 'ForgotPasswordController',
			publicAccess: true
		}).
		when('/messages/:messagesStatus', {
			templateUrl: 'views/extras-inbox.html'
		}).
		when('/users', {
			templateUrl: 'views/user/users.html',
			controller: 'UsersController'
		}).
		when('/showUser/:id', {
			templateUrl: 'views/user/showUser.html',
			controller: 'ShowUserController'
		}).
		when('/editUser/:id', {
			templateUrl: 'views/user/editUser.html',
			controller: 'EditUserController'
		}).
		when('/addUser', {
			templateUrl: 'views/user/editUser.html',
			controller: 'AddUserController'
		}).
		when('/roles', {
			templateUrl: 'views/role/roles.html',
			controller: 'RolesController'
		}).
		when('/editRole/:id', {
			templateUrl: 'views/role/editRole.html',
			controller: 'EditRoleController'
		}).
		when('/addRole', {
			templateUrl: 'views/role/editRole.html',
			controller: 'AddRoleController'
		}).
		when('/showRole/:id', {
			templateUrl: 'views/role/showRole.html',
			controller: 'ShowRoleController'
		}).
		when('/projects', {
			templateUrl: 'views/project/projects.html',
			controller: 'ProjectsController'
		}).
		when('/addProject', {
			templateUrl: 'views/project/editProject.html',
			controller: 'AddProjectController',
			resolve: {
				lazyLoad: ['lazyLoad',
					function(lazyLoad) {
						return lazyLoad.load([
							'bower_components/jquery-validation/dist/jquery.validate.js',
							'bower_components/stepy/lib/jquery.stepy.js'
						]);
					}
				]
			}
		}).
		when('/editProject/:id', {
				templateUrl: 'views/project/editProject.html',
				controller: 'EditProjectController',
				resolve: {
					lazyLoad: ['lazyLoad',
						function(lazyLoad) {
							return lazyLoad.load([
								'bower_components/jquery-validation/dist/jquery.validate.js',
								'bower_components/stepy/lib/jquery.stepy.js'
							]);
						}
					]
				}
			}).
			/*when('/signup', {
					templateUrl: 'views/extras-signupform.html',
					controller: 'RegistrationController',
					publicAccess: true
				}).*/
			/*when('/index', {
				templateUrl: 'views/index.html',
			}).*/
		when('/calendar', {
			templateUrl: 'views/calendar.html',
			resolve: {
				lazyLoad: ['lazyLoad',
					function(lazyLoad) {
						return lazyLoad.load([
							'assets/plugins/fullcalendar/fullcalendar.js'
						]);
					}
				]
			}
		}).
		when('/form-ckeditor', {
			templateUrl: 'views/form-ckeditor.html',
			resolve: {
				lazyLoad: ['lazyLoad',
					function(lazyLoad) {
						return lazyLoad.load([
							'assets/plugins/form-ckeditor/ckeditor.js',
							'assets/plugins/form-ckeditor/lang/en.js'
						]);
					}
				]
			}
		}).
		when('/form-imagecrop', {
			templateUrl: 'views/form-imagecrop.html',
			resolve: {
				lazyLoad: ['lazyLoad',
					function(lazyLoad) {
						return lazyLoad.load([
							'assets/plugins/jcrop/js/jquery.Jcrop.js'
						]);
					}
				]
			}
		}).
		when('/form-wizard', {
			templateUrl: 'views/form-wizard.html',
			resolve: {
				lazyLoad: ['lazyLoad',
					function(lazyLoad) {
						return lazyLoad.load([
							'bower_components/jquery-validation/dist/jquery.validate.js',
							'bower_components/stepy/lib/jquery.stepy.js'
						]);
					}
				]
			}
		}).
		when('/form-masks', {
			templateUrl: 'views/form-masks.html',
			resolve: {
				lazyLoad: ['lazyLoad',
					function(lazyLoad) {
						return lazyLoad.load([
							'bower_components/jquery.inputmask/dist/jquery.inputmask.bundle.js'
						]);
					}
				]
			}
		}).
		when('/maps-vector', {
			templateUrl: 'views/maps-vector.html',
			resolve: {
				lazyLoad: ['lazyLoad',
					function(lazyLoad) {
						return lazyLoad.load([
							'bower_components/jqvmap/jqvmap/maps/jquery.vmap.europe.js',
							'bower_components/jqvmap/jqvmap/maps/jquery.vmap.usa.js'
						]);
					}
				]
			}
		}).
		when('/charts-canvas', {
			templateUrl: 'views/charts-canvas.html',
			resolve: {
				lazyLoad: ['lazyLoad',
					function(lazyLoad) {
						return lazyLoad.load([
							'bower_components/Chart.js/Chart.min.js'
						]);
					}
				]
			}
		}).
		when('/charts-svg', {
			templateUrl: 'views/charts-svg.html',
			resolve: {
				lazyLoad: ['lazyLoad',
					function(lazyLoad) {
						return lazyLoad.load([
							'bower_components/raphael/raphael.js',
							'bower_components/morris.js/morris.js'
						]);
					}
				]
			}
		}).
		when('/:templateFile', {
			templateUrl: function(param) {
				return 'views/' + param.templateFile + '.html';
			}
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);

//Check if user's connected
myApp.run(['$http', 'localStorageService', '$rootScope', '$location', '$route', 'UserService', 'progressLoader',
	function($http, localStorageService, $rootScope, $location, $route, UserService, progressLoader) {
		//Set headers for all $http requests
		$http.defaults.headers.common['x-access-token'] = localStorageService.get('token');
		var routesOpenToPublic = [];
		angular.forEach($route.routes, function(route, path) {
			// push route onto routesOpenToPublic if it has a truthy publicAccess value
			route.publicAccess && (routesOpenToPublic.push(path));
		});

		$rootScope.$on('$routeChangeStart', function(event, nextLoc, currentLoc) {
			console.log('start: ', $location.path());
			progressLoader.start();
			progressLoader.set(50);

			var closedToPublic = (-1 === routesOpenToPublic.indexOf($location.path()));
			if (closedToPublic) {
				UserService.isLoggedIn().success(function(data) {
					if (!data.success) {
						$location.path('/login');
						$rootScope.isLoggedIn = false;
					} else {
						$rootScope.isLoggedIn = true;
					}
					console.log('isLoggedIn: ' + $rootScope.isLoggedIn);
				});
			}
		});

		$rootScope.$on('$routeChangeSuccess', function(e) {
			console.log('success: ', $location.path());
			progressLoader.end();
		});
	}
]);