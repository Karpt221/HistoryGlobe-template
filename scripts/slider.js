// DOM Elements  
const yearSlider = document.getElementById('year-slider');
const yearDisplay = document.getElementById('year-input');
const errorMessage = document.getElementById('error-message');

// Colors array for gradient  
const colors = [
    '#3E1F09', // 1100  
    '#614332', // 1200  
    '#856758', // 1300  
    '#A88B7E', // 1400  
    '#CCAFA4', // 1500  
    '#E0C7BF', // 1600  
    '#EFE0DB', // 1700  
];

// Variable to store the current year  
let currentYear = parseInt(yearSlider.value);

// Function to get current year  
function getCurrentYear() {
    return currentYear;
}


// Function to update the slider background gradient  
function updateSliderBackground(value) {
    const min = parseInt(yearSlider.min);
    const max = parseInt(yearSlider.max);
    const percentage = ((value - min) / (max - min)) * 100;

    let gradientStops = '';

    // Add color stops up to current position  
    for (let i = 0; i < colors.length; i++) {
        const stopPercentage = (i / (colors.length - 1)) * percentage;
        if (stopPercentage <= percentage) {
            gradientStops += `${colors[i]} ${stopPercentage}%, `;
        }
    }

    // Add white color from current position to end  
    gradientStops += `#FFFFFF ${percentage}%, #FFFFFF 100%`;

    yearSlider.style.background = `linear-gradient(to right, ${gradientStops})`;
}

// Function to update the year display and slider position  
function updateYear(year) {
    // Convert the year to display format (e.g., "2000 BC" for negative years)  
    const yearText = year >= 0 ? year.toString() : `${Math.abs(year)} BC`;  
    yearDisplay.textContent = yearText;  

    // Hide error message and update slider background  
    if (year >= 200 && year <= 2024) {  
        errorMessage.style.display = 'none'; // Hide error message  
        currentYear = year; // Update the current year variable  
        updateSliderBackground(year); // Update the gradient  
    } else {  
        errorMessage.style.display = 'block'; // Show error message  
        return; // Exit the function if the year is out of bounds  
    }  

    // Convert borderURLs keys to an array of numbers (handle BC years)  
    const borderYears = Object.keys(borderURLs).map((key) => {  
        return key.includes('BC') ? -parseInt(key.replace('BC', '').trim()) : parseInt(key);  
    });  

    // Sort the years in ascending order  
    borderYears.sort((a, b) => a - b);  

    // Find the closest border year (favoring the later one in case of ties)  
    let closestYear = null;  
    for (let i = 0; i < borderYears.length; i++) {  
        if (year < borderYears[i]) {  
            // If the year is less than the current border year, choose the previous one  
            closestYear = i > 0 ? borderYears[i - 1] : borderYears[i];  
            break;  
        }  
    }  

    // If no year is less than the current year, choose the last border year  
    if (closestYear === null) {  
        closestYear = borderYears[borderYears.length - 1];  
    }  

    // Convert the closest year back to the string format used in borderURLs  
    const closestYearText = closestYear >= 0 ? closestYear.toString() : `${Math.abs(closestYear)} BC`;  

    // Fetch the border data for the closest year  
    if (borderURLs.hasOwnProperty(closestYearText)) {  
        if (geojsonLayer) {  
            map.removeLayer(geojsonLayer); // Remove the previous GeoJSON layer  
        }  
        fetchBoarder(borderURLs[closestYearText]); // Fetch borders for the closest year  
    }  
}
let lastVal = parseInt(yearSlider.value);
// Event Listener: Slider Input  
yearSlider.addEventListener('input', () => {
    const year = parseInt(yearSlider.value);
    updateYear(year);
});

// Event Listener: User Input  
yearDisplay.addEventListener('blur', () => {
    const inputYear = yearDisplay.textContent.trim();
    const parsedYear = inputYear.endsWith('BC')
        ? -parseInt(inputYear.replace('BC', '').trim())
        : parseInt(inputYear);

    if (!isNaN(parsedYear)) {
        updateYear(parsedYear);
    } else {
        errorMessage.style.display = 'block'; // Show error message if invalid input  
    }
});

// Prevent invalid characters while editing the year  
yearDisplay.addEventListener('keypress', (e) => {
    if (!/[\dBC\s]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
        e.preventDefault();
    }
});

// Initialize the slider background  
updateSliderBackground(yearSlider.value);


// // DOM Elements  
// const yearSlider = document.getElementById('year-slider');  
// const dateInput = document.getElementById('date-input');  
// const errorMessage = document.getElementById('error-message');  

// // Colors array for gradient  
// const colors = [  
//     '#3E1F09', // 1100  
//     '#614332', // 1200  
//     '#856758', // 1300  
//     '#A88B7E', // 1400  
//     '#CCAFA4', // 1500  
//     '#E0C7BF', // 1600  
//     '#EFE0DB', // 1700  
// ];  

// // Function to update the slider background gradient  
// function updateSliderBackground(value) {  
//     const min = parseInt(yearSlider.min);  
//     const max = parseInt(yearSlider.max);  
//     const percentage = ((value - min) / (max - min)) * 100;  

//     let gradientStops = '';  

//     // Add color stops up to the current position  
//     for (let i = 0; i < colors.length; i++) {  
//         const stopPercentage = (i / (colors.length - 1)) * percentage;  
//         if (stopPercentage <= percentage) {  
//             gradientStops += `${colors[i]} ${stopPercentage}%, `;  
//         }  
//     }  

//     // Add white color from the current position to the end  
//     gradientStops += `#FFFFFF ${percentage}%, #FFFFFF 100%`;  

//     yearSlider.style.background = `linear-gradient(to right, ${gradientStops})`;  
// }  

// // Function to update the date input and slider position  
// function updateDateAndSlider(dayOffset) {  
//     const currentDate = new Date(dateInput.value);  

//     // Adjust the date by the given day offset  
//     currentDate.setDate(currentDate.getDate() + dayOffset);  

//     // Update the date input value  
//     dateInput.value = currentDate.toISOString().split('T')[0];  

//     // Update the slider value based on the year in the date input  
//     const year = currentDate.getFullYear();  
//     if (year >= 200 && year <= 2024) {  
//         yearSlider.value = year;  
//         updateSliderBackground(year);  
//         errorMessage.style.display = 'none'; // Hide error message  
//     } else {  
//         errorMessage.style.display = 'block'; // Show error message if year is out of bounds  
//     }  

//     // Fetch country boundaries for the updated year  
//     fetchBoundariesForYear(year);  
// }  

// // Function to fetch boundaries for the given year  
// function fetchBoundariesForYear(year) {  
//     // Convert borderURLs keys to an array of numbers (handle BC years)  
//     const borderYears = Object.keys(borderURLs).map((key) => {  
//         return key.includes('BC') ? -parseInt(key.replace('BC', '').trim()) : parseInt(key);  
//     });  

//     // Sort the years in ascending order  
//     borderYears.sort((a, b) => a - b);  

//     // Find the closest border year (favoring the later one in case of ties)  
//     let closestYear = null;  
//     for (let i = 0; i < borderYears.length; i++) {  
//         if (year < borderYears[i]) {  
//             // If the year is less than the current border year, choose the previous one  
//             closestYear = i > 0 ? borderYears[i - 1] : borderYears[i];  
//             break;  
//         }  
//     }  

//     // If no year is less than the current year, choose the last border year  
//     if (closestYear === null) {  
//         closestYear = borderYears[borderYears.length - 1];  
//     }  

//     // Convert the closest year back to the string format used in borderURLs  
//     const closestYearText = closestYear >= 0 ? closestYear.toString() : `${Math.abs(closestYear)} BC`;  

//     // Fetch the border data for the closest year  
//     if (borderURLs.hasOwnProperty(closestYearText)) {  
//         if (geojsonLayer) {  
//             map.removeLayer(geojsonLayer); // Remove the previous GeoJSON layer  
//         }  
//         fetchBoarder(borderURLs[closestYearText]); // Fetch borders for the closest year  
//     }  
// }  

// // Event Listener: Slider Input  
// yearSlider.addEventListener('input', () => {  
//     const sliderYear = parseInt(yearSlider.value);  

//     // Update the date input to match the slider's year  
//     const currentDate = new Date(dateInput.value);  
//     currentDate.setFullYear(sliderYear);  
//     dateInput.value = currentDate.toISOString().split('T')[0];  

//     // Update the slider background and fetch boundaries  
//     updateSliderBackground(sliderYear);  
//     fetchBoundariesForYear(sliderYear);  
// });  

// // Event Listener: Date Input Change  
// dateInput.addEventListener('change', () => {  
//     const selectedDate = new Date(dateInput.value);  
//     const year = selectedDate.getFullYear();  

//     // Update the slider to match the date input's year  
//     if (year >= 200 && year <= 2024) {  
//         yearSlider.value = year;  
//         updateSliderBackground(year);  
//         errorMessage.style.display = 'none'; // Hide error message  
//         fetchBoundariesForYear(year);  
//     } else {  
//         errorMessage.style.display = 'block'; // Show error message if year is out of bounds  
//     }  
// });  

// // Initialize the slider background  
// updateSliderBackground(yearSlider.value);