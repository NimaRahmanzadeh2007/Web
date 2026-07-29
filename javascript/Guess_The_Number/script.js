const btn = document.getElementById("btn");
const input = document.getElementById("input");
const num = Math.floor((Math.random() * 100) + 1);
const message = document.getElementById("message");

btn.onclick = function () {

    if (input.value.trim() !== "") {

        const userGuess = parseInt(input.value.trim());

        if (userGuess > 0 && userGuess <= 100) {
            if (userGuess < num) {
                message.textContent = "Bigger!⬆️";
            }
            else if (userGuess > num) {
                message.textContent = "Smaller!⬇️";
            }
            else {
                message.textContent = "Correct!✅ Now refresh the page for new game!👾";
            }
        }
        else{
            message.textContent = "The Number should be between 1 and 100!⚠️";
        }
    }
    else{
        message.textContent = "First guess the number!⚠️";
    }


}