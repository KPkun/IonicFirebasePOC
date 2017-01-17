angular.module('starter.services', ['ionic.cloud'])

.factory('Rooms', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var rooms = [{
    id: 0,
    name: 'Reservations',
    lastText: 'Want to book hotels? restaurants?',
    logo: 'img/reservation.png'
  }, {
    id: 1,
    name: 'Tickets',
    lastText: 'Need tickets for shows? events?',
    logo: 'img/tickets.png'
  }, {
    id: 2,
    name: 'Transport',
    lastText: 'Any questions regarding moving around in Japan',
    logo: 'img/transport.png'
  }, {
    id: 3,
    name: 'Places',
    lastText: 'We can suggest you the best places to visit',
    logo: 'img/places.jpg'
  }, {
    id: 4,
    name: 'Others',
    lastText: 'Any special requests?',
    logo: 'img/others.png'
  }];

  return {
    all: function() {
      return rooms;
    },
    remove: function(room) {
      rooms.splice(rooms.indexOf(room), 1);
    },
    get: function(roomId) {
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id === parseInt(roomId)) {
          return rooms[i];
        }
      }
      return null;
    },
    write: function(Obj){
      rooms = JSON.stringify(Obj);
      // JSON.stringify(rooms);
      console.log("writing new rooms");
      for(room in rooms){
        console.log(room.text);
      }
    }
  };
})

.factory('LocalChatMessages', function(){

  localChatsObj = {};

  return{
    write: function(Obj){
      localChatsObj = Obj;
    },
    all: function(){
      return localChatsObj;
    }
  }
})

.factory('ChatMessages', function($rootScope) {

  var queryChatMessages = $rootScope.database.ref('nameless_messages/'+$rootScope.user_uuid);
	return {
    all: function(){
      queryChatMessages.on('value',function(snapshot){
        var chats = snapshot.val();
        console.log("inside service");
        console.log(chats);
        return chats;
      });
    },
    once: function(){
      queryChatMessages.once('value').then(function(snapshot){
        var chats = snapshot.val();
        console.log(chats);
        return chats;
      });
    }
  // $rootScope.chats;
  };
})


.factory('iFramelyResult', function($http) {
	return {
    getResponse: function(message){
      var iFramelyRequestURL = "http://iframe.ly/api/oembed?url="+message+"&api_key=31d4151b543e7f5df7c092";
      // return "something";
      var returnThingy = "";
      $http({
        method: 'GET',
        url: iFramelyRequestURL
      }).then(function mySuccess(){
        console.log("http");
        returnThingy = "http";
      });
      // return returnThingy;
      // .then(function successCallback(response) {
      //     // this callback will be called asynchronously
      //     // when the response is available
      //     // $scope.posts = response.data;
      //     console.log("iFramely API response success!");
      //     console.log(response.data);
      //     return "true";
      //   }, function errorCallback(response) {
      //     // called asynchronously if an error occurs
      //     // or server returns response with an error status.
      //     console.log("iFramely API response FAIL!");
      //     console.log(response);
      //     return "false"
      //   });
    }
  };
});
