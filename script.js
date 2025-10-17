
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        // Mood slider functionality
        const moodSlider = document.getElementById('moodSlider');
        const moodTitle = document.getElementById('moodTitle');
        
        moodSlider.addEventListener('input', function() {
            const value = this.value;
            let mood = 'natural';
            
            // Hide all mood categories
            document.querySelectorAll('.mood-category').forEach(cat => {
                cat.classList.remove('active');
            });
            
            if (value < 33) {
                mood = 'happy';
                moodTitle.textContent = 'Happy Places For You 😊';
                document.getElementById('happy-places').classList.add('active');
            } else if (value > 66) {
                mood = 'sad';
                moodTitle.textContent = 'Peaceful Places For Reflection 😔';
                document.getElementById('sad-places').classList.add('active');
            } else {
                mood = 'natural';
                moodTitle.textContent = 'Relaxing Places Near You 😐';
                document.getElementById('natural-places').classList.add('active');
            }
            
            console.log('Current mood:', mood);
        });
                // Sidebar toggle
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        function toggleSidebar() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
        // Plus popup logic
        const plusBtn = document.getElementById('plusBtn');
        const plusPopup = document.getElementById('plusPopup');
        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            plusPopup.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!plusPopup.contains(e.target) && e.target !== plusBtn) plusPopup.classList.remove('active');
        });
        //<-- challengs -->

function acceptChallenge(button) {
    const card = button.closest('.place-card');
    const title = card.querySelector('.place-title').textContent;
    const distance = card.querySelector('.distance-badge').textContent.replace(' km away', '');
    
    // Example coordinates per place
    const locations = {
        "Times Square": { userLat: 40.7128, userLng: -74.0060, destLat: 40.7580, destLng: -73.9855 },
        "Central Park": { userLat: 40.7128, userLng: -74.0060, destLat: 40.7851, destLng: -73.9683 }
        // Add more places if needed
    };
    
    const coords = locations[title] || { userLat: 0, userLng: 0, destLat: 0, destLng: 0 };
    
    localStorage.setItem('selectedPlace', JSON.stringify({
        title: title,
        distance: distance,
        userLat: coords.userLat,
        userLng: coords.userLng,
        destLat: coords.destLat,
        destLng: coords.destLng
    }));
    
    window.location.href = 'armap.html';
}
async function analyzeMoodWithAI() {
    const text = moodInput.value.trim();
    if (!text) {
        aiResult.textContent = 'Please write something first.';
        return;
    }

    aiResult.textContent = 'Analyzing your mood...';

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'  // ✅ Your key added
            },
            body: JSON.stringify({ inputs: text })
        });

        const result = await response.json();
        
        // Log to check structure (open DevTools to see)
        console.log('AI Response:', result);

        // Extract the top sentiment
        const topResult = result[0][0];
        const label = topResult.label;
        const score = topResult.score;

        let mood, moodId, title;
        if (label === 'POSITIVE') {
            mood = '😊 Happy';
            moodId = 'happy-places';
            title = 'Joyful Places to Explore 😊';
        } else if (label === 'NEGATIVE') {
            mood = '😔 Sad';
            moodId = 'sad-places';
            title = 'Peaceful Places for Reflection 😔';
        } else {
            mood = '😐 Neutral';
            moodId = 'natural-places';
            title = 'Calm Places to Unwind 😐';
        }

        // Show AI result
        aiResult.innerHTML = `🎯 AI Detected: <b>${mood}</b> (Confidence: ${(score * 100).toFixed(1)}%)`;

        // Update challenge feed
        document.querySelectorAll('.mood-category').forEach(cat => cat.classList.remove('active'));
        document.getElementById(moodId).classList.add('active');
        moodTitle.textContent = title;

    } catch (error) {
        console.error('AI Error:', error);
        // Fallback if API fails
        aiResult.innerHTML = '⚠️ AI busy. Try again… or use the mood slider.';
        
        // Still update mood using keyword fallback
        const t = text.toLowerCase();
        if (t.includes('sad') || t.includes('awful') || t.includes('terrible')) {
            document.getElementById('sad-places').classList.add('active');
            moodTitle.textContent = 'Peaceful Places for Reflection 😔';
        } else if (t.includes('happy') || t.includes('great') || t.includes('awesome')) {
            document.getElementById('happy-places').classList.add('active');
            moodTitle.textContent = 'Joyful Places to Explore 😊';
        } else {
            document.getElementById('natural-places').classList.add('active');
            moodTitle.textContent = 'Calm Places to Unwind 😐';
        }
    }
}
function acceptChallenge(button) {
    const card = button.closest('.place-card');
    const title = card.querySelector('.place-title').textContent;
    const distanceBadge = card.querySelector('.distance-badge').textContent;
    const distance = parseFloat(distanceBadge.replace(' km away', ''));
    
    // Example coordinates (replace with real ones)
    const locations = {
        "Adventure Theme Park": { lat: 28.5383, lng: -81.3792 },
        "Sunset Beach Festival": { lat: 25.7907, lng: -80.1300 },
        "Peaceful Forest Trail": { lat: 41.1868, lng: -123.8850 }
        // Add more as needed
    };
    
    const coords = locations[title] || { lat: 0, lng: 0 };
    
    // Ask for GPS permission
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const userLoc = { lat: latitude, lng: longitude };
                
                // Simple distance check (in km)
                const dist = getDistance(userLoc.lat, userLoc.lng, coords.lat, coords.lng);
                
                if (dist <= 2.0) { // Within 2 km
                    alert('✅ Verified! You’re near the location!');
                    completeChallenge(title);
                } else {
                    alert(`❌ You're ${dist.toFixed(1)} km away. Please go to the place.`);
                }
            },
            (error) => {
                alert('📍 Please enable location access to verify visit.');
                console.error(error);
            },
            { timeout: 10000 }
        );
    } else {
        alert('❌ Geolocation not supported');
    }
}
// EMOTION SEARCH BAR LOGIC

const searchInput = document.querySelector('.feeling-section input');
const suggestions = document.querySelector('.suggestions');
const suggestItems = document.querySelectorAll('.suggest-item');

// Show suggestions on tap/click
searchInput?.addEventListener('focus', () => {
    searchInput.style.background = 'rgba(0,0,0,0.4)';
    suggestions.style.display = 'flex';
});

searchInput?.addEventListener('blur', () => {
    // Delay hide to allow click
    setTimeout(() => {
        suggestions.style.display = 'none';
        searchInput.style.background = 'rgba(0,0,0,0.3)';
    }, 200);
});

// Prevent input from being editable
searchInput?.addEventListener('keypress', (e) => e.preventDefault());

// Handle suggestion click
suggestItems.forEach(item => {
    item.addEventListener('click', function() {
        const mood = this.getAttribute('data-mood');
        const text = this.textContent.trim();

        // Update input display
        searchInput.value = text;
        suggestions.style.display = 'none';

        // Update challenge feed
        updateChallengeFeed(mood);
    });
});

// Reuse your existing function or add it
function updateChallengeFeed(mood) {
    // Hide all
    document.querySelectorAll('.mood-category').forEach(cat => cat.classList.remove('active'));

    // Show correct
    if (mood === 'happy' || mood === 'adventure') {
        document.getElementById('happy-places').classList.add('active');
        document.getElementById('moodTitle').textContent = 'Joyful Places to Explore 😊';
    } else if (mood === 'natural' || mood === 'romance') {
        document.getElementById('natural-places').classList.add('active');
        document.getElementById('moodTitle').textContent = 'Calm Places to Unwind 😐';
    } else if (mood === 'sad') {
        document.getElementById('sad-places').classList.add('active');
        document.getElementById('moodTitle').textContent = 'Peaceful Places for Reflection 😔';
    }
}
// Auto-fetch nearby places
function loadNearbyPlaces() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                console.log('User location:', latitude, longitude);
                // For now: just show all places (later: filter by proximity)
                showNotification(`📍 Finding places near you…`);
            },
            (err) => {
                console.warn('Location denied, using default feed');
                // No problem — keep showing mood-based places
            },
            { timeout: 10000 }
        );
    }
}
// Run on page load
window.addEventListener('load', loadNearbyPlaces);
// This function is called when "Accept Challenge" is clicked
function acceptChallenge(button) {
    const card = button.closest('.place-card');
    const title = card.querySelector('.place-title').textContent;
    const distanceBadge = card.querySelector('.distance-badge').textContent;
    const distance = parseFloat(distanceBadge.replace(' km away', ''));

    // ❗ COORDINATES: Set one per place
    const locations = {
        "Adventure Theme Park": { destLat: 28.5365, destLng: 77.3920 },
        "Sunset Beach Festival": { destLat: 28.5340, destLng: 77.3900 },
        "Peaceful Forest Trail": { destLat: 28.5370, destLng: 77.3930 },
        "Tranquil Mountain Lake": { destLat: 28.5330, destLng: 77.3890 },
        "Healing Wellness Spa": { destLat: 28.5350, destLng: 77.3915 }
        // Add more as needed
    };

    const coords = locations[title] || { destLat: 28.5355, destLng: 77.3910 };

    // ✅ SET USER'S MOCK LOCATION (real GPS comes later)
    const userLat = 28.5355;
    const userLng = 77.3910;

    // 💾 SAVE TO LOCAL STORAGE — THIS IS KEY
    localStorage.setItem('selectedPlace', JSON.stringify({
        title: title,
        distance: distance,
        destLat: coords.destLat,
        destLng: coords.destLng,
        userLat: userLat,
        userLng: userLng,
        duration: 10, // minutes
        challengeAccepted: true  // 🔓 Only now will armap.html show route
    }));

    // 🎉 Update button
    button.textContent = 'Accepted 🎉';
    button.style.background = 'linear-gradient(135deg, #10b981, #00d4ff)';
    button.disabled = true;

    // Show notification
    showNotification('Challenge accepted! Opening map...');

    // 🚀 Redirect to armap.html
    setTimeout(() => {
        window.location.href = 'armap.html';
    }, 1500);
}

// Optional: Reusable notification
function showNotification(msg) {
    let notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white; padding: 12px 24px; border-radius: 30px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 3000;
        font-size: 14px; font-weight: 600; animation: fadeOut 1.5s ease-in-out 1.5s forwards;
    `;
    notif.textContent = msg;
    document.body.appendChild(notif);

    setTimeout(() => {
        if (notif && notif.parentNode) notif.parentNode.removeChild(notif);
    }, 3000);
}
localStorage.setItem('acceptedLocation', JSON.stringify({
    name: "Location Name",
    lat: 28.6139,  // Example coordinates
    lng: 77.2090
}));
window.location.href = 'verification.html';
