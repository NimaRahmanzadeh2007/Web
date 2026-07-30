const btn = document.getElementById("btn");
const input = document.getElementById("input");

btn.addEventListener("click", function () {

    if (input.value.trim() !== "") {
        const task = document.createElement("div")
        task.className = "task";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        task.appendChild(checkbox);

        const text = document.createElement("p");
        text.className = "checkItemTextStyle"

        text.innerText = input.value.trim();

        task.appendChild(text);

        document.getElementById("list").appendChild(task);

        input.value = "";
    }
    else {
        window.alert("Please type a task first!");
    }

});
