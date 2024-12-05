// Initialize the map  
var map = L.map('map', {
    renderer: L.canvas(), // Use canvas renderer for better performance with borders  
    worldCopyJump: true // Ensures smooth interaction with wrapped maps  
}).setView([50.32876033586117, 30.483001336281887], 6);

map.options.maxZoom = 12; // Set maximum zoom level  

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

// Generate a random color  
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Object to store assigned colors for each country  
const countryColors = {};

// Styling function for GeoJSON layer  
function style(feature) {
    const countryName = feature.properties.NAME;

    // Assign a color to the country if it doesn't already have one  
    if (!countryColors[countryName]) {
        countryColors[countryName] = getRandomColor();
    }

    return {
        fillColor: countryColors[countryName], // Use the assigned color  
        weight: 1.5, // Border thickness  
        opacity: 1, // Border opacity  
        color: '#000000', // Black border color  
        dashArray: '', // Solid border  
        fillOpacity: 0.2, // Semi-transparent fill  
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
}

// Reset highlight on mouseout  
function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    e.target.closePopup();
}

// Zoom to feature on click  
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    const countryName = e.target.feature.properties.NAME;
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

function fetchBoarder(boardersURL) {
    fetch(boardersURL)
        .then(response => response.json())
        .then(data => {
            data.features = data.features.map(feature => {
                if (customNames[feature.properties.name]) {
                    feature.properties.name = customNames[feature.properties.name];
                }
                return feature;
            });

            // Remove the previous GeoJSON layer if it exists  
            if (geojsonLayer) {
                map.removeLayer(geojsonLayer);
            }

            // Add GeoJSON layer with custom styling and event handlers  
            geojsonLayer = L.geoJSON(data, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
        })
        .catch(error => console.error('Error loading historical GeoJSON:', error));
}

let borderURLs =
{
    "2010": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_2010.geojson',
    "2000": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_2000.geojson',
    "1994": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1994.geojson',
    "1960": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1960.geojson',
    "1945": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1945.geojson',
    "1938": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1938.geojson',
    "1920": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1920.geojson',
    "1914": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1914.geojson',
    "1900": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1900.geojson',
    "1880": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1880.geojson',
    "1815": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1815.geojson',
    "1800": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1800.geojson',
    "1783": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1783.geojson',
    "1715": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1715.geojson',
    "1700": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1700.geojson',
    "1650": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1650.geojson',
    "1600": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1600.geojson',
    "1530": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1530.geojson',
    "1500": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1500.geojson',
    "1492": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1492.geojson',
    "1400": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1400.geojson',
    "1300": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1300.geojson',
    "1279": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1279.geojson',
    "1200": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1200.geojson',
    "1100": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1100.geojson',
    "1000": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_1000.geojson',
    "900": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_900.geojson',
    "800": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_800.geojson',
    "700": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_700.geojson',
    "600": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_600.geojson',
    "500": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_500.geojson',
    "400": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_400.geojson',
    "300": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_300.geojson',
    "200": 'https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_200.geojson',
};

fetchBoarder(borderURLs["2010"]);

// Define a custom icon for the marker  
var battleIcon = L.icon({
    iconUrl: '../battle-svgrepo-com.svg', // Path to your custom icon image  
    iconSize: [32, 32], // Size of the icon [width, height]  
    iconAnchor: [0, 0], // Anchor point of the icon (center bottom)  
    popupAnchor: [0, -32] // Anchor point for popups (optional)  
});

var diplomacyIcon = L.icon({
    iconUrl: '../parthenon-landmark-svgrepo-com.svg', // Path to your custom icon image  
    iconSize: [32, 32], // Size of the icon [width, height]  
    iconAnchor: [0, 0], // Anchor point of the icon (center bottom)  
    popupAnchor: [0, -32] // Anchor point for popups (optional)  
});

// // Add a marker for Ukraine  
// var ukraineMarker = L.marker([50.32876033586117, 30.483001336281887], { icon: battleIcon }) // Coordinates for Kyiv, Ukraine  
//     .addTo(map)
//     .bindTooltip("6 травня: польські війська здобули Київ.", { permanent: true, direction: "top" }) // Add a label  
//     .on('click', function () {
//         openModal("", "<p style='font-size:25px;'>6 травня: польські війська здобули Київ.</p>");
//     });


var ukraineMarker = L.marker([50.32876033586117, 30.483001336281887], { icon: battleIcon }) // Coordinates for Kyiv, Ukraine  
    .addTo(map)
    .bindTooltip("6 травня 1920: польські війська здобули Київ.", {
        permanent: true,
        direction: "top",
        className: "custom-tooltip" // Add a custom class  
    }) // Add a label  
    .on('click', function () {
        openModal("",
            `<h2>Київська операція Війська Польського (1920)</h2>
            <p>
            Ки́ївська опера́ція Ві́йська По́льського (1920) (Ки́ївська експеди́ція (пол. Wyprawa kijowska), також рідко Украї́нська опера́ція[1]) — наступальна операція Війська Польського і Армії УНР в квітні 1920 року, метою якої було визволити Київ від більшовиків.
            </p>
            <a href='https://uk.wikipedia.org/wiki/%D0%9A%D0%B8%D1%97%D0%B2%D1%81%D1%8C%D0%BA%D0%B0_%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D1%96%D1%8F_%D0%92%D1%96%D0%B9%D1%81%D1%8C%D0%BA%D0%B0_%D0%9F%D0%BE%D0%BB%D1%8C%D1%81%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE_(1920)'>Wikipedia</a>
            `);
    });


var ukraineMarker = L.marker([50.08804, 14.42076], { icon: diplomacyIcon }) // Coordinates for Kyiv, Ukraine  
    .addTo(map)
    .bindTooltip("липень 1920: створення Української військової організації (УВО)", {
        permanent: true,
        direction: "top",
        className: "custom-tooltip" // Add a custom class  
    }) // Add a label  
    .on('click', function () {
        openModal("",
            `<h2>Українська військова організація</h2>
            <p>
            Украї́нська військо́ва організа́ція (УВО) — військова революційно-політична формація, що постала 1920 року заходами старшин різних українських армій: Січових Стрільців (ідеологічно-політичний вклад), Української Галицької армії, в основному її VI Равської бригади (бойовий та організаційний елемент).
            </p>
            <p>9 квітня 2015 року Верховна Рада України ухвалила закон «Про правовий статус та вшанування пам'яті борців за незалежність України у ХХ столітті» авторства Юрія Шухевича, в якому вказано перелік організацій, які визнаються таким, що боролись за незалежність України, серед них є й Українська військова організація.[1]</p>
            <a href='https://uk.wikipedia.org/wiki/%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%81%D1%8C%D0%BA%D0%B0_%D0%B2%D1%96%D0%B9%D1%81%D1%8C%D0%BA%D0%BE%D0%B2%D0%B0_%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D1%96%D0%B7%D0%B0%D1%86%D1%96%D1%8F'>Wikipedia</a>
            `);
    });  


    var ukraineMarker = L.marker([52.217, 21.033], { icon: diplomacyIcon }) // Coordinates for Kyiv, Ukraine  
    .addTo(map)
    .bindTooltip("25 квітня 1920: підписання Варшавського договору", {
        permanent: true,
        direction: "top",
        className: "custom-tooltip" // Add a custom class  
    }) // Add a label  
    .on('click', function () {
        openModal("",
            `<h2>Варшавський договір (1920)</h2>
            <p>
            Варша́вський договір, або Договір Пілсудський — Петлюра — політичні й військові конвенції, підписані представниками Польщі і Української Народної Республіки, які розроблялись таємно від уряду УНР й польського сейму. За ними в обмін на визнання незалежності УНР і військову допомогу Симон Петлюра погоджувався визнати українсько-польський кордон по річці Збруч і далі по Прип'яті до її гирла. Згідно з договором польський уряд Юзефа Пілсудського відмовився від намірів розширити територію Польщі до кордонів Речі Посполитої 1772 року та визнав УНР. До Польщі мала відійти Східна Галичина та 5 повітів Волині.
            </p>
            <a href='https://uk.wikipedia.org/wiki/%D0%92%D0%B0%D1%80%D1%88%D0%B0%D0%B2%D1%81%D1%8C%D0%BA%D0%B8%D0%B9_%D0%B4%D0%BE%D0%B3%D0%BE%D0%B2%D1%96%D1%80_(1920)'>Wikipedia</a>
            `);
    });  