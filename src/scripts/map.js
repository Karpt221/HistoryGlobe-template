// Initialize the map  
var map = L.map('map', {  
    renderer: L.canvas(), // Use canvas renderer for better performance with borders  
    worldCopyJump: true // Ensures smooth interaction with wrapped maps  
}).setView([50.32876033586117, 30.483001336281887], 6);  

map.options.maxZoom = 6; // Set maximum zoom level  

// Add base map without labels  
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {  
    maxZoom: 19,  
    noWrap: false, // Allow wrapping for seamless map edges  
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'  
}).addTo(map);  

// Add city labels layer  
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {  
    maxZoom: 19,  
    noWrap: false, // Allow wrapping for seamless map edges  
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'  
}).addTo(map);  

// Styling function for GeoJSON layer  
function style(feature) {  
    return {  
        fillColor: 'transparent', // Transparent fill  
        weight: 1.5, // Border thickness  
        opacity: 1, // Border opacity  
        color: '#000000', // Black border color  
        dashArray: '', // Solid border  
        fillOpacity: 0, // No fill  
        className: 'country-border' // Optional class for additional styling  
    };  
}  

// Highlight feature on mouseover  
function highlightFeature(e) {  
    var layer = e.target;  

    layer.setStyle({  
        weight: 2.5,  
        color: '#2B65EC', // Highlight color (blue)  
        dashArray: ''  
    });  

    layer.bringToFront();  
    layer.bindPopup(layer.feature.properties.name, {  
        className: 'custom-popup',  
        autoPan: false // Prevent auto-panning when popup opens  
    }).openPopup();  
}  

// Reset highlight on mouseout  
function resetHighlight(e) {  
    geojsonLayer.resetStyle(e.target);  
    e.target.closePopup();  
}  

// Zoom to feature on click  
function zoomToFeature(e) {  
    map.fitBounds(e.target.getBounds());  
    const countryName = e.target.feature.properties.name;  
    if (countryHistories[countryName]) {  
        openModal(countryName, countryHistories[countryName]);  
    } else {  
        openModal(countryName, `<p>Історична інформація для країни ${countryName} поки що недоступна.</p>`);  
    }  
    console.log(e.target.feature);  
}  

// Add event handlers for each feature  
function onEachFeature(feature, layer) {  
    layer.on({  
        mouseover: highlightFeature,  
        mouseout: resetHighlight,  
        click: zoomToFeature  
    });  
}  

// Custom country names  
const customNames = {  
    'Russia': 'Mordor(Moskovia)',  
};  

// Global variable for GeoJSON layer  
var geojsonLayer;  

// Load and add GeoJSON data  
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')  
    .then(response => response.json())  
    .then(data => {  
        // Modify country names before creating the layer  
        data.features = data.features.map(feature => {  
            if (customNames[feature.properties.name]) {  
                feature.properties.name = customNames[feature.properties.name];  
            }  
            return feature;  
        });  

        // Add GeoJSON layer with custom styling and event handlers  
        geojsonLayer = L.geoJSON(data, {  
            style: style,  
            onEachFeature: onEachFeature  
        }).addTo(map);  
    })  
    .catch(error => console.error('Error loading GeoJSON:', error));