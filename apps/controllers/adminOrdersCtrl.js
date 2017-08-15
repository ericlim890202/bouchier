(function () {
    'use strict';
    angular
        .module('app')
        .controller('adminOrdersCtrl', adminOrdersCtrl);


    adminOrdersCtrl.$inject = ['$scope', 'Orders', 'order', '$modal', '$state', '$stateParams', 'Customers', '$rootScope', 'DeletedOrders', '$filter'];
    function adminOrdersCtrl($scope, Orders, order, $modal, $state, $stateParams, Customers, $rootScope, DeletedOrders, $filter) {
        var vm = $scope;
        vm.today = new Date();

        vm.getOrdersArray = getOrdersArray;

        function getOrdersArray() {

            var orders = [];

            vm.filteredOrders = $filter('filter')(vm.orders, vm.pickUpDate, vm.searchList);

            angular.forEach(vm.filteredOrders, function (o) {

                // console.log({customerID:o.customerID,store:o.store,pickUpDate:o.pickUpDate,staffOwner:o.staffOwner});
                orders.push({
                    customerID: vm.filterOrderID(o.customerID),
                    store: o.store,
                    pickUpDate: o.pickUpDate,
                    staffOwner: o.staffOwner,
                    orderNumber: o.orderNumber
                })
            })


            return orders;
        }

        // show orders list on load
        vm.orderType = '1';

        vm.pickupdates = [
            {date: "16"}, {date: "17"}, {date: "18"},
            {date: "19"}, {date: "20"}, {date: "21"},
            {date: "22"}, {date: "23"}, {date: "24"}
        ];

        /* pickup date counter functions */
        vm.citypud = [];
        vm.toorakpud = [];
        vm.delipud = [];

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

        Orders.getList().then(function (orders) {
            vm.orders = orders;

            vm.lol = function() {
                console.log(vm.pickUpDate1,vm.pickUpDate2,vm.pickUpDate3);
            }

            //loop through orders and add a count to the vm.pud array for each pickUpDate selected
            angular.forEach(orders, function (or) {
                if (or.store == 'City') {
                    vm.citypud[Number(or.pickUpDate)] += 1;
                }
                if (or.store == 'Toorak') {
                    vm.toorakpud[Number(or.pickUpDate)] += 1;
                }
                if (or.store == 'Deli') {
                    vm.delipud[Number(or.pickUpDate)] += 1;
                }
            });

            Customers.getList().then(function (customers) {
                vm.customers = customers;
            });

            DeletedOrders.getList().then(function (deletedOrders) {
                vm.deletedOrders = deletedOrders;
            });

            vm.printPage = printPage;
            vm.goBack = goBack;
            // function to print page via button click
            function printPage() {
                window.print();
            }

            function goBack() {
                window.history.go(-1);
            }

            vm.store = [
                "Toorak", "City", "Deli"
            ];

            vm.removeOrder = removeOrder;
            vm.filterOrderID = filterOrderID;
            vm.updateOrder = updateOrder;
            vm.undoDelete = undoDelete;

            // pagination variables
            vm.pageSize = 10;
            vm.currentPage = 1;
            vm.pageSize1 = 10;
            vm.currentPage1 = 1;
            //function to increase page size upon print button being clicked
            vm.changePageSize = function () {
                vm.pageSize = 10000;
            }

            // Delete product modal
            vm.openDeleteModal = $modal({
                scope: vm,
                templateUrl: "apps/admin/modals/deleteOrderModal.html",
                show: false,
                animation: 'am-fade-and-slide-top',
                placement: 'center'
            });

            // Function to show delete product modal
            vm.deleteProductModal = function (order) {
                vm.modalItem = order;
                vm.openDeleteModal.$promise.then(vm.openDeleteModal.show);
            };

            function updateOrder(order) {

                Orders.post(order).then(function () {
                    Orders.getList().then(function (orders) {
                        vm.orders = orders;
                    });
                })
            }

            // function to remove selected product from database
            function removeOrder(index) {
                DeletedOrders.post(index).then(function () {
                    DeletedOrders.getList().then(function (deletedOrders) {
                        vm.deletedOrders = deletedOrders;
                    })
                })
                vm.orders.remove(index).then(function () {
                    Orders.getList().then(function (orders) {
                        vm.orders = orders;
                        vm.openDeleteModal.hide();
                    });
                })
            };

            // function to remove selected product from database
            function undoDelete(index) {
                vm.orders.post(index).then(function () {
                    Orders.getList().then(function (orders) {
                        vm.orders = orders;
                    })
                })
                vm.deletedOrders.remove(index).then(function () {
                    DeletedOrders.getList().then(function (deletedOrders) {
                        vm.deletedOrders = deletedOrders;
                        vm.openDeleteModal.hide();
                    });
                })
            };
            // filter to find name of customer order is attached to
            function filterOrderID(id) {
                var orderOwner = '';
                angular.forEach(vm.customers, function (customer) {
                    if (customer._id == id) {
                        orderOwner = customer.fname + ' ' + customer.lname;
                    }
                })
                return orderOwner;
            };

            // END OF ORDERS LIST

        });


    }

})();