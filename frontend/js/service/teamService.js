angular.module('palangs')
    .service('backendService',function ($http) {

        return {
            getTeamStats: function() {
                return $http.get('/api/distance/teams');
            }
        }
    });