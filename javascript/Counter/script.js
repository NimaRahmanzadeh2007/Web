let num = 0;
const count = document.getElementById("count");
const plus = document.getElementById("plus");
const minus = document.getElementById("minus");


plus.onclick = function () {
    num++;
    count.textContent = num;
}

minus.onclick = function () {
    num--;
    count.textContent = num;
}
