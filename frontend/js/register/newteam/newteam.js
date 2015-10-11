angular.module('palangs')
    .directive('newteam', function (backendService, $timeout) {
        return {
            scope: {},
            templateUrl: "register/newteam/newteamTemplate.html",
            controller: function ($scope) {
                $scope.saveText = "Lagre";

                $scope.save = function() {
                    $scope.saveText = "Lagrer...";
                    backendService.createTeam($scope.teamName).then(function() {
                        $scope.saveText = "Lagret";
                        $timeout(function() {
                            $scope.saveText = "Lagre"
                        }, 1500);
                    });
                }
            }
        };
    });