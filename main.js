let ip
let map
let blackIcon = L.icon({
  iconUrl: '/images/icon-location.svg',

  iconSize:     [36, 46], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [10, -90] // point from which the popup should open relative to the iconAnchor
});
//get current ip and display 
(function() {
  fetch("https://api.ipify.org/?format=json")
  .then(response => response.json())
  .then(data => {
    ip = data.ip
    getData(ip)
  })
  .catch(err => {if(err) console.log(err)})
})();

//get ip from input and display
(function(){
  const form = document.querySelector('#form')
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const entries = formData.entries();
    const data = Object.fromEntries(entries);
    getData(data.ip)

  })
})()

async function getData(ip) {
  const response = await fetch(
    `https://geo.ipify.org/api/v2/country?apiKey=at_ML3XpGlcEz6Kr0wx9yXF8pZsNVLxq&ipAddress=${ip}&domain=${ip}`,
    {
      method: 'GET'
    
    }
  );
  if (!response.ok) {
   console.log('no')
  }
  else {
    const res = await response.json();
    geocode(res.location.region) //get coordinates
    document.querySelector('#IP').innerText=res.ip
    document.querySelector('#address').innerText=res.location.region + ',' + res.location.country
    document.querySelector('#timezone').innerText = 'UTC' + res.location.timezone
    document.querySelector('#isp').innerText = res.isp
  } 
  
 
  
}

//get coordinates and display

async function geocode(location) {
  const response = await fetch(
    `http://www.mapquestapi.com/geocoding/v1/address?key=gNns5llR2Uz7bs6GGUCA2jDGSFrCgxck&location=${location}`,
    {
      method: 'GET'
    
    }
  );
  if (!response.ok) {
   throw new Error('bad request')
  }
  else {
    if(map) map.remove()
    const res = await response.json();
    const data = res.results[0].locations[0].displayLatLng
    let lat = data.lat
    let lng = data.lng
    map = L.map('map').setView([lat, lng], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
var marker = L.marker([lat, lng], {icon:blackIcon}).addTo(map);

marker.bindPopup(location).openPopup();
map.on('click', onMapClick);

    
  } 
}

function onMapClick(e) {
  popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(map);
}
var popup = L.popup();