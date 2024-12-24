(function () {
    const urlList = document.getElementById('url-items');

    const displayLiveStreamUrls = () => {
        if (window.liveStreamUrls && Array.isArray(window.liveStreamUrls)) {
            urlList.innerHTML = ''; // Clear existing list

            // Iterate through liveStreamUrls and add them to the list
            window.liveStreamUrls.forEach(({ user, live_stream_link }) => {
                const listItem = document.createElement('li');
                listItem.className = 'url-item';

                if (live_stream_link) {
                    listItem.innerHTML = `<strong>${user}</strong>: <a href="${live_stream_link}" target="_blank">${live_stream_link}</a>`;
                } else {
                    listItem.innerHTML = `<strong>${user}</strong>: No live stream available`;
                }

                urlList.appendChild(listItem);
            });
        } else {
            urlList.innerHTML = '<li>No live stream URLs found yet. Please wait...</li>';
        }
    };

    // Check for liveStreamUrls updates every second (polling)
    const pollForLiveStreamUrls = () => {
        const interval = setInterval(() => {
            if (window.liveStreamUrls) {
                clearInterval(interval); // Stop polling once data is found
                displayLiveStreamUrls();
            }
        }, 1000);
    };


    // Run both polling and observation for robust detection
    displayLiveStreamUrls(); // Initial display
    pollForLiveStreamUrls();
})();
