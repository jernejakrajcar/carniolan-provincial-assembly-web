<template>
  <div class="row mt-2">
    <div class="col-lg-9 col-12">
    <v-chart class="chart" :option="option" autoresize @click="handleMapClick"/>
    </div>
    <div class="col-lg-3 col-12 d-flex flex-column" :class="isMedium ? 'px-2' : 'px-4'">
      <Title msg="Vizualiazacija krajev v kranjskem deželnem zboru" />
      <div class="d-flex align-items-center py-2">
        <label for="place-input" class="form-label me-2 ">Kraj: </label>
        <div class="w-100 position-relative">
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Izberi kraj" @focus="isDropdownVisible = true"/>
          <ul v-if="isDropdownVisible && filteredPlaces.length" class="list-group position-absolute w-100 mt-2 z-2 overflow-y-scroll" style="max-height: 70vh; width: 20vw;">
            <li class="list-group-item" v-for="place in filteredPlaces" :key="place.name" @click="selectPlace(place.name)">
              {{ place.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="my-3">
        <label class="form-label w-100">Prikaži
          <input type="number" :min="1" :max="totalCities" v-model="toggleTopRange" class="form-control form-control-sm mt-2 mx-2" :class="isMedium ? 'fs-6' : 'fs-5'" style="width: 6vw;display: inline;">
        največkrat omenjenih: </label>
        <input type="range" :min="1" :max="totalCities" v-model="toggleTopRange" class="w-100">
      </div>

      <div :class="isMedium ? 'mt-0' : 'mt-3'" style="min-height: 30vh;">
        <div class="d-flex justify-content-center mb-2">
          <button v-show="timelineMode === 'sklic'" class="btn btn-primary mx-1 px-5 fw-semibold" @click="toggleTimelineMode()" :style="{ fontSize: isMedium ? '13px' : '18px'}">Izberi obdobje</button>
          <button v-show="timelineMode === 'period'" class="btn btn-primary mx-1 px-5 fw-semibold" @click="toggleTimelineMode()" :style="{ fontSize: isMedium ? '13px' : '18px'}">Izberi sklic/sesijo</button>
        </div>
        <div v-if="timelineMode === 'period'">
          <label>Obdobje:</label>
          <DualRange :min="timelineMinValue" :max="timelineMaxValue" v-model="timelineRange"></DualRange>
        </div>
        <div class="row" v-else-if="timelineMode === 'sklic'" style="height: 8vh; margin: 2rem 0;">
          <div class="col-6">
            <label class="mb-1">Sklic:</label>
            <select class="form-select" v-model="selectedSklic" @change="updateData">
              <option value="">Izberi sklic</option>
              <option v-for="sklic in timelineSklici" :key="sklic" :value="sklic">{{ sklic }}</option>
            </select>
          </div>
          <div v-if="selectedSklic" class="col-6">
            <label class="mb-1">Sesija:</label>
            <select class="form-select" v-model="selectedSesija" @change="updateData">
              <option value="">Vse sesije</option>
              <option v-for="sesija in availableSesije" :key="sesija" :value="sesija">{{ sesija }}</option>
            </select>
          </div>
        </div>
      </div>

      <a type="button" class="w-100 text-decoration-none text-info" v-if="timelineRange" @click="resetFilters">Odstrani vse filtre</a>

      <div class="border border-white rounded-4" :class="isMedium ? 'py-1 px-3' : 'p-4 mx-4'">
        <div class="d-flex flex-row align-items-center justify-content-between mb-1">
          <span :class="isMedium ? 'h6' : 'h4'">Legenda</span>
          <a @click="showAbout = true">
            <i class="bi bi-info-circle-fill"></i>
          </a>
        </div>
        <ul class="list-unstyled mb-1">
          <li>
            <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" x="10" y="5" fill="#d01c8b" />
            </svg> > 50 omemb
          </li>
          <li>
            <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" x="10" y="5" fill="#e74bab" />
            </svg> > 20 omemb
          </li>
          <li>
            <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" x="10" y="5" fill="#ee81c4" />
            </svg> > 10 omemb
          </li>
          <li>
            <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" x="10" y="5" fill="#f5b7dd" />
            </svg> > 1 omemba
          </li>
        </ul>
      </div>
    </div>
  </div>

  <PopupModal ref="popupModal">
    <template #header>
      <p class="h5">Zapisniki z omembo kraja: <span class="fw-bold">{{ selectedPlace }}</span></p>
    </template>
    <template #content>
      <ul class="list-unstyled overflow-y-scroll" style="max-height: 50vh">
        <li class="my-2" v-for="(files, year) in filenames" :key="year">
          <span>{{ year }}: </span>
          <!--<span>({{ countsPerYear[year] || 0 }})</span>-->
          <ul>
            <li v-for="(file_info, filename) in files" :key="filename">
              <a href="#" @click="openPDF(filename)">{{ file_info['title'] || filename }}</a>
              <span class="mx-2">({{ file_info['count'] || 0 }})</span>
            </li>
          </ul>
        </li>
      </ul>
      <p></p>
    </template>
    <template #footer>
      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-outline-primary rounded-1 me-2" @click="closeModal">Zapri</button>
      </div>
    </template>
  </PopupModal>

  <About v-if="showAbout" @close="showAbout = false"></About>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';
import { ScatterChart, EffectScatterChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, computed, onMounted, watch } from 'vue';
import 'echarts-extension-gmap';
import placesData from '../../assets/json/krajevna_imena.json';
import placeCounts from '../../assets/json/place_occurences_data.json';
import About from "@/components/About.vue";
import Title from "@/components/Title.vue";
import DualRange from "@/components/inputs/DualRange.vue";
import PopupModal from "@/components/PopupModal.vue";
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

use([TitleComponent, TooltipComponent, ScatterChart, EffectScatterChart, CanvasRenderer, UniversalTransition]);

provide(THEME_KEY, 'dark');

const showAbout = ref(false);

// Extract place names and their coordinates from placesData
const places = placesData.map(place => ({
  sl: place.names.sl,
  de: place.names.de,
  coordinates: [parseFloat(place.coordinates.lon), parseFloat(place.coordinates.lat)]
}));

const geoCoordMap = {};
places.forEach(place => {
  const combinedName = `${place.sl}/${place.de}`;
  geoCoordMap[combinedName] = place.coordinates;
  geoCoordMap[place.sl] = place.coordinates;
  geoCoordMap[place.de] = place.coordinates;
});

const mapData = ref([]);
const filenames = ref([]);

// možni filtri za timeline:
const periods = ref([]);
const sklici = ref([]);
const availableSesije = ref([]);

const searchQuery = ref('');
const isDropdownVisible = ref(false);

const selectedSklic = ref('');
const selectedSesija = ref('');
const timelineMinValue = ref(0);
const timelineMaxValue = ref(48);
const timelineRange = ref([timelineMinValue.value, timelineMaxValue.value]);
const timelineMode = ref('period');
const timelinePeriods = ref([]);
const timelineSklici = ref([]);

const totalCities = Object.keys(placeCounts).length;
const toggleTopRange = ref(totalCities);

const selectedPlace = ref('');

// Static data for number of sessions in each term
const skliciSesije = {
  1: [1, 2, 3, 4, 5],
  2: [1],
  3: [1, 2, 3],
  4: [1, 2],
  5: [1, 2, 3, 4, 5, 6, 7],
  6: [1, 2, 3, 4],
  7: [1, 2, 3, 4, 5, 6, 7],
  8: [1, 2, 3, 4, 5, 6],
  9: [1, 2, 3, 4, 5, 6],
  10: [1, 2, 3, 4],
  11: [1, 2, 3]
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedSklic.value = '';
  selectedSesija.value = '';
  timelineRange.value = [0, timelineMaxValue.value];
  timelineMode.value = 'period';
  toggleTopRange.value = totalCities;
  updateData();
};

function toggleTimelineMode() {
  if (timelineMode.value === 'sklic') {
    timelineMode.value = 'period';
    timelineRange.value = [timelineMinValue.value, timelineMaxValue.value];
  } else if (timelineMode.value === 'period') {
    timelineMode.value = 'sklic';
    selectedSklic.value = '';
    selectedSesija.value = '';
  }
}

const handleMapClick = (params) => {
  const placeName = params.name;
  const place = places.find(p => `${p.sl}/${p.de}` === placeName || p.sl === placeName || p.de === placeName);
  if (place) {
    selectedPlace.value = placeName;
    filenames.value = placeCounts[placeName].files;
    console.log(filenames.value)
    openModal();
  }
};

const openPDF = (file) => {
  const filePath = `public/Kranjska-pdf/${file}.pdf`; // Construct the path to the PDF file
  window.open(filePath, '_blank'); // Open the file in a new window
};


// Prepare the periods, sklici lists
onMounted(() => {
  const allPeriods = new Set();
  const allSklici = new Set();
  Object.values(placeCounts).forEach(counts => {
    Object.keys(counts.years).forEach(year => {
      allPeriods.add(year);
    });
    Object.keys(counts.sessions).forEach(sklic => {
      allSklici.add(sklic);
    });
  });
  periods.value = Array.from(allPeriods).sort();
  sklici.value = Array.from(allSklici).map(Number).sort((a, b) => a - b);
  timelinePeriods.value = periods.value;
  timelineSklici.value = sklici.value;
  timelineRange.value = [0, timelineMaxValue.value];
  updateData();
});

// Watch for changes in selectedSklic to update sesije list
watch(selectedSklic, () => {
  updateSesije();
});

const updateSesije = () => {
  if (selectedSklic.value) {
    availableSesije.value = skliciSesije[selectedSklic.value] || [];
  } else {
    availableSesije.value = [];
  }
};

const convertData = function (data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value)
      });
    }
  }
  return res;
};

// funkcija za štetje glede na časovnico - letnice ali sklice
const updateData = () => {
  mapData.value = [];
  filenames.value = [];

  let tempMapData = [];

  if (timelineMode.value === 'period') {
    const [startYear, endYear] = timelineRange.value;
    const minYear = periods.value[startYear];
    const maxYear = periods.value[endYear];
    if(minYear !== null && maxYear !== null){
      Object.entries(placeCounts).forEach(([place, counts]) => {
        let totalCount = 0;
        for (let year = minYear; year <= maxYear; year++) {
          if (counts.years[year]) {
            totalCount += counts.years[year];
          }
        }
        if (totalCount > 0) {
          tempMapData.push({ name: place, value: totalCount });
        }
      });
    } else {
      Object.entries(placeCounts).forEach(([place, counts]) => {
        const totalCount = Object.values(counts.years).reduce((sum, count) => sum + count, 0);
        if (totalCount > 0) {
          tempMapData.push({ name: place, value: totalCount });
        }
      });
    }
  } else if (timelineMode.value === 'sklic') {
    if (selectedSklic.value) {
      Object.entries(placeCounts).forEach(([place, counts]) => {
        const sessionsInSklic = counts.sessions[selectedSklic.value];
        if (sessionsInSklic) {
          // če so v trenutnem sklicu sesije, potem poglej še če je izbrana sesija, če ne seštej vsoto vseh sesij
          if(selectedSesija.value) {
            tempMapData.push({name: place, value: sessionsInSklic[selectedSesija.value]});
          } else {
            const totalCount = Object.values(sessionsInSklic).reduce((sum, count) => sum + count, 0);
            tempMapData.push({name: place, value: totalCount});
          }
        }
      });
    }
  }

  mapData.value = tempMapData
      .sort((a,b) => b.value - a.value)
      .slice(0, toggleTopRange.value);

};

watch(() => toggleTopRange.value, updateData);
//potrebna validacija za letnice ob čudnih nastavitvah
watch(() => timelineRange.value, (newRange) => {
  if (timelineMode.value === 'period') {
    if (newRange[0] < timelineMinValue.value || newRange[1] > timelineMaxValue.value) {
      timelineRange.value = [timelineMinValue.value, timelineMaxValue.value];
    }
  }
  updateData()
});



const filteredData = computed(() => {
  let filtered = mapData.value.map(({name, value}) => ({
    name,
    value: value || 0
  }));

  if (searchQuery.value) {
    const normalizedQuery = searchQuery.value.toLowerCase();
    filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(normalizedQuery)
    );
  }

  return filtered;
});


const sortedFilteredPlaces = computed(() => {
  const sortedPlaces = filteredData.value.map(place => ({
    name: place.name.toLowerCase(),
    originalName: place.name
  }));

  sortedPlaces.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  console.log(sortedPlaces.map(place => ({ name: place.originalName })))
  return sortedPlaces.map(place => ({ name: place.originalName }));
});

const filteredPlaces = computed(() => {
  if (!searchQuery.value) {
    return [];
  }
  const normalizedQuery = searchQuery.value.toLowerCase();
  return sortedFilteredPlaces.value.filter(place =>
      place.name.toLowerCase().includes(normalizedQuery)
  );
});


const fetchFilenames = () => {
  filenames.value = [];
  const place = searchQuery.value;
  if (place && placeCounts[place] && placeCounts[place].files && placeCounts[place].files) {
    filenames.value = placeCounts[place].files;
  }
};

const selectPlace = placeName => {
  searchQuery.value = placeName;
  isDropdownVisible.value = false;
  fetchFilenames();
  const placeData = placeCounts[placeName];
  if (placeData) {
    countsPerYear.value = Object.entries(placeData.years).reduce((acc, [year, count]) => {
      acc[year] = count;
      return acc;
    }, {});
  } else {
    countsPerYear.value = {};
  }
};

const countsPerYear = computed(() => {
  const place = selectedPlace.value;
  if (place && placeCounts[place]) {
    return Object.entries(placeCounts[place].years).reduce((acc, [year, count]) => {
      acc[year] = count;
      return acc;
    }, {});
  }
  return {};
});

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      return `${params.name} : ${params.value[2]}`;
    },
  },
  gmap: {
    center: [14.5058, 46.0569],
    zoom: 8,
    roam: true
  },
  series: [
    {
      name: 'Št. pojavitev',
      type: 'scatter',
      coordinateSystem: 'gmap',
      data: convertData(filteredData.value),
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
          if (val > 50) return '#d01c8b';
          if (val > 20) return '#e74bab';
          if (val > 10) return '#ee81c4';
          if (val > 0) return '#f5b7dd';
        },
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
      label: {
        show: false,
      },
    },
  ],
}));

const popupModal = ref(null);

const openModal = () => {
  popupModal.value.open();
}

const closeModal = () => {
  popupModal.value.close();
}

const isMedium = ref(window-innerWidth <= 1280)
function checkIsMobile() {
  isMedium.value = window.innerWidth <= 1280
}

onMounted(() => {
  window.addEventListener('resize', checkIsMobile);
  checkIsMobile();
});
</script>

<style scoped>
.chart {
  height: 95vh;
}
</style>
