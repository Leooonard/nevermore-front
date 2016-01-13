'use strict';

/**
 * 班级相关 api
 */
angular.module('nevermore')
  .factory('Clazz', function($resource, sessionService, $rootScope) {
    var baseUrl = base_Url+'/api/clazz';
    var headers = sessionService.headers();
    //var headers = {'x-auth-token': $rootScope.token};
    return {
      create: function(){
        return $resource(baseUrl, {}, {
          'post': {
            method: 'POST',
            headers: sessionService.headers()
          }
        });
      },
      clazz: function(){
        return $resource(baseUrl + '/:id', {id:"@id"}, {
          'get': {
            method: 'GET',
            headers: sessionService.headers()
          },
          'put': {
            method: 'PUT',
            headers: sessionService.headers()
          },
          'delete': {
            method: 'DELETE',
            headers: sessionService.headers()
          }
        });
      },
      page: function() { //分页获取用户
        return $resource(baseUrl + '/list/page/:pageSize/:pageNumber', {
          pageSize: "@pageSize",
          pageNumber: "@pageNumber"
        }, {
          'get': {
            method: 'GET',
            headers: sessionService.headers()
          }
        });
      }
    };

  });
