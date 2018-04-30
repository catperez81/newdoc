// const BETTERDOCTOR_SEARCH_URL = 'https://api.betterdoctor.com/2016-03-01/doctors?location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=0&limit=10&user_key=38a5e05a1ba6c75134d6d9a0497c51c0';
const BETTERDOCTOR_SEARCH_URL = 'https://api.betterdoctor.com/2016-03-01/doctors'
const GOOGLE_MAPS_URL = 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDgtJKYyrzY5_6OL13gObxN43d4lgNhOKc'

function getDataFromApi(lat,lng) {
  const maps ={
    url: GOOGLE_MAPS_URL,
    data: {
      location: `${lat}, ${lng}`,
      accuracy: 100
    }
  }
  const settings = {
    url: BETTERDOCTOR_SEARCH_URL,
    data: { 
      location: `${lat}, ${lng}, 100`,
      skip: 0,
      limit: 25,
      user_key: '38a5e05a1ba6c75134d6d9a0497c51c0'
    },
    dataType: 'json',
    type: 'GET',
    success: function(response) {
      results(response.data);
    },
    error: function(error) {
      console.log(error);
    }
  };

  $.ajax(settings, maps);
}

/* Pass through all results */
function results(doctors){
  const results = doctors.map((item, index) => renderDoctor(item));
  $('#doc-results').html(results);
  console.log(doctors);
}

// function renderMap(map){

// }

/* Pass through each single result */
function renderDoctor(doctor) {
  let distance=Math.round(doctor.practices[0].distance);
  return `
  <div class="card-content">
    <div class="doc-image">
      <img src="${doctor.profile.image_url}" class="img-circle"> 
    </div>
    <div class="doctor-info">
      <h3>${doctor.profile.first_name} ${doctor.profile.last_name}</h3>
      <p>${doctor.profile.gender}</p>
      <p>${doctor.practices[0].visit_address.street}, ${doctor.practices[0].visit_address.city}, ${doctor.practices[0].visit_address.state_long}</p>
      <p>${distance} miles away</p>
      <p>${doctor.specialties[0].name}</p>
    </div>
    <div class="doctor-profile-button">
      <button class="btn btn-default" id="doctor-profile" type="button">View profile</button>
    </div>
  </div>
  <br>`
}

/* render doctor profile */
function viewProfile() {
  $("#doctor-profile").on("click", function(){
    console.log('test');
    $("#doc-results").hide();
    $("#doc-search-form").hide();
    $("#doc-profile").show();
  // return `
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
  });
}

viewProfile();

function logoClickable() {
  $("#logo").on("click", function(){
    $("#doc-results").hide();
    $("#doc-profile").hide();
    $('#doc-search-form').show();
  });
}

/* submit doctor search form */
function submitForm() {
  $("#findadoc").submit(function(event) {
    event.preventDefault();
    let zipCode = $('#zip').val();
    $('#zip').val('');
    let gender = $('#gender-dropdown').val();
    // let healthPlan = $('#plan-dropdown').val();
    // let specialty = $('#specialty-dropdown').val();
    $("#doc-search-form").hide();
    $("#doc-results").show();
    getLatLong(zipCode);
  });
}

function getLatLong(zipCode) {
 // get lat lng from Google Maps // 
  getDataFromApi(37.755117, -122.457847);
}

/* new search */
function newDoctorSearch() {
  $(".new-search").on("click", function() {
    $("#doc-results").hide();
    $("#doc-search-form").show();
  });
}

submitForm();
logoClickable();
newDoctorSearch();
 
