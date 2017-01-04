angular.module('starter.services', ['ionic.cloud'])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Reservations',
    lastText: 'Want to book hotels? restaurants?',
    face: 'img/reservation.png'
  }, {
    id: 1,
    name: 'Tickets',
    lastText: 'Need tickets for shows? events?',
    face: 'img/tickets.png'
  }, {
    id: 2,
    name: 'Transport',
    lastText: 'Any questions regarding moving around in Japan',
    face: 'img/transport.png'
  }, {
    id: 3,
    name: 'Places',
    lastText: 'We can suggest you the best places to visit',
    face: 'img/places.jpg'
  }, {
    id: 4,
    name: 'Others',
    lastText: 'Any special requests?',
    face: 'img/others.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
