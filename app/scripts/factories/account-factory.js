'use strict';

/**
 * @ngdoc service
 * @name labcloud.account
 * @description
 * # account
 * Factory in the labcloud.
 */
angular.module('nevermore')
  .factory('Account', function($resource, sessionService, $rootScope) {
    var baseUrl = base_Url+'/account';
    var headers = sessionService.headers();
    return {
      removeClazzStudent: function(){
        return $resource(baseUrl + '/class/:clazzId/st/:studentId',
          {
            clazzId: "@clazzId",
            studentId: "@studentId"
          },
          {
            'delete': {
              method: 'DELETE',
              headers: sessionService.headers()
            }
        });
      },
      addStudentToClazz: function(){
        return $resource(baseUrl + '/class/:classId/st',
          {
            classId: "@classId"
          },
          {
            'post': {
              method: 'POST',
              headers: sessionService.headers()
            }
        });
      },
      clearClazzStudent: function(){
        return $resource(baseUrl + '/class/:classId/st/clear',
          {
            classId: "@classId"
          },
          {
             'delete': {
              method: 'DELETE',
              headers: sessionService.headers()
              }
          });
      },
      accountIcon: function() {
        return $resource(baseUrl + '/icon/:attachId',
          {
            attachId: "@attachId"
          },
          {
            'put': {
              method: 'PUT',
              headers: sessionService.headers()
            }
          })
      },
      uploadIcon: function() {
        return $resource(baseUrl + '/icon',
          {},
          {
            'post': {
              method: 'POST',
              headers: sessionService.headers()
            }
          })
      },
      profile: function() {
        return $resource(baseUrl + '/profile', {},
          {
            'get': {
              method: 'GET',
              headers: sessionService.headers()
            },
            'put': {
              method: 'PUT',
              headers: sessionService.headers()
            }
          });
      },
      search: function(){
        return $resource(baseUrl + '/searchByNameAndNumber',
          {

          },
          {
            'get':{
              method: 'GET',
              headers: sessionService.headers()
            }
          });
      },
      password: function(){
        return $resource(baseUrl + '/password', {},
          {
            'put':{
              method: 'PUT',
              headers: sessionService.headers()
            }
          });
      },
      passwordByAdmin: function(){
        return $resource(baseUrl + '/:id/passwordByAdmin',
          {
            id:"@id"
          },
          {
            'put':{
              method: 'PUT',
              headers: sessionService.headers()
            }
          });
      },
      create: function() {
        return $resource(baseUrl,
          {

          },
          {
            'post': {
              method: 'POST',
              headers: sessionService.headers()
            }
          })
      },
      all: function() {
        return $resource(baseUrl + '/list/all',
          {

          },
          {
            'get': {
              method: 'GET',
              headers: sessionService.headers()
            }
          });
      },
      page: function() {//分页获取用户
        return $resource(baseUrl + '/list/page/:pageSize/:pageNumber',
          {
            pageSize: "@pageSize",
            pageNumber: "@pageNumber"
          },
          {
            'get': {
              method: 'GET',
              headers: sessionService.headers()
            }
          });
      }
    };
  });
