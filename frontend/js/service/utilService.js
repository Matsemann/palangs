angular.module('palangs')
    .constant('totalDistance', 11750)
    .constant('startDate', "2015-10-09")
    .service('utilService', function ($http, startDate) {

        function dateToString(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

        function getDays() {
            var dateParts = startDate.split('-');
            var current = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            var today = new Date(new Date().toISOString().slice(0, 10));

            var days = [];

            while (current <= today) {
                days.push(dateToString(current));
                current = new Date(current);
                current.setDate(current.getDate() + 1);
            }

            return days;
        }

        return {
            getDays: getDays,
            dateToString: dateToString
        }
    })
;