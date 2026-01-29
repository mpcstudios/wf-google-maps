/**
 * WF Location Map Engine v1.0
 * Reusable Google Maps logic for Webflow.
 */
window.initWebflowMap = function(settings) {
    // 1. Destructure Settings
    const { 
        containerId = 'map-frame', 
        lat, 
        lng, 
        zoom = 15, 
        mapId, 
        markerIcon, 
        title = 'Bank Location',
        address = '',
        phone = ''
    } = settings;

    // 2. Safety Checks
    const mapElement = document.getElementById(containerId);
    if (!mapElement) {
        console.error(`Map Error: Container #${containerId} not found.`);
        return;
    }
    if (!lat || !lng) {
        console.error("Map Error: Latitude and Longitude are missing.");
        return;
    }

    // 3. Initialize Map
    const map = new google.maps.Map(mapElement, {
        center: { lat: lat, lng: lng },
        zoom: zoom,
        mapId: mapId, // Required for Advanced Markers
        disableDefaultUI: true
    });

    // 4. Create Marker Icon
    let markerContent = null;
    if (markerIcon) {
        const iconElement = document.createElement("img");
        iconElement.src = markerIcon;
        iconElement.style.width = "40px"; 
        iconElement.style.height = "63px"; 
        markerContent = iconElement;
    }

    // 5. Place the Marker
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: lat, lng: lng },
        map: map,
        content: markerContent,
        title: title
    });

    // 6. Create Info Window
    const contentString = `
      <div style="max-width: 250px; padding: 5px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight:700;">${title}</h3>
        <p style="margin: 0 0 5px 0; font-size: 14px;">${address}</p>
        <a href="tel:${phone}" style="margin: 0; font-size: 14px; color: #0082f3; text-decoration:none;">${phone}</a>
      </div>
    `;

    const infowindow = new google.maps.InfoWindow({ content: contentString });

    // 7. Add Listeners (Open on Load + Click)
    infowindow.open({ anchor: marker, map });
    marker.addListener("click", () => {
        infowindow.open({ anchor: marker, map });
    });
};
