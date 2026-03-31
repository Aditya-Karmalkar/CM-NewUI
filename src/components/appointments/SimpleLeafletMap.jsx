import React, { useEffect, useRef, useState } from 'react';

const SimpleLeafletMap = ({ onFacilitySelect, selectedFacility }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Check if Leaflet is already loaded
    if (window.L) {
      setIsLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const existingCSS = document.querySelector('link[href*="leaflet"]');
    if (!existingCSS) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
    }

    // Load Leaflet JS
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletScript.async = true;

    leafletScript.onload = () => {
      console.log('Leaflet loaded successfully');
      setIsLoaded(true);
    };

    leafletScript.onerror = (e) => {
      console.error('Failed to load Leaflet:', e);
      setError('Failed to load map library. Please check your internet connection.');
    };

    document.body.appendChild(leafletScript);

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.error('Error removing map:', e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current && !mapInstanceRef.current && window.L) {
      try {
        console.log('Initializing Leaflet map...');

        // Create map with OpenStreetMap tiles
        const map = window.L.map(mapRef.current, {
          attributionControl: false // Remove attribution
        }).setView([20.5937, 78.9629], 5);

        // Add OpenStreetMap tile layer without attribution
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
        console.log('Map initialized successfully');

        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log('User location:', latitude, longitude);
              setUserLocation({ lat: latitude, lng: longitude });

              // Center map on user location
              map.setView([latitude, longitude], 13);

              // Add user location marker
              const userMarker = window.L.marker([latitude, longitude], {
                icon: window.L.icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })
              }).addTo(map);

              userMarker.bindPopup('Your Location').openPopup();

              // Expose search function globally
              window.searchNearbyFacilities = (facilityType) => {
                searchNearbyFacilities(latitude, longitude, facilityType);
              };
            },
            (error) => {
              console.error('Error getting location:', error);
              setError('Unable to get your location. Please enable location services.');
            }
          );
        } else {
          setError('Geolocation is not supported by your browser.');
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(`Failed to initialize map: ${err.message}`);
      }
    }
  }, [isLoaded]);

  const searchNearbyFacilities = async (lat, lng, facilityType) => {
    try {
      console.log('Searching for:', facilityType, 'near', lat, lng);

      // Clear existing markers
      markersRef.current.forEach(marker => {
        if (marker.remove) marker.remove();
      });
      markersRef.current = [];

      // Map facility types to Overpass API tags
      const facilityTags = {
        hospital: '["amenity"="hospital"]',
        clinic: '["amenity"="clinic"]',
        doctor: '["amenity"="doctors"]',
        pharmacy: '["amenity"="pharmacy"]',
        all: '["amenity"~"hospital|clinic|doctors|pharmacy"]'
      };

      const tag = facilityTags[facilityType] || facilityTags.all;

      // Calculate bounding box for 50km radius (very wide match)
      const radiusKm = 50;
      const radiusDegrees = radiusKm / 111; // 50km in degrees
      const minLat = lat - radiusDegrees;
      const maxLat = lat + radiusDegrees;
      const minLon = lng - radiusDegrees;
      const maxLon = lng + radiusDegrees;

      console.log('Search bounds:', { minLat, maxLat, minLon, maxLon });

      // Use Overpass API for searching nearby facilities
      const overpassQuery = `
        [out:json][timeout:15];
        (
          node${tag}(${minLat},${minLon},${maxLat},${maxLon});
          way${tag}(${minLat},${minLon},${maxLat},${maxLon});
          relation${tag}(${minLat},${minLon},${maxLat},${maxLon});
        );
        out center;
      `;

      const mirrors = [
        'https://lz4.overpass-api.de/api/interpreter',
        'https://overpass-api.de/api/interpreter',
        'https://z.overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter'
      ];

      let data = null;
      let lastError = null;

      for (const mirror of mirrors) {
        try {
          console.log('Fetching from Overpass API mirror:', mirror);
          const response = await fetch(`${mirror}?data=${encodeURIComponent(overpassQuery)}`);
          if (response.ok) {
            data = await response.json();
            break;
          } else {
            console.log(`Mirror ${mirror} returned status ${response.status}`);
            lastError = new Error(`API returned status ${response.status}`);
          }
        } catch (e) {
          console.log(`Mirror ${mirror} fetch error:`, e.message);
          lastError = e;
        }
      }

      if (!data) {
        throw lastError || new Error('All Overpass API mirrors failed to respond.');
      }

      const facilities = data.elements || [];
      
      console.log('Raw facilities found:', facilities.length, facilities);

      if (facilities && facilities.length > 0 && window.L) {
        // Filter facilities within radius and process them
        const facilitiesWithinRadius = facilities
          .map(facility => {
            // Get coordinates (handle both nodes and ways/relations)
            const facilityLat = facility.lat || (facility.center && facility.center.lat);
            const facilityLng = facility.lon || (facility.center && facility.center.lon);
            
            if (!facilityLat || !facilityLng) return null;
            
            const distance = calculateDistance(lat, lng, facilityLat, facilityLng);
            
            return {
              ...facility,
              lat: facilityLat,
              lon: facilityLng,
              distance: distance
            };
          })
          .filter(facility => facility && facility.distance <= radiusKm); // Within radius limit

        console.log(`Facilities within ${radiusKm}km:`, facilitiesWithinRadius.length);

        if (facilitiesWithinRadius.length === 0) {
          alert(`No ${facilityType} facilities found within ${radiusKm}km. Try a different search or location.`);
          return;
        }

        facilitiesWithinRadius.forEach((facility, index) => {
          const facilityLat = facility.lat;
          const facilityLng = facility.lon;
          const distance = facility.distance;

          // Extract facility information
          const tags = facility.tags || {};
          const fType = tags.amenity || facilityType;
          let iconColor = 'blue';
          if (fType === 'hospital') iconColor = 'red';
          else if (fType === 'pharmacy') iconColor = 'green';
          else if (fType === 'clinic' || fType === 'doctors') iconColor = 'orange';

          // Create marker
          const marker = window.L.marker([facilityLat, facilityLng], {
            icon: window.L.icon({
              iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          }).addTo(mapInstanceRef.current);

          const name = tags.name || tags['name:en'] || `${facilityType.charAt(0).toUpperCase() + facilityType.slice(1)} Facility`;
          const street = tags['addr:street'] || '';
          const houseNumber = tags['addr:housenumber'] || '';
          const city = tags['addr:city'] || '';
          const postcode = tags['addr:postcode'] || '';
          
          // Build address
          let address = '';
          if (houseNumber && street) {
            address = `${houseNumber} ${street}`;
          } else if (street) {
            address = street;
          }
          if (city) {
            address += address ? `, ${city}` : city;
          }
          if (postcode) {
            address += address ? ` ${postcode}` : postcode;
          }
          if (!address) {
            address = 'Address not available';
          }

          const phone = tags.phone || tags['contact:phone'] || 'Not available';
          const website = tags.website || tags['contact:website'] || '';

          // Create popup content with address and description
          const popupContent = `
            <div style="min-width: 250px; max-width: 300px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #1f2937;">${name}</h3>
              <div style="margin: 8px 0; padding: 8px; background: #f3f4f6; border-radius: 4px;">
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #4b5563;">
                  <strong>📍 Address:</strong><br/>
                  ${address}
                </p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">
                  <strong>📏 Distance:</strong> ${distance.toFixed(2)} km
                </p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">
                  <strong>🏥 Type:</strong> ${facilityType}
                </p>
                ${phone !== 'Not available' ? `
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">
                  <strong>📞 Phone:</strong> ${phone}
                </p>
                ` : ''}
              </div>
              <button 
                onclick="window.selectFacility(${index})" 
                style="
                  margin-top: 8px;
                  width: 100%;
                  padding: 8px 12px;
                  background: #0068ff;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 12px;
                  font-weight: 600;
                  box-sizing: border-box;
                "
              >
                Use For Appointment
              </button>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${facilityLat},${facilityLng}" 
                target="_blank" 
                rel="noopener noreferrer"
                style="
                  display: block;
                  margin-top: 8px;
                  width: 100%;
                  box-sizing: border-box;
                  text-align: center;
                  padding: 8px 12px;
                  background: white;
                  color: #0068ff;
                  border: 1px solid #0068ff;
                  border-radius: 4px;
                  text-decoration: none;
                  font-size: 12px;
                  font-weight: 600;
                "
              >
                🗺️ Open in Google Maps
              </a>
            </div>
          `;

          marker.bindTooltip(`<b>${name}</b><br/><span style="font-size:11px;color:#666">${address}</span>`, { direction: 'top', offset: [0, -34] });
          marker.bindPopup(popupContent);
          markersRef.current.push(marker);

          // Store facility data for selection
          if (!window.facilitiesData) {
            window.facilitiesData = [];
          }
          window.facilitiesData[index] = {
            name: name,
            vicinity: address,
            place_id: facility.id,
            lat: facilityLat,
            lng: facilityLng,
            type: facilityType,
            distance: distance.toFixed(2),
            phone: phone
          };
        });

        // Expose facility selection function
        window.selectFacility = (index) => {
          const facility = window.facilitiesData[index];
          if (facility && onFacilitySelect) {
            onFacilitySelect(facility);
          }
        };
        
        console.log('Successfully added', facilitiesWithinRadius.length, 'markers to map');
      } else {
        alert(`No ${facilityType} facilities found within ${radiusKm}km. Try a different search or location.`);
      }
    } catch (error) {
      console.error('Error searching facilities:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      alert(`Error searching for facilities: ${error.message}. Please check your internet connection and try again.`);
    }
  };

  // Calculate distance between two coordinates in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        id="leaflet-map"
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute top-4 right-4 bg-white p-2 rounded shadow-lg text-xs z-[1000]">
        <p className="text-gray-600">📍 Your location</p>
        <p className="text-red-600">📍 Facilities</p>
      </div>
    </div>
  );
};

export default SimpleLeafletMap;
