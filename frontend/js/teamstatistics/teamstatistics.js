angular.module('palangs')
    .directive('teamstatistics', function (backendService, totalDistance) {
        return {
            scope: {},
            templateUrl: "teamstatistics/teamstatisticsTemplate.html",
            controller: function ($scope) {
                backendService.getTeamStats().then(function (result) {
                    $scope.teams = result.data.sort(function (a, b) {
                        return b.totalDistance - a.totalDistance;
                    });
                });

                $scope.days = backendService.getDays();

                $scope.percent = function(distance) {
                    return ((distance/1000) / totalDistance * 100).toFixed(2);
                };

                $scope.toKm = function(distance) {
                    return (distance/1000).toFixed(2);
                };
            }
        };
    });