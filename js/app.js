angular.module('utahApp', ['ui.router','firebase'])


.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$urlRouterProvider.otherwise('/');
	//$locationProvider.html5Mode(true);
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
	    })
	    .state('upload', {
	    	url: '/upload',
	    	templateUrl: 'templates/upload.html',
	    	controller: 'uploadCtrl'
	    });
})

.controller('uploadCtrl', function($scope, $rootScope) {
	$scope.test = "hello world";
	$rootScope.title = "Upload Controller Test";
})

.controller('mainCtrl', function($scope, firebaseFactory, $filter, $rootScope) {

	$rootScope.title = "This Week in Utah\u2014Things to do this week";

	$scope.startFirstWeek = moment().startOf('isoWeek');
	$scope.endFirstWeek = moment().endOf('isoWeek');

	$scope.startNextWeek = moment().add(7, 'days').startOf('isoWeek');
	$scope.endNextWeek = moment().add(7, 'days').endOf('isoWeek');

	$scope.startThirdWeek = moment().add(14, 'days').startOf('isoWeek');
	$scope.endThirdWeek = moment().add(14, 'days').endOf('isoWeek');

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
	$scope.test="Hello event ctrl!";
})

.filter('filterWeek', function() {
	return function(items, weekStart, weekEnd) {
		// if Firebase hasn't returned data yet
		if (items === undefined) {
			return;
		}

		var filtered = [];
		
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var tempStart = moment(item.startDate);
			var tempEnd = moment(item.endDate);
			var startsBeforeEnd = tempStart.isBefore(weekEnd);
			var endsBeforeStart = tempEnd.isAfter(weekStart);
			if (startsBeforeEnd && endsBeforeStart) {
				filtered.push(item);
			}
		}
		return filtered;
	};
})

.factory('firebaseFactory', function($firebaseArray) {

	var startDate = new Date();
	startDate.setDate(startDate.getDate()-7);
	var firebaseStart = startDate.toISOString();

	var endDate = new Date();
	endDate.setDate(endDate.getDate()+21);
	//var firebaseEnd = endDate.toISOString();

	var dataRef = firebase.database().ref();
	var data = $firebaseArray(dataRef.child("events").orderByChild("endDate").startAt(firebaseStart));

	return {
		data: function() {
			return data;
		}
	};

});



