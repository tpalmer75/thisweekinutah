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

.controller('uploadCtrl', function($scope, firebaseFactory, $filter) {
	$scope.title = "";
	$scope.description = "";
	$scope.startDate = "";
	$scope.endDate = "";
	$scope.days = "";
	$scope.image = "";
	$scope.price = "";
	$scope.time = "";
	$scope.originalLink = "";

	$scope.uploadFile = function(event){
        var file = event.target.files[0];
        console.log(file);
        firebaseFactory.uploadFile(file);
    };

    $scope.filteredDate = $filter('date')($scope.startDate, "yyyy-mm-dd");


	var customKey = "testKey";
	var eventDetails = {
		"title": "",
		"description": "",
		"startDate": "",
		"endDate": "",
		"days": "",
		"image": "",
		"price": "",
		"time": "",
		"originalLink": ""
	};
	$scope.pushData = function() {
		firebaseFactory.pushData(customKey, eventDetails);
	};

	$scope.email;
	$scope.password;
	$scope.isLoggedIn = false;

	$scope.login = function() {
		firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).then(function() {
			console.log("success");
			$scope.isLoggedIn = true;
			$scope.$apply();
		}).catch(function(error) {
		  console.log(error.code, error.message);
		});
	};
})

.directive('customFileUpload', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customFileUpload);
      element.bind('change', onChangeHandler);
    }
  };
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

	//var endDate = new Date();
	//endDate.setDate(endDate.getDate()+21);
	//var firebaseEnd = endDate.toISOString();

	var dataRef = firebase.database().ref();
	var data = $firebaseArray(dataRef.child("events").orderByChild("endDate").startAt(firebaseStart));
	var storageRef = firebase.storage().ref();

	var setData = function(id, obj) {
		dataRef.child("events/" + id).set(obj);
		console.log("Data Uploaded to Firebase");
	};

	var uploadFile = function(file) {
		storageRef.child("event-photos/"+file.name).put(file)
			.then(function() {
				console.log("Tried to upload");
				storageRef.child("event-photos/"+file.name).getDownloadURL()
					.then(function(url) {
						console.log(url);
						return url;
					}).catch(function(err){
						console.log(err);
					});
			}).catch(function(err){
				console.log(err);
			});
	}

	return {
		data: function() {
			return data;
		},
		pushData: function(id, obj) {
			return setData(id, obj);
		},
		uploadFile: function(file) {
			return uploadFile(file);
		}
	};

});



