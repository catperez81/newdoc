const BETTERDOCTOR_SEARCH_URL =
  "https://api.betterdoctor.com/2016-03-01/doctors";
const BETTERDOCTOR_SPECIALTIES_URL =
  "https://api.betterdoctor.com/2016-03-01/specialties";
const GOOGLE_MAPS_URL =
  "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDgtJKYyrzY5_6OL13gObxN43d4lgNhOKc";

// CHANGE #1: CHECK THIS STATUS OBJECT.
// starts with an empty array of obects.
var state = {
  doctors: [],
  selectedDoctor: {}
};

function getDataFromApi(lat, lng) {
  // const healthPlan = {
  //   url: BETTERDOCTOR_SPECIALTIES_URL,
  //   data: {
  //     skip: 0,
  //     limit: 100,
  //     user_key: '38a5e05a1ba6c75134d6d9a0497c51c0'
  //   },
  //   dataType: 'json',
  //   type: 'GET',
  // }

  const doctors = {
    url: BETTERDOCTOR_SEARCH_URL,
    data: {
      location: `${lat}, ${lng}, 100`,
      skip: 0,
      limit: 25,
      user_key: "38a5e05a1ba6c75134d6d9a0497c51c0"
    },
    dataType: "json",
    type: "GET",
    success: function(response) {
      //CHANGE #2 SAVING ALL THE DOCTORS YOU GET IN state.doctors
      state.doctors = response.data;
      showDoctors();
    },
    error: function(error) {
      console.log(error);
    }
  };

  $.ajax(doctors);
}

/* submit doctor search form */
function submitForm() {
  $("#findadoc").submit(function(event) {
    event.preventDefault();
    let zipCode = $("#zip").val();
    $("#zip").val("");
    let gender = $("#gender-dropdown").val();
    $("#gender-dropdown").val("");
    // let healthPlan = $('#plan-dropdown').val();
    // let specialty = $('#specialty-dropdown').val();
    getLatLong(zipCode);
  });
}

function getLatLong(zipCode) {
  // get lat lng from Google Maps

  // const maps ={
  //   url: GOOGLE_MAPS_URL,
  //   data: {
  //     location: 'LatLng',
  //     accuracy: 100,
  //     maps_key: 'AIzaSyDgtJKYyrzY5_6OL13gObxN43d4lgNhOKc'
  //   }
  // }

  // NOTE: CAN'T DO GOOGLE MAPS WITH AJAX

  getDataFromApi(37.755117, -122.457847);
}

/* populate health plan dropdown */
// function renderDropdowns(healthPlan){
//   let dropdown = $('#plan-dropdown');
//   dropdown.empty();

//   // Populate dropdown with list of plans
//   $.getJSON(url, function (data) {
//     $.each(data, function (user_key, entry) {
//       dropdown.append($('<option></option>').attr('value', input).text(input.name));
//     })
//   });
// }

// renderDropdowns();

// function renderMap(map){
// }

/* Pass through all results */
function renderResults() {
  console.log(state.doctors);
  // CHANGE #3: Instead of getting docs as an argument,
  // now iterating over state.doctors
  const results = state.doctors.map((item, index) => renderDoctor(item));
  $("#doc-results").html(results);
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
          <p>${doctor.practices[0].visit_address.street}, ${
    doctor.practices[0].visit_address.city
  }, ${doctor.practices[0].visit_address.state_long}</p>
          <p>${distance} miles away</p>
          <p>${doctor.specialties[0].name}</p>
        </div>
        <div class="doctor-profile-button">
          <button  data-index="${index}" class="btn btn-default doctor-profile type="button">View profile</button>
        </div>
      </div>
    </div>
  <br>`;
}

function profile(doctor){
  const profile = renderProfile(item);
  $('#doc-profile').html(profile);
  console.log(doctor);
}

/* render doctor profile */
<<<<<<< HEAD
function renderProfile(doctor) {
  $("#doc-results").on('click', '.doctor-profile', function(event){
    event.preventDefault();
    $("#doc-results").hide();
    $("#doc-search-form").hide();
    $("#doc-profile").show();
    return `
    <div class="card-content">
      <div class="doc-image">
        <img src="${doctor.profile.image_url}" class="img-circle"> 
      </div>
      <div class="doctor-info">
        <h3>${doctor.profile.first_name} ${doctor.profile.last_name}</h3>
        <p>${doctor.profile.gender}</p>
        <p>${doctor.practices[0].distance} miles away</p>
        <p>${doctor.practices[0].visit_address.street}, ${doctor.practices[0].visit_address.city}, ${doctor.practices[0].visit_address.state_long}</p>
        <p>${doctor.specialties[0].name}</p>
      </div>
    </div>
    <div class="info-section">
      <p>${doctor.practices[0].accepts_new_patients}</p>
      <p>${doctor.practices[0].languages}</p>
      <p>${doctor.practices[0].office_hours}</p>
      <p>${doctor.practices[0].phones}</p>
    </div>`
    });
  }

renderProfile();
=======
function viewProfile() {
  $("#doc-results").on("click", ".doctor-profile", function(event) {
    event.preventDefault();
    // TODO #1. Which doctor was clicked?
    // Get it from the button using
    var index = $(this).attr("data-id");
    // Now you have that in a var.
    // Get the right doctor into the state.
    state.selectedDoctor = state.doctors[index];
    showProfile();
  });
}

function renderProfile() {
  // TODO Instead of returning this. Pu the html in the right place in the PAGES
  // TODO use the data from state.selectedDoctor to render it

  // var html =  `
  //   <div class="card-content">
  //     <div class="doc-image">
  //       <img src="${doctor.profile.image_url}" class="img-circle">
  //     </div>
  //     <div class="doctor-info">
  //       <h3>${doctor.profile.first_name} ${doctor.profile.last_name}</h3>
  //       <p>${doctor.profile.gender}</p>
  //       <p>${doctor.practices[0].distance} miles away</p>
  //       <p>${doctor.practices[0].visit_address.street}, ${doctor.practices[0].visit_address.city}, ${doctor.practices[0].visit_address.state_long}</p>
  //       <p>${doctor.specialties[0].name}</p>
  //     </div>
  //     <div class="info-section">
  //       <p>${doctor.practices[0].accepts_new_patients}</p>
  //       <p>${doctor.practices[0].languages}</p>
  //       <p>${doctor.practices[0].office_hours}</p>
  //       <p>${doctor.practices[0].phones}</p>
  //     </div>
  //   </div>
  //   <br>`
  $(".doctor-profile-view").html(/* HTML GOES HERE */);
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
  // moved this to a function since you might have to do it over and over.
  $("#doc-search-form").hide();
  $("#doc-results").show();
  renderResults();
}

//////////////////////// SETUP EVENT LISTENERS ////////////////////////
>>>>>>> 30bd5f79a459ef27e66e7267389197d1e092ae71

function logoClickable() {
  $("#logo").on("click", function() {
    showSearchForm();
  });
}

function newDoctorSearch() {
  $(".new-search").on("click", function() {
    showSearchForm(); // used this here as well as in logoClickable. So I put it in a function
  });
}

//////////////////////// INITIALIZE  ////////////////////////

function initMap() {
  // INIT MAP STUFF HERE.
  // Create map, pointers, we'll see later on.
}
$(function() {
  // When the document is ready, do this.
  viewProfile();
  submitForm();
  logoClickable();
  newDoctorSearch();
});
