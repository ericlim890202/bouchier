/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the router
 */
(function () {
    'use strict';
    angular
        .module('app')
        .run(runBlock)
        .config(config);

    runBlock.$inject = ['$rootScope', '$state', '$stateParams'];
    function runBlock($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }

    config.$inject = ['$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG'];
    function config($stateProvider, $urlRouterProvider, MODULE_CONFIG) {

        var p = getParams('layout'),
            l = p ? p + '.' : '',
            layout = '../views/layout/layout.' + l + 'html',
            dashboard = '../views/dashboard/dashboard.' + l + 'html';

        $urlRouterProvider
            .otherwise('/app/select-order');
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                views: {
                    '': {
                        templateUrl: layout
                    }
                }
            })

            // login screen
            .state('access', {
                url: '/access',
                template: '<div class="white bg-auto w-full"><div ui-view class="fade-in-right-big smooth pos-rlt"></div></div>'
            })
            .state('access.signin', {
                url: '/signin',
                controller: 'loginCtrl',
                templateUrl: '../views/misc/signin.html',
                resolve: load('viewshjs/login.js')
            })

            // first screen - select order type
            .state('app.select-order', {
                url: '/select-order',
                templateUrl: 'apps/orders/select-order.html',
                data: {title: 'Select Order'},
                controller: 'orderCtrl',
                resolve: load('apps/controllers/ordersCtrl.js')
            })
            // existing order screen
            .state('app.existing-order', {
                url: '/existing-order',
                templateUrl: 'apps/orders/existing-order.html',
                data: {title: 'Existing Order'},
                controller: 'orderCtrl',
                resolve: load('apps/controllers/ordersCtrl.js')
            })
            // existing customer screen
            .state('app.existing-customer', {
                url: '/existing-customer',
                templateUrl: 'apps/orders/existing-customer.html',
                data: {title: 'Existing Customer'},
                controller: 'orderCtrl',
                resolve: load('apps/controllers/ordersCtrl.js')
            })
            // new order details screen
            .state('app.new-order-details', {
                url: '/new-order-details',
                templateUrl: 'apps/orders/new-order-details.html',
                data: {title: 'New Order Details'},
                controller: 'orderCtrl',
                resolve: load('apps/controllers/ordersCtrl.js')
            })
            // meat/main product selection screen
            .state('app.meat-selection', {
                url: '/meat-selection',
                templateUrl: 'apps/products/meat-selection.html',
                data: {title: 'Meat Selection'},
                controller: 'productsCtrl',
                resolve: load('apps/controllers/productsCtrl.js')
            })
            // specific meat product range
            .state('app.meat-range', {
                url: '/meat-range/{_id}',
                templateUrl: 'apps/products/meat-range.html',
                data: {title: 'Meat Range'},
                controller: 'productsCtrl',
                resolve: load('apps/controllers/productsCtrl.js')
            })
            // individual meat item
            .state('app.meat-item', {
                url: '/meat-item/{meat}/{_id}',
                templateUrl: 'apps/products/meat-item.html',
                data: {title: 'Meat Item'},
                controller: 'selectedProductCtrl',
                resolve: load('apps/controllers/selectedProductCtrl.js')
            })
            // custom item details
            .state('app.custom-item', {
                url: '/custom-item/{_id}',
                templateUrl: 'apps/products/custom-item.html',
                data: {title: 'Custom Item'},
                controller: 'customItemCtrl',
                resolve: load('apps/controllers/customItemCtrl.js')
            })
            // order summary/checkout
            .state('app.order-summary', {
                url: '/order-summary',
                templateUrl: 'apps/orders/order-summary.html',
                data: {title: 'Order Summary'},
                controller: 'orderSumCtrl',
                resolve: load('apps/controllers/orderSumCtrl.js')
            })
            // order confirmation page
            .state('app.order-confirmation', {
                url: '/order-confirmation',
                templateUrl: 'apps/orders/order-confirmation.html',
                data: {title: 'Order Confirmation'},
                controller: 'orderSumCtrl',
                resolve: load('apps/controllers/orderSumCtrl.js')
            })
            // admin page - product list
            .state('app.products', {
                url: '/admin/products-list',
                templateUrl: '/apps/admin/productsList.html',
                data: {title: 'Products List'},
                controller: 'adminCtrl',
                resolve: load('apps/controllers/adminCtrl.js')
            })
            // admin page - customers list
            .state('app.customers', {
                url: '/admin/customers-list',
                templateUrl: '/apps/admin/customersList.html',
                data: {title: 'Customers List'},
                controller: 'customersCtrl',
                resolve: load('apps/controllers/customersCtrl.js')
            })
            // admin page - customers list
            .state('app.customers-orders', {
                url: '/admin/customers-list/orders/{id}',
                templateUrl: '/apps/admin/customerOrders.html',
                data: {title: 'Customer Orders List'},
                controller: 'customerOrdersCtrl',
                resolve: load('apps/controllers/customerOrdersCtrl.js')
            })
            // admin page - orders list
            .state('app.orders', {
                url: '/admin/orders-list',
                templateUrl: '/apps/admin/orderList.html',
                data: {title: 'Orders List'},
                controller: 'adminOrdersCtrl',
                resolve: load('apps/controllers/adminOrdersCtrl.js')
            })
            // admin page - website orders list
            .state('app.website-orders', {
                url: '/admin/website-orders',
                templateUrl: '/apps/admin/website-orders.html',
                data: {title: 'Website Orders'},
                controller: 'websiteOrdersCtrl',
                resolve: load('apps/controllers/websiteOrdersCtrl.js')
            })
            // selected order - not part of the ui-view
            .state('selected-order', {
                url: '/selected-order/{id}',
                templateUrl: '/apps/admin/selectedOrder.html',
                controller: 'selectedOrderCtrl',
                resolve: load('apps/controllers/selectedOrderCtrl.js')
            })
            .state('ordersForPrint', {
                url: '/ordersForPrint/',
                templateUrl: '/apps/admin/ordersForPrint.html',
                controller: 'adminOrdersCtrl',
                resolve: load('apps/controllers/adminOrdersCtrl.js')
            })
            .state('app.product-summary', {
                url: '/admin/product-summary',
                templateUrl: '/apps/admin/productSummary.html',
                data: {title: 'Product Summary'},
                controller: 'productSummaryCtrl',
                resolve: load('apps/controllers/productSummaryCtrl.js')
            })
            // admin page - printable view of product summary
            .state('product-summary-print', {
                url: '/productSummaryForPrint',
                templateUrl: '/apps/admin/productSummaryForPrint.html',
                controller: 'productSummaryCtrl',
                resolve: load('apps/controllers/productSummaryCtrl.js')
            })
            // admin page - selected order view
            .state('app.selected-order', {
                url: '/admin/order/{id}',
                templateUrl: '/apps/admin/selectedOrder.html',
                controller: 'selectedOrderCtrl',
                resolve: load('apps/controllers/selectedOrderCtrl.js')
            })
            // admin page - product list
            .state('app.users', {
                url: '/admin/users-list',
                templateUrl: '/apps/admin/usersList.html',
                data: {title: 'Users List'},
                controller: 'adminUsersCtrl',
                resolve: load('apps/controllers/adminUsersCtrl.js')
            })
            // admin page - orders list
            .state('app.product-variations', {
                url: '/admin/products-list/variations/{id}',
                templateUrl: '/apps/admin/productVariations.html',
                data: {title: 'Product Variations'},
                controller: 'adminVariationsCtrl',
                resolve: load('apps/controllers/adminVariations.js')
            })
        ;

        function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLazyLoad, $q) {
                        var deferred = $q.defer();
                        var promise = false;
                        srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                        if (!promise) {
                            promise = deferred.promise;
                        }
                        angular.forEach(srcs, function (src) {
                            promise = promise.then(function () {
                                angular.forEach(MODULE_CONFIG, function (module) {
                                    if (module.name == src) {
                                        src = module.module ? module.name : module.files;
                                    }
                                });
                                return $ocLazyLoad.load(src);
                            });
                        });
                        deferred.resolve();
                        return callback ? promise.then(function () {
                            return callback();
                        }) : promise;
                    }]
            }
        }

        function getParams(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    }
})();
