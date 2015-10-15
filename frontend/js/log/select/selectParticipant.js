angular.module('palangs')
    .directive('selectParticipant', function (backendService, utilService) {
        return {
            scope: {
                teams: "=",
                selected: "=",
                notify: "&"
            },
            templateUrl: "log/select/selectParticipantTemplate.html",
            controller: function ($scope) {
                var yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                $scope.selected.date = utilService.dateToString(yesterday);
                $scope.selected.team = null;
                $scope.selected.participant = null;

                $scope.days = utilService.getDays();

                var days = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
                $scope.readableDay = function (day) {
                    return day + " (" + days[new Date(day).getDay()] + ")";
                };
            }
        };
    });