(function () {
    'use strict';
    angular
        .module('app')
        .controller('customersCtrl', customersCtrl);


    customersCtrl.$inject = ['$scope', 'Customers', '$modal', '$state', '$stateParams', 'Orders', '$http'];
    function customersCtrl($scope, Customers, $modal, $state, $stateParams, Orders, $http) {
        var vm = $scope;

        // User list for staff dropdown
        Customers.getList().then(function (customers) {
            vm.customers = customers;

            Orders.getList().then(function (orders) {
                vm.orders = orders;
            })

            /* ADD FULL NAME OF NEWLY UPLOADED CSV CUSTOMERS
             vm.addFullName = function () {
             angular.forEach(vm.customers, function (customer) {
             customer.fullName = customer.fname + ' ' + customer.lname;
             Customers.post(customer);
             });
             };
             */

            vm.editCustomer = editCustomer;
            vm.addCustomer = addCustomer;
            vm.saveCustomer = saveCustomer;
            vm.removeCustomer = removeCustomer;
            
            // pagination variables
            vm.pageSize = 10;
            vm.currentPage = 1;

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
                        // search for customers orders and update name if changed
                        angular.forEach(vm.orders, function (order) {
                            if (order.customerID == vm.newCustomer._id) {
                                order.customerName = vm.newCustomer.fname + ' ' + vm.newCustomer.lname;
                                Orders.post(order).then(function () {
                                    Orders.getList().then(function (orders) {
                                        vm.orders = orders;
                                    })
                                })
                            }
                        })

                        vm.customerModal.hide();
                    });
                })
            };
            // function to remove selected customer from database
            function removeCustomer(index) {
                vm.customers.remove(index).then(function () {
                    Customers.getList().then(function (customers) {
                        vm.customers = customers;

                        vm.deleteCustModal.hide();
                    });
                })
            };

            /* UPLOAD CSV FILE

             $scope.import = function () {


             $http.get('customers.csv').success(function (data, status, headers, config) {

             var data = $scope.parsecsv(data);

             angular.forEach(data, function (value, key) {
             if (key > 0) {

             var customer = {

             fname: value[0],
             lname: value[1],
             email: value[2],
             phone: value[3],

             }
             }

             Customers.post(customer);
             console.log(customer);

             })

             }).error(function (data, status, headers, config) {
             console.log("error", data);
             });
             //   $scope.extras.getList().then(function (u) {

             //     console.log(u)
             //  });
             }

             $scope.parsecsv = function (strData) {
             // Check to see if the delimiter is defined. If not,
             // then default to comma.
             var strDelimiter = ",";

             // Create a regular expression to parse the CSV values.
             var objPattern = new RegExp(
             (
             // Delimiters.
             "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

             // Quoted fields.
             "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

             // Standard fields.
             "([^\"\\" + strDelimiter + "\\r\\n]*))"
             ),
             "gi"
             );


             // Create an array to hold our data. Give the array
             // a default empty first row.
             var arrData = [[]];

             // Create an array to hold our individual pattern
             // matching groups.
             var arrMatches = null;


             // Keep looping over the regular expression matches
             // until we can no longer find a match.
             while (arrMatches = objPattern.exec(strData)) {

             // Get the delimiter that was found.
             var strMatchedDelimiter = arrMatches[1];

             // Check to see if the given delimiter has a length
             // (is not the start of string) and if it matches
             // field delimiter. If id does not, then we know
             // that this delimiter is a row delimiter.
             if (
             strMatchedDelimiter.length &&
             strMatchedDelimiter !== strDelimiter
             ) {

             // Since we have reached a new row of data,
             // add an empty row to our data array.
             arrData.push([]);

             }

             var strMatchedValue;

             // Now that we have our delimiter out of the way,
             // let's check to see which kind of value we
             // captured (quoted or unquoted).
             if (arrMatches[2]) {

             // We found a quoted value. When we capture
             // this value, unescape any double quotes.
             strMatchedValue = arrMatches[2].replace(
             new RegExp("\"\"", "g"),
             "\""
             );

             } else {

             // We found a non-quoted value.
             strMatchedValue = arrMatches[3];

             }


             // Now that we have our value string, let's add
             // it to the data array.
             arrData[arrData.length - 1].push(strMatchedValue);
             }

             // Return the parsed data.
             return (arrData);
             } */


            // END OF CUSTOMERS LIST
        });


    }

})();