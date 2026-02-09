<template>
  <div class="space-y-4">
    <h4 class="text-lg font-semibold text-gray-800 mb-4">
      ✨ New Room Information
    </h4>

    <div class="grid grid-cols-2 gap-4">
      <!-- Room Name -->
      <div class="col-span-2">
        <label class="block text-xs font-medium text-gray-600 mb-1">
          Room Name *
        </label>
        <input
          :value="modelValue.name"
          @input="update('name', $event.target.value)"
          type="text"
          required
          class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          placeholder="Enter room name"
        />
      </div>

      <!-- Max Person & Room Size -->
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">
          Max Person *
        </label>
        <input
          :value="modelValue.max_person"
          @input="update('max_person', Number($event.target.value))"
          type="number"
          min="1"
          required
          class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">
          Room Size
        </label>
        <input
          :value="modelValue.room_size"
          @input="update('room_size', $event.target.value)"
          type="text"
          class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          placeholder="e.g., 25 sqm"
        />
      </div>

      <!-- Prices -->
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">
          Sale Price (THB) *
        </label>
        <input
          :value="modelValue.sale_price"
          @input="update('sale_price', Number($event.target.value))"
          type="number"
          min="0"
          step="0.01"
          required
          class="w-full px-3 py-2 text-sm border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 bg-green-50 font-semibold text-green-700"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">
          Cost Price (THB)
        </label>
        <input
          :value="modelValue.cost_price"
          @input="update('cost_price', Number($event.target.value))"
          type="number"
          min="0"
          step="0.01"
          class="w-full px-3 py-2 text-sm border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 bg-orange-50 font-semibold text-orange-700"
        />
      </div>

      <div class="col-span-2">
        <label class="block text-xs font-medium text-gray-600 mb-1">
          Agent Price (THB)
        </label>
        <input
          :value="modelValue.agent_price"
          @input="update('agent_price', Number($event.target.value))"
          type="number"
          min="0"
          step="0.01"
          class="w-full px-3 py-2 text-sm border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 bg-blue-50 font-semibold text-blue-700"
        />
      </div>

      <!-- Bed Types -->
      <!-- <div
        class="flex items-center justify-between p-2 bg-white rounded border"
      >
        <span class="text-xs font-medium">King Beds</span>
        <input
          :value="modelValue.bed_types?.king || 0"
          @input="updateBedType('king', Number($event.target.value))"
          type="number"
          min="0"
          class="w-16 px-2 py-1 text-xs border rounded"
        />
      </div>

      <div
        class="flex items-center justify-between p-2 bg-white rounded border"
      >
        <span class="text-xs font-medium">Twin Beds</span>
        <input
          :value="modelValue.bed_types?.twin || 0"
          @input="updateBedType('twin', Number($event.target.value))"
          type="number"
          min="0"
          class="w-16 px-2 py-1 text-xs border rounded"
        />
      </div> -->

      <!-- Toggles -->
      <div
        class="flex items-center justify-between p-2 bg-white rounded border cursor-pointer"
      >
        <span class="text-xs font-medium">Include Breakfast</span>
        <input
          :checked="modelValue.has_breakfast"
          @change="update('has_breakfast', $event.target.checked)"
          type="checkbox"
          class="w-4 h-4 text-purple-600 rounded"
        />
      </div>

      <!-- <div
        class="flex items-center justify-between p-2 bg-white rounded border cursor-pointer"
      >
        <span class="text-xs font-medium">Extra Bed Available</span>
        <input
          :checked="modelValue.is_extra"
          @change="update('is_extra', $event.target.checked)"
          type="checkbox"
          class="w-4 h-4 text-purple-600 rounded"
        />
      </div> -->

      <!-- Description -->
      <div class="col-span-2">
        <label class="block text-xs font-medium text-gray-600 mb-1">
          Description
        </label>
        <textarea
          :value="modelValue.description"
          @input="update('description', $event.target.value)"
          rows="2"
          class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          placeholder="Room description..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue"]);

const update = (key, value) => {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
};

const updateBedType = (type, value) => {
  const bed_types = { ...props.modelValue.bed_types, [type]: value };
  emit("update:modelValue", { ...props.modelValue, bed_types });
};
</script>
