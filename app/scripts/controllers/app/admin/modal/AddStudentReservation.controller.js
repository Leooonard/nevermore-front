app.controller("AddStudentReservationController", ["$scope", "StateChainFactory",
  "HttpResponseFactory", "ExperimentManageFactory", "ExperimentFactory", "InputValidatorFactory",
  "LabFactory", "ReservationFactory", "DateTool", "ToasterTool",
    function($scope, StateChainFactory, HttpResponseFactory, ExperimentManageFactory
    ,ExperimentFactory ,InputValidatorFactory, LabFactory, ReservationFactory, DateTool,
    ToasterTool) {
      $scope.date = new Date()

  		var stateChain = StateChainFactory.getStateChain();

      stateChain
  		.pushState("initState")
  		.pushState("date", function(){
  			$scope.date = new Date()
  		})
      .pushState("exp", function(){
        $scope.exp = undefined
        $scope.expList = []
        $scope.lab = undefined
        $scope.labList = []
      })
  		.pushState("slot", function(){
  			$scope.slot = undefined
  			$scope.slotList = []
  		})

      $scope.exp = undefined
      $scope.expList = []

      $scope.labList = []
      $scope.lab = undefined

      $scope.slotList = []
      $scope.slot = undefined

      $scope.stage = 1

      $scope.next = next
  		$scope.prev = prev
      $scope.expChange = expChange
      $scope.reserve = reserve

      $scope.personCount = null
      $scope.remark = ""

      InputValidatorFactory.injectToScope($scope)

      function next(){
  			var lastStage = $scope.stage
  			$scope.stage += 1
  			$scope.$broadcast("nmStageNext")
  			if(lastStage === 1){
          stateChain.resetChain("exp")
          getExps()
  			}else if(lastStage === 2){
          stateChain.resetChain("slot")
  				getSlots($scope.lab.id)
  			}
  		}

  		function prev(){
  			$scope.stage -= 1
  			$scope.$broadcast("nmStagePrev")
  		}

      function getExps(){
        //获取所有可用实验室
        ExperimentManageFactory.all().get()
        .$promise.then(function(response){
          if(HttpResponseFactory.isResponseSuccess(response)){
  					var data = HttpResponseFactory.getResponseData(response)
  					angular.copy(data, $scope.expList);
  				}else{
  					errorHandler(response);
  				}
        })
        .catch(errorHandler);
      }

      function expChange(){
        stateChain.resetChain("exp")
        getLabs($scope.exp.id)
      }

      function getLabs(expId){
  			return ExperimentFactory.labs().get({
  				id: expId
  			})
  			.$promise
  			.then(function(response){
  				if(HttpResponseFactory.isResponseSuccess(response)){
  					var data = HttpResponseFactory.getResponseData(response)
  					angular.copy(data, $scope.labList)
  				}else{
  					errorHandler(response)
  				}
  			})
  			.catch(errorHandler)
  		}

      function getSlots(labID){
  			return LabFactory.slots().get({
  				id: labID,
  				date: DateTool.format($scope.date)
  			})
  			.$promise
  			.then(function(response){
  				if(HttpResponseFactory.isResponseSuccess(response)){
  					var data = HttpResponseFactory.getResponseData(response)
  					angular.copy(data, $scope.slotList)
  				}else{
  					errorHandler(response)
  				}
  			})
  			.catch(errorHandler)
  		}

      //提交预约
      function reserve(){
        ReservationFactory.reservation().post({
				  personCount: $scope.personCount,
				  experimentId: $scope.exp.id,
				  labId: $scope.lab.id,
				  slotId: $scope.slot.id,
				  applyDate: DateTool.format($scope.date),
				  remark: $scope.remark,
          type: 'STUDENT_RESERVATION'
			  })
			  .$promise
			  .then(function(response){
			  	if(HttpResponseFactory.isResponseSuccess(response)){
			  		ToasterTool.success("操作成功", "添加个人预约成功，赶快去审核吧!")
			  		$scope.closeThisDialog('success')
			  	}else{
			  		errorHandler(response)
			  	}
			  })
			  .catch(errorHandler);
      }

      function errorHandler(error){
  			if(HttpResponseFactory.isServerResponse(error)){
  				var message = HttpResponseFactory.getResponseMessage(error)
  				ToasterTool.error(message)
  			}else{
  				ToasterTool.error("网络连接错误，请重试")
  			}
  		}
    }
])
