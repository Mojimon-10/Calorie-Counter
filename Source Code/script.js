let restaurants = [];

const restaurantSelect = document.getElementById("restaurantSelect");
const foodSelect = document.getElementById("foodSelect");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const message = document.getElementById("message");

const restaurantLogo = document.getElementById("restaurantLogo");

const restaurantValue = document.getElementById("restaurantValue");
const foodValue = document.getElementById("foodValue");
const calorieValue = document.getElementById("calorieValue");
const typeValue = document.getElementById("typeValue");

async function loadData() {
    try {
        const response = await fetch("./foods.json");
        restaurants = await response.json();
        populateRestaurants();
    } catch (error) {
        console.error(error);
        message.textContent = "Failed to load data.";
    }
}

function populateRestaurants() {
    restaurants.sort((a, b) => a.restaurant.localeCompare(b.restaurant));

    restaurants.forEach(restaurant => {
        const option = document.createElement("option");
        option.value = restaurant.restaurant;
        option.textContent = restaurant.restaurant;
        restaurantSelect.appendChild(option);
    });
}

function populateFoods() {
    foodSelect.innerHTML = `
        <option value="">
            Select Food Item
        </option>
    `;

    const selectedRestaurant = restaurantSelect.value;

    clearDisplay();

    if (selectedRestaurant === "") {
        restaurantLogo.style.display = "none";
        return;
    }

    const logoName = selectedRestaurant
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    restaurantLogo.src = `images/${logoName}.png`;
    restaurantLogo.style.display = "block";
    restaurantLogo.onerror = () => {
        restaurantLogo.style.display = "none";
    };

    const restaurant = restaurants.find(
        r => r.restaurant === selectedRestaurant
    );

    if (!restaurant || !restaurant.foodItems) {
        return;
    }

    restaurant.foodItems.sort((a, b) => a.foodName.localeCompare(b.foodName));

    restaurant.foodItems.forEach(food => {
        const option = document.createElement("option");
        option.value = food.foodName;
        option.textContent = food.foodName;
        foodSelect.appendChild(option);
    });
}

function searchFood() {
    message.textContent = "";

    const selectedRestaurant = restaurantSelect.value;
    const selectedFood = foodSelect.value;

    if (selectedRestaurant === "") {
        message.textContent = "Please select a restaurant.";
        return;
    }

    if (selectedFood === "") {
        message.textContent = "Please select a food item.";
        return;
    }

    const restaurant = restaurants.find(
        r => r.restaurant === selectedRestaurant
    );

    if (!restaurant) {
        message.textContent = "Restaurant not found.";
        return;
    }

    const food = restaurant.foodItems.find(
        f => f.foodName === selectedFood
    );

    if (!food) {
        message.textContent = "No matching food found.";
        return;
    }

    restaurantValue.textContent = restaurant.restaurant;
    foodValue.textContent = food.foodName;
    calorieValue.textContent = food.calories ?? "—";
    typeValue.textContent = food.foodType || "N/A";
}

function clearDisplay() {
    restaurantValue.textContent = "—";
    foodValue.textContent = "—";
    calorieValue.textContent = "—";
    typeValue.textContent = "—";
}

function clearResults() {
    restaurantSelect.selectedIndex = 0;
    foodSelect.innerHTML = `
        <option value="">
            Select Food Item
        </option>
    `;
    restaurantLogo.style.display = "none";
    restaurantLogo.src = "";
    message.textContent = "";
    clearDisplay();
}

restaurantSelect.addEventListener("change", populateFoods);
foodSelect.addEventListener("change", searchFood);
searchBtn.addEventListener("click", searchFood);
clearBtn.addEventListener("click", clearResults);

loadData();