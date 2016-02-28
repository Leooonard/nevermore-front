;void function(){
	angular.module("nevermore")
			.controller("TeacherAddStudentController", TeacherAddStudentController)

	TeacherAddStudentController.$inject = ["$scope", "ClazzFactory", "ToasterTool", "clazzId"]

	function TeacherAddStudentController($scope, ClazzFactory, ToasterTool, clazzId){

    $scope.classID = clazzId;

    $scope.genders = [
      {
        code: 'MALE',
        value: '男'
      },
      {
        code: 'FEMALE',
        value: '女'
      }
    ];

    $scope.item = {
      account: null,
      password: '222222',
      name: null,
      mobile: "",
      gender: $scope.genders[0]
    };

    $scope.submit = submit

    //添加学生
    function submit(){
      var submitData = angular.copy($scope.item);
      submitData.gender = submitData.gender.code;

      ClazzFactory.student().
        post({
          id: $scope.classID
        }, submitData)
        .$promise
        .then(function(response){
          if(response.success){
						ToasterTool.success(response.message);
            $scope.closeThisDialog("success")
          }else{
            ToasterTool.error("添加学生失败");
          }
        });
    }


	}
}()
