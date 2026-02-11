<template>
  <div class="space-y-6">
    <div class="grid grid-cols-2 gap-8">
      <div
        class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
      >
        <h4
          class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
        >
          Description (Myanmar)
        </h4>
        <div class="space-y-4">
          <div class="space-y-2">
            <AiDescriptionEditor
              v-model="currentData.full_description"
              label="Full description (mm)"
              language="mm"
              :product-data="currentData"
              :product-type="'hotel'"
              :show-ai-button="true"
              placeholder="Enter Myanmar description..."
              hint="AI can generate a professional description based on your hotel information"
            />
          </div>
        </div>
      </div>

      <div
        class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30"
      >
        <h4
          class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200"
        >
          Description (English)
        </h4>
        <div class="space-y-4">
          <div class="space-y-2">
            <AiDescriptionEditor
              v-model="currentData.full_description_en"
              label="Full description (en)"
              language="en"
              :product-data="currentData"
              :product-type="'hotel'"
              :show-ai-button="true"
              placeholder="Enter English description..."
              hint="AI can generate a professional description based on your hotel information"
            />
          </div>
        </div>
      </div>
    </div>
    <h4 class="text-lg font-semibold text-gray-800 border-gray-200">
      Hotel Images
    </h4>
    <div class="p-6 bg-gray-100 rounded-xl">
      <div class="grid grid-cols-2 gap-3 h-full">
        <template v-if="editImagesPreview.length > 0">
          <div class="relative group row-span-2">
            <template v-if="editImagesPreview[0]">
              <img
                :src="editImagesPreview[0].image"
                alt="Hotel image"
                class="w-full h-[300px] bg-gray-50 object-cover rounded-md"
              />
            </template>
          </div>
          <!-- smaller images -->
          <div class="grid grid-cols-2 gap-2">
            <template v-for="index in 4">
              <div
                v-if="editImagesPreview[index]"
                :key="`image-${index}`"
                class="relative group"
              >
                <template v-if="editImagesPreview[index]">
                  <img
                    :src="editImagesPreview[index].image"
                    alt="Hotel image"
                    class="w-full h-[145px] bg-gray-50 object-cover rounded-md"
                  />
                </template>
              </div>
              <div
                v-else
                :key="`empty-${index}`"
                class="w-full h-[94px] bg-gray-50 rounded-md flex items-center justify-center"
              >
                <span class="text-xs text-gray-400">No image</span>
              </div>
            </template>
          </div>
        </template>

        <template v-else>
          <div
            class="row-span-2 bg-gray-50 rounded-md flex items-center justify-center"
          >
            <span class="text-gray-400 text-sm">No images</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="i in 4"
              :key="i"
              class="bg-gray-50 rounded-md h-[94px] flex items-center justify-center"
            >
              <span class="text-xs text-gray-400">No image</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AiDescriptionEditor from "../../views/GenerateAI/DescriptionAi.vue";

const props = defineProps({
  currentData: Object,
  editImagesPreview: Array,
});
</script>
