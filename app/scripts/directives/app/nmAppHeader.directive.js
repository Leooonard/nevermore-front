'use strict';

/**
 * @ngdoc directive
 * @name morningStudioApp.directive:labHeader
 * @description
 * # labHeader
 */
angular.module('nevermore')
  .directive('nmAppHeader', function () {
    return {
      templateUrl: 'tpl/app/blocks/header.html',
      restrict: 'E',
      controller: function ($scope, $rootScope, sessionService, $location) {
        var currentUser = sessionService.getCurrentUser();
        $scope.currentUser = currentUser
        $scope.logout = function(){
            sessionService.delToken();
        }
      }
    };
  });
