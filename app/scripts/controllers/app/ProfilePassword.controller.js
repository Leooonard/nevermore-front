'use strict';

app.controller('ProfilePasswordController', ['$scope', '$rootScope','AccountFactory', 'ToasterTool', 'sessionService',
function($scope, $rootScope, AccountFactory, ToasterTool, sessionService) {
  $scope.password = {
    passwordEdit: {
      oldPassword: null,
      password: null,
      confirmPassword: null
    }
  };

  var currentUser = sessionService.getCurrentUser();

  $scope.updatePassword = function() {
    angular.forEach($scope.password.passwordEdit, function(value, key, obj) {
      obj[key] = md5(value);
    })

    AccountFactory.password().put($scope.password.passwordEdit).$promise.
    then(
      function success(data) {
        if (data.success) {
          ToasterTool.success("更新密码成功");
        } else {
          ToasterTool.error("更新密码失败");
        }
        $scope.password.passwordEdit = {};
        $scope.passwordForm.$setPristine();
      },
      function error(error) {
        console.log(error);
      })
    }
}]);
