const BETTERDOCTOR_API_URL = "https://api.betterdoctor.com/2016-03-01";

var state = {
  doctors: [],
  selectedDoctor: {}
};

var lat = "";
var lng = "";

var map;
var profileMap;
var geocoder;
var infowindow;
var profileMap;
var profileMarker;

function getDataFromApi(lat, lng, healthPlan, specialty, gender) {
  var requestData = {
    location: `${lat}, ${lng}, 30`,
    skip: 0,
    limit: 50,
    specialty_uid: specialty,
    user_key: "38a5e05a1ba6c75134d6d9a0497c51c0"
  };

  if (gender) {
    console.log(gender);
    requestData.gender = gender;
  }

  const doctors = {
    url: `${BETTERDOCTOR_API_URL}/doctors`,
    data: requestData,
    dataType: "json",
    type: "GET",
    success: function(response) {
      console.log(response);
      $("#loader").hide();
      // alert("asd");
      state.doctors = response.data;
      showDoctors();
      $(".back-to-top-link").show();
    },
    error: function(error) {
      console.log(error);
      $("#loader").hide();
      $(".back-to-top-link").hide();
    }
  };
  $("#loader").show();
  $(".total-results").html("Looking for doctors");
  $.ajax(doctors);
}

function getSpecialtiesFromApi() {
  const specialties = {
    url: `${BETTERDOCTOR_API_URL}/specialties`,
    data: {
      skip: 0,
      limit: 100,
      user_key: "38a5e05a1ba6c75134d6d9a0497c51c0"
    },
    dataType: "json",
    type: "GET",
    success: function(response) {
      let dropdown = $(".specialty-dropdown");
      dropdown.empty();
      response.data.map(function(specialty, index) {
        dropdown.append(
          $(`<option>${specialty.name}</option>`).attr("value", specialty.uid)
        );
      });
    },
    error: function(error) {
      console.log("test", error);
    }
  };
  $.ajax(specialties);
}

/* submit doctor search form */
function submitHeroForm() {
  $("#findadoc").submit(function(event) {
    universalFormSubmission();
  });
}

function submitResultsForm() {
  $("#results-form").submit(function(event) {
    universalFormSubmission();
  });
}

function universalFormSubmission() {
  event.preventDefault();
  let zipCode = $(".zip").val();
  $(".zip").val("");
  let gender = $(".gender-dropdown").val();
  $(".gender-dropdown").val("");
  let specialty = $(".specialty-dropdown").val();
  $(".specialty-dropdown").val("");
  getLatLong(zipCode, specialty, gender);
}

function getLatLong(zipCode, healthPlan, specialty, gender) {
  geocoder.geocode({ address: zipCode }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      showDoctors();
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      getDataFromApi(lat, lng, healthPlan, specialty, gender);
      map.setCenter(new google.maps.LatLng(lat, lng));
    } else {
      alert(
        "Sorry, but that Zip code / address was invalid. Please enter a valid Zip code or address."
      );
    }
  });
}

function renderResults() {
  const results = state.doctors.map((item, index) => renderDoctor(item, index));
  $(".doctors").html(results);
  let totalResults = results.length;
  var html = `
    <div class="results">
      <p class="total-results">We've found ${totalResults} doctors</p>
    </div>`;
  $(".total-results").html(html);
  if (state.doctors.length === 0) {
    $(".total-results").html(
      "Sorry, we could not find any doctors. Try another search."
    );
  }
}

function renderDoctor(doctor, index) {
  let distance = Math.round(doctor.practices[0].distance);
  return `
    <div class="results">
      <div class="card-content">
        <div class="doc-image">
          <img src="${doctor.profile.image_url}" class="img-circle">
        </div>
        <div class="doctor-info">
          <h3>${doctor.profile.first_name} ${doctor.profile.last_name}</h3>
          <p>${doctor.profile.gender}</p>
          <p>${doctor.practices[0].visit_address.street},
             ${doctor.practices[0].visit_address.city},
             ${doctor.practices[0].visit_address.state_long}</p>
          <p>${distance} miles away</p>
          <p>${doctor.specialties[0] ? doctor.specialties[0].name : ""}</p>
        </div>
        <div class="doctor-profile-button">
          <button data-index="${index}" class="doctor-profile type="button">View profile</button>
        </div>
      </div>
    </div>
  <br>`;
}

function docProfileView() {
  $("#doc-results").on("click", ".doctor-profile", function(event) {
    event.preventDefault();
    var index = $(this).attr("data-index");
    state.selectedDoctor = state.doctors[index];
    showProfile();
  });
}

function renderProfile(index, data) {
  let selectedDoctor = state.selectedDoctor;
  var doctorPosition = {
    lat: selectedDoctor.practices[0].lat,
    lng: selectedDoctor.practices[0].lon
  };

  profileMarker = new google.maps.Marker({
    position: doctorPosition,
    map: profileMap
  });
  profileMap.setCenter(doctorPosition);

  let profileSpecialties = selectedDoctor.specialties.map(function(
    specialty,
    index
  ) {
    return `<span>${specialty.name}</span>`;
  });

  let plansTaken = selectedDoctor.insurances.map(function(insurance, index) {
    return `<span>${insurance.insurance_plan.name}</span>`;
  });

  let selectedDoctorPractice = selectedDoctor.practices[0];
  let selectedDoctorName =
    selectedDoctor.profile.first_name + "" + selectedDoctor.profile.last_name;

  let distance = Math.round(selectedDoctorPractice.distance);
  var html = `
    <div class="card-content">
      <div class="doc-image">
        <img src="${selectedDoctor.profile.image_url}" class="img-circle">
      </div>
      <div class="doctor-info">
        <h3>${selectedDoctorName}</h3>
        <p>${selectedDoctor.profile.gender}</p>
        <p>${distance} miles away</p>
        <p>${selectedDoctorPractice.visit_address.street}, ${
    selectedDoctorPractice.visit_address.city
  }, ${selectedDoctorPractice.visit_address.state_long}</p>
        <p class="specialties">Specialties: ${profileSpecialties.join(", ")}</p>
        <p class="insurances">Insurance taken: ${plansTaken.join(", ")}</p>
      </div>
      <div class="info-section">
        <p>About: ${selectedDoctor.profile.bio}</p><br>
        <p>Accepting new patients: ${
          selectedDoctorPractice.accepts_new_patients
        }</p>
        <p>Languages: ${selectedDoctorPractice.languages[0].name}</p>
        <p class="phone">Contact: ${selectedDoctorPractice.phones[0].number}</p>
      </div>
      <div class="back-to-results">
        <a href="#doc-results">Back to results</a>
      </div>
    </div>
    <br>`;

  $("#doc-profile").html(html);
  backToResults();
  formatPhone();
}

//////////////////////// SHOW / HIDE PAGES ////////////////////////

function showProfile() {
  $("#doc-results").hide();
  $("#doc-search-form").hide();
  $(".new-search").show();
  $("#doc-profile").show();
  $("#doctor-profile-container").show();
  $("#profile-map").show();
  renderProfile();
}

function showSearchForm() {
  $("#doc-results").hide();
  $("#doctor-profile-container").hide();
  $(".new-search").show();
  $("#doc-search-form").show();
  getSpecialtiesFromApi();
}

function showDoctors() {
  $("#doc-search-form").hide();
  $("#doctor-profile-container").hide();
  $(".new-search").show();
  $("#doc-results").show();
  renderResults();
  setPins();
}

function backToResults() {
  $(".back-to-results").on("click", function() {
    $("#doctor-profile-container").hide();
    $("#doc-search-form").hide();
    $(".new-search").show();
    $("#doc-results").show();
  });
}

//////////////////////// EVENT LISTENERS ////////////////////////

function logoClickable() {
  $("#logo").on("click", function() {
    showSearchForm();
  });
}

function newDoctorSearch() {
  $(".new-search").on("click", function() {
    showSearchForm();
  });
}

function setPins() {
  state.doctors.forEach((doctor, index) => {
    let distance = Math.round(doctor.practices[0].distance);
    var doctorInfoWindow = `
    <div id="content">
      <div id="infoWindow">
        <div class="doctor-info-window">
          <h3>${doctor.profile.first_name} ${doctor.profile.last_name}</h3>
          <p>${doctor.profile.gender}</p>
          <p>${doctor.practices[0].visit_address.street},
             ${doctor.practices[0].visit_address.city},
             ${doctor.practices[0].visit_address.state_long}</p>
          <p>${distance} miles away</p>
          <p>${doctor.specialties[0] ? doctor.specialties[0].name : ""}</p>
        </div>
        <div>
          <button data-index="${index}" class="doctor-profile" type="button">View profile</button>
        </div>
      </div>
    </div>`;
    var uluru = { lat: doctor.practices[0].lat, lng: doctor.practices[0].lon };
    var marker = new google.maps.Marker({
      position: uluru,
      map: map,
      content: doctorInfoWindow
    });

    marker.addListener("click", function() {
      infowindow.open(map, marker);
      infowindow.setContent(marker.content);
    });
  });
}

function formatPhone() {
  $(".phone").text(function(i, text) {
    text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "$1-$2-$3");
    return text;
  });
}

//////////////////////// INITIALIZE  ////////////////////////

function initMap() {
  $("#map").html();
  geocoder = new google.maps.Geocoder();
  var uluru = { lat: 40.6452227, lng: -74.0152088 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: uluru,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }]
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }]
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }]
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }]
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }]
      }
    ]
  });
  infowindow = new google.maps.InfoWindow({
    content: ""
  });
  profileMap = new google.maps.Map(document.getElementById("profile-map"), {
    zoom: 10,
    center: uluru,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }]
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }]
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }]
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }]
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }]
      }
    ]
  });
}

function initProfileMap() {
  $("#profile-map").html();
  geocoder = new google.maps.Geocoder();
  var uluru = { lat: 40.6452227, lng: -74.0152088 };
  profileMap = new google.maps.Map(document.getElementById("profile-map"), {
    zoom: 10,
    center: uluru
  });
}

$(function() {
  $(".new-search").hide();
  getSpecialtiesFromApi();
  docProfileView();
  submitHeroForm();
  submitResultsForm()
  logoClickable();
  newDoctorSearch();
});
