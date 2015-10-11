angular.module('palangs', [
    'ngRoute',
    'templates'
])
    .config(function ($routeProvider) {

        $routeProvider
            .when('/', {
                template: "<teamstatistics></teamstatistics>"
            })
            .when('/participants', {
                template: "<participantstatistics></participantstatistics>"
            })
            .otherwise(({
                redirectTo: '/'
            }));
    });