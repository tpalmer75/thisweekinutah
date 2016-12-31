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

.controller('mainCtrl', function($scope, $firebaseArray, firebaseFactory, $filter) {

	$scope.startFirstWeek = moment().startOf('isoWeek');
	$scope.endFirstWeek = moment().endOf('isoWeek');

	$scope.startNextWeek = moment().add(7, 'days').startOf('isoWeek');
	$scope.endNextWeek = moment().add(7, 'days').endOf('isoWeek');

	$scope.startThirdWeek = moment().add(14, 'days').startOf('isoWeek');
	$scope.endThirdWeek = moment().add(14, 'days').endOf('isoWeek');
	
	// $scope.isThisWeek = function(eventDate, startDate, endDate) {
	// 	var tempDate = moment(eventDate);
	// 	var isBefore = tempDate.isBefore(startDate);
	// 	var isAfter = tempDate.isAfter(endDate);

	// 	if (!isBefore && !isAfter) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	// $scope.isThisWeek = function(item) {
	// 	var tempDate = moment(item.date);
	// 	var isBefore = tempDate.isBefore(startFirstWeek);
	// 	var isAfter = tempDate.isAfter(endFirstWeek);

	// 	//console.log(eventDate);
	// 	console.log('here');

	// 	if (!isBefore && !isAfter) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

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

.filter ('filterWeek', function() {
	return function(items, startDate, endDate) {
		// if Firebase hasn't returned data yet
		if (items === undefined) {
			return;
		}

		var filtered = [];
		
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var tempDate = moment(item.date);
			var isBefore = tempDate.isBefore(startDate);
			var isAfter = tempDate.isAfter(endDate);
			if (!isBefore && !isAfter) {
				filtered.push(item);
			}
		}
		return filtered;
	}
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



