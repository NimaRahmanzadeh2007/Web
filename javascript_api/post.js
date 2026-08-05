async function postData() {

    const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: "Learning API",
                body: "JavaScript is awesome",
                userId: 7
            })

        }
    );

    const data = await response.json();
    console.log(data);

    console.log("\n");
    console.log(data.id);
    console.log(data.title);


}

postData();