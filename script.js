// Wait for the DOM content to completely load before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    
    // Grab the fullscreen button and the game container element from the DOM
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const gameContainer = document.querySelector('.game-container');

    // Add a click event listener to handle toggling fullscreen mode
    fullscreenBtn.addEventListener('click', () => {
        // Check if the browser is currently not in fullscreen mode
        if (!document.fullscreenElement) {
            // Request fullscreen on our game wrapper container
            if (gameContainer.requestFullscreen) {
                gameContainer.requestFullscreen();
            } else if (gameContainer.webkitRequestFullscreen) { /* Safari support */
                gameContainer.webkitRequestFullscreen();
            } else if (gameContainer.msRequestFullscreen) { /* IE/Edge support */
                gameContainer.msRequestFullscreen();
            }
            
            // Update button text when entering fullscreen
            fullscreenBtn.textContent = 'Exit Fullscreen ❌';
            console.log('Entered fullscreen game mode.');
        } else {
            // Exit fullscreen if it's already active
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            // Revert button text when exiting fullscreen
            fullscreenBtn.textContent = 'Go Fullscreen 📺';
            console.log('Exited fullscreen game mode.');
        }
    });

    // Event listener to sync button text if user exits fullscreen via the 'Esc' key
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.textContent = 'Go Fullscreen 📺';
        }
    });
});
