<template>
  <div
    class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm"
  >
    <!-- Header -->
    <div class="px-6 pt-5 bg-white">
      <h3 class="text-lg font-semibold flex items-center gap-2 text-gray-800">
        <!-- <span>{{ icon }}</span> -->
        <span>{{ title }}</span>
      </h3>
    </div>

    <!-- Fields List -->
    <div class="p-6">
      <div class="space-y-6">
        <div v-for="field in fields" :key="field.key" class="space-y-2">
          <!-- Field Label with Checkbox -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-3 cursor-pointer group">
              <input
                v-if="
                  field.extracted !== null &&
                  field.extracted !== undefined &&
                  field.extracted !== ''
                "
                type="checkbox"
                :checked="modelValue[field.key]"
                @change="updateField(field.key, $event.target.checked)"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-gray-800">{{
                  field.label
                }}</span>
                <span
                  v-if="hasChanged(field.extracted, field.current)"
                  class="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded font-semibold"
                >
                  Changed
                </span>
              </div>
            </label>

            <!-- Status Badge -->
            <div
              v-if="
                field.extracted !== null &&
                field.extracted !== undefined &&
                field.extracted !== ''
              "
            >
              <span
                v-if="!hasChanged(field.extracted, field.current)"
                class="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full font-semibold flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Same
              </span>
              <span
                v-else
                class="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-semibold flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm1 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                  />
                </svg>
                Change
              </span>
            </div>
          </div>

          <!-- Comparison Row -->
          <div class="grid grid-cols-12 gap-4 items-start">
            <!-- Current Value (Left Side - Smaller) -->
            <div class="col-span-4">
              <div
                class="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 min-h-[40px]"
              >
                <template v-if="field.type === 'textarea'">
                  <p
                    class="text-sm text-gray-600 whitespace-pre-wrap break-words"
                  >
                    {{ field.current || "-" }}
                  </p>
                </template>
                <template v-else-if="field.type === 'array'">
                  <p class="text-sm text-gray-600 break-words">
                    {{ field.current || "-" }}
                  </p>
                </template>
                <template v-else>
                  <p class="text-sm text-gray-600 break-words">
                    {{ field.current || "-" }}
                  </p>
                </template>
              </div>
            </div>

            <!-- Arrow Icon -->
            <div class="col-span-1 flex items-center justify-center pt-4">
              <svg
                class="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>

            <!-- New Value (Right Side - Larger, Editable) -->
            <div class="col-span-7">
              <div
                v-if="
                  field.extracted !== null &&
                  field.extracted !== undefined &&
                  field.extracted !== ''
                "
              >
                <!-- Textarea for long text -->
                <template v-if="field.type === 'textarea'">
                  <textarea
                    :value="editableValues[field.key] ?? field.extracted"
                    @input="updateEditableValue(field.key, $event.target.value)"
                    rows="4"
                    class="w-full text-sm border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                    :class="{
                      'border-orange-400 bg-white': modelValue[field.key],
                      'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed':
                        !modelValue[field.key],
                    }"
                    :disabled="!modelValue[field.key]"
                  ></textarea>
                </template>

                <!-- Array (comma-separated emails) -->
                <template v-else-if="field.type === 'array'">
                  <textarea
                    :value="editableValues[field.key] ?? field.extracted"
                    @input="updateEditableValue(field.key, $event.target.value)"
                    rows="2"
                    class="w-full text-sm border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                    :class="{
                      'border-orange-400 bg-white': modelValue[field.key],
                      'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed':
                        !modelValue[field.key],
                    }"
                    :disabled="!modelValue[field.key]"
                    placeholder="email1@example.com, email2@example.com"
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-1 ml-1">
                    Separate emails with commas
                  </p>
                </template>

                <!-- Regular input -->
                <template v-else>
                  <input
                    type="text"
                    :value="editableValues[field.key] ?? field.extracted"
                    @input="updateEditableValue(field.key, $event.target.value)"
                    class="w-full text-sm border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    :class="{
                      'border-orange-400 bg-white': modelValue[field.key],
                      'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed':
                        !modelValue[field.key],
                    }"
                    :disabled="!modelValue[field.key]"
                  />
                </template>
              </div>
              <div
                v-else
                class="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[60px] flex items-center"
              >
                <p class="text-sm text-gray-400 italic">No data extracted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  title: String,
  icon: String,
  fields: Array,
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue", "update:editableValues"]);

// Store editable values separately
const editableValues = ref({});

const hasChanged = (newValue, oldValue) => {
  if (newValue === null || newValue === undefined || newValue === "")
    return false;
  if (oldValue === null || oldValue === undefined || oldValue === "")
    return true;
  return JSON.stringify(newValue) !== JSON.stringify(oldValue);
};

const updateField = (key, value) => {
  const updated = { ...props.modelValue };
  updated[key] = value;
  emit("update:modelValue", updated);
};

const updateEditableValue = (key, value) => {
  editableValues.value[key] = value;
  emit("update:editableValues", { key, value });
};

// Initialize editable values when fields change
watch(
  () => props.fields,
  (newFields) => {
    newFields.forEach((field) => {
      if (field.extracted && !editableValues.value[field.key]) {
        editableValues.value[field.key] = field.extracted;
      }
    });
  },
  { immediate: true },
);
</script>
