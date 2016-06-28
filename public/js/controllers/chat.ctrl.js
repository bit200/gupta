
var XYZCtrls = angular.module('XYZCtrls');
XYZCtrls.controller('chatCtrl', ['$scope', '$location', '$http', '$routeParams', 'parseRating',  function (scope, location, http, routeParams, parseRating) {


    scope.chatspace={
        jobId:0,
        currentUser:1,
        loadComplete:false,
        messages:scope.messages1,
        errorSend:false,
        submitted:false
    };
    scope.ChatRoom=[
        {
            name:'Chat1',
            buyer:100001,
            seller:100000,
            job:100099,
            messages:[],
            unreadMessages:{
                status:false,
                date:''
            },
            created_at:Date.now
        },
        {
            name:'Chat2',
            buyer:100001,
            seller:100000,
            job:100098,
            messages:[],
            unreadMessages:{
                status:false,
                date:''
            },
            created_at:Date.now
        }
    ];



    //scope.msg= [
    //    { messages:[
    //        {sender:'1',message:'OnePerson', time:12},
    //        {sender:'2',message:'TwoPerson', time:12},
    //        {sender:'2',message:'TwoPerson', time:12},
    //        {sender:'2',message:'TwoPerson', time:12},
    //        {sender:'2',message:'TwoPerson', time:12},
    //        {sender:'2',message:'TwoPerson', time:12},
    //        {sender:'2',message:'TwoPerson', time:12},
    //        {sender:'2',message:'TwoPerson', time:12},
    //        {sender:'2',message:'TwoPerson', time:12},
    //        {sender:'2',message:'TwoPerson', time:12},
    //        {sender:'1',message:'TherePerson', time:12}]
    //    }
    //];

    scope.msg=[];
    scope.chatUser=[];
    scope.Jobs=[];

    http.get('/api/jobs/all','').then(function(resp){
        if(resp.data.success){
            scope.Jobs=resp.data.data;
        }
            console.log(resp);
    }, function (err, r) {
        scope.chatspace.errorSend=true;
        console.log(err,'9*+++');
    });

    scope.selectJob=function(jobId){
        console.log('sads',jobId);
        console.log(scope.ChatRoom);
        localStorage.setItem('chatJob',scope.ChatRoom[jobId].job);
        localStorage.setItem('chatUser',scope.ChatRoom[jobId].seller);
        scope.chatspace.jobId=jobId;
        if (scope.msg[jobId-1])
        {
            console.log(scope.msg[jobId-1].messages[0]);
            scope.chatspace.messages=scope.msg[jobId-1].messages;
        }
        else
            scope.chatspace.messages=[];
    };

    scope.sendMess= function(message,invalid){
        if(invalid)
            return;
        scope.chatspace.submitted=false;
        var messageParams={
            room: scope.chatspace.jobId,
            job: scope.ChatRoom[scope.chatspace.jobId].job,
            from: scope.ChatRoom[scope.chatspace.jobId].seller,
            to: scope.ChatRoom[scope.chatspace.jobId].buyer,
            message:message
        };
        http.post('/chatMessage', messageParams).then(function (resp) {
            console.log(resp);
            message='';
            scope.msg.push();
            var getMsg=resp.data.data;
            Date.parse(data.data.created_at)
            var diff = Math.abs(new Date('2011/10/09 12:00') - new Date('2011/10/09 00:00'));
            var minutes = Math.floor((diff/1000)/60);
            if (minutes>=1440)
                getMsg.created_at='Yesterday';
            else if (minutes >= 60)
                getMsg.created_at=minutes/60+'hour ago';
            else
                getMsg.created_at=minutes+'min ago';
        }, function (err, r) {
            scope.chatspace.errorSend=true;
            console.log(err,'9*+++');
        })
    };

    if(localStorage.getItem('chatJob'))
    {
        var job=localStorage.getItem('chatJob'),
            seller=localStorage.getItem('chatUser');
        console.log('j',job,'s',seller);
        scope.ChatRoom.forEach(function(chat,index){
            if((chat.job==job)&&(chat.seller==seller))
            {
                scope.chatspace.jobId=index;
                scope.selectJob(index);
            }
        })
    }

}]);