!function(){"use strict";function e(e,c,t){function i(i,n,u){var a=i.$eval(u.uiInclude);e.get(a,{cache:c}).success(function(e){n.replaceWith(t(e)(i))})}var n={restrict:"A",link:i};return n}angular.module("app").directive("uiInclude",e),e.$inject=["$http","$templateCache","$compile"]}();