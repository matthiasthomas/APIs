modulesModule.controller('ModulesRealestateAddPropertyController', ['$scope', 'FileUploader', 'uiGmapGoogleMapApi', 'localStorageService', 'ModulesRealestatePropertyService', 'ModulesRealestatePropertyTypeService', 'ProjectService', '$location',
	function($scope, FileUploader, uiGmapGoogleMapApi, localStorageService, ModulesRealestatePropertyService, ModulesRealestatePropertyTypeService, ProjectService, $location) {
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
			images: [],
			projects: []
		};

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
		});

		ModulesRealestatePropertyTypeService.getForActiveUser().success(function(data) {
			if (data.success) {
				$scope.propertyTypes = data.propertyTypes;
				$scope.property._propertyType = data.propertyTypes[0]._id;
			} else {
				console.log(data);
			}
		});

		ProjectService.getForActiveUser().success(function(data) {
			if (data.success) {
				data.projects.forEach(function(project) {
					$scope.property.projects.push({
						_id: project._id,
						name: project.name,
						checked: false
					});
				});
			} else {
				console.log(data);
			}
		});

		$scope.uploader = new FileUploader({
			url: myApp.globals.serverUrl + "api/realestate/properties/images",
			headers: {
				"x-access-token": localStorageService.get('token')
			}
		});

		$scope.addProperty = function() {
			if ($scope.uploader.queue.length > 0) {
				$scope.uploader.uploadAll();
			} else {
				saveProperty();
			}
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
			ModulesRealestatePropertyService.post($scope.property).success(function(data) {
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

		$scope.removeImage = function(index) {
			$scope.uploader.queue.splice(index, 1);
		};
	}
	]).directive('googleplace', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, model) {
				var options = {
					types: [],
				};
				var autocomplete = new google.maps.places.Autocomplete(element[0],
					options);

				google.maps.event.addListener(autocomplete, 'place_changed',
					function() {
						scope.$apply(function() {
							model.$setViewValue(element.val());
							var place = autocomplete.getPlace();
							if (!place.geometry) {
								return;
							}

							if (scope.map) {
								scope.map.center = {
									latitude: place.geometry.location.lat(),
									longitude: place.geometry.location.lng()
								};
								scope.map.zoom = 8;
							}

							if (scope.marker) {
								scope.marker.coords = {
									latitude: place.geometry.location.lat(),
									longitude: place.geometry.location.lng()
								};
							}
						});
					});
			}
		};
	}).directive('ngThumb', ['$window', function($window) {
		var helper = {
			support: !!($window.FileReader && $window.CanvasRenderingContext2D),
			isFile: function(item) {
				return angular.isObject(item) && item instanceof $window.File;
			},
			isImage: function(file) {
				var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		};

		return {
			restrict: 'A',
			template: '<canvas/>',
			link: function(scope, element, attributes) {
				if (!helper.support) return;

				var params = scope.$eval(attributes.ngThumb);

				if (!helper.isFile(params.file)) return;
				if (!helper.isImage(params.file)) return;

				var canvas = element.find('canvas');
				var reader = new FileReader();

				reader.onload = onLoadFile;
				reader.readAsDataURL(params.file);

				function onLoadFile(event) {
					var img = new Image();
					img.onload = onLoadImage;
					img.src = event.target.result;
				}

				function onLoadImage() {
					var width = params.width || this.width / this.height * params.height;
					var height = params.height || this.height / this.width * params.width;
					canvas.attr({
						width: width,
						height: height
					});
					canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
				}
			}
		};
	}]);