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

function getDataFromApi(lat, lng, healthPlan, specialty, gender) {
  console.log(specialty);
  const doctors = {
    url: BETTERDOCTOR_SEARCH_URL,
    data: {
      location: `${lat}, ${lng}, 50`,
      skip: 0,
      limit: 25,
      // insurance_uid: healthPlan,
      specialty_uid: specialty,
      gender: gender,
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

function getGenderFromApi() {
    const gender = {
    url: BETTERDOCTOR_SEARCH_URL,
    data: {
      skip: 0,
      limit: 100,
      user_key: '38a5e05a1ba6c75134d6d9a0497c51c0'
    },
    dataType: 'json',
    type: 'GET',
    success: function(response) {
      let dropdown = $('#gender-dropdown');
      dropdown.empty();
      console.log(response);
      response.data.map(function (gender, index) {
        dropdown.append($(`<option>${gender}</option>`).attr('value', gender));
      })

    },
    error: function(error) {
      console.log('test', error);
    }
  }
  $.ajax(gender);
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
    getLatLong(zipCode, healthPlan, specialty, gender);
    showDoctors();
  });
}

function getLatLong(zipCode, healthPlan, specialty, gender) {
  // get lat lng from Google Maps

  geocoder.geocode({'address': zipCode}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      getDataFromApi(lat, lng, healthPlan, specialty, gender);
      map.setCenter(new google.maps.LatLng(lat,lng));
    } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}

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
    var index = $(this).attr("data-index");
    state.selectedDoctor = state.doctors[index];
    showProfile();
  });
}

function renderProfile(index, data) {
  let selectedDoctor = state.selectedDoctor;
  // let distance = Math.round(index.practices[0].distance);
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
        <p>${selectedDoctor.practices[0].insurance_uids}</p>
        <p>Accepting new patients: ${selectedDoctor.practices[0].accepts_new_patients}</p>
        <p>Languages: ${selectedDoctor.practices[0].languages[0].name}</p>
        <p class="phone">Contact: ${selectedDoctor.practices[0].phones[0].number}</p>
      </div>
    </div>
    <br>`;

  $("#doc-profile").html(html);
  formatPhone(); 
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
  state.doctors.forEach((item, index) => { 
    console.log(item.practices[0]);
    var uluru = {lat: item.practices[0].lat, lng: item.practices[0].lon};
    var marker = new google.maps.Marker ({
    position: uluru,
    map: map
    });
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
    '<div id="bodyContent">'+
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the '+
    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
    'south west of the nearest large town, Alice Springs; 450&#160;km '+
    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
    'features of the Uluru - Kata Tjuta National Park. Uluru is '+
    'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
    'Aboriginal people of the area. It has many springs, waterholes, '+
    'rock caves and ancient paintings. Uluru is listed as a World '+
    'Heritage Site.</p>'+
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
    '(last visited June 22, 2009).</p>'+
    '</div>'+
    '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  });
}

function formatPhone() {
  $(".phone").text(function(i, text) {
    text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "$1-$2-$3");
    return text;
  });
}

//info-window on practices

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

$(function() {
  // When the document is ready, do this.
  getSpecialtiesFromApi();
  getGenderFromApi();
  viewProfile();
  submitForm();
  logoClickable();
  newDoctorSearch();
});
