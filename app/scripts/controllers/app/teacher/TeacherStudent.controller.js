;void function(){
	angular.module("nevermore")
			.controller("TeacherStudentController", TeacherStudentController)

	TeacherStudentController.$inject = ["$scope", "ClazzFactory", "ToasterTool",
	"HttpResponseFactory", "AlertTool", "ngDialog"]

	function TeacherStudentController($scope, ClazzFactory, ToasterTool,
	HttpResponseFactory, AlertTool, ngDialog){

		$scope.studentList = [];
		$scope.selectAll = false;

		$scope.removeSelected = removeSelected
		$scope.toUploadStudents = toUploadStudents
		$scope.toAddStudent = toAddStudent
		$scope.selectAllItems = selectAllItems
		$scope.viewStudentInfo = viewStudentInfo

		loadClazzStudents();

		//删除移除一个学生
		$scope.removeOneStudent = function(student){
			AlertTool.deleteConfirm({title:'是否要移除学生?'}).then(function(isConfirm) {
			  if(isConfirm) {
			    AlertTool.close();
				removeSelected([student.id]);
			  }
			});
		}
		$scope.removeSelectedStudents = function(){
			var ids = getSelectedStudentIds();
			if(ids.length == 0){
				ToasterTool.error('没有选中任何学生');
				return
			}
			AlertTool.deleteConfirm({title:'是否要移除选中的学生?'}).then(function(isConfirm) {
			  if(isConfirm) {
			    AlertTool.close();
				removeSelected(ids);
			  }
			});
		};

		// ~ private methods

		//获取学生列表
		function loadClazzStudents(){
			ClazzFactory.students().get({
				id:$scope.class.id,
				scope:'all'
			}).$promise
			.then(function(response){
				if(HttpResponseFactory.isResponseSuccess(response)){
					var data = HttpResponseFactory.getResponseData(response)
					angular.copy(data, $scope.studentList)
					tagSelectStatus($scope.studentList, false);
				}else{
					errorHandler(response)
				}
			})
			.catch(errorHandler)
		}

		//移除所选学生
		function removeSelected(studentIds){
			ClazzFactory.students().delete({
				id: $scope.class.id,
				stuIds: studentIds
			}).$promise
			.then(function(response){
				if(response.success){
					ToasterTool.success('移除学生成功');
					loadClazzStudents();
				}else{
					errorHandler(response)
				}
			})
			.catch(errorHandler)
		}

		//去上传学生名单
		function toUploadStudents(){
			var dialog = ngDialog.open({
	      template: 'tpl/app/teacher/modal/upload-student.html',
	      controller: 'UploadStudentController',
	      className: 'nm-dialog nm-dialog-md',
	      closeByDocument: false,
	      closeByEscape: true,
	      resolve: {
	          classId: function() {
	            return $scope.class.id;
	          }
	        }
	    });
			dialog.closePromise.then(function(data){
				if(data.value === 'success'){
					ToasterTool.success("上传学生成功");
					loadClazzStudents();
				}
			});
		}

		//去添加一个学生
		function toAddStudent(){
			console.log($scope.class.id);
			var dialog = ngDialog.open({
				"template": "tpl/app/teacher/modal/add-student.html",
				"controller": "TeacherAddStudentController",
				"closeByDocument": true,
				"closeByEscape": true,
				"resolve": {
					"clazzId": function(){
						return $scope.class.id
					}
				},
			})
			dialog.closePromise.then(function(data){
				if(data.value === 'success'){
					// ToasterTool.success("添加学生成功");
					loadClazzStudents();
				}
			});
		}

		//查看学生信息
		function viewStudentInfo(student){

		}

		//选中所有学生按钮点击时间 全选/反选
		function selectAllItems(){
			if($scope.selectAll){
				tagSelectStatus($scope.studentList, true)
			}else{
				//不选中
				tagSelectStatus($scope.studentList, false)
			}
		}

		function tagSelectStatus(list, status){
			for(var i=0; i<list.length; i++){
					list[i]['selected'] = status;
			}
		}
		function getSelectedStudentIds(){
			var ids = [];
			for(var i=0; i<$scope.studentList.length; i++){
					if($scope.studentList[i]['selected']){
						ids.push($scope.studentList[i].id);
					}
			}
			return ids;
		}

		//根据输入的key过滤学生
		function filterByKey(){

		}

		//错误处理
		function errorHandler(error){
			if(HttpResponseFactory.isServerResponse(error)){
				var message = HttpResponseFactory.getResponseMessage(error)
				ToasterTool.error(message)
			}else{
				console.log(error)
				ToasterTool.error("网络连接错误，请重试")
			}
		}


	}
}()
