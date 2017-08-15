(function () {
    'use strict';
    angular
        .module('app')
        .controller('productSummaryCtrl', productSummaryCtrl);


    productSummaryCtrl.$inject = ['$scope', 'Orders', 'order', '$modal', '$state', '$stateParams', 'Customers', 'Products', '$filter', '$rootScope'];
    function productSummaryCtrl($scope, Orders, order, $modal, $state, $stateParams, Customers, Products, $filter, $rootScope) {
        var vm = $scope;

        vm.today = new Date();
        // filtered orders array to filter orders by date/store
        vm.filterOrders = filterOrders;
        vm.printPage = printPage;
        vm.goBack = goBack;

        // function to print page via button click
        function printPage() {
            window.print();
        }
        function goBack() {
            window.history.go(-1);
        }


        vm.summary = [];
        vm.summaryp = [];
        vm.productName = [];
        vm.productSummary = [];
        // show orders list on load
        vm.orderType = '1';
        // User list for staff dropdown

        function filterOrders()
        {
            vm.filteredOrders = $filter('filter')(vm.orders, $rootScope.pickUpDate);
            vm.summary = [];
            vm.productName = [];
            vm.unitsName = [];
            vm.productSummary = [];

        }

     //   filterOrders();

        function filterProducts() {

            // looping through products for summary array
            angular.forEach(vm.filteredOrders, function (o) {

                // looping through each product in the orders and setting the code equal to vm.prods[];
                angular.forEach(o.items, function (item) {

 
                    var w = Number(item.weightQty) ? Number(item.weightQty) : 0;
                    var u = Number(item.unitQty) ? Number(item.unitQty) : 0;
                    var t = Number(item.totalWeight) ? Number(item.totalWeight) : 0;

                    //   if (!item.totalWeight) {
                 //   console.log({code: item.code, title: item.name, qty: vm.summary[item.code], unit: "Kg"});
                   var ind =  vm.summary.indexOf(item.code);

                    vm.summaryp[ind] += w + u;


                  //  vm.productSummary.push({code: item.code, title: item.name, qty: vm.summary[item.code], unit: "Kg"});

                    // }

                    //if (item.totalWeight) {
                    //  vm.unitsName[item.code] = 'kg'
                    //vm.summary[item.code] += t;
                    //}
                    //if (item.weightQty) {
                    //  vm.unitsName[item.code] = 'kg'
 
                    // }

                    //  if (item.code == '7318') { console.log(vm.summary[item.code], w, u, t, item) }
                });
                // looping through each product variable and setting the code equal to vm.prods[];

            });

            angular.forEach(vm.summaryp, function (p, k) {

                var kg ='';
                if(vm.products[k].byWeight)kg='kg';
                if (p > 0) {

                    vm.productSummary.push({code: vm.summary[k], title: vm.products[k].title, qty: p,unit:kg});
                }
            })


            // run filter function when in print orders view
            if ($state.current.name == 'product-summary-print') {
                filterOrders();
            }
            // set the pickUpDate filter to empty when coming back from print view
            if ($state.current.name == 'app.product-summary') {
                $rootScope.pickUpDate = '';
            }
        }
        Orders.getList().then(function (orders) {
            vm.orders = vm.filteredOrders = orders;

            Customers.getList().then(function (customers) {
                vm.customers = customers;
            });
            Products.getList().then(function (products) {
                vm.products = products;

                angular.forEach(products,function(p){

                    vm.summary.push(p.code);
                    vm.summaryp.push(0);
                })
                 filterProducts();
            });


            vm.pickupdates = [
                "16", "17", "18", "19",
                "20", "21", "22", "23",
                "24"
            ];

            vm.store = [
                "Toorak", "City", "Deli"
            ];

            vm.removeOrder = removeOrder;
            vm.filterOrderID = filterOrderID;

            // pagination variables
            vm.pageSize = 10;
            vm.currentPage = 1;
            //function to increase page size upon print button being clicked
            vm.changePageSize = function() {
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

            // function to remove selected product from database
            function removeOrder(index) {
                vm.orders.remove(index).then(function () {
                    Orders.getList().then(function (orders) {
                        vm.orders = orders;
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