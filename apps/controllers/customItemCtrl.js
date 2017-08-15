(function () {
    'use strict';
    angular
        .module('app')
        .controller('customItemCtrl', customItemCtrl);


    customItemCtrl.$inject = ['$scope', '$http', '$filter', '$location', '$rootScope', '$stateParams', 'Restangular', 'Products', 'order', '$modal', '$state'];
    function customItemCtrl($scope, $http, $filter, $location, $rootScope, $stateParams, Restangular, Products, order, $modal, $state) {
        var vm = $scope;

        // get list of products
        Products.getList().then(function (products) {
            vm.products = products;

            vm.customProducts = [];
            angular.forEach(vm.products, function (product) {
                if (product.customItem == true) {
                    vm.customProducts.push(product);
                }
            })

            vm.selectedProduct = {};
            // function to set product equal to selected custom item in typeahead
            vm.poopFunction = function () {
                angular.forEach(vm.customProducts, function (customitem) {
                    if (customitem._id == vm.customItemSelect._id) {
                        vm.selectedProduct.title = customitem.title;
                        vm.selectedProduct._id = customitem._id;
                        vm.selectedProduct.code = customitem.code;
                        if(customitem.byWeight === 'TRUE') {
                            vm.selectedProduct.byWeight = true;
                        }  else {
                            vm.selectedProduct.byUnit = true;
                        }
                    }
                })
            }

            vm.addToCart = addToCart;

            // function to add selected product to current order (shopping cart)
            function addToCart() {

                // create temp object for unitQty items
                if(vm.selectedProduct.unitQty) {
                    var productForCart = {
                        code: vm.selectedProduct.code,
                        title: vm.selectedProduct.title,
                        _id: vm.selectedProduct._id,
                        unitQty: vm.selectedProduct.unitQty,
                        productRequests: vm.customItemSelect.productRequests
                    };
                }
                // create temp object for weightQty items
                if(vm.selectedProduct.weightQty) {
                    var productForCart = {
                        code: vm.selectedProduct.code,
                        title: vm.selectedProduct.title,
                        _id: vm.selectedProduct._id,
                        weightQty: vm.selectedProduct.weightQty,
                        productRequests: vm.customItemSelect.productRequests
                    };
                }

                order.addItem(productForCart);
                vm.customItemSelect._id = '';
                vm.customItemSelect.productRequests = '';
                vm.selectedProduct.weightQty = '';
                vm.selectedProduct.unitQty = '';
                $state.go('app.meat-selection');


            };
            /* end of Products.getList factory */
        });


    }


})();
