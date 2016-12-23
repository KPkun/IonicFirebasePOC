// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

.run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    $rootScope.config = {
      apiKey: "AIzaSyCnwI0s5yEbQhqy3wxrUd_rNv9wNNGOZ-k",
      authDomain: "ionicfirebasepoc.firebaseapp.com",
      databaseURL: "https://ionicfirebasepoc.firebaseio.com",
      storageBucket: "ionicfirebasepoc.appspot.com",
      messagingSenderId: "897565733875"
    };
    
    $rootScope.firebaseApp = firebase.initializeApp($rootScope.config, "firebaseApp");
    console.log($rootScope.firebaseApp.name); 
    
    $rootScope.facebookProvider = new firebase.auth.FacebookAuthProvider();
    
    $rootScope.login = function(){
      
      $rootScope.firebaseApp.auth().signInWithPopup($rootScope.facebookProvider).then(function(result) {

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
    
    
    $rootScope.userEmail = null;
    $rootScope.userName = null;
    
    $rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        content: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };

    $rootScope.hide = function() {
      $ionicLoading.hide();
    };

    $rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };
    
    $rootScope.logout = function() {
      
    };
    
    $rootScope.checkSession = function() {
    
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  //Landing page
  .state('landing', {
    url: '/landing',
    templateUrl: 'templates/landing.html',
    controller: 'LandingCtrl'
  })

  //Signin page
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'SigninCtrl'
  })
  
  //Signup page
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })


  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.rooms', {
      url: '/rooms',
      views: {
        'tab-rooms': {
          templateUrl: 'templates/tab-rooms.html',
          controller: 'RoomsCtrl'
        }
      }
    })
    .state('tab.chat', {
      url: '/rooms/:chatId',
      views: {
        'tab-rooms': {
          templateUrl: 'templates/room-chat.html',
          controller: 'RoomChatCtrl'
        }
      }
    })

  .state('tab.info', {
    url: '/info',
    views: {
      'tab-info': {
        templateUrl: 'templates/tab-info.html',
        controller: 'InfoCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/landing');

});
