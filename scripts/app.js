/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */
(function () {
    'use strict';
    angular
        .module('app', [
            'ngAnimate',
            'ngResource',
            'ngSanitize',
            'ngTouch',
            'ui.router',
            'ui.utils',
            'ui.load',
            'ui.jp',
            'oc.lazyLoad',
            'restangular',
            'mgcrea.ngStrap',
            'ngCookies',
            'angularUtils.directives.dirPagination',
            'ngFileUpload',
            'ngCsv'
        ])

        // LIST OF FACTORIES FOR APP
        .factory('Users', function (Restangular) {
            return Restangular.service('users');
        })
        .factory('Clients', function (Restangular) {
            return Restangular.service('clients');
        })
        .factory('Products', function (Restangular) {
            return Restangular.service('/db/products');
        })
        .factory('Orders', function (Restangular) {
            return Restangular.service('/db/orders');
        })
        .factory('WebsiteOrders', function (Restangular) {
            return Restangular.service('/db/websiteOrders');
        })
        .factory('DeletedOrders', function (Restangular) {
            return Restangular.service('/db/deletedOrders');
        })
        .factory('Customers', function (Restangular) {
            return Restangular.service('/db/customers');
        })
        .factory('order', function ($cookies) {

            var cookie = $cookies.getObject('order');
            if (cookie) {
                var order = cookie;
            }
            else {
                var order = {items: []};
            }

            return {
                addItem: function (o) {
                    if (order.items != undefined) {
                        var entered = false;
                        angular.forEach(order.items, function (item, k) {
                            if (item.code == o.code) {
                                if (order.items[k].weightQty) {
                                    order.items[k].weightQty += o.weightQty;
                                    entered = true;
                                }
                                if (order.items[k].unitQty) {
                                    order.items[k].unitQty += o.unitQty;
                                    entered = true;
                                }
                                order.items[k].weightPerUnit += o.weightPerUnit;
                            }
                        })
                        if (!entered)order.items.push(o);
                    } else {
                        order.items = [(o)];
                    }
                    $cookies.putObject('order', order);
                },
                removeItem: function (index) {
                    order.items.splice(order.items.indexOf(index), 1);
                    $cookies.putObject('order', order);
                },
                save: function (o) {
                    order = o;
                },
                cart: function () {
                    return order;
                }
            }
        });
})();
