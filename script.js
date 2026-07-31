// Wait for the DOM content to fully load before running our JavaScript
document.addEventListener('DOMContentLoaded', () => {
    
    // Grab the button element from our HTML using its ID
    const colorButton = document.getElementById('colorBtn');
    
    // An array of fun background colors to cycle through
    const colors = ['#f4f4f9', '#ffeaa7', '#dfe6e9', '#fab1a0', '#81ecec'];
    let colorIndex = 0;
    
    // Initialize a click counter variable to keep track of total clicks
    let clickCount = 0;

    // Add an event listener that listens for a 'click' on the button
    colorButton.addEventListener('click', () => {
        // Increment our click counter by 1 every time the button is clicked
        clickCount++;

        // Increment the color index or loop back to 0 using the remainder operator (%)
        colorIndex = (colorIndex + 1) % colors.length;
        
        // Change the background color of the body smoothly
        document.body.style.backgroundColor = colors[colorIndex];
        
        // Dynamically update the button text to show the current click count
        colorButton.textContent = `Clicked ${clickCount} time${clickCount === 1 ? '' : 's'}!`;
        
        // Log the event details to the browser console (Press F12 to view it!)
        console.log(`Button clicked ${clickCount} times. Background color set to: ${colors[colorIndex]}`);
    });
});
