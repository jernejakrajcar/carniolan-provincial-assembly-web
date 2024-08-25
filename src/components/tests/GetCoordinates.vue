<template>
  <div>
    <input v-model="placeName" placeholder="Vnesite ime kraja" />
    <button @click="fetchCoordinates">Pridobi koordinate</button>
    <p v-if="coordinates">Koordinate za {{ placeName }}: {{ coordinates.lat }}, {{ coordinates.lon }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const placeName = ref('');
const coordinates = ref(null);

const fetchCoordinates = async () => {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
    params: {
      q: placeName.value,
      format: 'json'
    }
  });
  if (response.data.length > 0) {
    const data = response.data[0];
    coordinates.value = {
      lat: data.lat,
      lon: data.lon
    };
  } else {
    coordinates.value = null;
    alert('Ni najdenih koordinat za ta kraj.');
  }
};
</script>
