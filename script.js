const questions = [
    {
        question: "Which language is used to structure a web page?",
        options: ["CSS", "HTML", "JavaScript", "Python"],
        answer: "HTML"
    },

    {
        question: "Which language is used to style a web page?",
        options: ["HTML", "CSS", "Python", "SQL"],
        answer: "CSS"
    },

    {
        question: "Which language is mainly used to add interactivity to websites?",
        options: ["HTML", "CSS", "JavaScript", "MySQL"],
        answer: "JavaScript"
    },

    {
        question: "Which tag is used to create a paragraph in HTML?",
        options: ["<p>", "<h1>", "<div>", "<br>"],
        answer: "<p>"
    },

    {
        question: "Which property is used to change text color in CSS?",
        options: ["font-size", "color", "background", "text-style"],
        answer: "color"
    },

    {
        question: "Which keyword declares a variable in JavaScript?",
        options: ["var", "variable", "define", "int"],
        answer: "var"
    },

    {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["//", "#", "<!-- -->", "**"],
        answer: "//"
    },

    {
        question: "Which HTML element is used to create a button?",
        options: ["<button>", "<btn>", "<inputbutton>", "<click>"],
        answer: "<button>"
    },

    {
        question: "Which CSS layout system is used for one-dimensional layouts?",
        options: ["Grid", "Flexbox", "Table", "Float"],
        answer: "Flexbox"
    },

    {
        question: "Which method is used to select an element by ID in JavaScript?",
        options: [
            "getElementById()",
            "getElement()",
            "selectById()",
            "findId()"
        ],
        answer: "getElementById()"
    }
];


let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);

let timeLeft = 60;
let timerInterval;


/* Get HTML elements */

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");

const questionNumberElement =
    document.getElementById("questionNumber");

const progressBar =
    document.getElementById("progressBar");

const timerElement =
    document.getElementById("timer");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const submitBtn =
    document.getElementById("submitBtn");

const quizContainer =
    document.querySelector(".quiz-container");

const resultSection =
    document.getElementById("resultSection");

const scoreElement =
    document.getElementById("score");

const resultMessage =
    document.getElementById("resultMessage");

const restartBtn =
    document.getElementById("restartBtn");


/* Display Question */

function displayQuestion() {

    const current = questions[currentQuestion];

    questionElement.textContent = current.question;

    questionNumberElement.textContent =
        `${currentQuestion + 1} / ${questions.length}`;

    optionsElement.innerHTML = "";


    current.options.forEach(function(option, index) {

        const label = document.createElement("label");

        label.classList.add("option");

        label.innerHTML = `
            <input 
                type="radio"
                name="answer"
                value="${option}"
            >

            <span>${option}</span>
        `;

        optionsElement.appendChild(label);

    });


    /* Restore previous answer */

    if (userAnswers[currentQuestion] !== null) {

        const selected = document.querySelector(
            `input[value="${userAnswers[currentQuestion]}"]`
        );

        if (selected) {
            selected.checked = true;
        }
    }


    /* Progress */

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    progressBar.style.width = progress + "%";


    /* Previous button */

    if (currentQuestion === 0) {
        previousBtn.style.display = "none";
    } else {
        previousBtn.style.display = "block";
    }


    /* Last question */

    if (currentQuestion === questions.length - 1) {

        nextBtn.style.display = "none";
        submitBtn.style.display = "block";

    } else {

        nextBtn.style.display = "block";
        submitBtn.style.display = "none";

    }
}


/* Save Answer */

function saveAnswer() {

    const selected =
        document.querySelector(
            'input[name="answer"]:checked'
        );

    if (selected) {

        userAnswers[currentQuestion] =
            selected.value;

        localStorage.setItem(
            "quizAnswers",
            JSON.stringify(userAnswers)
        );

        return true;
    }

    return false;
}


/* Next Question */

nextBtn.addEventListener("click", function() {

    if (!saveAnswer()) {

        alert("Please select an answer.");

        return;
    }

    currentQuestion++;

    displayQuestion();

});


/* Previous Question */

previousBtn.addEventListener("click", function() {

    saveAnswer();

    currentQuestion--;

    displayQuestion();

});


/* Submit Quiz */

submitBtn.addEventListener("click", function() {

    if (!saveAnswer()) {

        alert("Please select an answer.");

        return;
    }

    calculateScore();

});


/* Calculate Score */

function calculateScore() {

    clearInterval(timerInterval);

    let score = 0;

    questions.forEach(function(question, index) {

        if (userAnswers[index] === question.answer) {
            score++;
        }

    });


    quizContainer.style.display = "none";

    resultSection.style.display = "block";


    scoreElement.textContent =
        `${score} / ${questions.length}`;


    if (score >= 8) {

        resultMessage.textContent =
            "Excellent! You have a very good knowledge.";

    } else if (score >= 5) {

        resultMessage.textContent =
            "Good job! Keep practicing.";

    } else {

        resultMessage.textContent =
            "Keep learning and try again.";

    }

}


/* Timer */

function startTimer() {

    timerInterval = setInterval(function() {

        timeLeft--;

        timerElement.textContent = timeLeft;


        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            alert("Time is over!");

            calculateScore();

        }

    }, 1000);

}


/* Restart Quiz */

restartBtn.addEventListener("click", function() {

    currentQuestion = 0;

    userAnswers =
        new Array(questions.length).fill(null);

    localStorage.removeItem("quizAnswers");

    timeLeft = 60;

    timerElement.textContent = timeLeft;

    resultSection.style.display = "none";

    quizContainer.style.display = "block";

    startTimer();

    displayQuestion();

});


/* Load Saved Answers */

const savedAnswers =
    localStorage.getItem("quizAnswers");

if (savedAnswers) {

    userAnswers =
        JSON.parse(savedAnswers);

}


/* Start Quiz */

displayQuestion();

startTimer();