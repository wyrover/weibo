/**
 * Created by Tink on 2015/9/21.
 */
'use strict';

angular.module('app').factory('constant' ,function(){
    return {
        roleType: {
            Admin               : '管理员', // 管理员
            Normal              : '一般用户', // 一般用户
            Blocked             : '被屏蔽用户', // 被屏蔽用户
            Unchecked           : '未审核用户', // 未审核用户
        },

        permissionAction: {
            READ_ONLY       : 1, // 只读
            CREATE          : 2, // 创建(并可以查看)
            UPDATE          : 3, // 更新(并可以查看)
            DELETE          : 4, // 删除(并可以查看)
            ALL             : 5, // 全部
        },

        notificationStatus: {
            New                 : 1, // 未读消息
            Old                 : 2, // 已读消息
            Deleted             : 3, // 已删除
        },

        logVerb: {
            Follow              : '关注', // xx关注了你
            SendMessage         : '私信', // xx给你发了一条新消息
            UpPost              : '赞', //
            UpComment           : '赞',
            Comment             : '评论', //
            Reply               : '回复',
            Repost              : '转发'
        },

        errLog: {
            DbErr               : '数据库出错',
            DbNotFound          : '数据未找到',
            AlreadyExists       : '数据已存在',
            ReqArgumentIsUnvalid: '请求参数有误'
        }

    }
});