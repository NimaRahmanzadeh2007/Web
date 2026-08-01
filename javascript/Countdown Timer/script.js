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
        alert("Time's up!");
    }

    timeText.textContent = `${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;


}

function countdownStart() {

    totalSeconds = input.value.trim();

    minute = Math.floor(totalSeconds / 60);
    second = totalSeconds % 60;

    timer = setInterval(countdown, 1000);
}

function countdownStop() {

    clearInterval(timer);

}

function countdownReset() {




}




startBtn.onclick = countdownStart;
stopBtn.onclick = countdownStop;
resetBtn.onclick = countdownReset;

