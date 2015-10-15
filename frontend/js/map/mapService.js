angular.module('palangs')
    .service('mapService', function ($timeout, totalDistance) {

        function Map(svgElement) {
            this.element = svgElement;
            this.svg = svgElement.contentDocument;

            this.path = this.svg.querySelector("#path path");
            this.cities = this.svg.querySelectorAll("#cities circle");
            this.tooltip = document.querySelector("#tooltip");
            this.teams = {};

            this.createPanZoom();
            this.resize();
            this.createTooltips();

            var self = this;
            $timeout(function () {
                self.path.style["stroke-dashoffset"] = "0";
                self.adjustPointsToZoom(self.panZoom.getZoom());
            }, 50);
        }

        Map.prototype.createPanZoom = function () {
            var self = this;
            this.panZoom = svgPanZoom(this.element, {
                maxZoom: 50,
                onZoom: function (zoom) {
                    self.adjustPathStrokeToZoom(zoom);
                    self.adjustPointsToZoom(zoom);
                },
                beforePan: function (oldPan, newPan) {
                    var sizes = this.getSizes(); // "this" is panzoom context
                    self.limitPan(newPan, sizes);
                }
            });
        };

        Map.prototype.resize = function () {
            // Let it zoom freely to fit the content, then set
            // that as the new min-zoom to avoid the user zooming more out
            this.panZoom.setMinZoom(0.01);
            this.panZoom.resize();
            this.panZoom.fit();
            this.panZoom.center();
            this.panZoom.setMinZoom(this.panZoom.getZoom());
        };

        Map.prototype.createTooltips = function () {
            var self = this;
            for (var i = 0; i < this.cities.length; i++) {
                var city = this.cities[i];
                city.addEventListener("mouseover", bindMouseOver(city));
                city.addEventListener("mouseout", function () {
                    self.tooltip.style.opacity = 0;
                    self.tooltip.style.visibility = "hidden";

                });
            }

            function bindMouseOver(city) {
                return function (event) {
                    self.tooltip.style.opacity = 1;
                    self.tooltip.innerHTML = city.id.replace("_", " ");
                    self.tooltip.style.top = event.clientY + "px";
                    self.tooltip.style.left = event.clientX + 10 + "px";
                    self.tooltip.style.visibility = "visible";
                };
            }
        };

        Map.prototype.adjustPathStrokeToZoom = function (zoom) {
            var strokeWidth = 3 / zoom;

            if (strokeWidth < 0.3) {
                strokeWidth = 0.3;
            }

            this.path.style.strokeWidth = strokeWidth;
        };

        Map.prototype.adjustPointsToZoom = function (zoom) {
            var radius = 3 / (0.5 * zoom);
            if (radius > 4) {
                radius = 4;
            }

            for (var i = 0; i < this.cities.length; i++) {
                var city = this.cities[i];
                city.setAttribute("r", radius);
            }
            for (var teamName in this.teams) {
                this.teams[teamName].el.setAttribute("r", radius);
            }
        };

        Map.prototype.limitPan = function (newPan, sizes) {
            var limitX = sizes.width - ((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom);
            var limitY = sizes.height - ((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom);

            var customPan = {};

            customPan.x = Math.max(limitX, Math.min(newPan.x, sizes.viewBox.x));
            customPan.y = Math.max(limitY, Math.min(newPan.y, sizes.viewBox.y));

            return customPan;
        };

        Map.prototype.addTeam = function (teamName) {
            var svgNS = "http://www.w3.org/2000/svg";
            var el = this.svg.createElementNS(svgNS, 'circle');

            var team = {
                name: teamName,
                el: el,
                distance: 0
            };

            el.setAttribute("cx", "50"); // todo start pos
            el.setAttribute("cy", "50");
            el.setAttribute("r", "5");
            this.svg.querySelector("#teams").appendChild(el);

            var self = this;
            el.addEventListener("mouseover", function (event) {
                self.tooltip.style.opacity = 1;
                self.tooltip.innerHTML = team.name + ", " + team.distance.toFixed(2) + " km";
                self.tooltip.style.top = event.clientY + "px";
                self.tooltip.style.left = event.clientX + 10 + "px";
                self.tooltip.style.visibility = "visible";
            });
            el.addEventListener("mouseout", function () {
                self.tooltip.style.opacity = 0;
                self.tooltip.style.visibility = "hidden";
            });

            this.teams[teamName] = team;
            this.setTeamDistance(teamName, 0);
            self.adjustPointsToZoom(self.panZoom.getZoom());
        };

        Map.prototype.setTeamDistance = function (teamName, distance) {
            var pathLength = this.path.getTotalLength();

            var team = this.teams[teamName];
            team.distance = distance / 1000;

            var scaledDistance = team.distance / totalDistance * pathLength;
            var mapPosition = this.path.getPointAtLength(scaledDistance);

            team.el.setAttribute("cx", mapPosition.x);
            team.el.setAttribute("cy", mapPosition.y);
            //
            //    var pathLength = path.getTotalLength();
            //    var xy = path.getPointAtLength(dst / totalDistance * pathLength);
        };
        return {
            createMap: function (svgElement) {
                return new Map(svgElement);
            }
        }
    })
;