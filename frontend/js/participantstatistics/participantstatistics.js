angular.module('palangs')
    .directive('participantstatistics', function (backendService, utilService) {
        return {
            scope: {},
            templateUrl: "participantstatistics/participantstatisticsTemplate.html",
            controller: function ($scope) {
                backendService.getParticipantsStats().then(function (result) {
                    $scope.participants = result.data.sort(function (a, b) {
                        return b.totalDistance - a.totalDistance;
                    });
                });

                $scope.days = utilService.getDays();

                $scope.toKm = function(distance) {
                    if (distance) {
                        return (distance/1000).toFixed(2) + " km";
                    } else {
                        return "-";
                    }
                };
            }
        };
    });