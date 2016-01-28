app.controller("ModifyStudentAccountCtrl", ["$scope", "data", "AccountManage",
    "ManagementService", "AlertTool", "ToasterTool",
    function($scope, data, AccountManage, ManagementService, AlertTool, ToasterTool) {
        $scope.genderList = [{
            "value": "男",
            "code": "MALE",
        }, {
            "value": "女",
            "code": "FEMALE",
        }, ];

        var originResource = data,
            copiedResource = angular.copy(originResource)

        $scope.resource = copiedResource
        $scope.pending = false
        $scope.modifyStudent = modifyStudent
        $scope.deleteStudent = deleteStudent
        $scope.modifyStudentPassword = modifyStudentPassword
        $scope.errorTip = ""

        // ~ 修改
        function modifyStudent() {
            if (resourceComplete()) {
                commitModify().$promise
                    .then(removeErrorTip)
                    .then(updateLocalResource)
                    .then(function() {
                          $scope.closeThisDialog("modify")
                    })
                    .catch(errorHandler)
            } else {
                errorHandler("请完整填写信息")
            }
        }
        function resourceComplete() {
            return true
        }
        function commitModify() {
            $scope.pending = true
            var submitResource = angular.copy(copiedResource);
            submitResource.gender = copiedResource.gender.code
            return AccountManage.account().put({
                "id": copiedResource.id,
            }, submitResource)
        }
        function updateLocalResource(data) {
            angular.copy(copiedResource, originResource)
        }

        // ~ 删除
        function deleteStudent(resource) {
            AlertTool.deleteConfirm({
                title: "是否确认删除?"
            }).then(function(isConfirm) {
                if (isConfirm) {
                    AlertTool.close();
                    commitDelete(resource)
                        .then(function(data) {
                            if(data.success){
                              $scope.closeThisDialog("delete")
                            }else{
                              ToasterTool.error(data.message)
                            }
                        })
                        .catch($scope.errorHandler)
                }
            })
        }
        function commitDelete(resource) {
            return AccountManage.account().delete({
                id: copiedResource.id
            }).$promise
        }

        // ~ 修改密码
        function modifyStudentPassword(resource) {
            if (resourceComplete()) {
                commitModifyPassword().$promise
                    .then(removeErrorTip)
                    .then(updateLocalResource)
                    .then(function(data) {
                        if(data.success){
                          $scope.closeThisDialog("modify")
                        }else{
                          ToasterTool.error(data.message)
                        }
                    })
                    .catch(errorHandler)
            } else {
                errorHandler("请完整填写信息")
            }
        }
        function resourceComplete() {
            if($scope.resource.newPassword != $scope.resource.confirmPassword)
              return false
            return true
        }
        function commitModifyPassword() {
            $scope.pending = true
            var submitResource = angular.copy(copiedResource);
            submitResource.gender = copiedResource.gender.code
            submitResource.password = md5($scope.resource.newPassword)
            return AccountManage.account().put({
                "id": copiedResource.id,
            }, submitResource)
        }

        // ~ Common
        function removeErrorTip(data) {
            $scope.errorTip = ""
            return data
        }
        function errorHandler(error) {
            $scope.pending = false
            var errorMessage = getErrorMessage(error)
            showErrorTip(errorMessage)
        }
        function getErrorMessage(error) {
            if (typeof error === "object") {
                return error.errorCode || error.toString()
            } else {
                return error.toString()
            }
        }
        function showErrorTip(error) {
            $scope.errorTip = error
        }

    }
])
