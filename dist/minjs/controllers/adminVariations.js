!function(){"use strict";function t(t,o,e,a,n,i,d,r,p,c,s,l){var u=t;u.editVariation=function(t){u.newVariation=t,u.isVariationNew=!1,u.showModal()},u.addQtyVariation=function(){u.newVariation={},u.newVariation.varType="Product Variation",u.isVariationNew=!0,u.showModal()},u.saveFixedQty=function(){u.newVariation.parentProductID=u.tempProduct._id,void 0!=u.tempProduct.productVar?u.tempProduct.productVar.push(u.newVariation):u.tempProduct.productVar=[u.newVariation],r.post(u.tempProduct),u.openModal.hide()},u.removeFixedQty=function(t){u.tempProduct.productVar.splice(u.tempProduct.productVar.indexOf(t),1),r.post(u.tempProduct),u.openRemoveQtyModal.hide()},u.saveExistingVar=function(){r.post(u.tempProduct),u.openModal.hide()},a.getList().then(function(t){u.users=t}),r.getList().then(function(t){u.products=t,angular.forEach(u.products,function(t){t._id==l.id&&(u.tempProduct=t)})}),d.getList().then(function(t){u.orders=t}),u.openModal=c({scope:u,templateUrl:"apps/admin/modals/productVariationModal.html",show:!1,animation:"am-fade-and-slide-top",placement:"center"}),u.showModal=function(t){u.modalItem=t,u.openModal.$promise.then(u.openModal.show)},u.openRemoveQtyModal=c({scope:u,templateUrl:"apps/admin/modals/deleteQtyModal.html",show:!1,animation:"am-fade-and-slide-top",placement:"center"}),u.showDeleteQtyModal=function(t){u.modalItem=t,u.openRemoveQtyModal.$promise.then(u.openRemoveQtyModal.show)}}angular.module("app").controller("adminVariationsCtrl",t),t.$inject=["$scope","$http","$filter","Users","$location","$rootScope","Orders","Products","$timeout","$modal","$state","$stateParams"]}();