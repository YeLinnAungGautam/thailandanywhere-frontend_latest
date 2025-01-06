<script setup>
import { ref, defineProps, onMounted, watch, nextTick } from "vue";
import { CheckCircleIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";
import { storeToRefs } from "pinia";
import { useCityStore } from "../../stores/city";
import PreviewPageVue from "./PreviewPage.vue";
import { useDestinationStore } from "../../stores/destination";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const cityStore = useCityStore();
const { cities } = storeToRefs(cityStore);
const destinationStore = useDestinationStore();
const { dests } = storeToRefs(destinationStore);

const session = ref(1);
const finish = ref({
  session1: true,
});
const openDayDetail = ref(1);

const props = defineProps({
  formData: Object,
});

const detailOpen = ref(false);

const hasData = (data) => {
  if (data.title != "" && data.cities.length > 0 && data.summary != "") {
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

const imagesInput = ref(null);
const imagesPreview = ref([]);

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

const handlerImagesFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      props.formData.images.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  props.formData.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
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
onMounted(async () => {
  nextTick(() => {
    // Ensure DOM updates and prop values are resolved
    setupDetailsWatcher();
  });
  await cityStore.getSimpleListAction();
  await destinationStore.getSimpleListAction();
});
</script>
<template>
  <div class="grid grid-cols-3 gap-6">
    <div class="col-span-2 space-y-3 pt-3">
      <div class="border border-gray-300 p-3 rounded-2xl">
        <div
          class="flex justify-between items-center"
          @click="detailOpen = !detailOpen"
        >
          <div
            class="flex justify-start items-center gap-4 cursor-pointer"
            :class="session == 1 ? '' : 'opacity-40'"
          >
            <CheckCircleIcon
              class="text-green-500 w-6 h-6"
              v-if="formData.description != null"
            />
            <div
              v-if="formData.description == null"
              class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
            >
              <p class="pb-9 text-red-500 text-6xl">.</p>
            </div>
            <p class="text-sm">General detail's Cover Image</p>
          </div>
          <ChevronRightIcon class="w-4 h-4" />
        </div>
        <div
          class="col-span-2 gap-x-2 flex justify-start items-center"
          v-if="detailOpen"
        >
          <div class="space-y-2">
            <input
              type="file"
              name=""
              class="text-xs flex justify-center items-center w-full h-[70px] border-dashed border border-gray-200 rounded-2xl text-gray-400 cursor-pointer p-6"
              @change="handlerImagesFileChange"
              multiple
              id=""
            />
          </div>
          <div class="space-y-2 pt-2">
            <p
              v-if="imagesPreview.length == 0 && formData.images.length == 0"
              class="text-xs flex justify-center items-center w-[70px] h-[70px] border-dashed border border-gray-200 rounded-2xl text-gray-400 cursor-pointer"
            >
              preview
            </p>
            <div class="flex justify-start items-center gap-x-2">
              <div
                v-for="(imagePreview, index) in imagesPreview &&
                formData.images"
                :key="imagePreview"
                class="w-full h-auto relative"
              >
                <img
                  :src="imagePreview"
                  alt="Image preview"
                  class="w-auto h-[99px] rounded"
                />
                <span
                  class="text-xs absolute top-0 right-0 cursor-pointer"
                  @click="removeImageSelectImage(index)"
                  ><i
                    class="fa-solid fa-minus text-sm font-semibold py-1 px-2 bg-[#ff613c] rounded-full shadow text-white"
                  ></i
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
          <label for="" class="text-[12px] text-gray-500">Upload Image</label>

          <input
            type="file"
            name=""
            class="text-xs flex justify-center items-center w-full h-[70px] border-dashed border border-gray-200 rounded-2xl text-gray-400 cursor-pointer p-6"
            @change="handlerImageDFileChange"
            id=""
          />
        </div>
        <div v-if="i.day_name == openDayDetail" class="space-y-2">
          <label for="" class="text-[12px] text-gray-500">.</label>
          <p
            v-if="i.image_url == null || i.image_url == ''"
            class="text-xs flex justify-center items-center w-[70px] h-[70px] border-dashed border border-gray-200 rounded-2xl text-gray-400 cursor-pointer"
          >
            preview
          </p>
          <div v-if="i.image_url" class="w-full h-auto relative">
            <img
              :src="i.image_url"
              alt="Image preview"
              class="w-auto h-[99px] rounded"
            />
            <span
              class="text-xs absolute top-0 right-0 cursor-pointer"
              @click="removeSelectedImage"
              ><i
                class="fa-solid fa-minus text-sm font-semibold py-1 px-2 bg-[#ff613c] rounded-full shadow text-white"
              ></i
            ></span>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-4">
      <div
        class="w-full h-[500px] bg-gray-300 rounded-lg flex justify-center items-center"
      >
        <p class="text-gray-500">preview</p>
      </div>
    </div>
  </div>
</template>
