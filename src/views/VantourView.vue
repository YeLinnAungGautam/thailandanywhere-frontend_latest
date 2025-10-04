<script setup>
import Layout from "./Layout.vue";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import {
  PlusIcon,
  ListBulletIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import AddonPage from "./Addon/AddonPage.vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCityStore } from "../stores/city";
import { useProductStore } from "../stores/product";
import { useDestinationStore } from "../stores/destination";
import { useCarStore } from "../stores/car";
import { useVantourStore } from "../stores/vantour";
import { useAuthStore } from "../stores/auth";
import { QuillEditor } from "@vueup/vue-quill";
import Swal from "sweetalert2";
import { useReservationStore } from "../stores/reservation";
import TestAiVue from "./GenerateAI/TestAi.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Modal from "../components/Modal.vue";

const editorOptions = {
  placeholder: "Description with editor ...",
};

const toast = useToast();
const router = useRouter();
const route = useRoute();
const cityStore = useCityStore();
const productStore = useProductStore();
const destinationStore = useDestinationStore();
const carStore = useCarStore();
const vantourStore = useVantourStore();
const authStore = useAuthStore();
const reservationStore = useReservationStore();

const { cities } = storeToRefs(cityStore);
const { tags } = storeToRefs(productStore);
const { dests } = storeToRefs(destinationStore);
const { cars } = storeToRefs(carStore);

const typeList = ref([
  { id: 1, name: "Van Tour", value: "van_tour" },
  { id: 2, name: "Car Rental", value: "car_rental" },
]);

const add_on_show = ref(false);

const formData = ref({
  id: "",
  name: "",
  description: "",
  long_description: "",
  full_description_en: "",
  cover_image: "",
  sku_code: "",
  ticket_price: "",
  type: "car_rental",
  tag: [],
  city_id: [],
  destination: [],
  images: [],

  feature_image: "",
});
const editData = ref({
  tag: [],
  city_id: [],
  destination: [],
  prices: [],
  costs: [],
  cover_image: "",
  images: [],
});

const formPrice = ref({
  car: "",
  name: "",
  price: "",
  cost: "",
  agent_price: "",
});
const addNewPrice = () => {
  editData.value.prices.push(formPrice.value);
  console.log(editData.value.prices, "prices");
  formPrice.value = {
    car: "",
    name: "",
    price: "",
    cost: "",
    agent_price: "",
  };
};

const removeFromPrice = (index) => {
  editData.value.prices.splice(index, 1);
};
const errors = ref(null);

const featureImageInput = ref(null);
const featureImagePreview = ref(null);

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.cover_image = e.target.files[0];
    featureImagePreview.value = URL.createObjectURL(selectedFile);
  }
};

const removeFeatureSelectImage = async () => {
  formData.value.feature_image = null;
  featureImagePreview.value = null;
  const res = await vantourStore.deleteCoverImageAction(formData.value.id);
  console.log(res, "delete cover image");
  toast.success(res.message);
  getDetail();
  // editData.value.cover_image = null;
};

const removeFeatureSelectPreviewImage = () => {
  formData.value.feature_image = null;
  editData.value.cover_image = null;
  featureImagePreview.value = null;
  // editData.value.cover_image = null;
};

const imagesInput = ref(null);
const imagesPreview = ref([]);

const openFileImagePicker = () => {
  imagesInput.value.click();
};

const handlerImagesFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      editData.value.images.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  editData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

const onSubmitHandler = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("name", formData.value.name);
  frmData.append("sku_code", formData.value.sku_code);
  formData.value.ticket_price
    ? frmData.append("ticket_price", formData.value.ticket_price)
    : 0;
  frmData.append("type", formData.value.type);
  frmData.append("long_description", formData.value.long_description);
  frmData.append("full_description_en", formData.value.full_description_en);
  frmData.append("description", formData.value.description);

  if (editData.value.images.length > 0) {
    for (let i = 0; i < editData.value.images.length; i++) {
      let file = editData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  if (formData.value.cover_image) {
    frmData.append("cover_image", formData.value.cover_image);
  }
  for (var x = 0; x < formData.value.city_id.length; x++) {
    frmData.append("city_ids[" + x + "]", formData.value.city_id[x]);
  }
  for (var x = 0; x < formData.value.tag.length; x++) {
    frmData.append("tag_ids[" + x + "]", formData.value.tag[x]);
  }
  for (var x = 0; x < formData.value.destination.length; x++) {
    frmData.append("destination_ids[" + x + "]", formData.value.destination[x]);
  }
  for (var x = 0; x < editData.value.prices.length; x++) {
    frmData.append("car_ids[" + x + "]" + [x], editData.value.prices[x].car);
  }
  for (var x = 0; x < editData.value.prices.length; x++) {
    frmData.append("prices[" + x + "]" + [x], editData.value.prices[x].price);
  }
  for (var x = 0; x < editData.value.prices.length; x++) {
    frmData.append("costs[" + x + "]" + [x], editData.value.prices[x].cost);
  }
  for (var x = 0; x < editData.value.prices.length; x++) {
    frmData.append(
      "agent_prices[" + x + "]" + [x],
      editData.value.prices[x].agent_price
    );
  }
  try {
    const response = await vantourStore.updateAction(frmData, route.params.id);
    formData.value = {
      name: "",
      description: "",
      long_description: "",
      full_description_en: "",
      cover_image: "",
      sku_code: "",
      ticket_price: "",
      type: "car_rental",
      tag: [],
      city_id: [],
      destination: [],
      images: [],
      prices: [],
      feature_image: "",
    };
    errors.value = null;
    toast.success(response.message);
    // router.push("/products/0");
    // router.back();
    window.location.reload();
  } catch (error) {
    console.log(
      "🚀 ~ file: NewBlogView.vue:38 ~ onSubmitHandler ~ error:",
      error
    );
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

const updateEditTagData = () => {
  for (const key in editData.value.tag) {
    const tagid = editData.value.tag[key].id;
    formData.value.tag.push(tagid);
  }
  console.log(formData.value.tag, "this is tag");
};
const updateEditCityData = () => {
  for (const key in editData.value.city_id) {
    const cityid = editData.value.city_id[key].id;
    formData.value.city_id.push(cityid);
  }
  console.log(formData.value.tag, "this is city");
};
const updateEditDesData = () => {
  for (const key in editData.value.destination) {
    const destinationid = editData.value.destination[key].id;
    formData.value.destination.push(destinationid);
  }
  console.log(formData.value.destination, "this is destination");
};

const city_list_array = ref(null);
const tag_list_array = ref(null);
const dest_list_array = ref(null);

const copyText = ref(``);
const copyText_mm = ref(``);

const changeCopyText = (response) => {
  console.log(response, "this is response");

  // First, build the destinations text outside the template string
  let destinationsText = "";
  for (let i = 0; i < response.destinations.length; i++) {
    destinationsText += `${i + 2}. Drive to ${
      response.destinations[i]?.name
    }, ${response.destinations[i]?.city?.name}, Thailand .\n`;
  }

  let lastText = `${
    response.destinations.length + 2
  }. Back to customer's hotel .\n`;

  copyText.value = `Write a trip summary about this route plan:
1. Pick up customer at their hotel in ${response.cities[0]?.name}
${destinationsText}${lastText}
  
  Include total driving hours.
  
  Make sure some of the descriptions include how customers would feel while traveling with this package.
  Make sure the content is short, concise and interesting for users to read.
  Do not use bullet points or lists.
  Do not use more than 150 words but divide content to at least three paragraphs.
  Feel free to use emojis within the paragraph.
  Do not use pronouns.
  Write so that customers are willing to purchase this package.
  Include advice on how much time a customer should spend on each destination.
  Make sure the total time spent on this tour including driving hours and time spent on each destination is about 10 hours.`;
};

const changeCopyTextMM = (response) => {
  console.log(response, "this is response");

  // First, build the destinations text outside the template string
  let destinationsText = "";
  for (let i = 0; i < response.destinations.length; i++) {
    destinationsText += `${i + 2}. Drive to ${
      response.destinations[i]?.name
    }, ${response.destinations[i]?.city?.name}, Thailand .\n`;
  }

  let lastText = `${
    response.destinations.length + 2
  }. Back to customer's hotel .\n`;

  copyText_mm.value = `Write a trip summary about this route plan:
1. Pick up customer at their hotel in ${response.cities[0]?.name}
${destinationsText}${lastText}
  
  Include total driving hours.
  
  Make sure some of the descriptions include how customers would feel while traveling with this package.
  Make sure the content is short, concise and interesting for users to read.
  Do not use bullet points or lists.
  Do not use more than 150 words but divide content to at least three paragraphs.
  Feel free to use emojis within the paragraph.
  Do not use pronouns.
  Write so that customers are willing to purchase this package.
  Include advice on how much time a customer should spend on each destination.
  Make sure the total time spent on this tour including driving hours and time spent on each destination is about 10 hours.
  Please give with Burmese Language.`;
};

const copyTextAction = () => {
  navigator.clipboard.writeText(copyText.value);
  toast.success("Copied to clipboard");
};

const copyTextMMAction = () => {
  navigator.clipboard.writeText(copyText_mm.value);
  toast.success("Copied to clipboard");
};

const userInput = ref("");
const language = ref("");
const loading = ref(false);
const generateAction = (lang) => {
  if (loading.value == false) {
    loading.value = true;
    if (lang == "mm") {
      userInput.value = copyText_mm.value;
      language.value = "mm";
    } else {
      userInput.value = copyText.value;
      language.value = "en";
    }
  }
};

const generateMessage = async (message) => {
  if (message) {
    console.log(message, "this is message");

    // Split the message into paragraphs
    const paragraphs = message.split("\n").filter((p) => p.trim() !== "");

    // Function to wrap English words with <strong> tags
    const wrapEnglishWords = (text) => {
      // Regular expression to match English words (Latin alphabet)
      const englishWordRegex = /\b[A-Za-z0-9]+\b/g;
      return text.replace(englishWordRegex, "<strong>$&</strong>");
    };

    // Process each paragraph with CSS margin for spacing
    const formattedMessage = paragraphs
      .map(
        (paragraph) =>
          `<p style="margin-bottom: 1em;">${wrapEnglishWords(paragraph)}</p>`
      )
      .join("");

    if (language.value == "mm") {
      formData.value.long_description = formattedMessage;
    } else {
      formData.value.full_description_en = formattedMessage;
    }

    userInput.value = "";
    language.value = "";
    loading.value = false;
    await onSubmitHandler();
  }
};

const getDetail = async () => {
  try {
    const response = await vantourStore.getDetailAction(route.params.id);
    console.log(response, "tag");
    formData.value.id = response.result.id;
    formData.value.name = response.result.name;
    formData.value.description = response.result.description;
    formData.value.long_description = response.result.long_description;
    formData.value.full_description_en = response.result.full_description_en;
    editData.value.cover_image = response.result.cover_image;
    formData.value.sku_code = response.result.sku_code;
    formData.value.ticket_price = response.result.ticket_price;
    formData.value.type = response.result.type;
    editData.value.tag = response.result.tags;
    editData.value.city_id = response.result.cities;
    editData.value.destination = response.result.destinations;
    formData.value.images = response.result.images;
    city_list_array.value = response.result.cities;
    tag_list_array.value = response.result.tags;
    dest_list_array.value = response.result.destinations;
    console.log(response.result.tags);
    changeCopyText(response.result, "this is response");
    changeCopyTextMM(response.result, "this is response");
    // editData.value.prices = response.result.cars;
    for (const x in response.result.cars) {
      const item = {
        car: response.result.cars[x].id,
        name: response.result.cars[x].name,
        price: response.result.cars[x].price,
        cost: response.result.cars[x].cost,
        agent_price: response.result.cars[x].agent_price,
      };
      editData.value.prices.push(item);
    }
    updateEditTagData();
    updateEditCityData();
    updateEditDesData();
    console.log(formData.value.tag, "tag");
    console.log(formData.value.city_id, "tag");
    console.log(formData.value.destination, "tag");
  } catch (error) {
    console.log(error);
  }
};

const citylist = ref([]);
const taglist = ref([]);
const destlist = ref([]);
const carList = ref([]);

const actionPage = ref("");

const cityAction = ref(false);
const productAction = ref(false);
const carAction = ref(false);
const destinationAction = ref(false);

const onDeleteHandler = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await vantourStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        console.log(
          "🚀 ~ file: BlogView.vue:65 ~ onDeleteHandler ~ error:",
          error
        );
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await vantourStore.getListAction({
        search: search.value,
        type: forSale.value ? "car_rental" : "van_tour",
      });
    }
  });
};

watch(
  [cityAction, productAction, carAction, destinationAction],
  async ([cityValue, productValue, carValue, destinationValue]) => {
    if (cityValue == true) {
      await cityStore.getSimpleListAction();
      citylist.value = cities.value.data;
    }
    if (productValue == true) {
      await productStore.getSimpleListTagAction();
      taglist.value = tags?.value.data;
    }
    if (carValue == true) {
      await carStore.getSimpleListAction();
      carList.value = cars?.value.data;
    }
    if (destinationValue == true) {
      await destinationStore.getSimpleListAction();
      destlist.value = dests?.value.data;
    }
  }
);

const getSameRoute = ref(null);
const getSameRouteCount = ref([]);

const getSameRouteList = async () => {
  const res = await vantourStore.getListAction({
    destination_ids: editData.value.destination
      .map((item) => item.id)
      .join(","),
  });
  // console.log(getSameRoute.value, "this is same route");
  // Get the destination IDs from your form data for comparison
  const formDestinationIds = editData.value.destination.map((item) => item.id);

  // Filter the results to find items with matching destination IDs
  const filteredRoutes = res.result.data.filter((route) => {
    // Extract IDs from the destinations array of objects
    const routeDestinationIds = route.destinations.map((dest) => dest.id);

    // Check if the route has the same destinations as in formData
    // This checks if all form destination IDs are included in this route
    return (
      formDestinationIds.length === routeDestinationIds.length &&
      formDestinationIds.every((id) => routeDestinationIds.includes(id))
    );
  });

  // Update the getSameRoute ref with the filtered results
  getSameRoute.value = filteredRoutes;

  console.log(getSameRoute.value, "this is same route");
};

watch(getSameRoute, async (newValue) => {
  for (let i = 0; i < newValue.length; i++) {
    const res = await reservationStore.getListAction({
      hotel_name: newValue[i]?.name,
    });

    getSameRouteCount.value.push(res.result.data);
    console.log(res, "this is res");
  }
});

onMounted(async () => {
  await getDetail();
  await getSameRouteList();
});
</script>

<template>
  <Layout>
    <div class="relative">
      <!-- <p
        v-if="!loading"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-white bg-gray-800/50 z-50 w-full text-center h-full flex items-center justify-center"
      >
        Ai is generating please wait ...
      </p> -->
      <Modal :isOpen="loading" @closeModal="loading">
        <DialogPanel
          class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
        >
          <DialogTitle
            as="div"
            class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
          >
            <p>Deepseek is generating</p>
          </DialogTitle>
          <!-- show date  -->
          <div class="p-20 flex justify-center items-center space-x-4">
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
            <p class="text-sm">
              Loading may take up to 5 minutes. Please wait and do not close
              this tab.
            </p>
          </div>
        </DialogPanel>
      </Modal>
      <div class="mb-5 flex items-center justify-between">
        <h3
          class="text-2xl font-medium text-gray-600"
          v-if="actionPage == 'view'"
        >
          View VanTour
        </h3>
        <h3
          class="text-2xl font-medium text-gray-600"
          v-if="actionPage == 'edit'"
        >
          Edit VanTour
        </h3>

        <div class="flex justify-between items-center w-full">
          <div class="space-x-3 text-sm">
            Note : Type - Car Rental for Sale Part & Type - VanTour for User
            Website Show Items
          </div>
          <p
            class="px-4 py-1 rounded-lg bg-[#FF613c] text-white text-sm"
            @click="add_on_show = !add_on_show"
          >
            {{ add_on_show ? "Detail" : "+ Add on" }}
          </p>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3" v-if="!add_on_show">
        <div class="bg-white/60 col-span-2 p-6 rounded-lg shadow-sm mb-5">
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-8">
              <div class="">
                <p class="text-gray-800 text-sm mb-2">Name</p>
                <input
                  v-model="formData.name"
                  type="text"
                  id="title"
                  class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                />
                <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
                  {{ errors.name[0] }}
                </p>
              </div>
              <div class="">
                <p class="text-gray-800 text-sm mb-2">SKU code</p>
                <input
                  v-model="formData.sku_code"
                  type="text"
                  id="title"
                  class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                />
                <p v-if="errors?.sku_code" class="mt-1 text-sm text-red-600">
                  {{ errors.sku_code[0] }}
                </p>
              </div>
              <div>
                <p class="text-gray-800 text-sm mb-2">Type</p>
                <v-select
                  v-model="formData.type"
                  class="style-chooser"
                  :options="typeList ?? []"
                  label="name"
                  :clearable="false"
                  :reduce="(d) => d.value"
                  placeholder="Choose Type"
                ></v-select>
              </div>
            </div>
            <div>
              <p class="text-gray-800 text-sm mb-2">Cities</p>
              <div
                v-if="citylist.length == 0 && !cityAction"
                @click="cityAction = true"
                class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
              >
                <div class="flex justify-start items-center gap-2 flex-wrap">
                  <p
                    v-for="i in city_list_array"
                    :key="i.id"
                    class="text-xs py-1 px-2 bg-gray-100 rounded-md whitespace-nowrap"
                  >
                    {{ i.name }}
                  </p>
                </div>
                <ArrowDownTrayIcon class="w-4 h-4" />
              </div>
              <v-select
                v-if="cityAction && citylist.length != 0"
                v-model="formData.city_id"
                class="style-chooser"
                :options="citylist ?? []"
                label="name"
                multiple
                :clearable="false"
                :reduce="(city) => city.id"
                placeholder="Choose City"
              ></v-select>
            </div>
            <div>
              <p class="text-gray-800 text-sm mb-2">Tags</p>
              <!-- <v-select
                v-model="formData.tag"
                class="style-chooser"
                :options="taglist ?? []"
                label="name"
                multiple
                :clearable="false"
                :reduce="(tag) => tag.id"
                placeholder="Choose Tag"
              ></v-select> -->
              <div
                v-if="taglist.length == 0 && !productAction"
                @click="productAction = true"
                class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
              >
                <div class="flex justify-start items-center gap-2 flex-wrap">
                  <p
                    v-for="i in tag_list_array"
                    :key="i.id"
                    class="text-xs py-1 px-2 bg-gray-100 rounded-md whitespace-nowrap"
                  >
                    {{ i.name }}
                  </p>
                </div>
                <ArrowDownTrayIcon class="w-4 h-4" />
              </div>
              <v-select
                v-model="formData.tag"
                v-if="taglist.length != 0 && productAction"
                class="style-chooser"
                :options="taglist ?? []"
                label="name"
                multiple
                :clearable="false"
                :reduce="(tag) => tag.id"
                placeholder="Choose Tag"
              ></v-select>
            </div>
            <div>
              <p class="text-gray-800 text-sm mb-2">Destination</p>
              <!-- <v-select
                v-model="formData.destination"
                class="style-chooser"
                :options="destlist ?? []"
                label="name"
                multiple
                :clearable="false"
                :reduce="(dest) => dest.id"
                placeholder="Choose Destination"
              ></v-select> -->
              <div
                v-if="destlist.length == 0 && !destinationAction"
                @click="destinationAction = true"
                class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
              >
                <div class="flex justify-start items-center gap-2 flex-wrap">
                  <p
                    v-for="i in dest_list_array"
                    :key="i.id"
                    class="text-xs py-1 px-2 bg-gray-100 rounded-md whitespace-nowrap"
                  >
                    {{ i.name }}
                  </p>
                </div>
                <ArrowDownTrayIcon class="w-4 h-4" />
              </div>
              <v-select
                v-model="formData.destination"
                v-if="destlist.length != 0 && destinationAction"
                class="style-chooser"
                :options="destlist ?? []"
                label="name"
                multiple
                :clearable="false"
                :reduce="(dest) => dest.id"
                placeholder="Choose Destination"
              ></v-select>
            </div>

            <div class="">
              <p class="text-gray-800 text-sm mb-2">Ticket Price</p>
              <input
                v-model="formData.ticket_price"
                type="text"
                id="title"
                class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.ticket_price" class="mt-1 text-sm text-red-600">
                {{ errors.ticket_price[0] }}
              </p>
            </div>
            <div class="col-span-2">
              <div class="col-span-2">
                <div class="flex items-center justify-start mb-2">
                  <label class="text-sm block text-gray-600 mr-3" for="">
                    Prices</label
                  >
                </div>

                <div class="flex items-center justify-between gap-3 mb-3">
                  <div class="flex-1">
                    <!-- <v-select
                      v-model="formPrice.car"
                      class="style-chooser"
                      :options="carList ?? []"
                      label="name"
                      :clearable="false"
                      :reduce="(car) => car.id"
                      placeholder="Choose car type"
                    ></v-select> -->
                    <div
                      v-if="carList.length == 0 && !carAction"
                      @click="carAction = true"
                      class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
                    >
                      <p>car choose</p>
                      <ArrowDownTrayIcon class="w-4 h-4" />
                    </div>
                    <v-select
                      v-if="carList.length != 0 || carAction"
                      v-model="formPrice.car"
                      class="style-chooser"
                      :options="carList ?? []"
                      label="name"
                      :clearable="false"
                      :reduce="(car) => car.id"
                      placeholder="Choose car type"
                    ></v-select>
                  </div>
                  <div class="flex-1" v-if="!authStore.isAgent">
                    <input
                      v-model="formPrice.price"
                      type="text"
                      id="title"
                      class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      placeholder="enter prices"
                    />
                  </div>
                  <div class="flex-1" v-if="!authStore.isAgent">
                    <input
                      v-model="formPrice.cost"
                      type="text"
                      id="title"
                      class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      placeholder="enter costs"
                    />
                  </div>
                  <div class="flex-1">
                    <input
                      v-model="formPrice.agent_price"
                      type="text"
                      id="title"
                      class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      placeholder="enter agent prices"
                    />
                  </div>
                  <div>
                    <div>
                      <button @click.prevent="addNewPrice" class="">
                        <i
                          class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  v-for="(price, index) in editData.prices"
                  :key="index"
                  class="flex items-center justify-between gap-3 mb-3"
                >
                  <div class="flex-1">
                    <p
                      v-if="price.name"
                      class="py-2 px-2 rounded-md border border-gray-300"
                    >
                      {{ price.name }}
                    </p>
                    <v-select
                      v-if="!price?.name"
                      v-model="price.car"
                      class="style-chooser"
                      :options="carList ?? []"
                      label="name"
                      :clearable="false"
                      :reduce="(car) => car.id"
                      placeholder="Choose car type"
                    ></v-select>
                  </div>
                  <div class="flex-1" v-if="!authStore.isAgent">
                    <input
                      v-model="price.price"
                      type="text"
                      id="title"
                      class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      placeholder="enter prices"
                    />
                  </div>
                  <div class="flex-1" v-if="!authStore.isAgent">
                    <input
                      v-model="price.cost"
                      type="text"
                      id="title"
                      class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      placeholder="enter costs"
                    />
                  </div>
                  <div class="flex-1">
                    <input
                      v-model="price.agent_price"
                      type="text"
                      id="title"
                      class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      placeholder="enter agent prices"
                    />
                  </div>
                  <div>
                    <div>
                      <button
                        class="text-sm text-red-600"
                        @click.prevent="removeFromPrice(index)"
                      >
                        <i
                          class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="">
              <p class="text-gray-800 text-sm mb-2">Routes</p>
              <textarea
                v-model="formData.description"
                rows="3"
                id="title"
                class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                placeholder="place , place , place "
              />
              <p v-if="errors?.description" class="mt-1 text-sm text-red-600">
                {{ errors.description[0] }}
              </p>
            </div>
            <!-- <div class="" v-if="actionPage == 'edit'">
              <p class="text-gray-800 text-sm mb-2">Summary</p>
              <textarea
                v-model="formData.long_description"
                rows="10"
                id="title"
                class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p
                v-if="errors?.long_description"
                class="mt-1 text-sm text-red-600"
              >
                {{ errors.long_description[0] }}
              </p>
            </div> -->
            <p
              @click="copyTextAction"
              class="px-2 py-1 mr-2 bg-[#FF613c] text-xs cursor-pointer inline-block rounded-lg text-white"
            >
              Copy Text Button
            </p>
            <p
              @click="copyTextMMAction"
              class="px-2 py-1 bg-[#FF613c] text-xs cursor-pointer inline-block rounded-lg text-white mr-2"
            >
              Copy Text MM Button
            </p>

            <TestAiVue
              :userInput="userInput"
              @generateMessage="generateMessage"
            />
            <div class="">
              <div class="flex justify-between items-center mb-2">
                <p class="text-gray-800 text-sm">Summary (mm)</p>
                <p
                  @click="generateAction('mm')"
                  class="px-2 py-1 bg-[#FF613c] text-xs cursor-pointer inline-block rounded-lg text-white"
                >
                  AI Generate Action MM
                </p>
              </div>
              <div class="relative">
                <!-- <p
                  v-if="loading"
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-white bg-gray-800 w-full text-center h-full flex items-center justify-center"
                >
                  Ai is generating please wait ...
                </p> -->
                <QuillEditor
                  ref="textEditor"
                  :options="editorOptions"
                  theme="snow"
                  class="!bg-white/50 !border-1 !border-gray-300 !rounded-bl-md !rounded-br-md !shadow-sm !text-xs !text-gray-900 !h-[300px]"
                  toolbar="essential"
                  contentType="html"
                  v-model:content="formData.long_description"
                />
              </div>
            </div>

            <div class="">
              <div class="flex justify-between items-center mb-2">
                <p class="text-gray-800 text-sm">Summary (eng)</p>
                <!-- <p
                  @click="generateAction('en')"
                  class="px-2 py-1 mr-2 bg-[#FF613c] text-xs cursor-pointer inline-block rounded-lg text-white"
                >
                  AI Generate Action
                </p> -->
              </div>
              <!-- <textarea
                v-model="formData.full_description_en"
                rows="10"
                id="title"
                class="w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
              />
              <p
                v-if="errors?.full_description_en"
                class="mt-1 text-sm text-red-600"
              >
                {{ errors.full_description_en[0] }}
              </p> -->
              <QuillEditor
                ref="textEditor"
                :options="editorOptions"
                theme="snow"
                class="!bg-white/50 !border-1 !border-gray-300 !rounded-bl-md !rounded-br-md !shadow-sm !text-xs !text-gray-900 !h-[300px]"
                toolbar="essential"
                contentType="html"
                v-model:content="formData.full_description_en"
              />
            </div>
            <div class="text-end">
              <Button @click.prevent="onSubmitHandler"> Update Vantour </Button>
            </div>
          </div>
        </div>
        <div>
          <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
            <div class="flex items-center justify-between gap-3 mb-3">
              <p>Feature Image</p>
              <input
                type="file"
                ref="featureImageInput"
                class="hidden"
                @change="handlerFeatureFileChange"
                accept="image/*"
              />
              <!-- <button
                v-if="!featureImagePreview"
                @click.prevent="openFileFeaturePicker"
                class="text-sm text-blue-500"
              >
                + Upload
              </button> -->
              <button
                class="text-sm text-red-600"
                v-if="!featureImagePreview && !editData.cover_image"
                @click.prevent="openFileFeaturePicker"
              >
                <i
                  class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-green-500 rounded-full shadow text-white"
                ></i>
              </button>
              <button
                v-if="editData.cover_image"
                @click.prevent="removeFeatureSelectImage"
                class="text-sm text-red-500"
              >
                <i
                  class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
                ></i>
              </button>
              <button
                v-if="featureImagePreview"
                @click.prevent="removeFeatureSelectPreviewImage"
                class="text-sm text-red-500"
              >
                <i
                  class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
                ></i>
              </button>
            </div>

            <div v-if="featureImagePreview" class="">
              <img
                class="h-auto w-full rounded"
                :src="featureImagePreview"
                alt=""
              />
            </div>
            <div
              v-if="!featureImagePreview && !editData.cover_image"
              @click.prevent="openFileFeaturePicker"
              class="cursor-pointer w-full h-[200px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center"
            >
              <span class="text-xs"
                ><i
                  class="fa-solid fa-plus text-lg font-semibold py-3 px-5 bg-[#ff613c] rounded-full shadow text-white"
                ></i
              ></span>
            </div>
            <div
              v-if="!featureImagePreview && editData.cover_image"
              class="p-2 bg-white rounded-md shadow"
            >
              <img :src="editData.cover_image" alt="" class="w-full" />
            </div>
            <p v-if="errors?.image" class="mt-1 text-sm text-red-600">
              {{ errors.image[0] }}
            </p>
          </div>
          <p class="pb-3">Same Route List</p>
          <div v-for="(a, index) in getSameRoute" :key="a.id" class="mb-3">
            <div
              class="space-y-2 p-4 rounded-lg"
              :class="a.id == formData.id ? 'bg-[#FF613c]/30' : 'bg-white'"
            >
              <img
                :src="
                  a.cover_image ? a.cover_image : 'https://placehold.co/400'
                "
                alt=""
                class="w-full h-40 object-cover rounded-lg"
              />
              <p class="text-sm font-medium">{{ a.name }}, {{ a.sku_code }}</p>
              <p v-for="d in a.destinations" :key="d.id" class="text-[10px]">
                <span
                  class="w-2 h-2 bg-gray-600 inline-block rounded-full mr-2"
                ></span
                >{{ d.name }}
              </p>
              <div
                class="flex items-center justify-between text-sm font-semibold"
              >
                <p>reservation</p>
                <p>{{ getSameRouteCount[index]?.length }}</p>
              </div>
              <p
                class="text-[10px]"
                v-for="r in getSameRouteCount[index] ?? []"
                :key="r"
              >
                <span
                  class="w-2 h-2 bg-gray-600 inline-block rounded-full mr-2"
                ></span>
                {{ r.crm_id }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="add_on_show">
        <AddonPage :id="formData.id" :type="'private_van_tour'" />
      </div>
    </div>
  </Layout>
</template>

<style>
.style-chooser .vs__dropdown-toggle {
  border: 1px solid #d1d5db;
  padding: 10px 5px;
  border-radius: 8px;
}

.style-chooser .vs__dropdown-menu .vs__dropdown-option--highlight {
  background: #2563eb;
}

.style-chooser .vs__dropdown-menu .vs__dropdown-option {
  padding: 10px 18px;
}

.style-chooser .vs__dropdown-toggle .vs__selected-options .vs__selected {
  padding: 4px 10px;
  border: none;
}
</style>
