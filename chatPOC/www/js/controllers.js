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
    $rootScope.userName = $ionicUser.social.facebook.data.full_name;
    $rootScope.user_uuid = $ionicUser.id;
    $state.go('tab.dash');
  }

  $scope.fakelogin = function(){
    console.log("fake logging in!");
    var fakeloginmsg = "You din't actually log in! This is a fake login. A simulation. This environment doesn't support loging in.";
    $scope.showError(fakeloginmsg);
    $state.go('tab.dash');
    $rootScope.setUserName("Default User");
    $rootScope.user_uuid = "randomuuid";
    $scope.usersInfoRef = $rootScope.database.ref().child('user_uuid/');
    // $scope.usersInfoRef.push().set($rootScope.userName);
    // $scope.usersInfoRef.push().set({usei_id:$rootScope.userName});

    // $scope.namelessMessagesRef = $rootScope.database.ref().child('nameless_messages/DefaultUser/');
    // $scope.namelessMessagesRef.push().set({is_agent:false, sender_uid:"AbcdEjY0FKNMO6rPRpOTEgFKuM33",text:"Displayed?",timestamp:1483606838973});

    // $scope.namelessUsersInfo = $rootScope.database.ref().child('nameless_users_info/DefaultUser/');
    // $scope.namelessUsersInfo.push().set({last_agent_uid:""});

    // $scope.namelessOpenRoomsUA = $rootScope.database.ref().child('nameless_open_rooms/DefaultUser.updated_at');
    // $scope.namelessOpenRoomsUA.push().set(1483706261515);
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
        $rootScope.user_uuid = $ionicUser.id;
        console.log("user uuid is: "+$rootScope.user_uuid);
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

.controller('RoomsCtrl', function($scope, Rooms) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.rooms = Rooms.all();
  $scope.remove = function(room) {
    Rooms.remove(room);
  };
})

.controller('ChatCtrl', function($scope, $rootScope, $stateParams, Rooms) {
  $scope.room = Rooms.get($stateParams.roomId);
  $scope.userName = $rootScope.userName;
  console.log($scope.userName);

  // $scope.chat = "";
  $scope.queryOpenRooms = $rootScope.database.ref("/nameless_open_rooms/"+$rootScope.user_uuid);
  $scope.queryNamelessMessages = $rootScope.database.ref().child('nameless_messages/'+$rootScope.user_uuid+'/');
  $scope.queryAgents = $rootScope.database.ref("/agents_info/");

  $scope.updateLastSeen = function(){
    $scope.queryOpenRooms.update({user_read_at:firebase.database.ServerValue.TIMESTAMP});
    console.log("updated last seen");
  }

  $scope.sendChat = function(chat){
    if(chat != null && chat.message !=""){
      $scope.queryNamelessMessages.push().set({is_agent:false, sender_uid:$rootScope.user_uuid,text:chat.message,timestamp:firebase.database.ServerValue.TIMESTAMP});
      console.log("sent message");
      chat.message = "";
      $scope.queryOpenRooms.update({updated_at:firebase.database.ServerValue.TIMESTAMP});
      console.log("updated, updated at");
    }
    // chatMessage = "";
  }

  $scope.isWriting = function(chat){
    if(chat.message != ""){
      console.log("user is writing");
      console.log("User input text :"+chat.message);
    }
  }
})

.controller('InfoCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
