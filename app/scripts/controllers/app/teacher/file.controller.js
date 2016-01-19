/**
 * 实验文件管理类
 */
;void function(){
	angular.module("nevermore")
			.controller("TeacherFileController", TeacherFileController)

	TeacherFileController.$inject = ["$scope", "ClazzFactory", "httpResponseFactory",
		"ToasterTool", "Upload", "sessionService"]

	function TeacherFileController($scope, ClazzFactory, httpResponseFactory,
		ToasterTool, Upload, sessionService){

		$scope.publicFileList = []
		$scope.privateFileList = []

		$scope.selectedTab = 'CLAZZ_PUBLIC'
		$scope.remove = removeFileFromClazz

		getPublicFiles()
		getPrivateFiles()

		$scope.$watch('file', function () {
			$scope.uploadFile($scope.file);
		});

		$scope.table = [];
		$scope.changeTab = function(tab){
			$scope.selectedTab = tab;
		}

		$scope.uploadFile = function (file) {
			if(file) {
				Upload.upload({
						url: base_Url+'/file/upload',
						method: 'POST',
						headers: sessionService.headers(),
						data: {},
						file: file
				}).then (function (response) {
					console.log(response);
						if (response.data.success){
							relateFileAndClazz(response.data.data, $scope.classID);
						}
				}, function (response) {
					ToasterTool.warning("文件上传失败!");
				});
			}
		};

		//关联文件
		function relateFileAndClazz(file, clazzId){
			ClazzFactory.file().post({id:clazzId}, {
				attachId: file.id,
				type: $scope.selectedTab
			}).$promise
			.then(function(response){
				if(response.success){
					ToasterTool.success("文件上传成功!");
					refreshList()
				}else{
					ToasterTool.warning("文件上传失败!");
				}
			});
		}

		function removeFileFromClazz(file){
			ClazzFactory.removeFile().delete({
				id : $scope.classID,
				fileId : file.id,
				type: $scope.selectedTab
			},{})
			.$promise
			.then(function(response){
				if(response.success){
					ToasterTool.success("移除文件成功!");
					refreshList()
				}
			});
		}

		//获取共有文件
		function getPublicFiles(){
			var fileType = "CLAZZ_PUBLIC"

			getFiles(fileType)
			.then(function(response){
				if(httpResponseFactory.isResponseSuccess(response)){
					var data = httpResponseFactory.getResponseData(response)
					angular.copy(data, $scope.publicFileList)
				}else{
					throw new Error(response)
				}
			})
			.catch(errorHandler)
		}

		//获取私有文件
		function getPrivateFiles(){
			var fileType = "CLAZZ_PRIVATE"
			getFiles(fileType)
			.then(function(response){
				if(httpResponseFactory.isResponseSuccess(response)){
					var data = httpResponseFactory.getResponseData(response)
					angular.copy(data, $scope.privateFileList)
				}else{
					throw new Error(response)
				}
			})
			.catch(errorHandler)
		}

		//访问文件列表接口
		function getFiles(fileType){
			return clazzFactory.files().get({
				id: $scope.classID,
				type: fileType
			}).$promise
		}

		//刷新当前列表
		function refreshList(){
			if($scope.selectedTab === 'CLAZZ_PUBLIC'){
					getPublicFiles();
			}else{
					getPrivateFiles();
			}
		}

		function errorHandler(error){
			if(httpResponseFactory.isServerResponse(error)){
				var message = httpResponseFactory.getResponseMessage(error)
				ToasterTool.error(message)
			}else{
				ToasterTool.error("网络连接错误，请重试")
			}
		}
	}
}()
