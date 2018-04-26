// const BETTERDOCTOR_SEARCH_URL = 'https://api.betterdoctor.com/2016-03-01/doctors?location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=0&limit=10&user_key=38a5e05a1ba6c75134d6d9a0497c51c0';


// function getDataFromApi(name, callback) {
//   const settings = {
//     url: BETTERDOCTOR_SEARCH_URL,
//     data: [
//     {
//       [
//         "visit_address": {
//           "city": "",
//           "state_long": "",
//           "street": "",
//           "zip": ""
//         },
//       ]
//     },
//       "meta": {
//         "data_type": "array",
//         "item_type": "Doctor",
//         "count": ,
//         "limit": 
//       },
//     dataType: 'json',
//     type: 'GET',
//     success: callback
//   };

//   $.ajax(settings);
// }

// function renderResult(result) {
//   console.log(result);
// }

function displayBetterDoctorSearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  $('#doc-results').html(results);
}

/* submit doctor search form */
function submitForm() {
  $(".start-header").on("click", ".start-cta", function() {
    event.preventDefault();
    $("#doc-search-form").hide();
    $("#doc-results").show();
    // var docs = list.map(doc=>renderDoc())
    // $("#doc-results").html(docs);
    let nameInput = $('#name').val();
    console.log('This variable is', nameInput);
    getDataFromApi(input, displayBetterDoctorSearchData);
  });
}

submitForm();


/* Pass through test results array */
// function renderDoc(result) {
//   let results = results.doctorResult;
//   $(".doctor-list").html( `
//     <div>
//       <h3>${doctorResult.doctorName}</h3>
//       <p>${doctorResult.address}<p>
//       <p>${doctorResult.distance}<p>
//     </div>
//     <br>`
//   );
// }


/* restart the search */
function newDoctorSearch() {
  $("#doc-results").on("click", ".new-search", function() {
    $("#doc-search-form").hide();
    $("#doc-results").show();
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
 
