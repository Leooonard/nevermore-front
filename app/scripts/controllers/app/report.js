'use strict';

app.controller('ReportCtrl',  function($scope, $state) {

  // $scope.$on('report_step', function(event, data){
  //   $scope.report_step = data;
  // });

  $scope.report_step = 1;

  $scope.next = function() {
    $scope.report_step++;
  }

  $scope.last = function() {
    $scope.report_step--;
  }

});
