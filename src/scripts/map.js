var map = L.map('map').setView([50.32876033586117, 30.483001336281887], 6);  
map.options.maxZoom = 6;  // встановлюємо максимальний рівень масштабування на 10
// Додавання базової карти OpenStreetMap
// Базовий шар без міток  
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {  
    maxZoom: 19,  
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'  
}).addTo(map);  

// Додаємо шар з мітками міст  
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {  
    maxZoom: 19,  
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'  
}).addTo(map);

// Функція стилізації
function style(feature) {
    return {
        fillColor: 'transparent',
        weight: 1,
        opacity: 1,
        color: '#4a4a4a',
        dashArray: '',
        fillOpacity: 0,
        className: 'country-border'
    };
}

// Функція підсвічування при наведенні
function highlightFeature(e) {  
    var layer = e.target;  

    layer.setStyle({  
        weight: 2.5,  
        color: '#2B65EC',  
        dashArray: ''  
    });  

    layer.bringToFront();  
    layer.bindPopup(layer.feature.properties.name, {  
        className: 'custom-popup',  
        autoPan: false  // додаємо цю опцію  
    }).openPopup();  
}  

// Функція скидання підсвічування
function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    e.target.closePopup();
}

// Функція масштабування при кліку
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


// Функція додавання обробників подій
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
const customNames = {  
    'Russia': 'Mordor(Moskovia)',  
};  

// Створення глобальної змінної для шару GeoJSON
var geojsonLayer;

// Завантаження та додавання даних GeoJSON
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')  
    .then(response => response.json())  
    .then(data => {  
        // Модифікуємо назви перед створенням шару  
        data.features = data.features.map(feature => {  
            if (customNames[feature.properties.name]) {  
                feature.properties.name = customNames[feature.properties.name];  
            }  
            return feature;  
        });  

        geojsonLayer = L.geoJSON(data, {  
            style: style,  
            onEachFeature: onEachFeature  
        }).addTo(map);  
    })  
    .catch(error => console.error('Error loading GeoJSON:', error));  
