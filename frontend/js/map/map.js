angular.module('palangs')
    .directive('map', function (totalDistance, mapService, backendService, utilService) {
        return {
            scope: {},
            templateUrl: "map/mapTemplate.html",
            controller: function ($scope) {

            },
            link: function (scope, el, attrs) {
                var svgEl = document.querySelector("#map");
                svgEl.addEventListener('load', loaded);

                var map;
                var teamData;


                function loaded() {
                    map = mapService.createMap(svgEl);
                    $(window).on('resize.map', function () {
                        map.resize();
                    });

                    backendService.getTeamStats().then(function (result) {
                        teamData = result.data;
                        addTeamsToMap();
                        animateTeams();
                    });

                }

                function addTeamsToMap() {
                    teamData.forEach(function (team) {
                        map.addTeam(team.name);
                    });
                }

                function animateTeams() {
                    var dates = utilService.getDays();

                    var stepsPerDay = 15;

                    var accumuluatedLengths = {};
                    teamData.forEach(function(team) {accumuluatedLengths[team.name] = 0})

                    var step = 0;
                    var day = 0;
                    var interval = setInterval(function () {
                        for (var i = 0; i < teamData.length; i++) {
                            var team = teamData[i];
                            var date = dates[day];

                            accumuluatedLengths[team.name] += team.days[date] ? team.days[date] / stepsPerDay : 0;

                            console.log("setting " + team.name + " to " + accumuluatedLengths[team.name]);
                            map.setTeamDistance(team.name, accumuluatedLengths[team.name]);
                        }

                        step++;
                        if (step == stepsPerDay) {
                            step = 0;
                            day++;
                            if (day == dates.length) {
                                clearInterval(interval);
                            }
                        }

                    }, 25);

                }

                el.on('$destroy', function () {
                    $(window).off('resize.map');
                });

            }
        };
    });