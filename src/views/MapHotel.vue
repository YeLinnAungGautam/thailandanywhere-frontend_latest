<template>
  <Layout>
    <div class="relative w-full h-full">
      <div class="fixed inset-0 w-full h-full overflow-hidden overscroll-none">
        <!-- Redesigned Filter Bar - Always Visible -->
        <div class="absolute top-5 right-4 transform w-[30%] z-[1001]">
          <div class="bg-white rounded-2xl shadow-lg p-4 space-y-3">
            <!-- Type Selection Row -->
            <div class="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div class="flex justify-between items-center w-full">
                <p class="text-xs text-gray-500">choose type</p>
                <div
                  class="flex justify-end items-center border border-gray-200 gap-x-0 rounded-full divide-x divide-x-gray-200 overflow-hidden cursor-pointer"
                >
                  <p
                    class="text-[11px] px-3 py-1"
                    @click="selectPart = 'hotel'"
                    :class="
                      selectPart === 'hotel'
                        ? 'bg-[#FF613c] text-white'
                        : 'text-gray-600'
                    "
                  >
                    Hotels
                  </p>
                  <p
                    class="text-[11px] px-3 py-1"
                    @click="selectPart = 'attraction'"
                    :class="
                      selectPart == 'attraction'
                        ? 'bg-[#FF613c] text-white'
                        : 'text-gray-600'
                    "
                  >
                    Attractions
                  </p>
                </div>
              </div>
            </div>

            <!-- City Filter -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <p class="text-xs font-semibold text-gray-700">City</p>
                <div class="flex justify-end">
                  <button
                    @click="toggleSearchPanel"
                    class="flex items-center gap-2 text-xs font-medium bg-white text-[#FF613c] rounded-full cursor-pointer transition-all"
                  >
                    See More
                  </button>
                </div>
              </div>
              <div
                class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
              >
                <button
                  @click="setCity('')"
                  :class="[
                    selectedCity === ''
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  All Cities
                </button>
                <button
                  v-for="city in visibleCities"
                  :key="city.id"
                  @click="setCity(city.id)"
                  :class="[
                    selectedCity === city.id
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  {{ city.name }}
                </button>
              </div>
            </div>

            <!-- Place Filter (shown when city is selected) -->
            <div v-if="selectedCity && visiblePlaces && selectPart == 'hotel'">
              <div class="flex justify-between items-center mb-3">
                <p class="text-xs font-semibold text-gray-700">Place</p>
                <div class="flex justify-end">
                  <button
                    @click="toggleSearchPanel"
                    class="flex items-center gap-2 text-xs font-medium bg-white text-[#FF613c] rounded-full cursor-pointer transition-all"
                  >
                    See More
                  </button>
                </div>
              </div>
              <div
                class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
              >
                <button
                  @click="selectedPlace = ''"
                  :class="[
                    selectedPlace === ''
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  All Places
                </button>
                <button
                  v-for="place in visiblePlaces"
                  :key="place"
                  @click="setPlace(place.name)"
                  :class="[
                    selectedPlace === place.name
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  {{ place.name }}
                </button>
              </div>
            </div>

            <!-- Category Filter (only shown when attraction is selected) -->
            <div
              v-if="
                selectPart === 'attraction' && attractionCategories.length > 0
              "
            >
              <div class="flex justify-between items-center mb-3">
                <p class="text-xs font-semibold text-gray-700">Category</p>
                <div class="flex justify-end">
                  <button
                    @click="toggleSearchPanel"
                    class="flex items-center gap-2 text-xs font-medium bg-white text-[#FF613c] rounded-full cursor-pointer transition-all"
                  >
                    See More
                  </button>
                </div>
              </div>
              <div
                class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
              >
                <button
                  @click="selectedCategory = ''"
                  :class="[
                    selectedCategory === ''
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  All Categories
                </button>
                <button
                  v-for="category in visibleCategories"
                  :key="category.id"
                  @click="setCategory(category.id)"
                  :class="[
                    selectedCategory === category.id
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>

            <!-- Price Filter -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <p class="text-xs font-semibold text-gray-700">Price Range</p>
                <div class="flex justify-end">
                  <button
                    @click="toggleSearchPanel"
                    class="flex items-center gap-2 text-xs font-medium bg-white text-[#FF613c] rounded-full cursor-pointer transition-all"
                  >
                    See More
                  </button>
                </div>
              </div>
              <div
                class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
              >
                <button
                  @click="setPriceFilter('')"
                  :class="[
                    priceFilter === ''
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  All Prices
                </button>
                <button
                  @click="setPriceFilter('0-1200')"
                  :class="[
                    priceFilter === '0-1200'
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  Budget <span class="text-[10px]">(&lt; 1200฿)</span>
                </button>
                <button
                  @click="setPriceFilter('1200-1800')"
                  :class="[
                    priceFilter === '1200-1800'
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  Standard <span class="text-[10px]">(1200-1800฿)</span>
                </button>
                <button
                  @click="setPriceFilter('1800-3000')"
                  :class="[
                    priceFilter === '1800-3000'
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  Premium <span class="text-[10px]">(1800-3000฿)</span>
                </button>
                <button
                  @click="setPriceFilter('3000-100000')"
                  :class="[
                    priceFilter === '3000-100000'
                      ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                    { 'bg-gray-300 text-black/30': loading },
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                >
                  Luxury <span class="text-[10px]">(3000+฿)</span>
                </button>
              </div>
            </div>

            <!-- Destination Filter - Scrollable Horizontal (only show when not in attraction mode) -->
            <div v-if="destinations.length > 0 && selectPart !== 'attraction'">
              <div class="flex justify-between items-center mb-3">
                <p class="text-xs font-semibold text-gray-700">Destinations</p>
                <button
                  class="text-xs font-medium text-red-500 cursor-pointer"
                  @click="openDestinationModal = true"
                >
                  See More
                </button>
              </div>
              <div
                class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
              >
                <button
                  v-for="dest in destinations
                    ? destinations.find((d) => d.city.id === selectedCity)
                      ? destinations.filter((d) => d.city.id === selectedCity)
                      : []
                    : []"
                  :key="dest.id"
                  @click="selectDestination(dest)"
                  :class="[
                    selectedDestination?.id === dest.id
                      ? 'border-[#4299e1] text-[#4299e1] bg-[#4299e1]/10'
                      : 'border-gray-300 bg-white text-gray-700',
                  ]"
                  class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md flex items-center gap-1"
                >
                  <span>{{ dest.name }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal with Destinations -->
        <Modal
          :isOpen="openDestinationModal"
          :marginTop="'mt-6'"
          @closeModal="openDestinationModal = false"
        >
          <DialogPanel
            class="w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl"
          >
            <div class="space-y-4">
              <!-- Header -->
              <div
                class="flex items-center justify-between pb-3 border-b border-gray-200"
              >
                <h2 class="text-lg font-semibold text-gray-900">
                  Search Destinations
                </h2>
                <button
                  @click="openDestinationModal = false"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

              <!-- Search Input -->
              <div class="relative">
                <input
                  v-model="destinationSearchQuery"
                  type="text"
                  placeholder="Search destinations by name..."
                  class="w-full px-4 py-3 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4299e1] focus:border-transparent"
                />
                <svg
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <!-- City Filter Dropdown -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Filter by City
                </label>
                <div
                  class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
                >
                  <button
                    @click="setCity('')"
                    :class="[
                      selectedCity === ''
                        ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                        : 'border-gray-300 bg-white text-gray-700',
                      { 'bg-gray-300 text-black/30': loading },
                    ]"
                    class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                  >
                    All Cities
                  </button>
                  <button
                    v-for="city in cityList"
                    :key="city.id"
                    @click="setCity(city.id)"
                    :class="[
                      selectedCity === city.id
                        ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                        : 'border-gray-300 bg-white text-gray-700',
                      { 'bg-gray-300 text-black/30': loading },
                    ]"
                    class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                  >
                    {{ city.name }}
                  </button>
                </div>
              </div>

              <!-- Destinations List -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium text-gray-700">
                    Available Destinations ({{
                      filteredDestinationsForModal.length
                    }})
                  </label>
                  <button
                    v-if="selectedCity || destinationSearchQuery"
                    @click="clearDestinationFilters"
                    class="text-xs text-[#FF613c] hover:text-[#ff4d28] font-medium"
                  >
                    Clear Filters
                  </button>
                </div>

                <!-- Scrollable Destinations -->
                <div
                  class="max-h-[300px] overflow-y-auto scroll-container-y space-y-2 pr-2"
                >
                  <div
                    v-if="filteredDestinationsForModal.length === 0"
                    class="text-center py-12 text-gray-500"
                  >
                    <svg
                      class="w-16 h-16 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p class="text-sm">No destinations found</p>
                    <p class="text-xs mt-1">
                      Try adjusting your search criteria
                    </p>
                  </div>

                  <div
                    v-for="dest in filteredDestinationsForModal"
                    :key="dest.id"
                    @click="selectDestinationFromModal(dest)"
                    class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#4299e1] hover:bg-[#4299e1]/5 cursor-pointer transition-all group"
                    :class="
                      selectedDestination?.id === dest.id
                        ? 'border-[#4299e1] bg-[#4299e1]/10'
                        : ''
                    "
                  >
                    <!-- Destination Image -->
                    <div
                      class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        :src="dest.feature_img"
                        :alt="dest.name"
                        class="w-full h-full object-cover"
                      />
                    </div>

                    <!-- Destination Info -->
                    <div class="flex-1 min-w-0">
                      <h3
                        class="font-semibold text-sm mb-1 truncate"
                        :class="
                          selectedDestination?.id === dest.id
                            ? 'text-[#4299e1]'
                            : 'text-gray-900'
                        "
                      >
                        {{ dest.name }}
                      </h3>
                      <p class="text-xs text-gray-600 mb-1">
                        {{ dest.city?.name || "Unknown City" }}
                      </p>
                      <span
                        class="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {{ getNearbyHotels(dest).length }} hotels nearby
                      </span>
                    </div>

                    <!-- Selected Indicator -->
                    <div
                      v-if="selectedDestination?.id === dest.id"
                      class="flex-shrink-0"
                    >
                      <svg
                        class="w-6 h-6 text-[#4299e1]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div
                class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200"
              >
                <button
                  @click="openDestinationModal = false"
                  class="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  v-if="selectedDestination"
                  @click="
                    clearDestination();
                    openDestinationModal = false;
                  "
                  class="px-4 py-2 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear
                </button>
                <button
                  v-if="selectedDestination"
                  @click="openDestinationModal = false"
                  class="px-4 py-2 text-xs font-medium text-white bg-[#FF613c] rounded-lg hover:bg-[#FF613c] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </DialogPanel>
        </Modal>

        <!-- Modal with Destinations -->
        <Modal
          :isOpen="showSearchPanel"
          :marginTop="'mt-16'"
          @closeModal="toggleSearchPanel()"
        >
          <DialogPanel
            class="w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl"
          >
            <div>
              <div class="grid grid-cols-2 gap-2">
                <div class="col-span-2 pb-3">
                  <div>
                    <p class="text-sm text-[#FF613c] font-medium mb-3">
                      Price Range
                    </p>
                    <div
                      class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
                    >
                      <button
                        @click="setPriceFilter('')"
                        :class="[
                          priceFilter === ''
                            ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                            : 'border-gray-300 bg-white text-gray-700',
                          { 'bg-gray-300 text-black/30': loading },
                        ]"
                        class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                      >
                        All Prices
                      </button>
                      <button
                        @click="setPriceFilter('0-1200')"
                        :class="[
                          priceFilter === '0-1200'
                            ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                            : 'border-gray-300 bg-white text-gray-700',
                          { 'bg-gray-300 text-black/30': loading },
                        ]"
                        class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                      >
                        Budget <span class="text-[10px]">(&lt; 1200฿)</span>
                      </button>
                      <button
                        @click="setPriceFilter('1200-1800')"
                        :class="[
                          priceFilter === '1200-1800'
                            ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                            : 'border-gray-300 bg-white text-gray-700',
                          { 'bg-gray-300 text-black/30': loading },
                        ]"
                        class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                      >
                        Standard <span class="text-[10px]">(1200-1800฿)</span>
                      </button>
                      <button
                        @click="setPriceFilter('1800-3000')"
                        :class="[
                          priceFilter === '1800-3000'
                            ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                            : 'border-gray-300 bg-white text-gray-700',
                          { 'bg-gray-300 text-black/30': loading },
                        ]"
                        class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                      >
                        Premium <span class="text-[10px]">(1800-3000฿)</span>
                      </button>
                      <button
                        @click="setPriceFilter('3000-100000')"
                        :class="[
                          priceFilter === '3000-100000'
                            ? 'border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                            : 'border-gray-300 bg-white text-gray-700',
                          { 'bg-gray-300 text-black/30': loading },
                        ]"
                        class="whitespace-nowrap px-4 py-2 text-xs font-medium border rounded-full cursor-pointer transition-all hover:shadow-md"
                      >
                        Luxury <span class="text-[10px]">(3000+฿)</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="selectPart != 'attraction'">
                  <h2 class="text-sm text-[#FF613c] font-medium">
                    Choose City
                  </h2>
                  <div
                    class="space-y-1 h-[250px] pr-2 pl-1 pt-3 overflow-y-scroll scroll-container-y"
                  >
                    <div
                      class="flex justify-between items-center space-y-2 pb-3 pt-1.5 px-3 border rounded-full cursor-pointer"
                      v-for="c in cityList ?? []"
                      :key="c"
                      :class="
                        c.id == selectedCity
                          ? ' border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                          : ''
                      "
                      @click="
                        () => {
                          selectedCity = c.id;
                          chooseCityName = c.name;
                        }
                      "
                    >
                      <p
                        class="text-xs w-[110px] mt-1.5 line-clamp-1"
                        :class="c.id == selectedCity ? 'text-[#FF613c]' : ''"
                      >
                        {{ c.name }}
                      </p>
                      <input
                        type="checkbox"
                        class=""
                        name=""
                        :checked="c.id == selectedCity"
                        id=""
                      />
                    </div>
                  </div>
                </div>
                <div v-if="selectPart != 'attraction'">
                  <h2 class="text-sm text-[#FF613c] font-medium">
                    Choose Place
                  </h2>
                  <div
                    class="space-y-1 h-[250px] overflow-y-scroll scroll-container-y pt-3"
                    v-if="!loadingPlace"
                  >
                    <div
                      class="flex justify-between items-center space-y-2 pb-3 pt-1.5 px-3 border rounded-full cursor-pointer"
                      @click="selectedPlace = ''"
                      :class="
                        selectedPlace == ''
                          ? ' border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                          : ''
                      "
                    >
                      <p
                        class="text-xs w-[110px] mt-1.5 line-clamp-1"
                        :class="selectedPlace == '' ? 'text-[#FF613c]' : ''"
                      >
                        All places
                      </p>
                      <input
                        type="checkbox"
                        name=""
                        :checked="selectedPlace == ''"
                        id=""
                      />
                    </div>
                    <div
                      class="flex justify-between items-center space-y-2 pb-3 pt-1.5 px-3 border rounded-full cursor-pointer"
                      v-for="p in getPlaceList ?? []"
                      :key="p"
                      :class="
                        p.name == selectedPlace
                          ? ' border-[#FF613c] text-[#FF613c] bg-[#FF613c]/10'
                          : ''
                      "
                      @click="selectedPlace = p.name"
                    >
                      <p
                        class="text-xs w-[110px] mt-1.5 line-clamp-1"
                        :class="p.name == selectedPlace ? 'text-[#FF613c]' : ''"
                      >
                        {{ p.name }}
                      </p>
                      <input
                        type="checkbox"
                        name=""
                        :checked="p.name == selectedPlace"
                        id=""
                      />
                    </div>
                  </div>
                  <div
                    v-else
                    class="flex justify-center items-center h-[200px]"
                  >
                    <div class="flex gap-1">
                      <div
                        class="w-2 h-2 rounded-full bg-[#FF613c] animate-bounce"
                      ></div>
                      <div
                        class="w-2 h-2 rounded-full bg-[#FF613c] animate-bounce [animation-delay:-.3s]"
                      ></div>
                      <div
                        class="w-2 h-2 rounded-full bg-[#FF613c] animate-bounce [animation-delay:-.5s]"
                      ></div>
                    </div>
                  </div>
                </div>
                <!-- Category Filter (full width for attractions) -->
                <div class="col-span-2 pb-3" v-if="selectPart === 'attraction'">
                  <div>
                    <p class="text-sm text-[#9333ea] font-medium mb-3">
                      Category
                    </p>
                    <div
                      class="space-y-1 max-h-[350px] overflow-y-scroll scroll-container-y pr-2"
                    >
                      <div
                        class="flex justify-between items-center space-y-2 pb-3 pt-1.5 px-3 border rounded-full cursor-pointer"
                        @click="selectedCategory = ''"
                        :class="
                          selectedCategory == ''
                            ? ' border-[#9333ea] text-[#9333ea] bg-[#9333ea]/10'
                            : ''
                        "
                      >
                        <p
                          class="text-xs w-full mt-1.5 line-clamp-1"
                          :class="
                            selectedCategory == '' ? 'text-[#9333ea]' : ''
                          "
                        >
                          All categories
                        </p>
                        <input
                          type="checkbox"
                          name=""
                          :checked="selectedCategory == ''"
                          id=""
                        />
                      </div>
                      <div
                        class="flex justify-between items-center space-y-2 pb-3 pt-1.5 px-3 border rounded-full cursor-pointer"
                        v-for="cat in attractionCategories ?? []"
                        :key="cat.id"
                        :class="
                          cat.id == selectedCategory
                            ? ' border-[#9333ea] text-[#9333ea] bg-[#9333ea]/10'
                            : ''
                        "
                        @click="selectedCategory = cat.id"
                      >
                        <p
                          class="text-xs w-full mt-1.5 line-clamp-1"
                          :class="
                            cat.id == selectedCategory ? 'text-[#9333ea]' : ''
                          "
                        >
                          {{ cat.name }}
                        </p>
                        <input
                          type="checkbox"
                          name=""
                          :checked="cat.id == selectedCategory"
                          id=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex justify-end items-center gap-x-3 pt-4 border-t border-black/5 mt-3"
              >
                <p
                  @click="showSearchPanel = false"
                  class="text-xs font-medium px-3 py-2 border border-black/10 rounded-full cursor-pointer"
                >
                  Cancel
                </p>
                <p
                  @click="resetFilters"
                  class="text-xs font-medium px-3 py-2 bg-red-500 text-white rounded-full cursor-pointer"
                >
                  Reset
                </p>
                <p
                  @click="applyFilters"
                  class="text-xs font-medium px-3 py-2 bg-[#FF613c] text-white rounded-full cursor-pointer"
                >
                  Apply
                </p>
              </div>
            </div>
          </DialogPanel>
        </Modal>

        <!-- Detail Modal -->
        <Modal
          :isOpen="hotelModalOpen"
          :marginTop="'mt-4'"
          @closeModal="closeHotelModal()"
        >
          <DialogPanel
            class="w-full max-w-4xl overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl"
          >
            <DetailComponent
              :hotelId="hotelDetailId"
              :closeModal="closeHotelModal"
            />
          </DialogPanel>
        </Modal>

        <!-- Detail Modal -->
        <Modal
          :isOpen="attractionModalOpen"
          :marginTop="'mt-4'"
          @closeModal="closeAttractionModal()"
        >
          <DialogPanel
            class="w-full max-w-4xl overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl"
          >
            <DetailAttraction
              :attractionId="attractionDetailId"
              :closeModal="closeAttractionModal"
            />
          </DialogPanel>
        </Modal>

        <!-- List Toggle Button -->
        <button
          @click="toggleList"
          :style="{
            bottom: showList ? `${250}px` : `${100}px`,
          }"
          :class="showList ? 'rotate-[180deg]' : ''"
          class="absolute right-3 z-[1001] w-12 h-12 bg-white border border-black/10 hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        >
          <svg
            enable-background="new 0 0 32 32"
            height="20px"
            id="Layer_1"
            version="1.1"
            viewBox="0 0 32 32"
            width="32px"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z"
              fill="#515151"
            />
          </svg>
        </button>

        <!-- Map -->
        <div id="map" ref="mapRef" class="w-full h-full"></div>

        <!-- Scrollable Cards at Bottom -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-8"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-8"
        >
          <div
            v-if="showList"
            class="absolute left-4 right-4 md:left-[100px] md:right-5 z-[999] bottom-5 tablet:bottom-[100px] ipad-pro:bottom-[120px] mobile:bottom-[140px] pointer-events-none"
          >
            <div
              ref="listContainer"
              class="flex gap-3 overflow-x-auto pb-2 pointer-events-auto scrollbar-hide scroll-smooth"
            >
              <!-- Hotel Cards -->
              <div
                v-for="hotel in filteredHotels"
                v-show="selectPart === 'all' || selectPart === 'hotel'"
                :key="'hotel-' + hotel.id"
                :ref="(el) => setCardRef(el, 'hotel', hotel.id)"
                :data-type="'hotel'"
                :data-id="hotel.id"
                @click="scrollToItem('hotel', hotel.id)"
                :class="[
                  'flex-shrink-0 w-80 rounded-xl shadow-md transition-all duration-300 cursor-pointer overflow-hidden',
                  selectedItemId === 'hotel-' + hotel.id
                    ? 'bg-[#FF613c]'
                    : 'bg-white',
                ]"
              >
                <div class="flex">
                  <!-- Hotel Image - Left Side -->
                  <div class="relative w-32 h-[165px] flex-shrink-0">
                    <img
                      :src="
                        hotel.images?.[0]?.image ||
                        'https://via.placeholder.com/300x300?text=No+Image'
                      "
                      :alt="hotel.name"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Hotel Info - Right Side -->
                  <div class="flex-1 p-3 flex flex-col justify-between">
                    <!-- Top Section -->
                    <div>
                      <h3
                        class="font-semibold text-sm mb-1 line-clamp-1"
                        :class="
                          selectedItemId === 'hotel-' + hotel.id
                            ? 'text-white'
                            : 'text-gray-900'
                        "
                      >
                        {{ hotel.name }}
                      </h3>

                      <!-- Star Rating -->
                      <div class="flex items-center gap-1 mb-1">
                        <span class="text-yellow-400 text-sm">{{
                          "★".repeat(hotel.rating || 0)
                        }}</span>
                      </div>
                      <p
                        class="text-[10px]"
                        :class="
                          selectedItemId === 'hotel-' + hotel.id
                            ? 'text-white'
                            : 'text-gray-900'
                        "
                      >
                        Starting from
                      </p>
                      <div class="flex items-start justify-between mt-2">
                        <div class="text-right">
                          <!-- Current Price -->
                          <div
                            class="text-xl font-bold"
                            :class="
                              selectedItemId === 'hotel-' + hotel.id
                                ? 'text-white'
                                : 'text-gray-900'
                            "
                          >
                            {{
                              hotel.lowest_room_price?.toLocaleString() || "999"
                            }}
                            <span class="text-base">฿</span>
                          </div>
                        </div>
                      </div>
                      <div class="flex justify-between items-center gap-x-2">
                        <div
                          class="flex px-2 text-xs mt-2 rounded-full w-full shadow-md justify-center py-2"
                          @click="getViewDetail(hotel.id)"
                          :class="
                            selectedItemId === 'hotel-' + hotel.id
                              ? 'text-white bg-white/20'
                              : 'text-gray-900 bg-gray-300/20'
                          "
                        >
                          Detail
                        </div>
                        <div
                          class="flex px-4 text-xs mt-2 rounded-full shadow-md justify-center py-2"
                          @click="getViewDetail(hotel.id)"
                          :class="
                            selectedItemId === 'hotel-' + hotel.id
                              ? 'text-white bg-white/20'
                              : 'text-gray-900 bg-gray-300/20'
                          "
                        >
                          <PaperAirplaneIcon class="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Attraction Cards -->
              <div
                v-for="attraction in filteredAttractions"
                v-show="selectPart === 'all' || selectPart === 'attraction'"
                :key="'attraction-' + attraction.id"
                :ref="(el) => setCardRef(el, 'attraction', attraction.id)"
                :data-type="'attraction'"
                :data-id="attraction.id"
                @click="scrollToItem('attraction', attraction.id)"
                :class="[
                  'flex-shrink-0 w-80 rounded-xl shadow-md transition-all duration-300 cursor-pointer overflow-hidden',
                  selectedItemId === 'attraction-' + attraction.id
                    ? 'bg-[#9333ea]'
                    : 'bg-white',
                ]"
              >
                <div class="flex">
                  <!-- Attraction Image - Left Side -->
                  <div class="relative w-32 h-[165px] flex-shrink-0">
                    <img
                      :src="
                        attraction.cover_image ||
                        'https://via.placeholder.com/300x300?text=No+Image'
                      "
                      :alt="attraction.name"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Attraction Info - Right Side -->
                  <div class="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h3
                        class="font-semibold text-sm mb-1 line-clamp-1"
                        :class="
                          selectedItemId === 'attraction-' + attraction.id
                            ? 'text-white'
                            : 'text-gray-900'
                        "
                      >
                        {{ attraction.name }}
                      </h3>

                      <p
                        class="text-[10px] mb-2"
                        :class="
                          selectedItemId === 'attraction-' + attraction.id
                            ? 'text-white'
                            : 'text-gray-600'
                        "
                      >
                        {{ attraction.cities?.[0]?.name || "Attraction" }}
                      </p>

                      <p
                        class="text-[10px]"
                        :class="
                          selectedItemId === 'attraction-' + attraction.id
                            ? 'text-white'
                            : 'text-gray-900'
                        "
                      >
                        Starting from
                      </p>
                      <div class="flex items-start justify-between mt-2">
                        <div class="text-right">
                          <div
                            class="text-xl font-bold"
                            :class="
                              selectedItemId === 'attraction-' + attraction.id
                                ? 'text-white'
                                : 'text-gray-900'
                            "
                          >
                            {{
                              attraction.lowest_variation_price?.toLocaleString() ||
                              "999"
                            }}
                            <span class="text-base">฿</span>
                          </div>
                        </div>
                      </div>
                      <!-- <div
                        class="flex px-2 text-xs mt-2 rounded-full justify-center py-2"
                        @click.stop="viewAttractionDetail(attraction.id)"
                        :class="
                          selectedItemId === 'attraction-' + attraction.id
                            ? 'text-white bg-white/20'
                            : 'text-gray-900 bg-gray-300/20'
                        "
                      >
                        View Detail
                      </div> -->
                      <div class="flex justify-between items-center gap-x-2">
                        <div
                          class="flex px-2 text-xs mt-2 shadow-md w-full rounded-full justify-center py-2"
                          @click.stop="viewAttractionDetail(attraction.id)"
                          :class="
                            selectedItemId === 'attraction-' + attraction.id
                              ? 'text-white bg-white/20'
                              : 'text-gray-900 bg-gray-300/20'
                          "
                        >
                          Detail
                        </div>
                        <div
                          class="flex px-4 text-xs mt-2 shadow-md rounded-full justify-center py-2"
                          @click="getViewDetail(hotel.id)"
                          :class="
                            selectedItemId === 'attraction-' + attraction.id
                              ? 'text-white bg-white/20'
                              : 'text-gray-900 bg-gray-300/20'
                          "
                        >
                          <PaperAirplaneIcon class="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Loading Overlay -->
        <div
          v-if="loading"
          class="absolute inset-0 bg-white/80 flex items-center justify-center z-[2000]"
        >
          <div
            class="w-12 h-12 border-4 border-[#FF613c]/20 border-t-[#FF613c] rounded-full animate-spin"
          ></div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from "vue";
import { useHotelStore } from "../stores/hotel";
import { useEntranceStore } from "../stores/entrance"; // Add this import
import Layout from "./Layout.vue";
import DetailComponent from "./MapComponent/Detail.vue";
import { useCityStore } from "../stores/city";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Modal from "../components/Modal.vue";
import { DialogPanel } from "@headlessui/vue";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useRoute, useRouter } from "vue-router";
import { useDestinationStore } from "../stores/destination";
import { storeToRefs } from "pinia";
import DetailAttraction from "./MapComponent/DetailAttraction.vue";
import { PaperAirplaneIcon, QueueListIcon } from "@heroicons/vue/24/outline";

const hotelStore = useHotelStore();
const entranceStore = useEntranceStore(); // Add this
const destinationStore = useDestinationStore();
const cityStore = useCityStore();
const router = useRouter();
const route = useRoute();

// State
const loading = ref(false);
const allHotels = ref([]);
const allAttractions = ref([]); // Add this
const cityList = ref([]);
const selectedCity = ref(2);
const selectedPlace = ref("");
const selectedCategory = ref(""); // Add category filter
const priceFilter = ref("");
const showSearchPanel = ref(false);
const showList = ref(true); // Renamed from showHotelList
const selectedItemId = ref(""); // Changed from selectedHotelId
const listContainer = ref(null); // Renamed from hotelListContainer
const cardRefs = ref({}); // Changed from hotelCardRefs
const showDateBox = ref(false);
const safeAreaBottom = ref(0);
const loadingPlace = ref(false);
const chooseCityName = ref("");
const showCityModal = ref(false);
const showPlaceModal = ref(false);
const { dests } = storeToRefs(destinationStore);
const openDestinationModal = ref(false);

const selectPart = ref("hotel"); // Changed default to "hotel"

// Destination search refs - 10km radius
const selectedDestination = ref(null);
const destinationRadius = ref(3);

const checkin_date = ref(
  localStorage.getItem("checkin_date")
    ? localStorage.getItem("checkin_date").replace('"', "")
    : ""
);
const checkout_date = ref(
  localStorage.getItem("checkout_date")
    ? localStorage.getItem("checkout_date").replace('"', "")
    : ""
);
const room_qty = ref(localStorage.getItem("room_qty") || "");

// Map variables
let map = null;
let markerClusterGroup = null;

// Extract unique categories from attractions
const attractionCategories = computed(() => {
  const categoriesMap = new Map();

  allAttractions.value.forEach((attraction) => {
    if (attraction.categories && Array.isArray(attraction.categories)) {
      attraction.categories.forEach((category) => {
        if (!categoriesMap.has(category.id)) {
          categoriesMap.set(category.id, category);
        }
      });
    }
  });

  return Array.from(categoriesMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
});

// Show only first 4 categories
const visibleCategories = computed(() => {
  const selectedIndex = attractionCategories.value.findIndex(
    (cat) => cat.id === selectedCategory.value
  );
  const startIndex = selectedIndex !== -1 ? selectedIndex : 0;
  return attractionCategories.value.slice(startIndex, startIndex + 4);
});

// Show only first 4 cities
const visibleCities = computed(() => {
  const selectedIndex = cityList.value.findIndex(
    (city) => city.id === selectedCity.value
  );
  const startIndex = selectedIndex !== -1 ? selectedIndex : 0;
  return cityList.value.slice(startIndex, startIndex + 4);
});

const visiblePlaces = computed(() => {
  const selectedIndex = getPlaceList.value.findIndex(
    (place) => place.name == selectedPlace.value
  );
  const startIndex = selectedIndex !== -1 ? selectedIndex : 0;
  return getPlaceList.value.slice(startIndex, startIndex + 4);
});

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Get nearby hotels for a destination
const getNearbyHotels = (destination) => {
  if (!destination.latitude || !destination.longitude) {
    return allHotels.value;
  }

  return allHotels.value.filter((hotel) => {
    if (!hotel.latitude || !hotel.longitude) return false;

    const distance = calculateDistance(
      parseFloat(destination.latitude),
      parseFloat(destination.longitude),
      parseFloat(hotel.latitude),
      parseFloat(hotel.longitude)
    );

    return distance <= destinationRadius.value;
  });
};

const selectDestination = async (destination) => {
  selectedDestination.value = destination;

  // First update the markers
  await nextTick();
  updateMapMarkers();

  // Then center and zoom the map on the destination
  if (map && destination.latitude && destination.longitude) {
    const destLat = parseFloat(destination.latitude);
    const destLng = parseFloat(destination.longitude);

    // Always zoom in close to the destination - don't use fitBounds
    map.setView([destLat, destLng], 15, {
      animate: true,
      duration: 1,
    });
  }

  // Show hotel list
  showList.value = true;

  // Highlight marker after animation
  setTimeout(() => {
    highlightDestinationMarker(destination.id);
  }, 300);
};

// Select destination from modal and close modal
const selectDestinationFromModal = (destination) => {
  selectDestination(destination);
  showSearchPanel.value = false;
};

// Add these to your existing data properties
const destinationSearchQuery = ref("");
const showDestinationCityDropdown = ref(false);

// Add these computed properties
const filteredDestinationsForModal = computed(() => {
  let filtered = destinations.value;

  // Filter by selected city
  if (selectedCity.value) {
    filtered = filtered.filter((d) => d.city?.id === selectedCity.value);
  }

  // Filter by search query
  if (destinationSearchQuery.value.trim()) {
    const query = destinationSearchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.city?.name.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Add these methods
const selectDestinationCity = (cityId) => {
  selectedDestinationCity.value = cityId;
  showDestinationCityDropdown.value = false;
};

const clearDestinationFilters = () => {
  destinationSearchQuery.value = "";
  selectedDestinationCity.value = "";
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showDestinationCityDropdown.value = false;
  }
};

// Highlight destination marker
const highlightDestinationMarker = (destinationId) => {
  const allDestMarkers = document.querySelectorAll(".destination-badge");
  allDestMarkers.forEach((marker) => {
    marker.classList.remove("active");
  });

  const activeDestMarker = document.querySelector(
    `.destination-badge[data-destination-id="${destinationId}"]`
  );
  if (activeDestMarker) {
    activeDestMarker.classList.add("active");
  }
};

// Clear destination selection
const clearDestination = () => {
  selectedDestination.value = null;

  // Restore normal filtered view
  updateMapMarkers();

  // Re-center map based on current filters
  setTimeout(() => {
    if (selectedCity.value || selectedPlace.value || priceFilter.value) {
      centerMapOnFilteredItems();
    }
  }, 300);
};

const closeShowDateBox = () => {
  checkin_date.value = localStorage.getItem("checkin_date") || "";
  checkout_date.value = localStorage.getItem("checkout_date") || "";
  room_qty.value = localStorage.getItem("room_qty") || "";
  showDateBox.value = false;
};

const setCity = (cityId) => {
  if (loading.value) return;
  selectedCity.value = cityId;
  selectedPlace.value = "";
  // Clear category if switching away from attractions
  if (selectPart.value !== "attraction") {
    selectedCategory.value = "";
  }
  clearDestination();
  updateMapMarkers();
  setTimeout(() => {
    centerMapOnFilteredItems();
  }, 300);
};

const setPlace = (place) => {
  if (loading.value) return;
  selectedPlace.value = place;
  clearDestination();
  updateMapMarkers();
  setTimeout(() => {
    centerMapOnFilteredItems();
  }, 300);
};

const setCategory = (categoryId) => {
  if (loading.value) return;
  selectedCategory.value = categoryId;
  updateMapMarkers();
  setTimeout(() => {
    centerMapOnFilteredItems();
  }, 300);
};

const setPriceFilter = (filter) => {
  if (loading.value) return;
  priceFilter.value = filter;
  updateMapMarkers();
  setTimeout(() => {
    centerMapOnFilteredItems();
  }, 300);
};

const isItemInPriceRange = (item) => {
  if (!priceFilter.value) return true;

  // For hotels
  const hotelPrice = item.lowest_room_price || 0;
  // For attractions
  const attractionPrice = item.lowest_variation_price || 0;

  const price = hotelPrice || attractionPrice;
  const [min, max] = priceFilter.value.split("-").map(Number);
  return price >= min && price <= max;
};

// Updated computed properties for filtering
const filteredHotels = computed(() => {
  let filtered = allHotels.value;

  // If destination is selected, show only nearby hotels (within 3km)
  if (selectedDestination.value) {
    filtered = getNearbyHotels(selectedDestination.value);
  }

  if (selectedCity.value) {
    filtered = filtered.filter((hotel) => hotel.city_id == selectedCity.value);
  }

  if (selectedPlace.value) {
    filtered = filtered.filter((hotel) => hotel.place === selectedPlace.value);
  }

  if (priceFilter.value) {
    filtered = filtered.filter(isItemInPriceRange);
  }

  return filtered;
});

const filteredAttractions = computed(() => {
  let filtered = allAttractions.value;

  if (selectedCity.value) {
    filtered = filtered.filter((attraction) =>
      attraction.cities?.some((city) => city.id == selectedCity.value)
    );
  }

  if (selectedPlace.value) {
    filtered = filtered.filter(
      (attraction) => attraction.place === selectedPlace.value
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter((attraction) =>
      attraction.categories?.some(
        (category) => category.id === selectedCategory.value
      )
    );
  }

  if (priceFilter.value) {
    filtered = filtered.filter(isItemInPriceRange);
  }

  return filtered;
});

const getCities = async () => {
  const res = await cityStore.getListHotelCityAction({
    limit: 100,
  });
  cityList.value = res.data;
};

const destinations = ref([]);
const getDestinations = async () => {
  try {
    const params = {
      limit: 1000,
      mapping: true,
    };
    const response = await destinationStore.getListAction(params);
    if (response.status === 1 && response.result?.data) {
      destinations.value = response.result.data;
      updateMapMarkers();
    }
  } catch (error) {
    console.error("Error fetching destinations:", error);
  }
};

const getPlaceList = computed(() => {
  if (!selectedCity.value || !cityList.value.length) {
    return [];
  }

  const city = cityList.value.find((c) => c.id == selectedCity.value);

  if (city?.places) {
    if (typeof city.places === "object" && !Array.isArray(city.places)) {
      return Object.entries(city.places).map(([id, name]) => ({
        id,
        name,
      }));
    }
    return city.places;
  }

  return [];
});

const getCityName = (cityId) => {
  const city = cityList.value.find((c) => c.id == cityId);
  return city ? city.name : "All cities";
};

const toggleSearchPanel = () => {
  showSearchPanel.value = !showSearchPanel.value;
};

const toggleList = () => {
  showList.value = !showList.value;
};

const setCardRef = (el, type, id) => {
  if (el) {
    cardRefs.value[`${type}-${id}`] = el;
  }
};

const scrollToItem = (type, id) => {
  const itemKey = `${type}-${id}`;

  if (!showList.value) {
    showList.value = true;
  }

  selectedItemId.value = itemKey;

  const item =
    type === "hotel"
      ? filteredHotels.value.find((h) => h.id === id)
      : filteredAttractions.value.find((a) => a.id === id);

  if (item && item.latitude && item.longitude && map) {
    map.setView([parseFloat(item.latitude), parseFloat(item.longitude)], 17, {
      animate: true,
      duration: 1,
    });
  }

  // Wait for Vue to render the list before manipulating DOM
  nextTick(() => {
    // Clear all active markers
    const allMarkers = document.querySelectorAll(
      ".price-badge, .attraction-badge"
    );
    allMarkers.forEach((marker) => {
      marker.classList.remove("active");
    });

    // Activate the clicked marker
    const activeMarker = document.querySelector(
      `.${
        type === "hotel" ? "price-badge" : "attraction-badge"
      }[data-${type}-id="${id}"]`
    );
    if (activeMarker) {
      activeMarker.classList.add("active");
    }

    // Scroll to the card
    setTimeout(() => {
      const card = cardRefs.value[itemKey];
      if (card && listContainer.value) {
        const containerRect = listContainer.value.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const scrollLeft =
          card.offsetLeft - containerRect.width / 2 + cardRect.width / 2;

        listContainer.value.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }, 100);
  });
};

const getMapList = async () => {
  try {
    loading.value = true;
    const res = await hotelStore.getMapListAction();

    if (res.result == 1) {
      allHotels.value = res.data;
      initializeMap();
    }
  } catch (error) {
    console.error("Error fetching hotels:", error);
  } finally {
    loading.value = false;
  }
};

// Add this new function
const getAttractionList = async () => {
  try {
    loading.value = true;
    const res = await entranceStore.getSimpleListAction({
      have_latlong: true,
      show_only: true,
    });
    console.log(res, "this is attraction list");

    if (res.status == 1) {
      allAttractions.value = res.result.data;
    }
  } catch (error) {
    console.error("Error fetching attractions:", error);
  } finally {
    loading.value = false;
  }
};

const onFilterChange = () => {
  updateMapMarkers();
};

const applyFilters = () => {
  onFilterChange();
  toggleSearchPanel();
  setTimeout(() => {
    centerMapOnFilteredItems();
  }, 300);
};

const resetFilters = () => {
  selectedCity.value = "";
  selectedPlace.value = "";
  selectedCategory.value = "";
  priceFilter.value = "";
  clearDestination();
  updateMapMarkers();
};

const initializeMap = () => {
  map = L.map("map").setView([13.7563, 100.5018], 6);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }
  ).addTo(map);

  markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 80,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 14,

    iconCreateFunction: function (cluster) {
      const markers = cluster.getAllChildMarkers();
      const hotelCount = markers.filter(
        (m) => m.options.type === "hotel"
      ).length;
      const attractionCount = markers.filter(
        (m) => m.options.type === "attraction"
      ).length;
      const destCount = markers.filter(
        (m) => m.options.type === "destination"
      ).length;

      const parts = [];
      if (hotelCount > 0)
        parts.push(`${hotelCount} hotel${hotelCount > 1 ? "s" : ""}`);
      if (attractionCount > 0)
        parts.push(
          `${attractionCount} attraction${attractionCount > 1 ? "s" : ""}`
        );
      if (destCount > 0)
        parts.push(`${destCount} destination${destCount > 1 ? "s" : ""}`);

      const label = parts.join(", ");

      // Calculate approximate width based on text length
      const estimatedWidth = Math.max(120, Math.min(250, label.length * 7));

      return L.divIcon({
        html: `
          <div class="cluster-marker-new" style="width: ${estimatedWidth}px;">
            <div class="cluster-content">
              ${label}
            </div>
          </div>
        `,
        className: "custom-cluster-icon",
        iconSize: L.point(estimatedWidth, 40),
        iconAnchor: [estimatedWidth / 2, 20],
      });
    },
  });

  map.addLayer(markerClusterGroup);
  updateMapMarkers();
};

const updateMapMarkers = () => {
  // Clear existing markers
  if (markerClusterGroup) {
    markerClusterGroup.clearLayers();
  }

  const allMarkers = [];

  // Add hotel markers (only if selectPart is 'all' or 'hotel')
  if (selectPart.value === "all" || selectPart.value === "hotel") {
    filteredHotels.value.forEach((hotel) => {
      if (hotel.latitude && hotel.longitude) {
        const formattedPrice = hotel.lowest_room_price
          ? `฿${hotel.lowest_room_price.toLocaleString()}`
          : "N/A";

        const priceIcon = L.divIcon({
          className: "custom-price-marker",
          html: `<div class="price-badge" data-hotel-id="${hotel.id}">${formattedPrice}</div>`,
          iconSize: [90, 40],
          iconAnchor: [45, 20],
          popupAnchor: [0, -20],
        });

        const marker = L.marker(
          [parseFloat(hotel.latitude), parseFloat(hotel.longitude)],
          { icon: priceIcon, hotelData: hotel, type: "hotel" }
        );

        marker.on("click", () => scrollToItem("hotel", hotel.id));
        allMarkers.push(marker);
      }
    });
  }

  // Add attraction markers (only if selectPart is 'all' or 'attraction')
  if (selectPart.value === "attraction") {
    filteredAttractions.value.forEach((attraction) => {
      if (attraction.latitude && attraction.longitude) {
        const formattedPrice = attraction.lowest_variation_price
          ? `฿${attraction.lowest_variation_price.toLocaleString()}`
          : "N/A";

        const attractionIcon = L.divIcon({
          className: "custom-attraction-marker",
          html: `<div class="attraction-badge" data-attraction-id="${attraction.id}">${formattedPrice}</div>`,
          iconSize: [90, 40],
          iconAnchor: [45, 20],
          popupAnchor: [0, -20],
        });

        const marker = L.marker(
          [parseFloat(attraction.latitude), parseFloat(attraction.longitude)],
          {
            icon: attractionIcon,
            attractionData: attraction,
            type: "attraction",
          }
        );

        marker.on("click", () => scrollToItem("attraction", attraction.id));
        allMarkers.push(marker);
      }
    });
  }

  // Add destination markers (only when not in attraction-only mode)
  if (selectPart.value !== "attraction") {
    destinations.value.forEach((destination) => {
      if (destination.latitude && destination.longitude) {
        const isSelected = selectedDestination.value?.id === destination.id;
        const imageUrl = destination.feature_img;

        const destinationIcon = L.divIcon({
          className: "custom-destination-marker",
          html: `
            <div class="destination-pin-container ${
              isSelected ? "active" : ""
            }" data-destination-id="${destination.id}">
              <div class="destination-pin">
                <div class="pin-image-wrapper">
                  <img src="${imageUrl}" alt="${
            destination.name
          }" class="pin-image" />
                </div>
                <div class="pin-pointer"></div>
              </div>
            </div>
          `,
          iconSize: [60, 85],
          iconAnchor: [30, 75],
          popupAnchor: [0, -75],
        });

        const marker = L.marker(
          [parseFloat(destination.latitude), parseFloat(destination.longitude)],
          {
            icon: destinationIcon,
            destinationData: destination,
            type: "destination",
          }
        );

        marker.on("click", () => {
          selectDestination(destination);
          openDestinationPopup(destination);
        });

        allMarkers.push(marker);
      }
    });
  }

  // Add all markers to cluster group
  if (markerClusterGroup) {
    markerClusterGroup.addLayers(allMarkers);
  }
};

const openDestinationPopup = (destination) => {
  const nearbyCount = getNearbyHotels(destination).length;

  const popupContent = `
    <div class="destination-popup p-2">
      <div class="flex items-start gap-3">
        <div class="w-20 h-20 flex-shrink-0">
          <img src="${
            destination.feature_img ||
            "https://via.placeholder.com/80x80?text=Destination"
          }" 
               alt="${destination.name}" 
               class="w-full h-full object-cover rounded-lg">
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-sm ">${destination.name}</h3>
          <div>
            <p class="text-xs text-gray-600 ">${
              destination.city?.name || ""
            }</p>
            <p class="text-xs text-gray-600 ">${
              destination?.category?.name || ""
            }</p>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              ${nearbyCount} hotels within 3km
            </span>
          </div>
        </div>
      </div>
    </div>
  `;

  L.popup({
    closeButton: true,
    className: "destination-popup",
  })
    .setLatLng([
      parseFloat(destination.latitude),
      parseFloat(destination.longitude),
    ])
    .setContent(popupContent)
    .openOn(map);
};

// Watch for selectPart changes
watch(selectPart, () => {
  // Clear category filter when switching away from attractions
  if (selectPart.value !== "attraction") {
    selectedCategory.value = "";
  }
  updateMapMarkers();
  setTimeout(() => {
    centerMapOnFilteredItems();
  }, 300);
});

watch([selectedCity, selectedPlace, priceFilter, selectedCategory], () => {
  if (
    selectedCity.value ||
    selectedPlace.value ||
    priceFilter.value ||
    selectedCategory.value
  ) {
    centerMapOnFilteredItems();
  }
});

const centerMapOnFilteredItems = () => {
  if (!map) return;

  let validCoordinates = [];

  // Collect coordinates based on selectPart
  if (selectPart.value === "hotel") {
    const hotelCoords = filteredHotels.value
      .filter((hotel) => hotel.latitude && hotel.longitude)
      .map((hotel) => [
        parseFloat(hotel.latitude),
        parseFloat(hotel.longitude),
      ]);
    validCoordinates = [...validCoordinates, ...hotelCoords];
  }

  if (selectPart.value === "attraction") {
    const attractionCoords = filteredAttractions.value
      .filter((attraction) => attraction.latitude && attraction.longitude)
      .map((attraction) => [
        parseFloat(attraction.latitude),
        parseFloat(attraction.longitude),
      ]);
    validCoordinates = [...validCoordinates, ...attractionCoords];
  }

  if (validCoordinates.length === 0) return;

  if (validCoordinates.length === 1) {
    map.setView(validCoordinates[0], 14, {
      animate: true,
      duration: 1,
    });
  } else {
    const bounds = L.latLngBounds(validCoordinates);
    map.fitBounds(bounds, {
      padding: [100, 100],
      animate: true,
      duration: 1,
    });
  }
};

const hotelModalOpen = ref(false);
const hotelDetailId = ref(null);
const getViewDetail = async (hotelId) => {
  hotelDetailId.value = hotelId;
  hotelModalOpen.value = true;
};

const closeHotelModal = () => {
  hotelModalOpen.value = false;
  hotelDetailId.value = null;
};

const attractionModalOpen = ref(false);
const attractionDetailId = ref(null);
// Add this function for viewing attraction details
const viewAttractionDetail = (attractionId) => {
  // Navigate to attraction detail page or open modal
  // router.push(`/attraction/${attractionId}`);
  attractionDetailId.value = attractionId;
  attractionModalOpen.value = true;
};

const closeAttractionModal = () => {
  attractionModalOpen.value = false;
  attractionDetailId.value = null;
};

onMounted(async () => {
  console.log("Map Page Loaded");
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  document.addEventListener("click", handleClickOutside);

  await getCities();
  await getDestinations();
  await getMapList();
  await getAttractionList(); // Add this

  setCity(selectedCity.value || 2);

  initializeMap();
});

onUnmounted(() => {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Destination marker styles */
/* Google Maps style destination pin */
:deep(.custom-destination-marker) {
  background: none;
  border: none;
}

:deep(.destination-pin-container) {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.destination-pin) {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
  transition: all 0.3s ease;
}

:deep(.pin-image-wrapper) {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffffff;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

:deep(.pin-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.pin-pointer) {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid #ffffff;
  margin-top: -2px;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
}

:deep(.pin-label) {
  margin-top: 4px;
  background: #ffffff;
  color: #333;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 11px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

/* Hover effect */
:deep(.destination-pin-container:hover .destination-pin) {
  transform: translateY(-5px) scale(1.1);
}

:deep(.destination-pin-container:hover .pin-image-wrapper) {
  border-color: #4299e1;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

:deep(.destination-pin-container:hover .pin-label) {
  background: #4299e1;
  color: white;
  box-shadow: 0 3px 8px rgba(66, 153, 225, 0.3);
}

/* Active state */
:deep(.destination-pin-container.active .destination-pin) {
  transform: translateY(-5px) scale(1.15);
}

:deep(.destination-pin-container.active .pin-image-wrapper) {
  border-color: #4299e1;
  border-width: 4px;
  box-shadow: 0 4px 16px rgba(66, 153, 225, 0.5);
}

:deep(.destination-pin-container.active .pin-pointer) {
  border-top-color: #4299e1;
}

:deep(.destination-pin-container.active .pin-label) {
  background: #4299e1;
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

/* Animation for new markers */
@keyframes pinDrop {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

:deep(.destination-pin-container) {
  animation: pinDrop 0.6s ease-out;
}

/* Popup styles remain the same */
:deep(.destination-popup .leaflet-popup-content-wrapper) {
  border-radius: 12px;
  padding: 0;
}

:deep(.destination-popup .leaflet-popup-content) {
  margin: 0;
  width: 250px !important;
}

/* Cluster marker styles */
:deep(.cluster-marker-new) {
  background: #ffffff;
  border-radius: 24px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid #ffffff;
  white-space: nowrap;
  min-width: 100px;
  max-width: 100%;
  display: inline-block;
}

:deep(.cluster-content) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #000000;
  font-weight: 600;
  font-size: 11px;
  line-height: 1.3;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scroll-smooth {
  scroll-behavior: smooth;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom price marker styles for hotels */
:deep(.custom-price-marker) {
  background: none;
  border: none;
}

:deep(.price-badge) {
  background: #ffffff;
  color: black;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(52, 52, 52, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 0.5px solid #7272727d;
}

:deep(.price-badge:hover) {
  background: #ffffff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(104, 104, 104, 0.6);
}

:deep(.price-badge.active) {
  background: #f97316 !important;
  color: white !important;
  border-color: #f97316 !important;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.6);
}

/* Custom attraction marker styles */
:deep(.custom-attraction-marker) {
  background: none;
  border: none;
}

:deep(.attraction-badge) {
  background: #ffffff;
  color: black;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 0.5px solid #9333ea;
}

:deep(.attraction-badge:hover) {
  background: #ffffff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.6);
}

:deep(.attraction-badge.active) {
  background: #9333ea !important;
  color: white !important;
  border-color: #9333ea !important;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(147, 51, 234, 0.6);
}

/* Custom cluster icon */
:deep(.custom-cluster-icon) {
  background: none;
  border: none;
}

:deep(.cluster-marker-new:hover) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Custom scrollbar for modal and containers */
.scroll-container-y {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb #f9fafb;
}

.scroll-container-y::-webkit-scrollbar {
  width: 6px;
}

.scroll-container-y::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 10px;
}

.scroll-container-y::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}

.scroll-container-y::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
