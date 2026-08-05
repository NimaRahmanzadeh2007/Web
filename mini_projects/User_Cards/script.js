const container = document.getElementById("container");

async function loading_users() {


    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    const data = await response.json();

    data.forEach(user => {

        const div = document.createElement("div");
        div.classList.add("card");

        const h2 = document.createElement("h2");
        h2.classList.add("username");

        const h3_email = document.createElement("h3");
        h3_email.classList.add("email");

        const h3_phone = document.createElement("h3");
        h3_phone.classList.add("phone");

        h3_email.textContent = user.email;

        h3_phone.textContent = user.phone

        h2.textContent = user.name;

        div.appendChild(h2);
        div.appendChild(h3_email);
        div.appendChild(h3_phone);

        container.appendChild(div);


    });


}

loading_users();