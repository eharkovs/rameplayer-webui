/*jshint maxcomplexity:9 */

/**
 * Rameplayer WebUI
 * Copyright (C) 2015
 *
 * See LICENSE.
 */

/**
 * Data Service
 * @namespace Factories
 */
(function() {
    'use strict';

    angular
        .module('rameplayer.core')
        .factory('dataService', dataService);

    dataService.$inject = ['$log', '$http', '$resource', '$location',
        'simulationDataService', 'listProvider', 'ListIds', 'serverConfig'];

    /**
     * @namespace DataService
     * @desc Application wide service for REST API
     * @memberof Factories
     */
    function dataService($log, $http, $resource, $location, simulationDataService, listProvider,
                         ListIds, serverConfig) {

        if (serverConfig.simulation) {
            // replace this with simulationDataService
            return simulationDataService;
        }

        var baseUrl = getBaseUrl();
        var Settings = $resource(baseUrl + 'settings/user/');
        var SystemSettings = $resource(baseUrl + 'settings/system/');
        var List = listProvider.getResource(baseUrl + 'lists/:id');
        var listItemUrl = baseUrl + 'lists/:listId/items/:itemId';
        var ListItem = $resource(listItemUrl, {
            listId: '',
            itemId: ''
        }, {
            update: {
                method: 'PUT'
            }
        });

        var service = {
            getSettings: getSettings,
            getStatus: getStatus,
            setCursor: setCursor,
            getList: getList,
            addToPlaylist: addToPlaylist,
            addStreamToPlaylist: addStreamToPlaylist,
            removeFromPlaylist: removeFromPlaylist,
            movePlaylistItem: movePlaylistItem,
            createPlaylist: createPlaylist,
            removePlaylist: removePlaylist,
            clearPlaylist: clearPlaylist,
            play: play,
            pause: pause,
            stop: stop,
            seek: seek,
            stepBackward: stepBackward,
            stepForward: stepForward,
            getRameVersioning: getRameVersioning,
            getSystemSettings: getSystemSettings
        };

        return service;

        /**
         * @name getBaseUrl
         * @desc Returns base URL for REST API calls. Optionally you can pass
         * hostname, port and basePath as parameters.
         * @returns string
         */
        function getBaseUrl(hostname, port, basePath) {
            hostname = hostname || serverConfig.host;
            port = port || serverConfig.port;
            basePath = basePath || serverConfig.basePath || '/';
            var url = '';
            if (hostname || port) {
                url = location.protocol + '//';
                // from location.host, strip away possible port
                url += hostname || location.host.split(':')[0];
                if (port) {
                    url += ':' + port;
                }
            }
            url += basePath;
            return url;
        }

        /**
         * @name getSettings
         * @desc Returns instance object of Settings $resource. You can save
         * settings by calling returned object.$save();
         * @returns object
         */
        function getSettings() {
            return Settings.get();
        }

        /**
         * @name getSystemSettings
         * @desc Returns instance object of SystemSettings $resource. You can save
         * settings by calling returned object.$save();
         * @returns object
         */
        function getSystemSettings() {
            return SystemSettings.get();
        }

        function getStatus(payload) {
            return $http.post(baseUrl + 'status', payload);
        }

        function setCursor(itemId) {
            return $http.put(baseUrl + 'cursor', {
                id: itemId
            });
        }

        function getList(id) {
            return List.get({
                id: id
            });
        }

        function addToPlaylist(listId, item) {
            var newItem = new ListItem({
                uri: item.uri
            });
            return newItem.$save({
                listId: listId,
                itemId: ''
            });
        }

        function addStreamToPlaylist(listId, item) {
            var newItem = new ListItem({
                title: item.title,
                uri: item.uri
            });
            return newItem.$save({
                listId: listId,
                itemId: ''
            });
        }

        function removeFromPlaylist(listId, mediaItem) {
            return ListItem.delete({
                listId: listId,
                itemId: mediaItem.id
            });
        }

        function movePlaylistItem(listId, item, oldIndex, newIndex) {
            return ListItem.update({
                // url variables
                listId: listId,
                itemId: item.id,
            }, {
                // payload
                oldIndex: oldIndex,
                newIndex: newIndex
            });
        }

        function createPlaylist(playlist) {
            var newPlaylist = new List(playlist);
            return newPlaylist.$save({
                id: ''
            });
        }

        function removePlaylist(id) {
            return List.delete({
                id: id
            });
        }

        function clearPlaylist(id) {
            return ListItem.delete({
                listId: id,
                itemId: ''
            });
        }

        function play() {
            return $http.get(baseUrl + 'player/play');
        }

        function pause() {
            return $http.get(baseUrl + 'player/pause');
        }

        function stop() {
            return $http.get(baseUrl + 'player/stop');
        }

        function seek(position) {
            return $http.get(baseUrl + 'player/seek/' + position);
        }

        function stepBackward() {
            return $http.get(baseUrl + 'player/step-backward');
        }

        function stepForward() {
            return $http.get(baseUrl + 'player/step-forward');
        }

        function getRameVersioning() {
            return $http.get(baseUrl + 'version');
        }
    }
})();
