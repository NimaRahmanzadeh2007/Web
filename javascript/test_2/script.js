const button = document.getElementById("btn");

const title = document.getElementById("title");

const colors = [
    "red",
    "blue",
    "green",
    "purple",
    "orange",
    "pink",
    "black",
    "gold"
]



button.onclick = function () {

    const random = Math.floor(Math.random() * colors.length);

    document.body.style.backgroundColor = colors[random];

    if (document.body.style.backgroundColor == "black") {
        title.style.color = "white";
    }
    else {
        title.style.color = "black";
    }

    button.textContent = colors[random];

}