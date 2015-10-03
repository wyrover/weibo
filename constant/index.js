/**
 * Created by Tink on 2015/9/19.
 */
module.exports = {
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
        UpPost              : '赞', //
        UpComment           : '赞',
        Comment             : '评论', //
        Reply               : '回复',
        Repost              : '转发'
    },

    //logOrder: {
    //    Actor_Verb_Res      : 1, // 我发布了一条新post
    //    Actor_Verb_Recipient: 2, // xx关注了我
    //    Actor_Recipient_Verb_Res: 3, // xx给我发了一条私信
    //    Actor_Field_Verb_Res: 4, // xx在专栏发布了一篇文章
    //    Actor_Verb_Recipient_Field_Res: 5 // xx回复了我在某条post下的某条评论
    //},

    errLog: {
        DbErr               : '数据库出错',
        DbNotFound          : '数据未找到',
        AlreadyExists       : '数据已存在',
        ReqArgumentIsUnvalid: '请求参数有误'
    }
}