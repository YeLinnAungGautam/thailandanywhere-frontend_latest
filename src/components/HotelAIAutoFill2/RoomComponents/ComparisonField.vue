<template>
  <div
    class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm"
  >
    <!-- Header -->
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h3 class="text-base font-bold flex items-center gap-2 text-gray-800">
        <span>{{ icon }}</span>
        <span>{{ title }}</span>
      </h3>
    </div>

    <!-- Fields List -->
    <div class="p-6">
      <div class="space-y-4">
        <div
          v-for="field in fields"
          :key="field.key"
          class="grid grid-cols-12 gap-4 items-center"
        >
          <!-- Checkbox + Label + Status (3 columns) -->
          <div class="col-span-3 flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                v-if="
                  field.extracted !== null &&
                  field.extracted !== undefined &&
                  field.extracted !== ''
                "
                type="checkbox"
                :checked="modelValue[field.key]"
                @change="updateField(field.key, $event.target.checked)"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
              />
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-sm font-semibold text-gray-800 truncate">{{
                  field.label
                }}</span>
                <span
                  v-if="hasChanged(field.extracted, field.current)"
                  class="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded font-semibold flex-shrink-0"
                >
                  Changed
                </span>
              </div>
            </label>
          </div>

          <!-- Current Value (3 columns) -->
          <div class="col-span-3">
            <div
              class="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 min-h-[42px] flex items-center"
            >
              <template v-if="field.type === 'textarea'">
                <p
                  class="text-sm text-gray-600 line-clamp-2 break-words w-full"
                >
                  {{ field.current || "-" }}
                </p>
              </template>
              <template v-else-if="field.type === 'array'">
                <p class="text-sm text-gray-600 truncate w-full">
                  {{ field.current || "-" }}
                </p>
              </template>
              <template v-else>
                <p class="text-sm text-gray-600 truncate w-full">
                  {{ field.current || "-" }}
                </p>
              </template>
            </div>
          </div>

          <!-- Arrow (0.5 columns) -->
          <div class="col-span-1 flex items-center justify-center">
            <svg
              class="w-5 h-5 text-gray-400"
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

          <!-- New Value Editable (4.5 columns) -->
          <div class="col-span-4 relative">
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
                  rows="2"
                  class="w-full text-sm border-2 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
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
                <input
                  type="text"
                  :value="editableValues[field.key] ?? field.extracted"
                  @input="updateEditableValue(field.key, $event.target.value)"
                  class="w-full text-sm border-2 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  :class="{
                    'border-orange-400 bg-white': modelValue[field.key],
                    'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed':
                      !modelValue[field.key],
                  }"
                  :disabled="!modelValue[field.key]"
                  placeholder="email1@example.com, email2@example.com"
                />
              </template>

              <!-- Regular input -->
              <template v-else>
                <input
                  type="text"
                  :value="editableValues[field.key] ?? field.extracted"
                  @input="updateEditableValue(field.key, $event.target.value)"
                  class="w-full text-sm border-2 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  :class="{
                    'border-orange-400 bg-white': modelValue[field.key],
                    'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed':
                      !modelValue[field.key],
                  }"
                  :disabled="!modelValue[field.key]"
                />
              </template>

              <!-- Edited Badge -->
              <div
                v-if="
                  editableValues[field.key] &&
                  editableValues[field.key] !== field.extracted
                "
                class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-md z-10"
              >
                Edited
              </div>
            </div>
            <div
              v-else
              class="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 min-h-[42px] flex items-center"
            >
              <p class="text-sm text-gray-400 italic">No data extracted</p>
            </div>
          </div>

          <!-- Status Badge (1 column) -->
          <div class="col-span-1 flex justify-end">
            <span
              v-if="
                field.extracted !== null &&
                field.extracted !== undefined &&
                field.extracted !== ''
              "
              :class="[
                'px-2 py-1 text-xs rounded-full font-semibold whitespace-nowrap',
                hasChanged(field.extracted, field.current)
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-green-50 text-green-600',
              ]"
            >
              {{
                hasChanged(field.extracted, field.current)
                  ? "🔄 Change"
                  : "✓ Same"
              }}
            </span>
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
