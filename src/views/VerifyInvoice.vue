<template>
  <Layout :is_white="true">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-xl font-medium text-[#FF613c]">
        Invoice Verify Checker
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
        <span class="pl-2" v-if="detailVal?.crm_id">{{
          detailVal.crm_id
        }}</span>
      </p>
      <div class="flex items-center gap-4">
        <YearPickerVue @year-change="handleYearChange" />
        <select
          v-model="selectedMonth"
          @change="handleMonthChange(selectedMonth)"
          class="px-3 text-black text-xs py-2 rounded-lg border border-gray-400/20 focus:outline-none"
        >
          <option :value="m.id" v-for="m in monthArray" :key="m.id">
            {{ m.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="relative z-40">
      <VerifyList />
    </div>
    <div class="grid gap-4 relative grid-cols-3">
      <transition name="slide">
        <div
          class="border shadow-sm rounded-lg p-4"
          :class="{
            hidden: showSide == 2,
            'col-span-1': showSide == 1,
            'col-span-2': showSide == 3,
          }"
        >
          <div class="pb-4 flex justify-start items-center gap-x-3 relative">
            <div
              @click="
                () => {
                  filterShow = !filterShow;
                  softShow = false;
                }
              "
              class="bg-blue-600 px-2 rounded-lg shadow py-1 flex justify-center items-center gap-x-2 text-white text-xs cursor-pointer"
            >
              <FunnelIcon class="w-5 h-5 text-white" />
              <p>Filter</p>
              <p>{{ searchCount }}</p>
            </div>
            <transition name="slide">
              <div
                v-if="filterShow"
                class="absolute top-full px-4 left-0 w-[300px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[50vh] overflow-y-scroll"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Filter</p>
                  <p class="text-[10px] cursor-pointer" @click="clearFilter">
                    clear
                  </p>
                </div>

                <p class="text-[10px]">User</p>
                <select
                  name=""
                  id=""
                  v-model="searchKey.user_id"
                  class="px-2 py-1 focus:outline-none border border-gray-300 placeholder-sm bg-white rounded-lg w-full text-[10px] text-gray-400 space-y-2 h-9"
                >
                  <option :value="null" disabled class="bg-gray-200 text-sm">
                    Filter By User
                  </option>
                  <option value="" class="text-[12px]">All User</option>
                  <option
                    :value="key.id"
                    v-for="(key, index) in adminLists"
                    :key="index"
                    class="text-[12px]"
                  >
                    {{ key.name }}
                  </option>
                </select>

                <div class="relative w-full">
                  <p class="text-[10px] pb-2">Customer Name</p>
                  <input
                    type="search"
                    name=""
                    v-model="searchKey.customer_name"
                    placeholder="Search Customer name"
                    class="text-[10px] text-gray-500 focus:outline-none hover:text-gray-600 border border-gray-300 rounded-lg bg-white px-4 py-2 w-full"
                    id=""
                  />
                </div>

                <div>
                  <p class="text-[10px] pb-2">Verify Status</p>
                  <select
                    v-model="searchKey.verify_status"
                    name=""
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-[10px] rounded-lg"
                  >
                    <option class="text-[10px]" value="">All Status</option>
                    <option class="text-[10px]" value="verified">
                      Verified
                    </option>
                    <option class="text-[10px]" value="unverified">
                      Unverified
                    </option>
                    <option class="text-[10px]" value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <p class="text-[10px] pb-2">Payment Status</p>
                  <select
                    name=""
                    v-model="searchKey.payment_status"
                    id=""
                    class="border border-gray-300 px-4 focus:outline-none w-full py-2 text-[10px] rounded-lg"
                  >
                    <option class="text-[10px]" value="">All Status</option>
                    <option class="text-[10px]" value="fully_paid">
                      Fully paid
                    </option>
                    <option class="text-[10px]" value="partially_paid">
                      Partially paid
                    </option>
                    <option class="text-[10px]" value="not_paid">
                      Not paid
                    </option>
                  </select>
                </div>

                <div
                  class="sticky bottom-0 w-full pb-4 pt-2 border-t border-gray-200 bg-white"
                >
                  <p
                    class="text-[12px] bg-[#FF613c] px-2 py-2 rounded-lg text-center text-white cursor-pointer"
                    @click="searchAction"
                  >
                    Search
                  </p>
                </div>
              </div>
            </transition>
            <div
              class="bg-white shadow rounded-full border border-gray-100 p-2"
              @click="
                () => {
                  softShow = !softShow;
                  filterShow = false;
                }
              "
            >
              <ArrowsUpDownIcon class="w-3 h-3" />
            </div>
            <transition name="slide">
              <div
                v-if="softShow"
                class="absolute top-full pb-3 px-4 left-0 w-[250px] transition-all duration-150 bg-white rounded-lg shadow-lg z-50 border border-gray-100 space-y-2 max-h-[65vh] overflow-y-scroll"
              >
                <div
                  class="flex justify-between items-center pt-4 border-b border-gray-100 pb-1 sticky top-0 bg-white"
                >
                  <p class="text-xs font-medium">Sort</p>
                  <p
                    class="text-[10px] cursor-pointer"
                    @click="
                      () => {
                        softShow = !softShow;
                        filterShow = false;
                      }
                    "
                  >
                    close
                  </p>
                </div>
                <div class="space-y-1">
                  <div class="flex justify-between items-center">
                    <p class="text-[10px]">Sort By</p>
                    <select
                      name=""
                      id=""
                      v-model="sorting"
                      class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-[50%] py-2 text-[10px] rounded-lg"
                    >
                      <option class="text-[10px]" value="desc">
                        Last to First
                      </option>
                      <option class="text-[10px]" value="asc">
                        First to Last
                      </option>
                    </select>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-[10px]">Order By</p>
                    <select
                      name=""
                      id=""
                      v-model="orderBy"
                      class="border border-gray-300 px-4 focus:outline-none bg-gray-50 text-gray-400 w-[50%] py-2 text-[10px] rounded-lg"
                    >
                      <option class="text-[10px]" value="booking_date">
                        Booking Date
                      </option>
                      <option class="text-[10px]" value="customer_name">
                        Customer Name
                      </option>
                      <option class="text-[10px]" value="total_amount">
                        Total Amount
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  @click="
                    () => {
                      searchAction();
                      softShow = !softShow;
                      filterShow = false;
                    }
                  "
                  class="bg-[#FF613c] text-white px-1.5 cursor-pointer inline-block rounded-lg text-sm w-full py-1.5 text-center"
                >
                  sort
                </div>
              </div>
            </transition>
            <div class="relative w-full">
              <input
                type="search"
                name=""
                v-model="searchKey.crm_id"
                placeholder="Search by CRM ID"
                class="w-full px-4 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                id=""
              />
              <div
                @click="searchAction"
                class="absolute right-1 top-1 rounded-lg text-xs p-1 bg-[#FF613c]"
              >
                <MagnifyingGlassIcon class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <!-- Active Filters Display -->
          <div
            class="flex justify-start items-center overflow-x-scroll no-sidebar-container pt-0.5 space-x-3 pb-2"
          >
            <p
              @click="clearFilter"
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap bg-red-500 text-white cursor-pointer"
            >
              clear
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.customer_name != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.customer_name = '';
                    searchAction();
                  }
                "
              />
              {{ searchKey.customer_name }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.crm_id != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.crm_id = '';
                    searchAction();
                  }
                "
              />
              {{ searchKey.crm_id }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.verify_status != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.verify_status = '';
                    searchAction();
                  }
                "
              />
              V: {{ searchKey.verify_status }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.payment_status != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.payment_status = '';
                    searchAction();
                  }
                "
              />
              P: {{ searchKey.payment_status }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.expense_status != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.expense_status = '';
                    searchAction();
                  }
                "
              />
              E: {{ searchKey.expense_status }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.invoice_status != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.invoice_status = '';
                    searchAction();
                  }
                "
              />
              I: {{ searchKey.invoice_status }}
            </p>
            <p
              class="text-[12px] shadow px-2 py-0.5 rounded-lg whitespace-nowrap relative"
              v-if="searchKey.booking_daterange != ''"
            >
              <XCircleIcon
                class="w-4 h-4 text-[#FF613c] cursor-pointer absolute -top-1 -right-2"
                @click="
                  () => {
                    searchKey.booking_daterange = '';
                    dateRange = '';
                    searchAction();
                  }
                "
              />
              {{ showFormat(searchKey.booking_daterange) }}
            </p>
          </div>

          <!-- Stats -->
          <div class="flex justify-end items-center space-x-2">
            <div
              class="text-[10px] rounded-lg px-2 py-1 text-white bg-green-600"
              v-if="bookings?.meta?.verified_count"
            >
              {{ bookings.meta.verified_count }} verified
            </div>
            <div
              class="text-[10px] rounded-lg px-2 py-1 text-white bg-red-600"
              v-if="bookings?.meta?.unverified_count"
            >
              {{ bookings.meta.unverified_count }} unverified
            </div>
            <div
              class="text-[10px] rounded-lg px-2 py-1 text-white bg-[#FF613c]"
            >
              {{ bookings?.meta?.total || 0 }} invoices
            </div>
          </div>

          <!-- Booking List -->
          <div
            v-if="!loading"
            class="bg-white mt-2 shadow rounded-lg divide-y divide-gray-100 max-h-[55vh] overflow-y-scroll relative"
          >
            <div
              class="cursor-pointer hover:bg-gray-50 p-3 transition-colors"
              v-for="booking in bookings?.data ?? []"
              :key="booking.id"
              @click="getDetailAction(booking.id)"
              :class="
                selectedItem == booking.id
                  ? 'bg-[#FF613c]/10  border-l-4 border-[#FF613c]'
                  : ''
              "
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <p class="text-sm font-medium text-gray-900">
                      {{ booking.crm_id }}
                    </p>
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :class="getStatusClass(booking.verify_status)"
                    >
                      {{ booking.verify_status || "Pending" }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 mb-1">
                    {{ booking.customer_name }}
                  </p>
                  <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span>{{ formatDate(booking.booking_date) }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium">
                    {{ formatCurrency(booking.total_amount) }}
                  </p>
                  <p class="text-xs text-gray-500">{{ booking.currency }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="overflow-x-scroll no-sidebar-container py-2">
            <Pagination
              v-if="!loading"
              :data="bookings"
              @change-page="changePage"
            />
          </div>

          <!-- Loading State -->
          <div
            v-if="loading"
            class="bg-white shadow rounded-lg divide-y-4 divide-gray-200 max-h-[75vh] overflow-y-scroll"
          >
            <div class="animate-pulse p-4" v-for="i in 10" :key="i">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Right Side - Detail View -->
      <transition name="slide">
        <div
          @click="
            () => {
              filterShow = false;
              softShow = false;
            }
          "
          class="relative"
          :class="{
            'col-span-2': showSide == 1,
            'col-span-1': showSide == 3,
            'col-span-3': showSide == 2,
          }"
        >
          <div class="absolute -top-4 -left-0 z-20">
            <ChevronLeftIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 2"
              v-if="showSide == 1"
            />
            <ChevronRightIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 1"
              v-if="showSide == 2"
            />
          </div>
          <div class="absolute -top-4 -left-10 z-20">
            <ChevronRightIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 3"
              v-if="showSide == 1"
            />
            <ChevronLeftIcon
              class="w-6 cursor-pointer h-6 bg-white shadow-md border border-gray-200 p-1.5 rounded-full"
              @click="showSide = 1"
              v-if="showSide == 3"
            />
          </div>

          <div
            class="border shadow-sm relative rounded-lg p-4 h-[80vh] transition duration-150 overflow-y-scroll no-scrollbar"
          >
            <!-- Detail Content -->
            <div v-if="!loadingDetail && detailVal">
              <!-- Sales/Expense Toggle -->
              <div class="flex justify-start items-center gap-x-2 py-4">
                <p
                  @click="show = true"
                  :class="show ? 'bg-[#FF613c] text-white' : ''"
                  class="border border-gray-200 rounded-lg text-xs cursor-pointer px-4 py-2 w-[200px] text-center"
                >
                  Sales
                </p>
                <p
                  @click="
                    () => {
                      show = false;
                      detailValItem = detailVal?.items[0];
                    }
                  "
                  :class="!show ? 'bg-[#FF613c] text-white' : ''"
                  class="border border-gray-200 rounded-lg text-xs cursor-pointer px-4 py-2 w-[200px] text-center"
                >
                  Expense
                </p>
              </div>

              <!-- Item Tabs for Expense -->
              <div class="grid grid-cols-3 col-span-2 gap-x-4">
                <div
                  v-if="!show"
                  class="flex justify-start items-center border-y border-gray-200 py-2 pr-4 mr-4 overflow-x-scroll no-sidebar-container"
                >
                  <div
                    v-for="i in detailVal?.items ?? []"
                    :key="i"
                    class="rounded-lg px-2 py-1 mx-1 cursor-pointer"
                    @click="
                      () => {
                        detailValItem = i;
                        haveCrmId = i.crm_id;
                      }
                    "
                    :class="
                      detailValItem?.id == i?.id
                        ? 'bg-[#FF613c] text-white'
                        : ''
                    "
                  >
                    <p class="whitespace-nowrap text-xs">
                      -{{ i.crm_id.split("_")[1] }}
                    </p>
                  </div>
                </div>

                <!-- Print Invoice Button for Sales -->
                <div v-if="show">
                  <div
                    @click="openPrintModal = true"
                    class="bg-[#FF613c] text-white rounded-lg text-xs text-center cursor-pointer px-4 py-2 flex justify-center items-center gap-x-4"
                  >
                    <DocumentIcon class="w-4 h-4 text-white" />
                    <p>See Invoice</p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-between items-center col-span-2">
                  <p class="text-lg font-medium">
                    {{ show ? "Sales" : "Expense" }}
                  </p>
                  <div class="flex justify-between items-center">
                    <div class="flex justify-start items-center gap-x-2">
                      <p
                        class="px-4 py-2 text-xs bg-gray-300 text-white rounded-lg"
                      >
                        Raise Sale Issue
                      </p>
                      <p
                        class="px-6 py-2 text-xs bg-red-500 text-white cursor-pointer rounded-lg"
                        @click="verifyBooking(detailVal.id, 'unverified')"
                      >
                        Not Verified
                      </p>
                      <p
                        class="px-6 py-2 text-xs bg-green-500 text-white cursor-pointer rounded-lg"
                        @click="verifyBooking(detailVal.id, 'verified')"
                      >
                        Verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Image and Verification Content -->
              <div class="grid grid-cols-3 pt-5 gap-x-4">
                <!-- <div class="col-span-1 grid grid-cols-3 gap-2" v-if="!show">
                  <div class="space-y-2 rounded-lg overflow-y-auto h-[400px]">
                    <div
                      class="relative cursor-pointer"
                      v-for="i in detailValItem?.receipt_images ?? []"
                      :key="i"
                      @click="imageItemData = i"
                    >
                      <img
                        :src="i?.file"
                        alt=""
                        class="w-full h-auto rounded-lg"
                        :class="
                          imageItemData?.id == i?.id
                            ? checkDataFailOrSuccess(imageItemData)
                              ? 'border-2 border-green-500'
                              : 'border-2 border-red-500'
                            : ''
                        "
                      />
                      <div
                        class="absolute top-1 right-1 w-4 h-4 rounded-full"
                        :class="
                          imageItemData?.id == i?.id
                            ? checkDataFailOrSuccess(imageItemData)
                              ? 'bg-green-500'
                              : 'bg-red-500'
                            : ''
                        "
                      >
                        <XMarkIcon
                          class="w-4 h-4 text-white"
                          v-if="
                            imageItemData?.id == i?.id &&
                            !checkDataFailOrSuccess(imageItemData)
                          "
                        />
                        <CheckIcon
                          class="w-4 h-4 text-white"
                          v-if="
                            imageItemData?.id == i?.id &&
                            checkDataFailOrSuccess(imageItemData)
                          "
                        />
                      </div>
                    </div>
                  </div>
                  <div class="relative col-span-2 w-full h-full">
                    <div class="absolute top-1 right-1">
                      <p
                        @click="openModal(imageItemData)"
                        class="text-[10px] shadow-lg cursor-pointer text-white bg-[#FF613c] px-2 py-1 rounded-lg"
                      >
                        Fill data
                      </p>
                    </div>
                    <img
                      class="col-span-2 w-full h-auto overflow-hidden rounded-lg"
                      :src="imageItemData?.file"
                      alt=""
                    />
                  </div>
                </div> -->
                <div class="col-span-1">
                  <template
                    v-if="
                      imageData?.is_internal_transfer ||
                      detailVal?.receipts[0]?.is_internal_transfer
                    "
                  >
                    <!-- Internal Transfer View -->
                    <div class="col-span-1 space-y-3">
                      <div
                        class="bg-purple-50 rounded-lg p-3 border border-purple-200"
                      >
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-xs font-semibold text-purple-700"
                            >Internal Transfer</span
                          >
                          <span class="text-xs text-gray-600"
                            >Rate:
                            {{
                              imageData?.exchange_rate ||
                              detailVal?.receipts[0]?.exchange_rate
                            }}</span
                          >
                        </div>

                        <!-- FROM Section -->
                        <div class="mb-3">
                          <p class="text-xs font-medium text-red-700 mb-2">
                            FROM (Source)
                          </p>
                          <div class="space-y-2">
                            <div
                              v-for="fromFile in imageData?.from_files ||
                              detailVal?.receipts[0]?.from_files ||
                              []"
                              :key="fromFile.id"
                              class="bg-white rounded-lg border border-red-200 p-2"
                            >
                              <div
                                class="relative cursor-pointer"
                                @click="
                                  imageData = {
                                    ...detailVal?.receipts[0],
                                    selectedImage: fromFile,
                                  }
                                "
                              >
                                <img
                                  :src="fromFile.image"
                                  alt="From receipt"
                                  class="w-full h-24 object-cover rounded"
                                  :class="
                                    imageData?.selectedImage?.id === fromFile.id
                                      ? 'ring-2 ring-red-500'
                                      : ''
                                  "
                                />
                                <div
                                  class="absolute top-1 right-1 w-4 h-4 rounded-full"
                                  :class="
                                    checkDataFailOrSuccess(fromFile)
                                      ? 'bg-green-500'
                                      : 'bg-red-500'
                                  "
                                >
                                  <CheckIcon
                                    v-if="checkDataFailOrSuccess(fromFile)"
                                    class="w-4 h-4 text-white"
                                  />
                                  <XMarkIcon
                                    v-else
                                    class="w-4 h-4 text-white"
                                  />
                                </div>
                              </div>
                              <div class="mt-1 text-xs space-y-0.5">
                                <p class="font-semibold text-red-600">
                                  {{ fromFile.currency }}
                                  {{ formatCurrency(fromFile.amount) }}
                                </p>
                                <p class="text-gray-600 truncate">
                                  {{ fromFile.sender }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- TO Section -->
                        <div>
                          <p class="text-xs font-medium text-green-700 mb-2">
                            TO (Destination)
                          </p>
                          <div class="space-y-2">
                            <div
                              v-for="toFile in imageData?.to_files ||
                              detailVal?.receipts[0]?.to_files ||
                              []"
                              :key="toFile.id"
                              class="bg-white rounded-lg border border-green-200 p-2"
                            >
                              <div
                                class="relative cursor-pointer"
                                @click="
                                  imageData = {
                                    ...detailVal?.receipts[0],
                                    selectedImage: toFile,
                                  }
                                "
                              >
                                <img
                                  :src="toFile.image"
                                  alt="To receipt"
                                  class="w-full h-24 object-cover rounded"
                                  :class="
                                    imageData?.selectedImage?.id === toFile.id
                                      ? 'ring-2 ring-green-500'
                                      : ''
                                  "
                                />
                                <div
                                  class="absolute top-1 right-1 w-4 h-4 rounded-full"
                                  :class="
                                    checkDataFailOrSuccess(toFile)
                                      ? 'bg-green-500'
                                      : 'bg-red-500'
                                  "
                                >
                                  <CheckIcon
                                    v-if="checkDataFailOrSuccess(toFile)"
                                    class="w-4 h-4 text-white"
                                  />
                                  <XMarkIcon
                                    v-else
                                    class="w-4 h-4 text-white"
                                  />
                                </div>
                              </div>
                              <div class="mt-1 text-xs space-y-0.5">
                                <p class="font-semibold text-green-600">
                                  {{ toFile.currency }}
                                  {{ formatCurrency(toFile.amount) }}
                                </p>
                                <p class="text-gray-600 truncate">
                                  {{ toFile.receiver }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Notes -->
                        <div
                          v-if="
                            imageData?.notes || detailVal?.receipts[0]?.notes
                          "
                          class="mt-3 pt-2 border-t border-purple-200"
                        >
                          <p class="text-xs text-gray-600">
                            <span class="font-medium">Note:</span>
                            {{
                              imageData?.notes || detailVal?.receipts[0]?.notes
                            }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Regular Receipts View (Not Internal Transfer) -->
                  <template v-else>
                    <div class="space-y-2 rounded-lg overflow-y-auto h-[400px]">
                      <div
                        class="relative cursor-pointer"
                        v-for="i in detailVal?.receipts"
                        :key="i"
                        @click="imageData = i"
                      >
                        <img
                          :src="i?.image"
                          alt=""
                          class="w-full h-auto rounded-lg"
                          :class="
                            imageData?.id == i?.id
                              ? checkDataFailOrSuccess(imageData)
                                ? 'border-2 border-green-500'
                                : 'border-2 border-red-500'
                              : ''
                          "
                        />
                        <div
                          class="absolute top-1 right-1 w-4 h-4 rounded-full"
                          :class="
                            imageData?.id == i?.id
                              ? checkDataFailOrSuccess(imageData)
                                ? 'bg-green-500'
                                : 'bg-red-500'
                              : ''
                          "
                        >
                          <XMarkIcon
                            class="w-4 h-4 text-white"
                            v-if="
                              imageData?.id == i?.id &&
                              !checkDataFailOrSuccess(imageData)
                            "
                          />
                          <CheckIcon
                            class="w-4 h-4 text-white"
                            v-if="
                              imageData?.id == i?.id &&
                              checkDataFailOrSuccess(imageData)
                            "
                          />
                        </div>
                      </div>
                    </div>
                    <div class="relative col-span-1 w-full h-full">
                      <div class="absolute top-1 right-1">
                        <p
                          @click="openModal(imageData)"
                          class="text-[10px] shadow-lg cursor-pointer text-white bg-[#FF613c] px-2 py-1 rounded-lg"
                        >
                          Fill data
                        </p>
                      </div>
                      <img
                        class="col-span-2 w-full h-auto overflow-hidden rounded-lg"
                        :src="
                          !imageData
                            ? detailVal?.receipts[0]?.image
                            : imageData?.image
                        "
                        alt=""
                      />
                    </div>
                  </template>

                  <!-- Large Image Preview for Internal Transfer -->
                  <div
                    v-if="
                      imageData?.is_internal_transfer ||
                      detailVal?.receipts[0]?.is_internal_transfer
                    "
                    class="col-span-1 w-full h-full"
                  >
                    <div class="relative">
                      <div class="absolute top-1 right-1 z-10">
                        <p
                          @click="
                            openModal(
                              imageData?.selectedImage ||
                                imageData?.from_files?.[0] ||
                                imageData?.to_files?.[0]
                            )
                          "
                          class="text-[10px] shadow-lg cursor-pointer text-white bg-[#FF613c] px-2 py-1 rounded-lg"
                        >
                          Fill data
                        </p>
                      </div>
                      <img
                        class="w-full h-auto overflow-hidden rounded-lg"
                        :src="
                          imageData?.selectedImage?.image ||
                          imageData?.from_files?.[0]?.image ||
                          detailVal?.receipts[0]?.from_files?.[0]?.image ||
                          imageData?.to_files?.[0]?.image ||
                          detailVal?.receipts[0]?.to_files?.[0]?.image
                        "
                        alt="Receipt preview"
                      />
                      <!-- Image Details -->
                      <div
                        class="mt-2 p-3 bg-gray-50 rounded-lg text-xs space-y-1"
                      >
                        <p v-if="imageData?.selectedImage">
                          <span class="font-medium">Amount:</span>
                          <span class="text-blue-600"
                            >{{ imageData.selectedImage.currency }}
                            {{
                              formatCurrency(imageData.selectedImage.amount)
                            }}</span
                          >
                        </p>
                        <p v-if="imageData?.selectedImage">
                          <span class="font-medium">From:</span>
                          {{ imageData.selectedImage.sender || "-" }}
                        </p>
                        <p v-if="imageData?.selectedImage">
                          <span class="font-medium">To:</span>
                          {{ imageData.selectedImage.receiver || "-" }}
                        </p>
                        <p v-if="imageData?.selectedImage">
                          <span class="font-medium">Bank:</span>
                          {{ imageData.selectedImage.interact_bank || "-" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-span-2">
                  <div
                    class="p-3 rounded-lg border border-gray-200"
                    v-if="!show"
                  >
                    <VerifyExpense :data="detailVal" />
                  </div>
                  <div
                    class="p-3 rounded-lg border border-gray-200"
                    v-if="show"
                  >
                    <VerifySale :data="detailVal" />
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-center items-center h-[400px] pt-5 gap-x-4"
              v-if="loadingDetail && !selectedItem"
            >
              <p class="text-xs">
                Please select one invoice from the left panel.
              </p>
            </div>
            <div
              class="flex justify-center items-center h-[400px] pt-5 gap-x-4"
              v-if="loadingDetail && selectedItem"
            >
              <p class="text-xs">Loading detail, please wait...</p>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Print Invoice Modal -->
    <Modal :isOpen="openPrintModal" @closeModal="openPrintModal = false">
      <DialogPanel
        class="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-lg font-medium leading-6 text-gray-900 mb-5 flex justify-between items-center"
        >
          <span class="pl-4">Print Invoice as PNG</span>
          <XMarkIcon
            class="w-6 h-6 text-black cursor-pointer"
            @click="openPrintModal = false"
          />
        </DialogTitle>
        <div>
          <PngUsage :invoice_id="selectedItem" />
        </div>
      </DialogPanel>
    </Modal>

    <!-- Payment Slip Audit Modal -->
    <Modal :isOpen="carModalOpen" @closeModal="clearAction">
      <DialogPanel
        class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white/80 backdrop-blur-md text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Payment Slip Audit</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="clearAction" />
        </DialogTitle>
        <div class="p-4">
          <div class="grid grid-cols-2 gap-8">
            <div>
              <img
                :src="formData?.file"
                class="rounded-lg shadow hover:shadow-none min-h-[400px] w-full"
                alt=""
              />
            </div>
            <div class="space-y-4 relative pt-4 pb-14 pr-2">
              <div class="">
                <p for="" class="text-[12px] font-medium pb-2">
                  Date <span class="opacity-0">......</span>
                </p>
                <div
                  class="flex justify-between items-center w-full bg-white pl-2 rounded-lg"
                >
                  <p class="text-start text-xs" v-if="formData?.date">
                    {{
                      formData.date.includes("T")
                        ? formatDate(formData.date)
                        : formatDateFromDb(formData.date)
                    }}
                  </p>
                  <input
                    type="datetime-local"
                    name=""
                    v-model="formData.date"
                    format="YYYY-MM-DD HH:mm:ss"
                    class="w-[35px] px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
              </div>

              <div class="">
                <p for="" class="text-[12px] font-medium pb-2">Sender</p>
                <input
                  type="text"
                  v-model="formData.sender"
                  :class="formData.sender.includes('-') ? 'text-gray-400' : ''"
                  name=""
                  placeholder="xxx"
                  class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="">
                <p for="" class="text-[12px] font-medium pb-2">Receiver</p>
                <input
                  type="text"
                  v-model="formData.reciever"
                  :class="
                    formData.reciever.includes('-') ? 'text-gray-400' : ''
                  "
                  name=""
                  placeholder="xxx"
                  class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="">
                <p for="" class="text-[12px] font-medium pb-2">Amount</p>
                <input
                  type="number"
                  v-model="formData.amount"
                  name=""
                  placeholder="xxx"
                  class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                  id=""
                />
              </div>
              <div class="">
                <p for="" class="text-[12px] font-medium pb-2">
                  Interact Bank <span class="opacity-0">.....</span>
                </p>
                <select
                  name=""
                  v-model="formData.interact_bank"
                  id=""
                  class="w-full px-2 py-2 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                >
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                  <option value="cash_at_office">Cash at Office</option>
                  <option value="to_money_changer">To Money Changer</option>
                  <option value="deposit_management">Deposit Management</option>
                  <option value="pay_to_driver">Pay to Driver</option>
                </select>
              </div>
              <div class="flex justify-between items-center">
                <label for="" class="text-[12px] font-medium">Currency </label>
                <select
                  name=""
                  v-model="formData.currency"
                  id=""
                  class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                >
                  <option value="MMK">MMK</option>
                  <option value="THB">THB</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div
                class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
              >
                <p
                  @click.prevent="submit"
                  class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
                >
                  save
                </p>
                <p
                  @click="clearAction"
                  class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
                >
                  close
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { computed, onMounted, ref, watch } from "vue";
import Pagination from "../components/PaginationExpense.vue";
import {
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  DocumentIcon,
} from "@heroicons/vue/24/outline";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useSidebarStore } from "../stores/sidebar";
import { useBookingStore } from "../stores/booking";
import { useCashImageStore } from "../stores/cashImage";
import { useAdminStore } from "../stores/admin";
import VueDatePicker from "@vuepic/vue-datepicker";
import { format } from "date-fns";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import VerifyExpense from "./VerifyInvoiceComponent/VerifyExpense.vue";
import VerifySale from "./VerifyInvoiceComponent/VerifySale.vue";
import PngUsage from "./PngGenerate/PngUsage.vue";
import VerifyList from "./CashImageCreate/VerifyList.vue";

// Store instances
const showSide = ref(1);
const filterShow = ref(false);
const softShow = ref(false);
const router = useRouter();
const route = useRoute();
const sidebarStore = useSidebarStore();
const { isShowSidebar } = storeToRefs(sidebarStore);
const bookingStore = useBookingStore();
const { bookings, loading } = storeToRefs(bookingStore);
const cashImageStore = useCashImageStore();
const adminStore = useAdminStore();
const toast = useToast();

// Date and time management
const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);
const searchModel = ref(false);
const dateRange = ref("");

// Search and filter
const searchKey = ref({
  crm_id: "",
  customer_name: "",
  user_id: "",
  verify_status: "",
  payment_status: "",
  expense_status: "",
  invoice_status: "",
  booking_daterange: "",
});

// Sorting
const sorting = ref("desc");
const orderBy = ref("booking_date");

// Detail management
const selectedItem = ref("");
const detailVal = ref(null);
const detailValItem = ref(null);
const loadingDetail = ref(false);
const show = ref(true);
const haveCrmId = ref("");

// Image management
const imageData = ref(null);
const imageItemData = ref(null);

// Modal management
const openPrintModal = ref(false);
const carModalOpen = ref(false);

// Form data for payment slip audit
const formData = ref({
  id: "",
  file: null,
  amount: 0,
  date: "",
  bank_name: "",
  sender: "",
  reciever: "",
  interact_bank: "",
  currency: "THB",
  is_corporate: false,
  comment: "",
});

// Admin lists
const adminLists = ref([]);

// Month array
const monthArray = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

// Computed properties
const searchCount = computed(() => {
  let count = 0;
  Object.values(searchKey.value).forEach((val) => {
    if (val && val !== "") count++;
  });
  return count;
});

const watchSystem = computed(() => {
  let result = {};

  Object.keys(searchKey.value).forEach((key) => {
    if (searchKey.value[key] && searchKey.value[key] !== "") {
      result[key] = searchKey.value[key];
    }
  });

  if (sorting.value) {
    result.order_direction = sorting.value;
  }
  if (orderBy.value) {
    result.order_by = orderBy.value;
  }

  // Date range for current month/year
  if (year.value && selectedMonth.value) {
    const dateRange = generateDateRangeForMonth(
      selectedMonth.value,
      year.value
    );
    result.booking_date_from = dateRange.split(",")[0];
    result.booking_date_to = dateRange.split(",")[1];
  }

  result.limit = 20;
  result.status = "fully_paid";

  return result;
});

// Methods
const searchAction = async () => {
  filterShow.value = false;
  softShow.value = false;
  await getAction();
};

const clearFilter = () => {
  searchKey.value = {
    crm_id: "",
    customer_name: "",
    user_id: "",
    verify_status: "",
    payment_status: "",
    expense_status: "",
    invoice_status: "",
    booking_daterange: "",
  };
  dateRange.value = "";
  filterShow.value = false;
  getAction();
};

const getAction = async () => {
  await bookingStore.getListAction(watchSystem.value);
};

const getDetailAction = async (id) => {
  selectedItem.value = id;
  router.push({
    name: "verifyInvoices",
    query: {
      id: id,
      month: selectedMonth.value,
      year: year.value,
    },
  });
  await getDetail();
};

const getDetail = async () => {
  if (!selectedItem.value) return;

  loadingDetail.value = true;
  try {
    const res = await bookingStore.getDetailAction(selectedItem.value);
    detailVal.value = res.result;

    if (detailVal.value && haveCrmId.value) {
      detailValItem.value = detailVal.value?.items.find((item) => {
        return item.crm_id == haveCrmId.value;
      });
    } else {
      detailValItem.value = detailVal.value?.items[0];
    }

    // Set initial images
    imageData.value = detailVal.value?.receipts[0];
    imageItemData.value = detailVal.value?.items[0]?.receipt_images[0];
  } catch (error) {
    console.error("Error fetching detail:", error);
  } finally {
    loadingDetail.value = false;
  }
};

const changePage = async (url) => {
  await bookingStore.getChangePage(url, watchSystem.value);
};

const generateDateRangeForMonth = (month, yearValue) => {
  const startDate = new Date(yearValue, month - 1, 1);
  const endDate = new Date(yearValue, month, 0);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return `${formatDate(startDate)},${formatDate(endDate)}`;
};

const handleYearChange = (newYear) => {
  year.value = newYear;
  getAction();
};

const handleMonthChange = (month) => {
  selectedMonth.value = month;
  getAction();
};

const showFormat = (dateStr) => {
  if (!dateStr) return "";

  const singleDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  const multipleDatesPattern = /^(\d{4}-\d{2}-\d{2})(,\d{4}-\d{2}-\d{2})*$/;

  if (singleDatePattern.test(dateStr)) {
    return format(new Date(dateStr), "MMM, dd");
  } else if (multipleDatesPattern.test(dateStr)) {
    const dateArray = dateStr.split(",");
    const formattedDates = dateArray.map((date) => {
      return format(new Date(date), "MMM, dd");
    });
    return formattedDates.join(" to ");
  } else {
    return "Invalid format";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (amount) => {
  if (!amount) return "0";
  return new Intl.NumberFormat().format(amount);
};

const getStatusClass = (status) => {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-800";
    case "unverified":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const checkDataFailOrSuccess = (data) => {
  if (!data) return false;

  const requiredFields = ["amount", "date", "sender", "reciever"];

  for (const field of requiredFields) {
    if (
      data[field] === null ||
      data[field] === "null" ||
      data[field] === undefined ||
      data[field] === ""
    ) {
      return false;
    }
  }
  return true;
};

const openModal = (data) => {
  carModalOpen.value = true;
  formData.value = {
    id: data.id,
    file: data.image || data.file,
    amount: data.amount,
    date: data.date,
    bank_name: data.bank_name,
    sender: data.sender || (!show.value ? "MR. THIHA@KUMAR BHUSAL" : ""),
    reciever: data.reciever || (show.value ? "MR. THIHA@KUMAR BHUSAL" : ""),
    interact_bank: data.interact_bank,
    currency: data.currency,
    is_corporate: data.is_corporate == 1 ? true : false,
    comment: data.note,
  };
};

const clearAction = () => {
  formData.value = {
    id: "",
    file: null,
    amount: 0,
    date: "",
    bank_name: "",
    sender: "",
    reciever: "",
    interact_bank: "",
    currency: "THB",
    is_corporate: false,
    comment: "",
  };
  carModalOpen.value = false;
};

const formatDateFromDb = (dateString) => {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[parseInt(month) - 1];
  return `${day}/${monthName}/${year} ${timePart}`;
};

const formatDateDb = (dateString) => {
  if (!dateString) return "";
  if (dateString.includes("T")) {
    return dateString.replace("T", " ");
  }
  const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})\s(.*)$/;
  const match = dateString.match(ddmmyyyyRegex);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]} ${match[4]}`;
  }
  return dateString;
};

const submit = async () => {
  loadingDetail.value = true;
  try {
    const frmData = new FormData();
    frmData.append("_method", "PUT");
    frmData.append("amount", formData.value.amount);
    frmData.append("date", formatDateDb(formData.value.date));
    frmData.append("bank_name", formData.value.bank_name ?? "others...");
    frmData.append("sender", formData.value.sender);
    frmData.append("reciever", formData.value.reciever);
    frmData.append("interact_bank", formData.value.interact_bank ?? "personal");
    frmData.append("currency", formData.value.currency);
    frmData.append("is_corporate", formData.value.is_corporate ? 1 : 0);
    frmData.append("note", formData.value.comment);

    const res = await cashImageStore.updateAction(frmData, formData.value.id);

    toast.success("Update success");
    clearAction();
    await getDetail();
  } catch (error) {
    console.error("Error updating:", error);
    toast.error("Update failed");
  } finally {
    loadingDetail.value = false;
  }
};

const verifyBooking = async (id, status) => {
  const checklistHTML = `
    <div id="check-list" class="text-left px-6">
      <p class="mb-3 text-sm font-medium" id="check-heading">First step checking...</p>
      <div class="flex items-center justify-between mb-2 opacity-50" id="check-item-1">
        <span class="text-xs">Payment Check</span>
        <span class="text-gray-500 mr-2" id="check-icon-1">
          <i class="fas fa-circle"></i>
        </span>
      </div>
      <div class="flex items-center justify-between mb-2 opacity-50" id="check-item-2">
        <span class="text-xs">Invoice Check</span>
        <span class="text-gray-500 mr-2" id="check-icon-2">
          <i class="fas fa-circle"></i>
        </span>
      </div>
      <div class="flex items-center justify-between mb-2 opacity-50" id="check-item-3">
        <span class="text-xs">Other Check</span>
        <span class="text-gray-500 mr-2" id="check-icon-3">
          <i class="fas fa-circle"></i>
        </span>
      </div>
    </div>
  `;

  const swalInstance = Swal.fire({
    title: "Checking",
    html: checklistHTML,
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#d33",
    confirmButtonText: status,
    allowOutsideClick: false,
    didOpen: () => {
      const heading = document.getElementById("check-heading");
      const items = [
        document.getElementById("check-item-1"),
        document.getElementById("check-item-2"),
        document.getElementById("check-item-3"),
      ];
      const icons = [
        document.getElementById("check-icon-1"),
        document.getElementById("check-icon-2"),
        document.getElementById("check-icon-3"),
      ];

      const startDelay = 500;
      const stepDelay = 800;

      setTimeout(() => {
        heading.innerHTML = "Starting verification process...";
        heading.classList.add("font-bold");
      }, startDelay);

      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.remove("opacity-50");

          if (index === 0) heading.innerHTML = "Checking payment status...";
          if (index === 1) heading.innerHTML = "Verifying invoice details...";
          if (index === 2) heading.innerHTML = "Finalizing verification...";

          setTimeout(() => {
            icons[index].classList.remove("text-gray-500");
            icons[index].classList.add("text-green-500");
            icons[index].innerHTML = '<i class="fas fa-check-circle"></i>';

            if (index === 2) {
              setTimeout(() => {
                heading.innerHTML = "All checks complete!";
                heading.classList.add("text-green-500");
              }, 500);
            }
          }, 500);
        }, startDelay + (index + 1) * stepDelay);
      });
    },
  });

  const result = await swalInstance;

  if (result.isConfirmed) {
    try {
      const frmData = new FormData();
      frmData.append("_method", "PUT");
      frmData.append("verify_status", status);
      const res = await bookingStore.verifyBookingStatus(id, frmData);
      if (res.status == 1) {
        toast.success(res.message);
        await getDetail();
        await getAction();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  }
};

const getListUser = async () => {
  try {
    const res = await adminStore.getSimpleListAction();
    adminLists.value = res.result.data
      .filter((item) => item.role === "admin" || item.role === "sale_manager")
      .map((item) => ({
        id: item.id,
        name: item.name,
      }));
  } catch (error) {
    console.error("Error fetching admin list:", error);
  }
};

// Watchers
watch(dateRange, async (newValue) => {
  if (newValue && newValue.length === 2) {
    const formatDateAsDDMMYYYY = (date) => {
      if (date) {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
      }
    };

    const formattedStartDate = formatDateAsDDMMYYYY(newValue[0]);
    const formattedEndDate = formatDateAsDDMMYYYY(newValue[1]);
    searchKey.value.booking_daterange = `${formattedStartDate},${formattedEndDate}`;
  } else {
    searchKey.value.booking_daterange = "";
  }

  searchModel.value = false;
  await getAction();
});

watch([selectedItem, haveCrmId], async () => {
  if (selectedItem.value) {
    await getDetail();
  }
});

// Lifecycle
onMounted(async () => {
  if (route.query.month && route.query.year) {
    selectedMonth.value = parseInt(route.query.month);
    year.value = parseInt(route.query.year);
  }

  if (route.query.id) {
    selectedItem.value = route.query.id;
  }

  if (route.query.crm_id) {
    haveCrmId.value = route.query.crm_id;
    show.value = false;
  }

  await getListUser();
  await getAction();

  if (selectedItem.value) {
    await getDetail();
  }
});
</script>

<style scoped>
.slide-enter-active {
  animation: slideIn 0.3s ease-out;
}

.slide-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>
