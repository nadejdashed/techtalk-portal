;(function(ng) {
    'use strict';

    ng.module('tp.services', []);
    ng.module('tp.directives', []);

    ng.module('tp', [
            'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngAnimate',
            'tp.services', 'tp.directives'
        ])
        .config(['$routeProvider', '$locationProvider', '$provide',
            function($routeProvider, $locationProvider, $provide) {
                $provide.constant('appConfig', {
                    userCookie: 'user_settings',
                    responseStatus: {
                        SUCCESS: 'success',
                        ERROR: 'error'
                    },
                    BASE_PATH: '/portal',
                    EMAIL_SUFFIX: '@epam.com'
                });

                $routeProvider
                    .when('/portal',{
                        controller:'mainController'
                    })
                    .when('/portal/api/ideas/:ideaId',{
                        controller: 'commentsController',
                        templateUrl:'/portal/views/ideaPage.html'
                    })
                    .otherwise({redirectTo: '/portal'});
            }])
        .run(['$rootScope', '$q', 'authService', function($rootScope, $q, authService) {
            return $q.all([
                authService.checkAuthN()
            ]);
        }])
        .controller('AppCtrl', ['$rootScope', '$scope', '$q', 'authService',
            function($rootScope, $scope, $q, authService) {
                var global = {
                    isAuthN: authService.isAuthN(),
                    currentUser: authService.getUserData(),
                    errorStack: []
                };

                $rootScope.global = global;
                $scope.auth = {};

                $scope.signin = function() {
                    $scope.authInProgress = true;

                    authService.login({
                        login: $scope.auth.login,
                        password: $scope.auth.password
                    })
                        .then(function() {

                        }, function(error) {
                            $rootScope.global.errorStack.push(error);
                            console.error(error.errorCode, error.message);
                        })
                        ['finally'](function() {
                        $scope.authInProgress = false;
                    });
                };

                $scope.logout = function() {
                    authService.logout();
                };
            }]);
})(angular);