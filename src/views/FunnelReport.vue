<template>
  <Layout class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="w-full mx-auto px-4 py-6">
      <!-- Header with Date Filter -->
      <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h1 class="text-lg font-bold text-gray-900 mb-6">
          📊 Funnel Analytics Report
        </h1>

        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <input
              v-model="startDate"
              type="date"
              class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            />
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-semibold text-gray-700 mb-2">
              End Date
            </label>
            <input
              v-model="endDate"
              type="date"
              class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            />
          </div>

          <button
            @click="loadFunnelData"
            :disabled="funnelStore.loading"
            class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {{ funnelStore.loading ? "Loading..." : "Apply Filter" }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="funnelStore.loading"
        class="bg-white rounded-2xl shadow-sm p-12 text-center"
      >
        <div
          class="inline-block w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-600 font-medium text-sm">Loading funnel data...</p>
      </div>

      <!-- Main Content -->
      <div v-else-if="funnelStore.funnel" class="space-y-6">
        <!-- 3D Funnel Visualization -->
        <div class="bg-white rounded-2xl shadow-sm p-8">
          <h2 class="text-lg font-bold text-gray-900 mb-8 text-center">
            Overall Conversion Funnel
          </h2>

          <div class="flex items-center justify-center py-6">
            <div class="relative w-full max-w-5xl">
              <!-- SVG Funnel -->
              <svg viewBox="0 0 900 550" class="w-full h-auto">
                <defs>
                  <!-- Gradients for each stage -->
                  <linearGradient
                    id="gradient1"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style="stop-color: #ff9f6b; stop-opacity: 1"
                    />
                    <stop
                      offset="100%"
                      style="stop-color: #ff8a50; stop-opacity: 1"
                    />
                  </linearGradient>
                  <linearGradient
                    id="gradient2"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style="stop-color: #5b8acf; stop-opacity: 1"
                    />
                    <stop
                      offset="100%"
                      style="stop-color: #4a6fa5; stop-opacity: 1"
                    />
                  </linearGradient>
                  <linearGradient
                    id="gradient3"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style="stop-color: #5fcac7; stop-opacity: 1"
                    />
                    <stop
                      offset="100%"
                      style="stop-color: #48a9a6; stop-opacity: 1"
                    />
                  </linearGradient>
                  <linearGradient
                    id="gradient4"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style="stop-color: #4a5568; stop-opacity: 1"
                    />
                    <stop
                      offset="100%"
                      style="stop-color: #2d3748; stop-opacity: 1"
                    />
                  </linearGradient>
                  <linearGradient
                    id="gradient5"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style="stop-color: #a0d468; stop-opacity: 1"
                    />
                    <stop
                      offset="100%"
                      style="stop-color: #8bc34a; stop-opacity: 1"
                    />
                  </linearGradient>

                  <!-- Shadow filters -->
                  <filter
                    id="shadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
                    <feOffset dx="0" dy="3" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.2" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <!-- Stage 1: Visits site -->
                <g
                  filter="url(#shadow)"
                  class="funnel-stage"
                  style="cursor: pointer"
                >
                  <path
                    d="M 200,50 L 700,50 L 660,110 L 240,110 Z"
                    fill="url(#gradient1)"
                    class="transition-all duration-300 hover:opacity-90"
                  />
                  <text
                    x="450"
                    y="87"
                    text-anchor="middle"
                    class="fill-white"
                    style="font-size: 18px; font-weight: 600"
                  >
                    {{ funnelStages[0]?.displayPercentage || 100 }}%
                  </text>
                </g>
                <text
                  x="170"
                  y="87"
                  text-anchor="end"
                  class="fill-gray-700"
                  style="font-size: 13px; font-weight: 600"
                >
                  Visits site
                </text>
                <circle
                  cx="780"
                  cy="80"
                  r="30"
                  fill="white"
                  class="shadow-md"
                  style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
                />
                <text
                  x="780"
                  y="88"
                  text-anchor="middle"
                  class="fill-gray-900"
                  style="font-size: 16px; font-weight: 700"
                >
                  {{
                    (
                      funnelStore.funnel.total_counts?.visits || 0
                    ).toLocaleString()
                  }}
                </text>

                <!-- Stage 2: Visits product page -->
                <g
                  filter="url(#shadow)"
                  class="funnel-stage"
                  style="cursor: pointer"
                >
                  <path
                    d="M 250,130 L 650,130 L 620,190 L 280,190 Z"
                    fill="url(#gradient2)"
                    class="transition-all duration-300 hover:opacity-90"
                  />
                  <text
                    x="450"
                    y="167"
                    text-anchor="middle"
                    class="fill-white"
                    style="font-size: 18px; font-weight: 600"
                  >
                    {{ funnelStages[1]?.displayPercentage || 0 }}%
                  </text>
                </g>
                <text
                  x="170"
                  y="167"
                  text-anchor="end"
                  class="fill-gray-700"
                  style="font-size: 13px; font-weight: 600"
                >
                  Visits product page
                </text>
                <circle
                  cx="780"
                  cy="160"
                  r="30"
                  fill="white"
                  class="shadow-md"
                  style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
                />
                <text
                  x="780"
                  y="168"
                  text-anchor="middle"
                  class="fill-gray-900"
                  style="font-size: 16px; font-weight: 700"
                >
                  {{
                    (
                      funnelStore.funnel.total_counts?.view_details || 0
                    ).toLocaleString()
                  }}
                </text>

                <!-- Stage 3: Add to cart -->
                <g
                  filter="url(#shadow)"
                  class="funnel-stage"
                  style="cursor: pointer"
                >
                  <path
                    d="M 300,210 L 600,210 L 580,270 L 320,270 Z"
                    fill="url(#gradient3)"
                    class="transition-all duration-300 hover:opacity-90"
                  />
                  <text
                    x="450"
                    y="247"
                    text-anchor="middle"
                    class="fill-white"
                    style="font-size: 18px; font-weight: 600"
                  >
                    {{ funnelStages[2]?.displayPercentage || 0 }}%
                  </text>
                </g>
                <text
                  x="170"
                  y="247"
                  text-anchor="end"
                  class="fill-gray-700"
                  style="font-size: 13px; font-weight: 600"
                >
                  Add to cart
                </text>
                <circle
                  cx="780"
                  cy="240"
                  r="30"
                  fill="white"
                  class="shadow-md"
                  style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
                />
                <text
                  x="780"
                  y="248"
                  text-anchor="middle"
                  class="fill-gray-900"
                  style="font-size: 16px; font-weight: 700"
                >
                  {{
                    (
                      funnelStore.funnel.total_counts?.add_to_cart || 0
                    ).toLocaleString()
                  }}
                </text>

                <!-- Stage 4: Go to checkout -->
                <g
                  filter="url(#shadow)"
                  class="funnel-stage"
                  style="cursor: pointer"
                >
                  <path
                    d="M 350,290 L 550,290 L 540,350 L 360,350 Z"
                    fill="url(#gradient4)"
                    class="transition-all duration-300 hover:opacity-90"
                  />
                  <text
                    x="450"
                    y="327"
                    text-anchor="middle"
                    class="fill-white"
                    style="font-size: 18px; font-weight: 600"
                  >
                    {{ funnelStages[3]?.displayPercentage || 0 }}%
                  </text>
                </g>
                <text
                  x="170"
                  y="327"
                  text-anchor="end"
                  class="fill-gray-700"
                  style="font-size: 13px; font-weight: 600"
                >
                  Go to checkout
                </text>
                <circle
                  cx="780"
                  cy="320"
                  r="30"
                  fill="white"
                  class="shadow-md"
                  style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
                />
                <text
                  x="780"
                  y="328"
                  text-anchor="middle"
                  class="fill-gray-900"
                  style="font-size: 16px; font-weight: 700"
                >
                  {{
                    (
                      funnelStore.funnel.total_counts?.go_checkout || 0
                    ).toLocaleString()
                  }}
                </text>

                <!-- Stage 5: Complete purchase -->
                <g
                  filter="url(#shadow)"
                  class="funnel-stage"
                  style="cursor: pointer"
                >
                  <path
                    d="M 400,370 L 500,370 L 495,430 L 405,430 Z"
                    fill="url(#gradient5)"
                    class="transition-all duration-300 hover:opacity-90"
                  />
                  <text
                    x="450"
                    y="407"
                    text-anchor="middle"
                    class="fill-white"
                    style="font-size: 18px; font-weight: 600"
                  >
                    {{ funnelStages[4]?.displayPercentage || 0 }}%
                  </text>
                </g>
                <text
                  x="170"
                  y="407"
                  text-anchor="end"
                  class="fill-gray-700"
                  style="font-size: 13px; font-weight: 600"
                >
                  Complete purchase
                </text>
                <circle
                  cx="780"
                  cy="400"
                  r="30"
                  fill="white"
                  class="shadow-md"
                  style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
                />
                <text
                  x="780"
                  y="408"
                  text-anchor="middle"
                  class="fill-gray-900"
                  style="font-size: 16px; font-weight: 700"
                >
                  {{
                    (
                      funnelStore.funnel.total_counts?.complete_purchase || 0
                    ).toLocaleString()
                  }}
                </text>
              </svg>
            </div>
          </div>
        </div>

        <!-- Conversion Rates -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Conversion Rates</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div
              class="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 hover:border-blue-300 transition-all"
            >
              <div class="text-xs font-semibold text-gray-600 mb-2">
                Visit → View
              </div>
              <div class="text-xl font-bold text-blue-600">
                {{ funnelStore.funnel.conversion_rates?.visit_to_view || 0 }}%
              </div>
            </div>
            <div
              class="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-200 hover:border-purple-300 transition-all"
            >
              <div class="text-xs font-semibold text-gray-600 mb-2">
                View → Cart
              </div>
              <div class="text-xl font-bold text-purple-600">
                {{ funnelStore.funnel.conversion_rates?.view_to_cart || 0 }}%
              </div>
            </div>
            <div
              class="bg-gradient-to-br from-teal-50 to-cyan-50 p-5 rounded-xl border border-teal-200 hover:border-teal-300 transition-all"
            >
              <div class="text-xs font-semibold text-gray-600 mb-2">
                Cart → Checkout
              </div>
              <div class="text-xl font-bold text-teal-600">
                {{
                  funnelStore.funnel.conversion_rates?.cart_to_checkout || 0
                }}%
              </div>
            </div>
            <div
              class="bg-gradient-to-br from-orange-50 to-red-50 p-5 rounded-xl border border-orange-200 hover:border-orange-300 transition-all"
            >
              <div class="text-xs font-semibold text-gray-600 mb-2">
                Checkout → Purchase
              </div>
              <div class="text-xl font-bold text-orange-600">
                {{
                  funnelStore.funnel.conversion_rates?.checkout_to_purchase ||
                  0
                }}%
              </div>
            </div>
            <div
              class="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-300 hover:border-green-400 transition-all"
            >
              <div class="text-xs font-semibold text-gray-600 mb-2">
                Overall Conversion
              </div>
              <div class="text-xl font-bold text-green-600">
                {{ funnelStore.funnel.conversion_rates?.overall || 0 }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Product Type Breakdown -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">
            Product Type Performance
          </h2>

          <div class="flex flex-wrap gap-3 mb-6">
            <button
              v-for="type in productTypes"
              :key="type.key"
              @click="selectedProductType = type.key"
              :class="[
                'px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm',
                selectedProductType === type.key
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ type.icon }} {{ type.label }}
            </button>
          </div>

          <!-- Hotels -->
          <div v-if="selectedProductType === 'hotel'" class="space-y-4">
            <div
              class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
            >
              <h3 class="text-base font-bold text-gray-900">
                🏨 Hotel Performance
              </h3>
              <div class="text-right">
                <span class="text-xs text-gray-600 font-semibold block mb-1"
                  >Overall Conversion</span
                >
                <div class="text-xl font-bold text-blue-600">
                  {{ calculateProductConversion("hotel") }}%
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div
                class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Visits
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{ getProductVisits("hotel").toLocaleString() }}
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Views
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.views_by_product_type?.hotel || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-blue-600 mt-1">
                  {{
                    calculateStageRate(
                      getProductVisits("hotel"),
                      funnelStore.funnel.views_by_product_type?.hotel || 0,
                    )
                  }}%
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">Cart</div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.cart_adds_by_product_type?.hotel || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-teal-600 mt-1">
                  {{
                    calculateStageRate(
                      funnelStore.funnel.views_by_product_type?.hotel || 0,
                      funnelStore.funnel.cart_adds_by_product_type?.hotel || 0,
                    )
                  }}%
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Checkout
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.checkouts_by_product_type?.hotel || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-gray-600 mt-1">
                  {{
                    calculateStageRate(
                      funnelStore.funnel.cart_adds_by_product_type?.hotel || 0,
                      funnelStore.funnel.checkouts_by_product_type?.hotel || 0,
                    )
                  }}%
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Purchase
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.purchases_by_product_type?.hotel || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-green-600 mt-1">
                  {{
                    calculateStageRate(
                      funnelStore.funnel.checkouts_by_product_type?.hotel || 0,
                      funnelStore.funnel.purchases_by_product_type?.hotel || 0,
                    )
                  }}%
                </div>
              </div>
            </div>
          </div>

          <!-- Entrance Tickets -->
          <div
            v-if="selectedProductType === 'entrance_ticket'"
            class="space-y-4"
          >
            <div
              class="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
            >
              <h3 class="text-base font-bold text-gray-900">
                🎫 Entrance Ticket Performance
              </h3>
              <div class="text-right">
                <span class="text-xs text-gray-600 font-semibold block mb-1"
                  >Overall Conversion</span
                >
                <div class="text-xl font-bold text-purple-600">
                  {{ calculateProductConversion("entrance_ticket") }}%
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div
                class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Visits
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{ getProductVisits("entrance_ticket").toLocaleString() }}
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Views
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.views_by_product_type
                        ?.entrance_ticket || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-blue-600 mt-1">
                  {{
                    calculateStageRate(
                      getProductVisits("entrance_ticket"),
                      funnelStore.funnel.views_by_product_type
                        ?.entrance_ticket || 0,
                    )
                  }}%
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">Cart</div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.cart_adds_by_product_type
                        ?.entrance_ticket || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-teal-600 mt-1">
                  {{
                    calculateStageRate(
                      funnelStore.funnel.views_by_product_type
                        ?.entrance_ticket || 0,
                      funnelStore.funnel.cart_adds_by_product_type
                        ?.entrance_ticket || 0,
                    )
                  }}%
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Checkout
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.checkouts_by_product_type
                        ?.entrance_ticket || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-gray-600 mt-1">
                  {{
                    calculateStageRate(
                      funnelStore.funnel.cart_adds_by_product_type
                        ?.entrance_ticket || 0,
                      funnelStore.funnel.checkouts_by_product_type
                        ?.entrance_ticket || 0,
                    )
                  }}%
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Purchase
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.purchases_by_product_type
                        ?.entrance_ticket || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-green-600 mt-1">
                  {{
                    calculateStageRate(
                      funnelStore.funnel.checkouts_by_product_type
                        ?.entrance_ticket || 0,
                      funnelStore.funnel.purchases_by_product_type
                        ?.entrance_ticket || 0,
                    )
                  }}%
                </div>
              </div>
            </div>
          </div>

          <!-- Private Van Tours -->
          <div
            v-if="selectedProductType === 'private_van_tour'"
            class="space-y-4"
          >
            <div
              class="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200"
            >
              <h3 class="text-base font-bold text-gray-900">
                🚐 Private Van Tour Performance
              </h3>
              <div class="text-right">
                <span class="text-xs text-gray-600 font-semibold block mb-1"
                  >Overall Conversion</span
                >
                <div class="text-xl font-bold text-teal-600">
                  {{ calculateProductConversion("private_van_tour") }}%
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div
                class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Visits
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{ getProductVisits("private_van_tour").toLocaleString() }}
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Views
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.views_by_product_type
                        ?.private_van_tour || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-blue-600 mt-1">
                  {{
                    calculateStageRate(
                      getProductVisits("private_van_tour"),
                      funnelStore.funnel.views_by_product_type
                        ?.private_van_tour || 0,
                    )
                  }}%
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">Cart</div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.cart_adds_by_product_type
                        ?.private_van_tour || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-teal-600 mt-1">
                  {{
                    calculateStageRate(
                      funnelStore.funnel.views_by_product_type
                        ?.private_van_tour || 0,
                      funnelStore.funnel.cart_adds_by_product_type
                        ?.private_van_tour || 0,
                    )
                  }}%
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Checkout
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.checkouts_by_product_type
                        ?.private_van_tour || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-gray-600 mt-1">
                  {{
                    calculateStageRate(
                      funnelStore.funnel.cart_adds_by_product_type
                        ?.private_van_tour || 0,
                      funnelStore.funnel.checkouts_by_product_type
                        ?.private_van_tour || 0,
                    )
                  }}%
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200"
              >
                <div class="text-xs font-semibold text-gray-600 mb-2">
                  Purchase
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{
                    (
                      funnelStore.funnel.purchases_by_product_type
                        ?.private_van_tour || 0
                    ).toLocaleString()
                  }}
                </div>
                <div class="text-xs font-semibold text-green-600 mt-1">
                  {{
                    calculateStageRate(
                      funnelStore.funnel.checkouts_by_product_type
                        ?.private_van_tour || 0,
                      funnelStore.funnel.purchases_by_product_type
                        ?.private_van_tour || 0,
                    )
                  }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison Table -->
        <div class="bg-white rounded-2xl shadow-sm p-6 overflow-x-auto">
          <h2 class="text-lg font-bold text-gray-900 mb-6">
            Product Type Comparison
          </h2>
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-3 px-4 text-xs font-bold text-gray-700">
                  Product Type
                </th>
                <th
                  class="text-right py-3 px-4 text-xs font-bold text-gray-700"
                >
                  Visits
                </th>
                <th
                  class="text-right py-3 px-4 text-xs font-bold text-gray-700"
                >
                  Views
                </th>
                <th
                  class="text-right py-3 px-4 text-xs font-bold text-gray-700"
                >
                  Cart
                </th>
                <th
                  class="text-right py-3 px-4 text-xs font-bold text-gray-700"
                >
                  Checkout
                </th>
                <th
                  class="text-right py-3 px-4 text-xs font-bold text-gray-700"
                >
                  Purchase
                </th>
                <th
                  class="text-right py-3 px-4 text-xs font-bold text-gray-700"
                >
                  Conversion
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="border-b border-gray-100 hover:bg-blue-50 transition-colors"
              >
                <td class="py-3 px-4 font-semibold text-gray-900 text-sm">
                  🏨 Hotel
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{ getProductVisits("hotel").toLocaleString() }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.views_by_product_type?.hotel || 0
                    ).toLocaleString()
                  }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.cart_adds_by_product_type?.hotel || 0
                    ).toLocaleString()
                  }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.checkouts_by_product_type?.hotel || 0
                    ).toLocaleString()
                  }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.purchases_by_product_type?.hotel || 0
                    ).toLocaleString()
                  }}
                </td>
                <td
                  class="py-3 px-4 text-right font-bold text-blue-600 text-sm"
                >
                  {{ calculateProductConversion("hotel") }}%
                </td>
              </tr>
              <tr
                class="border-b border-gray-100 hover:bg-purple-50 transition-colors"
              >
                <td class="py-3 px-4 font-semibold text-gray-900 text-sm">
                  🎫 Entrance Ticket
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{ getProductVisits("entrance_ticket").toLocaleString() }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.views_by_product_type
                        ?.entrance_ticket || 0
                    ).toLocaleString()
                  }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.cart_adds_by_product_type
                        ?.entrance_ticket || 0
                    ).toLocaleString()
                  }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.checkouts_by_product_type
                        ?.entrance_ticket || 0
                    ).toLocaleString()
                  }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.purchases_by_product_type
                        ?.entrance_ticket || 0
                    ).toLocaleString()
                  }}
                </td>
                <td
                  class="py-3 px-4 text-right font-bold text-purple-600 text-sm"
                >
                  {{ calculateProductConversion("entrance_ticket") }}%
                </td>
              </tr>
              <tr class="hover:bg-teal-50 transition-colors">
                <td class="py-3 px-4 font-semibold text-gray-900 text-sm">
                  🚐 Private Van Tour
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{ getProductVisits("private_van_tour").toLocaleString() }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.views_by_product_type
                        ?.private_van_tour || 0
                    ).toLocaleString()
                  }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.cart_adds_by_product_type
                        ?.private_van_tour || 0
                    ).toLocaleString()
                  }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.checkouts_by_product_type
                        ?.private_van_tour || 0
                    ).toLocaleString()
                  }}
                </td>
                <td class="py-3 px-4 text-right text-gray-800 text-sm">
                  {{
                    (
                      funnelStore.funnel.purchases_by_product_type
                        ?.private_van_tour || 0
                    ).toLocaleString()
                  }}
                </td>
                <td
                  class="py-3 px-4 text-right font-bold text-teal-600 text-sm"
                >
                  {{ calculateProductConversion("private_van_tour") }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-white rounded-2xl shadow-sm p-16 text-center space-y-4"
      >
        <div class="text-6xl">📊</div>
        <h3 class="text-lg font-bold text-gray-900">No Data Available</h3>
        <p class="text-sm text-gray-600">
          Please select a date range and click "Apply Filter" to view funnel
          analytics.
        </p>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useFunnelStore } from "../stores/funnel";
import Layout from "./Layout.vue";

const funnelStore = useFunnelStore();

const startDate = ref("");
const endDate = ref("");
const selectedProductType = ref("hotel");

const productTypes = [
  { key: "hotel", label: "Hotels", icon: "🏨" },
  { key: "entrance_ticket", label: "Entrance Tickets", icon: "🎫" },
  { key: "private_van_tour", label: "Private Van Tours", icon: "🚐" },
];

const funnelStages = computed(() => {
  if (!funnelStore.funnel || !funnelStore.funnel.total_counts) return [];

  const data = funnelStore.funnel.total_counts;
  const maxCount = Math.max(data.visits || 1, 1);

  const calculateActualPercentage = (count) => {
    return maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
  };

  return [
    {
      key: "visits",
      label: "Visits Site",
      count: data.visits || 0,
      displayPercentage: 100,
    },
    {
      key: "views",
      label: "Visits Product Page",
      count: data.view_details || 0,
      displayPercentage: calculateActualPercentage(data.view_details || 0),
    },
    {
      key: "cart",
      label: "Add to Cart",
      count: data.add_to_cart || 0,
      displayPercentage: calculateActualPercentage(data.add_to_cart || 0),
    },
    {
      key: "checkout",
      label: "Go to Checkout",
      count: data.go_checkout || 0,
      displayPercentage: calculateActualPercentage(data.go_checkout || 0),
    },
    {
      key: "purchase",
      label: "Complete Purchase",
      count: data.complete_purchase || 0,
      displayPercentage: calculateActualPercentage(data.complete_purchase || 0),
    },
  ];
});

const getProductVisits = (productType) => {
  if (!funnelStore.funnel) return 0;
  const visitsFromArray =
    funnelStore.funnel.visits_by_product_type?.[productType];
  if (visitsFromArray !== undefined) return visitsFromArray;
  const visitsFromCounts =
    funnelStore.funnel.total_counts?.[`${productType}_visits`];
  if (visitsFromCounts !== undefined) return visitsFromCounts;
  return funnelStore.funnel.views_by_product_type?.[productType] || 0;
};

const calculateProductConversion = (productType) => {
  if (!funnelStore.funnel) return "0.00";
  const visits = getProductVisits(productType);
  const purchases =
    funnelStore.funnel.purchases_by_product_type?.[productType] || 0;
  return visits > 0 ? ((purchases / visits) * 100).toFixed(2) : "0.00";
};

const calculateStageRate = (from, to) => {
  const fromCount = from || 0;
  const toCount = to || 0;
  return fromCount > 0 ? ((toCount / fromCount) * 100).toFixed(1) : "0.0";
};

const loadFunnelData = async () => {
  if (!startDate.value || !endDate.value) {
    alert("Please select both start and end dates");
    return;
  }

  try {
    await funnelStore.getFunnelReport({
      start_date: startDate.value,
      end_date: endDate.value,
    });
  } catch (error) {
    console.error("Error loading funnel data:", error);
    alert("Failed to load funnel data. Please try again.");
  }
};

const setDefaultDates = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  endDate.value = today.toISOString().split("T")[0];
  startDate.value = thirtyDaysAgo.toISOString().split("T")[0];
};

onMounted(() => {
  setDefaultDates();
});
</script>

<style scoped>
.funnel-stage:hover path {
  filter: brightness(1.1);
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  svg text {
    font-size: 11px !important;
  }
}
</style>
