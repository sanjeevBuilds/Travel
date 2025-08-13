// Multi-modal Route Planning Engine
class RoutePlanner {
    constructor() {
        // Transport modes with their characteristics
        this.transportModes = {
            flight: {
                name: 'Flight',
                icon: '✈️',
                speedKmh: 500,
                costPerKm: 8,
                minDistance: 200, // Only for distances > 200km
                maxDistance: 5000,
                comfortLevel: 9,
                reliability: 8,
                availability: 0.7 // Available 70% of routes
            },
            train: {
                name: 'Train',
                icon: '🚂',
                speedKmh: 80,
                costPerKm: 1.5,
                minDistance: 50,
                maxDistance: 3000,
                comfortLevel: 7,
                reliability: 9,
                availability: 0.8
            },
            bus: {
                name: 'Bus',
                icon: '🚌',
                speedKmh: 60,
                costPerKm: 1,
                minDistance: 20,
                maxDistance: 1500,
                comfortLevel: 5,
                reliability: 7,
                availability: 0.9
            },
            car: {
                name: 'Car/Taxi',
                icon: '🚗',
                speedKmh: 70,
                costPerKm: 4,
                minDistance: 5,
                maxDistance: 1000,
                comfortLevel: 8,
                reliability: 8,
                availability: 0.95
            },
            auto: {
                name: 'Auto Rickshaw',
                icon: '🛺',
                speedKmh: 25,
                costPerKm: 2,
                minDistance: 1,
                maxDistance: 50,
                comfortLevel: 4,
                reliability: 6,
                availability: 0.98
            },
            walk: {
                name: 'Walk',
                icon: '🚶',
                speedKmh: 5,
                costPerKm: 0,
                minDistance: 0.5,
                maxDistance: 10,
                comfortLevel: 3,
                reliability: 10,
                availability: 1
            },
            metro: {
                name: 'Metro',
                icon: '🚇',
                speedKmh: 35,
                costPerKm: 0.8,
                minDistance: 2,
                maxDistance: 80,
                comfortLevel: 7,
                reliability: 9,
                availability: 0.6 // Only in metro cities
            }
        };

        // City coordinates (approximate) for distance calculation
        this.cityCoordinates = {
            // Cities
            'Mumbai': { lat: 19.0760, lng: 72.8777 },
            'Delhi': { lat: 28.7041, lng: 77.1025 },
            'Bengaluru': { lat: 12.9716, lng: 77.5946 },
            'Kolkata': { lat: 22.5726, lng: 88.3639 },
            'Chennai': { lat: 13.0827, lng: 80.2707 },
            'Hyderabad': { lat: 17.3850, lng: 78.4867 },
            'Pune': { lat: 18.5204, lng: 73.8567 },
            'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
            'Jaipur': { lat: 26.9124, lng: 75.7873 },
            'Surat': { lat: 21.1702, lng: 72.8311 },
            'Lucknow': { lat: 26.8467, lng: 80.9462 },
            'Kanpur': { lat: 26.4499, lng: 80.3319 },
            'Nagpur': { lat: 21.1458, lng: 79.0882 },
            'Indore': { lat: 22.7196, lng: 75.8577 },
            'Thane': { lat: 19.2183, lng: 72.9781 },
            'Bhopal': { lat: 23.2599, lng: 77.4126 },
            'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
            'Pimpri-Chinchwad': { lat: 18.6298, lng: 73.7997 },
            'Patna': { lat: 25.5941, lng: 85.1376 },
            'Vadodara': { lat: 22.3072, lng: 73.1812 },
            'Ghaziabad': { lat: 28.6692, lng: 77.4538 },
            'Ludhiana': { lat: 30.9010, lng: 75.8573 },
            'Agra': { lat: 27.1767, lng: 78.0081 },
            'Nashik': { lat: 19.9975, lng: 73.7898 },
            'Faridabad': { lat: 28.4089, lng: 77.3178 },
            'Meerut': { lat: 28.9845, lng: 77.7064 },
            'Rajkot': { lat: 22.3039, lng: 70.8022 },
            'Kalyan-Dombivli': { lat: 19.2403, lng: 73.1305 },
            'Vasai-Virar': { lat: 19.4912, lng: 72.8054 },
            'Varanasi': { lat: 25.3176, lng: 82.9739 },
            'Srinagar': { lat: 34.0837, lng: 74.7973 },
            'Aurangabad': { lat: 19.8762, lng: 75.3433 },
            'Dhanbad': { lat: 23.7957, lng: 86.4304 },
            'Amritsar': { lat: 31.6340, lng: 74.8723 },
            'Navi Mumbai': { lat: 19.0330, lng: 73.0297 },
            'Allahabad': { lat: 25.4358, lng: 81.8463 },
            'Ranchi': { lat: 23.3441, lng: 85.3096 },
            'Howrah': { lat: 22.5958, lng: 88.2636 },
            'Coimbatore': { lat: 11.0168, lng: 76.9558 },
            'Jabalpur': { lat: 23.1815, lng: 79.9864 },
            'Gwalior': { lat: 26.2183, lng: 78.1828 },
            'Vijayawada': { lat: 16.5062, lng: 80.6480 },
            'Jodhpur': { lat: 26.2389, lng: 73.0243 },
            'Madurai': { lat: 9.9252, lng: 78.1198 },
            'Raipur': { lat: 21.2514, lng: 81.6296 },
            'Kota': { lat: 25.2138, lng: 75.8648 },
            'Chandigarh': { lat: 30.7333, lng: 76.7794 },
            'Guwahati': { lat: 26.1445, lng: 91.7362 },
            'Solapur': { lat: 17.6599, lng: 75.9064 },
            'Hubli-Dharwad': { lat: 15.3647, lng: 75.1240 },
            'Bareilly': { lat: 28.3670, lng: 79.4304 },
            'Moradabad': { lat: 28.8386, lng: 78.7733 },
            'Mysore': { lat: 12.2958, lng: 76.6394 },
            'Gurgaon': { lat: 28.4595, lng: 77.0266 },
            'Aligarh': { lat: 27.8974, lng: 78.0880 },
            'Jalandhar': { lat: 31.3260, lng: 75.5762 },
            'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
            'Bhubaneswar': { lat: 20.2961, lng: 85.8245 },
            'Salem': { lat: 11.6643, lng: 78.1460 },
            'Warangal': { lat: 17.9689, lng: 79.5941 },
            'Mira-Bhayandar': { lat: 19.2952, lng: 72.8544 },
            'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
            'Bhiwandi': { lat: 19.3002, lng: 73.0635 },
            'Saharanpur': { lat: 29.9680, lng: 77.5552 },
            'Guntur': { lat: 16.3067, lng: 80.4365 },
            'Amravati': { lat: 20.9374, lng: 77.7796 },
            'Bikaner': { lat: 28.0229, lng: 73.3119 },
            'Noida': { lat: 28.5355, lng: 77.3910 },
            'Jamshedpur': { lat: 22.8046, lng: 86.2029 },
            'Bhilai Nagar': { lat: 21.1938, lng: 81.3509 },
            'Cuttack': { lat: 20.4625, lng: 85.8828 },
            'Firozabad': { lat: 27.1592, lng: 78.3957 },
            'Kochi': { lat: 9.9312, lng: 76.2673 },
            'Bhavnagar': { lat: 21.7645, lng: 72.1519 },
            'Dehradun': { lat: 30.3165, lng: 78.0322 },
            'Durgapur': { lat: 23.4820, lng: 87.3119 },
            'Asansol': { lat: 23.6739, lng: 86.9524 },
            'Rourkela': { lat: 22.2604, lng: 84.8536 },
            'Nanded': { lat: 19.1383, lng: 77.2975 },
            'Kolhapur': { lat: 16.7050, lng: 74.2433 },
            'Ajmer': { lat: 26.4499, lng: 74.6399 },
            'Akola': { lat: 20.7002, lng: 77.0082 },
            'Gulbarga': { lat: 17.3297, lng: 76.8343 },
            'Jamnagar': { lat: 22.4707, lng: 70.0577 },
            'Ujjain': { lat: 23.1765, lng: 75.7885 },
            'Loni': { lat: 28.7333, lng: 77.2833 },
            'Siliguri': { lat: 26.7271, lng: 88.3953 },
            'Jhansi': { lat: 25.4484, lng: 78.5685 },
            'Ulhasnagar': { lat: 19.2215, lng: 73.1645 },
            'Jammu': { lat: 32.7266, lng: 74.8570 },
            'Sangli-Miraj & Kupwad': { lat: 16.8524, lng: 74.5815 },
            'Mangalore': { lat: 12.9141, lng: 74.8560 },
            'Erode': { lat: 11.3410, lng: 77.7172 },
            'Belgaum': { lat: 15.8497, lng: 74.4977 },
            'Ambattur': { lat: 13.1143, lng: 80.1548 },
            'Tirunelveli': { lat: 8.7139, lng: 77.7567 },
            'Malegaon': { lat: 20.5579, lng: 74.5287 },
            'Gaya': { lat: 24.7914, lng: 85.0002 },
            'Jalgaon': { lat: 21.0077, lng: 75.5626 },
            'Udaipur': { lat: 24.5854, lng: 73.7125 },
            
            // Airports (with actual coordinates)
            'Mumbai Airport': { lat: 19.0896, lng: 72.8656 },
            'Delhi Airport': { lat: 28.5562, lng: 77.1000 },
            'Bengaluru Airport': { lat: 13.1986, lng: 77.7066 },
            'Chennai Airport': { lat: 12.9941, lng: 80.1709 },
            'Kolkata Airport': { lat: 22.6546, lng: 88.4467 },
            'Hyderabad Airport': { lat: 17.2403, lng: 78.4294 },
            'Pune Airport': { lat: 18.5822, lng: 73.9197 },
            'Coimbatore Airport': { lat: 11.0297, lng: 77.0436 },
            'Ahmedabad Airport': { lat: 23.0776, lng: 72.6347 },
            'Jaipur Airport': { lat: 26.8242, lng: 75.8122 },
            'Goa Airport': { lat: 15.3808, lng: 73.8314 },
            'Kochi Airport': { lat: 10.1520, lng: 76.4019 },
            'Thiruvananthapuram Airport': { lat: 8.4821, lng: 76.9200 },
            'Lucknow Airport': { lat: 26.7606, lng: 80.8893 },
            'Bhubaneswar Airport': { lat: 20.2444, lng: 85.8178 },
            
            // Railway Stations (with actual coordinates)
            'Mumbai Railway Station': { lat: 19.0144, lng: 72.8479 },
            'Delhi Railway Station': { lat: 28.6428, lng: 77.2197 },
            'Bengaluru Railway Station': { lat: 12.9767, lng: 77.5993 },
            'Chennai Railway Station': { lat: 13.0827, lng: 80.2707 },
            'Kolkata Railway Station': { lat: 22.5726, lng: 88.3639 },
            'Hyderabad Railway Station': { lat: 17.4435, lng: 78.4867 },
            'Pune Railway Station': { lat: 18.5289, lng: 73.8742 },
            'Coimbatore Railway Station': { lat: 11.0015, lng: 76.9628 },
            'Ahmedabad Railway Station': { lat: 23.0216, lng: 72.5797 },
            'Jaipur Railway Station': { lat: 26.9188, lng: 75.7870 },
            'Lucknow Railway Station': { lat: 26.8393, lng: 80.9231 },
            'Kanpur Railway Station': { lat: 26.4619, lng: 80.3496 },
            'Nagpur Railway Station': { lat: 21.1498, lng: 79.0806 },
            'Indore Railway Station': { lat: 22.7179, lng: 75.8333 },
            'Bhopal Railway Station': { lat: 23.2627, lng: 77.4019 },
            
            // Bus Terminals (with actual coordinates)
            'Mumbai Bus Terminal': { lat: 19.0330, lng: 72.8570 },
            'Delhi Bus Terminal': { lat: 28.6562, lng: 77.2410 },
            'Bengaluru Bus Terminal': { lat: 12.9762, lng: 77.6033 },
            'Chennai Bus Terminal': { lat: 13.0732, lng: 80.2609 },
            'Kolkata Bus Terminal': { lat: 22.5675, lng: 88.3700 },
            'Hyderabad Bus Terminal': { lat: 17.4126, lng: 78.4983 },
            'Pune Bus Terminal': { lat: 18.5018, lng: 73.8636 },
            'Coimbatore Bus Terminal': { lat: 11.0102, lng: 76.9653 },
            'Ahmedabad Bus Terminal': { lat: 23.0395, lng: 72.5660 },
            'Jaipur Bus Terminal': { lat: 26.9030, lng: 75.8070 },
            'Lucknow Bus Terminal': { lat: 26.8560, lng: 80.9300 },
            'Kanpur Bus Terminal': { lat: 26.4560, lng: 80.3210 },
            'Nagpur Bus Terminal': { lat: 21.1520, lng: 79.0730 },
            'Indore Bus Terminal': { lat: 22.7280, lng: 75.8420 },
            'Bhopal Bus Terminal': { lat: 23.2700, lng: 77.4200 }
        };    

        // Metro cities (have metro availability) - only for intra-city travel
        this.metroCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi', 'Lucknow', 'Nagpur', 'Gurgaon', 'Noida'];
        
        // Airport/Station distances from city centers (in km)
        this.stationDistances = {
            // Mumbai
            'Mumbai': {
                'airport': 12,
                'railway': 2,
                'bus': 8
            },
            // Delhi
            'Delhi': {
                'airport': 16,
                'railway': 5,
                'bus': 3
            },
            // Bengaluru
            'Bengaluru': {
                'airport': 35,
                'railway': 8,
                'bus': 4
            },
            // Chennai
            'Chennai': {
                'airport': 18,
                'railway': 6,
                'bus': 5
            },
            // Kolkata
            'Kolkata': {
                'airport': 17,
                'railway': 3,
                'bus': 7
            },
            // Hyderabad
            'Hyderabad': {
                'airport': 22,
                'railway': 12,
                'bus': 6
            },
            // Pune
            'Pune': {
                'airport': 10,
                'railway': 4,
                'bus': 3
            },
            // Coimbatore
            'Coimbatore': {
                'airport': 11,
                'railway': 6,
                'bus': 3
            },
            // Ahmedabad
            'Ahmedabad': {
                'airport': 9,
                'railway': 7,
                'bus': 4
            },
            // Jaipur
            'Jaipur': {
                'airport': 13,
                'railway': 5,
                'bus': 6
            }
        };
    }

    // Calculate distance between two cities using Haversine formula
    calculateDistance(city1, city2) {
        const coord1 = this.cityCoordinates[city1];
        const coord2 = this.cityCoordinates[city2];
        
        if (!coord1 || !coord2) {
            // Fallback: more realistic estimate based on city names
            const cityPairs = {
                'Mumbai-Delhi': 1400, 'Delhi-Mumbai': 1400,
                'Mumbai-Bengaluru': 980, 'Bengaluru-Mumbai': 980,
                'Delhi-Bengaluru': 2150, 'Bengaluru-Delhi': 2150,
                'Chennai-Mumbai': 1340, 'Mumbai-Chennai': 1340,
                'Chennai-Delhi': 2180, 'Delhi-Chennai': 2180,
                'Chennai-Bengaluru': 350, 'Bengaluru-Chennai': 350,
                'Kolkata-Mumbai': 2000, 'Mumbai-Kolkata': 2000,
                'Kolkata-Delhi': 1470, 'Delhi-Kolkata': 1470,
                'Kolkata-Kochi': 2300, 'Kochi-Kolkata': 2300,
                'Mumbai-Kochi': 1160, 'Kochi-Mumbai': 1160,
                'Delhi-Kochi': 2650, 'Kochi-Delhi': 2650,
                'Chennai-Kochi': 680, 'Kochi-Chennai': 680,
                'Bengaluru-Kochi': 460, 'Kochi-Bengaluru': 460
            };
            const key = `${city1}-${city2}`;
            return cityPairs[key] || (200 + Math.random() * 800); // 200-1000 km fallback
        }

        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(coord2.lat - coord1.lat);
        const dLng = this.toRad(coord2.lng - coord1.lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(coord1.lat)) * Math.cos(this.toRad(coord2.lat)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    // Check if a location is a station/airport
    isStation(location) {
        return location.includes('Airport') || location.includes('Railway Station') || location.includes('Bus Terminal');
    }
    
    // Get the type of station
    getStationType(location) {
        if (location.includes('Airport')) return 'airport';
        if (location.includes('Railway Station')) return 'railway';
        if (location.includes('Bus Terminal')) return 'bus';
        return null;
    }

    // Check if transport mode is available for given route
    isTransportAvailable(mode, distance, fromCity, toCity) {
        const transport = this.transportModes[mode];
        if (!transport) return false;

        // Distance constraints
        if (distance < transport.minDistance || distance > transport.maxDistance) {
            return false;
        }

        // Metro availability check - only for intra-city travel (same city)
        if (mode === 'metro') {
            // Metro should only be used within the same city, not between different cities
            return fromCity === toCity && this.metroCities.includes(fromCity);
        }

        // Flight availability for very short distances
        if (mode === 'flight' && distance < 200) {
            return false;
        }

        // Make availability more deterministic to ensure route diversity
        const hash = this.hashString(fromCity + toCity + mode);
        return (hash % 100) < (transport.availability * 100);
    }

    // Generate single-mode routes
    generateSingleModeRoutes(fromCity, toCity, distance) {
        const routes = [];
        
        Object.keys(this.transportModes).forEach(mode => {
            const transport = this.transportModes[mode];
            
            if (this.isTransportAvailable(mode, distance, fromCity, toCity)) {
                let segments = [];
                let totalTime = 0;
                let totalCost = 0;
                let totalDistance = 0;
                
                // For station-based transport modes, create multi-segment routes
                if (['flight', 'train', 'bus'].includes(mode)) {
                    const stationTypeMap = {
                        'flight': 'airport',
                        'train': 'railway', 
                        'bus': 'bus'
                    };
                    
                    // Check if source/destination are already stations
                    const isSourceStation = this.isStation(fromCity);
                    const isDestStation = this.isStation(toCity);
                    
                    let sourceStationName, destStationName;
                    
                    if (isSourceStation && this.getStationType(fromCity) === stationTypeMap[mode]) {
                        sourceStationName = fromCity; // Already at the right type of station
                    } else {
                        sourceStationName = this.getStationName(fromCity, mode);
                    }
                    
                    if (isDestStation && this.getStationType(toCity) === stationTypeMap[mode]) {
                        destStationName = toCity; // Already at the right type of station
                    } else {
                        destStationName = this.getStationName(toCity, mode);
                    }
                    
                    const localTransport = this.transportModes['car']; // Use car for local transport
                    
                    // Calculate segments based on whether we start/end at stations
                    if (isSourceStation && this.getStationType(fromCity) === stationTypeMap[mode]) {
                        // Starting from station - no initial segment needed
                        if (isDestStation && this.getStationType(toCity) === stationTypeMap[mode]) {
                            // Station to station direct
                            const mainDistance = this.calculateDistance(sourceStationName, destStationName);
                            if (mainDistance <= 0) return;
                            
                            const mainTime = mainDistance / transport.avgSpeed;
                            const mainCost = mainDistance * transport.costPerKm;
                            
                            segments.push({
                                from: sourceStationName,
                                to: destStationName,
                                mode: mode,
                                distance: Math.round(mainDistance),
                                time: Math.round(mainTime * 10) / 10,
                                cost: Math.round(mainCost),
                                transport: transport
                            });
                            
                            totalTime = mainTime;
                            totalCost = mainCost;
                            totalDistance = mainDistance;
                        } else {
                            // Station to city
                            const mainDistance = this.calculateDistance(sourceStationName, destStationName);
                            const destStationDist = this.calculateDistance(destStationName, toCity);
                            
                            if (mainDistance <= 0 || destStationDist <= 0) return;
                            
                            // Main transport segment
                            const mainTime = mainDistance / transport.avgSpeed;
                            const mainCost = mainDistance * transport.costPerKm;
                            
                            segments.push({
                                from: sourceStationName,
                                to: destStationName,
                                mode: mode,
                                distance: Math.round(mainDistance),
                                time: Math.round(mainTime * 10) / 10,
                                cost: Math.round(mainCost),
                                transport: transport
                            });
                            
                            // Local transport to final destination
                            const localTime = destStationDist / localTransport.avgSpeed;
                            const localCost = destStationDist * localTransport.costPerKm;
                            
                            segments.push({
                                from: destStationName,
                                to: toCity,
                                mode: 'car',
                                distance: Math.round(destStationDist),
                                time: Math.round(localTime * 10) / 10,
                                cost: Math.round(localCost),
                                transport: localTransport
                            });
                            
                            totalTime = mainTime + localTime + 0.5; // Add transfer time
                            totalCost = mainCost + localCost;
                            totalDistance = mainDistance + destStationDist;
                        }
                    } else {
                        // Standard city-to-station-to-city route
                        const sourceStationDist = this.calculateDistance(fromCity, sourceStationName);
                        const destStationDist = this.calculateDistance(destStationName, toCity);
                        const mainDistance = this.calculateDistance(sourceStationName, destStationName);
                        
                        // Skip if any distance is 0 or unrealistic
                        if (sourceStationDist <= 0 || destStationDist <= 0 || mainDistance <= 0) {
                            return;
                        }
                        
                        // Segment 1: City to station
                        const seg1Time = sourceStationDist / localTransport.avgSpeed;
                        const seg1Cost = sourceStationDist * localTransport.costPerKm;
                        
                        segments.push({
                            from: fromCity,
                            to: sourceStationName,
                            mode: 'car',
                            distance: Math.round(sourceStationDist),
                            time: Math.round(seg1Time * 10) / 10,
                            cost: Math.round(seg1Cost),
                            transport: localTransport
                        });
                        
                        // Segment 2: Station to station (main transport)
                        const seg2Time = mainDistance / transport.avgSpeed;
                        const seg2Cost = mainDistance * transport.costPerKm;
                        
                        segments.push({
                            from: sourceStationName,
                            to: destStationName,
                            mode: mode,
                            distance: Math.round(mainDistance),
                            time: Math.round(seg2Time * 10) / 10,
                            cost: Math.round(seg2Cost),
                            transport: transport
                        });
                        
                        // Segment 3: Station to city (if destination is not a station)
                        if (!(isDestStation && this.getStationType(toCity) === stationTypeMap[mode])) {
                            const seg3Time = destStationDist / localTransport.avgSpeed;
                            const seg3Cost = destStationDist * localTransport.costPerKm;
                            
                            segments.push({
                                from: destStationName,
                                to: toCity,
                                mode: 'car',
                                distance: Math.round(destStationDist),
                                time: Math.round(seg3Time * 10) / 10,
                                cost: Math.round(seg3Cost),
                                transport: localTransport
                            });
                            
                            totalTime = seg1Time + seg2Time + seg3Time + 1; // Add transfer time
                            totalCost = seg1Cost + seg2Cost + seg3Cost;
                            totalDistance = sourceStationDist + mainDistance + destStationDist;
                        } else {
                            totalTime = seg1Time + seg2Time + 0.5; // Add transfer time
                            totalCost = seg1Cost + seg2Cost;
                            totalDistance = sourceStationDist + mainDistance;
                        }
                    }
                    
                } else {
                    // Direct transport modes (car, auto, metro)
                    const time = distance / transport.avgSpeed;
                    const cost = distance * transport.costPerKm;
                    
                    segments = [{
                        from: fromCity,
                        to: toCity,
                        mode: mode,
                        distance: Math.round(distance),
                        time: Math.round(time * 10) / 10,
                        cost: Math.round(cost),
                        transport: transport
                    }];
                    
                    totalTime = time;
                    totalCost = cost;
                    totalDistance = distance;
                }
                
                routes.push({
                    type: 'single-mode',
                    mode: mode,
                    segments: segments,
                    totalTime: Math.round(totalTime * 10) / 10,
                    totalCost: Math.round(totalCost),
                    totalDistance: Math.round(totalDistance),
                    comfortScore: transport.comfortLevel,
                    reliabilityScore: transport.reliability
                });
            }
        });
        
        return routes;
    }

    // Generate multi-modal routes
    generateMultiModalRoutes(fromCity, toCity, distance) {
        const routes = [];
        
        // Strategy 1: Long distance main transport + local transport
        if (distance > 100) {
            const mainModes = ['flight', 'train', 'bus'];
            const localModes = ['car', 'auto']; // Removed metro from inter-city combinations
            
            mainModes.forEach(mainMode => {
                if (this.isTransportAvailable(mainMode, distance - 30, fromCity, toCity)) {
                    localModes.forEach(localMode => {
                        // Skip if local mode is not suitable for short distances
                        if (localMode === 'car' && distance < 50) return;
                        if (localMode === 'auto' && distance > 500) return;
                        const mainTransport = this.transportModes[mainMode];
                        const localTransport = this.transportModes[localMode];
                        
                        // Get realistic station distances
                        const stationTypeMap = {
                            'flight': 'airport',
                            'train': 'railway',
                            'bus': 'bus'
                        };
                        
                        const stationType = stationTypeMap[mainMode] || 'railway';
                        
                        // Get proper station names
                        const sourceStationName = this.getStationName(fromCity, mainMode);
                        const destStationName = this.getStationName(toCity, mainMode);
                        
                        // Calculate actual distances using coordinates
                        const sourceStationDist = this.calculateDistance(fromCity, sourceStationName);
                        const destStationDist = this.calculateDistance(destStationName, toCity);
                        const mainDistance = this.calculateDistance(sourceStationName, destStationName);
                        
                        // Skip if any distance is 0 or unrealistic
                        if (sourceStationDist <= 0 || destStationDist <= 0 || mainDistance <= 0) {
                            return;
                        }
                        
                        const segments = [
                            {
                                from: fromCity,
                                to: sourceStationName,
                                mode: localMode,
                                distance: Math.round(sourceStationDist),
                                time: Math.round((sourceStationDist / localTransport.avgSpeed) * 10) / 10,
                                cost: Math.round(sourceStationDist * localTransport.costPerKm),
                                transport: localTransport
                            },
                            {
                                from: sourceStationName,
                                to: destStationName,
                                mode: mainMode,
                                distance: Math.round(mainDistance),
                                time: Math.round((mainDistance / mainTransport.avgSpeed) * 10) / 10,
                                cost: Math.round(mainDistance * mainTransport.costPerKm),
                                transport: mainTransport
                            },
                            {
                                from: destStationName,
                                to: toCity,
                                mode: localMode,
                                distance: Math.round(destStationDist),
                                time: Math.round((destStationDist / localTransport.avgSpeed) * 10) / 10,
                                cost: Math.round(destStationDist * localTransport.costPerKm),
                                transport: localTransport
                            }
                        ];

                        const totalTime = segments.reduce((sum, seg) => sum + seg.time, 0) + 0.5; // Add transfer time
                        const totalCost = segments.reduce((sum, seg) => sum + seg.cost, 0);
                        const avgComfort = (mainTransport.comfortLevel + localTransport.comfortLevel) / 2;
                        const avgReliability = (mainTransport.reliability + localTransport.reliability) / 2;

                        routes.push({
                            type: 'multi-modal',
                            segments: segments,
                            totalTime: totalTime,
                            totalCost: totalCost,
                            totalDistance: distance,
                            comfortScore: avgComfort,
                            reliabilityScore: avgReliability
                        });
                    });
                }
            });
        }

        // Strategy 2: Mixed transport for medium distances
        if (distance > 50 && distance < 300) {
            const combinations = [
                ['bus', 'car'],
                ['train', 'auto'],
                ['car', 'walk'],
                ['bus', 'auto'] // Replaced metro with auto for inter-city travel
            ];

            combinations.forEach(combo => {
                const [mode1, mode2] = combo;
                const transport1 = this.transportModes[mode1];
                const transport2 = this.transportModes[mode2];

                if (transport1 && transport2 && this.isTransportAvailable(mode1, distance * 0.7, fromCity, 'Intermediate') && this.isTransportAvailable(mode2, distance * 0.3, 'Intermediate', toCity)) {
                    const split = 0.7; // 70% first mode, 30% second mode
                    const dist1 = distance * split;
                    const dist2 = distance * (1 - split);
                    
                    const segments = [
                        {
                            from: fromCity,
                            to: `Intermediate Junction`,
                            mode: mode1,
                            distance: dist1,
                            time: dist1 / transport1.speedKmh,
                            cost: dist1 * transport1.costPerKm,
                            transport: transport1
                        },
                        {
                            from: `Intermediate Junction`,
                            to: toCity,
                            mode: mode2,
                            distance: dist2,
                            time: dist2 / transport2.speedKmh,
                            cost: dist2 * transport2.costPerKm,
                            transport: transport2
                        }
                    ];

                    const totalTime = segments.reduce((sum, seg) => sum + seg.time, 0) + 0.25; // Add transfer time
                    const totalCost = segments.reduce((sum, seg) => sum + seg.cost, 0);
                    const avgComfort = (transport1.comfortLevel + transport2.comfortLevel) / 2;
                    const avgReliability = (transport1.reliability + transport2.reliability) / 2;

                    routes.push({
                        type: 'multi-modal',
                        segments: segments,
                        totalTime: totalTime,
                        totalCost: totalCost,
                        totalDistance: distance,
                        comfortScore: avgComfort,
                        reliabilityScore: avgReliability
                    });
                }
            });
        }

        return routes;
    }

    // Main function to plan routes
    planRoute(fromCity, toCity) {
        const distance = this.calculateDistance(fromCity, toCity);
        
        // Generate all possible routes
        const singleModeRoutes = this.generateSingleModeRoutes(fromCity, toCity, distance);
        const multiModalRoutes = this.generateMultiModalRoutes(fromCity, toCity, distance);
        
        // Filter out routes with 0km segments or unrealistic routes
        const validRoutes = [...singleModeRoutes, ...multiModalRoutes].filter(route => {
            if (route.segments) {
                return route.segments.every(segment => segment.distance > 0 && segment.time > 0 && segment.cost >= 0);
            }
            return route.totalDistance > 0 && route.totalTime > 0 && route.totalCost >= 0;
        });
        
        const allRoutes = validRoutes;

        // Ensure we have diverse routes by filtering out duplicates
        const uniqueRoutes = this.filterUniqueRoutes(allRoutes);
        
        // Sort and categorize routes
        const timeRoutes = [...uniqueRoutes].sort((a, b) => a.totalTime - b.totalTime);
        const costRoutes = [...uniqueRoutes].sort((a, b) => a.totalCost - b.totalCost);
        
        // Get different routes for each category
        const leastTimeRoute = timeRoutes[0];
        const leastCostRoute = costRoutes[0];
        
        // Hybrid route: find a route that's different from the other two
        let hybridRoute = [...uniqueRoutes].sort((a, b) => {
            const scoreA = (a.totalTime / 10) + (a.totalCost / 100) - (a.comfortScore / 10);
            const scoreB = (b.totalTime / 10) + (b.totalCost / 100) - (b.comfortScore / 10);
            return scoreA - scoreB;
        })[0];
        
        // If hybrid is same as others, pick a different one
        if (this.routesAreSimilar(hybridRoute, leastTimeRoute) || this.routesAreSimilar(hybridRoute, leastCostRoute)) {
            const alternativeRoutes = uniqueRoutes.filter(route => 
                !this.routesAreSimilar(route, leastTimeRoute) && 
                !this.routesAreSimilar(route, leastCostRoute)
            );
            if (alternativeRoutes.length > 0) {
                hybridRoute = alternativeRoutes[0];
            }
        }

        return {
            distance: Math.round(distance),
            routes: {
                leastTime: leastTimeRoute,
                leastCost: leastCostRoute,
                hybrid: hybridRoute
            },
            allRoutes: allRoutes.slice(0, 10) // Return top 10 routes
        };
    }

    // Format time for display
    formatTime(hours) {
        if (hours < 1) {
            return `${Math.round(hours * 60)} min`;
        } else if (hours < 24) {
            const h = Math.floor(hours);
            const m = Math.round((hours - h) * 60);
            return m > 0 ? `${h}h ${m}m` : `${h}h`;
        } else {
            const days = Math.floor(hours / 24);
            const h = Math.floor(hours % 24);
            return `${days}d ${h}h`;
        }
    }

    // Format cost for display
    formatCost(cost) {
        return `₹${Math.round(cost)}`;
    }

    // Filter unique routes to ensure diversity
    filterUniqueRoutes(routes) {
        const uniqueRoutes = [];
        const seen = new Set();
        
        for (const route of routes) {
            const signature = this.getRouteSignature(route);
            if (!seen.has(signature)) {
                seen.add(signature);
                uniqueRoutes.push(route);
            }
        }
        
        return uniqueRoutes;
    }
    
    // Get a signature for a route to identify similar routes
    getRouteSignature(route) {
        if (route.type === 'single') {
            return `single-${route.mode}`;
        } else {
            const modes = route.segments.map(seg => seg.mode).join('-');
            return `multi-${modes}`;
        }
    }
    
    // Check if two routes are similar
    routesAreSimilar(route1, route2) {
        if (!route1 || !route2) return false;
        return this.getRouteSignature(route1) === this.getRouteSignature(route2);
    }
    
    // Simple hash function for deterministic availability
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    // Get distance from city center to station/airport
    getStationDistance(city, stationType) {
        const cityStations = this.stationDistances[city];
        if (cityStations && cityStations[stationType]) {
            return cityStations[stationType];
        }
        // Fallback distances if city not in database
        const fallbackDistances = {
            'airport': 15,
            'railway': 5,
            'bus': 4
        };
        return fallbackDistances[stationType] || 8;
    }
    
    // Get proper station name
    getStationName(city, transportMode) {
        const stationNames = {
            'flight': `${city} Airport`,
            'train': `${city} Railway Station`,
            'bus': `${city} Bus Terminal`
        };
        return stationNames[transportMode] || `${city} Station`;
    }
    
    // Get route optimization results
    getOptimizedRoutes(fromCity, toCity) {
        const routeData = this.planRoute(fromCity, toCity);
        
        return {
            distance: routeData.distance,
            fastest: {
                ...routeData.routes.leastTime,
                title: "Fastest Route",
                icon: "⚡",
                description: "Get there in minimum time",
                highlight: "time"
            },
            cheapest: {
                ...routeData.routes.leastCost,
                title: "Cheapest Route", 
                icon: "💰",
                description: "Most economical option",
                highlight: "cost"
            },
            hybrid: {
                ...routeData.routes.hybrid,
                title: "Balanced Route",
                icon: "⚖️", 
                description: "Best balance of time, cost & comfort",
                highlight: "balance"
            }
        };
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.RoutePlanner = RoutePlanner;
}
