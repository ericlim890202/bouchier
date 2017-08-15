(function () {
    'use strict';
    angular
        .module('app')
        .controller('adminCtrl', adminCtrl);

    adminCtrl.$inject = ['$scope', 'Products', 'order', '$modal', '$state', '$stateParams','Upload', '$timeout', '$http', '$tooltip'];
    function adminCtrl($scope, Products, order, $modal, $state, $stateParams, Upload, $timeout, $http, $tooltip) {
        var vm = $scope;

        // User list for staff dropdown
        Products.getList().then(function (products) {
            vm.products = products;

            vm.editProduct = editProduct;
            vm.addProduct = addProduct;
            vm.saveProduct = saveProduct;
            vm.removeProduct = removeProduct;

            // pagination variables
            vm.pageSize = 10;
            vm.currentPage = 1;

            // Add product modal
            vm.openModal = $modal({
                scope: vm,
                templateUrl: "apps/admin/modals/newProductModal.html",
                show: false,
                animation: 'am-fade-and-slide-top',
                placement: 'center-top'
            });

            // Function to show product modal
            vm.showModal = function (item) {
                vm.modalItem = item;
                vm.openModal.$promise.then(vm.openModal.show);
            };

            // Delete product modal
            vm.openDeleteModal = $modal({
                scope: vm,
                templateUrl: "apps/admin/modals/deleteModal.html",
                show: false,
                animation: 'am-fade-and-slide-top',
                placement: 'center'
            });

            // Function to show delete product modal
            vm.deleteProductModal = function (product) {
                vm.modalItem = product;
                vm.openDeleteModal.$promise.then(vm.openDeleteModal.show);
            };

            vm.measurementTypes = [
                "weight", "quantity"
            ];

            vm.meatTypes = [
                'ham', 'turkey', 'beef', 'pork', 'poultry', 'lamb', 'sausage', 'other'
            ];

            /* PRODUCT FUNCTIONS SECTION */

            // Editing existing product
            function editProduct(product) {
                vm.newProduct = product;
                vm.isProductNew = false;
                vm.showModal();
            };
            // add new product
            function addProduct() {
                vm.newProduct = {};
                vm.isProductNew = true;
                vm.showModal();
            };

            function saveProduct() {
                vm.newProduct.customItem = false;
                Products.post(vm.newProduct).then(function () {
                    Products.getList().then(function (products) {
                        vm.newProduct.customItem = false;
                        vm.products = products;
                        vm.openModal.hide();
                    });
                })
            };
            // function to remove selected product from database
            function removeProduct(index) {
                vm.products.remove(index).then(function () {
                    Products.getList().then(function (products) {
                        vm.products = products;
                        vm.openDeleteModal.hide();
                    });
                })
            };

            // set image equal to empty string
            vm.deleteImage = function() {
                vm.newProduct.image = '';
            }

            /* FILE UPLOAD CODE */
            $scope.uploadFiles = function(file, errFiles) {
                vm.f = file;
                vm.errFile = errFiles && errFiles[0];
                if (file) {
                    file.upload = Upload.upload({
                        url: '/uploads',
                        data: {file: file}
                    });

                    file.upload.then(function (response) {
                        $timeout(function () {
                            vm.newProduct.image = response.data.url;
                        });
                    } );
                }
            }

            // END OF PRODUCTS LIST
        });



         $scope.import = function () {


         $http.get('old-products.csv').success(function (data, status, headers, config) {

         var data = $scope.parsecsv(data);

         angular.forEach(data, function (value, key) {
         if (key > 0) {
             var byWeight = false;
             var byUnit = false;

             if(value[2] =='TRUE'){byWeight =true;}
             if(value[3] =='TRUE'){byUnit =true;}
         var product = {

         code: value[0],
         title: value[1],
         meat: '',
         byWeight:byWeight,
         byUnit:byUnit, 
        customItem: true

         }
         }
             Products.post(product);
         console.log(product);

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
         }
          
    }

})();