'use strict';

app.controller('TeacherClassCtrl', function($scope,
    $stateParams, qService, Exp, generalService, Clazz, StudentRecord, Account, ToasterTool, AlertTool) {
  $scope.clazz = {};

  $scope.class_id = $stateParams.id;
  $scope.exp_id = $stateParams.expId;

  var pageSize = generalService.pageSize();

  $scope.tab = 'experiment';

  $scope.students = {
      data:[],
      totalPageNum: 0,
      curPageNum:1,
      totalItemNum:0
  };

  $scope.records = {
      data:[],
      totalPageNum: 0,
      curPageNum:1,
      totalItemNum:0
  };

  $scope.pageStudent = function() {
    qService.tokenHttpGet(Clazz.studentListByPage, {
        "id": $scope.class_id,
        "pageSize": pageSize,
        "pageNumber": $scope.students.curPageNum
    }).then(function(rc){
        $scope.students = rc;
    });
  };

  $scope.view_exp = function() {
    $scope.tab="experiment";
  }

  $scope.view_student = function(){
    $scope.tab="student";
  }

  $scope.view_record = function(id){
    $scope.tab = 'record';
    $scope.exp_id = id;
    $scope.pageRecord();
  }

  $scope.pageRecord = function(){
    qService.tokenHttpGet(StudentRecord.recordListByPage,{
        "clazzId": $scope.class_id,
        "experimentId": $scope.exp_id,
        "pageSize":pageSize,
        "pageNumber":$scope.records.curPageNum
    }).then(function(rc){
        $scope.records = rc;
    });
  }

  $scope.removeStudent = function(stId){
    qService.tokenHttpDelete(Account.removeClazzStudent,{
        'clazzId': $scope.class_id,
        'studentId': stId,
    }).then(function(rc){
        if(rc.errorCode == 'NO_ERROR'){
            AlertTool.success({title:'删除学生成功',text:''}).then(function() {
              $scope.students.curPageNum = 1;
              $scope.pageStudent();
            });
        }else{
            ToasterTool.error("删除学生失败!","未知错误");
        }
    });
  };

  function init(){
    qService.tokenHttpGet(Clazz.clazz, {
      id: $scope.class_id
    }).then(function(rc){
      $scope.clazz = rc.data;
    });

    qService.tokenHttpGet(Exp.statusListByClazz, {
      "classId": $scope.class_id
    }).then(function(rc){
        $scope.exps = rc;
    });

    if ($scope.exp_id) {
      $scope.view_record($scope.exp_id);
    }

    $scope.pageStudent();
  }

  $scope.$on('classchange',function (event, arg) {
    if ($scope.classes.length!=0) {
      $scope.class_id = $scope.classes[0].id;
      init();
    }
  });

  if ($scope.class_id) {
    init();
  }else if ($scope.classes.length!=0) {
    $scope.class_id = $scope.classes[0].id;
    init();
  }

});
