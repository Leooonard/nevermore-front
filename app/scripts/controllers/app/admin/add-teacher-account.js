app.controller("AddTeacherAccountCtrl", ["$scope", "Account",
function($scope, Account){
	var DEFAULT_ACCOUNT = {
		"number" : "",
		"initialPassword" : "",
		"role" : "ALL_TEACHER",
		"gender": "MALE",
		"mobilePhone": "",
		"name": "",
	}

	var genderManager = new GenderManager()
	var roleManager = new RoleManager()
	var account = angular.copy(DEFAULT_ACCOUNT)

	$scope.account = account
	$scope.genderList = genderManager.getGenderList()
	$scope.roleList = roleManager.getRoleList()
	$scope.addAccount = addAccount
	$scope.errorTip = ""
	$scope.adding = false


	

	//TODO: 这种manager抽象出来
	function GenderManager(){
		var GENDER_LIST = [
			{
				"chinese": "男",
				"english": "MALE",
			},
			{
				"chinese": "女",
				"english": "FEMALE",
			},
		]

		this.getGenderList = function(){
			return GENDER_LIST
		}
	}

	function RoleManager(){
		var ROLE_LIST = [
			{
				"chinese": "课程和实验教师",
				"english": "ALL_TEACHER",
			},
			{
				"chinese": "课程教师",
				"english": "NOR_TEACHER",
			},
			{
				"chinese": "实验教师",
				"english": "LAB_TEACHER",
			},
		]

		this.getRoleList = function(){
			return ROLE_LIST
		}
	}

	function addAccount(){
		if(accountComplete()){
			commitAccount().$promise
			.then(removeErrorTip)
			.then(accountValid)
			.then(function(data){
				$scope.closeThisDialog({
					account: data.data
				})
			})
			.catch(errorHandler)
		}else{
			errorHandler("请完整填写信息")
		}
	}

	function accountComplete(){
		if($scope.account.number === "" ||
			$scope.account.name === "" ||
			$scope.account.initialPassword === ""){
			return false
		}
		return true
	}

	function commitAccount(){
		$scope.adding = true
		return Account.create().post(account)
	}

	function removeErrorTip(data){
		$scope.errorTip = ""
		return data
	}

	function accountValid(data){
		console.log(data)
		var RIGHT_CODE = "NO_ERROR"
		if(data.errorCode === RIGHT_CODE){
			return data
		}else{
			throw new Error(data)
		}
	}

	function errorHandler(error){
		$scope.adding = false
		var errorMessage = getErrorMessage(error)
		showErrorTip(errorMessage)
	}

	function getErrorMessage(error){
		if(typeof error === "object"){
			return error.errorCode || error.toString()
		}else{
			return error.toString()
		}
	}

	function showErrorTip(error){
		$scope.errorTip = error
	}
}])