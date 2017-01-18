angular.module('starter.controllers', ['ionic.cloud'])

.controller('LandingCtrl', function($scope, $rootScope, $state, $ionicAuth, $ionicUser, $ionicPopup, $http, $sce, $cordovaGeolocation){
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

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  }, function(error){
    console.log("Could not get location");
  });

})

.controller('DashCtrl', function($scope, $rootScope, $state, $ionicAuth, $ionicUser) {
  //$scope.username = $ionicUser.social.facebook.data.full_name;
  $rootScope.userName = "Default user";
  console.log($rootScope.userName);
  $scope.userName = $rootScope.userName;
  $scope.logout = function(){
    console.log("Logging out");
    $ionicAuth.logout();
    $state.go('landing');
  }
})

.controller('RoomsCtrl', function($scope, $rootScope, Rooms) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $rootScope.$on('$ionicView.beforeEnter', function() {
    $rootScope.hideTabs = false;
  });

  $scope.rooms = Rooms.all();
  $scope.remove = function(room) {
    Rooms.remove(room);
  };
})

.controller('ChatCtrl', function($scope, $rootScope, $stateParams, $state, $ionicScrollDelegate, $timeout, $http, Rooms, ChatMessages, $sce, iFramelyResult, LocalChatMessages) {

  $rootScope.$on('$ionicView.beforeEnter', function() {
    $rootScope.hideTabs = true;
    $ionicScrollDelegate.scrollBottom();
  });

  $scope.$on('$ionicView.afterEnter', function(){
    $ionicScrollDelegate.scrollBottom(true);
  });

  $scope.room = Rooms.get($stateParams.roomId);
  $scope.userName = $rootScope.userName;
  console.log($scope.userName);

  $scope.queryOpenRooms = $rootScope.database.ref("/nameless_open_rooms/"+$rootScope.user_uuid);
  $scope.queryNamelessMessages = $rootScope.database.ref().child('nameless_messages/'+$rootScope.user_uuid+'/');
  $scope.queryAgents = $rootScope.database.ref("/agents_info/");
  $scope.queryChatMessages = $rootScope.database.ref('nameless_messages/'+$rootScope.user_uuid);

  $scope.getChats = function(count){
    $scope.queryChatMessages.limitToLast(count).once('value').then(function(snapshot){
      $scope.chatMessages = snapshot.val();
    });
  }

  // $interval(function(){
  //   console.log("timeout working fine!");
  // },500);

  $scope.queryChatMessages.limitToLast(1).on('child_added', function(snapshot){
    var currentChatMessage = snapshot.val();
    var currentChatMessageKey = snapshot.key;
    console.log("confirmed added child");
    console.log(currentChatMessage);
    console.log(currentChatMessageKey);
    if(currentChatMessage.type == null){
      var queryCurrentChatMessage = $rootScope.database.ref('nameless_messages/'+$rootScope.user_uuid+'/'+currentChatMessageKey);
      var currentChatMessage = currentChatMessage.text;
      console.log("setting type to text or link");

      var currentChatType = $scope.checkMessageType(currentChatMessage);
      queryCurrentChatMessage.update({type:currentChatType});

      if(currentChatType == "simplelink"){
          var iFramelyRequestURL = "http://iframe.ly/api/oembed?url="+currentChatMessage+"&api_key=31d4151b543e7f5df7c092";
          $http({
            method: 'GET',
            url: iFramelyRequestURL
          }).then(function successCallback(response) {
            console.log("iFramely API response Success!");
            console.log(response);
            if(response.data.type == "rich"){
              currentChatType = "rich";
              var title = response.data.title;
              var author = response.data.author;
              var description = response.data.description;
              var thumbnail_url = response.data.thumbnail_url;
              var provider_name = response.data.provider_name;
              queryCurrentChatMessage.update({type:currentChatType,title:title,description:description,author:author,thumbnail_url:thumbnail_url,provider_name:provider_name});
            }
            if(response.data.type == "video"){
              currentChatType = "video";
              var title = response.data.title;
              var author = response.data.author;
              var description = response.data.description;
              var thumbnail_url = response.data.thumbnail_url;
              var provider_name = response.data.provider_name;
              queryCurrentChatMessage.update({type:currentChatType,title:title,description:description,author:author,thumbnail_url:thumbnail_url,provider_name:provider_name});
            }
            if(response.data.type == "link"){
              currentChatType = "link";
              var title = response.data.title;
              var description = response.data.description;
              queryCurrentChatMessage.update({type:currentChatType,title:title,description:description});
            }
            },function errorCallback(response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log("iFramely API response FAIL!");
              console.log(response);
            });
        }
      }
  });

  $scope.queryChatMessages.limitToLast(20).on('value',function(snapshot){
    $scope.queryOpenRooms.update({user_got_new_message:true});
    // if(!$scope.$$phase){

    // }
    $timeout(function(){
        //any code in here will automatically have an apply run afterwards
        $scope.$apply(function(){
          $scope.chatMessages = snapshot.val();
        });
    });
    $scope.chatMessages = snapshot.val();
    console.log($scope.chatMessages);
    console.log("updated chat messages");
    $ionicScrollDelegate.scrollBottom(true);
  });

  $scope.initMethods = function(){
    console.log("get chats on init");
    $scope.getChats(20);
    $scope.queryOpenRooms.update({user_read_at:firebase.database.ServerValue.TIMESTAMP});
    console.log("updated last seen");
  }

  $scope.sendChat = function(chat){
    if(chat != null && chat.message !=""){
      $scope.queryNamelessMessages.push().set({is_agent:false, sender_uid:$rootScope.user_uuid,text:chat.message,timestamp:firebase.database.ServerValue.TIMESTAMP});
      console.log("sent message");
      console.log("sent message type is: "+$scope.sentMessageType);
      chat.message = "";
      $scope.queryOpenRooms.update({updated_at:firebase.database.ServerValue.TIMESTAMP});
      console.log("updated, updated at");
      $scope.queryOpenRooms.update({is_user_writing:false});
      $scope.queryOpenRooms.update({user_input_text:""});
    }
  }

  $scope.isWriting = function(chat){
    if(chat.message != ""){
      $scope.queryOpenRooms.update({is_user_writing:true});
      $scope.queryOpenRooms.update({user_input_text:chat.message});
      console.log("user is writing");
      console.log("User input text :"+chat.message);
    }
    else{
      $scope.queryOpenRooms.update({is_user_writing:false});
      $scope.queryOpenRooms.update({user_input_text:chat.message});
      console.log("user stops writing");
    }
  }

  $scope.checkMessageType = function(messageToMatch){
    var urlpattern = "(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})";
    if(messageToMatch.match(urlpattern) != null){
      var type = "simplelink";
    }else{
      var type = "text";
    }
    return type;
  }

  $scope.toTrustedHTML = function(html){
    return $sce.trustAsHtml(html);
  }

})

.controller('ExploreCtrl', function($scope, $rootScope, $http) {

$http({
  method: 'GET',
  url: 'https://fastjapan.com/en/wp-json/wp/v2/posts'
}).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
    $scope.posts = response.data;
    console.log("API response success!");
    console.log($scope.posts);
    console.log($scope.posts["0"]);
    for (post in $scope.posts){
      console.log($scope.posts[0]);
      $scope.getFeaturedMedia($scope.posts[0].content.rendered);
    }
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    console.log("API response FAIL!");
    console.log("response");
  });

  $scope.getFeaturedMedia = function(content){
    var firstSlice = content.split('src=')[1];
    var secondSlice = firstSlice.split('"')[1];
    return secondSlice;
  }
})

.controller('ArticleCtrl', function($scope, $rootScope, $stateParams, $http, $sce){
  $scope.articleId = $stateParams.articleId;
  $http({
    method: 'GET',
    url: 'https://fastjapan.com/en/wp-json/wp/v2/posts/'+$scope.articleId
  }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      $scope.article = response;
      console.log("Article API response success!");
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("API response FAIL!");
      console.log("response");
    });

  $scope.toTrustedHTML = function(html){
    return $sce.trustAsHtml(html);
  }
})

.directive('hideTabs', function($rootScope) {
  return {
      restrict: 'A',
      link: function($scope, $el) {
          $rootScope.hideTabs = 'tabs-item-hide';
          $scope.$on('$destroy', function() {
              $rootScope.hideTabs = '';
          });
      }
  };
})

// Directive is required only when there's no full jQuery on the page
// .directive('renderIframely', ['$timeout', function ($timeout) {
//     return {
//         link: function ($scope, element, attrs) {
//             $timeout(function () {
//                 // Run code after element is rendered
//                 window.iframely && iframely.load();
//             }, 0, false);
//         }
//     };
// }]);
