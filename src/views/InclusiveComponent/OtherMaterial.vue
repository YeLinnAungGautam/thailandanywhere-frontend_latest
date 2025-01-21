<script setup>
import { ChevronRightIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps } from "vue";

const session = ref(1);
const finish = ref({
  session1: false,
});

const part = ref(false);

const props = defineProps({
  formData: Object,
  editImage: String,
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

const handlerImageFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    props.formData.cover_image = selectedFile;
    console.log("====================================");
    console.log(props.formData.cover_image);
    console.log("====================================");
  }
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
            <p class="text-sm">Product Itineary Material</p>
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
            <p class="text-sm">Cost Related Material</p>
          </div>
          <ChevronRightIcon class="w-4 h-4" />
        </div>

        <div class="space-y-2">
          <label for="" class="text-[12px] text-gray-500">Upload Image</label>
          <input
            type="file"
            name=""
            class="text-xs flex justify-center items-center w-full h-[70px] border-dashed border border-gray-200 rounded-2xl text-gray-400 cursor-pointer p-6"
            @change="handlerImageFileChange"
            id=""
          />
        </div>
        <div class="space-y-2">
          <label for="" class="text-[12px] text-gray-500">Upload PDFs</label>
          <p
            class="text-sm flex justify-center items-center w-full h-[70px] border-dashed border border-gray-200 rounded-2xl text-gray-400 cursor-pointer"
          >
            <a
              :href="editImage"
              target="_blink"
              class="cursor-pointer text-indigo-600"
              >Click to see pdf and download</a
            >
          </p>
        </div>
        <div class="space-y-2 col-span-3">
          <label for="" class="text-[12px] text-gray-500">Preview PDF</label>
          <p
            class="text-2xl flex justify-center items-center w-full h-[500px] border-dashed bg-gray-100 border border-gray-200 rounded-2xl text-gray-400 cursor-pointer"
          >
            PDF Preview
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
