(function () {
    'use strict';
    angular
        .module('app')
        .controller('selectedProductCtrl', selectedProductCtrl);


    selectedProductCtrl.$inject = ['$scope', '$http', '$filter', '$aside', 'Users', '$location', '$rootScope', '$stateParams', 'Restangular', 'Orders', 'Products', 'order', '$modal', '$state'];
    function selectedProductCtrl($scope, $http, $filter, $aside, Users, $location, $rootScope, $stateParams, Restangular, Orders, Products, order, $modal, $state) {
        var vm = $scope;

        // get list of products
        Products.getList().then(function (products) {
            vm.products = products;
            // compares id of product with id in new state to bring data into meat-item view
            angular.forEach(vm.products, function (product) {
                if (product._id == $stateParams._id) {
                    // create temporary object to store/edit product items
                    vm.selectedProduct = product;
                }
            });

            vm.customProducts = [];
            angular.forEach(vm.products, function (product) {
                if (product.customItem == true) {
                    vm.customProducts.push(product);
                }
            })

            vm.poopFunction = function () {
                angular.forEach(vm.customProducts, function (customitem) {
                    if (customitem._id == vm.customItemSelect._id) {
                        console.log(customitem);
                        vm.selectedProduct.title = customitem.title;
                        vm.selectedProduct.code = customitem.code;
                        if (customitem.byWeight == true) {
                            vm.selectedProduct.byWeight;
                        } else {
                            vm.selectedProduct.byUnit;
                        }
                    }
                })
            }


            vm.addToCart = addToCart;
            vm.priceType = priceType;

            // function to return the priceType from the productVar object
            function priceType(item) {
                if (vm.selectedProduct.productVar == undefined) {
                    return
                }
                if (vm.selectedProduct.productVar.var) {
                    var o = JSON.parse(item);
                    //  console.log(item.priceType, JSON.parse(item))
                    return o.priceType;
                }
            };

            // function to add selected product to current order (shopping cart)
            function addToCart() {
                // var cost = 0;
                var title = '';
                var code = vm.selectedProduct.code;
                var weightPerUnit = 0;
                var totalWeight = 0;

                if (vm.selectedProduct.weightCost) {
                    title = vm.selectedProduct.title;
                    //   cost = vm.selectedProduct.weightCost * vm.selectedProduct.weightQty;
                }
                if (vm.selectedProduct.unitCost) {
                    title = vm.selectedProduct.title;
                    weightPerUnit = vm.selectedProduct.weightPerUnit;
                    totalWeight = vm.selectedProduct.weightPerUnit * vm.selectedProduct.unitQty;
                    // cost = vm.selectedProduct.unitCost * vm.selectedProduct.unitQty;
                }
                if (!vm.selectedProduct.unitCost || vm.selectedProduct.weightCost) {
                    title = vm.selectedProduct.title;
                }
                if (vm.selectedProduct.productVar == undefined) {
                    title = vm.selectedProduct.title;
                    vm.selectedProduct.productVar = {};
                }
                // for all products with product variations
                if (vm.selectedProduct.productVar.var) {
                    var prodVar = JSON.parse(vm.selectedProduct.productVar.var);
                    code = prodVar.code;
                    title = vm.selectedProduct.title + ' ' + prodVar.title;
                    weightPerUnit = prodVar.weightPerUnit;
                    totalWeight = prodVar.weightPerUnit * vm.selectedProduct.unitQty;
                    /*
                     if(vm.selectedProduct.unitQty) {
                     cost = prodVar.cost * vm.selectedProduct.unitQty;
                     }
                     if (vm.selectedProduct.weightQty) {
                     cost = prodVar.cost * vm.selectedProduct.weightQty;
                     } */
                }
                // create temp object to send only necessary product variables
                var productForCart = {
                    weightPerUnit: weightPerUnit,
                    totalWeight: totalWeight,
                    code: code,
                    title: title,
                    measurementType: vm.selectedProduct.measurementType,
                    meat: vm.selectedProduct.meat,
                    _id: vm.selectedProduct._id,
                    // cost: cost,
                    weightQty: vm.selectedProduct.weightQty,
                    unitQty: vm.selectedProduct.unitQty,
                    productRequests: vm.selectedProduct.productRequests
                };
                vm.selectedProduct.weightQty = '';
                vm.selectedProduct.unitQty = '';
                vm.selectedProduct.productRequests = '';

                if (!vm.selectedProduct.unitCost || vm.selectedProduct.weightCost) {
                   // vm.selectedProduct.title = "";
                    vm.selectedProduct.byWeight = "";
                    vm.selectedProduct.byUnit = "";
                    vm.selectedProduct.weightQty = "";
                    vm.selectedProduct.unityQty = "";
                }
                order.addItem(productForCart);
                $state.go('app.meat-selection');
            }

            /* end of Products.getList factory */
        });

        // Order list for staff dropdown
        Orders.getList().then(function (orders) {
            vm.orders = orders;
        });

        // User list for staff dropdown
        Users.getList().then(function (users) {
            vm.users = users;
        });

        /* ASIDE NOT BEING USED
         // code for use of an 'aside'
         vm.openAside = $aside({
         scope: $scope,
         show: false,
         templateUrl: "apps/clients/details/clientAside.html",
         animation: 'am-slide-right'
         });
         // Function to show aside
         vm.showAside = function () {
         //Show when some event occurs (use $promise property to ensure the template has been loaded)
         vm.openAside.$promise.then(vm.openAside.show);
         }; */

    }


})();
