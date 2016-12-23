angular.module('starter.controllers', ['firebase'])


.controller('LandingCtrl', function($scope, $rootScope){
  console.log("At landing page");
  
  $rootScope.firebaseApp.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      $rootScope.user = user;
      console.log("Auth state changed Logged in");
      $state.go('tab.dash');
    } else {
      // No user is signed in.
      $rootScope.user=null;
      console.log("Auth state changed Logged out");
      $state.go('landing');
    }
  });

})

.controller('SigninCtrl', function($rootScope, $scope, $ionicModal, $state){
  console.log("At login page");
  
  $scope.login = function(){
      
      $rootScope.firebaseApp.auth().signInWithRedirect($rootScope.facebookProvider).then(function(result) {

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // Printing errors
        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
      });
      
    }
})


.controller('SignupCtrl', function($rootScope, $scope, $ionicModal, $state, $firebaseAuth){
  console.log("At login page");
  
})

.controller('DashCtrl', function($scope, $rootScope) {
  $scope.logout = function(){
    $rootScope.firebaseApp.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  }
})

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
