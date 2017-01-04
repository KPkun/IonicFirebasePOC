angular.module('starter.controllers', ['ionic.cloud'])

.controller('LandingCtrl', function($scope, $rootScope, $state, $ionicAuth, $ionicUser, $ionicPopup){
  console.log("At landing page");

  // An alert dialog
  $scope.showError = function(text) {
    console.log("popop started");
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: text
    });

    alertPopup.then(function(res) {
      console.log('Popoup successfully closed');
    });
  };

  if($ionicAuth.isAuthenticated()){
    console.log("Checked smartly! Already logged in!");
    //$rootScope.userName = $ionicUser.social.facebook.data.full_name;
    $state.go('tab.dash');
  }

  $scope.fakelogin = function(){
    console.log("fake logging in!");
    $rootScope.userName = "Default User";
    var fakeloginmsg = "You din't actually log in! This is a fake login. A simulation. This environment doesn't support loging in.";
    $scope.showError(fakeloginmsg);
    $state.go('tab.dash');
  }

  $scope.login = function(){
    console.log("started login function!");

    if(typeof cordova === "undefined" || !cordova.InAppBrowser){

      //throw new Error("You are trying to run this code for a non-cordova project, " +
                //"or did not install the cordova InAppBrowser plugin");
                var error = "You are trying to run this code for a non-cordova project, \n"+
                "or did not install the cordova InAppBrowser plugin \n" +
                "But anyways I let you IN!";
      $scope.showError(error);
      $state.go('tab.dash');
    }else{
      $ionicAuth.login('facebook').then(function(result){
        //console.log(result.username);
        $rootScope.userName = $ionicUser.social.facebook.data.full_name;
        console.log("Logged In!");
        var info =typeof cordova;
        $scope.showError(info);
        $state.go('tab.dash');
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.

        $scope.showError(errorMessage);
        $state.go('tab.dash');
        console.log(errorMessage);
      });
    }
  }

  $scope.logout = function(){
    console.log("Logging out");

    if(typeof cordova === "undefined" || !cordova.InAppBrowser){
      $state.go('landing');
    }else{
      $ionicAuth.logout();
      $state.go('landing');
    }
  }

  $scope.openBrowser = function() {
    window.open('https://fastjapan.com', '_blank', 'location=yes');
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
  $rootScope.userName = "Default user";
  console.log($rootScope.userName);
  // console.log("Is Authenticated: "+$ionicAuth.isAuthenticated());
  // console.log("everything: "+$ionicUser);
  // console.log("untill facebook: "+$ionicUser.social.facebook);
  // console.log("untill data: "+$ionicUser.social.facebook.data);
  // console.log("untill username: "+$ionicUser.social.facebook.data.full_name);
  // console.log("rootscope username: "+$rootScope.userName);
  $scope.userName = $rootScope.userName;
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
