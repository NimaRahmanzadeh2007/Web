fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json()
        .then(data => {

            console.log("\nThe users emails:\n");
            data.forEach(user => {
                console.log(user.email);

            });

            console.log("\nData of user 5:\n");
            console.log(data[6]);

            console.log("\nThe users usernames:");
            data.forEach(user => {
                console.log(user.username);

            });


        }));