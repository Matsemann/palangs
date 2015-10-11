angular.module('palangs')
    .directive('teamstatistics', function (backendService) {
        return {
            scope: {},
            controller: function($scope) {
                $scope.value = 33;

                backendService.getTeamStats().then(function(result) {
                     console.log(result.data);
                });
            }
        };
    });