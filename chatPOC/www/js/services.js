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
});
