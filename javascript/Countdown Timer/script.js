const timeText = document.getElementById("timeText");
const input = document.getElementById("input");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

let totalSeconds = 0;

let second = 0;
let minute = 0;

let timer;

function countdown() {

    if (second > 0) {
        second--;
    }
    else if (minute > 0) {
        minute--;
        second = 59;
    }
    else {
        clearInterval(timer);
        timeText.textContent = "00:00";
        alert("Time's up!");
        return;
    }

    timeText.textContent = `${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;


}

function countdownStart() {


    totalSeconds = parseInt(input.value.trim());

    minute = Math.floor(totalSeconds / 60);
    second = totalSeconds % 60;

    timeText.textContent =
        `${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;

    input.value = "";

    timer = setInterval(countdown, 1000);
}

function countdownStop() {

    clearInterval(timer);
    timer = null;
}

function countdownReset() {

    clearInterval(timer);
    timer = null;

    minute = 0;
    second = 0;

    timeText.textContent = "00:00";


}




startBtn.onclick = countdownStart;
stopBtn.onclick = countdownStop;
resetBtn.onclick = countdownReset;

