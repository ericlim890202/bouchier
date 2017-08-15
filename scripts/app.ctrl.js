/**
 * @ngdoc function
 * @name app.controller:AppCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */

(function () {
    'use strict';
    angular
        .module('app')
        .controller('AppCtrl', AppCtrl);

    AppCtrl.$inject = ['$scope', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', 'Users', '$http', 'order', 'Orders', '$modal', '$aside', '$cookies', '$state'];

    function AppCtrl($scope, $location, $rootScope, $anchorScroll, $timeout, $window, Users, $http, order, Orders, $modal, $aside, $cookies, $state) {
        var vm = $scope;
        vm.isIE = isIE();
        vm.isSmart = isSmart();
        vm.dropdownCart = dropdownCart;
        vm.removeFromCart = removeFromCart;
        vm.totalCartCount = totalCartCount;

        // function called each time dropdown cart is opened to set variable equal to order.cart().items
        function dropdownCart() {
            return order.cart().items
        };
        /*
         // function to calculate total of all items in cart
         function calculateTotal() {
         var total = 0;
         angular.forEach(dropdownCart(), function (item) {
         total += Number(item.cost);
         })
         return total;
         console.log(total);
         }; */

        // Delete Modal variables
        vm.deleteModal = $modal({
            scope: vm,
            templateUrl: "apps/modals/deleteModal.html",
            show: false,
            animation: 'am-fade-and-slide-top',
            placement: 'center'
        });
        // Function to show modal
        vm.showDelModal = function (item) {
            vm.modalItem = item;
            vm.deleteModal.$promise.then(vm.deleteModal.show);
        };

        // confirm order cancel modal
        vm.cancelModal = $modal({
            scope: vm,
            templateUrl: "apps/modals/cancelModal.html",
            show: false,
            animation: 'am-fade-and-slide-top',
            placement: 'center'
        });
        // Function to show order cancel modal
        vm.showCancelModal = function () {
            vm.cancelModal.$promise.then(vm.cancelModal.show);
        };
        

        vm.cancelOrder = function () {
            $cookies.remove('order');
            $state.transitionTo('app.select-order');
            vm.cancelModal.hide();
        };
        // function to remove individual item from cart
        function removeFromCart(item) {
            order.removeItem(item);
            vm.deleteModal.hide();
        };

        // function to display total number of items in cart
        function totalCartCount() {
            if (order.cart().items != undefined) {
                return order.cart().items.length;
            }
        };

        // code for use of an 'aside'
        vm.openAside = $aside({
            scope: $scope,
            show: false,
            templateUrl: "apps/navigation/asideNav.html",
            animation: 'am-slide-left',
            placement: 'left'

        });

        // Function to show aside
        vm.showAside = function () {
            //Show when some event occurs (use $promise property to ensure the template has been loaded)
            vm.openAside.$promise.then(vm.openAside.show);
        };

        Users.getList().then(function (users) {
            vm.users = users;

            // create ID of current logged on user
            $http.get('user').success(function (data, status, headers, config) {
                angular.forEach(vm.users, function (user) {
                    if (data.username == user._id) {
                        $rootScope.loggedUser = user;
                        // variable used to store first character of user's name
                        vm.firstLetter = $rootScope.loggedUser.name.charAt(0);
                    }
                })
            });
        })
        // config
        vm.app = {
            name: 'CRM',
            version: '2.0',
            // for chart colors
            color: {
                'primary': '#0cc2aa',
                'accent': '#a88add',
                'warn': '#fcc100',
                'info': '#6887ff',
                'success': '#6cc788',
                'warning': '#f77a99',
                'danger': '#f44455',
                'white': '#ffffff',
                'light': '#f1f2f3',
                'dark': '#2e3e4e',
                'black': '#2a2b3c'
            },
            setting: {
                theme: {
                    primary: 'primary',
                    accent: 'accent',
                    warn: 'warn'
                },
                folded: true,
                boxed: false,
                container: false,
                themeID: 1,
                bg: ''
            }
        };


        getParams('bg') && (vm.app.setting.bg = getParams('bg'));


        $rootScope.$on('$stateChangeSuccess', openPage);

        function openPage() {
            // goto top
            $location.hash('content');
            $anchorScroll();
            $location.hash('');
            // hide open menu
            $('#aside').modal('hide');
            $('body').removeClass('modal-open').find('.modal-backdrop').remove();
            $('.navbar-toggleable-sm').collapse('hide');
        };

        vm.goBack = function () {
            $window.history.back();
        };

        function isIE() {
            return !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./);
        }

        function isSmart() {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        function getParams(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    }
})();
