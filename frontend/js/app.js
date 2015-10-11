angular.module('palangs', [
    'ngRoute',
    'templates'
])
    .config(function ($routeProvider) {

        $routeProvider
            .when('/', {
                template: "<introduction></introduction>"
            })
            .when('/teams', {
                template: "<teamstatistics></teamstatistics>"
            })
            .when('/participants', {
                template: "<participantstatistics></participantstatistics>"
            })
            .when('/log', {
                template: "<log></log>"
            })
            .when('/register', {
                template: "<register></register>"
            })
            .otherwise(({
                redirectTo: '/'
            }));
    });