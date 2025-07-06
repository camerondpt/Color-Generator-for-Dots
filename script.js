document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const colorBlock = document.getElementById('colorBlock');
    const startButton = document.getElementById('startButton');
    const displayTimeInput = document.getElementById('displayTime');
    const delayTimeInput = document.getElementById('delayTime');
    const repetitionsInput = document.getElementById('repetitions');
    // NEW: Get all color selection buttons using their class name
    const colorButtons = document.querySelectorAll('.color-button'); 

    let currentTimeoutId = null; // To store the ID of the current setTimeout, so we can clear it

    // --- NEW: Add click event listeners to each color button ---
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            // When a color button is clicked, toggle the 'selected' class on it.
            // This class will control its visual appearance via CSS.
            button.classList.toggle('selected');
        });
    });
    // --- END NEW ---

    // Function to get selected colors
    function getSelectedColors() {
        const selectedColors = [];
        // NEW: Loop through all color buttons
        colorButtons.forEach(button => {
            // If a button has the 'selected' class, it means the user has chosen it.
            if (button.classList.contains('selected')) {
                // Add the color (from its data-color attribute) to our list of selected colors.
                selectedColors.push(button.dataset.color); 
            }
        });
        return selectedColors;
    }

    // Global variables to manage the animation state
    let animationColors = []; // Stores the currently selected colors (e.g., ['red', 'blue'])
    let animationDisplayTime = 0; // Stores the duration a color is shown (in milliseconds)
    let animationDelayTime = 0;   // Stores the duration of the white screen delay (in milliseconds)
    let totalColorChanges = 0; // Total number of individual color displays that need to happen
    let currentColorChangeCount = 0; // Counter for how many color changes have occurred so far

    // Function to start the color cycling animation
    function startColorCycle() {
        // First, clear any ongoing animation to prevent conflicts if the button is clicked again.
        if (currentTimeoutId) {
            clearTimeout(currentTimeoutId);
            colorBlock.style.backgroundColor = ''; // Reset color block to default
            currentTimeoutId = null; // Clear the timeout ID
        }

        // Get the colors currently marked as 'selected' by the user.
        animationColors = getSelectedColors(); 
        
        // Parse input values from the HTML fields.
        // parseFloat() is used for potentially decimal seconds, then multiplied by 1000 for milliseconds.
        animationDisplayTime = parseFloat(displayTimeInput.value) * 1000;
        animationDelayTime = parseFloat(delayTimeInput.value) * 1000;
        
        // parseInt() is used for whole number repetitions.
        const repetitions = parseInt(repetitionsInput.value);

        // --- Input Validation ---
        if (animationColors.length === 0) {
            alert('Please select at least one color.');
            return; // Stop the function if no colors are selected.
        }
        if (isNaN(animationDisplayTime) || animationDisplayTime < 100) { // Minimum 0.1 seconds (100 ms)
            alert('Please enter a valid display time (minimum 0.1 seconds).');
            return;
        }
        if (isNaN(animationDelayTime) || animationDelayTime < 0) { // Minimum 0 seconds (no negative delay)
            alert('Please enter a valid delay time (minimum 0 seconds).');
            return;
        }
        if (isNaN(repetitions) || repetitions < 1) { // Minimum 1 repetition
            alert('Please enter a valid number of repetitions (minimum 1).');
            return;
        }
        // --- End Input Validation ---

        // Set the total number of color changes that will occur.
        // Each repetition involves one random color display.
        totalColorChanges = repetitions;
        currentColorChangeCount = 0; // Reset the counter for the new animation.

        // Begin the animation sequence by calling the first step.
        displayNextColor();
    }

    // Recursive function to manage the sequence of color display and white delay.
    function displayNextColor() {
        // Check if we have completed all the required color changes.
        if (currentColorChangeCount >= totalColorChanges) {
            colorBlock.style.backgroundColor = ''; // Reset color block to default (white or transparent)
            currentTimeoutId = null; // Clear timeout ID, indicating animation is truly over.
            console.log('Animation finished.'); // Inform the console.
            return; // Exit the function.
        }

        // 1. Display a random color:
        // Generate a random index based on the number of currently selected colors.
        const randomIndex = Math.floor(Math.random() * animationColors.length);
        // Get the random color from our array.
        const randomColor = animationColors[randomIndex];
        // Apply this random color to the background of the color block.
        colorBlock.style.backgroundColor = randomColor;

        // Increment the counter for the current color display.
        currentColorChangeCount++;

        // 2. Schedule the transition to white screen after the color display time:
        currentTimeoutId = setTimeout(() => {
            // Set the background to white for the delay.
            colorBlock.style.backgroundColor = 'white'; 
            
            // 3. Schedule the next color display after the white delay time:
            currentTimeoutId = setTimeout(displayNextColor, animationDelayTime);
        }, animationDisplayTime); // This timeout waits for the display time of the color.
    }

    // Attach the 'startColorCycle' function to the click event of the 'startButton'.
    startButton.addEventListener('click', startColorCycle);
});