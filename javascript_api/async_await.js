async function getUsers() {

    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    console.log("\nThe Usernames of the users:");
    data.forEach(user => {
        console.log(user.username);
    });
    console.log("\nThe Data of user 8:");
    console.log(data[9]);
    console.log("\nThe email of user 4:");
    console.log(data[5].email);
    console.log("\n\n");

}

getUsers();