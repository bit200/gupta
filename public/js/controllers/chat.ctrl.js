
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

    scope.msg= [
        { messages:[
            {sender:'1',message:'OnePerson', time:12},
            {sender:'2',message:'TwoPerson', time:12},
            {sender:'1',message:'TherePerson', time:12}]
        },
        { messages:[
            {sender:'2',message:'OnePerson', time:21},
            {sender:'1',message:'TwoPerson', time:22},
            {sender:'2',message:'TherePerson', time:23}]
        }
    ];
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
        scope.chatspace.jobId=jobId;
        if (scope.msg[jobId-1])
        {
            console.log(scope.msg[jobId-1].messages[0]);
            scope.chatspace.messages=scope.msg[jobId-1].messages;
        }
        else
            scope.chatspace.messages=[{message:'Start Conversation'}]
    };

    scope.sendMess= function(message,invalid){
        if(invalid)
            return;
        scope.chatspace.submitted=false;
        http.post('/chat/'+scope.chatspace.jobId+'/'+scope.chatspace.currentUser, message).then(function (resp) {

        }, function (err, r) {
            scope.chatspace.errorSend=true;
            console.log(err,'9*+++');
        })
    }



}]);