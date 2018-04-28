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
  // map results here //
  const results = doctors.map((item, index) => renderDoctor(item));
  $('#doc-results').html(results);
  console.log(doctors);
}

function renderMap(map){
  
}

/* Pass through each single result */
function renderDoctor(doctor) {
  return `
  <div class="card-content">
    <div class="doctor-info">
      <h3>${doctor.profile.first_name} ${doctor.profile.last_name}</h3>
      <p>${doctor.profile.gender}</p>
      <p>${doctor.practices.website}</p>
      <p>${doctor.specialties.specialty_uid}</p>
    </div>
    <div class="doctor-profile-button">
    <button class="btn btn-default doctor-profile" type="submit">View details</button>
    </div>
  </div>
    <br>`
}

function logoClickable(){
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
    console.log('test');
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

console.log('random');

function getLatLong(zipCode) {
 // get lat lng from Google Maps // 
  getDataFromApi(37.755117, -122.457847);
}

submitForm();

/* restart the search */
function newDoctorSearch() {
  $(".new-search").on("click", function() {
    $("#doc-results").hide();
    $("#doc-search-form").show();
  });
}

newDoctorSearch();


/* render doctor profile */
function doctorProfile() {
  $(".doctor-profile").on("click", function() {
    $("#doc-results").hide();
    $("#doc-search-form").hide();
    $("#doc-profile").show();
  });
}

doctorProfile();
logoClickable();
 
