<script setup>
import { ref, computed } from 'vue';
import { countOccurrences, saveOccurrencesToLocalStorage, getOccurrencesFromLocalStorage } from '@/path-to-your-file';
import data from '../../../public/test.json';
import placesData from '../../assets/json/krajevna_imena.json';
import VChart from "vue-echarts";

// Extract place names
const places = placesData.map(place => place.names.sl);
const properNouns = data.map(entry => [entry.someProperNoun]);

// Check if occurrences are already stored
let placeCounts = getOccurrencesFromLocalStorage();
if (!placeCounts) {
  // If not stored, calculate and store them
  saveOccurrencesToLocalStorage(properNouns, places);
  placeCounts = getOccurrencesFromLocalStorage();
}

// Prepare map data
const mapData = places.map(place => ({
  name: place,
  value: placeCounts[place] || 0,
  coordinates: placesData.find(p => p.names.sl === place).coordinates
}));

const showTop5 = ref(false);
const searchQuery = ref('');

const top5Data = computed(() => {
  return mapData.sort((a, b) => b.value - a.value).slice(0, 5);
});

const filteredData = computed(() => {
  if (!searchQuery.value || searchQuery.value === "Vsi kraji") {
    return mapData;
  }
  return mapData.filter(place =>
      place.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const sortedFilteredPlaces = computed(() => {
  return filteredData.value.sort((a, b) => a.name.localeCompare(b.name));
});

const toggleTop5 = () => {
  showTop5.value = !showTop5.value;
};

const option = computed(() => ({
  backgroundColor: 'transparent',
  title: {
    text: 'Geo Map - Implementacija',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      return `${params.name} : ${params.value[2]}`;
    },
  },
  gmap: {
    center: [14.5058, 46.0569],
    zoom: 8,
    roam: true,
  },
  series: [
    {
      name: 'Occurences',
      type: 'scatter',
      coordinateSystem: 'gmap',
      data: showTop5.value ? convertData(top5Data.value) : convertData(filteredData.value),
      symbolSize: function (val) {
        const minSize = 10;
        const maxSize = 60;
        const baseSize = 5;
        const size = Math.log(val[2] + 1) * baseSize;
        return Math.min(Math.max(size, minSize), maxSize);
      },
      itemStyle: {
        color: function (param) {
          const val = param.value[2];
          if (val > 50) return 'red';
          if (val > 20) return 'orange';
          if (val > 10) return 'yellow';
          if (val > 1) return 'green';
          return 'white';
        },
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
      label: {
        show: false,
      }
    },
  ],
}));

const filterPlaces = () => {
  // This function is intentionally left blank as the filtering is handled by the computed property 'filteredData'.
};

</script>

<template>
  <div class="row text-white px-3">
    <v-chart class="chart col-9" :option="option" autoresize/>
    <div class="col-3 d-flex flex-column gap-3 pt-5">
      Izberi kraj:
      <select class="form-select" type="text" v-model="searchQuery">
        <option value="">Vsi kraji</option>
        <option v-for="place in sortedFilteredPlaces" :key="place.name" :value="place.name">{{ place.name }}</option>
      </select>
      Prikaži 5 največkrat omenjenih:
      <button class="btn btn-warning w-50" @click="toggleTop5">{{ showTop5 ? "Prikaži vse kraje" : "Prikaži top 5" }}</button>

      <div class="border border-white rounded-4 p-4">
        <h4>Legenda</h4>
        <ul class="list-unstyled">
          <li><span class="text-danger">Rdeča </span> > 50</li>
          <li><span style="color: orange">Oranžna </span> > 20</li>
          <li><span style="color: yellow">Rumena </span> > 10</li>
          <li><span class="text-success">Zelena </span> > 1</li>
          <li><span>Bela </span> = 0</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>