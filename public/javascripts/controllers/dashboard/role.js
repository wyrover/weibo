/**
 * Created by Tink on 2015/10/3.
 */


'use strict';

angular.module('app').controller('roleCtrl', function($scope, roleService, permissionService, weiboUtils, constant){

    /*              models
     -------------------------------------*/
    $scope.roles = [];
    $scope.permissions = [];
    $scope.currentRole = {};

    //-----inputs
    $scope.roleInputs = {
        roleType : '',
    }
    $scope.permissionInputs = {
        resource: '',
        action: '只读',
        desc: ''
    }
    $scope.addPermissionInputs = {
        resource: '',
        action: '',
    }
    $scope.editInputArr = [];

    //-----flags
    $scope.flags2ShowPanels = [];
    $scope.flag2ShowCreateRolePanel = false;
    $scope.flag2ShowCreatePermissionPanel = false;
    $scope.flag2ShowAddPermissionPanel = false;
    $scope.flag2ShowPanel = function(id){
        return $scope.flags2ShowPanels.some(function(f){
            return f == id
        })
    }
    //----constant
    $scope.actions = ['只读', '可创建', '可编辑', '可删除', '皆可'];




    /*              methods
     -------------------------------------*/

    $scope.setCurrentRole = function(id){
        $scope.currentRole = weiboUtils.findOneAndIndexWithProp($scope.roles, '_id', id).element;
    }

    //------------request

    //-----role

    $scope.createRole = function(){
        if($scope.roleInputs.roleType.trim() === ''){
            alert('角色名不得为空');
        }
        var reqData = {
            roleType: $scope.roleInputs.roleType
        }
        roleService.create(reqData).success(function(res){
            if(res.data){
                $scope.roles.push(res.data);
                $scope.roleInputs.roleType = '';
                $scope.flag2ShowCreateRolePanel = false;
            }else{
                alert('新建失败');
            }
        });
    }

    $scope.changeRoleName = function(id, oldType){
        var newType = $scope.editInputArr[id];
        if(typeof newType !== 'undefined'){
            var reqData = {
                roleType: oldType,
                newType: newType
            }
            roleService.changeName(reqData).success(function(res){
                if(res.data){
                    weiboUtils.updateOneWithProp($scope.roles, '_id', res.data._id, 'type', res.data.type);
                    $scope.pushSwitch4Panel(id);
                    delete $scope.editInputArr[id];
                }
            })
        }

    }

    $scope.deleteRole = function(type){
        var reqData = {
            roleType: type
        }
        roleService.delete(reqData).success(function(res){
            if(res.data === true){
                $scope.roles.splice(weiboUtils.findOneAndIndexWithProp($scope.roles, 'type', type).index, 1);
            }else{
                alert('删除失败');
            }
        })
    }

    $scope.getRoles = function(){
        roleService.getAll().success(function(res){
            console.log(res);
            $scope.roles = res.data;
            $scope.currentRole = $scope.roles[0];
        })
    }

    // todo 改成loadPermission
    $scope.addPermission = function(){
        var reqData = {
            resource: $scope.addPermissionInputs.resource,
            action: $scope.addPermissionInputs.action,
            roleType: $scope.currentRole.type
        }
        roleService.addPermission(reqData).success(function(res){
            console.log(res);
            $scope.currentRole = res.data;
            $scope.pushSwitch4AddPermissionPanel();
            $scope.addPermissionInputs = {
                resource: '',
                action: '',
            }
        })

    }

    $scope.unloadPermission = function(){

    }


    //-----permission
    $scope.createPermission = function(){
        if($scope.permissionInputs.resource.trim() === ''){
            alert('资源名不得为空');
        }
        var reqData = {
            resource: $scope.permissionInputs.resource,
            action: $scope.permissionInputs.action,
            desc: $scope.permissionInputs.desc
        }
        permissionService.create(reqData).success(function(res){
            if(res.data){
                $scope.permissions.push(res.data);
                $scope.permissionInputs = {
                    resource: '',
                    action: '只读',
                    desc: ''
                };
                $scope.flag2ShowCreatePermissionPanel = false;
            }else{
                alert('新建失败');
            }
        });
    }

    $scope.deletePermission = function(resource, action, id){
        var  reqData = {
            resource: resource,
            action: action
        }
        permissionService.delete(reqData).success(function(res){
            if(res.data === true){
                $scope.permissions.splice(weiboUtils.findOneAndIndexWithProp($scope.permissions, '_id', id).index, 1);
            }else{
                alert('删除失败');
            }
        })
    }

    $scope.getSameResourcePermissions = function(resource){
        var permission = weiboUtils.findListAndIndexesWithProp($scope.permissions, 'resource', resource);
        if(permission){
            return weiboUtils.findListAndIndexesWithProp($scope.permissions, 'resource', resource).elements;
        }
        return [{action: '无'}]
    }

    $scope.getPermissions = function(){
        permissionService.getAll().success(function(res){
            $scope.permissions = res.data;
        })

    }

    //------------about ng-if methods

    $scope.pushSwitch4CreateRolePanel = function(){
        $scope.flag2ShowCreateRolePanel = !$scope.flag2ShowCreateRolePanel;
    }

    $scope.pushSwitch4CreatePermissionPanel = function(){
        $scope.flag2ShowCreatePermissionPanel = !$scope.flag2ShowCreatePermissionPanel;
    }

    $scope.pushSwitch4AddPermissionPanel = function(){
        $scope.flag2ShowAddPermissionPanel = !$scope.flag2ShowAddPermissionPanel;
    }

    $scope.pushSwitch4Panel = function(id){
        var flag = weiboUtils.findOneAndIndex($scope.flags2ShowPanels, id);
        if(flag){
            $scope.flags2ShowPanels.splice(flag.index, 1);
        }else{
            $scope.flags2ShowPanels.push(id);

        }
    }

    $scope.promptHereIsNoting = function(arr){
        return arr.length === 0;
    }


    //------------init
    $scope.init = function(){
        $scope.getRoles();
        $scope.getPermissions();
    }();

});