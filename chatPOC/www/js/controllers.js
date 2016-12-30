angular.module('starter.controllers', ['ionic.cloud'])

.controller('LandingCtrl', function($scope, $rootScope, $state, $ionicAuth, $ionicUser){
  console.log("At landing page");
  if($ionicAuth.isAuthenticated()){
    console.log("Checked smartly! Already logged in!");
    $rootScope.userName = $ionicUser.social.facebook.data.full_name;
    $state.go('tab.dash');
  }
  $scope.login = function(){
    console.log("started login function!");
    if(typeof cordova === "undefined" || !cordova.InAppBrowser){
      //throw new Error("You are trying to run this code for a non-cordova project, " +
                //"or did not install the cordova InAppBrowser plugin");
      $state.go('tab.dash');
    }else{
      $ionicAuth.login('facebook').then(function(result){
        //console.log(result.username);
        $rootScope.userName = $ionicUser.social.facebook.data.full_name;
        console.log("Logged In!");
        $state.go('tab.dash');
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.

        console.log(errorMessage);
      });
    }
  }

  $scope.logout = function(){
    console.log("Logging out");
    $ionicAuth.logout();
    $state.go('landing');
  }

  $scope.openBrowser = function() {
    window.open('http://ngcordova.com', '_blank', 'location=yes');
 }

})

.controller('SigninCtrl', function($rootScope, $scope, $ionicModal, $state, $ionicAuth, $ionicUser){
  console.log("At login page");
})


.controller('SignupCtrl', function($rootScope, $scope, $ionicModal, $state, $firebaseAuth){
  console.log("At login page");

})

.controller('DashCtrl', function($scope, $rootScope, $state, $ionicAuth, $ionicUser) {
  //$scope.username = $ionicUser.social.facebook.data.full_name;
  console.log("Is Authenticated: "+$ionicAuth.isAuthenticated());
  console.log("everything: "+$ionicUser);
  console.log("untill facebook: "+$ionicUser.social.facebook);
  console.log("untill data: "+$ionicUser.social.facebook.data);
  console.log("untill username: "+$ionicUser.social.facebook.data.full_name);
  console.log("rootscope username: "+$rootScope.userName);
  $scope.logout = function(){
    console.log("Logging out");
    $ionicAuth.logout();
    $state.go('landing');
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
