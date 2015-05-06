jadore.controller('PropertyController', ['$scope', 'PropertyFactory', '$routeParams', '$filter',
	function($scope, PropertyFactory, $routeParams, $filter) {
		$scope.myInterval = 5000;
		$scope.props = [];

		// Custom options for map
		var options = {
			zoom: 14,
			mapTypeId: 'Styled',
			disableDefaultUI: true,
			mapTypeControlOptions: {
				mapTypeIds: ['Styled']
			}
		};
		var styles = [{
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
		}];

		var newMarker = null;
		var markers = [];

		// json for properties markers on map
		PropertyFactory.all().success(function(data) {
			if (data.success) {
				$scope.property = data.properties.filter(function(property) {
					return (property._id === $routeParams.id);
				});
				$scope.property = $scope.property[0];
				data.properties.forEach(function(property) {
					if (property._id === $routeParams.id) {
						property.markerIcon = "marker-red.png";
					} else {
						property.markerIcon = "marker-green.png";
					}
					$scope.props.push(property);
				});

				setTimeout(function() {
					$('body').removeClass('notransition');

					$scope.map = new google.maps.Map(document.getElementById('mapView'), options);
					var styledMapType = new google.maps.StyledMapType(styles, {
						name: 'Styled'
					});

					var windowHeight = window.innerHeight;
					var contentHeight = windowHeight - $('#header').height();
					$('#content').height(contentHeight);
					$('#mapView').height(contentHeight);
					$('#leftSide').height(contentHeight);
					google.maps.event.trigger($scope.map, 'resize');

					$scope.map.mapTypes.set('Styled', styledMapType);
					$scope.map.setCenter(new google.maps.LatLng($scope.property.region.latitude, $scope.property.region.longitude));
					$scope.map.setZoom(14);

					if ($('#address').length > 0) {
						newMarker = new google.maps.Marker({
							position: new google.maps.LatLng(40.6984237, -73.9890044),
							map: $scope.map,
							icon: new google.maps.MarkerImage(
								'images/marker-new.png',
								null,
								null,
								// new google.maps.Point(0,0),
								null,
								new google.maps.Size(36, 36)
							),
							draggable: true,
							animation: google.maps.Animation.DROP,
						});

						google.maps.event.addListener(newMarker, "mouseup", function(event) {
							var latitude = this.position.lat();
							var longitude = this.position.lng();
							$('#latitude').text(this.position.lat());
							$('#longitude').text(this.position.lng());
						});
					}

					addMarkers($scope.props, $scope.map);
				}, 200);
			} else {
				console.log(data);
			}
		});

		// custom infowindow object
		var infobox = new InfoBox({
			disableAutoPan: false,
			maxWidth: 202,
			pixelOffset: new google.maps.Size(-101, -285),
			zIndex: null,
			boxStyle: {
				background: "url('images/infobox-bg.png') no-repeat",
				opacity: 1,
				width: "202px",
				height: "245px"
			},
			closeBoxMargin: "28px 26px 0px 0px",
			closeBoxURL: "",
			infoBoxClearance: new google.maps.Size(1, 1),
			pane: "floatPane",
			enableEventPropagation: false
		});

		// function that adds the markers on map
		var addMarkers = function(props, map) {
			$.each(props, function(i, prop) {
				var latlng = new google.maps.LatLng(prop.region.latitude, prop.region.longitude);
				var marker = new google.maps.Marker({
					position: latlng,
					map: map,
					icon: new google.maps.MarkerImage(
						'images/' + prop.markerIcon,
						null,
						null,
						null,
						new google.maps.Size(36, 36)
					),
					draggable: false,
					animation: google.maps.Animation.DROP,
				});
				var infoboxContent = '<div class="infoW">' +
					'<div class="propImg">' +
					'<img src="' + prop.mainImage.s + '">' +
					'<div class="propBg">' +
					'<div class="propPrice">' + $filter('currency')(prop.price, "€") + '</div>' +
					'<div class="propType">' + prop._propertyType.name + '</div>' +
					'</div>' +
					'</div>' +
					'<div class="paWrapper">' +
					'<div class="propTitle">' + prop.title + '</div>' +
					'<div class="propAddress">' + prop.region.title + '</div>' +
					'</div>' +
					'<br/>' +
					'<ul class="propFeat">' +
					'<li><span class="fa fa-moon-o"></span> ' + prop.bedrooms + '</li>' +
					'<li><span class="icon-drop"></span> ' + prop.bathrooms + '</li>' +
					'</ul>' +
					'<div class="clearfix"></div>' +
					'<div class="infoButtons">' +
					'<a class="btn btn-sm btn-round btn-gray btn-o closeInfo">Close</a>' +
					'<a href="#/property/' + prop._id + '" class="btn btn-sm btn-round btn-green viewInfo">View</a>' +
					'</div>' +
					'</div>';

				google.maps.event.addListener(marker, 'click', (function(marker, i) {
					return function() {
						infobox.setContent(infoboxContent);
						infobox.open(map, marker);
					};
				})(marker, i));

				$(document).on('click', '.closeInfo', function() {
					infobox.open(null, null);
				});

				markers.push(marker);
			});
		};

		if ($('#address').length > 0) {
			var address = document.getElementById('address');
			var addressAuto = new google.maps.places.Autocomplete(address);

			google.maps.event.addListener(addressAuto, 'place_changed', function() {
				var place = addressAuto.getPlace();

				if (!place.geometry) {
					return;
				}
				if (place.geometry.viewport) {
					$scope.map.fitBounds(place.geometry.viewport);
				} else {
					$scope.map.setCenter(place.geometry.location);
				}
				newMarker.setPosition(place.geometry.location);
				newMarker.setVisible(true);
				$('#latitude').text(newMarker.getPosition().lat());
				$('#longitude').text(newMarker.getPosition().lng());

				return false;
			});
		}

		// functionality for map manipulation icon on mobile devices
		$('.mapHandler').click(function() {
			if ($('#mapView').hasClass('mob-min') ||
				$('#mapView').hasClass('mob-max') ||
				$('#content').hasClass('mob-min') ||
				$('#content').hasClass('mob-max')) {
				$('#mapView').toggleClass('mob-max');
				$('#content').toggleClass('mob-min');
			} else {
				$('#mapView').toggleClass('min');
				$('#content').toggleClass('max');
			}

			setTimeout(function() {
				var priceSliderRangeLeft = parseInt($('.priceSlider .ui-slider-range').css('left'));
				var priceSliderRangeWidth = $('.priceSlider .ui-slider-range').width();
				var priceSliderLeft = priceSliderRangeLeft + (priceSliderRangeWidth / 2) - ($('.priceSlider .sliderTooltip').width() / 2);
				$('.priceSlider .sliderTooltip').css('left', priceSliderLeft);

				var areaSliderRangeLeft = parseInt($('.areaSlider .ui-slider-range').css('left'));
				var areaSliderRangeWidth = $('.areaSlider .ui-slider-range').width();
				var areaSliderLeft = areaSliderRangeLeft + (areaSliderRangeWidth / 2) - ($('.areaSlider .sliderTooltip').width() / 2);
				$('.areaSlider .sliderTooltip').css('left', areaSliderLeft);

				if ($scope.map) {
					google.maps.event.trigger($scope.map, 'resize');
				}

				$('.commentsFormWrapper').width($('#content').width());
			}, 300);
		});
	}
]);