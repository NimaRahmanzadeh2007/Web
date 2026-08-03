const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");

let expression = "";

let calculated = false;

buttons.forEach(function (button) {

    button.addEventListener("click", function (event) {


        const value = event.target.innerText;


        if (value == "C") {
            expression = "";
            display.innerText = "0";
            calculated = false;
            return;
        }
        if (value == "=") {
            try {
                const result = eval(expression);
                display.innerText = result;
                expression = result.toString();
                calculated = true;
                return;
            }
            catch {
                expression = "";
                display.innerText = "Err";
            }
        }

        expression += value;
        display.innerText = expression;






    });

});