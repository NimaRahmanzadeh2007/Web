const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlink Text Management Language",
            "Home Tool Markup Language"
        ],
        correct: "Hyper Text Markup Language"
    },
    {
        question: "Which language is mainly used to style web pages?",
        options: [
            "JavaScript",
            "Python",
            "CSS",
            "C#"
        ],
        correct: "CSS"
    },
    {
        question: "Which language is mainly used to make web pages interactive?",
        options: [
            "HTML",
            "CSS",
            "Python",
            "JavaScript"
        ],
        correct: "JavaScript"
    },
    {
        question: "Which symbol is used for an ID selector in CSS?",
        options: [
            ".",
            "#",
            "@",
            "$"
        ],
        correct: "#"
    },
    {
        question: "Which method is used to select an element by its ID?",
        options: [
            "document.querySelector()",
            "document.getElementById()",
            "document.getElement()",
            "document.selectId()"
        ],
        correct: "document.getElementById()"
    },
    {
        question: "Which keyword is used to declare a variable that cannot be reassigned?",
        options: [
            "let",
            "var",
            "const",
            "static"
        ],
        correct: "const"
    },
    {
        question: "Which method adds an event listener to an element?",
        options: [
            "addEvent()",
            "addEventListener()",
            "eventListener()",
            "listenEvent()"
        ],
        correct: "addEventListener()"
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Computer Style Sheets",
            "Creative Style System",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        correct: "Cascading Style Sheets"
    },
    {
        question: "Which method converts a string into an integer?",
        options: [
            "parseInt()",
            "toInteger()",
            "NumberInt()",
            "stringToInt()"
        ],
        correct: "parseInt()"
    },
    {
        question: "Which property is used to change the text inside an HTML element?",
        options: [
            "innerText",
            "textChange",
            "changeText",
            "innerHTMLText"
        ],
        correct: "innerText"
    }
];

const submitBtn = document.getElementById("submitBtn");
const optionDiv = document.getElementsByClassName("optionDiv");
const option = document.getElementsByClassName("option");
const questionNumberText = document.getElementById("questionNumberText");
const questionText = document.getElementById("questionText");
const scoreText = document.getElementById("scoreText");


let questionCount = 0;
let score = 0;

let selectedOption = null;


function showQuestion() {

    const currentQuestion = questions[questionCount];

    questionText.innerText = currentQuestion.question;

    currentQuestion.options.forEach((optionText, index) => {
        option[index].innerText = optionText;
    });


    questionNumberText.innerText = `Question ${questionCount + 1} of ${questions.length}`;

    for (let i = 0; i < optionDiv.length; i++) {

        optionDiv[i].addEventListener("click", function () {

            for (let j = 0; j < optionDiv.length; j++) {
                optionDiv[j].classList.remove("selected");
            }

            selectedOption = option[i].innerText;

            optionDiv[i].classList.add("selected");

        });

    }

}

function checkAnswer() {

    const currentQuestion = questions[questionCount];

    if (selectedOption != "" && selectedOption === currentQuestion.correct) {
        score++;
    }

    scoreText.innerText = `Score: ${score}`;

    questionCount++;

    for (let i = 0; i < optionDiv.length; i++) {
        optionDiv[i].classList.remove("selected");
    }

    showQuestion();

}

showQuestion();

submitBtn.addEventListener("click", function () {
    checkAnswer();
});















const changeThemeBtn = document.getElementById("changeThemeBtn");

changeThemeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");
});

