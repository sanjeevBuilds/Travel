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
            'Bhopal': { lat: 23.2599, lng: 77.4126 },
            'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
            'Patna': { lat: 25.5941, lng: 85.1376 },
            'Vadodara': { lat: 22.3072, lng: 73.1812 },
            'Ghaziabad': { lat: 28.6692, lng: 77.4538 },
            'Ludhiana': { lat: 30.9010, lng: 75.8573 },
            'Agra': { lat: 27.1767, lng: 78.0081 },
            'Nashik': { lat: 19.9975, lng: 73.7898 },
            'Faridabad': { lat: 28.4089, lng: 77.3178 },
            'Meerut': { lat: 28.9845, lng: 77.7064 },
            'Rajkot': { lat: 22.3039, lng: 70.8022 },
            'Varanasi': { lat: 25.3176, lng: 82.9739 },
            'Aurangabad': { lat: 19.8762, lng: 75.3433 },
            'Amritsar': { lat: 31.6340, lng: 74.8723 },
            'Allahabad': { lat: 25.4358, lng: 81.8463 },
            'Ranchi': { lat: 23.3441, lng: 85.3096 },
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
            'Mysore': { lat: 12.2958, lng: 76.6394 },
            'Gurgaon': { lat: 28.4595, lng: 77.0266 },
            'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
            'Bhubaneswar': { lat: 20.2961, lng: 85.8245 },
            'Salem': { lat: 11.6643, lng: 78.1460 },
            'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
            'Noida': { lat: 28.5355, lng: 77.3910 },
            'Jamshedpur': { lat: 22.8046, lng: 86.2029 },
            'Kochi': { lat: 9.9312, lng: 76.2673 },
            'Dehradun': { lat: 30.3165, lng: 78.0322 },
            'Ajmer': { lat: 26.4499, lng: 74.6399 },
            'Udaipur': { lat: 24.5854, lng: 73.7125 }
        };

        // Metro cities (have metro availability)
        this.metroCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi', 'Lucknow', 'Nagpur', 'Gurgaon', 'Noida'];
    }

    // Calculate distance between two cities using Haversine formula
    calculateDistance(city1, city2) {
        const coord1 = this.cityCoordinates[city1];
        const coord2 = this.cityCoordinates[city2];
        
        if (!coord1 || !coord2) {
            // Fallback: estimate based on city names (rough approximation)
            return Math.random() * 500 + 100; // 100-600 km
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

    // Check if transport mode is available for given route
    isTransportAvailable(mode, distance, fromCity, toCity) {
        const transport = this.transportModes[mode];
        if (!transport) return false;

        // Distance constraints
        if (distance < transport.minDistance || distance > transport.maxDistance) {
            return false;
        }

        // Metro availability check
        if (mode === 'metro') {
            return this.metroCities.includes(fromCity) && this.metroCities.includes(toCity);
        }

        // Flight availability for very short distances
        if (mode === 'flight' && distance < 200) {
            return false;
        }

        // Random availability factor
        return Math.random() < transport.availability;
    }

    // Generate single-mode routes
    generateSingleModeRoutes(fromCity, toCity, distance) {
        const routes = [];
        
        Object.keys(this.transportModes).forEach(mode => {
            if (this.isTransportAvailable(mode, distance, fromCity, toCity)) {
                const transport = this.transportModes[mode];
                const time = distance / transport.speedKmh;
                const cost = distance * transport.costPerKm;
                
                routes.push({
                    type: 'single',
                    mode: mode,
                    segments: [{
                        from: fromCity,
                        to: toCity,
                        mode: mode,
                        distance: distance,
                        time: time,
                        cost: cost,
                        transport: transport
                    }],
                    totalTime: time,
                    totalCost: cost,
                    totalDistance: distance,
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
            const localModes = ['car', 'auto', 'metro'];
            
            mainModes.forEach(mainMode => {
                if (this.isTransportAvailable(mainMode, distance * 0.8, fromCity, toCity)) {
                    localModes.forEach(localMode => {
                        const mainTransport = this.transportModes[mainMode];
                        const localTransport = this.transportModes[localMode];
                        
                        // Create intermediate points
                        const segments = [
                            {
                                from: fromCity,
                                to: `${fromCity} ${mainTransport.name} Station`,
                                mode: localMode,
                                distance: distance * 0.1,
                                time: (distance * 0.1) / localTransport.speedKmh,
                                cost: (distance * 0.1) * localTransport.costPerKm,
                                transport: localTransport
                            },
                            {
                                from: `${fromCity} ${mainTransport.name} Station`,
                                to: `${toCity} ${mainTransport.name} Station`,
                                mode: mainMode,
                                distance: distance * 0.8,
                                time: (distance * 0.8) / mainTransport.speedKmh,
                                cost: (distance * 0.8) * mainTransport.costPerKm,
                                transport: mainTransport
                            },
                            {
                                from: `${toCity} ${mainTransport.name} Station`,
                                to: toCity,
                                mode: localMode,
                                distance: distance * 0.1,
                                time: (distance * 0.1) / localTransport.speedKmh,
                                cost: (distance * 0.1) * localTransport.costPerKm,
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
                ['metro', 'bus']
            ];

            combinations.forEach(combo => {
                const [mode1, mode2] = combo;
                const transport1 = this.transportModes[mode1];
                const transport2 = this.transportModes[mode2];

                if (transport1 && transport2) {
                    const split = 0.7; // 70% first mode, 30% second mode
                    const segments = [
                        {
                            from: fromCity,
                            to: `Intermediate Point`,
                            mode: mode1,
                            distance: distance * split,
                            time: (distance * split) / transport1.speedKmh,
                            cost: (distance * split) * transport1.costPerKm,
                            transport: transport1
                        },
                        {
                            from: `Intermediate Point`,
                            to: toCity,
                            mode: mode2,
                            distance: distance * (1 - split),
                            time: (distance * (1 - split)) / transport2.speedKmh,
                            cost: (distance * (1 - split)) * transport2.costPerKm,
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
        
        const allRoutes = [...singleModeRoutes, ...multiModalRoutes];

        // Sort and categorize routes
        const leastTimeRoute = [...allRoutes].sort((a, b) => a.totalTime - b.totalTime)[0];
        const leastCostRoute = [...allRoutes].sort((a, b) => a.totalCost - b.totalCost)[0];
        
        // Hybrid route: balance of time, cost, and comfort
        const hybridRoute = [...allRoutes].sort((a, b) => {
            const scoreA = (a.totalTime / 10) + (a.totalCost / 100) - (a.comfortScore / 10);
            const scoreB = (b.totalTime / 10) + (b.totalCost / 100) - (b.comfortScore / 10);
            return scoreA - scoreB;
        })[0];

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
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.RoutePlanner = RoutePlanner;
}
