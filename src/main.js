import "./assets/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import axios from "axios";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import VTooltip from "v-tooltip";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const app = createApp(App);

const options = {
  timeout: 1500,
};

app.use(Toast, options);

app.component("v-select", vSelect);
app.component("VueDatePicker", VueDatePicker);
app.use(createPinia());
app.use(VTooltip);
app.use(router);

// Load auth from storage before mounting
import { useAuthStore } from "./stores/auth";
const authStore = useAuthStore();
authStore.loadFromStorage();

app.mount("#app");
