function getLastWeeksDates(socket, callback) {
    // Listen for the "getSettings" event
    socket.on("Last10WeeksDates", (settings) => {
        console.log("Received settings:", settings);
        // Check if the callback is a function before calling it
        if (typeof callback === 'function') {
            callback(settings);
        } else {
            console.error('Callback is not a function');
        }
    });
}

function formatDate(date) {
    // Your date formatting logic here
}

// Export the getLastWeeksDates and formatDate functions
export { getLastWeeksDates, formatDate };
