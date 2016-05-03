(function() {
    'use strict';

    angular
        .module('rameplayer.playlists')
        .controller('EditModalController', EditModalController);

    EditModalController.$inject = ['$rootScope', '$timeout', '$log', '$uibModalInstance', 'listId', 'storageOptions'];

    function EditModalController($rootScope, $timeout, $log, $uibModalInstance, listId, storageOptions) {
        var vm = this;

        var playlist = $rootScope.lists[listId];
        vm.title = playlist.title;

        vm.storageOptions = storageOptions;
        vm.storage = vm.storageOptions[0].value;
        vm.save = save;
        vm.cancel = cancel;

        $uibModalInstance.opened.then(function() {
            // focus to input field
            // on mobile it opens keyboard mode automatically
            // have to wait until fade in is finished before focus works
            var delay = 500;
            $timeout(function() {
                $('#newPlaylistTitle').focus();
            }, delay);
        });

        function save() {
            // validate form
            var valid = true;
            var $title = $('#newPlaylistTitle');
            // use browser's native html5 validation
            if (typeof $title[0].willValidate !== 'undefined') {
                valid = $title[0].checkValidity();
            }

            if (valid) {
                $uibModalInstance.close({
                    title: vm.title,
                    storage: vm.storage
                });
            }
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
})();
