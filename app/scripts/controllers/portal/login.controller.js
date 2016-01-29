
;(function(){
  'use strict';

  app.controller('LoginController', LoginController);

  LoginController.$inject = ["$scope", "$rootScope", "$state", "sessionService",
  "TokenFactory", "SemesterFactory", "ToasterTool", "$localStorage", "InputValidatorFactory",
  "RoleFactory", "ErrorHandlerFactory", "HttpResponseFactory"]

  function LoginController($scope, $rootScope, $state, sessionService,
    TokenFactory, SemesterFactory, ToasterTool, $localStorage, InputValidatorFactory,
    RoleFactory, ErrorHandlerFactory, HttpResponseFactory){
    var currentUser = sessionService.getCurrentUser()
    var token = $localStorage.token
    var errorHandler = ErrorHandlerFactory.handle
    initEnvironment()

    function initEnvironment(){
        if(canAutoLogin()){
            confirmToken(currentUser.name, token)
            .then(autoLogin)
            .catch(autoLoginFail)
        }

        InputValidatorFactory.injectToScope($scope)

        $scope.loginName = ""
        $scope.loginPassword = ""
        $scope.isAutoLogin = false
        $scope.login = login
        $scope.forgotPassword = forgotPassword
    }

    function canAutoLogin(){
      return !!$localStorage.token && !!$localStorage.isAutoLogin
    }

    function confirmToken(userName, token){
        return TokenFactory.isValid(userName, token).get().$promise
        .then(function(data){
            if(data.success){
                return true
            }else{
                throw new Error("token invalid")
            }
        })
    }

    function autoLogin(){
        transitStateByRole(currentUser.roles)
    }

    function autoLoginFail(){
        ToasterTool.error("自动登录失败", "请重新登录")
    }

    function transitStateByRole(role){
        if(RoleFactory.isAdmin(role)){
            $state.go('app.calendar');
        }else if(RoleFactory.isTeacher(role)){
            $state.go('app.calendar');
        }else if(RoleFactory.isStudent(role)){
            $state.go('app.calendar');
        }else{
            ToasterTool.error('未知错误发生!');
        }
    }

    function login() {
        var name = $scope.loginName
        var password = $scope.loginPassword

        TokenFactory.login({
            'X-Username': name,
            'X-Password': encryptPassword(password, name)
        }).post({}, loginSuccess, loginError);

        function loginSuccess(data, headers){
            if(data.success === false){
                loginError()
                return
            }

            getSemester()

            var currentUser = data.data
            var token = headers()['x-auth-token']

            sessionService.saveCurrentUser(currentUser)
            sessionService.saveToken(token)
            if(!!$scope.isAutoLogin){
                $localStorage.isAutoLogin = true
            }

            transitStateByRole(currentUser.roles)
            ToasterTool.success('登录成功','欢迎回到航力云平台!');
        }

        function loginError(error){
            ToasterTool.error('登录失败','用户名或密码错误');
        }
    }

    function getSemester(){
        SemesterFactory.current().get()
        .$promise
        .then(function(response){
            if(HttpResponseFactory.isResponseSuccess(response)){
                var data = HttpResponseFactory.getResponseData(response)
                sessionService.saveCurrentSemester(data)
            }else{
                errorHandler(response)
            }
        })
        .catch(errorHandler)
    }

    function forgotPassword(){
        ToasterTool.info('请联系管理员','联系电话: 021-65982267 力学实验中心');
    }

    function encryptPassword(basePassword, userName, sbin) {
        sbin = '1234'; //未来从后台获取
        var var1 = md5(basePassword);
        var var2 = md5(var1 + userName);
        var var3 = md5(var2 + sbin.toUpperCase());
        return var3;
    }
  }
})()
