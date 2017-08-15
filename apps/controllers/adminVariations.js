(function () {
    'use strict';
    angular
        .module('app')
        .controller('adminVariationsCtrl', adminVariationsCtrl);


    adminVariationsCtrl.$inject = ['$scope', '$http', '$filter', 'Users', '$location', '$rootScope', 'Orders', 'Products', '$timeout', '$modal', '$state', '$stateParams'];
    function adminVariationsCtrl($scope, $http, $filter, Users, $location, $rootScope, Orders, Products, $timeout, $modal, $state, $stateParams) {
        var vm = $scope;

        vm.editVariation = editVariation;
        vm.addQtyVariation = addQtyVariation;
        vm.saveFixedQty = saveFixedQty;
        vm.removeFixedQty = removeFixedQty;
        vm.saveExistingVar = saveExistingVar;


        // User list for staff dropdown
        Users.getList().then(function (users) {
            vm.users = users;
        });

        // User list for staff dropdown
        Products.getList().then(function (products) {
            vm.products = products;

            // go through each product to match _id and create tempproduct for variations screen
            angular.forEach(vm.products, function (product) {
                if (product._id == $stateParams.id) {
                    // create temporary object to store/edit job items
                    vm.tempProduct = product;
                }
            });
        });
        // User list for staff dropdown
        Orders.getList().then(function (orders) {
            vm.orders = orders;
        });

        // Add product modal
        vm.openModal = $modal({
            scope: vm,
            templateUrl: "apps/admin/modals/productVariationModal.html",
            show: false,
            animation: 'am-fade-and-slide-top',
            placement: 'center'
        });

        // Function to show product modal
        vm.showModal = function (item) {
            vm.modalItem = item;
            vm.openModal.$promise.then(vm.openModal.show);
        };

        // Delete qty modal
        vm.openRemoveQtyModal = $modal({
            scope: vm,
            templateUrl: "apps/admin/modals/deleteQtyModal.html",
            show: false,
            animation: 'am-fade-and-slide-top',
            placement: 'center'
        });

        // Function to show delete qty modal
        vm.showDeleteQtyModal = function (product) {
            vm.modalItem = product;
            vm.openRemoveQtyModal.$promise.then(vm.openRemoveQtyModal.show);
        };

        // Editing existing product
        function editVariation(variation) {
            vm.newVariation = variation;
            vm.isVariationNew = false;
            vm.showModal();
        };

        // add new fixed quantity
        function addQtyVariation() {
            vm.newVariation = {};
            vm.newVariation.varType = 'Product Variation';
            vm.isVariationNew = true;
            vm.showModal();
        };
        // save fixed qty object
        function saveFixedQty() {
            // temp object to store variations to then be added to the parent product
            vm.newVariation.parentProductID = vm.tempProduct._id;

            if (vm.tempProduct.productVar != undefined) {
                vm.tempProduct.productVar.push(vm.newVariation);
            } else {
                vm.tempProduct.productVar = [(vm.newVariation)];
            }
            Products.post(vm.tempProduct);
            vm.openModal.hide();
        };

        // save existing variation
        function saveExistingVar() {
            Products.post(vm.tempProduct);
            vm.openModal.hide();
        }
        // function to remove fixed qty
        function removeFixedQty(index) {
            vm.tempProduct.productVar.splice(vm.tempProduct.productVar.indexOf(index), 1);
            Products.post(vm.tempProduct);
            vm.openRemoveQtyModal.hide();
        };


    }

})();