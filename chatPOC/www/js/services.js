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
    }
  };
})


.factory('ChatMessages', function($rootScope) {

  var queryChatMessages = $rootScope.database.ref('nameless_messages/'+$rootScope.user_uuid);
  // queryChatMessages.on('value',function(snapshot){
  //   $rootScope.chats = snapshot.val();
  //   console.log("inside service");
  //   console.log($rootScope.chats);
  //   return $rootScope.chats;
  // });
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


.factory('WpApi', function() {
	return {
    getChats: function(x){
      return x;
    }
  };
});
