angular.module('palangs')
    .directive('log', function (backendService, $timeout) {
        return {
            scope: {},
            templateUrl: "log/logTemplate.html",
            controller: function ($scope) {
                $scope.selected = {
                };
                $scope.saveText = "Lagre";

                backendService.getTeams().then(function (result) {
                    $scope.teams = result.data;
                });


                var lagretData = [];
                var participantData;
                backendService.getParticipantsStats().then(function (result) {
                    lagretData = result.data;
                });

                $scope.$watch(function() {
                    return $scope.selected;
                }, function(newValue) {
                    if (!newValue.participant) {
                        return;
                    }

                    participantData = null;
                    for (var i = 0; i < lagretData.length; i++) {
                        var d = lagretData[i];
                        if (d.id == newValue.participant.id) {
                            participantData = d;
                            break;
                        }
                    }

                    var distanceForDay;
                    if (participantData) {
                        distanceForDay = participantData.days[newValue.date] ? participantData.days[newValue.date] : "0";
                    } else {
                        participantData = {
                            days: {}
                        };
                        distanceForDay = "0;"
                    }

                    $scope.distanceM = distanceForDay;
                    $scope.updateM();
                }, true);

                $scope.updateM = function() {
                    $scope.distanceM = parseInt($scope.distanceM, 10);
                    $scope.distanceS = Math.floor($scope.distanceM * 1.3);
                };

                $scope.updateS = function() {
                    $scope.distanceM = Math.floor($scope.distanceS / 1.3);
                };

                $scope.save = function() {
                    $scope.saveText = "Lagrer...";
                    participantData.days[$scope.selected.date] = $scope.distanceM;
                    backendService.saveDistance($scope.selected.participant.id, {
                        date: $scope.selected.date,
                        distance: $scope.distanceM
                    }).then(function() {
                        $scope.saveText = "Lagret";
                        $timeout(function() {
                            $scope.saveText = "Lagre"
                        }, 1500);
                    });
                }
            }
        };
    });