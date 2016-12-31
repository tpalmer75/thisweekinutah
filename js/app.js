angular.module('utahApp', ['ui.router','firebase'])


.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$urlRouterProvider.otherwise('/');
	$locationProvider.html5Mode(true);
	$stateProvider
		.state('home', {
            url: '/',
            templateUrl: 'templates/main.html',
            controller: 'mainCtrl'
        })
		.state('event-detail', {
	        url: '/events/:eventId',
	        templateUrl: 'templates/event-detail.html',
	        controller: 'eventCtrl'
	    });
})

.controller('mainCtrl', function($scope, $firebaseArray, firebaseFactory) {
	$scope.test = "Hello world!";

	var firebaseData = firebaseFactory.data();
	$scope.dataReady = false;

	firebaseData.$loaded()
		.then(function() {
			$scope.dataReady = true;
			console.log(firebaseData);
			$scope.eventData = firebaseData;
		})
		.catch(function(err) {
			console.log(err);
		});
})

.controller('eventCtrl', function($scope) {
	$scope.test="Hello event ctrl!"
})

.factory('firebaseFactory', function($firebaseArray) {

	var startDate = new Date();
	startDate.setDate(startDate.getDate()-7);
	var firebaseStart = startDate.toISOString();

	var endDate = new Date();
	endDate.setDate(endDate.getDate()+21);
	var firebaseEnd = endDate.toISOString();

	var dataRef = firebase.database().ref()
	var data = $firebaseArray(dataRef.child("events").orderByChild("date").startAt(firebaseStart).endAt(firebaseEnd));

	return {
		data: function() {
			return data;
		}
	}

});



