﻿(function (app) {
    'use strict';
    app.controller('artistAlbumCtrl', artistAlbumCtrl);
    artistAlbumCtrl.$inject = ['$scope', 'apiService', 'notificationService', '$routeParams'];
    function artistAlbumCtrl($scope, apiService, notificationService, $routeParams) {
        $scope.ArtistID = $routeParams.artistId;

        $scope.pageTitle = 'Album List';
        $scope.loading = true;
        $scope.page = 0;
        $scope.pagesCount = 0;

        $scope.Items = [];

        $scope.search = _search;
        $scope.clearSearch = _clearSearch;

        $scope.AddItem = 'Add New Album';

        function _search(page) {
            page = page || 0;

            $scope.loading = true;

            var config = {
                params: {
                    page: page,
                    pageSize: 4,
                    filter: parseInt($scope.ArtistID)
                }
            };
            apiService.get('/api/album/searchByArtist/', config,
                _itemsLoadCompleted,
                _itemsLoadFailed,
            );
        }

        function _itemsLoadCompleted(result) {
            $scope.Items = result.data.Items;
            console.log($scope.Items);
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.loading = false;

            if ($scope.filterMusic && $scope.filterMusic.length) {
                notificationService.displayInfo(result.data.Items.length + ' found');
            }
        }

        function _itemsLoadFailed(response) {
            notificationService.displayError(response.data);
        }

        function _clearSearch() {
            $scope.filterMusic = '';
            search();
        }

        $scope.search();
    }

})(angular.module('musicStore'));

