modulesModule.controller('ModulesRealestateEditPropertyController', ['$scope', 'FileUploader', 'uiGmapGoogleMapApi', 'localStorageService', 'ModulesRealestatePropertyService', 'ModulesRealestatePropertyTypeService', 'ProjectService', '$location', '$routeParams',
	function($scope, FileUploader, uiGmapGoogleMapApi, localStorageService, ModulesRealestatePropertyService, ModulesRealestatePropertyTypeService, ProjectService, $location, $routeParams) {
		var propertyId = $routeParams.id;
		var paris = {
			latitude: 48.856614,
			longitude: 2.3522219000000177
		};

		$scope.property = {
			title: "",
			region: {
				title: "",
				latitude: paris.latitude,
				longitude: paris.longitude
			},
			_propertyType: "",
			bedrooms: 0,
			price: 0,
			description: "",
			mainImage: {},
			images: []
		};

		$scope.uploader = new FileUploader({
			url: myApp.globals.serverUrl + "api/realestate/properties/images",
			headers: {
				"x-access-token": localStorageService.get('token')
			}
		});

		async.series([
			function(callback) {
				uiGmapGoogleMapApi.then(function(maps) {
					$scope.map = {
						center: {
							latitude: paris.latitude,
							longitude: paris.longitude
						},
						zoom: 6,
						options: {
							disableDefaultUI: true,
							styles: [{
								stylers: [{
									hue: "#cccccc"
								}, {
									saturation: -100
								}]
							}, {
								featureType: "road",
								elementType: "geometry",
								stylers: [{
									lightness: 100
								}, {
									visibility: "simplified"
								}]
							}, {
								featureType: "road",
								elementType: "labels",
								stylers: [{
									visibility: "on"
								}]
							}, {
								featureType: "poi",
								stylers: [{
									visibility: "off"
								}]
							}]
						}
					};

					$scope.coordsUpdates = 0;
					$scope.dynamicMoveCtr = 0;
					$scope.marker = {
						id: 0,
						coords: {
							latitude: $scope.map.center.latitude,
							longitude: $scope.map.center.longitude
						},
						options: {
							draggable: true
						}
					};
					return callback();
				});
			},
			function(callback) {
				ModulesRealestatePropertyTypeService.getForActiveUser().success(function(data) {
					if (data.success) {
						$scope.propertyTypes = data.propertyTypes;
						$scope.property._propertyType = data.propertyTypes[0]._id;
						return callback();
					} else {
						console.log("1");
						return callback(data);
					}
				});
			},
			function(callback) {
				ModulesRealestatePropertyService.get(propertyId).success(function(data) {
					if (data.success) {
						$scope.property = data.property;
						// Because _propertyType has been populated on the server
						$scope.property._propertyType = $scope.property._propertyType._id;
						$scope.map.center = {
							latitude: $scope.property.region.latitude,
							longitude: $scope.property.region.longitude
						};
						$scope.map.zoom = 10;
						$scope.marker.coords = {
							latitude: $scope.property.region.latitude,
							longitude: $scope.property.region.longitude
						};
						return callback();
					} else {
						console.log("2");
						return callback(data);
					}
				});
			},
			function(callback) {
				ProjectService.getForActiveUser().success(function(data) {
					if (data.success) {
						var projects = [];
						data.projects.forEach(function(project) {
							var checked = false;
							$scope.property.projects.forEach(function(propertyProject) {
								if (project._id == propertyProject._id) checked = true;
							});
							projects.push({
								_id: project._id,
								name: project.name,
								checked: checked
							});
						});
						$scope.property.projects = projects;
						return callback();
					} else {
						console.log("3");
						return callback(data);
					}
				});
			}
		], function(error) {
			if (error)
				return console.log(error);
		});

		$scope.addProperty = function() {
			if ($scope.uploader.queue.length > 0) {
				$scope.uploader.uploadAll();
			} else {
				saveProperty();
			}
		};

		$scope.removeImageInPropertyImages = function(index) {
			$scope.property.images.splice(index, 1);
		};

		$scope.removeImage = function(index) {
			$scope.uploader.queue.splice(index, 1);
		};

		$scope.uploader.onCompleteItem = function(item, response, status, headers) {
			if (response.success) {
				$scope.property.images.push(response.image._id);
			} else {
				console.log(response.message);
			}
		};

		$scope.uploader.onCompleteAll = function() {
			console.log("everything was uploaded");
			saveProperty();
		};

		var saveProperty = function() {
			var mainImageIndex = 0;
			if ($('input[name=mainImage]:checked').val() !== undefined) {
				mainImageIndex = $('input[name=mainImage]:checked').val();
			}
			$scope.property.projects = $scope.property.projects.filter(function(project) {
				return (project.checked || $scope.property.projects.length === 1);
			});
			$scope.property.mainImage = $scope.property.images[mainImageIndex];
			$scope.property.region.latitude = $scope.marker.coords.latitude;
			$scope.property.region.longitude = $scope.marker.coords.longitude;
			ModulesRealestatePropertyService.put($scope.property).success(function(data) {
				if (data.success) {
					console.log(data);
					$location.path('/modules/realestate/properties');
				} else {
					console.log(data);
				}
			});
		};

		$scope.uploader.onErrorItem = function(item, response, status, headers) {
			console.log("Sorry there was an error");
			$location.path('/modules/realestate/properties');
		};

		$('#drop-zone').on("dragenter", function() {
			$('#drop-zone').addClass('drop-zone-in');
		});

		$('#drop-zone').on("dragleave drop", function() {
			$('#drop-zone').removeClass('drop-zone-in');
		});
	}
]);