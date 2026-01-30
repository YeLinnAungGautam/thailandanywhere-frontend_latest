<template>
	<Layout>
		<div class="mb-5  flex gap-x-6 items-center justify-between">
			<div class="flex items-center gap-4">
			<button
				@click="$router.push('/products-v2')"
				class="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50"
			>
				<svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<div class="text-xl font-semibold">Attractions</div>
			</div>
			<div
        @click="router.push('/products-v2/attraction/create')"
        class="pl-2 pr-3 me-7 py-2 bg-[#FF5B00] text-white cursor-pointer rounded-full hover:bg-[#ff4400] transition-colors"
      >
        <div class="flex items-center gap-2 text-xs">
          <PlusCircleIcon class="w-5 h-5" /> Create Attraction
        </div>
      </div>
			<!-- <div class="space-x-3">
        <Button
          :leftIcon="DocumentPlusIcon"
          intent="text"
          @click="importModal = true"
          :loading="importLoading"
        >
          Import
        </Button>
        <Button :leftIcon="ShareIcon" intent="text" @click="exportAction">
          Export
        </Button>
        <Button
          :leftIcon="PlusIcon"
          @click="goToCreate"
          v-if="!authStore.isAgent"
        >
          Create
        </Button>
      </div> -->
		</div>

		<div :class="sidebarStore.isShowSidebar ? 'w-[80vw]' : 'w-[90vw]'">
			<div class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block">
				<div class="flex justify-between items-center mb-5">
					<div class="flex gap-4">
						<div class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5 w-48">
							<div class="flex items-center gap-2 mb-1">
								<span class="text-2xl font-medium text-black-800">{{ totalAttractionsCount }}</span>
								<span class="text-sm text-green-600 font-semibold" v-if="totalAttractionsGrowth > 0">
									▲ {{ totalAttractionsGrowth }}%
								</span>
								<span class="text-sm text-red-600 font-semibold" v-else-if="totalAttractionsGrowth < 0">
									▼ {{ Math.abs(totalAttractionsGrowth) }}%
								</span>
							</div>
							<p class="text-sm text-black-500">Total Attractions</p>
						</div>

						<div class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5 w-48">
							<div class="flex items-center gap-2 mb-1">
								<span v-if="displayedAttractionsCount > 0" class="text-2xl font-medium text-black-800">{{
									displayedAttractionsCount
								}}</span>
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
					<div class="w-80 flex-shrink-0 h-[calc(100vh-100px)] overflow-y-auto">
						<div class="bg-white rounded-2xl shadow-lg p-5 pb-7 sticky top-6 border border-gray-200">
							<div class="mb-6 mt-2">
								<div class="relative">
									<input
										type="text"
										v-model="search"
										@input="onSearchInput"
										placeholder="Search attractions..."
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
									<button @click="clearAllFilters" class="text-xs text-gray-400 hover:text-[#FF5B00]">Clear All</button>
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

								<div v-if="showCities" class="space-y-1 min-h-40 overflow-y-auto pr-1">
									<label
										class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
										:class="selectedCity === '' ? 'text-[#FF5B00]' : 'text-black'"
										@click="selectCity('')"
									>
										<input type="radio" :checked="selectedCity === ''" class="accent-[#FF5B00]" />
										All Cities
									</label>

									<label
										v-for="city in citiesList"
										:key="city.id"
										class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
										:class="selectedCity === city.id ? 'text-[#FF5B00]' : 'text-black'"
										@click="selectCity(city.id)"
									>
										<input type="radio" :checked="selectedCity === city.id" class="accent-[#FF5B00]" />
										{{ city.name }}
									</label>
								</div>
							</div>

							<div class="mb-5 border-b pb-4">
								<div class="flex justify-between items-center mb-2">
									<h5 class="text-xs font-semibold text-gray-600">Price Range</h5>
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
											:class="selectedPriceCategory === 'all' ? 'text-[#FF5B00]' : 'text-black'"
											@click="selectPriceCategory('all')"
										>
											<input type="radio" :checked="selectedPriceCategory === 'all'" class="accent-[#FF5B00]" />
											All Prices
										</label>
									</div>

									<div class="space-y-1">
										<label
											v-for="category in priceCategories.filter((c) => c.id !== 'all' && c.id !== 'custom')"
											:key="category.id"
											class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
											:class="selectedPriceCategory === category.id ? 'text-[#FF5B00]' : 'text-black'"
											@click="selectPriceCategory(category.id)"
										>
											<input type="radio" :checked="selectedPriceCategory === category.id" class="accent-[#FF5B00]" />
											{{ category.name }}
										</label>
									</div>
								</div>
							</div>

							<div class="mb-5 border-b pb-4">
								<div class="flex justify-between items-center mb-2">
									<h5 class="text-xs font-semibold text-gray-600">Status</h5>
									<button @click="showStatus = !showStatus">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="w-4 h-4 text-gray-400 transition-transform"
											:class="{ 'rotate-180': !showStatus }"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="m6 9 6 6 6-6" />
										</svg>
									</button>
								</div>

								<div v-if="showStatus" class="space-y-3 pt-2">
									<label class="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											v-model="showStatusChecked"
											@change="onShowStatusChange"
											class="h-4 w-4 text-[#FF5B00] border-gray-300 rounded focus:ring-[#FF5B00]"
										/>
										<span class="text-sm text-gray-700">Is show</span>
									</label>
								</div>
							</div>

							<div class="mb-5">
								<div class="flex justify-between items-center mb-2">
									<h5 class="text-xs font-semibold text-gray-600">Categories</h5>
									<button @click="showCategories = !showCategories">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="w-4 h-4 text-gray-400 transition-transform"
											:class="{ 'rotate-180': !showCategories }"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="m6 9 6 6 6-6" />
										</svg>
									</button>
								</div>

								<div v-if="showCategories" class="space-y-1 min-h-60 pr-1">
									<label
										class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
										:class="selectedCategory === '' ? 'text-[#FF5B00]' : 'text-black'"
										@click="selectCategory('')"
									>
										<input type="radio" :checked="selectedCategory === ''" class="accent-[#FF5B00]" />
										All Categories
									</label>

									<label
										v-for="category in attractionCategories"
										:key="category.id"
										class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded-md p-2"
										:class="selectedCategory === category.id ? 'text-[#FF5B00]' : 'text-black'"
										@click="selectCategory(category.id)"
									>
										<input type="radio" :checked="selectedCategory === category.id" class="accent-[#FF5B00]" />
										{{ category.name }}
									</label>
								</div>
							</div>
						</div>
					</div>

					<div class="flex-1">
						<div v-if="viewMode === 'grid' && !loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div
								v-for="attraction in displayedAttractions"
								:key="attraction.id"
								class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
							>
								<div class="relative h-40 bg-gray-100 overflow-hidden">
									<img
										:src="getAttractionImage(attraction)"
										:alt="attraction.name"
										class="w-full h-full object-cover"
									/>

									<button
										@click="goEditPage(attraction.id)"
										class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-orange-600"
									>
										edit
									</button>

									<!-- <div class="absolute bottom-2 left-2">
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full text-white"
                      :class="
                        getShowStatus(attraction) === 'Yes'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      "
                    >
                      {{ getShowStatus(attraction) }}
                    </span>
                  </div> -->
								</div>

								<div class="p-4">
									<div class="flex justify-between items-center mb-3 border-b pb-3">
										<div>
											<h4 class="text-lg font-semibold text-[#FF5B00] leading-tight line-clamp-1">
												{{ attraction.name }}
											</h4>
											<p class="text-xs text-black-500 flex items-center gap-1 mt-2">
												<MapPinIcon class="w-3 h-3 text-black" />

												<span v-if="attraction.cities.length !== 0">{{ attraction.cities[0]["name"] }}</span>
												<span v-else class="text-gray-500">No City</span>
												<img
													src="https://cdn-icons-png.flaticon.com/128/2778/2778640.png"
													class="w-3 h-3 ms-1"
													alt=""
												/>
												<span v-if="attraction.categories.length !== 0">{{ attraction.categories[0]["name"] }}</span>
												<span v-else class="text-gray-500">No Category</span>
											</p>
										</div>

										<!-- <div class="flex items-center gap-1 text-xs font-semibold">
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
                        {{ attraction.rating || 5 }}
                      </span>
                    </div> -->
									</div>

									<div v-if="attraction.variations && attraction.variations.length > 0">
										<div class="grid grid-cols-2 text-xs font-semibold text-gray-500 pb-1 mb-2">
											<span class="text-[#FF5B00]">Tickets</span>
											<span class="text-right text-[#FF5B00]">Price</span>
										</div>

										<div class="space-y-1">
											<div
												v-for="variation in attraction.variations.slice(0, 3)"
												:key="variation.id"
												@click="goVariationPage(attraction.id)"
												class="grid grid-cols-2 text-xs py-1 cursor-pointer hover:bg-gray-50 rounded-md"
											>
												<span class="text-black-700 truncate">
													{{ variation.name }}
												</span>
												<span class="text-right font-medium text-black-700"> ฿ {{ variation.price || "0" }} </span>
											</div>
											<!-- 
                      <div
                        v-if="attraction.variations.length > 3"
                        class="text-xs text-center text-[#FF5B00] font-medium py-1 hover:bg-gray-50 rounded-md cursor-pointer"
                        @click="goVariationPage(attraction.id)"
                      >
                        + {{ attraction.variations.length - 3 }} more tickets
                      </div> -->
										</div>
									</div>

									<div v-else class="text-center py-4">
										<p class="text-xs text-gray-500">No tickets available</p>
									</div>
								</div>
							</div>
						</div>

						<div v-if="viewMode === 'list' && !loading" class="bg-white rounded-lg shadow">
							<div class="mb-5 overflow-auto rounded-lg shadow">
								<div class="grid grid-cols-5 gap-2 bg-gray-100">
									<div class="py-3 text-xs font-medium tracking-wide text-center">
										No.
									</div>
									<div class="py-3 text-xs font-medium tracking-wide">
										Image
									</div>
									<div class="py-3 text-xs font-medium tracking-wide">
										Name
									</div>
									<div class="py-3 text-xs font-medium tracking-wide text-center">
										Is Show
									</div>
									<div class="py-3 text-xs font-medium tracking-wide text-center">
										Actions
									</div>
								</div>

								<div v-show="!loading">
									<div v-for="attraction in displayedAttractions" :key="attraction.id" class="border-b border-gray-200">
										<div 
											@click="toggleExpandedAttraction(attraction.id)"
											class="w-full hover:bg-gray-50 cursor-pointer"
										>
											<div class="grid grid-cols-5 gap-2 bg-white py-3">
												<div class="flex justify-center items-center text-xs text-gray-700 whitespace-nowrap">
													{{ attraction.id }}
												</div>
												<div class="flex  items-center text-xs text-gray-700 pl-4">
													        <img
                    v-if="attraction.cover_image"
                    :src="attraction.cover_image"
                    class="w-14 h-10 rounded-lg object-cover"
                    alt="Cover"
                  />
                  <span v-else class="text-gray-400">-</span>
												</div>
												<div class="flex  items-center text-xs text-gray-700 truncate whitespace-nowrap">
													{{ attraction.name }}
												</div>
												<div class="flex justify-center items-center text-xs text-gray-700 whitespace-nowrap">
										<span
												class="px-2 py-0.5 rounded-full text-white text-xs"
												:class="
													attraction.meta_data?.is_show == 1
														? 'bg-green-500'
														: 'bg-red-500'
												"
											>
												{{ attraction.meta_data?.is_show == 1 ? "Yes" : "No" }}
                  </span>
												</div>
												<div class="flex items-center justify-center space-x-2 text-xs text-gray-700 whitespace-nowrap">
											<button
                        class="px-3 py-1.5 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                      >
                        <i class="fa-solid fa-chevron-down"></i>
												</button>
													<button
														@click.stop="goEditPage(attraction.id)"
														class="px-3 py-1.5 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
													>
														<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
														</svg>
													</button>
													<button
														v-if="authStore.isSuperAdmin"
														@click.stop="onDeleteHandler(attraction.id)"
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
											<div v-if="expandedAttraction === attraction.id" class="w-full text-gray-500 bg-gray-50">
												<div class="grid grid-cols-6 gap-2 bg-gray-300 py-2">
													<div class="py-2 text-xs font-medium tracking-wide text-center">
														No.
													</div>
													<div class="py-2 text-xs col-span-2 font-medium tracking-wide text-start pl-[9px]">
														Ticket Name
													</div>
													<div class="py-2 text-xs font-medium tracking-wide text-start">
														Is Main
													</div>
													<div class="py-2 text-xs font-medium tracking-wide text-start">
														Is Show
													</div>
													<div class="py-2 text-xs font-medium tracking-wide text-center">
														Price
													</div>
												</div>
												
												<div
													class="grid w-full grid-cols-6 gap-2 bg-white py-2 hover:bg-gray-100 cursor-pointer"
													v-for="variation in attraction?.variations"
													:key="variation.id"
													@click="goVariationPage(attraction.id)"
												>
													<div class="p-2 text-xs text-center text-gray-700 whitespace-nowrap">
														{{ variation?.id }}
													</div>
													<div class="p-2 text-xs col-span-2  text-gray-700 whitespace-nowrap overflow-hidden pl-17">
														<p>{{ variation?.name }}</p>
													</div>
													<div class="p-2 text-xs text-gray-700 whitespace-nowrap overflow-hidden">
														<span
                      v-if="variation.meta_data"
                      class="text-white inline-block px-2 py-0.5 rounded-full text-xs"
                      :class="
                        JSON.parse(variation.meta_data)[0]?.is_main == 1
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      "
                    >
                      {{
                        JSON.parse(variation.meta_data)[0]?.is_main == 1
                          ? "Yes"
                          : "No"
                      }}
                    </span>
													</div>
													<div class="p-2 text-xs text-gray-700 whitespace-nowrap overflow-hidden">
														<p
															class="text-white inline-block px-2 py-0.5 rounded-full"
															:class="variation?.is_show == 1 ? 'bg-green-600' : 'bg-red-600'"
														>
															{{ variation?.is_show == 1 ? "Yes" : "No" }}
														</p>
													</div>
													<div class="p-2 text-xs text-center text-gray-700 whitespace-nowrap overflow-hidden">
														<p>฿ {{ variation?.price || "0" }}</p>
													</div>
												</div>
												
												<div v-if="!attraction?.variations || attraction?.variations.length === 0" class="p-4 text-center text-gray-500 text-sm">
													No tickets available for this attraction
												</div>
											</div>
										</transition>
									</div>
								</div>
							</div>
						</div>

						<div v-if="loading" class="flex flex-col items-center justify-center py-20">
							<div
								class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FF5B00] border-r-transparent"
							></div>
							<p class="mt-4 text-gray-600">Loading attractions...</p>
						</div>

						<div v-if="!loading && displayedAttractions.length === 0" class="text-center py-20">
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
									<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
									<path d="M13.73 21a2 2 0 0 1-3.46 0" />
								</svg>
							</div>
							<h4 class="text-lg font-medium text-gray-700 mb-2">No attractions found</h4>
							<p class="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
							<button
								@click="clearAllFilters"
								class="px-6 py-3 bg-[#FF5B00] text-white rounded-full font-medium hover:bg-[#ff4400] transition-colors"
							>
								Clear All Filters
							</button>
						</div>

						<div v-if="!loading && displayedAttractions.length > 0" class="mt-6">
							<div
								v-if="selectedFilter && filteredAttractionList.length > 0"
								class="flex justify-between items-center text-xs"
							>
								<div class="px-4 py-2 bg-gray-300 rounded-lg">Page: {{ currentPage }} / {{ totalPages }}</div>
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
								v-if="!selectedFilter && entrances?.data?.length > 0"
								:data="entrances"
								@change-page="changePage"
							/>
						</div>
					</div>
				</div>
			</div>

			<Modal :isOpen="importModal" @closeModal="importModal = false">
				<DialogPanel
					class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
				>
					<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-5">
						Import Attractions
					</DialogTitle>
					<form @submit.prevent="importActionHandler" class="space-y-4">
						<div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
							<DocumentPlusIcon class="w-12 h-12 text-gray-400 mx-auto mb-3" />
							<p class="text-sm text-gray-600 mb-3">Upload CSV file with attraction data</p>
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
							<li>• Include all required columns (name, city, category, etc.)</li>
							<li>• Import process may take several minutes for large files</li>
							<li>• You'll receive a notification when complete</li>
							<li>• Check error logs for any failed entries</li>
						</ul>
					</div>
				</DialogPanel>
			</Modal>
		</div>
	</Layout>
</template>

<script setup>
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { PencilSquareIcon, TrashIcon, ShareIcon, PlusIcon, DocumentPlusIcon,   PlusCircleIcon, } from "@heroicons/vue/24/outline";
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
import { useEntranceStore } from "../stores/entrance";
import { useAuthStore } from "../stores/auth";
import { useCityStore } from "../stores/city";
import debounce from "lodash/debounce";

const toast = useToast();
const entranceStore = useEntranceStore();
const authStore = useAuthStore();
const cityStore = useCityStore();
const sidebarStore = useSidebarStore();
const router = useRouter();

const { entrances, loading, importLoading } = storeToRefs(entranceStore);
const { cities } = storeToRefs(cityStore);

const viewMode = ref('grid');
const expandedAttraction = ref(null);

const search = ref("");
const selectedFilter = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(12);
const attractionShowList = ref([]);

const showCities = ref(true);
const showPrice = ref(true);
const showStatus = ref(true);
const showCategories = ref(true);

const selectedCity = ref("");
const selectedCategory = ref("");
const selectedPriceCategory = ref("all");
const customMinPrice = ref(0);
const customMaxPrice = ref(50000);
const showStatusChecked = ref(false);

const totalAttractionsCount = ref(0);
const totalAttractionsGrowth = ref(8);

const priceCategories = [
	{ id: "all", name: "All Prices", min: 0, max: 50000 },
	{ id: "budget", name: "Budget Price (0 - 1200)", min: 0, max: 1200 },
	{ id: "standard", name: "Standard Price (1200 - 1800)", min: 1200, max: 1800 },
	{ id: "premium", name: "Premium Price (1801 - 3000)", min: 1801, max: 3000 },
	{ id: "luxury", name: "Luxury Price (3000 and above)", min: 3001, max: 50000 },
];

const attractionCategories = [
	{ id: 32, name: "Amusement Park" },
	{ id: 40, name: "Dinner Cruises" },
	{ id: 31, name: "Water Park" },
	{ id: 17, name: "Safari" },
	{ id: 16, name: "Museums" },
	{ id: 29, name: "Theme Parks" },
	{ id: 54, name: "Buffet" },
	{ id: 42, name: "Island Tours" },
	{ id: 39, name: "Shows" },
	{ id: 22, name: "Skywalks" },
];

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

const filterCount = computed(() => {
	let count = 0;
	if (selectedCity.value) count++;
	if (selectedPriceCategory.value !== "all") count++;
	if (customMinPrice.value > 0 || customMaxPrice.value < 50000) count++;
	if (selectedCategory.value) count++;
	if (showStatusChecked.value) count++;
	if (selectedFilter.value) count++;
	return count;
});

const displayedAttractionsCount = computed(() => {
	if (selectedFilter.value) {
		return filteredAttractionList.value.length;
	} else {
		return entrances.value?.meta?.total || entrances.value?.data?.length || 0;
	}
});

const getAttractionPrice = (attraction) => {
	if (!attraction.variations || !Array.isArray(attraction.variations) || attraction.variations.length === 0) return 0;
	const prices = attraction.variations.map((variation) => parseInt(variation.price) || 0).filter((price) => price > 0);
	if (prices.length === 0) return 0;
	return Math.min(...prices);
};

const getShowStatus = (attraction) => {
	if (attraction.meta_data?.is_show == 1) {
		return "Yes";
	} else if (attraction.meta_data?.is_show == 0) {
		return "No";
	}
	return "Unknown";
};

const getCategoryName = (categoryId) => {
	const category = attractionCategories.find((c) => c.id == categoryId);
	return category ? category.name : "";
};

const filteredAttractionList = computed(() => {
	if (!attractionShowList.value || !Array.isArray(attractionShowList.value)) return [];

	let filtered = [...attractionShowList.value];

	if (selectedFilter.value) {
		filtered = filtered.filter((attraction) => {
			switch (selectedFilter.value) {
				case "description":
					return !attraction.description || attraction.description === "null" || attraction.description.trim() === "";
				case "images":
					return !attraction.cover_image || attraction.cover_image === "null" || attraction.cover_image.trim() === "";
				case "facilities":
					return !attraction.facilities || !Array.isArray(attraction.facilities) || attraction.facilities.length === 0;
				case "map":
					return !attraction.location || attraction.location === "null" || attraction.location.trim() === "";
				case "rating":
					return !attraction.rating || attraction.rating === "null" || attraction.rating.trim() === "";
				case "nearby_places":
					return (
						!attraction.nearby_places ||
						!Array.isArray(attraction.nearby_places) ||
						attraction.nearby_places.length === 0
					);
				default:
					return true;
			}
		});
	}

	return filtered;
});

const displayedAttractions = computed(() => {
	if (selectedFilter.value) {
		const start = (currentPage.value - 1) * itemsPerPage.value;
		const end = start + itemsPerPage.value;
		return filteredAttractionList.value.slice(start, end);
	} else {
		return entrances.value?.data || [];
	}
});

const totalPages = computed(() => {
	if (selectedFilter.value) {
		return Math.ceil(filteredAttractionList.value.length / itemsPerPage.value);
	}
	return entrances.value?.meta?.last_page || 1;
});

const getAttractionImage = (attraction) => {
	if (attraction.cover_image) {
		return attraction.cover_image;
	}
	if (attraction.images && Array.isArray(attraction.images) && attraction.images.length > 0) {
		return attraction.images[0];
	}
	return "https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png";
};

const toggleExpandedAttraction = (attractionId) => {
	expandedAttraction.value = expandedAttraction.value === attractionId ? null : attractionId;
};

const selectCity = (cityId) => {
	selectedCity.value = cityId;
	currentPage.value = 1;
	fetchAttractions();
};

const selectPriceCategory = (categoryId) => {
	selectedPriceCategory.value = categoryId;
	if (categoryId !== "all") {
		const category = priceCategories.find((c) => c.id === categoryId);
		if (category) {
			customMinPrice.value = category.min;
			customMaxPrice.value = category.max;
		}
	} else {
		customMinPrice.value = 0;
		customMaxPrice.value = 50000;
	}
	currentPage.value = 1;
	fetchAttractions();
};

const onCustomPriceChange = debounce(() => {
	selectedPriceCategory.value = "all";
	currentPage.value = 1;
	fetchAttractions();
}, 500);

const onShowStatusChange = () => {
	currentPage.value = 1;
	fetchAttractions();
};

const selectCategory = (categoryId) => {
	selectedCategory.value = categoryId;
	currentPage.value = 1;
	fetchAttractions();
};

const onSearchInput = debounce(() => {
	currentPage.value = 1;
	fetchAttractions();
}, 500);

const clearAllFilters = () => {
	search.value = "";
	selectedFilter.value = "";

	// const bangkokId = findBangkokId();
	selectedCity.value = "";
	// selectedCity.value = bangkokId || ""; (in case of using Bangkok as default)
	selectedPriceCategory.value = "all";
	selectedCategory.value = "";
	customMinPrice.value = 0;
	customMaxPrice.value = 50000;
	showStatusChecked.value = false;
	currentPage.value = 1;
	fetchAttractions();
};

const fetchAttractions = async () => {
	const params = {
		search: search.value,
		page: currentPage.value,
		limit: selectedFilter.value ? 1000 : 12,
	};

	if (selectedCity.value) {
		params.city_id = selectedCity.value;
	}

	let priceMin = 0;
	let priceMax = 50000;

	if (selectedPriceCategory.value === "all") {
		priceMin = customMinPrice.value || 0;
		priceMax = customMaxPrice.value || 50000;
	} else {
		const category = priceCategories.find((c) => c.id === selectedPriceCategory.value);
		if (category) {
			priceMin = category.min;
			priceMax = category.max;
		}
	}

	if (priceMin > 0 || priceMax < 50000) {
		params.price_range = `${priceMin}-${priceMax}`;
	}

	if (showStatusChecked.value) {
		params.show_only = 1;
	}

	if (selectedCategory.value) {
		params.category_id = selectedCategory.value;
	}

	try {
		await entranceStore.getListAction(params);

		// if (entrances.value && entrances.value.data) {
		//   attractionShowList.value = [...entrances.value.data];
		// }

		if (entrances.value?.meta?.total_count) {
			totalAttractionsCount.value = entrances.value.meta.total_count;
		} else if (entrances.value?.meta?.total) {
			totalAttractionsCount.value = entrances.value.meta.total;
		}
	} catch (error) {
		console.error("Error fetching attractions:", error);
		toast.error("Failed to fetch attractions");
	}
};

const fetchTotalAttractionsCount = async () => {
	try {
		const params = {
			limit: 12,
			page: 1,
		};

		const response = await entranceStore.getListAction(params);

		if (response?.meta?.total_count) {
			totalAttractionsCount.value = response.meta.total_count;
		} else if (response?.meta?.total) {
			totalAttractionsCount.value = response.meta.total;
		}
	} catch (error) {
		console.error("Error fetching total attractions count:", error);
		try {
			const retryResponse = await entranceStore.getListAction({
				limit: 1000,
				page: 1,
			});
			if (retryResponse?.data) {
				totalAttractionsCount.value = retryResponse.data.length;
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
			fetchAttractions();
		}
	}
};

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value -= 1;
		if (!selectedFilter.value) {
			fetchAttractions();
		}
	}
};

const changePage = async (url) => {
	const data = {
		search: search.value,
		limit: 12,
	};

	if (selectedCity.value) {
		data.city_id = selectedCity.value;
	}

	let priceMin = 0;
	let priceMax = 50000;

	if (selectedPriceCategory.value === "all") {
		priceMin = customMinPrice.value || 0;
		priceMax = customMaxPrice.value || 50000;
	} else {
		const category = priceCategories.find((c) => c.id === selectedPriceCategory.value);
		if (category) {
			priceMin = category.min;
			priceMax = category.max;
		}
	}

	if (priceMin > 0 || priceMax < 50000) {
		data.price_range = `${priceMin}-${priceMax}`;
	}

	if (showStatusChecked.value) {
		data.show_only = 1;
	}

	if (selectedCategory.value) {
		data.category_id = selectedCategory.value;
	}

	await entranceStore.getChangePage(url, data);
};

const goEditPage = (id) => {
	router.push(`/entrance/update/${id}`);
};

const goToCreate = () => {
	router.push("/entrance/create");
};

const goVariationPage = (id) => {
	router.push(`/products/7?id=${id}`);
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
				const response = await entranceStore.deleteAction(id);
				toast.success(response.message);

				await fetchTotalAttractionsCount();
			} catch (error) {
				toast.error(error.response?.data?.message || "Failed to delete attraction");
			}
			await fetchAttractions();
		}
	});
};

const exportAction = async () => {
	const res = await entranceStore.downloadExport();
	if (res && res.result && res.result.download_link) {
		window.open(res.result.download_link);
	} else {
		toast.error("Export failed");
	}
};

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
		const res = await entranceStore.importAction(frmData);
		fileImport.value = null;
		toast.success(`Import ${res.message}`);

		await fetchTotalAttractionsCount();
		await fetchAttractions();
	} catch (error) {
		toast.error(error.response?.data?.message || "Import failed");
	}
};

// watch(entrances, (newValue) => {
//   if (newValue && newValue.data) {
//     attractionShowList.value = [...newValue.data];
//   }

//   if (newValue?.meta?.total_count) {
//     totalAttractionsCount.value = newValue.meta.total_count;
//   } else if (newValue?.meta?.total) {
//     totalAttractionsCount.value = newValue.meta.total;
//   }
// });

onMounted(async () => {
	await cityStore.getListHotelCityAction({ limit: 100 });

	// const bangkokId = findBangkokId();
	// if (bangkokId) {
	//   selectedCity.value = bangkokId;
	// } else if (citiesList.value.length > 0) {
	//   selectedCity.value = citiesList.value[0].id;
	// }

	await fetchAttractions();
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