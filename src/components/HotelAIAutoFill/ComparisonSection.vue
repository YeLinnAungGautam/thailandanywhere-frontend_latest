<template>
  <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
      <h3 class="text-lg font-bold text-white flex items-center gap-2">
        <span>{{ icon }}</span>
        <span>{{ title }}</span>
      </h3>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b-2 border-gray-200">
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16"
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
              New Value (from AI)
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24"
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
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900">{{ field.label }}</span>
                <span
                  v-if="hasChanged(field.extracted, field.current)"
                  class="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold"
                >
                  Changed
                </span>
              </div>
            </td>

            <!-- Current Value -->
            <td class="px-6 py-4">
              <div class="max-w-md">
                <template v-if="field.type === 'textarea'">
                  <div
                    class="text-sm text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto"
                  >
                    {{ field.current || "-" }}
                  </div>
                </template>
                <template v-else>
                  <span class="text-sm text-gray-600">
                    {{ field.current || "-" }}
                  </span>
                </template>
              </div>
            </td>

            <!-- New Value -->
            <td class="px-6 py-4">
              <div class="max-w-md">
                <template
                  v-if="
                    field.extracted !== null &&
                    field.extracted !== undefined &&
                    field.extracted !== ''
                  "
                >
                  <template v-if="field.type === 'textarea'">
                    <div
                      class="text-sm font-semibold text-blue-700 whitespace-pre-wrap max-h-32 overflow-y-auto"
                    >
                      {{ field.extracted }}
                    </div>
                  </template>
                  <template v-else>
                    <span class="text-sm font-semibold text-blue-700">
                      {{ field.extracted }}
                    </span>
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
import { computed } from "vue";
import StatusBadge from "./StatusBadge.vue";

const props = defineProps({
  title: String,
  icon: String,
  fields: Array,
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue"]);

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
</script>
