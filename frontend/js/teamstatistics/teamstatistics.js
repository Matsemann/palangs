angular.module('palangs')
    .directive('teamstatistics', function (backendService, totalDistance, utilService) {
        return {
            scope: {},
            templateUrl: "teamstatistics/teamstatisticsTemplate.html",
            controller: function ($scope) {
                backendService.getTeamStats().then(function (result) {
                    $scope.teams = result.data.sort(function (a, b) {
                        return b.totalDistance - a.totalDistance;
                    });
                });

                $scope.days = utilService.getDays();

                $scope.percent = function(distance) {
                    return ((distance/1000) / totalDistance * 100).toFixed(2);
                };

                $scope.toKm = utilService.toKm;
            }
        };
    });