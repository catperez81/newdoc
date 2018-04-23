/* submit doctor search form */
function submitForm() {
  $(".start-header").on("click", ".start-cta", function() {
    event.preventDefault();
    $("#doc-search-form").hide();
    $("#doc-results").show("slow");
    doctorList();
  });
}

/* render search results */
function doctorList() {
  
}

/* render doctor profile */
function doctorProfile() {
}

/* restart the search */
function newDoctorSearch() {
  $(" ").on("click", function() {
    $("#doc-search-form").show();
  });
}

/* call the functions */
$(function() {
  submitForm();
});
