const BETTERDOCTOR_SEARCH_URL =
  "https://api.betterdoctor.com/2016-03-01/doctors";
const BETTERDOCTOR_SPECIALTIES_URL =
  "https://api.betterdoctor.com/2016-03-01/specialties";
const BETTERDOCTOR_INSURANCES_URL =
  "https://api.betterdoctor.com/2016-03-01/insurances";  

// CHANGE #1: CHECK THIS STATUS OBJECT.
var state = {
  doctors: [],
  selectedDoctor: {}
};

var lat = '';
var lng = '';

var map;
var geocoder;

function getDataFromApi(lat, lng, healthPlan, specialty) {
  console.log(specialty);
  const doctors = {
    url: BETTERDOCTOR_SEARCH_URL,
    data: {
      location: `${lat}, ${lng}, 50`,
      skip: 0,
      limit: 25,
      // insurance_uid: healthPlan,
      specialty_uid: specialty,
      user_key: "38a5e05a1ba6c75134d6d9a0497c51c0"
    },
    dataType: "json",
    type: "GET",
    success: function(response) {
      console.log(response);
      state.doctors = response.data;
      showDoctors();
    },
    error: function(error) {
      console.log(error);
    }
  };

  $.ajax(doctors);
}

function getHealthPlansFromApi() {
    const healthPlan = {
    url: BETTERDOCTOR_INSURANCES_URL,
    data: {
      skip: 0,
      limit: 100,
      user_key: '38a5e05a1ba6c75134d6d9a0497c51c0'
    },
    dataType: 'json',
    type: 'GET',
    success: function(response) {
      let dropdown = $('#plan-dropdown');
      dropdown.empty();
      console.log(response);
      // use below format / structure
      // const plans = response.map((item, index) => renderPlanDropdown(item, index));
      // $("#plan-dropdown").html(response);
      response.data.map(function (insurance, index) {
        dropdown.append($(`<option>${insurance.name}</option>`).attr('value', insurance.uid));
      })

    },
    error: function(error) {
      console.log('test', error);
    }
  }
  $.ajax(healthPlan);
}

function getSpecialtiesFromApi() {
    const specialties = {
    url: BETTERDOCTOR_SPECIALTIES_URL,
    data: {
      skip: 0,
      limit: 100,
      user_key: '38a5e05a1ba6c75134d6d9a0497c51c0'
    },
    dataType: 'json',
    type: 'GET',
    success: function(response) {
      let dropdown = $('#specialty-dropdown');
      dropdown.empty();
      console.log(response);
      response.data.map(function (specialty, index) {
        dropdown.append($(`<option>${specialty.name}</option>`).attr('value', specialty.uid));
      })

    },
    error: function(error) {
      console.log('test', error);
    }
  }
  $.ajax(specialties);
}

/* submit doctor search form */
function submitForm() {
  $("#findadoc").submit(function(event) {
    event.preventDefault();
    let zipCode = $("#zip").val();
    $("#zip").val("");
    let gender = $("#gender-dropdown").val();
    $("#gender-dropdown").val("");
    let healthPlan = $('#plan-dropdown').val();
    $("#plan-dropdown").val("");
    let specialty = $('#specialty-dropdown').val();
    $("#specialty-dropdown").val("");
    getLatLong(zipCode, healthPlan, specialty);
    showDoctors();
  });
}

function getLatLong(zipCode, healthPlan, specialty) {
  // get lat lng from Google Maps

  geocoder.geocode({'address': zipCode}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      getDataFromApi(lat, lng, healthPlan, specialty);
      map.setCenter(new google.maps.LatLng(lat,lng));
    } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}

//populate health plan dropdown AJAX / need to pass the key, similar to doctors

// function renderDropdowns(healthPlan){

// //Populate dropdown with list of plans  
//   $.getJSON(url, function (data) {
//     $.each(data, function (user_key, entry) {
//       dropdown.append($('<option></option>').attr('value', input).text(input.name));
//     })
//   });
// }

// renderDropdowns();

/* Pass through all results */
function renderResults() {
  const results = state.doctors.map((item, index) => renderDoctor(item, index));
  $(".top-button-container").html(results);
}

/* Pass through each single result */
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
          <p>${doctor.specialties[0].name}</p>
        </div>
        <div class="doctor-profile-button">
          <button data-index="${index}" class="btn btn-default doctor-profile type="button">View profile</button>
        </div>
      </div>
    </div>
  <br>`;
}

function viewProfile() {
  $("#doc-results").on("click", ".doctor-profile", function(event) {
    event.preventDefault();
    // TODO #1. Which doctor was clicked?
    // Get it from the button using
    var index = $(this).attr("data-index");
    // Now you have that in a var.
    // Get the right doctor into the state.
    state.selectedDoctor = state.doctors[index];
    showProfile();
  });
}

function renderProfile(index, data) {
  // TODO Instead of returning this. Put the html in the right place in the PAGES
  // TODO use the data from state.selectedDoctor to render it
  let selectedDoctor = state.selectedDoctor;
  console.log(selectedDoctor);
  var html =  `
    <div class="card-content">
      <div class="doc-image">
        <img src="${selectedDoctor.profile.image_url}" class="img-circle">
      </div>
      <div class="doctor-info">
        <h3>${selectedDoctor.profile.first_name} ${selectedDoctor.profile.last_name}</h3>
        <p>${selectedDoctor.profile.gender}</p>
        <p>${selectedDoctor.practices[0].distance} miles away</p>
        <p>${selectedDoctor.practices[0].visit_address.street}, ${selectedDoctor.practices[0].visit_address.city}, ${selectedDoctor.practices[0].visit_address.state_long}</p>
        <p>${selectedDoctor.specialties[0].name}</p>
      </div>
      <div class="info-section">
        <p>${selectedDoctor.practices[0].accepts_new_patients}</p>
        <p>${selectedDoctor.practices[0].languages[0].name}</p>
        <p>${selectedDoctor.practices[0].office_hours}</p>
        <p>${selectedDoctor.practices[0].phones}</p>
      </div>
    </div>
    <br>`;

  $("#doc-profile").html(html);
}

//////////////////////// SHOW / HIDE PAGES ////////////////////////

function showProfile() {
  $("#doc-results").hide();
  $("#doc-search-form").hide();
  $("#doc-profile").show();
  renderProfile();
}
function showSearchForm() {
  $("#doc-results").hide();
  $("#doc-profile").hide();
  $("#doc-search-form").show();
}
function showDoctors() {
  $("#doc-search-form").hide();
  $("#doc-results").show();
  renderResults();
  setPins();
}

//////////////////////// SETUP EVENT LISTENERS ////////////////////////

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

function presentValues() {
  $(".form-values").html(`Your details: ${zipCode}`);
}

function setPins() {
  state.doctors.forEach((item, index) => { 
    console.log(item.practices[0]);
    var uluru = {lat: item.practices[0].lat, lng: item.practices[0].lon};
    var marker = new google.maps.Marker ({
    position: uluru,
    map: map
    });
  });
}

//info-window on practices//

//////////////////////// INITIALIZE  ////////////////////////

function initMap() {
  $('#map').html();
  geocoder = new google.maps.Geocoder();
  var uluru = {lat: 40.6452227, lng: -74.0152088};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: uluru
  });
}
  // INIT MAP STUFF HERE.
  // Create map, pointers, we'll see later on.

$(function() {
  // When the document is ready, do this.
  getSpecialtiesFromApi();
  // getHealthPlansFromApi();
  viewProfile();
  submitForm();
  logoClickable();
  newDoctorSearch();
});
