angular.module('palangs')
    .directive('selectParticipant', function (backendService) {
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

                $scope.selected.date = yesterday.toISOString().slice(0, 10);
                $scope.selected.team = null;
                $scope.selected.participant = null;

                $scope.days = backendService.getDays();

                var days = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
                $scope.readableDay = function (day) {
                    return day + " (" + days[new Date(day).getDay()] + ")";
                };
            }
        };
    });