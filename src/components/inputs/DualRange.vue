<script setup>

import {onMounted, ref, watch} from "vue";

const props = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 48,
  },
  modelValue: {
    type: Array,
    default: () => [0, 0],
  },
});

const emit = defineEmits(['update:modelValue']);

const from = ref(props.modelValue[0]);
const to = ref(props.modelValue[1]);

const availableYears = [
  1861, 1863, 1864, 1865, 1866, 1867, 1868, 1869,
  1870, 1871, 1872, 1873, 1874, 1875, 1876, 1877, 1878,
  1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889,
  1890, 1892, 1893, 1894, 1895, 1896, 1897, 1898, 1899,
  1900, 1901, 1902, 1903, 1904, 1905, 1906, 1908, 1909,
  1910, 1911, 1912, 1913];

function indexToYear(index) {
  return availableYears[index];
}

function yearToIndex(year) {
  return availableYears.indexOf(year);
}


watch([from, to], () => {
  emit('update:modelValue', [from.value, to.value]);
});

watch(() => props.modelValue, (newValue) => {
  from.value = newValue[0];
  to.value = newValue[1];
});

console.log("dual range: ", props.min, props.max)

const fromSlider = ref(null);
const toSlider = ref(null);

const fillSlider = () => {
  if (fromSlider.value && toSlider.value) {
    const rangeDistance = props.max - props.min;
    const fromPosition = from.value - props.min;
    const toPosition = to.value - props.min;
    fromSlider.value.style.background = `linear-gradient(
      to right,
      #C6C6C6 0%,
      #C6C6C6 ${(fromPosition) / rangeDistance * 100}%,
      #2c7bb6 ${(fromPosition) / rangeDistance * 100}%,
      #2c7bb6 ${(toPosition) / rangeDistance * 100}%,
      #C6C6C6 ${(toPosition) / rangeDistance * 100}%,
      #C6C6C6 100%)`;
    toSlider.value.style.background = fromSlider.value.style.background;
  }
};

const controlFromSlider = () => {
  from.value = Math.min(fromSlider.value.value, to.value);
  fillSlider();
};

const controlToSlider = () => {
  to.value = Math.max(toSlider.value.value, from.value);
  fillSlider();
};

onMounted(() => {
  from.value = yearToIndex(props.modelValue[0]);
  to.value = yearToIndex(props.modelValue[1]);
  fillSlider();
});

watch([from, to], fillSlider);

</script>

<template>
  <div class="range_container">
    <div class="sliders_control">
      <input ref="fromSlider" id="fromSlider" type="range" :value="from" :min="0" :max="availableYears.length - 1" @input="from = +$event.target.value"/>
      <input ref="toSlider" id="toSlider" type="range" :value="to" :min="0" :max="availableYears.length - 1" @input="to = +$event.target.value"/>
    </div>
    <div class="form_control">
      <div class="form_control_container d-flex align-items-baseline gap-2">
        <div class="form_control_container__time text-uppercase" style="font-size: 14px">Od</div>
        <input class="form_control_container__time__input" type="number" :value="indexToYear(from)" @input="from = yearToIndex(+($event.target.value))" />
      </div>
      <div class="form_control_container d-flex align-items-baseline gap-2">
        <div class="form_control_container__time text-uppercase" style="font-size: 14px">Do</div>
        <input class="form_control_container__time__input" type="number" :value="indexToYear(to)" @input="to = yearToIndex(+($event.target.value))" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.range_container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 10vh;
  margin: 2rem 0;
}

.sliders_control {
  position: relative;
  min-height: 20px;
}

.form_control {
  position: relative;
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  color: #e7e7e7;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  width: 20px;
  height: 20px;
  background-color: #525252;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #ffffff;
  cursor: pointer;
}

input[type=range]::-moz-range-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  width: 20px;
  height: 20px;
  background-color: #525252;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #ffffff;
  cursor: pointer;
}

input[type=range]::-webkit-slider-thumb:hover {
  background: #f7f7f7;
}

input[type=range]::-webkit-slider-thumb:active {
  box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
  -webkit-box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
}

input[type="number"] {
  color: #212121;
  width: 100px;
  height: 30px;
  border: none;
  border-radius: 4px;
  font-size: 20px;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  opacity: 1;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 2px;
  width: 100%;
  position: absolute;
  background-color: #eeeeee;
  pointer-events: none;
}

#fromSlider {
  height: 0;
  z-index: 1;
}
</style>