(function () {
    'use strict';
    angular
        .module('app')
        .controller('websiteOrdersCtrl', websiteOrdersCtrl);

    websiteOrdersCtrl.$inject = ['$scope', 'Products', '$state', '$stateParams', 'Upload', 'WebsiteOrders', '$http', '$timeout', '$modal'];
    function websiteOrdersCtrl($scope, Products, $state, $stateParams, Upload, WebsiteOrders, $http, $timeout, $modal) {
        var vm = $scope;

        // User list for staff dropdown
        WebsiteOrders.getList().then(function (websiteOrders) {
            vm.websiteOrders = websiteOrders;

            angular.forEach(vm.websiteOrders, function (websiteOrder) {
                if (websiteOrder.orderNumber == undefined || websiteOrder.orderNumber == '') {
                    websiteOrder.hide;
                    WebsiteOrders.post(websiteOrder);
                }
            })
            // function to search through website orders by order number of selected order
            vm.searchForOrder = function (input) {
                var selectedOrderArray = [];
                angular.forEach(vm.websiteOrders, function (order) {
                    if (order.orderNumber == input.orderNumber) {
                        vm.searchList = '';
                        selectedOrderArray.push(order);
                        vm.websiteOrders = selectedOrderArray;
                    }
                })
                return vm.websiteOrders;
            }

            // function to refresh website order list after selecting individual order
            vm.refreshList = function () {
                WebsiteOrders.getList().then(function (websiteOrders) {
                    vm.websiteOrders = websiteOrders;
                })
            }

            // pagination variables
            vm.pageSize = 10;
            vm.currentPage = 1;

            // modal to remove order item
            vm.deleteModal = $modal({
                scope: vm,
                templateUrl: "apps/admin/modals/webOrderDeleteModal.html",
                show: false,
                animation: 'am-fade-and-slide-top',
                placement: 'center-top'
            });

            // Function to show delete modal
            vm.showDeleteModal = function (item) {
                vm.modalItem = item;
                vm.deleteModal.$promise.then(vm.deleteModal.show);
            };

            vm.deleteWebOrderItem = deleteWebOrderItem;

            function deleteWebOrderItem(index) {
                vm.websiteOrders.remove(index).then(function () {
                    WebsiteOrders.getList().then(function (webOrders) {
                        vm.websiteOrders = webOrders;
                        vm.deleteModal.hide();
                    });
                })
            }

        });

        /* FILE UPLOAD CODE */
        $scope.uploadFiles = function (file, errFiles) {
            vm.f = file;
            vm.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: '/uploads',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        $scope.import('assets/images/xmas.min/' + response.data.url);
                    });
                });
            }
        }

        /* UPLOAD CSV FILE   */
        $scope.import = function (target) {
            //   console.log(target);
            $http.get(target).success(function (data, status, headers, config) {
                var data = $scope.parsecsv(data);
                angular.forEach(data, function (value, key) {
                    if (key > 0) {

                        var product = {
                            orderNumber: value[0],
                            orderRef: value[1],
                            dateCreated: value[2],
                            firstName: value[3],
                            lastName: value[4],
                            email: value[5],
                            title: value[25],
                            quantity: value[27],
                            variations: value[29],
                            store: value[30],
                            pickUpDate: value[31]
                        }
                    }

                    WebsiteOrders.post(product);
                })
                WebsiteOrders.getList().then(function (websiteOrders) {
                    vm.websiteOrders = websiteOrders;
                    angular.forEach(vm.websiteOrders, function (websiteOrder) {
                        websiteOrder.hide = false;
                        if (websiteOrder.orderNumber == undefined || websiteOrder.orderNumber == '') {
                            websiteOrder.hide = true;
                        } else {
                            websiteOrder.hide = false;
                        }
                        WebsiteOrders.post(websiteOrder);
                    })
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