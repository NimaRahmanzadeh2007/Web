const name = document.getElementById("name");

const btn = document.getElementById("btn");

let message = document.getElementById("message");

btn.onclick = function () {

    if (name.value != "") {
        message.textContent = "Hello " + name.value + "!";
        name.value = "";
    }
    else{
        message.textContent = "There's no name in the box!";
    }
}