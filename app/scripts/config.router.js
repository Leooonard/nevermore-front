'use strict';

angular.module('nevermore')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
        function($stateProvider, $urlRouterProvider, JQ_CONFIG) {
            $urlRouterProvider
                .otherwise('/index');
            $stateProvider
            //portal
                .state('portal', {
                    abstract: true,
                    url: '/portal',
                    controller: 'PortalController',
                    templateUrl: 'tpl/portal/portal.html',
                    resolve: {
                        css: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'styles/portal.css',
                                'scripts/controllers/portal/Portal.controller.js',
                                "scripts/factories/Token.factory.js",
                                'scripts/directives/portal/nmPortalHeader.directive.js',
                                'scripts/directives/portal/nmPortalFooter.directive.js',
                                "scripts/factories/InputValidator.factory.js",
                                "scripts/factories/refine/HttpResponse.factory.js",
                                "scripts/factories/ErrorHandler.factory.js",
                                "scripts/factories/Role.factory.js",
                            ]);
                        }]
                    }
                })
                .state('portal.index', {
                    url: '^/index',
                    views: {
                        "index": {
                            url: "",
                            templateUrl: 'tpl/portal/index.html',
                            controller: 'IndexController',
                            resolve: {
                                controller: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        'scripts/controllers/portal/Index.controller.js',
                                    ]);
                                }]
                            }
                        },
                        "calendar": {
                            url: "",
                            templateUrl: 'tpl/portal/calendar.html',
                            controller: 'PortalCalendarController',
                            resolve: {
                                controller: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        'scripts/controllers/portal/PortalCalendar.controller.js',
                                        'lib/jquery/fullcalendar/fullcalendar.css',
                                        'lib/jquery/fullcalendar/theme.css',
                                        'lib/jquery/jquery-ui-1.10.3.custom.min.js',
                                        'lib/libs/moment.min.js',
                                        'lib/jquery/fullcalendar/fullcalendar.min.js',
                                        'scripts/directives/portal/nmPortalFooter.directive.js',
                                        'ui.calendar'
                                    ]);
                                }]
                            }
                        }
                    }

                })
                .state('portal.login', {
                    url: '^/signin',
                    views: {
                        "index": {
                            url: "",
                            templateUrl: 'tpl/portal/login.html',
                            controller: 'LoginController',
                            resolve: {
                                controller: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        'scripts/controllers/portal/Login.controller.js',
                                        "scripts/factories/refine/Semester.factory.js",
                                        "scripts/factories/Role.factory.js",
                                    ]);
                                }]
                            }
                        }
                    }
                })
                //app
                .state('app', {
                    abstract: true,
                    url: '/app',
                    templateUrl: 'tpl/app/app.html',
                    controller: 'AppCtrl',
                    resolve: {
                        css: ['$ocLazyLoad', function($ocLazyLoad) {
                            // $httpProvider.interceptors.push('loadingInterceptor');
                            return $ocLazyLoad.load([
                                'scripts/controllers/app.js',
                                'scripts/directives/app/nmAppHeader.directive.js',
                                'styles/app.css',
                                'scripts/directives/app/nevermore-empty-panel.js',
                                "scripts/factories/Role.factory.js",
                                "scripts/factories/refine/HttpResponse.factory.js",
                                "scripts/factories/ErrorHandler.factory.js",
                                "scripts/factories/InputValidator.factory.js",
                                "scripts/controllers/app/modal/ViewPicture.controller.js",
                                'NMMsgNumber'
                            ]);
                        }]
                    }
                })
                .state('app.index', {
                    url: '^/app/index',
                    controller: 'AppIndexController',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/AppIndex.controller.js',
                            ]);
                        }]
                    }
                })
                .state("app.teacher", {
                    url: '^/app/teacher',
                    templateUrl: 'tpl/app/teacher/index.html',
                    controller: 'TeacherIndexController',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/teacher/TeacherIndex.controller.js',
                            ]);
                        }]
                    },
                })
                .state("app.reservation", {
                    url: "^/app/reservation",
                    templateUrl: "tpl/app/reservation.html",
                    controller: "ReservationController",
                    controllerAs: "reservations",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/Reservation.controller.js',
                                'scripts/controllers/app/admin/modal/ViewReservation.controller.js',
                                "scripts/factories/refine/Reservation.factory.js",
                                "scripts/factories/refine/HttpResponse.factory.js",
                                "ngDialog",
                            ]);
                        }]
                    },
                })
                .state("app.teacher.class-selection", {
                    url: "^/app/teacher/class-selection",
                    templateUrl: "tpl/app/teacher/class-selection.html",
                    controller: ['$state', function($state) {
                        var currState = $state.current.name;
                        if (currState === "app.teacher.class-selection") {
                            $state.go('app.teacher.class-selection.all-class');
                        }
                    }],
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/factories/StateChain.factory.js",
                                'ngDialog',
                                'NmDatepicker',
                                "scripts/factories/InputValidator.factory.js",
                                "scripts/controllers/app/teacher/TeacherClassSelection.controller.js",
                            ])
                        }]
                    },
                })
                .state("app.teacher.class-selection.all-class", {
                    url: "^/app/teacher/class-selection/all-class",
                    templateUrl: "tpl/app/teacher/all-class.html",
                    controller: "TeacherAllClassController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/teacher/TeacherAllClass.controller.js",
                                "scripts/factories/refine/Clazz.factory.js",
                                "scripts/factories/refine/HttpResponse.factory.js",
                            ])
                        }]
                    },
                })
                .state("app.teacher.class", {
                    url: "^/app/teacher/class/:classID",
                    templateUrl: "tpl/app/teacher/class.html",
                    controller: "TeacherClassController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/factories/StateChain.factory.js",
                                'ngDialog',
                                'NmDatepicker',
                                "scripts/factories/InputValidator.factory.js",
                                "scripts/controllers/app/teacher/TeacherClass.controller.js",
                                "scripts/factories/ErrorHandler.factory.js",
                                "scripts/factories/refine/Clazz.factory.js",
                                "scripts/factories/refine/HttpResponse.factory.js",
                            ])
                        }],
                        clazz: function($resource, $stateParams, $localStorage) {
                            var apiUrl = base_Url + '/clazz'
                            var classID = $stateParams.classID

                            return $resource(apiUrl + "/:id", null, {
                                    get: {
                                        method: "GET",
                                        headers: {
                                            'x-auth-token': $localStorage.token
                                        },
                                    }
                                }).get({
                                    id: classID,
                                })
                                .$promise
                                .then(function(response) {
                                    return response.data
                                })
                                .catch(function(error) {
                                    throw new Error(error.message)
                                })
                        }
                    },
                })
                .state("app.teacher.class.main-page", {
                    url: "/main-page",
                    templateUrl: "tpl/app/teacher/main-page.html",
                    controller: "TeacherMainPageController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/factories/refine/Clazz.factory.js",
                                "scripts/controllers/app/teacher/TeacherMainPage.controller.js",
                                "scripts/factories/refine/HttpResponse.factory.js",
                                "scripts/controllers/app/teacher/modal/ModifyMainPage.controller.js",
                            ])
                        }]
                    },
                })
                .state("app.teacher.class.file", {
                    url: "/file",
                    templateUrl: "tpl/app/teacher/file.html",
                    controller: "TeacherFileController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/teacher/TeacherFile.controller.js",
                                "ngFileUpload"
                            ])
                        }]
                    },
                })
                .state("app.teacher.class.appointment", {
                    url: "/appointment",
                    templateUrl: "tpl/app/teacher/appointment.html",
                    controller: "TeacherAppointmentController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/filters/Experiment.filter.js",
                                "scripts/controllers/app/admin/modal/ViewReservation.controller.js",
                                "scripts/controllers/app/teacher/TeacherAppointment.controller.js",
                                "scripts/factories/refine/Experiment.factory.js",
                                "scripts/factories/refine/Lab.factory.js",
                                "ngDialog",
                                "scripts/controllers/app/teacher/modal/TeacherReserve.controller.js",
                                "scripts/directives/app/stage-view.directive.js",
                                "scripts/factories/refine/Reservation.factory.js",
                                "scripts/factories/refine/HttpResponse.factory.js",
                            ])
                        }],
                    },
                })
                .state("app.teacher.class.task", {
                    url: "/task",
                    templateUrl: "tpl/app/teacher/task.html",
                    controller: "TeacherTaskController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/factories/StateChain.factory.js",
                                'ngDialog',
                                'NmDatepicker',
                                "scripts/factories/InputValidator.factory.js",
                                "scripts/controllers/app/teacher/TeacherTask.controller.js",
                            ])
                        }],
                    },
                })
                .state("app.teacher.class.task-detail", {
                    url: "/task-detail/:expId",
                    templateUrl: "tpl/app/teacher/task-detail.html",
                    controller: "TeacherTaskDetailController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/factories/StateChain.factory.js",
                                'ngDialog',
                                'NmDatepicker',
                                "scripts/factories/InputValidator.factory.js",
                                "scripts/controllers/app/modal/ExperimentDetail.controller.js",
                                "scripts/controllers/app/teacher/TeacherTaskDetail.controller.js",
                            ])
                        }],
                    },
                })
                .state("app.teacher.class.task-report", {
                    url: "/task-report/:expId",
                    templateUrl: "tpl/app/teacher/task-report.html",
                    controller: "TeacherTaskReportController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/factories/StateChain.factory.js",
                                'ngDialog',
                                'NmDatepicker',
                                "scripts/factories/InputValidator.factory.js",
                                "scripts/controllers/app/teacher/TeacherTaskReport.controller.js",
                            ])
                        }],
                    },
                })
                .state("app.teacher.class.report-result", {
                    url: "/report/result/:expId/:classId/:stuId",
                    templateUrl: "tpl/app/new-report-result.html",
                    controller: "ReportResultController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/ReportResult.controller.js',
                                'scripts/directives/app/graphic-table.js',
                                'scripts/directives/app/lashen-report.js',
                                'scripts/directives/app/yasuo-report.js',
                                'scripts/directives/app/lashen-experiment.js',
                                'scripts/directives/app/yasuo-experiment.js',
                                'scripts/directives/app/nm-report-table.js',
                                'NmDatepicker',
                                'ngDialog',
                                'scripts/controllers/app/modal/ChooseChart.controller.js',
                                "scripts/factories/refine/Clazz.factory.js",
                            ])
                        }],
                    },
                })
                .state("app.teacher.class.student", {
                    url: "/student",
                    templateUrl: "tpl/app/teacher/student.html",
                    controller: "TeacherStudentController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/factories/StateChain.factory.js",
                                'ngDialog',
                                'NmDatepicker',
                                "scripts/factories/InputValidator.factory.js",
                                "scripts/controllers/app/teacher/TeacherStudent.controller.js",
                                "scripts/controllers/app/teacher/modal/TeacherAddStudent.controller.js",
                                "scripts/controllers/app/teacher/modal/UploadStudent.controller.js"
                            ])
                        }],
                    },
                })
                .state("app.student", {
                    url: "^/app/student",
                    templateUrl: "tpl/app/student/index.html",
                    controller: "StudentIndexController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/factories/StateChain.factory.js",
                                'ngDialog',
                                'NmDatepicker',
                                "scripts/factories/InputValidator.factory.js",
                                "scripts/controllers/app/student/StudentIndex.controller.js",
                            ])
                        }],
                    },
                })
                .state("app.student.reservation", {
                    url: "^/app/student/reservation",
                    templateUrl: "tpl/app/student/reservation.html",
                    controller: "StudentReservationController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/student/reservation.controller.js",
                            ])
                        }],
                    },
                })
                .state("app.student.class-selection", {
                    url: "^/app/student/class-selection",
                    templateUrl: "tpl/app/student/class-selection.html",
                    controller: "StudentClassSelectionController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/student/StudentClassSelection.controller.js",
                            ])
                        }],
                    },
                })
                .state("app.student.class-selection.all-class", {
                    url: "^/app/student/class-selection/all-class",
                    templateUrl: "tpl/app/student/all-class.html",
                    controller: "StudentAllClassController",
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/student/StudentAllClass.controller.js",
                            ])
                        }]
                    }
                })
                .state("app.student.class", {
                    url: "/class/:classID",
                    templateUrl: "tpl/app/student/class.html",
                    controller: "StudentClassController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/student/StudentClass.controller.js",
                            ])
                        }],
                        clazz: function($resource, $stateParams, $localStorage) {
                            var apiUrl = base_Url + '/clazz'
                            var classID = $stateParams.classID

                            return $resource(apiUrl + "/:id", null, {
                                    get: {
                                        method: "GET",
                                        headers: {
                                            'x-auth-token': $localStorage.token
                                        },
                                    }
                                }).get({
                                    id: classID,
                                })
                                .$promise
                                .then(function(response) {
                                    return response.data
                                })
                                .catch(function(error) {
                                    throw new Error(error.message)
                                })
                        }
                    },
                })
                .state("app.student.class.main-page", {
                    url: "/main-page",
                    templateUrl: "tpl/app/student/main-page.html",
                    controller: "StudentMainPageController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/student/StudentMainPage.controller.js",
                                "scripts/controllers/app/student/StudentMainPage.controller.js",
                            ])
                        }],
                    },
                })
                .state("app.student.class.task", {
                    url: "/task",
                    templateUrl: "tpl/app/student/task.html",
                    controller: "StudentTaskController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/student/StudentVirtualExperimentDetail.controller.js",
                                "scripts/controllers/app/student/StudentTask.controller.js",
                                "scripts/factories/refine/Clazz.factory.js",
                                "scripts/controllers/app/modal/ExperimentDetail.controller.js",
                                "ngDialog",
                            ])
                        }],
                    },
                })
                .state("app.student.class.file", {
                    url: "/file",
                    templateUrl: "tpl/app/student/file.html",
                    controller: "StudentFileController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/student/StudentFile.controller.js",
                                "ngFileUpload",
                            ])
                        }],
                    },
                })
                .state("app.student.class.report", {
                    url: "/report/:expId/:classId",
                    templateUrl: "tpl/app/new-report.html",
                    controller: "ReportController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/student/Report.controller.js",
                                "scripts/factories/refine/Clazz.factory.js",
                                'scripts/directives/app/graphic-table.js',
                                'scripts/directives/app/lashen-report.js',
                                'scripts/directives/app/yasuo-report.js',
                                'scripts/directives/app/lashen-experiment.js',
                                'scripts/directives/app/yasuo-experiment.js',
                                'scripts/directives/app/nm-report-table.js',
                                'NmDatepicker',
                                'ngDialog',
                                'scripts/controllers/app/modal/ChooseChart.controller.js'
                            ])
                        }],
                    },
                })
                .state("app.student.class.report-result", {
                    url: "/report/result/:expId/:classId/:stuId",
                    templateUrl: "tpl/app/new-report-result.html",
                    controller: "ReportResultController",
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/ReportResult.controller.js',
                                'scripts/directives/app/graphic-table.js',
                                'scripts/directives/app/lashen-report.js',
                                'scripts/directives/app/yasuo-report.js',
                                'scripts/directives/app/lashen-experiment.js',
                                'scripts/directives/app/yasuo-experiment.js',
                                'scripts/directives/app/nm-report-table.js',
                                'NmDatepicker',
                                'ngDialog',
                                'scripts/controllers/app/modal/ChooseChart.controller.js',
                                "scripts/factories/refine/Clazz.factory.js",
                            ])
                        }],
                    },
                })
                .state('app.index.teacher-reservations', {
                    url: '^/app/index/teacher/reservations/:title',
                    templateUrl: 'tpl/app/teacher-reservation.html',
                    controller: 'TeacherReservationCtrl',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/teacher-reservation.js',
                                'scripts/directives/app/pager.js',
                                "scripts/factories/StateChain.factory.js",
                                'ngDialog',
                                'NmDatepicker',
                                'scripts/controllers/app/modal/TeacherReservationModal.controller.js',
                                'scripts/controllers/app/modal/ReservationDetailModal.controller.js',
                                "scripts/factories/InputValidator.factory.js",
                            ]);
                        }]
                    }
                })
                .state('app.index.student-reservations', {
                    url: '^/app/index/student/reservations/:title',
                    templateUrl: 'tpl/app/student-reservation.html',
                    controller: 'StudentReservationCtrl',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/student-reservation.js',
                                'scripts/directives/app/pager.js',
                                'ngDialog',
                                'scripts/controllers/app/modal/ReservationDetailModal.controller.js'
                            ]);
                        }]
                    }
                })
                .state('app.course', {
                    url: '^/app/course',
                    templateUrl: 'tpl/app/course.html',
                    controller: 'AppCourseController',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/app-course.js',
                            ]);
                        }]
                    }
                })
                .state('app.course.student-class', {
                    url: '^/app/course/student/class/:id',
                    templateUrl: 'tpl/app/student-class.html',
                    controller: 'StudentClassCtrl',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/student-class.js',
                            ]);
                        }]
                    }
                })
                .state('app.course.teacher-class', {
                    url: '^/app/course/teacher/class/:id/:expId',
                    templateUrl: 'tpl/app/teacher-class.html',
                    controller: 'TeacherClassCtrl',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/teacher-class.js',
                                'scripts/directives/app/pager.js',
                                'scripts/directives/app/nm-file-upload.js',
                                'scripts/controllers/app/modal/FileUpload.controller.js',
                                'ngDialog'
                            ]);
                        }]
                    }
                })
                .state('app.course.report', {
                    url: '^/app/course/report/:expId/:classId',
                    templateUrl: 'tpl/app/new-report.html',
                    controller: 'ReportController',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/report.js',
                                'scripts/directives/app/graphic-table.js',
                                'scripts/directives/app/lashen-report.js',
                                'scripts/directives/app/yasuo-report.js',
                                'scripts/directives/app/lashen-experiment.js',
                                'scripts/directives/app/yasuo-experiment.js',
                                'scripts/directives/app/nm-report-table.js',
                                'NmDatepicker',
                                'ngDialog',
                                'scripts/controllers/app/modal/ChooseChart.controller.js'
                            ]);
                        }]
                    }
                })
                .state('app.course.report-result', {
                    url: '^/app/course/report/result/:expId/:classId/:stuId',
                    templateUrl: 'tpl/app/new-report-result.html',
                    controller: 'ReportResultController',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/ReportResult.controller.js',
                                'scripts/directives/app/graphic-table.js',
                                'scripts/directives/app/lashen-report.js',
                                'scripts/directives/app/yasuo-report.js',
                                'scripts/directives/app/lashen-experiment.js',
                                'scripts/directives/app/yasuo-experiment.js',
                                'scripts/directives/app/nm-report-table.js',
                                'NmDatepicker',
                                'ngDialog',
                                'scripts/controllers/app/modal/ChooseChart.controller.js'
                            ]);
                        }]
                    }
                })
                .state('app.profile', {
                    url: '^/app/profile',
                    templateUrl: 'tpl/app/profile.html',
                    controller: ['$state', function($state) {
                        $state.go('app.profile.person');
                    }]
                })
                .state('app.profile.person', {
                    url: '^/app/profile/person',
                    templateUrl: 'tpl/app/profile-person.html',
                    controller: 'ProfilePersonController',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'ngDialog',
                                'ngImgCrop',
                                'scripts/controllers/app/ProfilePerson.controller.js',
                                'scripts/controllers/app/modal/ProfileIcon.controller.js',
                                'scripts/factories/FileUpload.factory.js'
                            ]);
                        }]
                    }
                })
                .state('app.profile.password', {
                    url: '^/app/profile/password',
                    templateUrl: 'tpl/app/profile-password.html',
                    controller: 'ProfilePasswordController',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/ProfilePassword.controller.js'
                            ]);
                        }]
                    }
                })
                .state('app.message', {
                    url: '^/app/message',
                    templateUrl: 'tpl/app/message.html',
                    resolve: {}
                })
                .state('app.message.list', {
                    url: '^/app/message/list?isRead',
                    templateUrl: 'tpl/app/message-list.html',
                    controller: 'MessageListController',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'scripts/controllers/app/MessageList.controller.js'
                            ]);
                        }]
                    }
                })
                .state('app.calendar', {
                    url: '^/app/calendar',
                    templateUrl: 'tpl/app/calendar.html',
                    controller: 'PortalCalendarController',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lib/jquery/fullcalendar/fullcalendar.css',
                                'lib/jquery/fullcalendar/theme.css',
                                'lib/jquery/jquery-ui-1.10.3.custom.min.js',
                                'lib/libs/moment.min.js',
                                'lib/jquery/fullcalendar/fullcalendar.min.js',
                                'ui.calendar',
                                'ngDialog',
                                'NmDatepicker',
                                'scripts/controllers/app/modal/TeacherReservationModal.controller.js',
                                'scripts/controllers/portal/PortalCalendar.controller.js',
                            ]);
                        }]
                    }
                })

            //管理员界面
            .state('app.admin-account', {
                    url: '^/app/admin/account',
                    templateUrl: 'tpl/app/admin/account-index.html',
                    controller: ['$state', function($state) {
                        var currState = $state.current.name;
                        if (currState === "app.admin-account") {
                            $state.go('app.admin-account.teacher');
                        }
                    }],
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/directives/app/search-action-bar.js",
                                "ngDialog",
                            ])
                        }]
                    }
                })
                .state('app.admin-account.teacher', { //教师列表
                    url: '^/app/admin/account/teacher',
                    templateUrl: 'tpl/app/admin/teacher-account.html',
                    controller: "TeacherManagementController",
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/admin/TeacherManagement.controller.js",
                                "scripts/controllers/app/admin/modal/AddTeacher.controller.js",
                                "scripts/controllers/app/admin/modal/ModifyTeacher.controller.js",
                            ])
                        }]
                    }
                })
                .state('app.admin-account.student', { //学生列表
                    url: '^/app/admin/account/student',
                    templateUrl: 'tpl/app/admin/student-account.html',
                    controller: "StudentManagementController",
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/admin/StudentManagement.controller.js",
                                "scripts/controllers/app/admin/modal/AddStudent.controller.js",
                                "scripts/controllers/app/admin/modal/ModifyStudent.controller.js",
                            ])
                        }]
                    }
                })
                .state('app.admin-resource', { //实验资源管理
                    url: '^/app/admin/resource',
                    templateUrl: 'tpl/app/admin/experiment-index.html',
                    controller: ['$state', function($state) {
                        var currState = $state.current.name;
                        if (currState === "app.admin-resource") {
                            $state.go('app.admin-resource.lab');
                        }
                    }],
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "ngDialog",
                            ])
                        }]
                    }
                })
                .state('app.admin-resource.lab', { //实验室
                    url: '^/app/admin/resource/lab',
                    templateUrl: 'tpl/app/admin/experiment-lab.html',
                    controller: "LabManagementController",
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/admin/LabManagement.controller.js",
                                "scripts/controllers/app/admin/modal/AddLab.controller.js",
                                "scripts/controllers/app/admin/modal/ModifyLab.controller.js",
                                "scripts/directives/app/search-action-bar.js"
                            ])
                        }]
                    }
                })
                .state('app.admin-resource.experiment', { //实验
                    url: '^/app/admin/resource/experiment',
                    templateUrl: 'tpl/app/admin/experiment.html',
                    controller: "ExperimentManagementController",
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/admin/ExperimentManagement.controller.js",
                                "scripts/controllers/app/admin/modal/AddExperiment.controller.js",
                                "scripts/controllers/app/admin/modal/ModifyExperiment.controller.js",
                                "scripts/controllers/app/admin/modal/ConfigExperimentLab.controller.js",
                                "angularBootstrapNavTree",
                                'scripts/directives/app/nm-configure-list.js',
                                "scripts/directives/app/search-action-bar.js"
                            ])
                        }]
                    }
                })
                .state('app.admin-resource.course', { //课程
                    url: '^/app/admin/resource/course',
                    templateUrl: 'tpl/app/admin/experiment-course.html',
                    controller: "CourseManagementController",
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/admin/CourseManagement.controller.js",
                                "scripts/controllers/app/admin/modal/AddCourse.controller.js",
                                "scripts/controllers/app/admin/modal/ModifyCourse.controller.js",
                                "scripts/controllers/app/admin/modal/ConfigCourseExperiment.controller.js",
                                "angularBootstrapNavTree",
                                'scripts/directives/app/nm-configure-list.js',
                                "scripts/controllers/app/admin/modal/ModifyCourseInfo.controller.js",
                                "scripts/directives/app/search-action-bar.js",
                                "ngFileUpload"
                            ])
                        }]
                    }
                })
                .state('app.admin-semester', { //学期配置
                    url: '^/app/admin/semester',
                    templateUrl: "tpl/app/admin/semester-class.html",
                    controller: ['$state', function($state) {
                        var currState = $state.current.name;
                        if (currState === "app.admin-semester") {
                            $state.go('app.admin-semester.class');
                        }
                    }],
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/directives/app/nm-datepicker.js",
                                "ngDialog",
                            ])
                        }]
                    }
                })
                .state('app.admin-semester.semester', {
                    url: '^/app/admin/semester/semester',
                    templateUrl: "tpl/app/admin/semester-management.html",
                    controller: "SemesterManagementController",
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/admin/SemesterManagement.controller.js",
                                "scripts/controllers/app/admin/modal/AddSemester.controller.js"
                            ])
                        }]
                    }
                })
                .state('app.admin-semester.class', {
                    url: '^/app/admin/semester/class',
                    templateUrl: "tpl/app/admin/class-management.html",
                    controller: "ClassManagementController",
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/admin/ClassManagement.controller.js",
                                "scripts/controllers/app/admin/modal/AddClass.controller.js",
                                "scripts/controllers/app/admin/modal/ModifyClass.controller.js"
                            ])
                        }]
                    }
                })
                .state('app.admin-appointment', { //预约审批
                    url: '^/app/admin/appointment',
                    templateUrl: "tpl/app/admin/appointment-verification.html",
                    controller: ['$state', function($state) {
                        $state.go('app.admin-appointment.list', {
                            'status': 'unverified'
                        });
                    }],
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "ngDialog",
                            ])
                        }]
                    }
                })
                .state('app.admin-appointment.list', {
                    url: "^/app/admin/appointment/:status",
                    templateUrl: "tpl/app/admin/experiment-appointment.html",
                    controller: "ReservationManagementController",
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/admin/ReservationManagement.controller.js",
                                "scripts/controllers/app/admin/modal/VerifyReservation.controllers.js",
                                "scripts/controllers/app/admin/modal/ViewReservation.controller.js",
                                "scripts/controllers/app/admin/modal/ViewAndEditReservation.controller.js",
                                'scripts/directives/app/nm-configure-list.js',
                                "angularBootstrapNavTree",
                                "scripts/controllers/app/admin/modal/ModifyAppointmentDate.controller.js",
                                "scripts/factories/StateChain.factory.js",
                                "scripts/directives/app/stage-view.directive.js",
                                'NmDatepicker',
                                "scripts/factories/refine/Lab.factory.js",

                            ])
                        }]
                    }
                })
                .state('app.admin-appointment.student', {
                    url: "^/app/admin/student/appointment",
                    templateUrl: "tpl/app/admin/experiment-student-appointment.html",
                    controller: "ReservationStudentManagementController",
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/admin/ReservationStudentManagement.controller.js",
                                "scripts/controllers/app/admin/modal/VerifyReservation.controllers.js",
                                "scripts/controllers/app/admin/modal/ViewReservation.controller.js",
                                "scripts/controllers/app/admin/modal/ViewAndEditReservation.controller.js",
                                "scripts/controllers/app/admin/modal/AddStudentReservation.controller.js",
                                "scripts/directives/app/nm-configure-list.js",
                                "angularBootstrapNavTree",
                                "scripts/controllers/app/admin/modal/ModifyAppointmentDate.controller.js",
                                "scripts/factories/StateChain.factory.js",
                                "scripts/directives/app/stage-view.directive.js",
                                'NmDatepicker',
                                "scripts/directives/app/stage-view.directive.js",
                                "scripts/factories/refine/Lab.factory.js",
                            ])
                        }]
                    }
                })
                .state('app.admin-setting', { //系统设置
                    url: '^/app/admin/setting',
                    templateUrl: "tpl/app/admin/system-setting.html",
                    controller: ['$state', function($state) {
                        $state.go('app.admin-setting.sms');
                    }],
                    resolve: {
                        controller: ["$ocLazyLoad", function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "ngDialog",
                            ])
                        }]
                    }
                })
                .state('app.admin-setting.sms', { //短信息设置
                    url: '^/app/admin/setting/sms',
                    templateUrl: "tpl/app/admin/sms-setting.html",
                    controller: 'SmsSettingController',
                    resolve: {
                        controller: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                "scripts/controllers/app/admin/SmsSetting.controller.js",
                                'scripts/controllers/app/admin/modal/ConfigSmsSetting.controller.js',
                                'ngDialog',
                                'nmDatepickerRange'
                            ]);
                        }]
                    }
                });
        }
    ])
    .run();
