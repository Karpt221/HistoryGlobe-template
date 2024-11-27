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

// Function to handle year change  
function onYearChange(year) {
    // Можна додати додаткову логіку обробки зміни року  
    console.log('Year changed to:', year);
    return year;
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
    if (year >= 1100 && year <= 2024) {
        errorMessage.style.display = 'none'; // Hide error message  
        yearDisplay.textContent = year >= 0 ? year : `${Math.abs(year)} BC`;
        yearSlider.value = year;
        currentYear = year; // Update the current year variable  
        updateSliderBackground(year); // Update the gradient  
        onYearChange(year); // Trigger year change handler  
    } else {
        errorMessage.style.display = 'block'; // Show error message  
    }
}

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




const year = getCurrentYear();