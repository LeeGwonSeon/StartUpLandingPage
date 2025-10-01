// ===== UTILITY FUNCTIONS =====

/*
* Debounce function to limit the rate of function execution
* @param {Function} func - Function to debounce
* @param {number} wait - Wait time in milliseconds
* @param {boolean} immediate - Execute immediately
* @returns {Function} Debounced function
*/

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if(callNow) func(...args);
    }
}