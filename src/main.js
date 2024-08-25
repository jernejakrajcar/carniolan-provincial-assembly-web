import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js";

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
script.async = true;
script.defer = true;

script.onload = () => {
    // Google Maps API is loaded and ready
    const app = createApp(App);
    app.use(router);
    app.mount("#app");
};

script.onerror = () => {
    console.error("Failed to load Google Maps API script");
};

document.head.appendChild(script);
