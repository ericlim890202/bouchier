(function () {
    'use strict';
    angular
        .module('app')
        .controller('adminUsersCtrl', adminUsersCtrl);


    adminUsersCtrl.$inject = ['$scope', 'Users', 'order', '$modal', '$state', '$stateParams'];
    function adminUsersCtrl($scope, Users, order, $modal, $state, $stateParams) {
        var vm = $scope;

        // User list for staff dropdown
        Users.getList().then(function (users) {
            vm.users = users;

            vm.saveUser = saveUser;
            vm.removeUser = removeUser;
            vm.editUser = editUser;
            vm.addUser = addUser;

            // pagination variables
            vm.pageSize = 10;
            vm.currentPage = 1;

            // Add user modal
            vm.userModal = $modal({
                scope: vm,
                templateUrl: "apps/admin/modals/newUserModal.html",
                show: false,
                animation: 'am-fade-and-slide-top',
                placement: 'center'
            });

            // Function to show user modal
            vm.showUserModal = function (item) {
                vm.modalItem = item;
                vm.userModal.$promise.then(vm.userModal.show);
            };


            // Delete user modal
            vm.deleteUserModal = $modal({
                scope: vm,
                templateUrl: "apps/admin/modals/deleteUserModal.html",
                show: false,
                animation: 'am-fade-and-slide-top',
                placement: 'center'
            });

            // Function to show delete user modal
            vm.showDeleteModal = function (user) {
                vm.modalItem = user;
                vm.deleteUserModal.$promise.then(vm.deleteUserModal.show);
            };

            /* USER FUNCTIONS SECTION */

            // tooltip for user access level
            vm.tooltip = {
                "title": "Standard users cannot access this admin area",
            };

            vm.access = [
                'Standard', 'Administrator'
            ]

            // Editing existing product
            function editUser(user) {
                vm.newUser = user;
                vm.isUserNew = false;
                vm.showUserModal();
            };
            // add new product
            function addUser() {
                vm.newUser = {};
                vm.isUserNew = true;
                vm.showUserModal();
            };

            function saveUser() {
                Users.post(vm.newUser).then(function () {
                    Users.getList().then(function (users) {
                        vm.users = users;
                        vm.userModal.hide();
                    });
                })
            };
            // function to remove selected product from database
            function removeUser(index) {
                vm.users.remove(index).then(function () {
                    Users.getList().then(function (users) {
                        vm.users = users;
                        vm.deleteUserModal.hide();
                    });
                })
            };

            // END OF USERS LIST
        });

    }

})();