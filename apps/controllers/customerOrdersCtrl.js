(function () {
    'use strict';
    angular
        .module('app')
        .controller('customerOrdersCtrl', customerOrdersCtrl);


    customerOrdersCtrl.$inject = ['$scope', 'Customers', 'Orders', '$modal', '$state', '$stateParams'];
    function customerOrdersCtrl($scope, Customers, Orders, $modal, $state, $stateParams) {
        var vm = $scope;
        // User list for staff dropdown
        Customers.getList().then(function (customers) {
            vm.customers = customers;
            // get _id of selected customer and return selected customer as object
            angular.forEach(vm.customers, function(customer) {
                if(customer._id == $stateParams.id) {
                    vm.tempCustomer = customer;
                }
            });

            Orders.getList().then(function (orders) {
                vm.orders = orders;
            });

            vm.editCustomer = editCustomer;
            vm.addCustomer= addCustomer;
            vm.saveCustomer = saveCustomer;
            vm.removeCustomer = removeCustomer;


            // Add customer modal
            vm.customerModal = $modal({
                scope: vm,
                templateUrl: "apps/admin/modals/newCustomerModal.html",
                show: false,
                animation: 'am-fade-and-slide-top',
                placement: 'center'
            });

            // Function to show delete customer modal
            vm.showCustomerModal = function (customer) {
                vm.modalItem = customer;
                vm.customerModal.$promise.then(vm.customerModal.show);
            };

            // Delete customer modal
            vm.deleteCustModal = $modal({
                scope: vm,
                templateUrl: "apps/admin/modals/deleteCustomerModal.html",
                show: false,
                animation: 'am-fade-and-slide-top',
                placement: 'center'
            });

            // Function to show delete customer modal
            vm.showDeleteCustModal = function (customer) {
                vm.modalItem = customer;
                vm.deleteCustModal.$promise.then(vm.deleteCustModal.show);
            };

            /* PRODUCT FUNCTIONS SECTION */

            // Editing existing customer
            function editCustomer(customer) {
                vm.newCustomer = customer;
                vm.isCustomerNew = false;
                vm.showCustomerModal();
            };
            // add new customer
            function addCustomer() {
                vm.newCustomer = {};
                vm.isCustomerNew = true;
                vm.showCustomerModal();
            };

            function saveCustomer() {
                Customers.post(vm.newCustomer).then(function () {
                    Customers.getList().then(function (customers) {
                        vm.customers = customers;
                        vm.customerModal.hide();
                    });
                })
            };
            // function to remove selected customer from database
            function removeCustomer(index) {
                vm.customers.remove(index).then(function () {
                    Customers.getList().then(function (customers) {
                        vm.customers = customers;
                        vm.showDeleteCustModal.hide();
                    });
                })
            };

            // END OF CUSTOMERS LIST

        });


    }

})();