const timeText = document.getElementById("timeText");
const input = document.getElementById("input");
const startBtn = document.getElementById("start");

let totalSeconds = 0;

let second = 0;
let minute = 0;

function countdown() {

    totalSeconds = input.textContent.trim();

    minute = Math.floor(totalSeconds / 60);
    second = totalSeconds % 60;


}