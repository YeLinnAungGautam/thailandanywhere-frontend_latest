<template>
  <div class="space-y-4">
    <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
      <p class="text-sm text-blue-800">
        <span class="font-semibold">🔄 Merge Mode:</span>
        Review changes before merging. Current values (left) → AI values (right,
        editable).
      </p>
    </div>

    <!-- Room Name -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-800">
        Room Name <span class="text-red-500">*</span>
      </label>
      <div class="grid grid-cols-9 gap-4">
        <div
          class="bg-gray-50 col-span-4 rounded-lg px-4 py-3 border border-gray-200"
        >
          <p class="text-sm text-gray-600">{{ current?.name || "-" }}</p>
        </div>
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
        <input
          type="text"
          :value="extracted.name"
          @input="$emit('update', 'name', $event.target.value)"
          class="px-4 py-3 text-sm col-span-4 border-2 border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Deluxe Double Room"
        />
      </div>
    </div>

    <!-- Max Person -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-800">
        Max Person <span class="text-red-500">*</span>
      </label>
      <div class="grid grid-cols-9 gap-4">
        <div
          class="bg-gray-50 col-span-4 rounded-lg px-4 py-3 border border-gray-200"
        >
          <p class="text-sm text-gray-600">{{ current?.max_person || "-" }}</p>
        </div>
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
        <input
          type="number"
          :value="extracted.max_person"
          @input="$emit('update', 'max_person', Number($event.target.value))"
          min="1"
          class="px-4 py-3 text-sm col-span-4 border-2 border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Room Price (Sale Price) -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="block text-sm font-semibold text-gray-800">
          Room Price <span class="text-red-500">*</span>
        </label>
        <span class="text-xs text-red-600 font-medium">
          Suggest Price: {{ suggestPrice(extracted.cost_price) }}
        </span>
      </div>
      <div class="grid grid-cols-9 gap-4">
        <div
          class="bg-gray-50 col-span-4 rounded-lg px-4 py-3 border border-gray-200"
        >
          <p class="text-sm text-gray-600">{{ current?.room_price || "-" }}</p>
        </div>
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
        <input
          type="number"
          :value="extracted.sale_price"
          @input="$emit('update', 'sale_price', Number($event.target.value))"
          min="0"
          step="0.01"
          class="px-4 py-3 text-sm col-span-4 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
        />
      </div>
    </div>

    <!-- Cost -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-800">Cost</label>
      <div class="grid grid-cols-9 gap-4">
        <div
          class="bg-gray-50 col-span-4 rounded-lg px-4 py-3 border border-gray-200"
        >
          <p class="text-sm text-gray-600">{{ current?.cost || "-" }}</p>
        </div>
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
        <input
          type="number"
          :value="extracted.cost_price"
          @input="$emit('update', 'cost_price', Number($event.target.value))"
          min="0"
          step="0.01"
          class="px-4 py-3 text-sm col-span-4 border-2 border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-orange-50"
        />
      </div>
    </div>

    <!-- Walk-in Price (Owner Price) -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-800"
        >Walk-in Price</label
      >
      <div class="grid grid-cols-9 gap-4">
        <div
          class="bg-gray-50 col-span-4 rounded-lg px-4 py-3 border border-gray-200"
        >
          <p class="text-sm text-gray-600">{{ current?.owner_price || "-" }}</p>
        </div>
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
        <input
          type="number"
          :value="extracted.owner_price || 0"
          @input="$emit('update', 'owner_price', Number($event.target.value))"
          min="0"
          step="0.01"
          class="px-4 py-3 text-sm col-span-4 border-2 border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Agent Price -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-800"
        >Agent Price</label
      >
      <div class="grid grid-cols-9 gap-4">
        <div
          class="bg-gray-50 col-span-4 rounded-lg px-4 py-3 border border-gray-200"
        >
          <p class="text-sm text-gray-600">{{ current?.agent_price || "-" }}</p>
        </div>
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
        <input
          type="number"
          :value="extracted.agent_price"
          @input="$emit('update', 'agent_price', Number($event.target.value))"
          min="0"
          step="0.01"
          class="px-4 py-3 col-span-4 text-sm border-2 border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
        />
      </div>
    </div>

    <!-- Room Size -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-800">Room Size</label>
      <div class="grid grid-cols-9 gap-4">
        <div
          class="bg-gray-50 col-span-4 rounded-lg px-4 py-3 border border-gray-200"
        >
          <p class="text-sm text-gray-600">
            {{ current?.meta?.room_size || "-" }}
          </p>
        </div>
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
        <input
          type="text"
          :value="extracted.room_size"
          @input="$emit('update', 'room_size', $event.target.value)"
          class="px-4 py-3 text-sm col-span-4 border-2 border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 25 sqm"
        />
      </div>
    </div>

    <!-- Toggles Section -->
    <div class="space-y-3 pt-4">
      <h4 class="text-sm font-semibold text-gray-800 mb-3">Room Features</h4>

      <div class="grid grid-cols-2 gap-4">
        <!-- Extra Bed -->
        <div
          class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
        >
          <span class="text-sm font-medium text-gray-700">Extra Bed</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="extracted.is_extra"
              @change="$emit('update', 'is_extra', $event.target.checked)"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"
            ></div>
          </label>
        </div>

        <!-- Breakfast -->
        <div
          class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
        >
          <span class="text-sm font-medium text-gray-700">Breakfast</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="extracted.has_breakfast"
              @change="$emit('update', 'has_breakfast', $event.target.checked)"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"
            ></div>
          </label>
        </div>

        <!-- Double Bed -->
        <div
          class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
        >
          <span class="text-sm font-medium text-gray-700">Double Bed</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="(extracted.bed_types?.king || 0) > 0"
              @change="updateBedType('king', $event.target.checked ? 1 : 0)"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"
            ></div>
          </label>
        </div>

        <!-- Twin Bed -->
        <div
          class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
        >
          <span class="text-sm font-medium text-gray-700">Twin Bed</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="(extracted.bed_types?.twin || 0) > 0"
              @change="updateBedType('twin', $event.target.checked ? 1 : 0)"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"
            ></div>
          </label>
        </div>

        <!-- Show Online -->
        <div
          class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
        >
          <span class="text-sm font-medium text-gray-700">Show Online</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="extracted.is_show_on !== false"
              @change="$emit('update', 'is_show_on', $event.target.checked)"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"
            ></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-800"
        >Description</label
      >
      <div class="grid grid-cols-2 gap-4">
        <div
          class="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 min-h-[80px]"
        >
          <p class="text-sm text-gray-600 whitespace-pre-wrap">
            {{ current?.description || "-" }}
          </p>
        </div>
        <textarea
          :value="extracted.description"
          @input="$emit('update', 'description', $event.target.value)"
          rows="3"
          class="px-4 py-3 text-sm border-2 border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Room description..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  current: Object,
  extracted: Object,
});

const emit = defineEmits(["update"]);

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
  const bed_types = { ...emit.extracted?.bed_types, [type]: value };
  emit("update", "bed_types", bed_types);
};
</script>
