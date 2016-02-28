;void function(){
	angular.module("nevermore")
			.controller("TeacherAppointmentController", TeacherAppointmentController)

	TeacherAppointmentController.$inject = ["$scope", "ToasterTool", "ngDialog",
		"ClazzFactory", "ErrorHandlerFactory", "HttpResponseFactory", "ReservationFactory",
		"AlertTool"]

	function TeacherAppointmentController($scope, ToasterTool, ngDialog,
		ClazzFactory, ErrorHandlerFactory, HttpResponseFactory, ReservationFactory,
		AlertTool){

		var errorHandler = ErrorHandlerFactory.handle

		$scope.experimentList = []
		$scope.getTotalReservationPersonCount = getTotalReservationPersonCount
		$scope.openReserveDialog = openReserveDialog
		$scope.cancelReservation = cancelReservation

		$scope.cancelReservation = cancelReservation
		$scope.viewReservation = viewReservation


		loadExperimentReservations();

		//获取实验预约列表
		function loadExperimentReservations(){
		 	ClazzFactory.experiments().get({
				id:$scope.class.id,
			 	type: 'reservations'
		 	})
		 	.$promise
		   	.then(function(response){
		   		if(HttpResponseFactory.isResponseSuccess(response)){
		   			var data = HttpResponseFactory.getResponseData(response)
		   			angular.copy(data, $scope.experimentList)
		   		}else{
		   			errorHandler(response)
		   		}
		 	})
		 	.catch(errorHandler)
		}

		//打开预约面板
		function openReserveDialog(experiment){
			try {
				var reserveDialog = ngDialog.open({
					template: "/tpl/app/teacher/modal/add-reservation.html",
					controller: "TeacherReserveController",
					className: 'nm-dialog nm-dialog-md',
					closeByDocument: true,
					closeByEscape: true,
					resolve: {
						experimentID: function() {
							return experiment.id
						},
						experimentName: function(){
							return experiment.name
						},
						classID: function(){
							return $scope.class.id
						}
					}
				})

				reserveDialog.closePromise.then(function(data){
					if(data.value === 'success'){
						loadExperimentReservations()
					}
				})
			} catch (e) {
				window.location.reload();
			} finally {

			}

		}

		function getTotalReservationPersonCount(experiment){
			var reservations = experiment.reservations
			var totalPersonCount = 0

			if(Array.isArray(reservations) === false){
				return 0
			}

			angular.forEach(reservations, function(reservation){
				totalPersonCount += reservation.personCount
			})

			return totalPersonCount
		}

		function viewReservation(reservation){
			var dialog = ngDialog.open({
				"template": "tpl/app/admin/modal/view-experiment-appointment.html",
				"controller": "ViewReservationController",
				"closeByDocument": true,
				"className" : 'nm-dialog nm-dialog-md',
				"closeByEscape": true,
				"resolve": {
					data: function(){
						return ReservationFactory.reservation().get({
							id: reservation.id
						}).$promise;
					}
				},
			})
		}

		function cancelReservation(reservation){
			AlertTool.confirm({title:'您确定要取消这个预约?'}).then(function(isConfirm) {
			  if(isConfirm) {
					ReservationFactory.reservation().
						delete({id:reservation.id})
						.$promise
						.then(function(response){
							if(response.success){
								ToasterTool.success('取消预约成功!');
								loadExperimentReservations()
							}else{
								ToasterTool.error('错误',response.message);
							}
						});
			    AlertTool.close();
			  }
			});
		}
	}

}()
