let restaurants = [];

const restaurantLogo =
    document.getElementById("restaurantLogo");

const restaurantSelect =
    document.getElementById("restaurantSelect");

const foodSelect =
    document.getElementById("foodSelect");

const searchBtn =
    document.getElementById("searchBtn");

const clearBtn =
    document.getElementById("clearBtn");

const resultsPanel =
    document.getElementById("resultsPanel");

const message =
    document.getElementById("message");

// LOAD JSON
async function loadData() 
{

    try {

        const response =
            await fetch("./foods.json");

        restaurants =
            await response.json();

        populateRestaurants();

    } catch (error) {

        console.error(error);

        message.textContent =
            "Failed to load data.";
    }
}

// POPULATE RESTAURANTS
function populateRestaurants() 
{

    // Sort restaurants alphabetically
    restaurants.sort((a, b) =>
        a.restaurant.localeCompare(b.restaurant)
    );

    restaurants.forEach(restaurant => {

        const option =
            document.createElement("option");

        option.value =
            restaurant.restaurant;

        option.textContent =
            restaurant.restaurant;

        restaurantSelect.appendChild(option);
    });
}

// UPDATE FOOD DROPDOWN
function populateFoods() 
{

    foodSelect.innerHTML = `
        <option value="">
            Select Food Item
        </option>
    `;

    const selectedRestaurant =
        restaurantSelect.value;

    // Hide logo if none selected
    if (selectedRestaurant === "") {

        restaurantLogo.style.display = "none";

        return;
    }

    // Convert restaurant name to image filename
    const logoName =
        selectedRestaurant
            .toLowerCase()
            .replace(/\s+/g, "");

    // Set image source
    restaurantLogo.src =
        `images/${logoName}.png`;

    restaurantLogo.style.display = "block";

    // Find restaurant
    const restaurant =
        restaurants.find(r =>
            r.restaurant === selectedRestaurant
        );

    // Populate foods
    restaurant.foodItems.sort((a, b) =>
    a.foodName.localeCompare(b.foodName) );

    restaurant.foodItems.forEach(food => {

        const option =
            document.createElement("option");

        option.value =
            food.foodName;

        option.textContent =
            food.foodName;

        foodSelect.appendChild(option);
    });
}

// SEARCH FOOD
function searchFood() 
{

    resultsPanel.innerHTML = "";
    message.textContent = "";

    const selectedRestaurant =
        restaurantSelect.value;

    const selectedFood =
        foodSelect.value;

    // Validation
    if (selectedRestaurant === "") {

        message.textContent =
            "Please select a restaurant.";

        return;
    }

    if (selectedFood === "") {

        message.textContent =
            "Please select a food item.";

        return;
    }

    // Find restaurant
    const restaurant =
        restaurants.find(r =>
            r.restaurant === selectedRestaurant
        );

    // Find food
    const food =
        restaurant.foodItems.find(f =>
            f.foodName === selectedFood
        );

    // Display
    resultsPanel.innerHTML = `
        <div class="food-item">

            <div class="food-name">
                ${food.foodName}
            </div>

            <div class="food-details">
                Type:
                ${food.foodType || "N/A"}
                <br>

                Calories:
                ${food.calories}
            </div>

        </div>
    `;
}

// CLEAR
function clearResults() 
{

    restaurantSelect.selectedIndex = 0;

    foodSelect.innerHTML = `
        <option value="">
            Select Food Item
        </option>
    `;

    resultsPanel.innerHTML = "";

    message.textContent = "";
}

// EVENTS
restaurantSelect.addEventListener(
    "change",
    populateFoods
);

searchBtn.addEventListener(
    "click",
    searchFood
);

clearBtn.addEventListener(
    "click",
    clearResults
);

restaurantSelect.addEventListener(
    "change",
    populateFoods
);

foodSelect.addEventListener(
    "change",
    searchFood
);

searchBtn.addEventListener(
    "click",
    searchFood
);

clearBtn.addEventListener(
    "click",
    clearResults
);

// START
loadData();