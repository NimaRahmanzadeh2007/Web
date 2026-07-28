const button = document.getElementById("btn");

button.onclick = function () {
    
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

    const random = Math.floor(Math.random()*colors.length);

    document.body.style.backgroundColor = colors[random]

    

}