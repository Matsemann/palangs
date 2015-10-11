angular.module('palangs', [
    'ngRoute'
])
    .config(function ($routeProvider) {

        $routeProvider
            .when('/', {
                template: "<teamstatistics></teamstatistics>"
            })
            .otherwise(({
                redirectTo: '/'
            }));
    });