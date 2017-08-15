(function () {
    'use strict';
    angular
        .module('app')
        .controller('productsCtrl', productsCtrl);


    productsCtrl.$inject = ['$scope', '$http', '$filter', 'Users', '$location', '$rootScope', '$stateParams', 'Restangular', 'Orders'];
    function productsCtrl($scope, $http, $filter, Users, $location, $rootScope, $stateParams, Restangular, Orders) {
        var vm = $scope;

        vm.category = $stateParams._id;

        // product list from database as vm.products
        if (vm.category != undefined) {
            // requesting only products that are in selected category
            var Products = Restangular.all('db/products/' + vm.category);
            Products.getList('vm.category').then(function (products) {
                vm.products = products;
            })
        };

        // User list for staff dropdown
        Users.getList().then(function (users) {
            vm.users = users;
        });




    }


})();
