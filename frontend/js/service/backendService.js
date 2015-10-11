angular.module('palangs')
    .service('backendService', function ($http) {
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
            saveDistance: function (id, data) {
                return $http.post('/api/distance/' + id, data);
            },
            createTeam: function (name) {
                return $http.post('/api/team/', {name: name});
            },
            createParticipant: function(teamId, name) {
                return $http.post('/api/team/' + teamId + '/player', {name: name});
            }
        }
    })
;