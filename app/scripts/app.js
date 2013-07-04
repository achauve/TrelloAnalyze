'use strict';

angular.module('TrelloAnalyzeApp', ['ui.bootstrap', 'LocalStorageModule', 'ngGrid'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    }])
    .config(['$httpProvider', function($httpProvider) {
        delete $httpProvider.defaults.headers.common["X-Requested-With"]
    }]).filter('encodeURIComponent', function() {
        return window.encodeURIComponent;
    }).service('TrelloNg', [ '$q', '$rootScope', function($q, $rootScope){

        var TrelloNg = {};

        // wrap Trello queries in angular promise
        TrelloNg.query = function(entity_name) { // success
            var deferred = $q.defer();
            Trello.get(entity_name, function(data) {
                // wrap call to resolve in $apply as this function is out of the main event loop
                $rootScope.$apply(function() {
                    deferred.resolve(data);
                });
            }, function(response) { // error
                $rootScope.$apply(function() {
                    deferred.reject(response);
                });
            });

            return deferred.promise;
        };

        return TrelloNg;
    }]);


