const AddressSearch = () => {
  function initialize() {
    const input = document.getElementById('bash--address-search');
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    window.google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      console.info({ place });
      document.getElementById('city2').value = place.name;
      document.getElementById('cityLat').value = place.geometry.location.lat();
      document.getElementById('cityLng').value = place.geometry.location.lng();
    });
  }

  setTimeout(() => {
    initialize();
  }, 500);

  return `
  Search...
  <input name="bash-address-search" id="bash--address-search" placeholder="Start typing an address" />`;
};

export default AddressSearch;
