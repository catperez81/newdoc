var state = {
  currentScore: 0,
  currentQuestionIndex: 0
};

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

/* start quiz */
function startQuiz() {
  $(".start-cta").on("click", function() {
    $("#start-quiz").hide();
    renderNewQuestion();

    $(".quiz-question, #quiz-tracking").show("slow");
  });
}

/* check answer */
function checkAnswer() {
  $(".question-input").prop("disabled", true);
  let currentQuestion = storeQuestions.questions[state.currentQuestionIndex];
  const checked = $("input[name=badass-woman]:checked").val();

  if (checked == currentQuestion.correctAnswer) {
    keepScore();
  } else {
    return`
      <div class="wrong-answer">
        <p>Sorry. Wrong badass woman!</p>
      </div>`;
    // TODO: SHOW THIS SOMEWHERE.

    // $("#myModal").show("slow");
    // $(".modal-header").text(
    //   "Good guess, but the right badass woman is " +
    //     currentQuestion.correctAnswer +
    //     "!"
    // );
    // closeModal();
  }
  $(`#label-${currentQuestion.correctAnswer}`).addClass("green");
  return true;
}

/* keep score */
function keepScore() {
  state.currentScore++;
  $(".quiz-score").text("You got " + state.currentScore + " right");
}

/* final score */
function finalScore() {
  const scoreSum = state.currentScore * 10 + "%";
  $(".final-score").text(scoreSum);
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

/* submit -> show next question & increment question count */
function submitListener() {
  $("#question-form").submit(onSubmit);
  $(document).keyup(function() {
    if (event.keyCode == 13) {
      onSubmit(event);
    }
  });
}

function onSubmit(event) {
  event.preventDefault();
  let currentQuestion = storeQuestions.questions[state.currentQuestionIndex];
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex < storeQuestions.questions.length) {
    renderNewQuestion();
  } else {
    showScorePage();
  }
}

function showScorePage() {
  $("#quiz-question, #quiz-tracking").hide();
  $(".final-score").text(finalScore);
  $("#results").show("slow");
  if (state.currentScore <= 4) {
    $("#bad-results").show("slow");
    $("#good-results").hide();
  } else {
    $("#good-results").show("slow");
    $("#bad-results").hide();
  }
}
/* restart the quiz - reset everything */
function newQuiz() {
  $(".take-quiz-cta").on("click", function() {
    $("#results").hide();
    $("#bad-results").hide();
    $("#good-results").hide();
    $("#start-quiz").show();
    $("#quiz-question, #quiz-tracking").hide();
    state.currentQuestionIndex = 0;
    state.currentScore = 0;
    $(".quiz-score").text("None right so far");
  });
}

/* call the functions */
$(function() {
  startQuiz();
  submitListener();
  newQuiz();
});
