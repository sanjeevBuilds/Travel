// Enhanced Route Planner for India with realistic multi-modal transport
class RoutePlanner {
    constructor() {
        this.transportModes = {
            flight: {
                name: 'Flight',
                icon: '✈️',
                speedKmh: 500,
                costPerKm: 8,
                minDistance: 200,
                maxDistance: 5000,
                comfortLevel: 9,
                reliability: 8,
                availability: 0.7
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
            metro: {
                name: 'Metro',
                icon: '🚇',
                speedKmh: 35,
                costPerKm: 0.5,
                minDistance: 2,
                maxDistance: 50,
                comfortLevel: 6,
                reliability: 9,
                availability: 0.95
            }
        };

        // City coordinates with airports, railway stations, and bus terminals
        this.cityCoordinates = {
            // Major Cities
            'Mumbai': { lat: 19.0760, lng: 72.8777 },
            'Delhi': { lat: 28.7041, lng: 77.1025 },
            'Bengaluru': { lat: 12.9716, lng: 77.5946 },
            'Chennai': { lat: 13.0827, lng: 80.2707 },
            'Kolkata': { lat: 22.5726, lng: 88.3639 },
            'Hyderabad': { lat: 17.3850, lng: 78.4867 },
            'Pune': { lat: 18.5204, lng: 73.8567 },
            'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
            'Kochi': { lat: 9.9312, lng: 76.2673 },
            'Jaipur': { lat: 26.9124, lng: 75.7873 },
            'Lucknow': { lat: 26.8467, lng: 80.9462 },
            'Indore': { lat: 22.7196, lng: 75.8577 },
            'Bhubaneswar': { lat: 20.2961, lng: 85.8245 },
            'Coimbatore': { lat: 11.0168, lng: 76.9558 },
            'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
            'Goa': { lat: 15.2993, lng: 74.1240 },
            'Ranchi': { lat: 23.3441, lng: 85.3096 },

            // Airports
            'Mumbai Airport': { lat: 19.0896, lng: 72.8656 },
            'Delhi Airport': { lat: 28.5562, lng: 77.1000 },
            'Bengaluru Airport': { lat: 13.1986, lng: 77.7066 },
            'Chennai Airport': { lat: 12.9941, lng: 80.1709 },
            'Kolkata Airport': { lat: 22.6546, lng: 88.4467 },
            'Hyderabad Airport': { lat: 17.2403, lng: 78.4294 },
            'Pune Airport': { lat: 18.5822, lng: 73.9197 },
            'Ahmedabad Airport': { lat: 23.0772, lng: 72.6347 },
            'Kochi Airport': { lat: 10.1520, lng: 76.4019 },
            'Goa Airport': { lat: 15.3808, lng: 73.8314 },
            'Jaipur Airport': { lat: 26.8242, lng: 75.8122 },
            'Lucknow Airport': { lat: 26.7606, lng: 80.8893 },
            'Indore Airport': { lat: 22.7279, lng: 75.8011 },
            'Bhubaneswar Airport': { lat: 20.2544, lng: 85.8178 },
            'Coimbatore Airport': { lat: 11.0297, lng: 77.0436 },

            // Railway Stations
            'Mumbai Railway Station': { lat: 19.0144, lng: 72.8479 },
            'Delhi Railway Station': { lat: 28.6428, lng: 77.2197 },
            'Bengaluru Railway Station': { lat: 12.9762, lng: 77.6033 },
            'Chennai Railway Station': { lat: 13.0836, lng: 80.2785 },
            'Kolkata Railway Station': { lat: 22.5675, lng: 88.3492 },
            'Hyderabad Railway Station': { lat: 17.3616, lng: 78.4747 },
            'Pune Railway Station': { lat: 18.5289, lng: 73.8742 },
            'Ahmedabad Railway Station': { lat: 23.0216, lng: 72.5797 },
            'Kochi Railway Station': { lat: 9.9719, lng: 76.2854 },
            'Jaipur Railway Station': { lat: 26.9185, lng: 75.7870 },
            'Lucknow Railway Station': { lat: 26.8393, lng: 80.9231 },
            'Indore Railway Station': { lat: 22.7179, lng: 75.8723 },
            'Bhubaneswar Railway Station': { lat: 20.2739, lng: 85.8181 },
            'Coimbatore Railway Station': { lat: 11.0015, lng: 76.9628 },
            'Thiruvananthapuram Railway Station': { lat: 8.5089, lng: 76.9553 },

            // Bus Terminals
            'Mumbai Bus Terminal': { lat: 19.0596, lng: 72.8295 },
            'Delhi Bus Terminal': { lat: 28.6562, lng: 77.2410 },
            'Bengaluru Bus Terminal': { lat: 12.9762, lng: 77.6033 },
            'Chennai Bus Terminal': { lat: 13.0674, lng: 80.2376 },
            'Kolkata Bus Terminal': { lat: 22.5958, lng: 88.3868 },
            'Hyderabad Bus Terminal': { lat: 17.4126, lng: 78.4392 },
            'Pune Bus Terminal': { lat: 18.5679, lng: 73.9143 },
            'Ahmedabad Bus Terminal': { lat: 23.0395, lng: 72.5661 },
            'Kochi Bus Terminal': { lat: 9.9816, lng: 76.2999 },
            'Jaipur Bus Terminal': { lat: 26.9030, lng: 75.8070 },
            'Lucknow Bus Terminal': { lat: 26.8729, lng: 80.9770 },
            'Indore Bus Terminal': { lat: 22.6953, lng: 75.8567 },
            'Bhubaneswar Bus Terminal': { lat: 20.2700, lng: 85.8400 },
            'Coimbatore Bus Terminal': { lat: 10.9601, lng: 76.9702 },
            'Thiruvananthapuram Bus Terminal': { lat: 8.4855, lng: 76.9492 }
        };

        // Cities with metro connectivity (intra-city only)
        this.metroAvailability = {
            'Delhi': true,
            'Mumbai': true,
            'Bengaluru': true,
            'Chennai': true,
            'Kolkata': true,
            'Hyderabad': true,
            'Pune': true,
            'Ahmedabad': true,
            'Kochi': true,
            'Jaipur': true
        };
    }

    // Calculate distance between two cities using Haversine formula
    calculateDistance(city1, city2) {
        const coord1 = this.cityCoordinates[city1];
        const coord2 = this.cityCoordinates[city2];

        if (!coord1 || !coord2) {
            // Fallback distances for major city pairs
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
            return cityPairs[key] || (200 + Math.random() * 800);
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
    
    // Find closest station of a specific type to a city
    findClosestStation(cityName, stationType) {
        const cityCoord = this.cityCoordinates[cityName];
        if (!cityCoord) return null;
        
        let closestStation = null;
        let minDistance = Infinity;
        
        const stationSuffix = {
            'airport': 'Airport',
            'railway': 'Railway Station', 
            'bus': 'Bus Terminal'
        }[stationType];
        
        Object.keys(this.cityCoordinates).forEach(location => {
            if (location.includes(stationSuffix)) {
                const distance = this.calculateDistance(cityName, location);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestStation = location;
                }
            }
        });
        
        return closestStation;
    }

    // Check if transport mode is available for given route
    isTransportAvailable(mode, distance, fromCity, toCity) {
        const transport = this.transportModes[mode];
        if (!transport) return false;

        // Distance constraints
        if (distance < transport.minDistance || distance > transport.maxDistance) {
            return false;
        }

        // Metro is only available within cities that have metro
        if (mode === 'metro') {
            return fromCity === toCity && this.metroAvailability[fromCity];
        }

        // Make availability deterministic for route diversity
        const hash = this.hashString(fromCity + toCity + mode);
        return (hash % 100) < (transport.availability * 100);
    }

    // Generate single mode routes
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
                        sourceStationName = fromCity;
                    } else {
                        sourceStationName = this.getStationName(fromCity, mode);
                    }
                    
                    if (isDestStation && this.getStationType(toCity) === stationTypeMap[mode]) {
                        destStationName = toCity;
                    } else {
                        destStationName = this.getStationName(toCity, mode);
                    }
                    
                    const localTransport = this.transportModes['car'];
                    
                    // Calculate segments based on whether we start/end at stations
                    if (isSourceStation && this.getStationType(fromCity) === stationTypeMap[mode]) {
                        // Starting from station
                        if (isDestStation && this.getStationType(toCity) === stationTypeMap[mode]) {
                            // Station to station direct
                            const mainDistance = this.calculateDistance(sourceStationName, destStationName);
                            if (mainDistance <= 0) return;
                            
                            const mainTime = mainDistance / transport.speedKmh;
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
                            
                            const mainTime = mainDistance / transport.speedKmh;
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
                            
                            const localTime = destStationDist / localTransport.speedKmh;
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
                            
                            totalTime = mainTime + localTime + 0.5;
                            totalCost = mainCost + localCost;
                            totalDistance = mainDistance + destStationDist;
                        }
                    } else {
                        // Standard city-to-station-to-city route
                        const sourceStationDist = this.calculateDistance(fromCity, sourceStationName);
                        const destStationDist = this.calculateDistance(destStationName, toCity);
                        const mainDistance = this.calculateDistance(sourceStationName, destStationName);
                        
                        if (sourceStationDist <= 0 || destStationDist <= 0 || mainDistance <= 0) {
                            return;
                        }
                        
                        // City to station
                        const seg1Time = sourceStationDist / localTransport.speedKmh;
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
                        
                        // Station to station
                        const seg2Time = mainDistance / transport.speedKmh;
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
                        
                        // Station to city
                        const seg3Time = destStationDist / localTransport.speedKmh;
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
                        
                        totalTime = seg1Time + seg2Time + seg3Time + 1;
                        totalCost = seg1Cost + seg2Cost + seg3Cost;
                        totalDistance = sourceStationDist + mainDistance + destStationDist;
                    }
                    
                } else {
                    // Direct transport modes (car, auto, metro)
                    const time = distance / transport.speedKmh;
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
            const localModes = ['car', 'auto'];
            
            mainModes.forEach(mainMode => {
                if (this.isTransportAvailable(mainMode, distance - 30, fromCity, toCity)) {
                    localModes.forEach(localMode => {
                        if (localMode === 'car' && distance < 50) return;
                        if (localMode === 'auto' && distance > 500) return;
                        
                        const mainTransport = this.transportModes[mainMode];
                        const localTransport = this.transportModes[localMode];
                        
                        const stationTypeMap = {
                            'flight': 'airport',
                            'train': 'railway',
                            'bus': 'bus'
                        };
                        
                        const sourceStationName = this.getStationName(fromCity, mainMode);
                        const destStationName = this.getStationName(toCity, mainMode);
                        
                        const sourceStationDist = this.calculateDistance(fromCity, sourceStationName);
                        const destStationDist = this.calculateDistance(destStationName, toCity);
                        const mainDistance = this.calculateDistance(sourceStationName, destStationName);
                        
                        if (sourceStationDist <= 0 || destStationDist <= 0 || mainDistance <= 0) {
                            return;
                        }
                        
                        const segments = [
                            {
                                from: fromCity,
                                to: sourceStationName,
                                mode: localMode,
                                distance: Math.round(sourceStationDist),
                                time: Math.round((sourceStationDist / localTransport.speedKmh) * 10) / 10,
                                cost: Math.round(sourceStationDist * localTransport.costPerKm),
                                transport: localTransport
                            },
                            {
                                from: sourceStationName,
                                to: destStationName,
                                mode: mainMode,
                                distance: Math.round(mainDistance),
                                time: Math.round((mainDistance / mainTransport.speedKmh) * 10) / 10,
                                cost: Math.round(mainDistance * mainTransport.costPerKm),
                                transport: mainTransport
                            },
                            {
                                from: destStationName,
                                to: toCity,
                                mode: localMode,
                                distance: Math.round(destStationDist),
                                time: Math.round((destStationDist / localTransport.speedKmh) * 10) / 10,
                                cost: Math.round(destStationDist * localTransport.costPerKm),
                                transport: localTransport
                            }
                        ];

                        const totalTime = segments.reduce((sum, seg) => sum + seg.time, 0) + 0.5;
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

        return routes;
    }

    // Main route planning method
    planRoute(fromCity, toCity) {
        const distance = this.calculateDistance(fromCity, toCity);
        
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
        const uniqueRoutes = this.filterUniqueRoutes(allRoutes);
        
        const timeRoutes = [...uniqueRoutes].sort((a, b) => a.totalTime - b.totalTime);
        const costRoutes = [...uniqueRoutes].sort((a, b) => a.totalCost - b.totalCost);
        
        const hybridRoutes = [...uniqueRoutes].sort((a, b) => {
            const scoreA = (a.totalTime / 10) + (a.totalCost / 100) + (10 - a.comfortScore);
            const scoreB = (b.totalTime / 10) + (b.totalCost / 100) + (10 - b.comfortScore);
            return scoreA - scoreB;
        });

        return {
            distance: Math.round(distance),
            routes: {
                leastTime: timeRoutes[0] || null,
                leastCost: costRoutes[0] || null,
                hybrid: hybridRoutes[0] || null
            }
        };
    }

    // Get station name based on city and transport mode
    getStationName(cityName, mode) {
        const stationMap = {
            'flight': 'airport',
            'train': 'railway',
            'bus': 'bus'
        };
        
        const stationType = stationMap[mode];
        if (!stationType) return cityName;
        
        const suffix = {
            'airport': 'Airport',
            'railway': 'Railway Station',
            'bus': 'Bus Terminal'
        }[stationType];
        
        const directStationName = `${cityName} ${suffix}`;
        
        // Check if this city has its own station
        if (this.cityCoordinates[directStationName]) {
            return directStationName;
        }
        
        // If not found, find the closest station of this type
        const closestStation = this.findClosestStation(cityName, stationType);
        if (closestStation) {
            return closestStation;
        }
        
        // If no station found at all, return the city name (fallback)
        return cityName;
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

    // Helper methods
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    formatTime(hours) {
        if (hours < 1) {
            return `${Math.round(hours * 60)}min`;
        }
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return m > 0 ? `${h}h ${m}min` : `${h}h`;
    }

    formatCost(cost) {
        return `₹${Math.round(cost)}`;
    }

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
    
    getRouteSignature(route) {
        if (route.type === 'single-mode') {
            return `single-${route.mode}`;
        } else {
            const modes = route.segments.map(seg => seg.mode).join('-');
            return `multi-${modes}`;
        }
    }
}
