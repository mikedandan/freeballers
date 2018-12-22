// Initialize Firebase
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

// Capture Button Click

// var name = $("#inputName").val();
// var eventName = $("#inputEvent").val();

// var people = $(".addPerson").val();

var people = $(".addPerson");

for (var i = 0; i < people.length; i++) {
    console.log($(people[i]).val());
}

var meetPlace = $("#inputPlace").val();

$(document).ready(function () {
    // console.log("hey")
    // var bounds = new google.maps.LatLngBounds();
    // bounds.extend({
    //     lat: 40.712776,
    //     lng: -74.005974
    // })
    // bounds.extend({
    //     lat: 37.774929,
    //     lng: -122.419418
    // })
    // bounds.extend({
    //     lat: 23.634501,
    //     lng: -102.552788
    // })  
    // console.log("mid point:",bounds.getCenter().lat(),bounds.getCenter().lng());
    // var midpoint = [bounds.getCenter().lat(),bounds.getCenter().lng()]
    // console.log("Mid point: " + midpoint);



    // Database Variables:
    // All new users will be added to this array
    var allPeople = []
    var allEmails = []
    var meetPlace = []
    var max_fields = 10;
    var isSubmitted = false;
    peopleLocation = [];

    var x = 1;
    $("#addPersonDiv").click(function (e) {
        e.preventDefault();
        if (x < max_fields) {
            var addPerson = $("<div class='input-field col s12 m12 center-align newPersonDiv'>");
            var newInput = $("<input placeholder='Phone Number or Email' type='text' class='validate addPerson'>");
            // if you change the <a> tag to a <button> tag it works, but refreshes the page everytime you press it :(
            var deleteBtn = $("<a class='deletePerson'>").html("<i class='material-icons'>delete_forever</i>");
            addPerson.append(deleteBtn, newInput);
            $("#addPeople").append(addPerson); //add input box
            x++;

        }
        else {
            alert('You Reached the limits')
        }
    });

    $(document).on("click", ".deletePerson", function (e) {
        e.preventDefault(); $(this).parent('div').remove();
        x--;
    });

    $("#initInvite").on("click", function (event) {
        console.log("working")
        event.preventDefault();
        var name = $("#inputName").val();
        console.log(name);

        var newKey = database.ref().push({
            name: name,
        });

        console.log(newKey.key);
        window.location.assign("./sendinvite.html?key=" + newKey.key);



    });

    $("#sendInvite").on("click", function (event) {
        event.preventDefault();
        // var arr = [];
        // Capture User Inputs and store them into variables
        $(".addPerson").each(function (i, elem) {
            console.log(elem)
            allEmails.push($(elem).val());
        })
        $("#inputPlace").each(function (i, elem) {
            console.log(elem)
            meetPlace.push($(elem).val());
        });

        var href = window.location.href;

        // console.log(href);
        var url = new URL(href);
        var key = url.searchParams.get("key");
        console.log(key);

        var eventName = $(".inputEvent").val();
        // var people = $(".addPerson").val();
        // var meetPlace = $("#inputPlace").val();
        // Console log each of the user inputs to confirm we are receiving them correctly
        console.log(eventName, allPeople, meetPlace, allEmails);
        console.log("run")
        database.ref(key).update({
            // name: name,
            eventName: eventName,
            allEmails: allEmails,
            allPeople: allPeople,
            meetPlace: meetPlace
        });

        // Store Lat and Lng in array:
        var x = document.getElementById("error-handling");

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
                console.log("works");
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

        function showPosition(position) {
            console.log("Position" + position)
            var newLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            console.log("New Lat Lng" + newLatLng[0]);
            peopleLocation.push(newLatLng);
            console.log("People Location: " + peopleLocation);
        }
        function showError(error) {
            console.log(error)
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    x.innerHTML = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    x.innerHTML = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    x.innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    x.innerHTML = "An unknown error occurred."
                    break;
            }
        }
        getLocation();
        
        setTimeout(function () {
            Email.send({
                Host: "smtp.elasticemail.com",
                Username: "mikedandan2@gmail.com",
                Password: "259229f0-3e5b-4da2-b869-c6009ef1a5ea",
                To: ['mikedandan2@gmail.com', 'webseoinc@gmail.com'],
                From: "mikedandan2@gmail.com",
                Subject: "IT WORKS!!",
                Body: "We can now email!"
            }).then(
                message => alert(message)
            );
        }, 2000);
        setTimeout(function () { window.location.assign("./waiting.html?key=" + key); }, 3000);
        // console.log(key);
        // window.location.assign("./waiting.html?key=" + key);
    });

    $("#newRecipient").on("click", function (event) {
        event.preventDefault();



        if (isSubmitted == false) {
            // remove current HTML
            $(".addPresent").html("");

            $(this).addClass("grey");
            var newPersonName = $("#inputRecipientName").val();

            var newNameDiv = $("<div class='col s4 m4 l4'>");
            var newName = $("<h4 class='present'>").text(newPersonName);

            newNameDiv.append(newName);

            allPeople.push(newPersonName);

            var href = window.location.href;

            var url = new URL(href);
            var key = url.searchParams.get("key");

            // allPeople = ["the", "only", "one"];

            database.ref(key).once("value")
                .then(function (snapshot) {
                    var val = snapshot.val().allPeople;
                    console.log(snapshot.val());

                    val.push(newPersonName);

                    console.log(val);

                    database.ref(key).update({
                        allPeople: val
                    });

                    // for (var i = 0; i < val.length; i++) {
                    //     var newNameDiv = $("<div class='col s12 m3 l3'>");
                    //     var newName = $("<h4 class='present'>").html(allPeople[i]);
                    //     newNameDiv.append(newName);
                    //     $(".addPresent").append(newNameDiv); //add input box
                    // }
                })


            isSubmitted = true;
            console.log(isSubmitted);
        } else {
            // return;
            event.preventDefault();
            console.log(isSubmitted);
        }



    });
    // gettind dat info from the database
    var href = window.location.href;
    var url = new URL(href);
    var key = url.searchParams.get("key");

    database.ref(key).on("value", function (childSnapshot) {
        // remove current HTML
        $(".addPresent").html("");
        console.log(childSnapshot.val());

        var val = childSnapshot.val().allPeople;
        console.log(val);

        for (var i = 0; i < val.length; i++) {
            var newNameDiv = $("<div class='col s12 m6 l6'>");
            var newName = $("<h4 class='present'>").html(val[i]);
            newNameDiv.append(newName);
            $(".addPresent").append(newNameDiv);
        }    //add input box

    });

});
