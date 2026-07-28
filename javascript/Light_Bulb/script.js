const button = document.getElementById("btn");


button.onclick = function () {

    const status = document.getElementById("title");

    if (status.textContent == "OFF") {
        document.body.style.backgroundColor = "yellow";
        status.style.color = "black";
        status.textContent = "ON";
    }
    else {
        document.body.style.backgroundColor = "black";
        status.style.color = "white";
        status.textContent = "OFF";
    }



}