(function () {
    'use strict';
    angular
        .module('app')
        .controller('orderCtrl', orderCtrl);


    orderCtrl.$inject = ['$scope', '$http', '$filter', '$aside', 'Users', '$location', '$rootScope', 'Orders', 'order', 'Customers', '$state', '$cookies', '$modal'];
    function orderCtrl($scope, $http, $filter, $aside, Users, $location, $rootScope, Orders, order, Customers, $state, $cookies, $modal) {
        var vm = $scope;

        var cookie = $cookies.get('order');

        if (cookie) {
            if (cookie.length > 0)
                $state.transitionTo('app.meat-selection');
        }

        // pagination variables
        vm.pageSize = 5;
        vm.currentPage = 1;

        Users.getList().then(function (users) {
            vm.users = users;
        });

        Orders.getList().then(function (orders) {
            vm.orders = orders;
        });

        Customers.getList().then(function (customers) {
            vm.customers = customers
        });
        // create empty order object
        vm.neworder = {};
        vm.createCustomer = createCustomer;
        vm.newExistingCustomerOrder = newExistingCustomerOrder;
        vm.editOrder = editOrder;
        vm.editCustomers = editCustomers;
        vm.updateCustomer = updateCustomer;

        // Add product modal
        vm.openModal = $modal({
            scope: vm,
            templateUrl: "apps/orders/modals/existingCustomerModal.html",
            show: false,
            animation: 'am-fade-and-slide-top',
            placement: 'center-top'
        });

        // Function to show product modal
        vm.showModal = function (item) {
            vm.modalItem = item;
            vm.openModal.$promise.then(vm.openModal.show);
        };

        function editCustomers(customer) {
            vm.selectedCustomer = customer;
            vm.showModal();
        };

        function updateCustomer() {
            Customers.post(vm.selectedCustomer).then(function () {
                console.log(vm.selectedCustomer);
                Customers.getList().then(function (customers) {
                    vm.customers = customers;
                    vm.openModal.hide();
                });
            })
        }


        function editOrder(index) {
            // create temp order to be saved at checkout attached ._id of associated customer
            order.save(index);
            // state being changed in the controller if other requirements are needed before changing states
            $state.transitionTo('app.meat-selection');
        };
        // function to begin new order
        function createCustomer() {
            vm.newCustomer.fullName = vm.newCustomer.fname + ' ' + vm.newCustomer.lname;
            Customers.post(vm.newCustomer).then(function (data) {
                //  Customers.getList().then(function (customers) {
                //    vm.customers = customers;
                //   angular.forEach(vm.customers, function (customer) {
                vm.neworder.customerID = data.order[0]._id;
                vm.neworder.customerEmail = vm.newCustomer.email;
                vm.neworder.customerName = vm.newCustomer.fullName;
                //  })
                //});
            })
            // create temp order to be saved at checkout attached ._id of associated customer
            order.save(vm.neworder);
            // state being changed in the controller if other requirements are needed before changing states
            $state.transitionTo('app.meat-selection');
            /*
             Orders.post(vm.neworder).then(function (result) {
             // create temp variable to compare id with order id
             var o = {};
             var o = vm.neworder;
             o._id = result.order[0]._id;
             }); */
        };
        // function to begin new order
        function newExistingCustomerOrder(index) {
            Customers.getList().then(function (customers) {
                vm.customers = customers;
                angular.forEach(vm.customers, function (customer) {
                    if (customer._id == index._id) {
                        vm.neworder.customerID = index._id;
                        vm.neworder.customerName = index.fname + ' ' + index.lname;
                    }
                })
            })
            // create temp order to be saved at checkout attached ._id of associated customer
            order.save(vm.neworder);
            // state being changed in the controller if other requirements are needed before changing states
            $state.transitionTo('app.meat-selection');
        };

    }
})();
