var config = {
  apiKey: "AIzaSyAEOkd5JKDXjNJ5uwCIgbxasAWVf4hmgJM",
  authDomain: "meetup-c5cfa.firebaseapp.com",
  databaseURL: "https://meetup-c5cfa.firebaseio.com",
  projectId: "meetup-c5cfa",
  storageBucket: "meetup-c5cfa.appspot.com",
  messagingSenderId: "738857759873"
};
firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

var peopleLocation = [];
var keywords = [];
var map;
var infowindow;

function initMap() {
  //==============================================
  // This needs to be a for loop that adds the bounds.extend elements to the js file based on the peopleLocations variable length
  var bounds = new google.maps.LatLngBounds();
  bounds.extend({
    lat: 40.712776,
    lng: -73.935242
  })
  bounds.extend({
    lat: 42.3601,
    lng: -71.0589
  })
  bounds.extend({
    lat: 38.5976,
    lng: -80.4549
  })
  var midpoint = [bounds.getCenter().lat(), bounds.getCenter().lng()]
  var latLngMidpoint = {
    lat: midpoint[0],
    lng: midpoint[1]
  };

  var UCIlocation = { lat: 33.6405, lng: -117.8443 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: latLngMidpoint,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: latLngMidpoint,
    radius: 1000,
    //===================================================
    //   keywords must be parsed into a single word array. This will be pulled from Firebase
    keyword: ["food"]
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
    console.log(results);
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  // var selectionLatLng = this.getPosition().toUrlValue()
  // console.log(selectionLatLng);
  google.maps.event.addListener(marker, 'click', function () {
    infowindow.setContent("<a href=" + "https://www.google.com/maps/search/?api=1&query=" + this.getPosition().toUrlValue() + "&query_place_id=" + place.place_id + ">" + place.name + "</a>" + "<hr>" + place.vicinity + "<br>" + "This place has: " + place.types.join(", "));
    infowindow.open(map, this);
  });
}