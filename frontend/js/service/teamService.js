angular.module('palangs')
    .constant('totalDistance', 11750)
    .constant('startDate', "2015-10-09")
    .service('backendService', function ($http, startDate) {
        return {
            getTeamStats: function () {
                return $http.get('/api/distance/teams');
            },
            getParticipantsStats: function () {
                return $http.get('/api/distance/participants');
            },
            getTeams: function () {
                return $http.get('/api/team');
            },
            getDays: function () {
                var current = new Date(startDate);
                var today = new Date(new Date().toISOString().slice(0,10));

                var days = [];

                while (current <= today) {
                    days.push(current.toISOString().slice(0,10));
                    current = new Date(current);
                    current.setDate(current.getDate() + 1);
                }

                return days;
            },
            saveDistance: function(id, data) {
                return $http.post('/api/distance/' + id, data);
            }
    }
})
;