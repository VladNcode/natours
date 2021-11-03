/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoidmxhZG5jb2RlIiwiYSI6ImNrdmpkOTdlejZoNTkzMXF3eXdrb2drMDEifQ.99BTrNfMFf3hQ7s_hwDykg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/vladncode/ckvjdugdc96m015o8fiv2nhqi',
  scrollZoom: false,
  // center: [-118.113491, 34.111745],
  // zoom: 10,
  // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create Marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add Popup
  new mapboxgl.Popup({
    offset: 30,
    focusAfterOpen: false,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p> ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include the current location
  bounds.extend(loc.coordinates);
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
