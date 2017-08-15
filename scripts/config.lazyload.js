// lazyload config
(function() {
    'use strict';
    angular
      .module('app')
      .constant('MODULE_CONFIG', [
          {
              name: 'mgcrea.ngStrap',
              module: true,
              serie: true,
              files: [
                  '../assets/angular-motion/dist/angular-motion.min.css',
                  '../assets/bootstrap-additions/dist/bootstrap-additions.min.css',
                  '../libs/angular/angular-strap/dist/angular-strap-2.3.8.min.js',
                  '../libs/angular/angular-strap/dist/angular-strap-2.3.8-tpl.min.js'
              ]
          },
          {
              name: 'ui.bootstrap',
              module: true,
              serie: true,
              files: [
                  '../libs/angular/angular-bootstrap/ui-bootstrap-tpls.min.js',
                  '../libs/angular/angular-bootstrap/ui-bootstrap-tpls.js'
              ]
          },
          {
              name: 'ui.select',
              module: true,
              files: [
                  '../libs/angular/angular-ui-select/dist/select.min.js',
                  '../libs/angular/angular-ui-select/dist/select.min.css'
              ]
          },
          {
              name: 'vr.directives.slider',
              module: true,
              files: [
                  '../libs/angular/venturocket-angular-slider/build/angular-slider.min.js',
                  '../libs/angular/venturocket-angular-slider/angular-slider.css'
              ]
          },
          {
              name: 'angularBootstrapNavTree',
              module: true,
              files: [
                  '../libs/angular/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                  '../libs/angular/angular-bootstrap-nav-tree/dist/abn_tree.css'
              ]
          },
          {
              name: 'ngImgCrop',
              module: true,
              files: [
                  '../libs/angular/ngImgCrop/compile/minified/ng-img-crop.js',
                  '../libs/angular/ngImgCrop/compile/minified/ng-img-crop.css'
              ]
          },
          {
              name: 'smart-table',
              module: true,
              files: [
                  '../libs/angular/angular-smart-table/dist/smart-table.min.js'
              ]
          },
          {
              name: 'ui.map',
              module: true,
              files: [
                  '../libs/angular/angular-ui-map/ui-map.js'
              ]
          },
          {
              name: 'ui.grid',
              module: true,
              files: [
                  '../libs/angular/angular-ui-grid/ui-grid.min.js',
                  '../libs/angular/angular-ui-grid/ui-grid.min.css',
                  '../libs/angular/angular-ui-grid/ui-grid.bootstrap.css'
              ]
          },
          {
              name: 'xeditable',
              module: true,
              files: [
                  '../libs/angular/angular-xeditable/dist/js/xeditable.min.js',
                  '../libs/angular/angular-xeditable/dist/css/xeditable.css'
              ]
          },
          {
              name: 'smart-table',
              module: true,
              files: [
                  '../libs/angular/angular-smart-table/dist/smart-table.min.js'
              ]
          },
          {
              name: 'dataTable',
              module: false,
              files: [
                  '../libs/jquery/datatables/media/js/jquery.dataTables.min.js',
                  '../libs/jquery/plugins/integration/bootstrap/3/dataTables.bootstrap.js',
                  '../libs/jquery/plugins/integration/bootstrap/3/dataTables.bootstrap.css'
              ]
          },
          {
              name: 'footable',
              module: false,
              files: [
                  '../libs/jquery/footable/dist/footable.all.min.js',
                  '../libs/jquery/footable/css/footable.core.css'
              ]
          },
          {
              name: 'moment',
              module: false,
              files: [
                  '../libs/js/moment/moment.js'
              ]
          },
          {
              name: 'sortable',
              module: false,
              files: [
                  '../libs/jquery/html.sortable/dist/html.sortable.min.js'
              ]
          },
          {
              name: 'nestable',
              module: false,
              files: [
                  '../libs/jquery/nestable/jquery.nestable.css',
                  '../libs/jquery/nestable/jquery.nestable.js'
              ]
          },
          {
              name: 'chart',
              module: false,
              files: [
                  '../libs/js/echarts/build/dist/echarts-all.js',
                  '../libs/js/echarts/build/dist/theme.js',
                  '../libs/js/echarts/build/dist/jquery.echarts.js'
              ]
          }
        ]
      )
      .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function($ocLazyLoadProvider, MODULE_CONFIG) {
          $ocLazyLoadProvider.config({
              debug: false,
              events: false,
              modules: MODULE_CONFIG
          });
      }]);
})();

