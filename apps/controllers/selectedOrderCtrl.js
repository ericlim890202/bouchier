(function () {
    'use strict';
    angular
        .module('app')
        .controller('selectedOrderCtrl', selectedOrderCtrl);


    selectedOrderCtrl.$inject = ['$scope', 'Orders', 'order', '$modal', '$state', '$stateParams', 'DeletedOrders'];
    function selectedOrderCtrl($scope, Orders, order, $modal, $state, $stateParams, DeletedOrders) {
        var vm = $scope;

        vm.printPage = printPage;
        vm.goBack = goBack;
        // function to print page via button click
        function printPage() {
            window.print();
        }
        function goBack() {
            window.history.go(-1);
        }
        // Create selectedOrders
        Orders.getList().then(function (orders) {
            vm.orders = orders;

            angular.forEach(vm.orders, function (order) {
                if (order._id == $stateParams.id) {
                    vm.selectedOrder = order;
                };
            });
        });

        // Create selected deleted orders
        DeletedOrders.getList().then(function (deletedOrders) {
            vm.deletedOrders = deletedOrders;

            angular.forEach(vm.deletedOrders, function (deletedOrder) {
                if (deletedOrder._id == $stateParams.id) {
                    vm.selectedDeletedOrder = deletedOrder;
                };
            });
        });



    }

})();