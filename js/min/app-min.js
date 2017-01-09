angular.module("utahApp",["ui.router","firebase"]).config(function(e,t,a){t.otherwise("/"),e.state("home",{url:"/",templateUrl:"templates/main.html",controller:"mainCtrl"}).state("event-detail",{url:"/events/:eventId",templateUrl:"templates/event-detail.html",controller:"eventCtrl"}).state("upload",{url:"/upload",templateUrl:"templates/upload.html",controller:"uploadCtrl"})}).controller("uploadCtrl",function(e,t){e.test="hello world",t.title="Upload Controller Test"}).controller("mainCtrl",function(e,t,a,r){r.title="This Week in Utah—Things to do this week",e.startFirstWeek=moment().startOf("isoWeek"),e.endFirstWeek=moment().endOf("isoWeek"),e.startNextWeek=moment().add(7,"days").startOf("isoWeek"),e.endNextWeek=moment().add(7,"days").endOf("isoWeek"),e.startThirdWeek=moment().add(14,"days").startOf("isoWeek"),e.endThirdWeek=moment().add(14,"days").endOf("isoWeek");var n=t.data();e.dataReady=!1,n.$loaded().then(function(){e.dataReady=!0,console.log(n),e.eventData=n}).catch(function(e){console.log(e)})}).controller("eventCtrl",function(e){e.test="Hello event ctrl!"}).filter("filterWeek",function(){return function(e,t,a){if(void 0!==e){for(var r=[],n=0;n<e.length;n++){var o=e[n],l=moment(o.startDate),d=moment(o.endDate),i=l.isBefore(a),s=d.isAfter(t);i&&s&&r.push(o)}return r}}}).factory("firebaseFactory",function(e){var t=new Date;t.setDate(t.getDate()-7);var a=t.toISOString(),r=new Date;r.setDate(r.getDate()+21);var n=firebase.database().ref(),o=e(n.child("events").orderByChild("endDate").startAt(a));return{data:function(){return o}}});