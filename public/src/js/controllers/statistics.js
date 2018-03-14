// 'use strict';

// angular.module('insight.statistics').controller('StatisticsController',
//     function($scope, $rootScope, $routeParams, $location, Global) {
//     $scope.global = Global;
//     $scope.loading = false;
  
  
//     $scope.onSuccess = function(e) {
//         console.info('Action:', e.action);
//         console.info('Text:', e.text);
//         console.info('Trigger:', e.trigger);
  
//         e.clearSelection();
//     };
  
//     $scope.onError = function(e) {
//         console.error('Action:', e.action);
//         console.error('Trigger:', e.trigger);
//     };
//     $scope.openCalendar = function($event) {
//       $event.preventDefault();
//       $event.stopPropagation();
  
//       $scope.opened = true;
//     };
  
  
//     $scope.list = function() {
//       $scope.loading = true;

//       if ($routeParams.startTimestamp) {
//         var d=new Date($routeParams.startTimestamp*1000);
//         var m=d.getMinutes();
//         if (m<10) m = '0' + m;
//         $scope.before = ' before ' + d.getHours() + ':' + m;
//       }
  
//       $rootScope.titleDetail = $scope.detail;
  
//       Blocks.get({
//         blockDate: $routeParams.blockDate,
//         startTimestamp: $routeParams.startTimestamp
//       }, function(res) {
//         $scope.loading = false;
//         $scope.blocks = res.blocks;
//         $scope.pagination = res.pagination;
//       });
//     };
  
//     $scope.params = $routeParams;
  
//   });
  
// 'use strict';

// angular.module('insight.statistics').controller('StatisticsController',
//     function($scope, $rootScope, $routeParams, $location, Global) {
//     $scope.global = Global;
//     $scope.loading = false;
  
  
//     $scope.onSuccess = function(e) {
//         console.info('Action:', e.action);
//         console.info('Text:', e.text);
//         console.info('Trigger:', e.trigger);
  
//         e.clearSelection();
//     };
  
//     $scope.onError = function(e) {
//         console.error('Action:', e.action);
//         console.error('Trigger:', e.trigger);
//     };
//     $scope.openCalendar = function($event) {
//       $event.preventDefault();
//       $event.stopPropagation();
  
//       $scope.opened = true;
//     };
  
  
//     $scope.list = function() {
//       $scope.loading = true;

//       if ($routeParams.startTimestamp) {
//         var d=new Date($routeParams.startTimestamp*1000);
//         var m=d.getMinutes();
//         if (m<10) m = '0' + m;
//         $scope.before = ' before ' + d.getHours() + ':' + m;
//       }
  
//       $rootScope.titleDetail = $scope.detail;
  
//       Blocks.get({
//         blockDate: $routeParams.blockDate,
//         startTimestamp: $routeParams.startTimestamp
//       }, function(res) {
//         $scope.loading = false;
//         $scope.blocks = res.blocks;
//         $scope.pagination = res.pagination;
//       });
//     };
  
//     $scope.params = $routeParams;
  
//   });
  