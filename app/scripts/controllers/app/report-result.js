'use strict';

app.controller('ReportResultCtrl',  function($scope, $localStorage, $stateParams, Clazz, Exp, qService, sessionService) {

  $scope.exp_id = $stateParams.expId;

  $scope.class_id = $stateParams.classID;

  $scope.student = sessionService.getCurrUser();

  $scope.semester = sessionService.getCurrSemeter();

  qService.tokenHttpGet(Clazz.clazz, {
    id: $scope.class_id
  }).then(function(rc){
    $scope.clazz = rc.data;
  });

  qService.tokenHttpGet(Exp.fid, {
    id: $scope.exp_id
  }).then(function(rc){
    $scope.exp = rc.data;
  });

});
