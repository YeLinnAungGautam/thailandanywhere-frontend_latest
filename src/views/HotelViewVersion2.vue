<template>
  <Layout>
    <div class="mb-5 w-full flex gap-x-6 items-center">
      <button
        @click="$router.push('/products-v2')"
        class="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50"
      >
        <svg
          class="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div class="text-xl font-semibold">Hotel</div>
      <div class="flex-1"></div>
      <div
        @click="router.push('/products-v2/hotel/create')"
        class="pl-2 pr-3 me-7 py-2 bg-[#FF5B00] text-white cursor-pointer rounded-full hover:bg-[#ff4400] transition-colors"
      >
        <div class="flex items-center gap-2 text-xs">
          <PlusCircleIcon class="w-5 h-5" /> Create Hotel
        </div>
      </div>
    </div>

    <div :class="sidebarStore.isShowSidebar ? 'w-[82vw]' : 'w-[90vw]'">
      <div
        class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
      >
        <div class="flex justify-between items-center mb-5">
          <div class="flex gap-4">
            <div
              class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5 w-48"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-2xl font-medium text-black-800">{{
                  totalHotelsCount
                }}</span>
                <span
                  class="text-sm text-green-600 font-semibold"
                  v-if="totalHotelsGrowth > 0"
                >
                  ▲ {{ totalHotelsGrowth }}%
                </span>
                <span
                  class="text-sm text-red-600 font-semibold"
                  v-else-if="totalHotelsGrowth < 0"
                >
                  ▼ {{ Math.abs(totalHotelsGrowth) }}%
                </span>
              </div>
              <p class="text-sm text-black-500">Total Hotels</p>
            </div>

            <div
              class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5 w-48"
            >
              <div class="flex items-center gap-2 mb-1">
                <span
                  v-if="displayedHotelsCount > 0"
                  class="text-2xl font-medium text-black-800"
                  >{{ displayedHotelsCount }}</span
                >
                <span v-else class="text-2xl font-medium text-black-800">0</span>
              </div>
              <p class="text-sm text-black-500">Search Result</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex justify-center items-center border-2 shadow-md rounded-full overflow-hidden">
              <div
                class="cursor-pointer px-4 py-2 text-xs"
                :class="viewMode === 'grid' ? 'bg-[#ff613c] text-white' : 'bg-white'"
                @click="viewMode = 'grid'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div
                class="cursor-pointer px-4 py-2 text-xs"
                @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-[#ff613c] text-white' : 'bg-white'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-6">
          <div class="w-80 flex-shrink-0">
            <div
              class="bg-white rounded-2xl shadow-lg p-5 pb-7 sticky top-6 border border-gray-200"
            >
              <div class="mb-6 mt-2">
                <div class="relative">
                  <input
                    type="text"
                    v-model="search"
                    @input="onSearchInput"
                    placeholder="Search hotels..."
                    class="w-full px-4 py-2.5 pr-10 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-[#FF5B00]/40 focus:outline-none"
                  />
                  <svg
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#FF5B00]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>

              <div class="flex items-center justify-between mb-5 border-b pb-3">
                <h4 class="text-md font-semibold text-gray-700">Filter</h4>
                <div class="flex items-center gap-2">
                  <span
                    v-if="filterCount > 0"
                    class="text-xs bg-[#ff613c] text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {{ filterCount }}
                  </span>
                  <button
                    @click="clearAllFilters"
                    class="text-xs text-gray-400 hover:text-[#FF5B00]"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div class="mb-5 border-b pb-4">
                <div class="flex justify-between items-center mb-2">
                  <h5 class="text-xs font-semibold text-gray-600">
                    Booking Type
                  </h5>
                  <button @click="showBookingType = !showBookingType">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-gray-400 transition-transform"
                      :class="{ 'rotate-180': !showBookingType }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>

                <div v-if="showBookingType" class="space-y-1">
                  <label
                    class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                    :class="
                      bookingType === 'direct_booking'
                        ? 'text-[#FF5B00]'
                        : 'text-black'
                    "
                    @click="selectBookingType('direct_booking')"
                  >
                    <input
                      type="radio"
                      :checked="bookingType === 'direct_booking'"
                      class="accent-[#FF5B00]"
                    />
                    Direct Booking
                  </label>

                  <label
                    class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                    :class="
                      bookingType === 'other_booking'
                        ? 'text-[#FF5B00]'
                        : 'text-black'
                    "
                    @click="selectBookingType('other_booking')"
                  >
                    <input
                      type="radio"
                      :checked="bookingType === 'other_booking'"
                      class="accent-[#FF5B00]"
                    />
                    Other Booking
                  </label>
                </div>
              </div>

              <div class="mb-5 border-b pb-4">
                <div class="flex justify-between items-center mb-2">
                  <h5 class="text-xs font-semibold text-gray-600">Cities</h5>
                  <button @click="showCities = !showCities">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-gray-400 transition-transform"
                      :class="{ 'rotate-180': !showCities }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>

                <div
                  v-if="showCities"
                  class="space-y-1 min-h-40 overflow-y-auto pr-1"
                >
                  <label
                    class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                    :class="
                      selectedCity === '' ? 'text-[#FF5B00]' : 'text-black'
                    "
                    @click="selectCity('')"
                  >
                    <input
                      type="radio"
                      :checked="selectedCity === ''"
                      class="accent-[#FF5B00]"
                    />
                    All Cities
                  </label>

                  <label
                    v-for="city in citiesList"
                    :key="city.id"
                    class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                    :class="
                      selectedCity === city.id ? 'text-[#FF5B00]' : 'text-black'
                    "
                    @click="selectCity(city.id)"
                  >
                    <input
                      type="radio"
                      :checked="selectedCity === city.id"
                      class="accent-[#FF5B00]"
                    />
                    {{ city.name }}
                  </label>
                </div>
              </div>

              <div class="mb-5 border-b pb-4">
                <div class="flex justify-between items-center mb-2">
                  <h5 class="text-xs font-semibold text-gray-600">
                    Price Range
                  </h5>
                  <button @click="showPrice = !showPrice">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-gray-400 transition-transform"
                      :class="{ 'rotate-180': !showPrice }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>

                <div v-if="showPrice" class="space-y-1">
                  <div class="mb-3">
                    <div class="flex items-center gap-2">
                      <div class="">
                        <div class="">
                          <input
                            type="number"
                            v-model.number="customMinPrice"
                            @input="onCustomPriceChange"
                            min="0"
                            placeholder="min price"
                            class="w-[100px] px-3 py-2 text-xs border border-gray-300 rounded-full focus:ring-1 focus:ring-[#FF5B00]/40 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div class="">-</div>
                      <div class="">
                        <div class="">
                          <input
                            type="number"
                            v-model.number="customMaxPrice"
                            @input="onCustomPriceChange"
                            min="0"
                            placeholder="max price"
                            class="w-[100px] px-3 py-2 text-xs border border-gray-300 rounded-full focus:ring-1 focus:ring-[#FF5B00]/40 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label
                      class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                      :class="
                        selectedPriceCategory === 'all'
                          ? 'text-[#FF5B00]'
                          : 'text-black'
                      "
                      @click="selectPriceCategory('all')"
                    >
                      <input
                        type="radio"
                        :checked="selectedPriceCategory === 'all'"
                        class="accent-[#FF5B00]"
                      />
                      All Prices
                    </label>
                  </div>

                  <!-- <div class="mb-4">
                    <label
                      class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                      :class="selectedPriceCategory === 'custom' ? 'text-[#FF5B00]' : 'text-black'"
                      @click="selectPriceCategory('custom')"
                    >
                      <input type="radio" :checked="selectedPriceCategory === 'custom'" class="accent-[#FF5B00]" />
                      Custom Price Range
                    </label>
                  </div> -->

                  <div class="space-y-1">
                    <label
                      v-for="category in priceCategories.filter(
                        (c) => c.id !== 'all' && c.id !== 'custom',
                      )"
                      :key="category.id"
                      class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                      :class="
                        selectedPriceCategory === category.id
                          ? 'text-[#FF5B00]'
                          : 'text-black'
                      "
                      @click="selectPriceCategory(category.id)"
                    >
                      <input
                        type="radio"
                        :checked="selectedPriceCategory === category.id"
                        class="accent-[#FF5B00]"
                      />
                      {{ category.name }}
                    </label>
                  </div>
                </div>
              </div>

              <div class="mb-5 border-b pb-4">
                <div class="flex justify-between items-center mb-2">
                  <h5 class="text-xs font-semibold text-gray-600">Area</h5>
                  <button @click="showArea = !showArea">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-gray-400 transition-transform"
                      :class="{ 'rotate-180': !showArea }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>

                <div
                  v-if="showArea"
                  class="space-y-1 max-h-40 overflow-y-auto pr-1"
                >
                  <label
                    class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                    :class="
                      selectedArea === '' ? 'text-[#FF5B00]' : 'text-black'
                    "
                    @click="selectArea('')"
                  >
                    <input
                      type="radio"
                      :checked="selectedArea === ''"
                      class="accent-[#FF5B00]"
                    />
                    All Areas
                  </label>

                  <label
                    v-for="area in availableAreas"
                    :key="area"
                    class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
                    :class="
                      selectedArea === area ? 'text-[#FF5B00]' : 'text-black'
                    "
                    @click="selectArea(area)"
                  >
                    <input
                      type="radio"
                      :checked="selectedArea === area"
                      class="accent-[#FF5B00]"
                    />
                    {{ area }}
                  </label>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-3">
                  <h5 class="text-xs font-semibold text-gray-600">Amenities</h5>
                  <button
                    v-if="selectedAmenities.length"
                    @click="clearAmenities"
                    class="text-xs text-[#FF5B00] hover:underline"
                  >
                    Clear ({{ selectedAmenities.length }})
                  </button>
                </div>

                <div class="mb-3">
                  <div class="relative">
                    <input
                      type="text"
                      v-model="amenitySearch"
                      placeholder="Search amenities..."
                      class="w-full px-4 py-2.5 pr-10 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-[#FF5B00]/40 focus:outline-none"
                    />
                    <svg
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#FF5B00]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div
                  class="flex scroller-none gap-2 max-h-40 overflow-x-auto pr-1 scrollbar-hide"
                >
                  <button
                    v-for="amenity in filteredAmenities"
                    :key="amenity.id"
                    @click="toggleAmenity(amenity.id)"
                    :class="[
                      'px-3 py-1.5 text-xs rounded-full border transition-all whitespace-nowrap',
                      selectedAmenities.includes(amenity.id)
                        ? 'bg-[#FF5B00] text-white border-[#FF5B00]'
                        : 'bg-white text-black border-gray-300 hover:border-gray-400',
                    ]"
                  >
                    {{ amenity.name }}
                  </button>

                  <div
                    v-if="filteredAmenities.length === 0"
                    class="text-xs text-gray-500 py-2 px-3"
                  >
                    No amenities found
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1">
            <div v-if="viewMode === 'grid' && !loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="hotel in displayedHotels"
                :key="hotel.id"
                class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div class="relative h-40 bg-gray-100 overflow-hidden">
                  <img
                    :src="getHotelImage(hotel)"
                    :alt="hotel.name"
                    class="w-full h-full object-cover"
                  />

                  <button
                    @click="goEditPage(hotel.id)"
                    class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-orange-600"
                  >
                    edit
                  </button>
                </div>

                <div class="p-4">
                  <div
                    class="flex justify-between items-center mb-3 border-b pb-3"
                  >
                    <div>
                      <h4
                        class="text-lg font-semibold text-[#FF5B00] leading-tight"
                      >
                        {{ hotel.name }}
                      </h4>
                      <p
                        class="text-xs text-black-500 flex items-center gap-1 mt-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          class="text-black-400"
                        >
                          <path
                            d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
                          />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {{ hotel.city?.name }} • {{ hotel.hotel_place?.name }}
                      </p>
                    </div>

                    <div class="flex items-center gap-1 text-xs font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        class="text-black-500"
                        viewBox="0 0 24 24"
                      >
                        <polygon
                          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        />
                      </svg>
                      <span class="text-md">
                        {{ hotel.rating || 5 }}
                      </span>
                    </div>
                  </div>

                  <div
                    class="grid grid-cols-2 text-xs font-semibold text-gray-500 pb-1 mb-2"
                  >
                    <span class="text-[#FF5B00]">Room No.</span>
                    <span class="text-right text-[#FF5B00]">Price</span>
                  </div>

                  <div class="space-y-1">
                    <div
                      v-for="room in hotel.rooms?.slice(0, 3)"
                      :key="room.id"
                      @click="goRoomPage(room.hotel_id)"
                      class="grid grid-cols-2 text-xs py-1 cursor-pointer hover:bg-gray-50 rounded-md"
                    >
                      <span class="text-black-700 truncate">
                        {{ room.name }}
                      </span>
                      <span class="text-right font-medium text-black-700">
                        ฿ {{ room.room_price }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="viewMode === 'list' && !loading" class="bg-white rounded-lg shadow">
              <div class="mb-5 overflow-auto rounded-lg shadow">
                <div class="grid grid-cols-6 gap-2 bg-gray-100">
                  <div class="py-3 text-xs font-medium tracking-wide text-center">
                    No.
                  </div>
                  <div class="py-3 text-xs font-medium tracking-wide">
                    Name
                  </div>
                  <div class="py-3 text-xs font-medium tracking-wide ps-6">
                    City
                  </div>
                  <div class="py-3 text-xs font-medium tracking-wide">
                    Place
                  </div>
                  <div class="py-3 text-xs font-medium tracking-wide text-center">
                    Rating
                  </div>
                  <div class="py-3 text-xs font-medium tracking-wide text-center">
                    Actions
                  </div>
                </div>

                <div v-show="!loading">
                  <div v-for="hotel in displayedHotels" :key="hotel.id" class="border-b border-gray-200">
                    <div 
                      @click="toggleExpandedHotel(hotel.id)"
                      class="w-full hover:bg-gray-50 cursor-pointer"
                    >
                      <div class="grid grid-cols-6 gap-2 bg-white py-3">
                        <div class="flex justify-center items-center text-xs text-gray-700 whitespace-nowrap">
                          {{ hotel.id }}
                        </div>
                        <div class="flex  items-center text-xs text-gray-700 whitespace-nowrap overflow-hidden">
                          {{ hotel.name }}
                        </div>
                        <div class="flex  items-center text-xs text-gray-700 whitespace-nowrap ps-6">
                          {{ hotel.city?.name }}
                        </div>
                        <div class="flex justify-start items-center text-xs text-gray-700 whitespace-nowrap overflow-hidden">
                          {{ hotel.hotel_place ? hotel.hotel_place?.name : "-" }}
                        </div>
                        <div class="flex justify-center items-center text-xs text-gray-700 whitespace-nowrap">
                          <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="text-yellow-500" viewBox="0 0 24 24">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            <span>{{ hotel.rating || 5 }}</span>
                          </div>
                        </div>
                        <div class="flex items-center justify-center space-x-2 text-xs text-gray-700 whitespace-nowrap">
                          		    <button
                        			class="px-3 py-1.5 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                      >
                        <i class="fa-solid fa-chevron-down"></i>
												</button>
                          <button
                            @click.stop="goEditPage(hotel.id)"
                            class="px-3 py-1.5 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            v-if="authStore.isSuperAdmin"
                            @click.stop="onDeleteHandler(hotel.id)"
                            class="px-3 py-1.5 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <transition
                      enter-active-class="transition duration-150 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-out"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <div v-if="expandedHotel === hotel.id" class="w-full text-gray-500 bg-gray-50">
                        <div class="grid grid-cols-6 gap-2 bg-gray-300 py-2">
                          <div class="py-2 text-xs font-medium tracking-wide text-center">
                            No.
                          </div>
                          <div class="py-2 text-xs col-span-2 font-medium tracking-wide text-start pl-[7px]">
                            Room Name
                          </div>
                          <div class="py-2 text-xs font-medium tracking-wide text-start">
                            Is Extra
                          </div>
                          <div class="py-2 text-xs font-medium tracking-wide text-start">
                            Has Breakfast
                          </div>
                          <div class="py-2 text-xs font-medium tracking-wide text-center">
                            Price
                          </div>
                        </div>
                        
                        <div
                          class="grid w-full grid-cols-6 gap-2 bg-white py-2 hover:bg-gray-100 cursor-pointer"
                          v-for="room in hotel?.rooms"
                          :key="room.id"
                          @click="goRoomPage(room.hotel_id)"
                        >
                          <div class="p-2 text-xs text-center text-gray-700 whitespace-nowrap">
                            {{ room?.id }}
                          </div>
                          <div class="p-2 text-xs col-span-2 text-start text-gray-700 whitespace-nowrap overflow-hidden pl-17">
                            <p>{{ room?.name }}</p>
                          </div>
                          <div class="p-2 text-xs text-gray-700 whitespace-nowrap overflow-hidden">
                            <p
                              class="text-white inline-block px-2 py-0.5 rounded-full"
                              :class="room?.is_extra == 1 ? 'bg-green-600' : 'bg-red-600'"
                            >
                              {{ room?.is_extra == 1 ? "Yes" : "No" }}
                            </p>
                          </div>
                          <div class="p-2 text-xs text-gray-700 whitespace-nowrap overflow-hidden">
                            <p
                              class="text-white inline-block px-2 py-0.5 rounded-full"
                              :class="room?.has_breakfast == 1 ? 'bg-green-600' : 'bg-red-600'"
                            >
                              {{ room?.has_breakfast == 1 ? "Yes" : "No" }}
                            </p>
                          </div>
                          <div class="p-2 text-xs text-center text-gray-700 whitespace-nowrap overflow-hidden">
                            <p>{{ room?.room_price }} THB</p>
                          </div>
                        </div>
                        
                        <div v-if="!hotel?.rooms || hotel?.rooms.length === 0" class="p-4 text-center text-gray-500 text-sm">
                          No rooms available for this hotel
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="loading"
              class="flex flex-col items-center justify-center py-20"
            >
              <div
                class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FF5B00] border-r-transparent"
              ></div>
              <p class="mt-4 text-gray-600">Loading hotels...</p>
            </div>

            <div
              v-if="!loading && displayedHotels.length === 0"
              class="text-center py-20"
            >
              <div class="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="96"
                  height="96"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"
                  />
                  <path d="M9 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
                  <path d="M18 20v-4a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4v4" />
                </svg>
              </div>
              <h4 class="text-lg font-medium text-gray-700 mb-2">
                No hotels found
              </h4>
              <p class="text-gray-500 mb-6">
                Try adjusting your filters or search criteria
              </p>
              <button
                @click="clearAllFilters"
                class="px-6 py-3 bg-[#FF5B00] text-white rounded-full font-medium hover:bg-[#ff4400] transition-colors"
              >
                Clear All Filters
              </button>
            </div>

            <div v-if="!loading" class="mt-6">
              <div
                v-if="selectedFilter && filteredHotelList.length > 0"
                class="flex justify-between items-center text-xs"
              >
                <div class="px-4 py-2 bg-gray-300 rounded-lg">
                  Page: {{ currentPage }} / {{ totalPages }}
                </div>
                <div class="flex justify-end items-center gap-2 text-xs">
                  <button
                    @click="prevPage"
                    class="px-4 py-2 bg-[#FF5B00] text-white rounded-lg"
                    :disabled="currentPage === 1"
                  >
                    Previous
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-[#FF5B00] text-white rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </div>

              <Pagination
                v-if="!selectedFilter && hotels?.data?.length > 0"
                :data="hotels"
                @change-page="changePage"
              />
            </div>
          </div>
        </div>

        <Modal :isOpen="importModal" @closeModal="importModal = false">
          <DialogPanel
            class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
          >
            <DialogTitle
              as="h3"
              class="text-lg font-medium leading-6 text-gray-900 mb-5"
            >
              Import Hotels
            </DialogTitle>
            <form @submit.prevent="importActionHandler" class="space-y-4">
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              >
                <DocumentPlusIcon
                  class="w-12 h-12 text-gray-400 mx-auto mb-3"
                />
                <p class="text-sm text-gray-600 mb-3">
                  Upload CSV file with hotel data
                </p>
                <input
                  type="file"
                  @change="importFileAction"
                  accept=".csv"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF5B00] file:text-white hover:file:bg-[#ff4400]"
                />
              </div>
              <button
                type="submit"
                class="w-full bg-[#FF5B00] text-white py-3 rounded-lg font-medium hover:bg-[#ff4400] transition-colors"
                :disabled="!fileImport"
              >
                Start Import
              </button>
            </form>
            <div class="mt-6 space-y-3 border border-gray-200 p-4 rounded-lg">
              <p class="font-semibold text-sm">Import Guidelines:</p>
              <ul class="text-xs text-gray-600 space-y-1">
                <li>• File must be in CSV format</li>
                <li>
                  • Include all required columns (name, city, rating, etc.)
                </li>
                <li>
                  • Import process may take several minutes for large files
                </li>
                <li>• You'll receive a notification when complete</li>
                <li>• Check error logs for any failed entries</li>
              </ul>
            </div>
          </DialogPanel>
        </Modal>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  PlusIcon,
  DocumentPlusIcon,
  PlusCircleIcon,
} from "@heroicons/vue/24/outline";
import Pagination from "../components/Pagination.vue";
import Layout from "./Layout.vue";
import { useSidebarStore } from "../stores/sidebar";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import Modal from "../components/Modal.vue";
import { useHotelStore } from "../stores/hotel";
import { useAuthStore } from "../stores/auth";
import { useCityStore } from "../stores/city";
import { useFacilityStore } from "../stores/facility";
import debounce from "lodash/debounce";

const toast = useToast();
const hotelStore = useHotelStore();
const authStore = useAuthStore();
const cityStore = useCityStore();
const facilityStore = useFacilityStore();
const sidebarStore = useSidebarStore();
const router = useRouter();

const { hotels, loading, importLoading } = storeToRefs(hotelStore);
const { cities } = storeToRefs(cityStore);
const { facilities } = storeToRefs(facilityStore);

const viewMode = ref('grid');
const expandedHotel = ref(null);

const search = ref("");
const selectedFilter = ref("");
const bookingType = ref("direct_booking");
const hotelShowList = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(12);
const loadingPlaces = ref(false);

const showBookingType = ref(true);
const showCities = ref(true);
const showPrice = ref(true);
const showArea = ref(true);

const selectedCity = ref("");
const selectedArea = ref("");
const selectedAmenities = ref([]);
const selectedPriceCategory = ref("all");
const customMinPrice = ref(0);
const customMaxPrice = ref(50000);

const totalHotelsCount = ref(0);
const totalHotelsGrowth = ref(10);

const amenitySearch = ref("");

const priceCategories = [
  { id: "all", name: "All Prices", min: 0, max: 50000 },
  { id: "custom", name: "Custom Price Range" },
  { id: "budget", name: "Budget Price (0-1200)", min: 0, max: 1200 },
  { id: "standard", name: "Standard Price (1201-1800)", min: 1201, max: 1800 },
  { id: "premium", name: "Premium Price (1801-2500)", min: 1801, max: 2500 },
  {
    id: "luxury",
    name: "Luxury Price (2501 and above)",
    min: 2501,
    max: 50000,
  },
];

const missingDataOptions = ref([
  { id: 1, name: "choose missing", value: "" },
  { id: 2, name: "description missing", value: "description" },
  { id: 3, name: "photo missing", value: "images" },
  { id: 4, name: "facilities missing", value: "facilities" },
  { id: 5, name: "map missing", value: "map" },
  { id: 6, name: "star rating missing", value: "rating" },
  { id: 7, name: "nearby places missing", value: "nearby_places" },
  { id: 8, name: "banks missing", value: "bank_name" },
  { id: 9, name: "place missing", value: "place" },
  { id: 10, name: "bank account missing", value: "bank_account_number" },
]);

const citiesList = computed(() => {
  return cities.value?.data || [];
});

const findBangkokId = () => {
  if (!citiesList.value || citiesList.value.length === 0) return null;
  const bangkok = citiesList.value.find(
    (city) =>
      city.name.toLowerCase().includes("bangkok") ||
      city.name.toLowerCase().includes("กรุงเทพ") ||
      city.name.toLowerCase().includes("บางกอก"),
  );
  return bangkok ? bangkok.id : citiesList.value[0]?.id || null;
};

const availableAreas = computed(() => {
  if (!cities.value?.data) return [];

  if (!selectedCity.value) {
    const allPlaces = new Set();
    cities.value.data.forEach((city) => {
      if (city.places && Array.isArray(city.places)) {
        city.places.forEach((place) => {
          if (place && place.trim()) allPlaces.add(place.trim());
        });
      }
    });
    return Array.from(allPlaces).sort();
  }

  const city = cities.value.data.find((c) => c.id == selectedCity.value);
  if (!city || !city.places || !Array.isArray(city.places)) return [];

  const uniquePlaces = new Set();
  city.places.forEach((place) => {
    if (place && place.trim()) uniquePlaces.add(place.trim());
  });
  return Array.from(uniquePlaces).sort();
});

const allAmenities = computed(() => {
  return facilities.value?.data || [];
});

const filteredAmenities = computed(() => {
  if (!allAmenities.value.length) return [];
  if (!amenitySearch.value) return allAmenities.value;
  return allAmenities.value.filter((amenity) =>
    amenity.name?.toLowerCase().includes(amenitySearch.value.toLowerCase()),
  );
});

const filterCount = computed(() => {
  let count = 0;
  if (bookingType.value !== "direct_booking") count++;
  if (selectedCity.value) count++;
  if (selectedPriceCategory.value !== "all") count++;
  if (selectedArea.value) count++;
  if (selectedAmenities.value.length > 0) count++;
  if (selectedFilter.value) count++;
  return count;
});

const displayedHotelsCount = computed(() => {
  if (selectedFilter.value) {
    return filteredHotelList.value.length;
  } else {
    return hotels.value?.meta?.total || hotels.value?.data?.length || 0;
  }
});

const getHotelPrice = (hotel) => {
  if (!hotel.rooms || !Array.isArray(hotel.rooms) || hotel.rooms.length === 0)
    return 0;
  const prices = hotel.rooms
    .map((room) => parseInt(room.room_price) || 0)
    .filter((price) => price > 0);
  if (prices.length === 0) return 0;
  return Math.min(...prices);
};

const filteredHotelList = computed(() => {
  if (!hotelShowList.value || !Array.isArray(hotelShowList.value)) return [];

  let filtered = [...hotelShowList.value];

  if (selectedFilter.value) {
    filtered = filtered.filter((hotel) => {
      switch (selectedFilter.value) {
        case "description":
          return (
            !hotel.description ||
            hotel.description === "null" ||
            hotel.description.trim() === "" ||
            !hotel.full_description ||
            hotel.full_description === "null" ||
            hotel.full_description.trim() === ""
          );
        case "images":
          return (
            !hotel.images ||
            hotel.images === "null" ||
            !Array.isArray(hotel.images) ||
            hotel.images.length === 0
          );
        case "facilities":
          return (
            !hotel.facilities ||
            hotel.facilities === "null" ||
            !Array.isArray(hotel.facilities) ||
            hotel.facilities.length === 0
          );
        case "map":
          return (
            !hotel.location_map ||
            hotel.location_map === "null" ||
            hotel.location_map.trim() === "" ||
            !hotel.location_map_title ||
            hotel.location_map_title === "null" ||
            hotel.location_map_title.trim() === ""
          );
        case "rating":
          return (
            !hotel.rating ||
            hotel.rating === "null" ||
            hotel.rating.trim() === ""
          );
        case "nearby_places":
          return (
            !hotel.nearby_places ||
            !Array.isArray(hotel.nearby_places) ||
            hotel.nearby_places.length === 0
          );
        case "bank_name":
          return (
            !hotel.bank_name ||
            hotel.bank_name === "null" ||
            hotel.bank_name.trim() === ""
          );
        case "place":
          return (
            !hotel.place || hotel.place === "null" || hotel.place.trim() === ""
          );
        case "bank_account_number":
          return (
            !hotel.bank_account_number ||
            hotel.bank_account_number === "null" ||
            hotel.bank_account_number.trim() === ""
          );
        default:
          return true;
      }
    });
  }

  if (selectedFilter.value && selectedPriceCategory.value !== "all") {
    const category = priceCategories.find(
      (c) => c.id === selectedPriceCategory.value,
    );
    if (category) {
      const min = customMinPrice.value || 0;
      const max = customMaxPrice.value || 50000;
      filtered = filtered.filter((hotel) => {
        const hotelPrice = getHotelPrice(hotel);
        return hotelPrice >= min && hotelPrice <= max;
      });
    }
  }

  return filtered;
});

const displayedHotels = computed(() => {
  if (selectedFilter.value) {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredHotelList.value.slice(start, end);
  } else {
    return hotels.value?.data || [];
  }
});

const totalPages = computed(() => {
  if (selectedFilter.value) {
    return Math.ceil(filteredHotelList.value.length / itemsPerPage.value);
  }
  return hotels.value?.meta?.last_page || 1;
});

const getHotelImage = (hotel) => {
  if (hotel.images && Array.isArray(hotel.images) && hotel.images.length > 0) {
    return hotel.images[0].image;
  }
  return "https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png";
};

const toggleExpandedHotel = (hotelId) => {
  expandedHotel.value = expandedHotel.value === hotelId ? null : hotelId;
};

const selectBookingType = (type) => {
  bookingType.value = type;
  currentPage.value = 1;
  fetchHotels();
};

const selectCity = (cityId) => {
  selectedCity.value = cityId;
  selectedArea.value = "";
  currentPage.value = 1;

  // Add loading state here
  loadingPlaces.value = true;
  fetchHotels().finally(() => {
    loadingPlaces.value = false;
  });
};

const selectPriceCategory = (categoryId) => {
  selectedPriceCategory.value = categoryId;
  currentPage.value = 1;
  if (categoryId !== "custom") {
    fetchHotels();
  }
};

const onCustomPriceChange = debounce(() => {
  currentPage.value = 1;
  fetchHotels();
}, 500);

const selectArea = (area) => {
  selectedArea.value = area;
  currentPage.value = 1;
  fetchHotels();
};

const toggleAmenity = (amenityId) => {
  const index = selectedAmenities.value.indexOf(amenityId);
  if (index > -1) {
    selectedAmenities.value.splice(index, 1);
  } else {
    selectedAmenities.value.push(amenityId);
  }
  currentPage.value = 1;
  fetchHotels();
};

const clearAmenities = () => {
  selectedAmenities.value = [];
  amenitySearch.value = "";
  currentPage.value = 1;
  fetchHotels();
};

const onSearchInput = debounce(() => {
  currentPage.value = 1;
  fetchHotels();
}, 500);

const clearAllFilters = () => {
  search.value = "";
  selectedFilter.value = "";
  bookingType.value = "direct_booking";

  // const bangkokId = findBangkokId();
  // selectedCity.value = bangkokId || "";
  selectedCity.value = "";
  selectedPriceCategory.value = "all";
  selectedArea.value = "";
  selectedAmenities.value = [];
  customMinPrice.value = 0;
  customMaxPrice.value = 50000;
  amenitySearch.value = "";
  currentPage.value = 1;
  fetchHotels();
};

const fetchHotels = async () => {
  const params = {
    search: search.value,
    page: currentPage.value,
    limit: selectedFilter.value ? 1000 : 12,
  };

  if (bookingType.value === "direct_booking") {
    params.type = "direct_booking";
  } else if (bookingType.value === "other_booking") {
    params.type = "other_booking";
  }

  if (selectedCity.value) {
    params.city_id = selectedCity.value;
  }

  if (selectedPriceCategory.value !== "all") {
    const category = priceCategories.find(
      (c) => c.id === selectedPriceCategory.value,
    );
    if (category) {
      const min = customMinPrice.value || 0;
      const max = customMaxPrice.value || 50000;
      params.price_range = `${min}-${max}`;
    }
  }

  if (selectedArea.value) {
    params.place = selectedArea.value;
  }

  if (selectedAmenities.value.length > 0) {
    params.facilities = selectedAmenities.value.join(",");
  }

  try {
    await hotelStore.getListAction(params);

    if (hotels.value && hotels.value.data) {
      hotelShowList.value = [...hotels.value.data];
    }

    // Always update total count
    if (hotels.value?.meta?.total_count) {
      totalHotelsCount.value = hotels.value.meta.total_count;
    }
  } catch (error) {
    console.error("Error fetching hotels:", error);
    toast.error("Failed to fetch hotels");
  }
};

const fetchTotalHotelsCount = async () => {
  try {
    const params = {
      limit: 12,
      page: 1,
    };

    const response = await hotelStore.getListAction(params);

    if (response?.meta?.total_count) {
      totalHotelsCount.value = response.meta.total_count;
    }
  } catch (error) {
    console.error("Error fetching total hotels count:", error);
    try {
      const retryResponse = await hotelStore.getListAction({
        limit: 1000,
        page: 1,
      });
      if (retryResponse?.data) {
        totalHotelsCount.value = retryResponse.data.length;
      }
    } catch (retryError) {
      console.error("Retry failed:", retryError);
    }
  }
};

const nextPage = () => {
  if (selectedFilter.value) {
    if (currentPage.value < totalPages.value) {
      currentPage.value += 1;
    }
  } else {
    if (currentPage.value < totalPages.value) {
      currentPage.value += 1;
      fetchHotels();
    }
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    if (!selectedFilter.value) {
      fetchHotels();
    }
  }
};

const changePage = async (url) => {
  const data = {
    search: search.value,
    limit: 12,
  };

  if (bookingType.value === "direct_booking") {
    data.type = "direct_booking";
  } else if (bookingType.value === "other_booking") {
    data.type = "other_booking";
  }

  if (selectedCity.value) {
    data.city_id = selectedCity.value;
  }

  if (selectedPriceCategory.value !== "all") {
    const category = priceCategories.find(
      (c) => c.id === selectedPriceCategory.value,
    );
    if (category) {
      const min = customMinPrice.value || 0;
      const max = customMaxPrice.value || 50000;
      data.price_range = `${min}-${max}`;
    }
  }

  if (selectedArea.value) {
    data.place = selectedArea.value;
  }

  if (selectedAmenities.value.length > 0) {
    data.facilities = selectedAmenities.value.join(",");
  }

  await hotelStore.getChangePage(url, data);
};

const goEditPage = (data) => {
  window.open(`/products-v2/hotel/edit/${data}`, "_blank");
};

const onDeleteHandler = async (id) => {
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
        const response = await hotelStore.deleteAction(id);
        toast.success(response.message);

        await fetchTotalHotelsCount();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete hotel");
      }
      await fetchHotels();
    }
  });
};

const exportAction = async () => {
  const res = await hotelStore.downloadExport();
  if (res && res.result && res.result.download_link) {
    window.open(res.result.download_link);
  } else {
    toast.error("Export failed");
  }
};

// Import/Export
const importModal = ref(false);
const fileImport = ref(null);

const importHandler = () => {
  importModal.value = true;
};

const importFileAction = (e) => {
  fileImport.value = e.target.files[0];
};

const importActionHandler = async () => {
  if (!fileImport.value) {
    toast.error("Please select a file to import");
    return;
  }

  const frmData = new FormData();
  frmData.append("file", fileImport.value);

  try {
    importModal.value = false;
    const res = await hotelStore.importAction(frmData);
    fileImport.value = null;
    toast.success(`Import ${res.message}`);
    // Refresh total count after import
    await fetchTotalHotelsCount();
    await fetchHotels();
  } catch (error) {
    toast.error(error.response?.data?.message || "Import failed");
  }
};

const goRoomPage = (hotelId) => {
  router.push(`/products/3?edit=${hotelId}`);
};

watch(hotels, (newValue) => {
  if (newValue && newValue.data) {
    hotelShowList.value = [...newValue.data];
  }

  if (newValue?.meta?.total_count) {
    totalHotelsCount.value = newValue.meta.total_count;
  }
});

watch(selectedCity, () => {
  loadingPlaces.value = true;
  setTimeout(() => {
    loadingPlaces.value = false;
  }, 300);
});

watch(bookingType, () => {
  currentPage.value = 1;
  fetchHotels();
});

// Initialize
onMounted(async () => {
  await Promise.all([
    cityStore.getListHotelCityAction({ limit: 100 }),
    facilityStore.getListAction(),
  ]);

  const bangkokId = findBangkokId();
  if (bangkokId) {
    console.log(bangkokId);
  } else if (citiesList.value.length > 0) {
    selectedCity.value = citiesList.value[0].id;
  }

  await fetchHotels();
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.expanded-enter-active,
.expanded-leave-active {
  transition: all 0.2s ease;
}

.expanded-enter-from,
.expanded-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>