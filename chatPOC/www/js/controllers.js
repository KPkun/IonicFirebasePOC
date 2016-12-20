angular.module('starter.controllers', ['firebase'])


.controller('LoginCtrl', function($scope, $ionicModal, $state, $firebaseAuth){
  console.log("At login page");
  
  $scope.login = function(){  
 
  //var ref = new Firebase("https://ionicfirebasepoc.firebaseio.com");
  
  // See https://firebase.google.com/docs/web/setup#project_setup for how to
  // auto-generate this config
  var config = {
    apiKey: "AIzaSyCnwI0s5yEbQhqy3wxrUd_rNv9wNNGOZ-k",
    authDomain: "ionicfirebasepoc.firebaseapp.com",
    databaseURL: "https://ionicfirebasepoc.firebaseio.com",
    storageBucket: "ionicfirebasepoc.appspot.com",
    messagingSenderId: "897565733875"
  };
  
  firebase.initializeApp(config);

  var rootRef = firebase.database().ref();
  
  var authObject=firebaseAuth(rootRef);
  
  $scope.authObj.$authWithOAuthPopup("google").then(function(authData) {
    console.log("Logged in as:", authData.uid);
  }).catch(function(error) {
    console.error("Authentication failed:", error);
  });
 
};
  
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
}).then(function (modal) {
    $scope.modal = modal;
});

$scope.createUser = function (user) {

}

$scope.signIn = function () {
    $state.go('tab.rooms');
}
  
})



.controller('DashCtrl', function($scope) {})

.controller('RoomsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('RoomChatCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('InfoCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
