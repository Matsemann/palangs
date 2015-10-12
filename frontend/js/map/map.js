angular.module('palangs')
    .directive('map', function (totalDistance) {
        return {
            scope: {},
            templateUrl: "map/mapTemplate.html",
            controller: function ($scope) {

            },
            link: function (scope, el, attrs) {
                var svgEl = document.querySelector("#map");
                svgEl.addEventListener('load', function () {
                    start(svgEl);
                });

                function start(svgEl) {
                    console.log("starting3");
                    var svg = svgEl.contentDocument;
                    var path = svg.querySelector("#path path");
                    var cities = svg.querySelectorAll("#cities circle");
                    var tooltip = document.querySelector("#tooltip");

                    addCitiesTooltips();

                    setTimeout(function () {
                        animatePath();
                        adjustCitiesToZoom(1);
                    }, 50);

                    var panZoom = svgPanZoom(svgEl, {
                        maxZoom: 50,
                        minZoom: 1,
                        onZoom: function (zoom) {
                            adjustPathStrokeToZoom(zoom);
                            adjustCitiesToZoom(zoom);
                        },
                        beforePan: beforePan
                    });


                    function adjustPathStrokeToZoom(zoom) {
                        var strokeWidth = 3 / zoom;

                        if (strokeWidth < 0.3) {
                            strokeWidth = 0.3;
                        }

                        path.style.strokeWidth = strokeWidth;
                    }

                    function adjustCitiesToZoom(zoom) {
                        var radius = 3 / (0.5 * zoom);
                        if (radius > 4) {
                            radius = 4;
                        }

                        for (var i = 0; i < cities.length; i++) {
                            var city = cities[i];
                            city.setAttribute("r", radius);
                        }
                    }


                    function beforePan(oldPan, newPan) {
                        var sizes = this.getSizes();

                        var limitX = sizes.width - ((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom);
                        var limitY = sizes.height - ((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom);

                        var customPan = {};

                        customPan.x = Math.max(limitX, Math.min(newPan.x, sizes.viewBox.x));
                        customPan.y = Math.max(limitY, Math.min(newPan.y, sizes.viewBox.y));

                        return customPan;
                    }

                    function animatePath() {
                        path.style["stroke-dashoffset"] = "0";
                    }

                    function addCitiesTooltips() {
                        for (var i = 0; i < cities.length; i++) {
                            var city = cities[i];
                            city.addEventListener("mouseover", bindMouseOver(city));
                            city.addEventListener("mouseout", function () {
                                tooltip.style.opacity = 0;
                            });
                        }

                        function bindMouseOver(city) {
                            return function (event) {
                                tooltip.style.opacity = 1;
                                tooltip.innerHTML = city.id.replace("_", " ");
                                tooltip.style.top = event.clientY + "px";
                                tooltip.style.left = event.clientX + 10 + "px";
                            };
                        }
                    }
                }

            }
        };
    });