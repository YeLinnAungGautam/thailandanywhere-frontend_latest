<template>
  <Layout :title="'generate inclusive'">
    <div class="min-h-full bg-slate-50">
      <!-- Choose Step - Initial Selection -->
      <div
        v-if="currentView === 'choose'"
        class="w-full h-[80vh] flex justify-center items-center gap-10 px-6"
      >
        <div
          @click="startCreation('new')"
          class="w-[300px] h-[200px] border-2 border-orange-500 hover:bg-orange-50 flex justify-center items-center rounded-2xl cursor-pointer transition group"
        >
          <div class="text-center">
            <svg
              class="w-16 h-16 mx-auto mb-3 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p class="text-lg font-semibold text-slate-800">Create New</p>
          </div>
        </div>
        <div
          @click="startCreation('external')"
          class="w-[300px] h-[200px] border-2 border-slate-400 bg-slate-100 hover:bg-slate-200 flex justify-center items-center rounded-2xl cursor-pointer transition"
        >
          <div class="text-center">
            <svg
              class="w-16 h-16 mx-auto mb-3 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-lg font-semibold text-slate-800">Choose External</p>
          </div>
        </div>
      </div>

      <!-- Question Steps -->
      <div
        v-if="currentView === 'questions'"
        class="w-full min-h-full grid grid-cols-5 gap-4"
      >
        <!-- Left Sidebar - Questions Navigation -->
        <div class="col-span-1 space-y-3">
          <div
            v-for="(question, idx) in questions"
            :key="idx"
            @click="activeQuestion = idx"
            :class="[
              'border-2 rounded-2xl p-4 cursor-pointer transition',
              activeQuestion === idx
                ? 'border-orange-500 bg-orange-50'
                : 'border-slate-300 bg-white hover:border-orange-300',
            ]"
          >
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  activeQuestion === idx
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-200 text-slate-600',
                ]"
              >
                {{ idx + 1 }}
              </div>
              <p class="font-semibold text-sm text-slate-800">
                {{ question.title }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right Content Area - Question Display -->
        <div
          class="col-span-4 border-2 border-slate-300 rounded-2xl overflow-y-auto bg-white p-8"
          style="height: calc(100vh - 7.5rem)"
        >
          <!-- Question 1: Basic Trip Info -->
          <div v-if="activeQuestion === 0" class="h-full">
            <div class="grid grid-cols-2 gap-6 h-full">
              <!-- LEFT SIDE: Basic Info -->
              <div>
                <h2 class="text-2xl font-bold text-slate-800 mb-6">
                  Basic Trip Info
                </h2>

                <!-- Number of People -->
                <div class="bg-white rounded-xl mb-6">
                  <h3 class="text-lg font-semibold text-slate-800 mb-4">
                    Number of People
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Adults
                      </label>
                      <input
                        v-model.number="packageData.adults"
                        type="number"
                        min="0"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Children
                      </label>
                      <input
                        v-model.number="packageData.children"
                        type="number"
                        min="0"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                  </div>
                </div>

                <!-- Trip Duration -->
                <div class="bg-white rounded-xl">
                  <h3 class="text-lg font-semibold text-slate-800 mb-4">
                    Trip Duration
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Start Date
                      </label>
                      <input
                        v-model="packageData.startDate"
                        type="date"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Number of Nights
                      </label>
                      <input
                        v-model.number="packageData.nights"
                        type="number"
                        min="1"
                        placeholder="e.g., 3 nights = 4 days"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg"
                      />
                    </div>
                  </div>
                  <div
                    v-if="totalDays > 0"
                    class="mt-4 text-center text-orange-600 font-semibold text-lg bg-orange-50 rounded-xl py-3"
                  >
                    {{ packageData.nights }} nights = {{ totalDays }} days
                    <div class="text-sm text-slate-600 mt-1">
                      {{ formatDate(packageData.startDate) }} to
                      {{ formatDate(endDateCalculated) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- RIGHT SIDE: City Assignment for Each Day -->
              <div v-if="totalDays > 0">
                <h2 class="text-2xl font-bold text-slate-800 mb-6">
                  Assign Cities to Days
                </h2>
                <div class="bg-white rounded-xl border-2 border-slate-200 p-6">
                  <p class="text-sm text-slate-600 mb-4">
                    Select which city you'll be in for each day of your trip
                  </p>
                  <div class="space-y-3">
                    <div
                      v-for="day in totalDays"
                      :key="`city-day-${day}`"
                      class="flex items-center gap-3"
                    >
                      <div class="w-20 flex-shrink-0">
                        <span class="text-sm font-semibold text-slate-700">
                          Day {{ day }}
                        </span>
                        <div class="text-xs text-slate-500">
                          {{ getDayDateShort(day) }}
                        </div>
                      </div>
                      <select
                        v-model="dayCityMap[day]"
                        class="flex-1 px-4 py-4 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        :class="
                          dayCityMap[day]
                            ? 'border-orange-500 bg-orange-50'
                            : ''
                        "
                      >
                        <option value="">Select City</option>
                        <option value="Bangkok">Bangkok</option>
                        <option value="Chiang Mai">Chiang Mai</option>
                        <option value="Chiang Rai">Chiang Rai</option>
                        <option value="Phuket">Phuket</option>
                        <option value="Pattaya">Pattaya</option>
                        <option value="Krabi">Krabi</option>
                        <option value="Koh Samui">Koh Samui</option>
                      </select>
                    </div>
                  </div>

                  <!-- Summary -->
                  <div
                    v-if="Object.keys(dayCityMap).length > 0"
                    class="mt-6 pt-4 border-t"
                  >
                    <h4 class="text-sm font-bold text-slate-700 mb-2">
                      Cities Summary:
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="city in uniqueCitiesInTrip"
                        :key="city"
                        class="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ city }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Question 2: Attractions -->
          <div v-if="activeQuestion === 1" class="h-full">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">
              Where do you want to visit?
            </h2>

            <div
              :class="
                attractionViewMode === 'calendar'
                  ? 'grid grid-cols-1'
                  : 'grid grid-cols-2'
              "
              class="gap-6 h-[calc(100%-5rem)]"
            >
              <!-- LEFT SIDE: Add Form -->
              <div
                v-if="attractionViewMode === 'list'"
                class="bg-white pr-4 pl-2 overflow-y-auto"
              >
                <h3 class="text-lg font-bold text-slate-700 mb-4">
                  {{
                    editingAttraction !== null
                      ? "Edit Attraction"
                      : "Add Attraction / Destination"
                  }}
                </h3>

                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Type
                    </label>

                    <div class="flex justify-between items-center gap-x-2">
                      <button
                        @click="newAttraction.type = 'Attraction'"
                        :class="[
                          'border w-full text-center py-3 rounded-xl transition',
                          newAttraction.type === 'Attraction'
                            ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                            : 'border-slate-300 hover:border-orange-300',
                        ]"
                      >
                        Attraction
                      </button>
                      <button
                        @click="newAttraction.type = 'Destination'"
                        :class="[
                          'border w-full text-center py-3 rounded-xl transition',
                          newAttraction.type === 'Destination'
                            ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                            : 'border-slate-300 hover:border-orange-300',
                        ]"
                      >
                        Destination
                      </button>
                    </div>
                  </div>

                  <!-- Select Day instead of date -->
                  <div>
                    <label
                      class="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Select Day
                    </label>
                    <select
                      v-model.number="newAttraction.dayNumber"
                      @change="onAttractionDayChange"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Day</option>
                      <option v-for="day in totalDays" :key="day" :value="day">
                        Day {{ day }} - {{ getDayDateShort(day)
                        }}{{ getDayCityText(day) }}
                      </option>
                    </select>
                  </div>

                  <!-- Step 1: Select Product -->
                  <div v-if="newAttraction.dayNumber">
                    <label
                      class="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Select Product
                    </label>
                    <select
                      v-model="newAttraction.selectedProduct"
                      @change="onAttractionProductChange"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    >
                      <option value="">Choose a product</option>
                      <option
                        v-for="product in availableAttractionProducts"
                        :key="product"
                        :value="product"
                      >
                        {{ product }}
                      </option>
                    </select>
                  </div>

                  <!-- Step 2: Select Product Variation -->
                  <div v-if="newAttraction.selectedProduct">
                    <label
                      class="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Select Variation
                    </label>
                    <div
                      class="space-y-2 max-h-64 overflow-y-auto bg-slate-50 border-2 border-slate-200 rounded-xl p-4"
                    >
                      <div
                        v-for="(
                          variation, idx
                        ) in availableAttractionVariations"
                        :key="idx"
                        @click="selectAttractionVariation(variation)"
                        :class="[
                          'bg-white border-2 rounded-lg p-3 cursor-pointer transition',
                          newAttraction.selectedVariation?.name ===
                          variation.name
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50',
                        ]"
                      >
                        <div class="font-semibold text-sm text-slate-800">
                          {{ variation.name }}
                        </div>
                        <div class="text-xs text-slate-600 mt-1">
                          {{ variation.description }}
                        </div>
                        <div class="flex justify-between items-center mt-2">
                          <span class="text-xs text-orange-600 font-bold"
                            >฿{{ variation.price.toLocaleString() }} /
                            person</span
                          >
                          <span
                            v-if="
                              newAttraction.selectedVariation?.name ===
                              variation.name
                            "
                            class="text-xs text-orange-600 font-semibold"
                            >✓ Selected</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button
                      v-if="editingAttraction !== null"
                      @click="cancelEditAttraction"
                      class="w-1/3 px-6 py-3 bg-slate-400 text-white rounded-xl font-semibold hover:bg-slate-500 transition"
                    >
                      Cancel
                    </button>
                    <button
                      @click="
                        editingAttraction !== null
                          ? updateAttraction()
                          : addAttraction()
                      "
                      :disabled="!newAttraction.selectedVariation"
                      :class="[
                        'px-6 py-3 rounded-xl font-semibold transition',
                        editingAttraction !== null ? 'w-2/3' : 'w-full',
                        newAttraction.selectedVariation
                          ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed',
                      ]"
                    >
                      {{
                        editingAttraction !== null
                          ? "✓ Update Attraction"
                          : "+ Add to Package"
                      }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- RIGHT SIDE: List with Toggle View -->
              <div
                class="bg-white rounded-xl border-2 border-slate-200 p-6 overflow-y-auto"
              >
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-slate-700">
                    Attractions ({{ packageData.attractions.length }})
                  </h3>

                  <!-- Toggle View Buttons -->
                  <div class="flex gap-2 bg-slate-100 rounded-xl p-1">
                    <button
                      @click="attractionViewMode = 'list'"
                      :class="[
                        'px-3 py-1.5 rounded text-sm font-medium transition',
                        attractionViewMode === 'list'
                          ? 'bg-white text-orange-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800',
                      ]"
                    >
                      List
                    </button>
                    <button
                      @click="attractionViewMode = 'calendar'"
                      :class="[
                        'px-3 py-1.5 rounded text-sm font-medium transition',
                        attractionViewMode === 'calendar'
                          ? 'bg-white text-orange-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800',
                      ]"
                    >
                      Calendar
                    </button>
                  </div>
                </div>

                <!-- Calendar View -->
                <div v-if="attractionViewMode === 'calendar' && totalDays > 0">
                  <div
                    class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-300"
                  >
                    <div
                      class="bg-white rounded-xl shadow-inner overflow-hidden"
                    >
                      <div
                        class="grid gap-px bg-slate-200"
                        :style="`grid-template-columns: repeat(${totalDays}, 1fr)`"
                      >
                        <div
                          v-for="day in totalDays"
                          :key="`header-${day}`"
                          class="bg-slate-700 text-white p-3 text-center"
                        >
                          <div class="text-xs font-medium uppercase">
                            {{ getDayName(day) }}
                          </div>
                          <div class="text-lg font-bold mt-1">
                            {{ getDayNumber(day) }}
                          </div>
                          <!-- Show city for this day -->
                          <div class="text-xs mt-1 opacity-75">
                            {{ getDayCity(getDayDateRaw(day)) || "—" }}
                          </div>
                        </div>
                      </div>

                      <div
                        class="grid gap-px bg-slate-200"
                        :style="`grid-template-columns: repeat(${totalDays}, 1fr)`"
                      >
                        <div
                          v-for="day in totalDays"
                          :key="`content-${day}`"
                          class="bg-white p-3 min-h-[200px]"
                        >
                          <div class="space-y-2">
                            <div
                              v-for="(item, idx) in getAttractionsForDate(
                                getDayDateRaw(day),
                              )"
                              :key="idx"
                              class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-2 text-xs shadow-sm group relative"
                            >
                              <button
                                @click="
                                  removeAttraction(
                                    packageData.attractions.indexOf(item),
                                  )
                                "
                                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                              >
                                ×
                              </button>
                              <div class="font-semibold">{{ item.name }}</div>
                              <div class="opacity-90 mt-1">{{ item.type }}</div>
                              <div class="opacity-75 text-[10px] mt-1">
                                👤 {{ item.adults + item.children }} pax
                              </div>
                              <div class="opacity-75 text-[10px] mt-1">
                                ฿{{
                                  (
                                    (item.price || 0) *
                                    (item.adults + item.children)
                                  ).toLocaleString()
                                }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- List View -->
                <div v-if="attractionViewMode === 'list'" class="space-y-2">
                  <div
                    v-for="(item, idx) in packageData.attractions"
                    :key="idx"
                    class="bg-white border-2 border-blue-200 rounded-xl p-4 relative group hover:shadow-md transition"
                  >
                    <div class="flex gap-2 absolute top-2 right-2">
                      <button
                        @click="editAttraction(idx)"
                        class="w-6 h-6 bg-blue-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        @click="removeAttraction(idx)"
                        class="w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                    <div class="text-xs text-blue-500 font-semibold mb-1">
                      {{ item.dayLabel }} • {{ item.city }}
                    </div>
                    <h4 class="font-semibold text-slate-800 text-base">
                      {{ item.name || "Unnamed" }}
                    </h4>
                    <div class="text-sm text-blue-600 mt-1">
                      {{ item.type || "Attraction" }}
                    </div>
                    <div class="text-sm text-slate-600 mt-1">
                      {{ item.adults }} Adults, {{ item.children }} Children
                    </div>
                    <div class="text-sm text-orange-600 font-bold mt-2">
                      ฿{{
                        (
                          (item.price || 0) *
                          (item.adults + item.children)
                        ).toLocaleString()
                      }}
                    </div>
                    <div v-if="item.variation" class="mt-2">
                      <span
                        class="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                      >
                        {{ item.variation }}
                      </span>
                    </div>
                  </div>
                  <div
                    v-if="packageData.attractions.length === 0"
                    class="text-center text-slate-400 text-sm py-12"
                  >
                    No attractions added yet
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Question 3: Hotels -->
          <div v-if="activeQuestion === 2" class="h-full">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">
              Which hotel do you want?
            </h2>

            <div
              :class="
                hotelViewMode === 'calendar'
                  ? 'grid grid-cols-1'
                  : 'grid grid-cols-2'
              "
              class="gap-6 h-[calc(100%-5rem)]"
            >
              <!-- LEFT SIDE: Add Form -->
              <div
                v-if="hotelViewMode === 'list'"
                class="bg-white rounded-xl pl-2 pr-4 overflow-y-auto"
              >
                <h3 class="text-lg font-bold text-slate-700 mb-4">
                  {{ editingHotel !== null ? "Edit Hotel" : "Add Hotel" }}
                </h3>

                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Check-in
                      </label>
                      <input
                        v-model="newHotel.checkIn"
                        @change="onHotelDateChange"
                        type="date"
                        :min="packageData.startDate"
                        :max="endDateCalculated"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                      <div
                        v-if="newHotel.checkIn"
                        class="mt-2 text-sm text-slate-600"
                      >
                        📅 {{ getDateDayInfo(newHotel.checkIn) }}
                      </div>
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Check-out
                      </label>
                      <input
                        v-model="newHotel.checkOut"
                        @change="onHotelDateChange"
                        type="date"
                        :min="newHotel.checkIn || packageData.startDate"
                        :max="endDateCalculated"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                      <div
                        v-if="newHotel.checkOut"
                        class="mt-2 text-sm text-slate-600"
                      >
                        📅 {{ getDateDayInfo(newHotel.checkOut) }}
                      </div>
                    </div>
                  </div>

                  <!-- Show which days/cities this hotel covers -->
                  <!-- <div
                    v-if="
                      newHotel.checkIn &&
                      newHotel.checkOut &&
                      hotelDateRangeInfo.days.length > 0
                    "
                    class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
                  >
                    <h4 class="text-sm font-bold text-slate-700 mb-2">
                      🏨 Hotel Stay Coverage:
                    </h4>
                    <div class="text-sm text-slate-700">
                      <div class="mb-2">
                        <span class="font-semibold"
                          >{{ hotelDateRangeInfo.nights }} night{{
                            hotelDateRangeInfo.nights > 1 ? "s" : ""
                          }}</span
                        >
                        <span class="text-slate-600 ml-2"
                          >({{ hotelDateRangeInfo.days.length }} days)</span
                        >
                      </div>
                      <div class="space-y-1">
                        <div
                          v-for="dayInfo in hotelDateRangeInfo.days"
                          :key="dayInfo.day"
                          class="flex items-center gap-2"
                        >
                          <span class="text-purple-600 font-medium"
                            >Day {{ dayInfo.day }}:</span
                          >
                          <span class="text-slate-700">{{
                            dayInfo.city || "⚠️ No city assigned"
                          }}</span>
                        </div>
                      </div>
                      <div
                        v-if="hotelDateRangeInfo.cities.length > 0"
                        class="mt-3 pt-3 border-t border-blue-300"
                      >
                        <span class="text-xs font-semibold text-slate-600"
                          >Cities:
                        </span>
                        <span class="text-xs text-purple-700 font-semibold">{{
                          hotelDateRangeInfo.cities.join(", ")
                        }}</span>
                      </div>
                    </div>
                  </div> -->

                  <div>
                    <label
                      class="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Persons
                    </label>
                    <input
                      v-model.number="newHotel.persons"
                      type="number"
                      min="1"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <!-- Step 1: Select Hotel Product -->
                  <div v-if="hotelDateRangeInfo.cities.length > 0">
                    <label
                      class="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Select Hotel
                    </label>
                    <select
                      v-model="newHotel.selectedProduct"
                      @change="onHotelProductChange"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      <option value="">Choose a hotel</option>
                      <option
                        v-for="hotel in availableHotelProducts"
                        :key="hotel"
                        :value="hotel"
                      >
                        {{ hotel }}
                      </option>
                    </select>
                  </div>

                  <!-- Step 2: Select Room Variation -->
                  <div v-if="newHotel.selectedProduct">
                    <label
                      class="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Select Room Type
                    </label>
                    <div
                      class="space-y-2 max-h-64 overflow-y-auto bg-slate-50 border-2 border-slate-200 rounded-xl p-4"
                    >
                      <div
                        v-for="(variation, idx) in availableHotelVariations"
                        :key="idx"
                        @click="selectHotelVariation(variation)"
                        :class="[
                          'bg-white border-2 rounded-lg p-3 cursor-pointer transition',
                          newHotel.selectedVariation?.roomType ===
                          variation.roomType
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50',
                        ]"
                      >
                        <div class="font-semibold text-sm text-slate-800">
                          {{ variation.roomType }}
                        </div>
                        <div class="flex justify-between items-center mt-2">
                          <span class="text-xs text-purple-600 font-bold"
                            >฿{{ variation.pricePerNight.toLocaleString() }} /
                            night</span
                          >
                          <span
                            v-if="
                              newHotel.selectedVariation?.roomType ===
                              variation.roomType
                            "
                            class="text-xs text-purple-600 font-semibold"
                            >✓ Selected</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button
                      v-if="editingHotel !== null"
                      @click="cancelEditHotel"
                      class="w-1/3 px-6 py-3 bg-slate-400 text-white rounded-xl font-semibold hover:bg-slate-500 transition"
                    >
                      Cancel
                    </button>
                    <button
                      @click="
                        editingHotel !== null ? updateHotel() : addHotel()
                      "
                      :disabled="!newHotel.selectedVariation"
                      :class="[
                        'px-6 py-3 rounded-xl font-semibold transition',
                        editingHotel !== null ? 'w-2/3' : 'w-full',
                        newHotel.selectedVariation
                          ? 'bg-purple-500 text-white hover:bg-purple-600 cursor-pointer'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed',
                      ]"
                    >
                      {{
                        editingHotel !== null ? "✓ Update Hotel" : "+ Add Hotel"
                      }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- RIGHT SIDE: List with Toggle View -->
              <div
                class="bg-white rounded-xl border-2 border-slate-200 p-6 overflow-y-auto"
              >
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-slate-700">
                    Hotels ({{ packageData.hotels.length }})
                  </h3>

                  <!-- Toggle View Buttons -->
                  <div class="flex gap-2 bg-slate-100 rounded-xl p-1">
                    <button
                      @click="hotelViewMode = 'list'"
                      :class="[
                        'px-3 py-1.5 rounded text-sm font-medium transition',
                        hotelViewMode === 'list'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800',
                      ]"
                    >
                      List
                    </button>
                    <button
                      @click="hotelViewMode = 'calendar'"
                      :class="[
                        'px-3 py-1.5 rounded text-sm font-medium transition',
                        hotelViewMode === 'calendar'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800',
                      ]"
                    >
                      Calendar
                    </button>
                  </div>
                </div>

                <!-- Calendar View -->
                <div v-if="hotelViewMode === 'calendar' && totalDays > 0">
                  <div
                    class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-300"
                  >
                    <div
                      class="bg-white rounded-xl shadow-inner overflow-hidden"
                    >
                      <div
                        class="grid gap-px bg-slate-200"
                        :style="`grid-template-columns: repeat(${totalDays}, 1fr)`"
                      >
                        <div
                          v-for="day in totalDays"
                          :key="`hotel-header-${day}`"
                          class="bg-slate-700 text-white p-3 text-center"
                        >
                          <div class="text-xs font-medium uppercase">
                            {{ getDayName(day) }}
                          </div>
                          <div class="text-lg font-bold mt-1">
                            {{ getDayNumber(day) }}
                          </div>
                        </div>
                      </div>

                      <div
                        class="grid gap-px bg-slate-200"
                        :style="`grid-template-columns: repeat(${totalDays}, 1fr)`"
                      >
                        <div
                          v-for="day in totalDays"
                          :key="`hotel-content-${day}`"
                          class="bg-white p-3 min-h-[200px]"
                        >
                          <div class="space-y-2">
                            <div
                              v-for="(hotel, idx) in getHotelsForDate(
                                getDayDateRaw(day),
                              )"
                              :key="idx"
                              class="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-2 text-xs shadow-sm group relative"
                            >
                              <button
                                @click="
                                  removeHotel(packageData.hotels.indexOf(hotel))
                                "
                                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                              >
                                ×
                              </button>
                              <div class="font-semibold">{{ hotel.name }}</div>
                              <div class="opacity-90 mt-1">
                                {{ hotel.variation }}
                              </div>
                              <div class="opacity-75 text-[10px] mt-1">
                                👥 {{ hotel.persons }} person(s)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- List View -->
                <div v-if="hotelViewMode === 'list'" class="space-y-2">
                  <div
                    v-for="(hotel, idx) in packageData.hotels"
                    :key="idx"
                    class="bg-white border-2 border-purple-200 rounded-xl p-4 relative group hover:shadow-md transition"
                  >
                    <div class="flex gap-2 absolute top-2 right-2">
                      <button
                        @click="editHotel(idx)"
                        class="w-6 h-6 bg-blue-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        @click="removeHotel(idx)"
                        class="w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                    <h4 class="font-semibold text-slate-800 text-base">
                      {{ hotel.name || "Unnamed Hotel" }}
                    </h4>
                    <div class="text-sm text-purple-600 mt-1">
                      {{ hotel.variation || "Room Type" }}
                    </div>
                    <div class="text-sm text-slate-600 mt-1">
                      {{ hotel.persons }} Person(s)
                    </div>
                    <div
                      v-if="hotel.checkIn && hotel.checkOut"
                      class="text-sm text-slate-500 mt-1"
                    >
                      {{ formatShortDate(hotel.checkIn) }} -
                      {{ formatShortDate(hotel.checkOut) }}
                      <span class="font-medium text-purple-600 ml-1">
                        ({{
                          calculateNights(hotel.checkIn, hotel.checkOut)
                        }}
                        night{{
                          calculateNights(hotel.checkIn, hotel.checkOut) > 1
                            ? "s"
                            : ""
                        }})
                      </span>
                    </div>
                    <div v-if="hotel.citiesCovered" class="mt-2">
                      <span class="text-xs text-slate-500">Cities: </span>
                      <span
                        class="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                      >
                        {{ hotel.citiesCovered }}
                      </span>
                    </div>
                  </div>
                  <div
                    v-if="packageData.hotels.length === 0"
                    class="text-center text-slate-400 text-sm py-12"
                  >
                    No hotels added yet
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Question 3: Van Tours -->
          <div v-if="activeQuestion === 3" class="h-full">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">
              Van Tour Services
            </h2>

            <div
              :class="
                vanTourViewMode === 'calendar'
                  ? 'grid grid-cols-1'
                  : 'grid grid-cols-2'
              "
              class="gap-6 h-[calc(100%-5rem)]"
            >
              <!-- LEFT SIDE: Add Form -->
              <div
                v-if="vanTourViewMode === 'list'"
                class="bg-white pl-2 pr-4 overflow-y-auto"
              >
                <h3 class="text-lg font-bold text-slate-700 mb-4">
                  {{
                    editingVanTour !== null ? "Edit Van Tour" : "Add Van Tour"
                  }}
                </h3>

                <div class="space-y-4">
                  <!-- Select Day instead of Service Date -->
                  <div>
                    <label
                      class="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Select Day
                    </label>
                    <select
                      v-model.number="newVanTour.dayNumber"
                      @change="onVanTourDayChange"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Day</option>
                      <option v-for="day in totalDays" :key="day" :value="day">
                        Day {{ day }} - {{ getDayDateShort(day)
                        }}{{ getDayCityText(day) }}
                      </option>
                    </select>
                  </div>

                  <!-- Step 1: Select Route/Service Product -->
                  <div v-if="newVanTour.dayNumber">
                    <label
                      class="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Select Service
                    </label>
                    <select
                      v-model="newVanTour.selectedProduct"
                      @change="onVanTourProductChange"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    >
                      <option value="">Choose a service</option>
                      <option
                        v-for="service in availableVanTourProducts"
                        :key="service"
                        :value="service"
                      >
                        {{ service }}
                      </option>
                    </select>
                  </div>

                  <!-- Step 2: Select Vehicle Variation -->
                  <div v-if="newVanTour.selectedProduct">
                    <label
                      class="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Select Vehicle Type
                    </label>
                    <div
                      class="space-y-2 max-h-64 overflow-y-auto bg-slate-50 border-2 border-slate-200 rounded-xl p-4"
                    >
                      <div
                        v-for="(variation, idx) in availableVanTourVariations"
                        :key="idx"
                        @click="selectVanTourVariation(variation)"
                        :class="[
                          'bg-white border-2 rounded-lg p-3 cursor-pointer transition',
                          newVanTour.selectedVariation?.type === variation.type
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50',
                        ]"
                      >
                        <div class="font-semibold text-sm text-slate-800">
                          {{ variation.type }}
                        </div>
                        <div class="text-xs text-slate-600 mt-1">
                          Capacity: {{ variation.capacity }} passengers
                        </div>
                        <div class="flex justify-between items-center mt-2">
                          <span class="text-xs text-emerald-600 font-bold"
                            >฿{{ variation.pricePerDay.toLocaleString() }} /
                            day</span
                          >
                          <span
                            v-if="
                              newVanTour.selectedVariation?.type ===
                              variation.type
                            "
                            class="text-xs text-emerald-600 font-semibold"
                            >✓ Selected</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button
                      v-if="editingVanTour !== null"
                      @click="cancelEditVanTour"
                      class="w-1/3 px-6 py-3 bg-slate-400 text-white rounded-xl font-semibold hover:bg-slate-500 transition"
                    >
                      Cancel
                    </button>
                    <button
                      @click="
                        editingVanTour !== null ? updateVanTour() : addVanTour()
                      "
                      :disabled="!newVanTour.selectedVariation"
                      :class="[
                        'px-6 py-3 rounded-xl font-semibold transition',
                        editingVanTour !== null ? 'w-2/3' : 'w-full',
                        newVanTour.selectedVariation
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed',
                      ]"
                    >
                      {{
                        editingVanTour !== null
                          ? "✓ Update Van Tour"
                          : "+ Add Van Tour"
                      }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- RIGHT SIDE: List with Toggle View -->
              <div
                class="bg-white rounded-xl border-2 border-slate-200 p-6 overflow-y-auto"
              >
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-slate-700">
                    Van Tours ({{ packageData.vanTours.length }})
                  </h3>

                  <!-- Toggle View Buttons -->
                  <div class="flex gap-2 bg-slate-100 rounded-xl p-1">
                    <button
                      @click="vanTourViewMode = 'list'"
                      :class="[
                        'px-3 py-1.5 rounded text-sm font-medium transition',
                        vanTourViewMode === 'list'
                          ? 'bg-white text-emerald-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800',
                      ]"
                    >
                      List
                    </button>
                    <button
                      @click="vanTourViewMode = 'calendar'"
                      :class="[
                        'px-3 py-1.5 rounded text-sm font-medium transition',
                        vanTourViewMode === 'calendar'
                          ? 'bg-white text-emerald-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800',
                      ]"
                    >
                      Calendar
                    </button>
                  </div>
                </div>

                <!-- Calendar View -->
                <div v-if="vanTourViewMode === 'calendar' && totalDays > 0">
                  <div
                    class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border-2 border-emerald-300"
                  >
                    <div
                      class="bg-white rounded-xl shadow-inner overflow-hidden"
                    >
                      <div
                        class="grid gap-px bg-slate-200"
                        :style="`grid-template-columns: repeat(${totalDays}, 1fr)`"
                      >
                        <div
                          v-for="day in totalDays"
                          :key="`van-header-${day}`"
                          class="bg-slate-700 text-white p-3 text-center"
                        >
                          <div class="text-xs font-medium uppercase">
                            {{ getDayName(day) }}
                          </div>
                          <div class="text-lg font-bold mt-1">
                            {{ getDayNumber(day) }}
                          </div>
                        </div>
                      </div>

                      <div
                        class="grid gap-px bg-slate-200"
                        :style="`grid-template-columns: repeat(${totalDays}, 1fr)`"
                      >
                        <div
                          v-for="day in totalDays"
                          :key="`van-content-${day}`"
                          class="bg-white p-3 min-h-[200px]"
                        >
                          <div class="space-y-2">
                            <div
                              v-for="(van, idx) in getVanToursForDate(
                                getDayDateRaw(day),
                              )"
                              :key="idx"
                              class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-2 text-xs shadow-sm group relative"
                            >
                              <button
                                @click="
                                  removeVanTour(
                                    packageData.vanTours.indexOf(van),
                                  )
                                "
                                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                              >
                                ×
                              </button>
                              <div class="font-semibold">{{ van.type }}</div>
                              <div class="opacity-90 mt-1">
                                {{ van.service }}
                              </div>
                              <div class="opacity-75 text-[10px] mt-1">
                                👥 {{ van.passengers }} pax
                              </div>
                              <div
                                v-if="van.pickupTime"
                                class="opacity-75 text-[10px] mt-1"
                              >
                                🕐 {{ van.pickupTime }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- List View -->
                <div v-if="vanTourViewMode === 'list'" class="space-y-2">
                  <div
                    v-for="(van, idx) in packageData.vanTours"
                    :key="idx"
                    class="bg-white border-2 border-emerald-200 rounded-xl p-4 relative group hover:shadow-md transition"
                  >
                    <div class="flex gap-2 absolute top-2 right-2">
                      <button
                        @click="editVanTour(idx)"
                        class="w-6 h-6 bg-blue-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        @click="removeVanTour(idx)"
                        class="w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                    <div class="text-xs text-emerald-500 font-semibold mb-1">
                      {{ van.dayLabel }}
                    </div>
                    <h4 class="font-semibold text-slate-800 text-base">
                      {{ van.type || "Van Tour" }}
                    </h4>
                    <div class="text-sm text-emerald-600 mt-1">
                      {{ van.service || "Service" }}
                    </div>
                    <div v-if="van.route" class="text-sm text-slate-600 mt-1">
                      {{ van.route }}
                    </div>
                    <div class="text-sm text-slate-600 mt-1">
                      {{ van.passengers }} Passenger(s)
                    </div>
                    <div
                      v-if="van.pickupTime"
                      class="text-sm text-slate-500 mt-1"
                    >
                      Pickup: {{ van.pickupTime }}
                      <span v-if="van.duration" class="ml-2"
                        >({{ van.duration }} hrs)</span
                      >
                    </div>
                  </div>
                  <div
                    v-if="packageData.vanTours.length === 0"
                    class="text-center text-slate-400 text-sm py-12"
                  >
                    No van tours added yet
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Question 5: Final Review -->
          <div v-if="activeQuestion === 4">
            <div class="mx-auto space-y-6">
              <!-- Package Summary (keep this as is) -->

              <!-- Table Format -->
              <div
                class="bg-white rounded-xl border-2 border-slate-200 overflow-hidden"
              >
                <table class="w-full">
                  <!-- Table Header -->
                  <thead>
                    <tr class="bg-orange-200">
                      <th
                        class="px-4 py-3 text-left font-bold text-slate-800 border-r border-slate-300"
                      >
                        SERVICE
                      </th>
                      <th
                        class="px-4 py-3 text-left font-bold text-slate-800 border-r border-slate-300"
                      >
                        DESCRIPTION
                      </th>
                      <th
                        class="px-4 py-3 text-center font-bold text-slate-800 border-r border-slate-300 w-24"
                      >
                        Estimate
                      </th>
                      <th
                        class="px-4 py-3 text-center font-bold text-slate-800 border-r border-slate-300 w-20"
                      >
                        QTY
                      </th>
                      <th
                        class="px-4 py-3 text-center font-bold text-slate-800 w-28"
                      >
                        Est: Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Loop through each day -->
                    <template
                      v-for="day in totalDays"
                      :key="`table-day-${day}`"
                    >
                      <!-- Day Header Row -->
                      <tr class="bg-white border-t-2 border-slate-300">
                        <td colspan="5" class="px-4 py-3">
                          <div class="flex items-center gap-2">
                            <span class="font-bold text-blue-700">{{
                              formatTableDate(getDayDateRaw(day))
                            }}</span>
                            <span
                              class="flex items-center gap-1 text-orange-600 font-semibold"
                            >
                              <span
                                class="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs"
                                >🚐</span
                              >
                              {{ getTableDayTitle(day) }}
                            </span>
                          </div>
                        </td>
                      </tr>

                      <!-- Van Tours for this day -->
                      <tr
                        v-for="(van, vIdx) in getVanToursForDate(
                          getDayDateRaw(day),
                        )"
                        :key="`van-${day}-${vIdx}`"
                        class="border-b border-slate-200 hover:bg-slate-50"
                      >
                        <td class="px-4 py-2 border-r border-slate-200">
                          <div class="flex items-center gap-2">
                            <span class="text-orange-600">◆</span>
                            <span class="font-medium">{{ van.type }}</span>
                          </div>
                        </td>
                        <td class="px-4 py-2 border-r border-slate-200">
                          {{ van.route || van.service }}
                        </td>
                        <td
                          class="px-4 py-2 text-right border-r border-slate-200 font-bold"
                        >
                          Estimate
                        </td>
                        <td
                          class="px-4 py-2 text-center border-r border-slate-200"
                        >
                          {{ van.passengers }}
                        </td>
                        <td class="px-4 py-2 text-right font-bold">Estimate</td>
                      </tr>

                      <!-- Attractions for this day -->
                      <tr
                        v-for="(attraction, aIdx) in getAttractionsForDate(
                          getDayDateRaw(day),
                        )"
                        :key="`attraction-${day}-${aIdx}`"
                        class="border-b border-slate-200 hover:bg-slate-50"
                      >
                        <td class="px-4 py-2 border-r border-slate-200">
                          <div class="flex items-center gap-2">
                            <span class="text-orange-600">◆</span>
                            <span class="font-medium"
                              >Entrance Fees
                              <span class="text-blue-600"
                                >(by Guide)</span
                              ></span
                            >
                          </div>
                        </td>
                        <td class="px-4 py-2 border-r border-slate-200">
                          {{ attraction.name }}
                        </td>
                        <td
                          class="px-4 py-2 text-right border-r border-slate-200"
                        >
                          {{ attraction.price }} ฿
                        </td>
                        <td
                          class="px-4 py-2 text-center border-r border-slate-200"
                        >
                          {{ attraction.adults + attraction.children }}
                        </td>
                        <td class="px-4 py-2 text-right font-bold">
                          {{
                            (
                              attraction.price *
                              (attraction.adults + attraction.children)
                            ).toLocaleString()
                          }}
                          ฿
                        </td>
                      </tr>

                      <!-- Hotels for this day -->
                      <tr
                        v-for="(hotel, hIdx) in getHotelsForDate(
                          getDayDateRaw(day),
                        )"
                        :key="`hotel-${day}-${hIdx}`"
                        class="border-b border-slate-200 hover:bg-slate-50"
                      >
                        <td class="px-4 py-2 border-r border-slate-200">
                          <div class="flex items-center gap-2">
                            <span class="text-orange-600">◆</span>
                            <span class="font-medium">Hotel</span>
                          </div>
                        </td>
                        <td class="px-4 py-2 border-r border-slate-200">
                          {{ hotel.name }} - {{ hotel.variation }}
                        </td>
                        <td
                          class="px-4 py-2 text-right border-r border-slate-200 font-bold"
                        >
                          Estimate
                        </td>
                        <td
                          class="px-4 py-2 text-center border-r border-slate-200"
                        >
                          {{ hotel.persons }}
                        </td>
                        <td class="px-4 py-2 text-right font-bold">Estimate</td>
                      </tr>
                    </template>

                    <!-- Footer Note -->
                    <tr
                      class="border-t-2 border-slate-400"
                      style="border-top-style: dashed"
                    >
                      <td colspan="5" class="px-4 py-4">
                        <p class="text-sm text-blue-700 font-semibold">
                          ** Please don't forget to attached all receipts.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Totals Section -->
                <div class="bg-white px-6 py-4 border-t-2 border-slate-300">
                  <div class="flex justify-end gap-8">
                    <div class="text-right">
                      <div class="mb-2">
                        <span class="font-medium">Estimate Trip charges =</span>
                        <span
                          class="ml-4 inline-block border-2 border-slate-800 px-4 py-1 font-bold text-lg min-w-[140px] text-right"
                        >
                          {{ calculateTotalEstimate() }} THB
                        </span>
                      </div>
                      <div class="mb-2">
                        <span class="font-medium"
                          >Advance payment to Guide =</span
                        >
                        <span
                          class="ml-4 inline-block border-2 border-slate-800 px-4 py-1 font-bold text-lg min-w-[140px] text-right"
                        >
                          {{ calculateAdvancePayment() }} THB
                        </span>
                      </div>
                      <div>
                        <span class="font-medium">Balance Payment =</span>
                        <span
                          class="ml-4 inline-block px-4 py-1 min-w-[140px]"
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Finalize Button -->
              <div class="flex justify-center pt-6">
                <button
                  @click="finalizePackage"
                  class="px-12 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 shadow-lg transition transform hover:scale-105"
                >
                  📦 Create Package & Send to Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, reactive, watch } from "vue";
import Layout from "./Layout.vue";

// View states
const currentView = ref("choose");
const activeQuestion = ref(0);

// View mode toggles
const attractionViewMode = ref("list");
const hotelViewMode = ref("list");
const vanTourViewMode = ref("list");

// Editing states
const editingAttraction = ref(null);
const editingHotel = ref(null);
const editingVanTour = ref(null);

// Questions navigation
const questions = ref([
  { title: "Trip Info", summary: "" },
  { title: "Attractions", summary: "" },
  { title: "Hotels", summary: "" },
  { title: "Van Tours", summary: "" },
  { title: "Final Review", summary: "" },
]);

// Main package data
const packageData = reactive({
  adults: 2,
  children: 0,
  startDate: "",
  nights: 3,
  attractions: [],
  hotels: [],
  vanTours: [],
});

// Form data for new items
const newAttraction = reactive({
  dayNumber: null,
  type: "Attraction",
  selectedProduct: "",
  selectedVariation: null,
  name: "",
  variation: "",
  adults: 2,
  children: 0,
  price: 0,
});

const newHotel = reactive({
  name: "",
  variation: "",
  persons: 2,
  checkIn: "",
  checkOut: "",
  selectedProduct: "",
  selectedVariation: null,
  pricePerNight: 0,
});

const newVanTour = reactive({
  dayNumber: null,
  selectedProduct: "",
  selectedVariation: null,
  type: "",
  service: "",
  route: "",
  passengers: 2,
  pickupTime: "",
  duration: null,
});

// Day-City mapping (tracks which city is assigned to each day)
const dayCityMap = reactive({});

// Mock data for search results - organized by city and product
const mockAttractions = {
  "Chiang Mai": {
    "Doi Inthanon National Park": [
      {
        name: "Standard Package",
        description: "Includes waterfall visits and summit",
        price: 300,
      },
      {
        name: "Premium Package",
        description: "With lunch and local guide",
        price: 450,
      },
    ],
    "Wat Phra That Doi Suthep": [
      {
        name: "Temple Entry Only",
        description: "Basic entrance to the temple",
        price: 100,
      },
      {
        name: "With Guide Tour",
        description: "Guided temple tour included",
        price: 200,
      },
    ],
    "Queen Sirikit Botanic Garden": [
      {
        name: "General Admission",
        description: "Access to all gardens",
        price: 100,
      },
      {
        name: "VIP Tour",
        description: "Private garden tour with botanist",
        price: 350,
      },
    ],
  },
  "Chiang Rai": {
    "White Temple (Wat Rong Khun)": [
      {
        name: "Standard Entry",
        description: "Basic temple entrance",
        price: 200,
      },
      {
        name: "Photography Package",
        description: "With special photo spots",
        price: 300,
      },
    ],
    "Black House Museum": [
      {
        name: "Museum Entry",
        description: "Access to all exhibits",
        price: 100,
      },
      {
        name: "Guided Tour",
        description: "With art historian guide",
        price: 250,
      },
    ],
    "Blue Temple (Wat Rong Suea Ten)": [
      {
        name: "Temple Entry",
        description: "General admission",
        price: 60,
      },
    ],
  },
  Bangkok: {
    "Grand Palace": [
      {
        name: "Standard Entry",
        description: "Access to palace complex",
        price: 500,
      },
      {
        name: "VIP Tour",
        description: "Skip line with guide",
        price: 800,
      },
    ],
    "Wat Arun": [
      {
        name: "Temple Entry",
        description: "Climb the central prang",
        price: 100,
      },
    ],
    "Chatuchak Market": [
      {
        name: "Market Walking Tour",
        description: "Guided tour with tastings",
        price: 150,
      },
    ],
  },
};

const mockHotels = {
  "Chiang Mai": {
    "Asana Grove Hotel": [
      { roomType: "Deluxe Room", pricePerNight: 2500 },
      { roomType: "Suite", pricePerNight: 4000 },
      { roomType: "Villa", pricePerNight: 6500 },
    ],
    "Hyatt Regency": [
      { roomType: "Standard Room", pricePerNight: 3500 },
      { roomType: "Deluxe Room", pricePerNight: 4500 },
      { roomType: "Executive Suite", pricePerNight: 7000 },
    ],
    "Sheraton Yogyakarta": [
      { roomType: "Superior Room", pricePerNight: 3000 },
      { roomType: "Suite", pricePerNight: 4500 },
    ],
  },
  Bangkok: {
    "Mandarin Oriental": [
      { roomType: "Deluxe Room", pricePerNight: 8000 },
      { roomType: "Suite", pricePerNight: 15000 },
    ],
    "Lebua Hotel": [
      { roomType: "Standard Room", pricePerNight: 10000 },
      { roomType: "Sky Suite", pricePerNight: 12000 },
    ],
  },
  "Chiang Rai": {
    "Le Meridien": [
      { roomType: "Standard Room", pricePerNight: 2800 },
      { roomType: "Deluxe Room", pricePerNight: 3500 },
    ],
    "Katiliya Hotel": [
      { roomType: "Superior Room", pricePerNight: 2200 },
      { roomType: "Deluxe Room", pricePerNight: 3000 },
    ],
  },
};

const mockVanTours = {
  "Airport Transfer": [
    { type: "Sedan (3 pax)", capacity: 3, pricePerDay: 1500 },
    { type: "Van (9 pax)", capacity: 9, pricePerDay: 2500 },
    { type: "Minibus (15 pax)", capacity: 15, pricePerDay: 4000 },
  ],
  "City Tour": [
    { type: "Van (9 pax)", capacity: 9, pricePerDay: 3000 },
    { type: "Minibus (15 pax)", capacity: 15, pricePerDay: 4500 },
    { type: "Bus (30 pax)", capacity: 30, pricePerDay: 7000 },
  ],
  "Day Trip": [
    { type: "Van (9 pax)", capacity: 9, pricePerDay: 3500 },
    { type: "Minibus (15 pax)", capacity: 15, pricePerDay: 5000 },
    { type: "Bus (30 pax)", capacity: 30, pricePerDay: 8000 },
  ],
  "Temple Tour": [
    { type: "Van (9 pax)", capacity: 9, pricePerDay: 2800 },
    { type: "Minibus (15 pax)", capacity: 15, pricePerDay: 4200 },
  ],
};

// Computed properties
const totalDays = computed(() =>
  packageData.nights > 0 ? packageData.nights + 1 : 0,
);

const endDateCalculated = computed(() => {
  if (!packageData.startDate || packageData.nights <= 0) return "";
  const start = new Date(packageData.startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + packageData.nights);
  return end.toISOString().split("T")[0];
});

// Get unique cities in the trip
const uniqueCitiesInTrip = computed(() => {
  const cities = Object.values(dayCityMap).filter((city) => city);
  return [...new Set(cities)];
});

// Available products based on city
const availableAttractionProducts = computed(() => {
  if (!newAttraction.dayNumber) return [];
  const city = dayCityMap[newAttraction.dayNumber];
  if (!city || !mockAttractions[city]) return [];
  return Object.keys(mockAttractions[city]);
});

const availableAttractionVariations = computed(() => {
  if (!newAttraction.selectedProduct || !newAttraction.dayNumber) return [];
  const city = dayCityMap[newAttraction.dayNumber];
  if (!city || !mockAttractions[city]) return [];
  return mockAttractions[city][newAttraction.selectedProduct] || [];
});

const availableHotelProducts = computed(() => {
  if (hotelDateRangeInfo.value.cities.length === 0) return [];
  const cities = hotelDateRangeInfo.value.cities;

  // Combine hotels from all cities
  let hotels = [];
  cities.forEach((city) => {
    if (mockHotels[city]) {
      hotels = [...hotels, ...Object.keys(mockHotels[city])];
    }
  });

  return [...new Set(hotels)]; // Remove duplicates
});

const availableHotelVariations = computed(() => {
  if (!newHotel.selectedProduct || hotelDateRangeInfo.value.cities.length === 0)
    return [];

  // Find the hotel in any of the cities
  for (const city of hotelDateRangeInfo.value.cities) {
    if (mockHotels[city] && mockHotels[city][newHotel.selectedProduct]) {
      return mockHotels[city][newHotel.selectedProduct];
    }
  }

  return [];
});

const availableVanTourProducts = computed(() => {
  return Object.keys(mockVanTours);
});

const availableVanTourVariations = computed(() => {
  if (!newVanTour.selectedProduct) return [];
  return mockVanTours[newVanTour.selectedProduct] || [];
});

// Calculate which days/cities the hotel date range covers
const hotelDateRangeInfo = computed(() => {
  if (!newHotel.checkIn || !newHotel.checkOut || !packageData.startDate) {
    return { days: [], nights: 0, cities: [] };
  }

  const checkIn = new Date(newHotel.checkIn);
  const checkOut = new Date(newHotel.checkOut);
  const tripStart = new Date(packageData.startDate);

  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  // Get all days covered (check-in day to day before check-out)
  const days = [];
  const cities = new Set();

  for (
    let date = new Date(checkIn);
    date < checkOut;
    date.setDate(date.getDate() + 1)
  ) {
    const dayNumber =
      Math.floor((date - tripStart) / (1000 * 60 * 60 * 24)) + 1;
    if (dayNumber >= 1 && dayNumber <= totalDays.value) {
      const city = dayCityMap[dayNumber];
      days.push({ day: dayNumber, city: city });
      if (city) cities.add(city);
    }
  }

  return {
    days,
    nights,
    cities: Array.from(cities),
  };
});

// Navigation functions
const startCreation = (type) => {
  currentView.value = "questions";
};

// Attraction handlers
const onAttractionDayChange = () => {
  newAttraction.selectedProduct = "";
  newAttraction.selectedVariation = null;
};

const onAttractionProductChange = () => {
  newAttraction.selectedVariation = null;
};

const selectAttractionVariation = (variation) => {
  newAttraction.selectedVariation = variation;
  newAttraction.name = variation.name;
  newAttraction.variation = variation.description;
  newAttraction.price = variation.price;
  newAttraction.adults = packageData.adults;
  newAttraction.children = packageData.children;
};

const addAttraction = () => {
  if (!newAttraction.dayNumber || !newAttraction.selectedVariation) {
    alert("Please select a day and a variation");
    return;
  }

  const dayDate = getDayDateRaw(newAttraction.dayNumber);
  const city = dayCityMap[newAttraction.dayNumber];

  packageData.attractions.push({
    type: newAttraction.type,
    dayNumber: newAttraction.dayNumber,
    serviceDate: dayDate,
    city: city,
    dayLabel: `Feb ${getDayDateShort(newAttraction.dayNumber).split(" ")[1]}`,
    product: newAttraction.selectedProduct,
    name: newAttraction.name,
    variation: newAttraction.variation,
    adults: newAttraction.adults,
    children: newAttraction.children,
    price: newAttraction.price,
  });

  // Reset form
  Object.assign(newAttraction, {
    dayNumber: null,
    type: "Attraction",
    selectedProduct: "",
    selectedVariation: null,
    name: "",
    variation: "",
    adults: packageData.adults,
    children: packageData.children,
    price: 0,
  });
};

const editAttraction = (index) => {
  const item = packageData.attractions[index];
  editingAttraction.value = index;

  Object.assign(newAttraction, {
    dayNumber: item.dayNumber,
    type: item.type,
    selectedProduct: item.product,
    selectedVariation: {
      name: item.name,
      description: item.variation,
      price: item.price,
    },
    name: item.name,
    variation: item.variation,
    adults: item.adults,
    children: item.children,
    price: item.price,
  });

  attractionViewMode.value = "list";
};

const updateAttraction = () => {
  if (editingAttraction.value === null) return;

  const dayDate = getDayDateRaw(newAttraction.dayNumber);
  const city = dayCityMap[newAttraction.dayNumber];

  packageData.attractions[editingAttraction.value] = {
    type: newAttraction.type,
    dayNumber: newAttraction.dayNumber,
    serviceDate: dayDate,
    city: city,
    dayLabel: `Feb ${getDayDateShort(newAttraction.dayNumber).split(" ")[1]}`,
    product: newAttraction.selectedProduct,
    name: newAttraction.name,
    variation: newAttraction.variation,
    adults: newAttraction.adults,
    children: newAttraction.children,
    price: newAttraction.price,
  };

  cancelEditAttraction();
};

const cancelEditAttraction = () => {
  editingAttraction.value = null;
  Object.assign(newAttraction, {
    dayNumber: null,
    type: "Attraction",
    selectedProduct: "",
    selectedVariation: null,
    name: "",
    variation: "",
    adults: packageData.adults,
    children: packageData.children,
    price: 0,
  });
};

const removeAttraction = (index) => {
  packageData.attractions.splice(index, 1);
  if (editingAttraction.value === index) {
    cancelEditAttraction();
  }
};

const getAttractionsForDate = (dateStr) => {
  return packageData.attractions.filter((a) => a.serviceDate === dateStr);
};

// Hotel handlers
const onHotelDateChange = () => {
  newHotel.selectedProduct = "";
  newHotel.selectedVariation = null;
};

const onHotelProductChange = () => {
  newHotel.selectedVariation = null;
};

const selectHotelVariation = (variation) => {
  newHotel.selectedVariation = variation;
  newHotel.variation = variation.roomType;
  newHotel.pricePerNight = variation.pricePerNight;
};

const addHotel = () => {
  if (!newHotel.checkIn || !newHotel.checkOut || !newHotel.selectedVariation) {
    alert("Please select dates and a room variation");
    return;
  }

  const citiesCovered = hotelDateRangeInfo.value.cities.join(", ");

  packageData.hotels.push({
    name: newHotel.selectedProduct,
    variation: newHotel.variation,
    persons: newHotel.persons,
    checkIn: newHotel.checkIn,
    checkOut: newHotel.checkOut,
    citiesCovered: citiesCovered,
    pricePerNight: newHotel.pricePerNight,
  });

  // Reset form
  Object.assign(newHotel, {
    name: "",
    variation: "",
    persons: packageData.adults + packageData.children,
    checkIn: "",
    checkOut: "",
    selectedProduct: "",
    selectedVariation: null,
    pricePerNight: 0,
  });
};

const editHotel = (index) => {
  const item = packageData.hotels[index];
  editingHotel.value = index;

  Object.assign(newHotel, {
    name: item.name,
    variation: item.variation,
    persons: item.persons,
    checkIn: item.checkIn,
    checkOut: item.checkOut,
    selectedProduct: item.name,
    selectedVariation: {
      roomType: item.variation,
      pricePerNight: item.pricePerNight,
    },
    pricePerNight: item.pricePerNight,
  });

  hotelViewMode.value = "list";
};

const updateHotel = () => {
  if (editingHotel.value === null) return;

  const citiesCovered = hotelDateRangeInfo.value.cities.join(", ");

  packageData.hotels[editingHotel.value] = {
    name: newHotel.selectedProduct,
    variation: newHotel.variation,
    persons: newHotel.persons,
    checkIn: newHotel.checkIn,
    checkOut: newHotel.checkOut,
    citiesCovered: citiesCovered,
    pricePerNight: newHotel.pricePerNight,
  };

  cancelEditHotel();
};

const cancelEditHotel = () => {
  editingHotel.value = null;
  Object.assign(newHotel, {
    name: "",
    variation: "",
    persons: packageData.adults + packageData.children,
    checkIn: "",
    checkOut: "",
    selectedProduct: "",
    selectedVariation: null,
    pricePerNight: 0,
  });
};

const removeHotel = (index) => {
  packageData.hotels.splice(index, 1);
  if (editingHotel.value === index) {
    cancelEditHotel();
  }
};

const getHotelsForDate = (dateStr) => {
  const currentDate = new Date(dateStr);
  return packageData.hotels.filter((hotel) => {
    const checkIn = new Date(hotel.checkIn);
    const checkOut = new Date(hotel.checkOut);
    return checkIn <= currentDate && currentDate < checkOut;
  });
};

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
};

// Van Tour handlers
const onVanTourDayChange = () => {
  newVanTour.selectedProduct = "";
  newVanTour.selectedVariation = null;
};

const onVanTourProductChange = () => {
  newVanTour.selectedVariation = null;
};

const selectVanTourVariation = (variation) => {
  newVanTour.selectedVariation = variation;
  newVanTour.type = variation.type;
  newVanTour.passengers = packageData.adults + packageData.children;
};

const addVanTour = () => {
  if (!newVanTour.dayNumber || !newVanTour.selectedVariation) {
    alert("Please select a day and vehicle type");
    return;
  }

  const dayDate = getDayDateRaw(newVanTour.dayNumber);
  const city = dayCityMap[newVanTour.dayNumber];

  packageData.vanTours.push({
    dayNumber: newVanTour.dayNumber,
    serviceDate: dayDate,
    city: city,
    dayLabel: `Feb ${getDayDateShort(newVanTour.dayNumber).split(" ")[1]}`,
    route: newVanTour.selectedProduct,
    type: newVanTour.type,
    service: newVanTour.selectedProduct,
    passengers: newVanTour.passengers,
    pickupTime: newVanTour.pickupTime,
    duration: newVanTour.duration,
  });

  // Reset form
  Object.assign(newVanTour, {
    dayNumber: null,
    selectedProduct: "",
    selectedVariation: null,
    type: "",
    service: "",
    route: "",
    passengers: packageData.adults + packageData.children,
    pickupTime: "",
    duration: null,
  });
};

const editVanTour = (index) => {
  const item = packageData.vanTours[index];
  editingVanTour.value = index;

  Object.assign(newVanTour, {
    dayNumber: item.dayNumber,
    selectedProduct: item.route,
    selectedVariation: {
      type: item.type,
      capacity: item.passengers,
    },
    type: item.type,
    service: item.service,
    route: item.route,
    passengers: item.passengers,
    pickupTime: item.pickupTime || "",
    duration: item.duration || null,
  });

  vanTourViewMode.value = "list";
};

const updateVanTour = () => {
  if (editingVanTour.value === null) return;

  const dayDate = getDayDateRaw(newVanTour.dayNumber);
  const city = dayCityMap[newVanTour.dayNumber];

  packageData.vanTours[editingVanTour.value] = {
    dayNumber: newVanTour.dayNumber,
    serviceDate: dayDate,
    city: city,
    dayLabel: `Feb ${getDayDateShort(newVanTour.dayNumber).split(" ")[1]}`,
    route: newVanTour.selectedProduct,
    type: newVanTour.type,
    service: newVanTour.selectedProduct,
    passengers: newVanTour.passengers,
    pickupTime: newVanTour.pickupTime,
    duration: newVanTour.duration,
  };

  cancelEditVanTour();
};

const cancelEditVanTour = () => {
  editingVanTour.value = null;
  Object.assign(newVanTour, {
    dayNumber: null,
    selectedProduct: "",
    selectedVariation: null,
    type: "",
    service: "",
    route: "",
    passengers: packageData.adults + packageData.children,
    pickupTime: "",
    duration: null,
  });
};

const removeVanTour = (index) => {
  packageData.vanTours.splice(index, 1);
  if (editingVanTour.value === index) {
    cancelEditVanTour();
  }
};

const getVanToursForDate = (dateStr) => {
  return packageData.vanTours.filter((v) => v.serviceDate === dateStr);
};

// Get short date for day dropdown
const getDayDateShort = (dayNumber) => {
  if (!packageData.startDate) return "";
  const start = new Date(packageData.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Get city text for day dropdown
const getDayCityText = (dayNumber) => {
  const city = dayCityMap[dayNumber];
  return city ? ` (${city})` : "";
};

// Get date day info (for showing under date inputs)
const getDateDayInfo = (dateStr) => {
  if (!packageData.startDate || !dateStr) return "";
  const start = new Date(packageData.startDate);
  const current = new Date(dateStr);
  const dayNumber = Math.floor((current - start) / (1000 * 60 * 60 * 24)) + 1;

  if (dayNumber < 1 || dayNumber > totalDays.value) return "Outside trip dates";

  const city = dayCityMap[dayNumber];
  return city
    ? `Day ${dayNumber} - ${city}`
    : `Day ${dayNumber} - No city assigned`;
};

// Get city for a specific day (date-based for calendar views)
const getDayCity = (dateStr) => {
  if (!packageData.startDate) return "";
  const start = new Date(packageData.startDate);
  const current = new Date(dateStr);
  const dayNumber = Math.floor((current - start) / (1000 * 60 * 60 * 24)) + 1;
  return dayCityMap[dayNumber] || "";
};

// Date formatting utilities
const getDayDateRaw = (dayNumber) => {
  if (!packageData.startDate) return "";
  const start = new Date(packageData.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current.toISOString().split("T")[0];
};

const getDayName = (dayNumber) => {
  if (!packageData.startDate) return "";
  const start = new Date(packageData.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
};

const getDayNumber = (dayNumber) => {
  if (!packageData.startDate) return "";
  const start = new Date(packageData.startDate);
  const current = new Date(start);
  current.setDate(start.getDate() + dayNumber - 1);
  return current.getDate();
};

const formatShortDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Format date for table (e.g., "12-Feb-2026")
const formatTableDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Get table day title (e.g., "Airport pick-up & Chiang Rai visit")
const getTableDayTitle = (dayNumber) => {
  const dayDate = getDayDateRaw(dayNumber);
  const city = dayCityMap[dayNumber];
  const attractions = getAttractionsForDate(dayDate);
  const vanTours = getVanToursForDate(dayDate);

  // Build title from items
  let parts = [];

  if (vanTours.length > 0) {
    parts.push(vanTours[0].route || vanTours[0].service);
  }

  if (city) {
    parts.push(`${city} visit`);
  }

  return parts.length > 0 ? parts.join(" & ") : "Day activities";
};

// Calculate total estimate
const calculateTotalEstimate = () => {
  let total = 0;

  // Add attractions
  packageData.attractions.forEach((item) => {
    total += (item.price || 0) * (item.adults + item.children);
  });

  return total.toLocaleString();
};

// Calculate advance payment (typically same as estimate in your example)
const calculateAdvancePayment = () => {
  const total = calculateTotalEstimate();
  // Remove comma for calculation, then format
  const numTotal = parseInt(total.replace(/,/g, ""));
  // In your example, advance is slightly less, you can adjust this
  return Math.floor(numTotal * 0.97).toLocaleString();
};

// Final action
const finalizePackage = () => {
  alert("Package created successfully! 🎉\n\nReady to send to customer.");
  console.log("Final Package:", packageData);
};
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
