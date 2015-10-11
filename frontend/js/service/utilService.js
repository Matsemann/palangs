angular.module('palangs')
    .constant('totalDistance', 11750)
    .constant('startDate', "2015-10-09")
    .service('utilService', function ($http, startDate) {
        return {
            getDays: function () {
                var current = new Date(startDate);
                var today = new Date(new Date().toISOString().slice(0, 10));

                var days = [];

                while (current <= today) {
                    days.push(current.toISOString().slice(0, 10));
                    current = new Date(current);
                    current.setDate(current.getDate() + 1);
                }

                return days;
            }
        }
    })
;