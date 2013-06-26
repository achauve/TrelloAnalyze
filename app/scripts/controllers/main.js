'use strict';

angular.module('TrelloAnalyzeApp')
    .controller('MainCtrl', ['$scope', 'TrelloNg', function ($scope, TrelloNg) {

        //---- board part

        $scope.model = {};
        $scope.model.activeBoard = {};

        $scope.model.refresh = function () {
            $scope.model.member = TrelloNg.query('members/me');
            $scope.model.activeBoard = {};
            $scope.model.boards = TrelloNg.query('members/me/boards');
        };

        $scope.refreshActiveBoard = function () {

            if (angular.isUndefined($scope.model.activeBoard.id))
            {
                return;
            }

            $scope.model.activeLists = TrelloNg.query('boards/' + $scope.model.activeBoard.id + '/lists');
            $scope.model.activeLists.then(
                function (allLists) {
                    angular.forEach(allLists, function (list) {
                        list.cards = TrelloNg.query('list/' + list.id + '/cards');
                        list.load = 0;

                        list.cards.then(function (cardList) {
                            angular.forEach(cardList, function (card) {
                                var name = card.name;
                                var loadRegexp = /\((\d+\.?\d*\+?)\)/g;
                                var myArray = loadRegexp.exec(name);
                                if (myArray) {
                                    card.load = parseFloat(myArray[1]);
                                    list.load += card.load;
                                }

                            });
                        });
                    });

                }
            );
        };

        $scope.$watch('model.activeBoard', $scope.refreshActiveBoard);


        //---- login part
        $scope.login = {
            isLoggedIn: false
        };

        var updateLogin = function () {
            $scope.login.isLoggedIn = Trello.authorized();
        };

        $scope.login.loginToTrello = function () {
            Trello.authorize({
                type: "popup",
                name: "TrelloAnalyze",
                scope: { write: false, read: true },
                persist: true,
                success: function () {
                    Trello.authorize({
                        interactive: false,
                        success: function () {
                            updateLogin();
                            $scope.model.refresh();
                        }
                    });
                }
            })
        };

        $scope.login.logoutFromTrello = function () {
            Trello.deauthorize();
            updateLogin();
        };

        Trello.authorize({
            interactive: false,
            success: updateLogin
        });


        $scope.close = function () {
            $scope.isLoggedIn = true;
        };
        $scope.loginOpts = {
            backdropFade: true,
            dialogFade: true,
            backdropClick: false
        };

        // check trello authorization (=token) is still valid and has not been revoked
        TrelloNg.query('members/me').then(
            function (response) {
                $scope.model.refresh();
            },
            function (response) { // error: token revoked (actually should be more detailed, only 401 mean revoked token)
                $scope.login.logoutFromTrello();
            }
        );

    }]);

