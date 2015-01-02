'use strict';

var myApp = angular
  .module('myApp', [
    'easypiechart',
    'toggle-switch',
    'ui.bootstrap',
    'ui.tree',
    'ui.select2',
    'ngGrid',
    'xeditable',
    'flow',

    //Added by Matthias

    'userModule',
    'billModule',
    'imageModule',
    'messageModule',
    'moduleModule',
    'projectModule',
    'roleModule',
    'LocalStorageModule',
    'usersProjectModule',
    'pagesControllersModule',

    //End Added

    'theme.services',
    'theme.directives',
    'theme.navigation-controller',
    'theme.notifications-controller',
    'theme.messages-controller',
    'theme.colorpicker-controller',
    'theme.layout-horizontal',
    'theme.layout-boxed',
    'theme.vector_maps',
    'theme.google_maps',
    'theme.calendars',
    'theme.gallery',
    'theme.tasks',
    'theme.ui-tables-basic',
    'theme.ui-panels',
    'theme.ui-ratings',
    'theme.ui-modals',
    'theme.ui-tiles',
    'theme.ui-alerts',
    'theme.ui-sliders',
    'theme.ui-progressbars',
    'theme.ui-paginations',
    'theme.ui-carousel',
    'theme.ui-tabs',
    'theme.ui-nestable',
    'theme.form-components',
    'theme.form-directives',
    'theme.form-validation',
    'theme.form-inline',
    'theme.form-image-crop',
    'theme.form-uploads',
    'theme.tables-ng-grid',
    'theme.tables-editable',
    'theme.charts-flot',
    'theme.charts-canvas',
    'theme.charts-svg',
    'theme.charts-inline',
    'theme.pages-controllers',
    'theme.dashboard',
    'theme.templates',
    'theme.template-overrides',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
  ])
  .controller('MainController', ['$scope', '$global', '$timeout',
    function($scope, $global, $timeout) {
      $scope.style_fixedHeader = $global.get('fixedHeader');
      $scope.style_headerBarHidden = $global.get('headerBarHidden');
      $scope.style_layoutBoxed = $global.get('layoutBoxed');
      $scope.style_fullscreen = $global.get('fullscreen');
      $scope.style_leftbarCollapsed = $global.get('leftbarCollapsed');
      $scope.style_leftbarShown = $global.get('leftbarShown');
      $scope.style_rightbarCollapsed = $global.get('rightbarCollapsed');
      $scope.style_isSmallScreen = false;
      $scope.style_showSearchCollapsed = $global.get('showSearchCollapsed');
      $scope.style_layoutHorizontal = $global.get('layoutHorizontal');

      $scope.hideSearchBar = function() {
        $global.set('showSearchCollapsed', false);
      };

      $scope.hideHeaderBar = function() {
        $global.set('headerBarHidden', true);
      };

      $scope.showHeaderBar = function($event) {
        $event.stopPropagation();
        $global.set('headerBarHidden', false);
      };

      $scope.toggleLeftBar = function() {
        if ($scope.style_isSmallScreen) {
          return $global.set('leftbarShown', !$scope.style_leftbarShown);
        }
        $global.set('leftbarCollapsed', !$scope.style_leftbarCollapsed);
      };

      $scope.toggleRightBar = function() {
        $global.set('rightbarCollapsed', !$scope.style_rightbarCollapsed);
      };

      $scope.$on('globalStyles:changed', function(event, newVal) {
        $scope['style_' + newVal.key] = newVal.value;
      });
      $scope.$on('globalStyles:maxWidth767', function(event, newVal) {
        $timeout(function() {
          $scope.style_isSmallScreen = newVal;
          if (!newVal) {
            $global.set('leftbarShown', false);
          } else {
            $global.set('leftbarCollapsed', false);
          }
        });
      });

      // there are better ways to do this, e.g. using a dedicated service
      // but for the purposes of this demo this will do :P
      /*
    $scope.isLoggedIn = true;
    $scope.logOut = function() {
      $scope.isLoggedIn = false;
    };
    $scope.logIn = function() {
      $scope.isLoggedIn = true;
    };
    */

      $scope.rightbarAccordionsShowOne = false;
      $scope.rightbarAccordions = [{
        open: true
      }, {
        open: true
      }, {
        open: true
      }, {
        open: true
      }, {
        open: true
      }, {
        open: true
      }, {
        open: true
      }];
    }
  ]);