<script setup>
import { ref, defineProps, onMounted, watch, nextTick } from "vue";
import { CheckCircleIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";
import { storeToRefs } from "pinia";
import { useCityStore } from "../../stores/city";
import PreviewPageVue from "./PreviewPage.vue";
import { useDestinationStore } from "../../stores/destination";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useRestaurantStore } from "../../stores/restaurant";

const cityStore = useCityStore();
const { cities } = storeToRefs(cityStore);
const destinationStore = useDestinationStore();
const { dests } = storeToRefs(destinationStore);
const restaurantStore = useRestaurantStore();
const { restaurant } = storeToRefs(restaurantStore);

const session = ref(1);
const finish = ref({
  session1: true,
});
const openDayDetail = ref(1);

const props = defineProps({
  formData: Object,
});

const hasData = (data) => {
  if (
    data.title != "" &&
    data.cities.length > 0 &&
    data.destinations.length > 0
  ) {
    return true;
  }
  return false;
};

const hasDestination = (destination) => {
  if (destination.length > 0) {
    return true;
  }
  return false;
};

// const addDetail = () => {
//   detailItem.value.day_name = openDayDetail.value;
//   props.formData.details.push(detailItem.value);
//   clearAction();
// };

const editorOptions = {
  placeholder: "Write an awesome summary here ...",
};

const imagePreview = ref(null);
const imageInput = ref(null);
const openFileImageDPicker = () => {
  imageInput.value.click();
};
const handlerImageDFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    props.formData.details[openDayDetail.value - 1].image = selectedFile;
    props.formData.details[openDayDetail.value - 1].image_url =
      URL.createObjectURL(selectedFile);
    console.log(props.formData.details);
  }
};

const removeSelectedImage = () => {
  props.formData.details[openDayDetail.value - 1].image = null;
  props.formData.details[openDayDetail.value - 1].image_url = null;
  console.log(
    props.formData.details[openDayDetail.value - 1].image,
    props.formData.details[openDayDetail.value - 1].image_url
  );
};

const addDetails = () => {
  if (!props.formData.details || !Array.isArray(props.formData.details)) {
    // Initialize details as an empty array if it's not an array or undefined
    props.formData.details = [];
  }

  // Example: Add items based on day count
  for (let i = 0; i < props.formData.day; i++) {
    props.formData.details.push({
      day_name: i + 1,
      title: "",
      image: null,
      image_url: "",
      summary: "",
      summary_mm: "",
      meals: "",
      cities: [],
      destinations: [],
      restaurants: [],
    });
  }
};

const addNewDetails = () => {
  if (!props.formData.details || !Array.isArray(props.formData.details)) {
    // Initialize details as an empty array if it's undefined or not an array
    props.formData.details = [];
  }

  const existingCount = props.formData.details.length;
  const targetCount = props.formData.day;

  // Add missing entries
  if (existingCount < targetCount) {
    const itemsToAdd = targetCount - existingCount;
    for (let i = 0; i < itemsToAdd; i++) {
      props.formData.details.push({
        day_name: existingCount + i + 1,
        title: "",
        image: null,
        image_url: "",
        summary: "",
        summary_mm: "",
        meals: "",
        cities: [],
        destinations: [],
        restaurants: [],
      });
    }
  } else {
    props.formData.details.splice(targetCount);
  }
};

// Function to set up the watcher after verifying props.formData.details
const setupDetailsWatcher = () => {
  watch(
    () => props.formData.details,
    (newDetails) => {
      if (!newDetails || newDetails.length === 0) {
        // Add default details if array is empty
        addDetails();
      } else {
        // Add missing details if array is not empty
        addNewDetails();
      }
    },
    { immediate: true } // Run immediately on component load
  );
};

// Check for `details` on component mount

// Sample data - you can replace this with your own data
const items = ref([
  { id: "001", name: "Item One", type: "Attraction" },
  { id: "002", name: "Item Two", type: "Destination" },
  { id: "003", name: "Item Three", type: "Attraction" },
  { id: "004", name: "Item Four", type: "Lunch" },
  { id: "005", name: "Item Five", type: "Destination" },
  { id: "006", name: "Item Six", type: "Attraction" },
  { id: "007", name: "Item Seven", type: "Destination" },
  { id: "008", name: "Item Eight", type: "Attraction" },
  { id: "009", name: "Item Nine", type: "Lunch" },
  { id: "010", name: "Item Ten", type: "Destination" },
]);

// Track the currently dragged item
const draggedItem = ref(null);

// Start drag operation
const startDrag = (event, index) => {
  // Set the data being dragged
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.setData("itemIndex", index);

  // Set which item is being dragged
  draggedItem.value = index;

  // Add a slight delay for better visual feedback
  setTimeout(() => {
    event.target.classList.add("opacity-50");
  }, 0);
};

// Handle dragenter event
const onDragEnter = (event, index) => {
  // Only react if we're dragging onto a different item
  if (draggedItem.value !== index) {
    event.currentTarget.classList.add("border-t-2", "border-blue-400");
  }
};

// Handle dragleave event
const onDragLeave = (event) => {
  event.currentTarget.classList.remove("border-t-2", "border-blue-400");
};

// Handle drop event
const onDrop = (event, dropIndex) => {
  event.currentTarget.classList.remove("border-t-2", "border-blue-400");
  const dragIndex = event.dataTransfer.getData("itemIndex");

  // Move item from dragIndex to dropIndex
  if (dragIndex !== dropIndex) {
    moveItem(parseInt(dragIndex), dropIndex);
  }

  // Reset opacity on dragged element
  event.target.classList.remove("opacity-50");
};

// Function to move an item from one position to another
const moveItem = (fromIndex, toIndex) => {
  if (toIndex < 0 || toIndex >= items.value.length) return;

  // Remove the item from its current position
  const itemToMove = items.value.splice(fromIndex, 1)[0];

  // Insert the item at the new position
  items.value.splice(toIndex, 0, itemToMove);
};

onMounted(async () => {
  nextTick(() => {
    // Ensure DOM updates and prop values are resolved
    setupDetailsWatcher();
  });
  await cityStore.getSimpleListAction();
  await destinationStore.getSimpleListAction();
  await restaurantStore.getSimpleListAction();
});
</script>
<template>
  <div class="grid grid-cols-3 gap-6">
    <div class="col-span-2 space-y-3 pt-3">
      <div
        v-for="i in formData.details"
        :key="i"
        @click="openDayDetail = i.day_name"
        class="grid grid-cols-2 border border-gray-300 rounded-2xl gap-4 px-4 py-2"
      >
        <div
          class="rounded-2xl col-span-2 py-2 flex justify-between items-center"
        >
          <div class="flex justify-start items-center gap-4 cursor-pointer">
            <CheckCircleIcon class="text-green-500 w-6 h-6" v-if="hasData(i)" />
            <div
              v-if="!hasData(i)"
              class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
            >
              <p class="pb-9 text-red-500 text-6xl">.</p>
            </div>
            <p class="text-sm">
              Day {{ i?.day_name }} :
              {{ i?.title ? i?.title : "Missing title" }}
            </p>
          </div>
          <ChevronRightIcon class="w-4 h-4" />
        </div>

        <div v-if="i.day_name == openDayDetail" class="space-y-2">
          <label for="" class="text-[12px] text-gray-500">Title Name * </label>
          <input
            type="text"
            v-model="i.title"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
          />
        </div>
        <div v-if="i.day_name == openDayDetail" class="space-y-2">
          <label for="" class="text-[12px] text-gray-500">cities *</label>
          <v-select
            v-model="i.cities"
            v-if="cities?.data"
            class="style-chooser"
            :options="cities?.data ?? []"
            label="name"
            multiple
            :clearable="false"
            :reduce="(c) => c.id"
            placeholder="..."
          ></v-select>
        </div>

        <div v-if="i.day_name == openDayDetail" class="space-y-2 pb-2">
          <label for="" class="text-[12px] text-gray-500"
            >Destination List *</label
          >
          <v-select
            v-model="i.destinations"
            v-if="dests?.data"
            class="style-chooser"
            :options="dests?.data ?? []"
            label="name"
            multiple
            :clearable="false"
            :reduce="(c) => c.id"
            placeholder="..."
          ></v-select>
        </div>
        <div v-if="i.day_name == openDayDetail" class="space-y-2 pb-2">
          <label for="" class="text-[12px] text-gray-500"
            >Restaurant List *</label
          >
          <v-select
            v-model="i.restaurants"
            v-if="restaurant?.data"
            class="style-chooser"
            :options="restaurant?.data ?? []"
            label="name"
            multiple
            :clearable="false"
            :reduce="(c) => c.id"
            placeholder="..."
          ></v-select>
        </div>
        <div v-if="i.day_name == openDayDetail" class="space-y-2">
          <label for="" class="text-[12px] text-gray-500">Meals </label>

          <QuillEditor
            ref="textEditor"
            :options="editorOptions"
            theme="snow"
            class="!bg-white/50 !border-1 !border-gray-200 !rounded-bl-md !rounded-br-md !shadow-sm !text-sm !text-gray-900 !h-[200px]"
            toolbar="essential"
            contentType="html"
            v-model:content="i.meals"
          />
        </div>
      </div>
    </div>
    <div class="pt-3">
      <div
        class="w-full max-h-[800px] overflow-y-scroll p-4 bg-white border border-gray-300 rounded-2xl"
      >
        <div class="max-w-4xl mx-auto">
          <h2 class="font-medium mb-4">Sequence: Day 1</h2>

          <!-- List Header -->
          <div
            class="grid grid-cols-4 gap-2 border-b border-gray-200 pb-2 font-semibold"
          >
            <div class="px-2 py-2 text-xs">Index</div>
            <div class="px-2 py-2 text-xs">ID</div>
            <div class="px-2 py-2 text-xs">Name</div>
            <div class="px-2 py-2 text-xs">Type</div>
          </div>

          <!-- List Items -->
          <div class="divide-y divide-gray-100">
            <div
              v-for="(item, index) in items"
              :key="item.id"
              class="grid grid-cols-4 gap-2 cursor-move"
              :class="{
                'bg-blue-50': draggedItem === index,
                'hover:bg-gray-50': draggedItem !== index,
              }"
              draggable="true"
              @dragstart="startDrag($event, index)"
              @dragover.prevent
              @dragenter.prevent="onDragEnter($event, index)"
              @dragleave.prevent="onDragLeave($event)"
              @drop.prevent="onDrop($event, index)"
              @dragend="draggedItem = null"
            >
              <div class="px-2 py-3 flex items-center text-xs">
                {{ index + 1 }}
              </div>
              <div class="px-2 py-3 flex items-center text-xs">
                {{ item.id }}
              </div>
              <div class="px-2 py-3 flex items-center text-xs">
                {{ item.name }}
              </div>
              <div class="px-2 py-3 flex items-center text-xs">
                {{ item.type }}
              </div>
            </div>
          </div>

          <!-- Instruction -->
          <div class="mt-4 text-sm text-gray-500">
            Drag and drop items to reorder them
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
