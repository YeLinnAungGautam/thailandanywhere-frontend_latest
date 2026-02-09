<template>
  <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4">
      <h3 class="text-sm font-bold flex items-center gap-2">
        <span>{{ icon }}</span>
        <span>{{ title }}</span>
      </h3>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full table-fixed">
        <colgroup>
          <col class="w-16" />
          <!-- Apply checkbox -->
          <col class="w-[180px]" />
          <!-- Field name -->
          <col class="w-[250px]" />
          <!-- Current Value - SMALLER -->
          <col class="w-auto" />
          <!-- New Value (Editable) - WIDER -->
          <col class="w-[100px]" />
          <!-- Status -->
        </colgroup>
        <thead>
          <tr class="bg-gray-50 border-b-2 border-gray-200">
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Apply
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Field
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Current Value
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              New Value (Editable)
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="field in fields"
            :key="field.key"
            :class="getRowClass(field)"
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Checkbox -->
            <td class="px-6 py-4">
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
              <span v-else class="text-gray-300">-</span>
            </td>

            <!-- Field Label -->
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <span class="font-medium text-gray-900 text-xs">{{
                  field.label
                }}</span>
                <span
                  v-if="hasChanged(field.extracted, field.current)"
                  class="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full font-semibold w-fit"
                >
                  Changed
                </span>
              </div>
            </td>

            <!-- Current Value - SMALLER COLUMN -->
            <td class="px-6 py-4">
              <div class="max-w-full">
                <template v-if="field.type === 'textarea'">
                  <div
                    class="text-xs text-gray-600 whitespace-pre-wrap max-h-24 overflow-y-auto break-words"
                  >
                    {{ field.current || "-" }}
                  </div>
                </template>
                <template v-else-if="field.type === 'array'">
                  <div class="text-xs text-gray-600 break-words">
                    {{ field.current || "-" }}
                  </div>
                </template>
                <template v-else>
                  <span class="text-xs text-gray-600 break-words">
                    {{ field.current || "-" }}
                  </span>
                </template>
              </div>
            </td>

            <!-- New Value (EDITABLE) - WIDER COLUMN -->
            <td class="px-6 py-4">
              <div class="w-full">
                <template
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
                      @input="
                        updateEditableValue(field.key, $event.target.value)
                      "
                      rows="4"
                      class="w-full text-sm border border-[#FF613c] rounded-lg px-3 py-2 focus:outline-none resize-none"
                      :class="{
                        'opacity-50 cursor-not-allowed': !modelValue[field.key],
                      }"
                      :disabled="!modelValue[field.key]"
                    ></textarea>
                  </template>

                  <!-- Array (comma-separated emails) -->
                  <template v-else-if="field.type === 'array'">
                    <textarea
                      :value="editableValues[field.key] ?? field.extracted"
                      @input="
                        updateEditableValue(field.key, $event.target.value)
                      "
                      rows="2"
                      class="w-full text-sm border border-[#FF613c] rounded-lg px-3 py-2 focus:outline-none resize-none"
                      :class="{
                        'opacity-50 cursor-not-allowed': !modelValue[field.key],
                      }"
                      :disabled="!modelValue[field.key]"
                      placeholder="email1@example.com, email2@example.com"
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">
                      Separate emails with commas
                    </p>
                  </template>

                  <!-- Regular input -->
                  <template v-else>
                    <input
                      type="text"
                      :value="editableValues[field.key] ?? field.extracted"
                      @input="
                        updateEditableValue(field.key, $event.target.value)
                      "
                      class="w-full text-sm border border-[#FF613c] rounded-lg px-3 py-2.5 focus:outline-none"
                      :class="{
                        'opacity-50 cursor-not-allowed': !modelValue[field.key],
                      }"
                      :disabled="!modelValue[field.key]"
                    />
                  </template>
                </template>
                <span v-else class="text-sm text-gray-400 italic"
                  >No data extracted</span
                >
              </div>
            </td>

            <!-- Status -->
            <td class="px-6 py-4">
              <StatusBadge :field="field" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import StatusBadge from "./StatusBadge.vue";

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

const getRowClass = (field) => {
  if (!field.extracted) return "bg-gray-50 opacity-60";
  if (hasChanged(field.extracted, field.current)) return "bg-yellow-50";
  return "";
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
