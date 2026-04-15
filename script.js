// =====================================
// Quantity Measurement App Frontend
// Complete script.js
// Backend Connected + Convert Fixed
// =====================================


// ---------- HTML Elements ----------

const lengthCard = document.getElementById("lengthCard");
const temperatureCard = document.getElementById("temperatureCard");
const volumeCard = document.getElementById("volumeCard");
const weightCard = document.getElementById("weightCard");

const addBtn = document.getElementById("addBtn");
const subBtn = document.getElementById("subBtn");
const divBtn = document.getElementById("divBtn");
const compareBtn = document.getElementById("compareBtn");
const convertBtn = document.getElementById("convertBtn");

const fromValue = document.getElementById("fromValue");
const toValue = document.getElementById("toValue");

const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");

const resultBtn = document.getElementById("resultBtn");
const resultText = document.getElementById("resultText");
const resultContainer = document.getElementById("resultContainer");

const historyLink = document.querySelector(".history a");


// ---------- Variables ----------

let selectedType = "";
let selectedOperation = "";

const BASE_URL = "http://localhost:8080/api/quantity";


// =====================================
// Units Data
// =====================================

const units = {

    length: [
        "FEET",
        "INCHES",
        "YARDS",
        "CENTIMETERS"
    ],

    temperature: [
        "CELSIUS",
        "FAHRENHEIT",
        "KELVIN"
    ],

    volume: [
        "MILLILITER",
        "LITER",
        "GALLON"
    ],

    weight: [
        "MILLIGRAM",
        "GRAM",
        "KILOGRAM",
        "TONNE",
        "POUND"
    ]
};


// =====================================
// Measurement Type Mapping
// =====================================

const measurementMap = {
    length: "LENGTH",
    temperature: "TEMPERATURE",
    volume: "VOLUME",
    weight: "WEIGHT"
};


// =====================================
// Load Units
// =====================================

function loadUnits(type) {

    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    const arr = units[type];

    for (let i = 0; i < arr.length; i++) {

        fromUnit.innerHTML +=
            `<option value="${arr[i]}">${arr[i]}</option>`;

        toUnit.innerHTML +=
            `<option value="${arr[i]}">${arr[i]}</option>`;
    }
}


// =====================================
// Remove Active Classes
// =====================================

function removeActiveCards() {

    lengthCard.classList.remove("active");
    temperatureCard.classList.remove("active");
    volumeCard.classList.remove("active");
    weightCard.classList.remove("active");
}

function removeActiveOperations() {

    addBtn.classList.remove("active");
    subBtn.classList.remove("active");
    divBtn.classList.remove("active");
    compareBtn.classList.remove("active");
    convertBtn.classList.remove("active");
}


// =====================================
// Enable / Disable TO Value
// =====================================

function enableToValue() {

    toValue.disabled = false;
    toValue.placeholder = "Enter Number";
}

function disableToValue() {

    toValue.disabled = true;
    toValue.value = 0;
    toValue.placeholder = "Auto";
}


// =====================================
// Type Selection
// =====================================

lengthCard.onclick = function () {

    removeActiveCards();
    lengthCard.classList.add("active");

    selectedType = "length";
    loadUnits("length");
};

temperatureCard.onclick = function () {

    removeActiveCards();
    temperatureCard.classList.add("active");

    selectedType = "temperature";
    loadUnits("temperature");
};

volumeCard.onclick = function () {

    removeActiveCards();
    volumeCard.classList.add("active");

    selectedType = "volume";
    loadUnits("volume");
};

weightCard.onclick = function () {

    removeActiveCards();
    weightCard.classList.add("active");

    selectedType = "weight";
    loadUnits("weight");
};


// =====================================
// Operation Selection
// =====================================

addBtn.onclick = function () {

    removeActiveOperations();
    addBtn.classList.add("active");

    selectedOperation = "add";
    enableToValue();
};

subBtn.onclick = function () {

    removeActiveOperations();
    subBtn.classList.add("active");

    selectedOperation = "subtract";
    enableToValue();
};

divBtn.onclick = function () {

    removeActiveOperations();
    divBtn.classList.add("active");

    selectedOperation = "divide";
    enableToValue();
};

compareBtn.onclick = function () {

    removeActiveOperations();
    compareBtn.classList.add("active");

    selectedOperation = "compare";
    enableToValue();
};

convertBtn.onclick = function () {

    removeActiveOperations();
    convertBtn.classList.add("active");

    selectedOperation = "convert";
    disableToValue();
};


// =====================================
// Result Button
// =====================================

resultBtn.onclick = async function () {

    if (selectedType === "") {
        showResult("Please Select Type");
        return;
    }

    if (selectedOperation === "") {
        showResult("Please Select Operation");
        return;
    }

    if (fromValue.value === "") {
        showResult("Please Enter FROM Value");
        return;
    }

    if (selectedOperation !== "convert" && toValue.value === "") {
        showResult("Please Enter TO Value");
        return;
    }


    const requestData = {

        q1: {
            value: Number(fromValue.value),
            unit: fromUnit.value,
            measurementType: measurementMap[selectedType]
        },

        q2: {
            value: selectedOperation === "convert"
                ? 0
                : Number(toValue.value),

            unit: toUnit.value,
            measurementType: measurementMap[selectedType]
        },

        targetUnit: {
            value: 0,
            unit: toUnit.value,
            measurementType: measurementMap[selectedType]
        }
    };


    let endPoint = "";

    if (selectedOperation === "add")
        endPoint = "/add";

    else if (selectedOperation === "subtract")
        endPoint = "/subtract";

    else if (selectedOperation === "divide")
        endPoint = "/divide";

    else if (selectedOperation === "compare")
        endPoint = "/compare";

    else if (selectedOperation === "convert")
        endPoint = "/convert";


    try {

        showResult("Loading...");

        const response = await fetch(BASE_URL + endPoint, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(requestData)
        });


        if (!response.ok) {
            throw new Error("Server Error");
        }


        const data = await response.json();


        // Compare returns boolean
        if (selectedOperation === "compare") {

            if (data === true)
                showResult("Both Quantities Are Equal");
            else
                showResult("Both Quantities Are Not Equal");
        }

        // Divide returns number
        else if (selectedOperation === "divide") {

            showResult("Result = " + data);
        }

        // Others return QuantityDTO
        else {

            showResult("Result = " + data.value + " " + data.unit);
        }

    }
    catch (error) {

        showResult("Backend Connection Error");
        console.log(error);
    }

};


// =====================================
// Show Result
// =====================================

function showResult(message) {

    resultContainer.style.display = "flex";
    resultText.innerText = message;
}


// =====================================
// History Login Check
// =====================================

historyLink.onclick = function (e) {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (token) {
        window.location.href = "history.html";
    } else {
        window.location.href = "LoginForm.html";
    }
};