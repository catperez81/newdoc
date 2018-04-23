/* submit doctor search form */
function submitForm() {
  $(".start-header").on("click", ".start-cta", function() {
    event.preventDefault();
    $("#doc-search-form").hide();
    $("#doc-results").show("slow");
    doctorList();
  });
}

/* template to pass through each question from the object */
function buildTemplate(question) {
  $("#question-text").text(question.questionText);
  let answers = question.questionOptions.map((currentQuestion, index) => {
    return `
    <label id="label-${index}">
      <input type="radio" name="badass-woman" class="question-input" value="${index}" required>
      ${currentQuestion}
    </label>
    <br>`;
  });

  $("#answer-group").html(answers);
}

/* render new question */
function renderNewQuestion() {
  $(".current-question").text(state.currentQuestionIndex + 1);
  $(".question-list").html(
    buildTemplate(storeQuestions.questions[state.currentQuestionIndex])
  );
  $(".question-input").click(checkAnswer);
  $("#quiz-question, #quiz-tracking").show("slow");
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
