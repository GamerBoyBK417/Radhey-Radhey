document.addEventListener('DOMContentLoaded', function() {
    
    // --- CUSTOMIZE YOUR LINKS HERE ---
    // Add the name and URL for each service you want to monitor.
    const services = [
        { name: 'Google', url: 'https://www.google.com' },
        { name: 'GitHub', url: 'https://www.github.com' },
        { name: 'Cloudflare', url: 'https://www.cloudflare.com' },
        { name: 'A Non-Existent Site', url: 'https://thissitedoesnotexist12345.com' },
        { name: 'My Personal Site', url: 'https://www.example.com' }
    ];

    const statusList = document.getElementById('status-list');
    const lastUpdatedElement = document.getElementById('last-updated-time');

    function createStatusItem(service) {
        const item = document.createElement('div');
        item.className = 'status-item checking';
        item.innerHTML = `
            <span class="service-name">${service.name}</span>
            <span class="status-badge">Checking...</span>
        `;
        return item;
    }
    
    async function checkAllStatuses() {
        // Update the timestamp
        lastUpdatedElement.textContent = new Date().toLocaleTimeString();
        
        // Clear the list to refresh
        statusList.innerHTML = '';

        for (const service of services) {
            const statusItem = createStatusItem(service);
            statusList.appendChild(statusItem);

            // Use 'no-cors' mode to prevent CORS errors. 
            // This means we can't read the response body or status code,
            // but a successful fetch promise indicates the server is reachable.
            fetch(service.url, { mode: 'no-cors', cache: 'no-cache' })
                .then(response => {
                    // Even with no-cors, a resolved promise is a good sign.
                    updateStatus(statusItem, 'up');
                })
                .catch(error => {
                    // A failed fetch (e.g., network error, DNS failure) means it's down.
                    updateStatus(statusItem, 'down');
                });
        }
    }

    function updateStatus(itemElement, status) {
        itemElement.classList.remove('checking');
        const badge = itemElement.querySelector('.status-badge');
        
        if (status === 'up') {
            itemElement.classList.add('up');
            badge.textContent = 'Online';
        } else {
            itemElement.classList.add('down');
            badge.textContent = 'Offline';
        }
    }
    
    // Initial check on page load
    checkAllStatuses();
    
    // Re-check every 60 seconds (60000 milliseconds)
    setInterval(checkAllStatuses, 60000);
});
