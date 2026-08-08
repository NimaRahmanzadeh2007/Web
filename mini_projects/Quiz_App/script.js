const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlink Text Management Language",
            "Home Tool Markup Language"
        ],
        correct: "Hyper Text Markup Language"
    },

    {
        question: "Which language is mainly used to style web pages?",
        answers: [
            "JavaScript",
            "Python",
            "CSS",
            "C#"
        ],
        correct: "CSS"
    },

    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        answers: [
            "define",
            "let",
            "variable",
            "declare"
        ],
        correct: "let"
    },

    {
        question: "Which method is used to select an element by its ID?",
        answers: [
            "getElementById()",
            "getElement()",
            "selectById()",
            "queryId()"
        ],
        correct: "getElementById()"
    },

    {
        question: "Which symbol is used for a single-line comment in JavaScript?",
        answers: [
            "#",
            "<!-- -->",
            "//",
            "/* */"
        ],
        correct: "//"
    },

    {
        question: "Which method converts a JSON string into a JavaScript object?",
        answers: [
            "JSON.convert()",
            "JSON.parse()",
            "JSON.object()",
            "JSON.stringify()"
        ],
        correct: "JSON.parse()"
    },

    {
        question: "Which array method adds an element to the end of an array?",
        answers: [
            "push()",
            "pop()",
            "shift()",
            "unshift()"
        ],
        correct: "push()"
    },

    {
        question: "What does DOM stand for?",
        answers: [
            "Document Object Model",
            "Data Object Management",
            "Document Oriented Method",
            "Dynamic Object Model"
        ],
        correct: "Document Object Model"
    },

    {
        question: "Which event occurs when a user clicks an element?",
        answers: [
            "hover",
            "change",
            "click",
            "submit"
        ],
        correct: "click"
    },

    {
        question: "Which function is used to run code repeatedly after a fixed time interval?",
        answers: [
            "setTimeout()",
            "setInterval()",
            "repeat()",
            "runEvery()"
        ],
        correct: "setInterval()"
    }
];


let questionIndex = 0;
let scoreCount = 0;


const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("question");
const answersContainer = document.getElementById("answers");
const score = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");


function showQuestion() {

    const currentQuestion = questions[questionIndex];

    questionNumber.innerText =
        `Question ${questionIndex + 1} of ${questions.length}`;

    questionText.innerText = currentQuestion.question;

    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach(function (answer) {

        const answerBtn = document.createElement("button");

        answerBtn.classList.add("answerBtn");

        answerBtn.innerText = answer;

        answersContainer.appendChild(answerBtn);

    });
}


nextBtn.addEventListener("click", function () {

    questionIndex++;

    if (questionIndex < questions.length) {

        showQuestion();

    }

});


showQuestion();