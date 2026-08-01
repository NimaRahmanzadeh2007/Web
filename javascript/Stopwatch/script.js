const timeText = document.getElementById("time");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

let centiseconds = 0;
let seconds = 0;
let minutes = 0;

function stopwatch() {


    centiseconds++;

    if (centiseconds >= 100) {
        centiseconds = 0;
        seconds += 1;
    }
    if (seconds >= 60) {
        seconds = 0;
        minutes += 1;
    }


    timeText.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${centiseconds.toString().padStart(2, "0")}`;

}

let timer;

function stopwatchStart() {
    if (!timer) {
        timer = setInterval(stopwatch, 10);
    }
}
function stopwatchStop() {
    clearInterval(timer);
    timer = null;
}
function stopwatchReset() {

    clearInterval(timer);
    timer = null;

    centiseconds = 0;
    seconds = 0;
    minutes = 0;

    timeText.textContent = "00:00:00";

}

startBtn.onclick = stopwatchStart;
stopBtn.onclick = stopwatchStop;
resetBtn.onclick = stopwatchReset;


