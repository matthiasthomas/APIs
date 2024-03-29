"use strict"

angular
    .module('theme.navigation-controller', [])
    .controller('NavigationController', ['$scope', '$location', '$timeout', '$global', 'localStorageService', 'RoleService', 'UserService',
        function($scope, $location, $timeout, $global, localStorageService, RoleService, UserService) {
            $scope.isSuperhero = false;
            if (UserService.activeUser() && RoleService.hasRole(UserService.activeUser(), 'superhero')) {
                $scope.isSuperhero = true;
            }

            $scope.menu = [{
                label: 'Dashboard',
                iconClasses: 'fa fa-home',
                url: '#/'
            }, {
                label: 'Projects',
                iconClasses: 'fa fa-folder',
                url: '#/projects'
            }, {
                label: 'Messages',
                iconClasses: 'fa fa-envelope',
                html: '<span class="badge badge-warning">2</span>',
                children: [{
                    label: 'All',
                    html: '<span class="badge badge-warning">2</span>',
                    url: '#/messages/all'
                }, {
                    label: 'Unread',
                    html: '<span class="badge badge-warning">2</span>',
                    url: '#/messages/unread'
                }, {
                    label: 'Read',
                    url: '#/messages/read'
                }]
            }, {
                label: 'Users',
                iconClasses: 'fa fa-user',
                url: '#/users'
            }, {
                label: 'Roles',
                iconClasses: 'fa fa-eye',
                url: '#/roles'
            }, {
                label: 'Analytics',
                iconClasses: 'fa fa-tachometer',
                url: '#/analytics'
            }, {
                label: 'Bills',
                iconClasses: 'fa fa-money',
                url: '#/bills'
            }, {
                label: 'My Modules',
                iconClasses: 'fa fa-code-fork',
                children: [{
                    label: 'Real Estate',
                    iconClasses: 'fa fa-home',
                    children: [{
                        label: 'Properties',
                        url: '#/modules/realestate/properties'
                    }, {
                        label: 'Property Types',
                        url: '#/modules/realestate/propertyTypes'
                    }, {
                        label: 'Agents',
                        url: '#/modules/realestate/agents'
                    }]
                }]
            }, {
                label: 'Modules',
                iconClasses: 'fa fa-code-fork',
                url: '#/modules'
            }];

            var setParent = function(children, parent) {
                angular.forEach(children, function(child) {
                    child.parent = parent;
                    if (child.children !== undefined) {
                        setParent(child.children, child);
                    }
                });
            };

            $scope.findItemByUrl = function(children, url) {
                for (var i = 0, length = children.length; i < length; i++) {
                    if (children[i].url && children[i].url.replace('#', '') == url) return children[i];
                    if (children[i].children !== undefined) {
                        var item = $scope.findItemByUrl(children[i].children, url);
                        if (item) return item;
                    }
                }
            };

            setParent($scope.menu, null);

            $scope.openItems = [];
            $scope.selectedItems = [];
            $scope.selectedFromNavMenu = false;

            $scope.select = function(item) {
                // close open nodes
                if (item.open) {
                    item.open = false;
                    return;
                }
                for (var i = $scope.openItems.length - 1; i >= 0; i--) {
                    $scope.openItems[i].open = false;
                }
                $scope.openItems = [];
                var parentRef = item;
                while (parentRef !== null) {
                    parentRef.open = true;
                    $scope.openItems.push(parentRef);
                    parentRef = parentRef.parent;
                }

                // handle leaf nodes
                if (!item.children || (item.children && item.children.length < 1)) {
                    $scope.selectedFromNavMenu = true;
                    for (var j = $scope.selectedItems.length - 1; j >= 0; j--) {
                        $scope.selectedItems[j].selected = false;
                    }
                    $scope.selectedItems = [];
                    parentRef = item;
                    while (parentRef !== null) {
                        parentRef.selected = true;
                        $scope.selectedItems.push(parentRef);
                        parentRef = parentRef.parent;
                    }
                }
            };

            $scope.$watch(function() {
                return $location.path();
            }, function(newVal, oldVal) {
                if ($scope.selectedFromNavMenu === false) {
                    var item = $scope.findItemByUrl($scope.menu, newVal);
                    if (item)
                        $timeout(function() {
                            $scope.select(item);
                        });
                }
                $scope.selectedFromNavMenu = false;
            });

            // searchbar
            $scope.showSearchBar = function($e) {
                $e.stopPropagation();
                $global.set('showSearchCollapsed', true);
            };
            $scope.$on('globalStyles:changed:showSearchCollapsed', function(event, newVal) {
                $scope.style_showSearchCollapsed = newVal;
            });
            $scope.goToSearch = function() {
                $location.path('/extras-search');
            };
        }
    ]);