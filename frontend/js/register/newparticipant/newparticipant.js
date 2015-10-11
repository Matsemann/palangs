angular.module('palangs')
    .directive('newparticipant', function (backendService, $timeout) {
        return {
            scope: {},
            templateUrl: "register/newparticipant/newparticipantTemplate.html",
            controller: function ($scope) {
                $scope.saveText = "Lagre";
                $scope.participantName = "";
                $scope.team = {};

                getTeams();

                $scope.refresh = function() {
                    getTeams();
                };

                function getTeams() {
                    backendService.getTeams().then(function (result) {
                        $scope.teams = result.data;
                    });
                }

                $scope.save = function() {
                    $scope.saveText = "Lagrer...";
                    backendService.createParticipant($scope.team.id, $scope.participantName).then(function() {
                        $scope.saveText = "Lagret";
                        $timeout(function() {
                            $scope.saveText = "Lagre"
                        }, 1500);
                    });
                }
            }
        };
    });