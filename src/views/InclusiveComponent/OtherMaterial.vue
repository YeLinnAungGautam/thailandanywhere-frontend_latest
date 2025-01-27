<script setup>
import { ChevronRightIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps } from "vue";
import { useInclusiveStore } from "../../stores/inclusion";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import router from "../../router";

const session = ref(1);
const inclusiveStore = useInclusiveStore();
const route = useRoute();
const toast = useToast();
const finish = ref({
  session1: false,
});

const part = ref(false);

const props = defineProps({
  formData: Object,
  editImage: Object,
});

const otherMaterial = ref({
  link: "",
});

const addOtherMaterial = () => {
  props.formData.other_materials.push(otherMaterial.value);
  console.log("====================================");
  console.log(props.formData.other_materials, "this is other material");
  console.log("====================================");
  otherMaterial.value = {
    link: "",
  };
};

const removeOtherMaterial = (index) => {
  props.formData.other_materials.splice(index, 1);
};

// const handlerImageFileChange = (e) => {
//   let selectedFile = e.target.files[0];
//   if (selectedFile) {
//     props.formData.cover_image = selectedFile;
//     console.log("====================================");
//     console.log(props.formData.cover_image);
//     console.log("====================================");
//   }
// };

const removeAction = async (id, index) => {
  const res = await inclusiveStore.deletePDFAction(route.params.id, id);
  props.editImage.pdfs.splice(index, 1);
  // console.log("====================================", id, route.params.id);
  toast.success("PDF deleted successfully");
};

const imagesPreview = ref([]);
const pdfImages = ref([]);

const handlerImageFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      pdfImages.value.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
      console.log(imagesPreview.value, "this is the new image");
    }
  }
};

const loading = ref(false);

const savePDFHandler = async () => {
  try {
    loading.value = true;
    const frmData = new FormData();
    if (pdfImages.value.length > 0) {
      for (let index = 0; index < pdfImages.value.length; index++) {
        frmData.append("pdfs[" + index + "]", pdfImages.value[index]);
      }
    }
    const res = await inclusiveStore.storePDFAction(route.params.id, frmData);
    toast.success("PDF uploaded successfully");
    loading.value = false;
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    toast.error("Failed to upload PDF");
  } finally {
    loading.value = false;
  }
};

const removeImage = (index) => {
  pdfImages.value.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};
</script>
<template>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-2 space-y-3 pt-3">
      <div class="border border-gray-300 p-3 rounded-2xl">
        <div class="flex justify-between items-center" @click="part = !part">
          <div
            class="flex justify-start items-center gap-4 cursor-pointer"
            :class="session == 1 ? '' : 'opacity-40'"
          >
            <CheckCircleIcon
              class="text-green-500 w-6 h-6"
              v-if="finish.session1"
            />
            <div
              v-if="!finish.session1"
              class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
            >
              <p class="pb-9 text-red-500 text-6xl">.</p>
            </div>
            <!-- <p class="text-sm">Product Itineary Material</p> -->
            <p class="text-sm">Cost Related Material</p>
          </div>
          <ChevronRightIcon class="w-4 h-4" />
        </div>
        <div v-if="part == true" class="pt-2 space-y-2">
          <div class="space-y-2">
            <label for="" class="text-[12px] text-gray-500"
              >Docs File Link</label
            >
            <div class="flex justify-start items-center gap-x-2">
              <input
                type="text"
                v-model="otherMaterial.link"
                name=""
                placeholder="Enter link or Paste link"
                class="text-sm flex justify-center items-center w-full border border-gray-200 rounded-2xl text-gray-600 cursor-pointer px-4 py-3 focus:outline-none"
              />
              <p
                @click="addOtherMaterial"
                class="text-xs bg-green-500 cursor-pointer whitespace-nowrap text-white border border-gray-200 rounded-2xl px-5 py-3"
              >
                +
              </p>
            </div>
          </div>
          <div
            class="space-y-2"
            v-for="(a, index) in formData.other_materials"
            :key="index"
          >
            <div class="flex justify-start items-center gap-x-2">
              <input
                type="text"
                v-model="a.link"
                name=""
                placeholder="Enter link or Paste link"
                class="text-sm flex justify-center items-center w-full border border-gray-200 rounded-2xl text-gray-600 cursor-pointer px-4 py-3 focus:outline-none"
              />
              <p
                @click="removeOtherMaterial(index)"
                class="text-xs bg-red-500 cursor-pointer whitespace-nowrap text-white border border-gray-200 rounded-2xl px-5 py-3"
              >
                -
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="grid grid-cols-3 gap-4 pt-2 border border-gray-300 p-4 rounded-2xl"
      >
        <div
          class="rounded-2xl col-span-3 py-2 flex justify-between items-center"
        >
          <div
            class="flex justify-start items-center gap-4 cursor-pointer"
            :class="session == 1 ? '' : 'opacity-40'"
          >
            <CheckCircleIcon
              class="text-green-500 w-6 h-6"
              v-if="finish.session1"
            />
            <div
              v-if="!finish.session1"
              class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
            >
              <p class="pb-9 text-red-500 text-6xl">.</p>
            </div>
            <p class="text-sm">Product Itineary Material</p>
          </div>
          <p
            @click="savePDFHandler"
            class="text-xs font-medium bg-[#ff613c] text-white cursor-pointer px-4 py-1.5 rounded-lg"
          >
            save
          </p>
        </div>

        <div class="space-y-2">
          <label for="" class="text-[12px] text-gray-500">Upload Image</label>
          <input
            type="file"
            name=""
            class="text-xs flex justify-center items-center w-full h-[70px] border-dashed border border-gray-200 rounded-2xl text-gray-400 cursor-pointer p-6"
            @change="handlerImageFileChange"
            accept="image/*, application/pdf"
            multiple
            id=""
          />
        </div>
        <div class="space-y-2 col-span-2">
          <label for="" class="text-[12px] text-gray-500">Upload PDFs</label>
          <div
            class="text-sm px-6 w-full min-h-[70px] space-y-4 pt-2 my-auto border-dashed border border-gray-200 rounded-2xl text-gray-400 cursor-pointer"
          >
            <div
              class="cursor-pointer flex justify-between items-center w-full text-indigo-600"
              v-for="(a, index) in editImage?.pdfs?.length > 0
                ? editImage?.pdfs
                : []"
              :key="a"
            >
              <p class="text-gray-400">
                <span class="mr-3 bg-[#ff613c] text-white rounded-full px-2">{{
                  a.id
                }}</span
                >Click to see pdf
              </p>
              <a :href="a.download_link" target="_blink" class="text-gray-400"
                >Download</a
              >
              <p
                class="text-red-600 underline"
                @click="removeAction(a.id, index)"
              >
                Delete
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
