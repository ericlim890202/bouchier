(function () {
    'use strict';
    angular
        .module('app')
        .controller('orderSumCtrl', orderSumCtrl);


    orderSumCtrl.$inject = ['$scope', '$http', '$filter', '$aside', '$state', '$rootScope', '$stateParams', 'Restangular', 'Orders', 'order', '$modal', 'Customers', '$cookies'];
    function orderSumCtrl($scope, $http, $filter, $aside, $state, $rootScope, $stateParams, Restangular, Orders, order, $modal, Customers, $cookies) {
        var vm = $scope;

        vm.orderDetails = order.cart();
        vm.removeFromCart = removeFromCart;
        vm.confirmOrder = confirmOrder;
        vm.orderOwnerFilter = orderOwnerFilter;

        vm.stores = [
            "Toorak", "City", "Deli"
        ];

        /* pickup date counter functions */
        vm.citypud = [];
        vm.toorakpud = [];
        vm.delipud = [];

        vm.pickupdates = [
            {date: "16"}, {date: "17"}, {date: "18"},
            {date: "19"}, {date: "20"}, {date: "21"},
            {date: "22"}, {date: "23"}, {date: "24"}
        ];

        // initialising each pickupdate array - the lazy way...
        vm.citypud[16] = 0;
        vm.citypud[17] = 0;
        vm.citypud[18] = 0;
        vm.citypud[19] = 0;
        vm.citypud[20] = 0;
        vm.citypud[21] = 0;
        vm.citypud[22] = 0;
        vm.citypud[23] = 0;
        vm.citypud[24] = 0;

        // initialising each pickupdate array - the lazy way...
        vm.toorakpud[16] = 0;
        vm.toorakpud[17] = 0;
        vm.toorakpud[18] = 0;
        vm.toorakpud[19] = 0;
        vm.toorakpud[20] = 0;
        vm.toorakpud[21] = 0;
        vm.toorakpud[22] = 0;
        vm.toorakpud[23] = 0;
        vm.toorakpud[24] = 0;

        // initialising each pickupdate array - the lazy way...
        vm.delipud[16] = 0;
        vm.delipud[17] = 0;
        vm.delipud[18] = 0;
        vm.delipud[19] = 0;
        vm.delipud[20] = 0;
        vm.delipud[21] = 0;
        vm.delipud[22] = 0;
        vm.delipud[23] = 0;
        vm.delipud[24] = 0;

        Orders.getList().then(function (o) {
            vm.orders = o;
            //loop through orders and add a count to the vm.pud array for each pickUpDate selected
            angular.forEach(o, function (or) {
                if(or.store == 'City') {
                    vm.citypud[Number(or.pickUpDate)] += 1;
                }
                if(or.store == 'Toorak') {
                    vm.toorakpud[Number(or.pickUpDate)] += 1;
                }
                if(or.store == 'Deli') {
                    vm.delipud[Number(or.pickUpDate)] += 1;
                }
            });

        });

        // function to confirm order and add to database
        function confirmOrder() {
            if (vm.orderDetails.items.length > 0) {
                if (vm.orderDetails.pickUpDate == undefined || vm.orderDetails.pickUpDate == '' &&
                    vm.orderDetails.store == undefined || vm.orderDetails.store == '') {
                    alert('You must choose both a pickup date and store!');
                }
                if (vm.orderDetails.pickUpDate != undefined && vm.orderDetails.pickUpDate != '' && vm.orderDetails.customerID != undefined || vm.orderDetails.customerID != '' &&
                    vm.orderDetails.store != undefined && vm.orderDetails.store != '') {
                    // to determine correct order number based on city or toorak store
                    if(vm.orderDetails.store == 'City') {
                        vm.orderDetails.orderNumber = 'X' + vm.orderDetails.store.charAt(0) + '-' + vm.orderDetails.pickUpDate + '-' + vm.selectedCustomer.lname + '-' + vm.citypud[vm.orderDetails.pickUpDate];
                    }
                    if(vm.orderDetails.store == 'Toorak') {
                        vm.orderDetails.orderNumber = 'X' + vm.orderDetails.store.charAt(0) + '-' + vm.orderDetails.pickUpDate + '-' + vm.selectedCustomer.lname + '-' + vm.toorakpud[vm.orderDetails.pickUpDate];
                    }
                    if(vm.orderDetails.store == 'Deli') {
                        vm.orderDetails.orderNumber = 'X' + vm.orderDetails.store.charAt(0) + '-' + vm.orderDetails.pickUpDate + '-' + vm.selectedCustomer.lname + '-' + vm.delipud[vm.orderDetails.pickUpDate];
                    }
                   // vm.orderDetails.staffOwner = $rootScope.loggedUser.name + ' ' + $rootScope.loggedUser.lastName;
                    vm.orderDetails.complete = false;
                    Orders.post(order.cart());
                    $state.transitionTo('app.order-confirmation');
                };
            }
            if (vm.orderDetails.customerID == undefined || vm.orderDetails.customerID == '') {
                alert('This session has expired, please abandon order and start again.');
            }
            if (vm.orderDetails.items.length <= 0 || vm.orderDetails.items.length == undefined) {
                alert('You have no items in your cart!');
            }
        };

        vm.category = $stateParams._id;

        // product list from database as vm.products
        if (vm.category != undefined) {
            // requesting only products that are in selected category
            var Products = Restangular.all('db/products/' + vm.category);
            Products.getList('vm.category').then(function (products) {
                vm.products = products;
            })
        };


        Customers.getList().then(function (customers) {
            vm.customers = customers;
            angular.forEach(vm.customers, function (customer) {
                if (customer._id == vm.orderDetails.customerID) {
                    vm.selectedCustomer = customer;
                }
            });
        });

        function orderOwnerFilter(id) {
            var selectedCustomerName = {};
            angular.forEach(vm.customers, function (customer) {
                if (customer._id == vm.orderDetails.customerID) {
                    selectedCustomerName = customer;
                }
            })
            return selectedCustomerName;
        };

        // confirm order cancel modal
        vm.cancelModal = $modal({
            scope: vm,
            templateUrl: "apps/modals/cancelModal.html",
            show: false,
            animation: 'am-fade-and-slide-top',
            placement: 'center'
        });

        if (vm.orderDetails.customerID == undefined) {
            vm.expired = true;
            vm.cancelModal.$promise.then(vm.cancelModal.show);
        };

        vm.confirmExpiredSess = function () {
            $cookies.remove('order');
            $state.transitionTo('app.select-order');
            vm.cancelModal.hide();
        };

        // Delete Modal variables
        vm.openModal = $modal({
            scope: vm,
            templateUrl: "apps/orders/modals/deleteModal.html",
            show: false,
            animation: 'am-fade-and-slide-top',
            placement: 'center'
        });
        // Function to show modal
        vm.showModal = function (item) {
            vm.modalItem = item;
            vm.openModal.$promise.then(vm.openModal.show);
        };

        // function to remove individual item from cart
        function removeFromCart(item) {
            order.removeItem(item);
            vm.openModal.hide();
        };

    }


})();
