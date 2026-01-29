# Webflow Google Maps Module

A reusable Google Maps engine designed for Webflow projects. It utilizes the Google Maps **Advanced Marker API** for custom pins and modern performance.

## 1. Google Cloud Setup (Required per Project)
For every new website/client, you must set up a Google Cloud Project to generate the necessary keys:

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a **New Project**.
3.  Go to **APIs & Services > Library** and enable:
    * **Maps JavaScript API**
4.  Go to **APIs & Services > Credentials** and create an **API Key**.
    * *Security Note:* Restrict this key to the client's domain (e.g., `clientwebsite.com`) to prevent theft.
5.  **Important:** Search for **Map Management** in the console sidebar.
    * Create a **Map ID**.
    * Set the Map type to "JavaScript".
    * Associate this Map ID with your new project.
    * *Why?* A Map ID is required to use custom markers (Advanced Markers) with the modern API.

## 2. Webflow Implementation

### A. Add Elements
1.  Add a `Div Block` where you want the map to appear.
2.  Give it the ID: `map-frame`
3.  Give it a specific height (e.g., `400px` or `500px`) and width (`100%`).

### B. Add Custom Code (Page Settings)
Paste the following code into the **Before </body> tag** section of your template page.

**Note:** You must replace `YOUR_GITHUB_USERNAME` with our actual GitHub username in the first script source.
```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/webflow-google-maps@main/tnb-map.js"></script>

<script>
  // This function runs when Google Maps is fully loaded
  function startMap() {
    window.initWebflowMap({
      containerId: 'map-frame',
      
      // --- Webflow CMS Fields ---
      // Replace these purple fields with the actual CMS variables in Webflow
      lat: parseFloat('{{wf {"path":"latitude","type":"Number"} }}'), 
      lng: parseFloat('{{wf {"path":"longitude","type":"Number"} }}'),
      title: '{{wf {"path":"name","type":"PlainText"} }}',
      address: '{{wf {"path":"address","type":"PlainText"} }}',
      phone: '{{wf {"path":"phone","type":"PlainText"} }}',
      
      // --- Hardcoded Project Settings ---
      mapId: 'PASTE_GOOGLE_MAP_ID_HERE', 
      markerIcon: 'PASTE_ICON_URL_HERE'
    });
  }

  // Optional: Barba.js Hook (If using page transitions)
  if (window.barba) {
    barba.hooks.after(() => {
        startMap();
    });
  }
</script>

<script src="https://maps.googleapis.com/maps/api/js?key=PASTE_API_KEY_HERE&callback=startMap&libraries=marker" async defer></script>
```
## 3. Training: How to Get Coordinates

To avoid Google Geocoding costs and ensure 100% accuracy, we do not use addresses to place the pin. We use exact coordinates.

### Instructions for the Client/Content Editor:

1. Open Google Maps.
2. Search for the business location.
3. Right-click directly on the red pin.
4. The very first item in the menu is the Latitude/Longitude (e.g., `26.15419, -97.95804`).
5. Left-click those numbers (it will automatically copy them to your clipboard).
6. Paste these numbers into the **Latitude** and **Longitude** fields in the Webflow CMS item.
