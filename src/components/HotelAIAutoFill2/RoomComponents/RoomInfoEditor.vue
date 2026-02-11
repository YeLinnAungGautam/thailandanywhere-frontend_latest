<template>
  <div class="space-y-4">
    <h4 class="text-lg font-semibold text-gray-800 mb-4">
      ✨ Room Information
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
          <span class="text-red-500"
            >Suggest : {{ suggestPrice(modelValue.cost_price) }}</span
          >
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

      <div>
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

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">
          Walk-in Price (THB)
        </label>
        <input
          :value="modelValue.owner_price"
          @input="update('owner_price', Number($event.target.value))"
          type="number"
          min="0"
          step="0.01"
          class="w-full px-3 py-2 text-sm border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 bg-purple-50 font-semibold text-purple-700"
        />
      </div>

      <!-- Toggles Section -->
      <div class="col-span-2">
        <label class="block text-xs font-medium text-gray-600 mb-3">
          Room Options
        </label>
        <div
          class="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <!-- Extra Bed -->
          <div class="flex items-center justify-between">
            <label class="text-xs font-medium text-gray-700">Extra Bed</label>
            <Switch
              :model-value="modelValue.is_extra"
              @update:model-value="update('is_extra', $event)"
              :class="modelValue.is_extra ? 'bg-purple-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span
                :class="modelValue.is_extra ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </Switch>
          </div>

          <!-- Breakfast -->
          <div class="flex items-center justify-between">
            <label class="text-xs font-medium text-gray-700">Breakfast</label>
            <Switch
              :model-value="modelValue.has_breakfast"
              @update:model-value="update('has_breakfast', $event)"
              :class="
                modelValue.has_breakfast ? 'bg-purple-600' : 'bg-gray-300'
              "
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span
                :class="
                  modelValue.has_breakfast ? 'translate-x-6' : 'translate-x-1'
                "
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </Switch>
          </div>

          <!-- Double Bed -->
          <div class="flex items-center justify-between">
            <label class="text-xs font-medium text-gray-700">Double Bed</label>
            <Switch
              :model-value="modelValue.bed_types?.king > 0"
              @update:model-value="updateBedType('king', $event ? 1 : 0)"
              :class="
                modelValue.bed_types?.king > 0 ? 'bg-purple-600' : 'bg-gray-300'
              "
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span
                :class="
                  modelValue.bed_types?.king > 0
                    ? 'translate-x-6'
                    : 'translate-x-1'
                "
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </Switch>
          </div>

          <!-- Twin Bed -->
          <div class="flex items-center justify-between">
            <label class="text-xs font-medium text-gray-700">Twin Bed</label>
            <Switch
              :model-value="modelValue.bed_types?.twin > 0"
              @update:model-value="updateBedType('twin', $event ? 1 : 0)"
              :class="
                modelValue.bed_types?.twin > 0 ? 'bg-purple-600' : 'bg-gray-300'
              "
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span
                :class="
                  modelValue.bed_types?.twin > 0
                    ? 'translate-x-6'
                    : 'translate-x-1'
                "
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </Switch>
          </div>

          <!-- Show Online -->
          <div class="flex items-center justify-between">
            <label class="text-xs font-medium text-gray-700">Show Online</label>
            <Switch
              :model-value="modelValue.is_show_on"
              @update:model-value="update('is_show_on', $event)"
              :class="modelValue.is_show_on ? 'bg-purple-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span
                :class="
                  modelValue.is_show_on ? 'translate-x-6' : 'translate-x-1'
                "
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </Switch>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="col-span-2">
        <label class="block text-xs font-medium text-gray-600 mb-1">
          Description
        </label>
        <textarea
          :value="modelValue.description"
          @input="update('description', $event.target.value)"
          rows="3"
          class="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          placeholder="Room description..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Switch } from "@headlessui/vue";

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue"]);

const update = (key, value) => {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
};

const suggestPrice = (cost) => {
  if (!cost) return 0;
  let amount = cost / 0.85;
  let lastTwoDigits = amount % 100;
  if (lastTwoDigits > 50) {
    return (Math.ceil(amount / 100) * 100).toFixed(0);
  } else {
    return (Math.round(amount / 50) * 50).toFixed(0);
  }
};

const updateBedType = (type, value) => {
  const bed_types = {
    ...(props.modelValue.bed_types || { king: 0, twin: 0 }),
    [type]: value,
  };
  emit("update:modelValue", { ...props.modelValue, bed_types });
};
</script>
