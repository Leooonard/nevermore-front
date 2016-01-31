;void function(){
	angular.module("nevermore")
			.controller("ReservationController", ReservationController)

	ReservationController.$inject = ["$scope", "ReservationFactory", "ngDialog",
		"HttpResponseFactory", "ToasterTool", "generalService", "ErrorHandlerFactory"]

	function ReservationController($scope, ReservationFactory, ngDialog,
		HttpResponseFactory, ToasterTool, generalService, ErrorHandlerFactory){

		var errorHandler = ErrorHandlerFactory.handle

		$scope.reservationInWeekList = []
		$scope.reservationOutWeekList = []
		$scope.paginator = {
			page: 1,
			items: undefined,
			itemsPerPage: generalService.pageSize(),
		}

		$scope.pageChanged = pageChanged
		$scope.cancelReservation = cancelReservation
		$scope.viewReservation = viewReservation

		getReservationsInWeek()
		getReservationOutWeek()

		function getReservationsInWeek(){
			ReservationFactory.myReservationsInWeek().get(
				{
					// isExpired: false //不过期的
				}
			)
			.$promise
			.then(function(response){
				if(HttpResponseFactory.isResponseSuccess(response)){
					var data = HttpResponseFactory.getResponseData(response)
					angular.copy(data, $scope.reservationInWeekList)
				}else{
					errorHandler(response)
				}
			})
			.catch(errorHandler)
		}

		function getReservationOutWeek(){
			ReservationFactory.myReservationsOutWeek().get({
				pageNum: $scope.paginator.page,
				pageSize: $scope.paginator.itemsPerPage,
				// isExpired: false
			})
			.$promise
			.then(function(response){
				if(HttpResponseFactory.isResponseSuccess(response)){
					var data = HttpResponseFactory.getResponseData(response)
					angular.copy(data, $scope.reservationOutWeekList)
					var paginator = HttpResponseFactory.getResponsePaginator(response)
					angular.copy(paginator, $scope.paginator)
				}else{
					errorHandler(response)
				}
			})
			.catch(errorHandler)
		}

		function cancelReservation(reservationID){
			ReservationFactory.reservation().delete({
				id: reservationID,
			})
			.$promise
			.then(function(response){
				if(HttpResponseFactory.isResponseSuccess(response)){
					ToasterTool.success("取消预约成功")
					getReservationsInWeek()
					getReservationOutWeek()
				}else{
					errorHandler(response)
				}
			})
			.catch(errorHandler)
		}

		function viewReservation(reservation){
			var dialog = ngDialog.open({
				"template": "tpl/app/admin/modal/view-experiment-appointment.html",
				"controller": "ViewExperimentAppointmentCtrl",
				"closeByDocument": true,
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

		function pageChanged(){
			getReservationOutWeek()
		}
	}

}()
