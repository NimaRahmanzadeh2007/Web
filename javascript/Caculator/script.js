const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");

let currentInput = "";

buttons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        const value = event.target.innerText;

        if (value == "=") {
            const result = eval(currentInput);
            display.innerText = result;
            currentInput = result;
            return
        }
        else if(value == "C"){
            const result = 0;
            display.innerText = result;
            currentInput = "";
            return;
        }

        currentInput += value;
        display.innerText = currentInput;

    });

});
