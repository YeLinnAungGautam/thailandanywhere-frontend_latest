<template>
  <div class="max-w-full mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-xl font-bold text-gray-800">Nearby Places</h2>
      <div class="flex items-center gap-3">
        <button
          v-if="places.length === 0 && !isGenerating"
          @click="generateWithAI"
          class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <span class="text-xl">✨</span>
          <span>Generate with AI</span>
        </button>
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <span class="text-xl">+</span>
          <span>Add New Place</span>
        </button>
        <button
          @click="deteleAll"
          class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <span>Delete All Items</span>
        </button>
      </div>
    </div>

    <!-- AI Generation Loading State -->
    <div
      v-if="isGenerating"
      class="flex flex-col items-center justify-center py-16 bg-purple-50 rounded-xl border-2 border-purple-200"
    >
      <div
        class="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-lg font-semibold text-purple-900 mb-2">
        🤖 AI is generating nearby places...
      </p>
      <p class="text-sm text-purple-600">
        Analyzing {{ placeableType }} information to create location suggestions
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="loading"
      class="flex flex-col items-center justify-center py-16"
    >
      <div
        class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
      ></div>
      <p class="mt-4 text-gray-600">Loading...</p>
    </div>

    <!-- Places List -->
    <div v-else-if="places.length > 0" class="mt-6">
      <draggable
        v-model="places"
        @end="onDragEnd"
        item-key="id"
        handle=".drag-handle"
        class="space-y-4"
        tag="div"
      >
        <template #item="{ element }">
          <div
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            :class="{ 'opacity-50': !element.is_active }"
          >
            <div class="flex items-start p-5">
              <!-- Drag Handle -->
              <div
                class="drag-handle cursor-move mr-4 text-gray-400 hover:text-gray-600 py-2"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                  ></path>
                </svg>
              </div>

              <!-- Content -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <!-- Icon Preview -->
                    <div
                      v-if="element.icon"
                      class="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 text-2xl text-gray-700"
                    >
                      <i :class="element.icon"></i>
                    </div>
                    <div
                      v-else
                      class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200"
                    >
                      <span class="text-gray-400 text-xs">No Icon</span>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800">
                        {{ element.name }}
                      </h3>
                      <div class="flex items-center gap-2 mt-1">
                        <span
                          class="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                        >
                          {{ element.category }}
                        </span>
                        <span
                          v-if="element.sub_category"
                          class="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {{ element.sub_category }}
                        </span>
                        <span
                          class="inline-block px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full"
                        >
                          {{ element.distance }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    <button
                      @click="toggleStatus(element)"
                      class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      :title="element.is_active ? 'Deactivate' : 'Activate'"
                    >
                      <EyeIcon v-if="element.is_active" class="w-5 h-5" />
                      <EyeSlashIcon v-else class="w-5 h-5 opacity-50" />
                    </button>
                    <button
                      @click="openEditModal(element)"
                      class="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click="confirmDelete(element)"
                      class="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <!-- Details -->
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div
                    v-if="element.walking_time"
                    class="flex items-center gap-2 text-gray-600"
                  >
                    <i class="fa-solid fa-person-walking"></i>
                    <span>{{ element.walking_time }} min walk</span>
                  </div>
                  <div
                    v-if="element.driving_time"
                    class="flex items-center gap-2 text-gray-600"
                  >
                    <i class="fa-solid fa-car"></i>
                    <span>{{ element.driving_time }} min drive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <svg
        class="mx-auto h-24 w-24 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <p class="mt-4 text-lg text-gray-600">
        No nearby places found. Generate with AI or add manually!
      </p>
    </div>

    <!-- Create/Edit Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
        >
          <div
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            @click="closeModal"
          ></div>

          <div
            class="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
          >
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
            >
              <h3 class="text-2xl font-bold text-gray-900">
                {{ isEditMode ? "Edit Place" : "Create New Places" }}
              </h3>
              <div class="flex justify-end items-center gap-x-4">
                <button
                  type="submit"
                  @click="handleSubmit"
                  class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="submitting"
                >
                  {{
                    submitting ? "Saving..." : isEditMode ? "Update" : "Create"
                  }}
                </button>
                <button
                  @click="closeModal"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <form>
                <!-- Multiple Places (Create Mode) -->
                <div v-if="!isEditMode" class="space-y-6">
                  <div
                    v-for="(place, index) in formData.nearby_places"
                    :key="index"
                    class="p-5 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-lg font-semibold text-gray-800">
                        Place {{ index + 1 }}
                      </h4>
                      <button
                        v-if="formData.nearby_places.length > 1"
                        type="button"
                        @click="removePlace(index)"
                        class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Name <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="place.name"
                          type="text"
                          placeholder="e.g., National Stadium Station"
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Category <span class="text-red-500">*</span>
                        </label>
                        <select
                          v-model="place.category"
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        >
                          <option value="">Select Category</option>
                          <option value="transport">Transport</option>
                          <option value="landmarks">Landmarks</option>
                          <option value="essentials">Essentials</option>
                          <option value="others">Others</option>
                        </select>
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Sub Category
                        </label>
                        <select
                          v-model="place.sub_category"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        >
                          <option value="">Select Sub Category</option>
                          <optgroup
                            v-if="place.category === 'transport'"
                            label="Transport"
                          >
                            <option value="train">Train</option>
                            <option value="bus">Bus</option>
                            <option value="airport">Airport</option>
                            <option value="taxi">Taxi</option>
                            <option value="boat">Boat</option>
                          </optgroup>
                          <optgroup
                            v-if="place.category === 'landmarks'"
                            label="Landmarks"
                          >
                            <option value="temple">Temple</option>
                            <option value="museum">Museum</option>
                            <option value="monument">Monument</option>
                            <option value="park">Park</option>
                            <option value="beach">Beach</option>
                          </optgroup>
                          <optgroup
                            v-if="place.category === 'essentials'"
                            label="Essentials"
                          >
                            <option value="shopping">Shopping</option>
                            <option value="hospital">Hospital</option>
                            <option value="bank">Bank</option>
                            <option value="pharmacy">Pharmacy</option>
                            <option value="police">Police</option>
                          </optgroup>
                          <optgroup
                            v-if="place.category === 'others'"
                            label="Others"
                          >
                            <option value="restaurant">Restaurant</option>
                            <option value="cafe">Cafe</option>
                            <option value="bar">Bar</option>
                            <option value="spa">Spa</option>
                            <option value="gym">Gym</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Distance Display <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="place.distance"
                          type="text"
                          placeholder="e.g., 1.5 km"
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Distance Value <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model.number="place.distance_value"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 1.5"
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Distance Unit <span class="text-red-500">*</span>
                        </label>
                        <select
                          v-model="place.distance_unit"
                          required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        >
                          <option value="m">Meters (m)</option>
                          <option value="km">Kilometers (km)</option>
                          <option value="mi">Miles (mi)</option>
                        </select>
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Walking Time (minutes)
                        </label>
                        <input
                          v-model.number="place.walking_time"
                          type="number"
                          placeholder="e.g., 15"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Driving Time (minutes)
                        </label>
                        <input
                          v-model.number="place.driving_time"
                          type="number"
                          placeholder="e.g., 5"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>

                      <div class="md:col-span-2">
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Font Awesome Icon Class
                        </label>
                        <div class="flex items-center gap-4">
                          <input
                            v-model="place.icon"
                            type="text"
                            placeholder="fa-solid fa-train"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          />
                          <div
                            v-if="place.icon"
                            class="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 text-2xl text-gray-700"
                          >
                            <i :class="place.icon"></i>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Order
                        </label>
                        <input
                          v-model.number="place.order"
                          type="number"
                          placeholder="0"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>

                      <div class="flex items-end">
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            v-model="place.is_active"
                            type="checkbox"
                            class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span class="text-sm font-medium text-gray-700"
                            >Active</span
                          >
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    v-if="formData.nearby_places.length < 20"
                    type="button"
                    @click="addPlace"
                    class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
                  >
                    + Add Another Place
                  </button>
                </div>

                <!-- Single Place (Edit Mode) -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="editingPlace.name"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Category <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="editingPlace.category"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="transport">Transport</option>
                      <option value="landmarks">Landmarks</option>
                      <option value="essentials">Essentials</option>
                      <option value="others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Sub Category
                    </label>
                    <select
                      v-model="editingPlace.sub_category"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="">Select Sub Category</option>
                      <optgroup
                        v-if="editingPlace.category === 'transport'"
                        label="Transport"
                      >
                        <option value="train">Train</option>
                        <option value="bus">Bus</option>
                        <option value="airport">Airport</option>
                        <option value="taxi">Taxi</option>
                        <option value="boat">Boat</option>
                      </optgroup>
                      <optgroup
                        v-if="editingPlace.category === 'landmarks'"
                        label="Landmarks"
                      >
                        <option value="temple">Temple</option>
                        <option value="museum">Museum</option>
                        <option value="monument">Monument</option>
                        <option value="park">Park</option>
                        <option value="beach">Beach</option>
                      </optgroup>
                      <optgroup
                        v-if="editingPlace.category === 'essentials'"
                        label="Essentials"
                      >
                        <option value="shopping">Shopping</option>
                        <option value="hospital">Hospital</option>
                        <option value="bank">Bank</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="police">Police</option>
                      </optgroup>
                      <optgroup
                        v-if="editingPlace.category === 'others'"
                        label="Others"
                      >
                        <option value="restaurant">Restaurant</option>
                        <option value="cafe">Cafe</option>
                        <option value="bar">Bar</option>
                        <option value="spa">Spa</option>
                        <option value="gym">Gym</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Distance Display <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="editingPlace.distance"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Distance Value <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model.number="editingPlace.distance_value"
                      type="number"
                      step="0.01"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Distance Unit <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="editingPlace.distance_unit"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="m">Meters (m)</option>
                      <option value="km">Kilometers (km)</option>
                      <option value="mi">Miles (mi)</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Walking Time (minutes)
                    </label>
                    <input
                      v-model.number="editingPlace.walking_time"
                      type="number"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Driving Time (minutes)
                    </label>
                    <input
                      v-model.number="editingPlace.driving_time"
                      type="number"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Font Awesome Icon Class
                    </label>
                    <div class="flex items-center gap-4">
                      <input
                        v-model="editingPlace.icon"
                        type="text"
                        placeholder="fa-solid fa-train"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                      <div
                        v-if="editingPlace.icon"
                        class="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 text-2xl text-gray-700"
                      >
                        <i :class="editingPlace.icon"></i>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      v-model.number="editingPlace.order"
                      type="number"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div class="flex items-end">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="editingPlace.is_active"
                        type="checkbox"
                        class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span class="text-sm font-medium text-gray-700"
                        >Active</span
                      >
                    </label>
                  </div>
                </div>

                <div
                  class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200"
                >
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
        >
          <div
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            @click="showDeleteModal = false"
          ></div>

          <div
            class="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900">Confirm Delete</h3>
                <button
                  @click="showDeleteModal = false"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p class="text-gray-600 mb-2">
                Are you sure you want to delete
                <strong>"{{ placeToDelete?.name }}"</strong>?
              </p>
              <p class="text-sm text-red-600 font-medium">
                This action cannot be undone.
              </p>

              <div class="flex justify-end gap-3 mt-6">
                <button
                  @click="showDeleteModal = false"
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  @click="handleDelete"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="submitting"
                >
                  {{ submitting ? "Deleting..." : "Delete" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all"
        :class="{
          'bg-green-500 text-white': toast.type === 'success',
          'bg-red-500 text-white': toast.type === 'error',
          'bg-yellow-500 text-white': toast.type === 'warning',
        }"
      >
        <div class="flex items-center gap-3">
          <span v-if="toast.type === 'success'" class="text-2xl">✓</span>
          <span v-if="toast.type === 'error'" class="text-2xl">✕</span>
          <span v-if="toast.type === 'warning'" class="text-2xl">⚠</span>
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useNearByPlaceStore } from "../stores/nearByPlace";
import draggable from "vuedraggable";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/vue/24/solid";
import Swal from "sweetalert2";

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  placeData: {
    type: Object,
    default: () => ({}),
  },
});

const store = useNearByPlaceStore();

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL;
let genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
let currentApiKeyIndex = 1;

const places = ref([]);
const loading = ref(false);
const submitting = ref(false);
const isGenerating = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);
const placeToDelete = ref(null);

const placeableType = computed(() => {
  return props.type === "hotel" ? "Hotel" : "Attraction";
});

const placeableTypeModel = computed(() => {
  return props.type === "hotel" ? "App\\Models\\Hotel" : "App\\Models\\Product";
});

const formData = reactive({
  placeable_type: placeableTypeModel.value,
  placeable_id: props.id,
  nearby_places: [
    {
      category: "",
      sub_category: "",
      name: "",
      distance: "",
      distance_value: 0,
      distance_unit: "km",
      walking_time: null,
      driving_time: null,
      icon: "",
      order: 0,
      is_active: true,
    },
  ],
});

const editingPlace = reactive({
  id: null,
  category: "",
  sub_category: "",
  name: "",
  distance: "",
  distance_value: 0,
  distance_unit: "km",
  walking_time: null,
  driving_time: null,
  icon: "",
  order: 0,
  is_active: true,
});

const toast = reactive({
  show: false,
  message: "",
  type: "success",
});

const switchToBackupKey = () => {
  if (currentApiKeyIndex === 1) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY_2);
    currentApiKeyIndex = 2;
    showToast("Switching to backup API key...", "warning");
    return true;
  }
  return false;
};

const generateWithAI = async (retryWithBackup = true) => {
  try {
    isGenerating.value = true;
    showToast("🤖 AI is generating nearby places...", "success");

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const locationContext = `
Place Type: ${props.type}
Place Name: ${props.placeData?.name || "N/A"}
Location: ${
      props.placeData?.location_map_title ||
      props.placeData?.city?.name ||
      "N/A"
    }
Address: ${props.placeData?.address || "N/A"}
`;

    const prompt = `You are a local travel expert creating a comprehensive list of nearby places for a ${props.type}.

Based on this information:
${locationContext}

Generate at least 12-16 nearby places covering ALL categories with proper subcategories in JSON format.

REQUIRED DISTRIBUTION (generate at least these numbers per category):
1. Transport (3-4 places): train, bus, airport, taxi, boat
2. Landmarks (3-4 places): temple, museum, monument, park, beach
3. Essentials (3-4 places): shopping, hospital, bank, pharmacy, police. include at least one  nearest 7-11 convenience store item 
4. Others (3-4 places): restaurant, cafe, bar, spa, gym
Requirements for each place:
- Use realistic names for the location
- Provide accurate distance estimates
- Include both walking and driving times where applicable
- Use appropriate Font Awesome icons
- Set sequential order (0, 1, 2, 3...)
- All items should be active

Font Awesome icon mapping by sub_category:
Transport: train=fa-solid fa-train, bus=fa-solid fa-bus, airport=fa-solid fa-plane, taxi=fa-solid fa-taxi, boat=fa-solid fa-ship
Landmarks: temple=fa-solid fa-place-of-worship, museum=fa-solid fa-landmark, monument=fa-solid fa-monument, park=fa-solid fa-tree, beach=fa-solid fa-umbrella-beach
Essentials: shopping=fa-solid fa-shopping-cart, hospital=fa-solid fa-hospital, bank=fa-solid fa-building-columns, pharmacy=fa-solid fa-prescription-bottle-medical, police=fa-solid fa-shield-halved
Others: restaurant=fa-solid fa-utensils, cafe=fa-solid fa-mug-saucer, bar=fa-solid fa-martini-glass, spa=fa-solid fa-spa, gym=fa-solid fa-dumbbell

Return ONLY valid JSON in this exact format (no markdown):
[
  {
    "category": "transport",
    "sub_category": "train",
    "name": "Central Station BTS",
    "distance": "800 m",
    "distance_value": 0.8,
    "distance_unit": "km",
    "walking_time": 10,
    "driving_time": 3,
    "icon": "fa-solid fa-train",
    "order": 0,
    "is_active": true
  }
]

IMPORTANT: Generate at least 12 places with good variety across all 4 categories.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const generatedPlaces = JSON.parse(jsonMatch[0]);

      if (Array.isArray(generatedPlaces) && generatedPlaces.length > 0) {
        formData.nearby_places = generatedPlaces;
        showToast(
          `✅ AI generated ${generatedPlaces.length} places! Review and save them.`,
          "success",
        );
        openCreateModal();
      } else {
        throw new Error("Invalid AI response format");
      }
    } else {
      throw new Error("Could not parse AI response");
    }
  } catch (error) {
    console.error("Error generating with AI:", error);

    if (
      (error.message?.includes("429") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate limit")) &&
      retryWithBackup
    ) {
      if (switchToBackupKey()) {
        showToast("🔄 Retrying with backup API key...", "warning");
        return await generateWithAI(false);
      }
    }

    showToast("❌ AI generation failed. Please create manually.", "error");
  } finally {
    isGenerating.value = false;
  }
};

const showToast = (message, type = "success") => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
};

const openCreateModal = () => {
  isEditMode.value = false;
  showModal.value = true;

  if (
    formData.nearby_places.length === 1 &&
    formData.nearby_places[0].name === ""
  ) {
    resetForm();
  }
};

const openEditModal = (place) => {
  isEditMode.value = true;
  showModal.value = true;
  Object.assign(editingPlace, place);
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  formData.placeable_type = placeableTypeModel.value;
  formData.placeable_id = props.id;
  formData.nearby_places = [
    {
      category: "",
      sub_category: "",
      name: "",
      distance: "",
      distance_value: 0,
      distance_unit: "km",
      walking_time: null,
      driving_time: null,
      icon: "",
      order: 0,
      is_active: true,
    },
  ];

  editingPlace.id = null;
  editingPlace.category = "";
  editingPlace.sub_category = "";
  editingPlace.name = "";
  editingPlace.distance = "";
  editingPlace.distance_value = 0;
  editingPlace.distance_unit = "km";
  editingPlace.walking_time = null;
  editingPlace.driving_time = null;
  editingPlace.icon = "";
  editingPlace.order = 0;
  editingPlace.is_active = true;
};

const addPlace = () => {
  if (formData.nearby_places.length < 20) {
    formData.nearby_places.push({
      category: "",
      sub_category: "",
      name: "",
      distance: "",
      distance_value: 0,
      distance_unit: "km",
      walking_time: null,
      driving_time: null,
      icon: "",
      order: formData.nearby_places.length,
      is_active: true,
    });
  }
};

const removePlace = (index) => {
  formData.nearby_places.splice(index, 1);
};

const handleSubmit = async () => {
  submitting.value = true;

  try {
    if (isEditMode.value) {
      const { id, ...updateData } = editingPlace;
      const response = await store.updateAction(updateData, id);

      const index = places.value.findIndex((place) => place.id === id);
      if (index !== -1) {
        places.value[index] = { ...places.value[index], ...updateData };
      }

      showToast("Place updated successfully!");
    } else {
      const response = await store.addNewAction(formData);

      // if (response.data && Array.isArray(response.data)) {
      //   places.value.push(...response.data);
      // }

      window.location.reload();

      showToast("Places created successfully!");
    }

    closeModal();
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error.response?.data?.message || "An error occurred";
    showToast(errorMessage, "error");
  } finally {
    submitting.value = false;
  }
};

const toggleStatus = async (place) => {
  try {
    const updateData = {
      is_active: !place.is_active,
    };

    await store.updateAction(updateData, place.id);
    place.is_active = !place.is_active;

    showToast(
      `Place ${place.is_active ? "activated" : "deactivated"} successfully!`,
    );
  } catch (error) {
    console.error("Error:", error);
    showToast("Failed to update status", "error");
  }
};

const confirmDelete = (place) => {
  placeToDelete.value = place;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  submitting.value = true;

  try {
    await store.deleteAction(placeToDelete.value.id);

    places.value = places.value.filter(
      (place) => place.id !== placeToDelete.value.id,
    );

    showToast("Place deleted successfully!");
    showDeleteModal.value = false;
    placeToDelete.value = null;
  } catch (error) {
    console.error("Error:", error);
    showToast("Failed to delete place", "error");
  } finally {
    submitting.value = false;
  }
};

const onDragEnd = async () => {
  const frmData = new FormData();
  for (let x = 0; x < places.value.length; x++) {
    const element = places.value[x];
    frmData.append(`places[${x}][id]`, element.id);
    frmData.append(`places[${x}][order]`, x);
  }
  frmData.append("_method", "PUT");

  try {
    await store.updateOrderAction(frmData);

    places.value.forEach((place, index) => {
      place.order = index;
    });

    showToast("Order updated successfully!");
  } catch (error) {
    console.error("Error:", error);
    showToast("Failed to update order", "error");
  }
};

const deteleAll = async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        for (let i = 0; i < places.value.length; i++) {
          await store.deleteAction(places.value[i].id);
          // items.value.splice(i, 1);
        }
        showToast("All Items are deleted");
        places.value = [];
      } catch (error) {
        console.log(error);
      }
    }
  });
};

onMounted(() => {
  if (
    props.placeData?.near_by_places &&
    props.placeData.near_by_places.length > 0
  ) {
    places.value = [...props.placeData.near_by_places].sort(
      (a, b) => a.order - b.order,
    );
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div > div:last-child,
.modal-leave-active > div > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from > div > div:last-child,
.modal-leave-to > div > div:last-child {
  transform: scale(0.95);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(50px);
  opacity: 0;
}
</style>
