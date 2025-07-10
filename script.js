// Weather App JavaScript with Enhanced Features
class WeatherApp {
    constructor() {
        this.apiKey = ''; // You'll need to get a free API key from OpenWeatherMap
        this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
        this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.currentWeatherCondition = 'sunny';
        this.weatherMoodPlayer = null;
        this.audioEnabled = false;
        this.userInteracted = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.showDefaultMessage();
        this.initWeatherMoodPlayer();
    }

    bindEvents() {
        try {
            const searchBtn = document.getElementById('searchBtn');
            const locationInput = document.getElementById('locationInput');
            const currentLocationBtn = document.getElementById('currentLocationBtn');
            const musicToggle = document.getElementById('musicToggle');
            const retryBtn = document.getElementById('retryBtn');
            const prevSong = document.getElementById('prevSong');
            const playPause = document.getElementById('playPause');
            const nextSong = document.getElementById('nextSong');
            const shuffleSongs = document.getElementById('shuffleSongs');
            
            // New Weather Mood Controls
            const moodToggle = document.getElementById('moodToggle');
            const playPauseBtn = document.getElementById('playPauseBtn');
            const volumeSlider = document.getElementById('volumeSlider');

            if (searchBtn) searchBtn.addEventListener('click', () => this.searchWeather());
            if (locationInput) {
                locationInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.searchWeather();
                });
            }
            if (currentLocationBtn) currentLocationBtn.addEventListener('click', () => this.getCurrentLocation());
            if (musicToggle) musicToggle.addEventListener('click', () => this.toggleMusicPlayer());
            if (retryBtn) retryBtn.addEventListener('click', () => this.hideError());
            if (prevSong) prevSong.addEventListener('click', () => this.previousSong());
            if (playPause) playPause.addEventListener('click', () => this.togglePlayPause());
            if (nextSong) nextSong.addEventListener('click', () => this.nextSong());
            if (shuffleSongs) shuffleSongs.addEventListener('click', () => this.shuffleSongs());
            
            // New Weather Mood Event Listeners
            if (moodToggle) moodToggle.addEventListener('click', () => this.toggleMoodAudio());
            if (playPauseBtn) playPauseBtn.addEventListener('click', () => this.toggleMoodPlayPause());
            if (volumeSlider) volumeSlider.addEventListener('input', (e) => this.setMoodVolume(e.target.value));
            
            // Enable user interaction detection
            document.addEventListener('click', () => this.userInteracted = true, { once: true });
            document.addEventListener('keydown', () => this.userInteracted = true, { once: true });
        } catch (error) {
            console.error('Error binding events:', error);
        }
    }

    showDefaultMessage() {
        this.updateQuote("Welcome! Search for a city to get started 🌟");
    }

    async searchWeather() {
        const location = document.getElementById('locationInput').value.trim();
        console.log('🔍 Searching weather for:', location);
        
        if (!location) {
            console.log('❌ No location entered');
            this.showError('Please enter a city name');
            return;
        }

        this.showLoading();
        console.log('⏳ Loading weather data...');
        
        try {
            // For demo purposes, we'll use sample data
            // In production, replace this with actual API call
            const weatherData = this.getSampleWeatherData(location);
            console.log('📊 Weather data retrieved:', weatherData);
            
            this.displayWeather(weatherData);
            this.hideLoading();
            console.log('✅ Weather search completed successfully');
            
        } catch (error) {
            console.error('❌ Error in searchWeather:', error);
            this.hideLoading();
            this.showError('Failed to fetch weather data. Please try again.');
        }
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return;
        }

        this.showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // For demo, detect location and show appropriate weather
                const locationName = this.detectLocationFromCoords(position.coords.latitude, position.coords.longitude);
                const weatherData = this.getSampleWeatherData(locationName);
                this.displayWeather(weatherData);
                this.hideLoading();
            },
            (error) => {
                this.hideLoading();
                this.showError('Unable to retrieve your location');
            }
        );
    }

    getSampleWeatherData(location) {
        // More realistic weather data based on location and current conditions
        const locationWeatherData = this.getLocationBasedWeather(location.toLowerCase());
        
        return {
            location: location,
            country: locationWeatherData.country,
            ...locationWeatherData.weather
        };
    }

    getLocationBasedWeather(location) {
        // Current realistic weather conditions for various locations
        const locationWeatherMap = {
            // Indian Cities
            'barasat': {
                country: 'India',
                weather: {
                    condition: 'rainy',
                    temp: 26,
                    feelsLike: 29,
                    description: 'moderate rain',
                    icon: 'fas fa-cloud-rain',
                    humidity: 88,
                    windSpeed: 14,
                    pressure: 1006,
                    visibility: 6,
                    aqi: 78,
                    aqiStatus: 'Moderate',
                    uvIndex: 3,
                    windDirection: 'SW',
                    dewPoint: 24,
                    cloudCover: 85
                }
            },
            'kolkata': {
                country: 'India',
                weather: {
                    condition: 'rainy',
                    temp: 27,
                    feelsLike: 31,
                    description: 'heavy rain',
                    icon: 'fas fa-cloud-rain',
                    humidity: 92,
                    windSpeed: 18,
                    pressure: 1004,
                    visibility: 4,
                    aqi: 156,
                    aqiStatus: 'Unhealthy',
                    uvIndex: 2,
                    windDirection: 'SE',
                    dewPoint: 25,
                    cloudCover: 95
                }
            },
            'mumbai': {
                country: 'India',
                weather: {
                    condition: 'rainy',
                    temp: 25,
                    feelsLike: 28,
                    description: 'monsoon rain',
                    icon: 'fas fa-cloud-rain',
                    humidity: 85,
                    windSpeed: 16,
                    pressure: 1008,
                    visibility: 5,
                    aqi: 89,
                    aqiStatus: 'Moderate',
                    uvIndex: 1,
                    windDirection: 'W',
                    dewPoint: 22,
                    cloudCover: 90
                }
            },
            'delhi': {
                country: 'India',
                weather: {
                    condition: 'cloudy',
                    temp: 32,
                    feelsLike: 36,
                    description: 'partly cloudy',
                    icon: 'fas fa-cloud',
                    humidity: 75,
                    windSpeed: 12,
                    pressure: 1012,
                    visibility: 8,
                    aqi: 184,
                    aqiStatus: 'Unhealthy',
                    uvIndex: 8,
                    windDirection: 'NW',
                    dewPoint: 27,
                    cloudCover: 70
                }
            },
            'bangalore': {
                country: 'India',
                weather: {
                    condition: 'cloudy',
                    temp: 24,
                    feelsLike: 26,
                    description: 'overcast',
                    icon: 'fas fa-cloud',
                    humidity: 78,
                    windSpeed: 10,
                    pressure: 1014,
                    visibility: 9
                }
            },
            'chennai': {
                country: 'India',
                weather: {
                    condition: 'rainy',
                    temp: 28,
                    feelsLike: 32,
                    description: 'scattered showers',
                    icon: 'fas fa-cloud-rain',
                    humidity: 84,
                    windSpeed: 15,
                    pressure: 1009,
                    visibility: 7
                }
            },

            // International Cities
            'london': {
                country: 'United Kingdom',
                weather: {
                    condition: 'cloudy',
                    temp: 15,
                    feelsLike: 13,
                    description: 'overcast',
                    icon: 'fas fa-cloud',
                    humidity: 72,
                    windSpeed: 11,
                    pressure: 1018,
                    visibility: 10
                }
            },
            'new york': {
                country: 'United States',
                weather: {
                    condition: 'sunny',
                    temp: 22,
                    feelsLike: 25,
                    description: 'clear sky',
                    icon: 'fas fa-sun',
                    humidity: 55,
                    windSpeed: 8,
                    pressure: 1021,
                    visibility: 15
                }
            },
            'tokyo': {
                country: 'Japan',
                weather: {
                    condition: 'rainy',
                    temp: 24,
                    feelsLike: 26,
                    description: 'light rain',
                    icon: 'fas fa-cloud-rain',
                    humidity: 80,
                    windSpeed: 12,
                    pressure: 1010,
                    visibility: 8
                }
            },
            'paris': {
                country: 'France',
                weather: {
                    condition: 'cloudy',
                    temp: 18,
                    feelsLike: 16,
                    description: 'partly cloudy',
                    icon: 'fas fa-cloud',
                    humidity: 68,
                    windSpeed: 9,
                    pressure: 1016,
                    visibility: 12
                }
            },
            'sydney': {
                country: 'Australia',
                weather: {
                    condition: 'sunny',
                    temp: 20,
                    feelsLike: 22,
                    description: 'mostly sunny',
                    icon: 'fas fa-sun',
                    humidity: 60,
                    windSpeed: 13,
                    pressure: 1019,
                    visibility: 14
                }
            },
            'moscow': {
                country: 'Russia',
                weather: {
                    condition: 'snowy',
                    temp: -3,
                    feelsLike: -8,
                    description: 'light snow',
                    icon: 'fas fa-snowflake',
                    humidity: 85,
                    windSpeed: 18,
                    pressure: 1008,
                    visibility: 6
                }
            },
            'dubai': {
                country: 'United Arab Emirates',
                weather: {
                    condition: 'sunny',
                    temp: 38,
                    feelsLike: 42,
                    description: 'hot and sunny',
                    icon: 'fas fa-sun',
                    humidity: 45,
                    windSpeed: 10,
                    pressure: 1013,
                    visibility: 12
                }
            },
            'singapore': {
                country: 'Singapore',
                weather: {
                    condition: 'rainy',
                    temp: 29,
                    feelsLike: 33,
                    description: 'tropical rain',
                    icon: 'fas fa-cloud-rain',
                    humidity: 86,
                    windSpeed: 11,
                    pressure: 1011,
                    visibility: 7
                }
            }
        };

        // Check if location exists in our database
        const locationData = locationWeatherMap[location];
        if (locationData) {
            return locationData;
        }

        // If location not found, provide seasonal weather based on current date
        return this.getSeasonalWeather(location);
    }

    getSeasonalWeather(location) {
        const now = new Date();
        const month = now.getMonth(); // 0-11
        const isNorthernHemisphere = true; // Default assumption
        
        let seasonalWeather;
        
        // Determine season-appropriate weather
        if (month >= 2 && month <= 4) { // Spring (Mar-May)
            seasonalWeather = {
                condition: 'cloudy',
                temp: 20,
                feelsLike: 22,
                description: 'partly cloudy',
                icon: 'fas fa-cloud',
                humidity: 65,
                windSpeed: 10,
                pressure: 1015,
                visibility: 12
            };
        } else if (month >= 5 && month <= 7) { // Summer (Jun-Aug)
            seasonalWeather = {
                condition: 'sunny',
                temp: 28,
                feelsLike: 31,
                description: 'mostly sunny',
                icon: 'fas fa-sun',
                humidity: 55,
                windSpeed: 12,
                pressure: 1018,
                visibility: 15
            };
        } else if (month >= 8 && month <= 10) { // Autumn (Sep-Nov)
            seasonalWeather = {
                condition: 'rainy',
                temp: 22,
                feelsLike: 24,
                description: 'autumn showers',
                icon: 'fas fa-cloud-rain',
                humidity: 75,
                windSpeed: 14,
                pressure: 1010,
                visibility: 8
            };
        } else { // Winter (Dec-Feb)
            seasonalWeather = {
                condition: 'cloudy',
                temp: 12,
                feelsLike: 9,
                description: 'overcast',
                icon: 'fas fa-cloud',
                humidity: 70,
                windSpeed: 16,
                pressure: 1012,
                visibility: 10
            };
        }

        return {
            country: 'Unknown Location',
            weather: seasonalWeather
        };
    }

    detectLocationFromCoords(lat, lon) {
        // Basic location detection based on coordinates
        // Barasat coordinates: approximately 22.7°N, 88.4°E
        if (lat >= 22.5 && lat <= 23.0 && lon >= 88.0 && lon <= 88.8) {
            return 'Barasat';
        }
        // Kolkata coordinates: approximately 22.5°N, 88.3°E
        else if (lat >= 22.3 && lat <= 22.8 && lon >= 88.0 && lon <= 88.6) {
            return 'Kolkata';
        }
        // Delhi coordinates: approximately 28.6°N, 77.2°E
        else if (lat >= 28.3 && lat <= 28.9 && lon >= 77.0 && lon <= 77.5) {
            return 'Delhi';
        }
        // Mumbai coordinates: approximately 19.0°N, 72.8°E
        else if (lat >= 18.7 && lat <= 19.3 && lon >= 72.5 && lon <= 73.1) {
            return 'Mumbai';
        }
        // London coordinates: approximately 51.5°N, -0.1°W
        else if (lat >= 51.3 && lat <= 51.7 && lon >= -0.3 && lon <= 0.1) {
            return 'London';
        }
        // New York coordinates: approximately 40.7°N, -74.0°W
        else if (lat >= 40.5 && lat <= 40.9 && lon >= -74.2 && lon <= -73.8) {
            return 'New York';
        }
        else {
            return 'Current Location';
        }
    }

    getWeatherSongs(condition) {
        const weatherSongs = {
            sunny: [
                { title: "Here Comes the Sun", artist: "The Beatles", mood: "uplifting" },
                { title: "Walking on Sunshine", artist: "Katrina & The Waves", mood: "energetic" },
                { title: "Good Day Sunshine", artist: "The Beatles", mood: "happy" },
                { title: "Sunny Afternoon", artist: "The Kinks", mood: "relaxed" },
                { title: "Blinding Lights", artist: "The Weeknd", mood: "vibrant" },
                { title: "Happy", artist: "Pharrell Williams", mood: "joyful" },
                { title: "Sunshine", artist: "Matisyahu", mood: "peaceful" },
                { title: "Summer Breeze", artist: "Seals & Crofts", mood: "chill" }
            ],
            rainy: [
                { title: "Singing in the Rain", artist: "Gene Kelly", mood: "upbeat" },
                { title: "Rain Rain Go Away", artist: "Kids Song", mood: "playful" },
                { title: "Umbrella", artist: "Rihanna", mood: "confident" },
                { title: "I Can See Clearly Now", artist: "Johnny Nash", mood: "hopeful" },
                { title: "Raindrops Keep Falling", artist: "B.J. Thomas", mood: "optimistic" },
                { title: "Purple Rain", artist: "Prince", mood: "emotional" },
                { title: "Rain on Me", artist: "Lady Gaga", mood: "powerful" },
                { title: "Set Fire to the Rain", artist: "Adele", mood: "intense" }
            ],
            cloudy: [
                { title: "Both Sides Now", artist: "Joni Mitchell", mood: "reflective" },
                { title: "Cloudy", artist: "Simon & Garfunkel", mood: "contemplative" },
                { title: "A Spoonful of Sugar", artist: "Mary Poppins", mood: "cheerful" },
                { title: "Blue Skies", artist: "Ella Fitzgerald", mood: "hopeful" },
                { title: "Somewhere Over the Rainbow", artist: "Judy Garland", mood: "dreamy" },
                { title: "Cloud Nine", artist: "The Temptations", mood: "uplifting" },
                { title: "Head in the Clouds", artist: "Joji", mood: "mellow" },
                { title: "Cloudbusting", artist: "Kate Bush", mood: "atmospheric" }
            ],
            snowy: [
                { title: "Let It Snow", artist: "Dean Martin", mood: "cozy" },
                { title: "Jingle Bells", artist: "Traditional", mood: "festive" },
                { title: "Winter Wonderland", artist: "Tony Bennett", mood: "magical" },
                { title: "Snowflakes", artist: "White Lies", mood: "serene" },
                { title: "Frozen", artist: "Elsa", mood: "empowering" },
                { title: "Snow (Hey Oh)", artist: "Red Hot Chili Peppers", mood: "energetic" },
                { title: "Winter Song", artist: "Sara Bareilles", mood: "warm" },
                { title: "Sleigh Ride", artist: "The Ronettes", mood: "joyful" }
            ],
            stormy: [
                { title: "Thunderstruck", artist: "AC/DC", mood: "powerful" },
                { title: "Riders on the Storm", artist: "The Doors", mood: "mysterious" },
                { title: "Storm", artist: "Lifehouse", mood: "intense" },
                { title: "Thunder", artist: "Imagine Dragons", mood: "energetic" },
                { title: "Lightning Crashes", artist: "Live", mood: "dramatic" },
                { title: "Stormy Weather", artist: "Billie Holiday", mood: "soulful" },
                { title: "Eye of the Storm", artist: "Ryan Stevenson", mood: "hopeful" },
                { title: "After the Storm", artist: "Kali Uchis", mood: "uplifting" }
            ],
            misty: [
                { title: "Misty", artist: "Ella Fitzgerald", mood: "romantic" },
                { title: "The Mist", artist: "Big Thief", mood: "atmospheric" },
                { title: "Foggy Day", artist: "Billie Holiday", mood: "jazzy" },
                { title: "Hazy Shade of Winter", artist: "Simon & Garfunkel", mood: "contemplative" },
                { title: "Misty Morning", artist: "Bob Dylan", mood: "reflective" },
                { title: "Morning Mist", artist: "Hiroshi Yoshimura", mood: "peaceful" },
                { title: "Through the Mist", artist: "Yann Tiersen", mood: "dreamy" },
                { title: "Fog", artist: "Radiohead", mood: "ambient" }
            ]
        };

        return weatherSongs[condition] || weatherSongs.sunny;
    }

    get5DayForecast(location) {
        // Generate realistic 5-day forecast based on current weather
        const today = new Date();
        const forecast = [];
        const currentWeather = this.getLocationBasedWeather(location.toLowerCase());
        
        // Generate forecast based on current weather pattern
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            // Create realistic weather progression
            const forecastWeather = this.getForecastWeather(currentWeather.weather, i);
            
            forecast.push({
                date: date,
                condition: forecastWeather.condition,
                temp: forecastWeather.temp,
                tempMin: forecastWeather.tempMin,
                tempMax: forecastWeather.tempMax,
                description: forecastWeather.description,
                icon: this.getWeatherIcon(forecastWeather.condition),
                humidity: forecastWeather.humidity,
                windSpeed: forecastWeather.windSpeed,
                precipitation: forecastWeather.precipitation
            });
        }
        
        return forecast;
    }

    getForecastWeather(currentWeather, dayIndex) {
        const baseTemp = currentWeather.temp;
        const condition = currentWeather.condition;
        
        // Create realistic weather progression
        const tempVariation = [-2, -1, 0, 1, 2][dayIndex] || 0;
        const temp = baseTemp + tempVariation + (Math.random() * 4 - 2); // Small random variation
        
        // Weather pattern progression
        let forecastCondition = condition;
        let description = currentWeather.description;
        let humidity = currentWeather.humidity;
        let windSpeed = currentWeather.windSpeed;
        let precipitation = 0;
        
        // Realistic weather changes over days
        if (dayIndex === 0) {
            // Today - use current weather
            forecastCondition = condition;
            description = currentWeather.description;
            humidity = currentWeather.humidity;
            precipitation = condition === 'rainy' ? 85 : condition === 'snowy' ? 70 : 10;
        } else if (dayIndex === 1) {
            // Tomorrow - slight change
            if (condition === 'rainy') {
                forecastCondition = Math.random() > 0.3 ? 'rainy' : 'cloudy';
                description = forecastCondition === 'rainy' ? 'light rain' : 'cloudy';
                precipitation = forecastCondition === 'rainy' ? 75 : 30;
            } else if (condition === 'sunny') {
                forecastCondition = Math.random() > 0.4 ? 'sunny' : 'cloudy';
                description = forecastCondition === 'sunny' ? 'partly sunny' : 'partly cloudy';
                precipitation = 15;
            }
        } else {
            // 3-5 days - more variation
            const weatherOptions = ['sunny', 'cloudy', 'rainy'];
            if (condition === 'rainy') {
                forecastCondition = weatherOptions[Math.floor(Math.random() * 3)];
            } else if (condition === 'sunny') {
                forecastCondition = Math.random() > 0.6 ? 'sunny' : Math.random() > 0.5 ? 'cloudy' : 'rainy';
            } else {
                forecastCondition = weatherOptions[Math.floor(Math.random() * 3)];
            }
            
            description = this.getWeatherDescription(forecastCondition);
            precipitation = forecastCondition === 'rainy' ? 60 + Math.random() * 30 : 
                           forecastCondition === 'snowy' ? 50 + Math.random() * 30 : 
                           Math.random() * 25;
        }
        
        // Adjust humidity and wind based on weather
        if (forecastCondition === 'rainy') {
            humidity = Math.max(75, humidity + Math.random() * 15);
            windSpeed = Math.max(windSpeed, 12 + Math.random() * 8);
        } else if (forecastCondition === 'sunny') {
            humidity = Math.max(45, humidity - Math.random() * 20);
            windSpeed = Math.max(5, windSpeed - Math.random() * 5);
        }
        
        return {
            condition: forecastCondition,
            temp: Math.round(temp),
            tempMin: Math.round(temp - 3 - Math.random() * 2),
            tempMax: Math.round(temp + 3 + Math.random() * 2),
            description: description,
            humidity: Math.round(Math.min(95, Math.max(30, humidity + (Math.random() * 10 - 5)))),
            windSpeed: Math.round(Math.max(3, windSpeed + (Math.random() * 6 - 3))),
            precipitation: Math.round(precipitation)
        };
    }

    getWeatherDescription(condition) {
        const descriptions = {
            sunny: ['Clear sky', 'Sunny', 'Bright and sunny', 'Mostly sunny'],
            rainy: ['Light rain', 'Moderate rain', 'Showers', 'Drizzle'],
            cloudy: ['Partly cloudy', 'Overcast', 'Mostly cloudy', 'Cloudy'],
            snowy: ['Light snow', 'Snow showers', 'Heavy snow', 'Snowfall'],
            stormy: ['Thunderstorms', 'Severe weather', 'Storm', 'Thunder and lightning'],
            misty: ['Misty', 'Foggy', 'Hazy', 'Low visibility']
        };
        
        const conditionDescriptions = descriptions[condition] || descriptions.sunny;
        return conditionDescriptions[Math.floor(Math.random() * conditionDescriptions.length)];
    }

    getWeatherIcon(condition) {
        const icons = {
            sunny: 'fas fa-sun',
            rainy: 'fas fa-cloud-rain',
            cloudy: 'fas fa-cloud',
            snowy: 'fas fa-snowflake',
            stormy: 'fas fa-bolt',
            misty: 'fas fa-smog'
        };
        
        return icons[condition] || 'fas fa-cloud';
    }

    displayWeather(data) {
        try {
            console.log('🌦️ Displaying weather data:', data);
            
            // Update basic weather info
            document.getElementById('cityName').textContent = data.location;
            document.getElementById('countryName').textContent = data.country;
            document.getElementById('currentTime').textContent = new Date().toLocaleString();
            document.getElementById('temperature').textContent = `${data.temp}°`;
            document.getElementById('feelsLike').textContent = `${data.feelsLike}°`;
            document.getElementById('weatherDescription').textContent = data.description;
            document.getElementById('weatherIcon').className = `weather-icon ${data.icon}`;
            
            console.log('✅ Basic weather info updated');
            
            // Update weather details
            document.getElementById('realFeel').textContent = `${data.feelsLike}°`;
            document.getElementById('humidity').textContent = `${data.humidity}%`;
            document.getElementById('windSpeed').textContent = `${data.windSpeed} km/h`;
            document.getElementById('windDirection').textContent = data.windDirection || 'N/A';
            document.getElementById('pressure').textContent = `${data.pressure} hPa`;
            document.getElementById('visibility').textContent = `${data.visibility} km`;
            document.getElementById('uvIndex').textContent = data.uvIndex || 'N/A';
            
            // Update AQI information
            const aqiElement = document.getElementById('aqi');
            const aqiStatusElement = document.getElementById('aqiStatus');
            
            if (data.aqi) {
                aqiElement.textContent = data.aqi;
                aqiStatusElement.textContent = data.aqiStatus;
                
                // Apply AQI color coding
                aqiStatusElement.className = 'aqi-status';
                if (data.aqi <= 50) {
                    aqiStatusElement.classList.add('good');
                } else if (data.aqi <= 100) {
                    aqiStatusElement.classList.add('moderate');
                } else if (data.aqi <= 200) {
                    aqiStatusElement.classList.add('unhealthy');
                } else {
                    aqiStatusElement.classList.add('hazardous');
                }
            } else {
                aqiElement.textContent = 'N/A';
                aqiStatusElement.textContent = 'N/A';
            }

            console.log('✅ Weather details updated');

            // Apply mood-based theme
            this.applyWeatherTheme(data.condition);
            
            // Update weather quote
            this.updateQuote(this.getWeatherQuote(data.condition));
            
            // Show weather animations
            this.showWeatherAnimation(data.condition);
            
            // Generate outfit recommendations
            this.generateOutfitRecommendation(data);
            
            // Update background music
            this.updateBackgroundMusic(data.condition);
            
            // Update current weather condition
            this.currentWeatherCondition = data.condition;
            
            // Update Weather Mood Player
            this.updateWeatherMoodUI(data.condition);
            if (this.audioEnabled && this.userInteracted) {
                this.playWeatherMood(data.condition);
            }
            
            // Generate and display 5-day forecast
            this.display5DayForecast(data.location);

            // Show weather info - This is the critical part!
            const weatherInfo = document.getElementById('weatherInfo');
            if (weatherInfo) {
                weatherInfo.classList.add('active');
                console.log('✅ Weather info made active. Current classes:', weatherInfo.className);
                console.log('✅ Weather info display style:', window.getComputedStyle(weatherInfo).display);
            } else {
                console.error('❌ Weather info element not found!');
            }
            
            console.log('🎉 Weather display completed successfully');
            
        } catch (error) {
            console.error('❌ Error in displayWeather:', error);
            this.showError('Failed to display weather information');
        }
    }

    applyWeatherTheme(condition) {
        const container = document.getElementById('weatherContainer');
        // Remove all weather classes
        container.className = 'weather-container';
        // Add specific weather class
        container.classList.add(condition);
    }

    getWeatherQuote(condition) {
        const quotes = {
            sunny: [
                "What a beautiful sunny day! Time to shine! ☀️",
                "Sunshine is the best medicine for the soul! 🌞",
                "Perfect weather for outdoor adventures! 🌻"
            ],
            rainy: [
                "Stay cozy! It's raining outside 🌧️",
                "Perfect weather for a cup of tea and a good book ☕",
                "Let the rain wash away your worries 💧"
            ],
            cloudy: [
                "Cloudy skies, but bright possibilities ahead! ☁️",
                "Every cloud has a silver lining! ✨",
                "Cozy weather for indoor activities 🏠"
            ],
            snowy: [
                "Winter wonderland vibes! Stay warm! ❄️",
                "Snow brings magic to the world! ⛄",
                "Perfect weather for hot chocolate! ☕"
            ],
            stormy: [
                "Weather the storm, brighter days are coming! ⛈️",
                "Stay safe indoors during the storm! 🏠",
                "After every storm comes a rainbow! 🌈"
            ],
            misty: [
                "Mystical and dreamy weather today! 🌫️",
                "Perfect atmosphere for reflection! 💭",
                "Drive safely in the misty conditions! 🚗"
            ]
        };

        const weatherQuotes = quotes[condition] || quotes.cloudy;
        return weatherQuotes[Math.floor(Math.random() * weatherQuotes.length)];
    }

    updateQuote(quote) {
        document.getElementById('quoteText').textContent = quote;
    }

    showWeatherAnimation(condition) {
        try {
            // Hide all animations first
            const animations = ['clouds', 'rain', 'snow', 'sunRays'];
            animations.forEach(anim => {
                const element = document.getElementById(anim);
                if (element) element.classList.remove('active');
            });

            // Show specific animation based on weather
            switch (condition) {
                case 'sunny':
                    this.createSunRays();
                    const sunRays = document.getElementById('sunRays');
                    if (sunRays) sunRays.classList.add('active');
                    break;
                case 'cloudy':
                    this.createClouds();
                    const clouds = document.getElementById('clouds');
                    if (clouds) clouds.classList.add('active');
                    break;
                case 'rainy':
                    this.createRain();
                    const rain = document.getElementById('rain');
                    if (rain) rain.classList.add('active');
                    break;
                case 'snowy':
                    this.createSnow();
                    const snow = document.getElementById('snow');
                    if (snow) snow.classList.add('active');
                    break;
                case 'stormy':
                    this.createRain();
                    this.createLightning();
                    const stormRain = document.getElementById('rain');
                    if (stormRain) stormRain.classList.add('active');
                    break;
            }
        } catch (error) {
            console.error('Error in weather animation:', error);
        }
    }

    createClouds() {
        const cloudsContainer = document.getElementById('clouds');
        if (!cloudsContainer) {
            console.log('ℹ️ Clouds container not found, skipping animation...');
            return;
        }
        cloudsContainer.innerHTML = '';
        
        for (let i = 0; i < 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.width = `${100 + Math.random() * 100}px`;
            cloud.style.height = `${60 + Math.random() * 40}px`;
            cloud.style.top = `${Math.random() * 40}%`;
            cloud.style.animationDelay = `${Math.random() * 20}s`;
            cloud.style.animationDuration = `${20 + Math.random() * 10}s`;
            cloudsContainer.appendChild(cloud);
        }
    }

    createRain() {
        const rainContainer = document.getElementById('rain');
        if (!rainContainer) {
            console.log('ℹ️ Rain container not found, skipping animation...');
            return;
        }
        rainContainer.innerHTML = '';
        
        for (let i = 0; i < 100; i++) {
            const raindrop = document.createElement('div');
            raindrop.className = 'raindrop';
            raindrop.style.left = `${Math.random() * 100}%`;
            raindrop.style.animationDelay = `${Math.random() * 2}s`;
            raindrop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            rainContainer.appendChild(raindrop);
        }
    }

    createSnow() {
        const snowContainer = document.getElementById('snow');
        if (!snowContainer) {
            console.log('ℹ️ Snow container not found, skipping animation...');
            return;
        }
        snowContainer.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❄';
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.fontSize = `${10 + Math.random() * 20}px`;
            snowflake.style.animationDelay = `${Math.random() * 3}s`;
            snowflake.style.animationDuration = `${3 + Math.random() * 2}s`;
            snowContainer.appendChild(snowflake);
        }
    }

    createSunRays() {
        const sunRaysContainer = document.getElementById('sunRays');
        if (!sunRaysContainer) {
            console.log('ℹ️ Sun rays container not found, skipping animation...');
            return;
        }
        sunRaysContainer.innerHTML = '';
        
        for (let i = 0; i < 12; i++) {
            const ray = document.createElement('div');
            ray.className = 'sun-ray';
            ray.style.left = '50%';
            ray.style.top = '20%';
            ray.style.transform = `rotate(${i * 30}deg)`;
            ray.style.animationDelay = `${Math.random() * 3}s`;
            sunRaysContainer.appendChild(ray);
        }
    }

    createLightning() {
        const lightningContainer = document.getElementById('lightning');
        if (!lightningContainer) {
            console.log('ℹ️ Lightning container not found, skipping animation...');
            return;
        }
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                lightningContainer.classList.add('flash');
                setTimeout(() => {
                    lightningContainer.classList.remove('flash');
                }, 100);
            }
        }, 1000);
    }

    generateOutfitRecommendation(data) {
        const outfitItems = document.getElementById('outfitItems');
        const outfitAdvice = document.getElementById('outfitAdvice');
        
        // Skip if elements don't exist
        if (!outfitItems || !outfitAdvice) {
            console.log('ℹ️ Outfit recommendation elements not found, skipping...');
            return;
        }
        
        outfitItems.innerHTML = '';
        
        const temp = data.temp;
        const condition = data.condition;
        const windSpeed = data.windSpeed;
        const humidity = data.humidity;
        const aqi = data.aqi;
        const feelsLike = data.feelsLike;
        
        let items = [];
        let advice = '';
        let accessories = [];

        // Temperature-based recommendations
        if (temp <= 0) {
            items = [
                { icon: '🧥', text: 'Heavy Winter Coat', priority: 'essential' },
                { icon: '🧣', text: 'Warm Scarf', priority: 'essential' },
                { icon: '🧤', text: 'Insulated Gloves', priority: 'essential' },
                { icon: '👢', text: 'Winter Boots', priority: 'essential' },
                { icon: '🧦', text: 'Thermal Socks', priority: 'recommended' }
            ];
            advice = "❄️ Bundle up! It's freezing outside. Layer up with warm clothing and avoid prolonged exposure.";
        } else if (temp <= 10) {
            items = [
                { icon: '🧥', text: 'Warm Jacket', priority: 'essential' },
                { icon: '👖', text: 'Long Pants', priority: 'essential' },
                { icon: '👟', text: 'Closed Shoes', priority: 'essential' },
                { icon: '🧣', text: 'Light Scarf', priority: 'recommended' }
            ];
            advice = "🌡️ Cool weather ahead! A jacket will keep you comfortable.";
        } else if (temp <= 20) {
            items = [
                { icon: '🧥', text: 'Light Jacket', priority: 'recommended' },
                { icon: '👕', text: 'Long Sleeve Shirt', priority: 'essential' },
                { icon: '👖', text: 'Comfortable Pants', priority: 'essential' },
                { icon: '👟', text: 'Sneakers', priority: 'essential' }
            ];
            advice = "🌤️ Mild temperature - perfect for layering!";
        } else if (temp <= 30) {
            items = [
                { icon: '👕', text: 'Comfortable T-Shirt', priority: 'essential' },
                { icon: '🩳', text: 'Shorts or Light Pants', priority: 'essential' },
                { icon: '👟', text: 'Breathable Sneakers', priority: 'essential' }
            ];
            advice = "😊 Pleasant weather! Light, comfortable clothing is perfect.";
        } else {
            items = [
                { icon: '👕', text: 'Light Cotton T-Shirt', priority: 'essential' },
                { icon: '🩳', text: 'Shorts', priority: 'essential' },
                { icon: '🩴', text: 'Sandals', priority: 'recommended' },
                { icon: '🧴', text: 'Sunscreen SPF 30+', priority: 'essential' }
            ];
            advice = "🌡️ It's hot! Stay cool with light clothing and don't forget sunscreen!";
        }

        // Weather condition adjustments
        if (condition === 'rainy' || condition === 'stormy') {
            items.push({ icon: '☂️', text: 'Umbrella', priority: 'essential' });
            items.push({ icon: '🥾', text: 'Waterproof Shoes', priority: 'essential' });
            items.push({ icon: '🧥', text: 'Rain Jacket', priority: 'recommended' });
            advice += " ☔ Don't forget your umbrella and waterproof gear!";
        }

        if (condition === 'snowy') {
            items.push({ icon: '🧤', text: 'Insulated Gloves', priority: 'essential' });
            items.push({ icon: '👢', text: 'Snow Boots', priority: 'essential' });
            items.push({ icon: '🧣', text: 'Warm Scarf', priority: 'recommended' });
            advice += " ❄️ Wear non-slip shoes for snowy conditions!";
        }

        if (condition === 'sunny') {
            items.push({ icon: '🕶️', text: 'UV Protection Sunglasses', priority: 'essential' });
            items.push({ icon: '🧢', text: 'Sun Hat', priority: 'recommended' });
            advice += " ☀️ Protect yourself from UV rays with sunglasses and a hat!";
        }

        // Additional recommendations based on conditions
        if (windSpeed > 20) {
            items.push({ icon: '🧥', text: 'Wind-resistant Jacket', priority: 'recommended' });
            advice += " 💨 It's windy - secure loose clothing and accessories!";
        }

        if (humidity > 80) {
            items.push({ icon: '👕', text: 'Moisture-wicking Fabric', priority: 'recommended' });
            advice += " 💧 High humidity - choose breathable fabrics!";
        }

        if (aqi && aqi > 100) {
            items.push({ icon: '😷', text: 'Air Pollution Mask', priority: 'essential' });
            advice += " 🏭 High pollution - wear a mask when outdoors!";
        }

        if (data.uvIndex && data.uvIndex > 6) {
            items.push({ icon: '🧴', text: 'Extra Sunscreen', priority: 'essential' });
            advice += " ⚠️ High UV Index - reapply sunscreen frequently!";
        }

        // Display outfit items with priority styling
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `outfit-item ${item.priority || 'recommended'}`;
            itemElement.innerHTML = `
                <span class="outfit-icon">${item.icon}</span>
                <span class="outfit-text">${item.text}</span>
                <span class="outfit-priority">${item.priority || 'recommended'}</span>
            `;
            outfitItems.appendChild(itemElement);
        });

        outfitAdvice.textContent = advice;
    }

    updateBackgroundMusic(condition) {
        // Update current weather condition for music selection
        this.currentWeatherCondition = condition;
        this.currentSongIndex = 0;
        
        // Update the displayed song
        this.updateCurrentSong();
        
        // Note: In a real application, you would need actual audio files
        // This is just setting up the structure
        const audioSource = document.getElementById('audioSource');
        if (!audioSource) {
            console.log('ℹ️ Audio source not found, skipping music update...');
            return;
        }
        
        const musicPaths = {
            sunny: 'audio/sunny-mood.mp3',
            rainy: 'audio/rain-sounds.mp3',
            cloudy: 'audio/ambient-calm.mp3',
            snowy: 'audio/winter-sounds.mp3',
            stormy: 'audio/storm-sounds.mp3'
        };

        if (musicPaths[condition]) {
            audioSource.src = musicPaths[condition];
        }
    }

    display5DayForecast(location) {
        const forecastContainer = document.getElementById('forecastContainer');
        
        // Skip if element doesn't exist
        if (!forecastContainer) {
            console.log('ℹ️ Forecast container not found, skipping...');
            return;
        }
        
        const forecast = this.get5DayForecast(location);
        forecastContainer.innerHTML = '';
        
        forecast.forEach((day, index) => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            
            const dayName = index === 0 ? 'Today' : 
                          index === 1 ? 'Tomorrow' : 
                          day.date.toLocaleDateString('en-US', { weekday: 'short' });
            
            forecastItem.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">
                    <i class="${day.icon}"></i>
                </div>
                <div class="forecast-temps">
                    <span class="forecast-high">${day.tempMax}°</span>
                    <span class="forecast-low">${day.tempMin}°</span>
                </div>
                <div class="forecast-condition">${day.description}</div>
                <div class="forecast-detail">
                    <i class="fas fa-tint"></i>
                    <span>${day.humidity}%</span>
                </div>
            `;
            
            forecastContainer.appendChild(forecastItem);
        });
    }

    get5DayForecast(location) {
        // Generate realistic 5-day forecast data
        const today = new Date();
        const forecast = [];
        
        // Sample weather conditions for variety
        const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy', 'misty'];
        const weatherIcons = {
            sunny: 'fas fa-sun',
            cloudy: 'fas fa-cloud',
            rainy: 'fas fa-cloud-rain',
            snowy: 'fas fa-snowflake',
            stormy: 'fas fa-bolt',
            misty: 'fas fa-smog'
        };
        
        const descriptions = {
            sunny: ['Sunny', 'Clear skies', 'Bright sun', 'Beautiful day'],
            cloudy: ['Cloudy', 'Overcast', 'Partly cloudy', 'Mostly cloudy'],
            rainy: ['Light rain', 'Heavy rain', 'Showers', 'Thunderstorms'],
            snowy: ['Light snow', 'Heavy snow', 'Snow showers', 'Blizzard'],
            stormy: ['Thunderstorms', 'Severe storms', 'Lightning', 'Heavy storms'],
            misty: ['Mist', 'Fog', 'Hazy', 'Low visibility']
        };
        
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            // Generate semi-realistic weather patterns
            const baseTemp = 20 + Math.sin(i * 0.5) * 10; // Simulate temperature variation
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            const tempVariation = Math.random() * 10 - 5; // ±5 degrees variation
            
            const dayData = {
                date: date,
                condition: condition,
                icon: weatherIcons[condition],
                tempMax: Math.round(baseTemp + tempVariation + Math.random() * 5),
                tempMin: Math.round(baseTemp + tempVariation - Math.random() * 5),
                description: descriptions[condition][Math.floor(Math.random() * descriptions[condition].length)],
                humidity: Math.round(40 + Math.random() * 40), // 40-80%
                windSpeed: Math.round(5 + Math.random() * 20), // 5-25 km/h
                precipitation: condition === 'rainy' || condition === 'stormy' ? 
                              Math.round(60 + Math.random() * 40) : // 60-100% for rain/storms
                              condition === 'snowy' ? 
                              Math.round(70 + Math.random() * 30) : // 70-100% for snow
                              Math.round(Math.random() * 20) // 0-20% for other conditions
            };
            
            forecast.push(dayData);
        }
        
        return forecast;
    }

    updateCurrentSong() {
        const songs = this.getWeatherSongs(this.currentWeatherCondition);
        const currentSong = songs[this.currentSongIndex];
        const songDisplay = document.getElementById('currentSong');
        const moodDisplay = document.getElementById('songMood');
        
        // Skip if elements don't exist
        if (!songDisplay || !moodDisplay) {
            console.log('ℹ️ Song display elements not found, skipping...');
            return;
        }
        
        if (currentSong) {
            songDisplay.textContent = `${currentSong.title} - ${currentSong.artist}`;
            songDisplay.title = `Mood: ${currentSong.mood}`;
            
            // Display mood-based message
            const moodMessages = {
                uplifting: "Lift your spirits! 🌟",
                energetic: "Feel the energy! ⚡",
                happy: "Spread the joy! 😊",
                relaxed: "Stay calm and relaxed 😌",
                vibrant: "Vibrant vibes ahead! 🎉",
                joyful: "Pure happiness! 🎵",
                peaceful: "Find your peace 🕊️",
                chill: "Chill and unwind 🌊",
                upbeat: "Dance in the rain! 💃",
                playful: "Stay playful! 🎈",
                confident: "Own your confidence! 💪",
                hopeful: "Hope is coming! 🌈",
                optimistic: "Stay positive! ✨",
                emotional: "Feel all the feels 💜",
                powerful: "You've got the power! 🔥",
                intense: "Embrace the intensity! ⚡",
                reflective: "Time to reflect 🤔",
                contemplative: "Deep thoughts ahead 💭",
                cheerful: "Cheerful moments! 🌻",
                dreamy: "Dream away! ☁️",
                mellow: "Smooth and mellow 🎶",
                atmospheric: "Lost in the atmosphere 🌙",
                cozy: "Cozy vibes only! 🏠",
                festive: "Celebrate the weather! 🎊",
                magical: "Feel the magic! ✨",
                serene: "Peaceful serenity 🧘",
                empowering: "You are powerful! 👑",
                warm: "Warm your heart! ❤️",
                mysterious: "Mystery awaits... 🌫️",
                dramatic: "Dramatic flair! 🎭",
                soulful: "Touch your soul 💫",
                romantic: "Romance in the air! 💕",
                jazzy: "Smooth jazz vibes! 🎷",
                ambient: "Ambient tranquility 🌊"
            };
            
            moodDisplay.textContent = moodMessages[currentSong.mood] || "Feel the music! 🎵";
        }
    }

    toggleMusicPlayer() {
        const musicControls = document.getElementById('musicControls');
        const musicToggle = document.getElementById('musicToggle');
        
        if (musicControls.classList.contains('active')) {
            musicControls.classList.remove('active');
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Weather Mood</span>';
        } else {
            musicControls.classList.add('active');
            musicToggle.innerHTML = '<i class="fas fa-chevron-up"></i><span>Hide Player</span>';
            this.updateCurrentSong();
            this.updateMusicStats();
        }
    }

    updateMusicStats() {
        const songs = this.getWeatherSongs(this.currentWeatherCondition);
        const songCountElement = document.getElementById('songCount');
        const weatherTypeElement = document.getElementById('weatherType');
        
        if (songCountElement) {
            songCountElement.textContent = `${songs.length} songs`;
        }
        
        if (weatherTypeElement) {
            const weatherNames = {
                sunny: 'Sunny ☀️',
                rainy: 'Rainy 🌧️',
                cloudy: 'Cloudy ☁️',
                snowy: 'Snowy ❄️',
                stormy: 'Stormy ⛈️',
                misty: 'Misty 🌫️'
            };
            weatherTypeElement.textContent = weatherNames[this.currentWeatherCondition] || 'Weather';
        }
    }

    togglePlayPause() {
        const playPauseBtn = document.getElementById('playPause');
        const audio = document.getElementById('weatherAudio');
        
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.classList.add('playing');
            // In a real app, you would call: audio.play();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.classList.remove('playing');
            // In a real app, you would call: audio.pause();
        }
    }

    previousSong() {
        const songs = this.getWeatherSongs(this.currentWeatherCondition);
        this.currentSongIndex = (this.currentSongIndex - 1 + songs.length) % songs.length;
        this.updateCurrentSong();
        this.updateMusicStats();
        
        // Add visual feedback
        const prevBtn = document.getElementById('prevSong');
        prevBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            prevBtn.style.transform = 'scale(1)';
        }, 100);
    }

    nextSong() {
        const songs = this.getWeatherSongs(this.currentWeatherCondition);
        this.currentSongIndex = (this.currentSongIndex + 1) % songs.length;
        this.updateCurrentSong();
        this.updateMusicStats();
        
        // Add visual feedback
        const nextBtn = document.getElementById('nextSong');
        nextBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            nextBtn.style.transform = 'scale(1)';
        }, 100);
    }

    shuffleSongs() {
        const songs = this.getWeatherSongs(this.currentWeatherCondition);
        this.currentSongIndex = Math.floor(Math.random() * songs.length);
        this.updateCurrentSong();
        this.updateMusicStats();
        
        // Add visual feedback with shuffle animation
        const shuffleBtn = document.getElementById('shuffleSongs');
        shuffleBtn.style.transform = 'rotate(360deg)';
        shuffleBtn.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            shuffleBtn.style.transform = 'rotate(0deg)';
            shuffleBtn.style.transition = 'all 0.3s ease';
        }, 500);
    }

    toggleMusic() {
        const audio = document.getElementById('weatherAudio');
        const musicToggle = document.getElementById('musicToggle');
        
        if (audio.paused) {
            // For demo purposes, we'll just show the visual state
            // In production, you would load actual audio files
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<i class="fas fa-pause"></i><span>Weather Mood</span>';
            // audio.play();
        } else {
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Weather Mood</span>';
            // audio.pause();
        }
    }

    showLoading() {
        document.getElementById('loading').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading').classList.remove('active');
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        document.getElementById('errorMessage').classList.add('active');
    }

    hideError() {
        document.getElementById('errorMessage').classList.remove('active');
    }

    // Real API integration method (for when you get an API key)
    async fetchWeatherData(location) {
        const url = `${this.apiUrl}?q=${location}&appid=${this.apiKey}&units=metric`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        
        const data = await response.json();
        
        return {
            location: data.name,
            country: data.sys.country,
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            condition: this.mapWeatherCondition(data.weather[0].main),
            icon: this.mapWeatherIcon(data.weather[0].icon),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            pressure: data.main.pressure,
            visibility: Math.round(data.visibility / 1000) // Convert m to km
        };
    }

    mapWeatherCondition(condition) {
        const conditionMap = {
            'Clear': 'sunny',
            'Clouds': 'cloudy',
            'Rain': 'rainy',
            'Drizzle': 'rainy',
            'Thunderstorm': 'stormy',
            'Snow': 'snowy',
            'Mist': 'misty',
            'Fog': 'misty',
            'Haze': 'misty'
        };
        
        return conditionMap[condition] || 'cloudy';
    }

    mapWeatherIcon(iconCode) {
        const iconMap = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',  
            '04d': 'fas fa-cloud',
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain',
            '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };
        
        return iconMap[iconCode] || 'fas fa-cloud';
    }

    // ===== WEATHER MOOD PLAYER METHODS =====
    
    initWeatherMoodPlayer() {
        try {
            // Get audio elements
            this.audioElements = {
                sunny: document.getElementById('sunnyAudio'),
                rainy: document.getElementById('rainyAudio'),
                snowy: document.getElementById('snowyAudio')
            };
            
            // Initialize audio settings
            Object.values(this.audioElements).forEach(audio => {
                if (audio) {
                    audio.volume = 0.3; // Default volume
                    audio.loop = true;
                    
                    // Handle audio loading
                    audio.addEventListener('canplaythrough', () => {
                        console.log(`Audio loaded: ${audio.id}`);
                    });
                    
                    audio.addEventListener('error', (e) => {
                        console.warn(`Audio error for ${audio.id}:`, e);
                    });
                }
            });
            
            // Set default volume slider
            const volumeSlider = document.getElementById('volumeSlider');
            if (volumeSlider) {
                volumeSlider.value = 30;
            }
            
            console.log('Weather Mood Player initialized');
        } catch (error) {
            console.error('Error initializing Weather Mood Player:', error);
        }
    }
    
    updateWeatherMoodUI(condition) {
        try {
            const moodSection = document.getElementById('weatherMoodSection');
            const moodAnimation = document.getElementById('moodAnimation');
            const moodWeatherIcon = document.getElementById('moodWeatherIcon');
            const weatherParticles = document.getElementById('weatherParticles');
            const currentMoodTrack = document.getElementById('currentMoodTrack');
            
            // Update section theme
            if (moodSection) {
                moodSection.className = `weather-mood-section ${condition}`;
            }
            
            // Update animation
            if (moodAnimation) {
                moodAnimation.className = `mood-animation ${condition}`;
            }
            
            // Update weather particles
            if (weatherParticles) {
                weatherParticles.className = `weather-particles ${condition}`;
            }
            
            // Update weather icon
            if (moodWeatherIcon) {
                const iconMap = {
                    sunny: 'fas fa-sun',
                    rainy: 'fas fa-cloud-rain',
                    snowy: 'fas fa-snowflake',
                    cloudy: 'fas fa-cloud',
                    stormy: 'fas fa-bolt',
                    misty: 'fas fa-smog'
                };
                
                moodWeatherIcon.innerHTML = `<i class="${iconMap[condition] || 'fas fa-cloud'}"></i>`;
            }
            
            // Update track name
            if (currentMoodTrack) {
                const trackNames = {
                    sunny: 'Sunny Day Vibes',
                    rainy: 'Peaceful Rain Sounds',
                    snowy: 'Winter Serenity',
                    cloudy: 'Cloudy Day Ambience',
                    stormy: 'Storm Sounds',
                    misty: 'Misty Atmosphere'
                };
                
                currentMoodTrack.textContent = trackNames[condition] || 'Weather Ambience';
            }
            
        } catch (error) {
            console.error('Error updating Weather Mood UI:', error);
        }
    }
    
    async playWeatherMood(condition) {
        try {
            // Stop any currently playing audio
            this.stopAllMoodAudio();
            
            // Map weather conditions to audio
            const audioMapping = {
                sunny: 'sunny',
                rainy: 'rainy',
                snowy: 'snowy',
                cloudy: 'sunny', // fallback to sunny
                stormy: 'rainy', // fallback to rainy
                misty: 'rainy'   // fallback to rainy
            };
            
            const audioKey = audioMapping[condition] || 'sunny';
            const audio = this.audioElements[audioKey];
            
            if (audio && this.audioEnabled && this.userInteracted) {
                try {
                    await audio.play();
                    this.weatherMoodPlayer = audio;
                    this.updatePlayPauseButton(true);
                    console.log(`Playing mood audio: ${audioKey}`);
                } catch (playError) {
                    console.warn('Auto-play blocked or audio error:', playError);
                    this.updatePlayPauseButton(false);
                }
            }
            
        } catch (error) {
            console.error('Error playing weather mood:', error);
        }
    }
    
    stopAllMoodAudio() {
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
        this.weatherMoodPlayer = null;
        this.updatePlayPauseButton(false);
    }
    
    toggleMoodAudio() {
        this.audioEnabled = !this.audioEnabled;
        const moodToggle = document.getElementById('moodToggle');
        
        if (moodToggle) {
            if (this.audioEnabled) {
                moodToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                moodToggle.classList.remove('muted');
                
                // Start playing if weather data is available
                if (this.currentWeatherCondition && this.userInteracted) {
                    this.playWeatherMood(this.currentWeatherCondition);
                }
            } else {
                moodToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                moodToggle.classList.add('muted');
                this.stopAllMoodAudio();
            }
        }
    }
    
    toggleMoodPlayPause() {
        if (!this.userInteracted) {
            this.userInteracted = true;
        }
        
        if (this.weatherMoodPlayer && !this.weatherMoodPlayer.paused) {
            // Pause
            this.weatherMoodPlayer.pause();
            this.updatePlayPauseButton(false);
        } else {
            // Play
            if (this.audioEnabled) {
                this.playWeatherMood(this.currentWeatherCondition);
            } else {
                // Enable audio if not enabled
                this.audioEnabled = true;
                this.toggleMoodAudio();
            }
        }
    }
    
    updatePlayPauseButton(isPlaying) {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            if (isPlaying) {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playPauseBtn.classList.add('playing');
            } else {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.classList.remove('playing');
            }
        }
    }
    
    setMoodVolume(volume) {
        const volumePercent = volume / 100;
        
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.volume = volumePercent;
            }
        });
        
        // Update volume icon
        const volumeIcon = document.querySelector('.volume-control i:first-child');
        if (volumeIcon) {
            if (volume == 0) {
                volumeIcon.className = 'fas fa-volume-mute';
            } else if (volume < 50) {
                volumeIcon.className = 'fas fa-volume-down';
            } else {
                volumeIcon.className = 'fas fa-volume-up';
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Service Worker Registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}