const container = document.getElementById("container");

async function getProducts() {


    try {
        const response = await fetch("https://fakestoreapi.com/products");

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();


        data.forEach(product => {

            const productCard = document.createElement("div");
            productCard.classList.add("productCards");

            const productImage = document.createElement("img");
            const title = document.createElement("h2");
            const price = document.createElement("h3");
            const category = document.createElement("h3");

            const priceTitle = document.createElement("h3");
            const categoryTitle = document.createElement("h3");

            const containerOfImage = document.createElement("div");
            const containerOfTitle = document.createElement("div");
            const containerOfPrice = document.createElement("div");
            const containerOfCategory = document.createElement("div");
            
            containerOfImage.classList.add("imageContainer");
            containerOfTitle.classList.add("title");
            containerOfPrice.classList.add("textContainer");
            containerOfCategory.classList.add("textContainer");

            priceTitle.textContent = "Price: ";
            categoryTitle.textContent = "Category: ";


            productImage.classList.add("imgs");
            title.classList.add("titles");
            price.classList.add("prices");
            category.classList.add("categories");

            productImage.alt = product.title;

            productImage.src = product.image;
            title.textContent = product.title;
            price.textContent = product.price;
            category.textContent = product.category;

            containerOfImage.appendChild(productImage);

            containerOfTitle.appendChild(title);

            containerOfPrice.appendChild(priceTitle);
            containerOfPrice.appendChild(price);

            containerOfCategory.appendChild(categoryTitle);
            containerOfCategory.appendChild(category);

            productCard.appendChild(containerOfImage);
            productCard.appendChild(containerOfTitle);
            productCard.appendChild(containerOfPrice);
            productCard.appendChild(containerOfCategory);

            container.appendChild(productCard);

        });
    }
    catch (error) {
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("errorMessages");

        const errorMessageText = document.createElement("h3");
        errorMessageText.classList.add("errorMessagesTexts");

        errorMessageText.textContent = error.message;

        errorMessage.appendChild(errorMessageText);

        container.appendChild(errorMessage);
    }

}

getProducts();