/**
 * Created by Tink on 2015/9/21.
 */
'use strict';

angular.module('app').factory('userData' ,function($http){
    return {
        roleType: {
            Admin               : 'Admin', // 管理员
            Normal              : 'Normal', // 一般用户
            Blocked             : 'Blocked', // 被屏蔽用户
            Unchecked           : 'Unchecked', // 未审核用户
        },

        notificationStatus: {
            New                 : 1, // 未读消息
            Old                 : 2, // 已读消息
            Deleted             : 3, // 已删除
        },

        logVerb: {
            Follow              : '关注', // xx关注了你
            SendMessage         : '私信', // xx给你发了一条新消息
            Up                  : '赞', //
            Reply               : '回复', //
        },

        logOrder: {
            Actor_Verb_Res      : 1, // 我发布了一条新post
            Actor_Verb_Recipient: 2, // xx关注了我
            Actor_Recipient_Verb_Res: 3, // xx给我发了一条私信
            Actor_Field_Verb_Res: 4, // 我在专栏发布了一篇文章
            Actor_Verb_Recipient_Field_Res: 5 // xx回复了我在某条post下的某条评论
        },

        errLog: {
            DbErr               : 1,
            DbNotFound          : 2,
            AlreadyExists       : 3,
            ReqArgumentIsUnvalid: 4,
            ButItDoesntExist    : 5,
        }
    }
});