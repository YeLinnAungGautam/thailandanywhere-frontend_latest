<template>
  <div>
    <div v-if="hasRouteId">
      <div class="flex justify-center text-xs items-center h-[70vh]">
        <p>Please select one.</p>
      </div>
    </div>
    <div v-if="loading">
      <div class="flex justify-center text-xs items-center h-[70vh]">
        <svg
          class="text-gray-300 animate-spin mr-2"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-900"
          ></path>
        </svg>
        <p>loading</p>
      </div>
    </div>
    <div v-if="!loading && !hasRouteId">
      <div class="space-y-4 border border-gray-200 p-3 rounded-lg">
        <div class="grid grid-cols-5 gap-2">
          <div class="col-span-5 flex justify-between items-center">
            <div>
              <p class="text-[10px] text-gray-500">customer name</p>
              <p class="text-[18px] text-[#FF613c] font-medium pb-2">
                {{ detail?.booking.customer?.name }}
              </p>
              <div class="flex justify-start items-center gap-x-2">
                <p
                  @click="
                    router.push(`/bookings/new-update/${detail?.booking?.id}`)
                  "
                  class="text-[10px] bg-[#FF613c] text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg"
                >
                  {{ detail?.booking?.crm_id }}
                </p>
                <p
                  @click="goToProduct()"
                  class="text-[10px] bg-green-500 text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg"
                >
                  {{
                    detail?.items[0]?.product_type == "App\\Models\\Hotel"
                      ? "Hotel"
                      : "Ticket"
                  }}: {{ detail?.items[0]?.product?.name }}
                </p>
                <div>
                  <div
                    v-if="
                      detail?.items[0]?.product_type == 'App\\Models\\Hotel'
                    "
                  >
                    <p
                      v-if="detail?.booking?.payment_status == 'fully_paid'"
                      class="text-[10px] bg-[#FF613c] shadow hover:shadow-none whitespace-nowrap text-white px-3 py-1.5 rounded-lg cursor-pointer"
                      @click="goToHotelConfirmation()"
                    >
                      Hotel Confirmation
                    </p>
                    <p
                      v-if="detail?.booking?.payment_status != 'fully_paid'"
                      class="text-[10px] bg-gray-400 whitespace-nowrap text-white px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Hotel Confirmation
                    </p>
                  </div>
                  <p
                    class="text-[10px] bg-[#FF613c] whitespace-nowrap text-white px-3 py-1.5 rounded-lg cursor-pointer"
                    v-if="
                      detail?.items[0]?.product_type ==
                      'App\\Models\\EntranceTicket'
                    "
                    @click="generateConfirmation"
                  >
                    Generate Confirmation
                  </p>
                </div>
              </div>
            </div>
            <div class="">
              <p class="text-[10px] text-gray-500 text-end">score</p>
              <p class="text-lg text-red-500 font-medium pb-2 text-end">
                {{ score || 0 }}
              </p>
              <div class="flex justify-end items-center gap-x-2">
                <p
                  class="text-[10px] bg-[#FF613c] text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg"
                  @click="copyReservation"
                >
                  Copy Expense
                </p>
                <p
                  @click="hide = !hide"
                  class="text-[10px] bg-black text-white whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-lg flex justify-center items-center gap-x-1"
                >
                  <ChevronDownIcon class="w-3 h-3 text-white" />{{
                    !hide ? "Hide" : "Show"
                  }}
                </p>
              </div>
            </div>
          </div>
          <div :class="show != 3 ? 'col-span-5' : 'col-span-5'" v-if="!hide">
            <div class="flex justify-between items-start gap-x-4 pt-3">
              <div>
                <img
                  v-if="
                    detail?.items[0]?.product_type ==
                    'App\\Models\\EntranceTicket'
                  "
                  :src="
                    detail?.items[0]?.product?.cover_image
                      ? detail?.items[0]?.product?.cover_image
                      : 'https://placehold.co/400'
                  "
                  class="min-w-[120px] max-w-[120px] shadow object-cover rounded-lg h-[130px]"
                  alt=""
                />
                <img
                  v-if="detail?.items[0]?.product_type == 'App\\Models\\Hotel'"
                  :src="
                    detail?.items[0]?.product?.images?.length > 0
                      ? detail?.items[0]?.product?.images[0]?.image
                      : 'https://placehold.co/400'
                  "
                  class="min-w-[120px] max-w-[120px] shadow object-cover rounded-lg h-[150px]"
                  alt=""
                />
              </div>
              <div class="w-full overflow-scroll max-h-[200px]">
                <table
                  class="w-full rounded-xl overflow-hidden border border-gray-700 shadow-sm"
                >
                  <thead
                    class="bg-[#FF613c] text-white border-b-2 border-gray-200"
                  >
                    <tr>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Code
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap min-w-[120px] font-normal text-left"
                      >
                        Item Name
                      </th>
                      <th
                        v-if="
                          detail?.items[0]?.product_type == 'App\\Models\\Hotel'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Check-in
                      </th>
                      <th
                        v-if="
                          detail?.items[0]?.product_type == 'App\\Models\\Hotel'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Check-out
                      </th>
                      <th
                        v-if="
                          detail?.items[0]?.product_type ==
                          'App\\Models\\EntranceTicket'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Service Date
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Qty
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Price
                      </th>
                      <th
                        v-if="
                          detail?.items[0]?.product_type ==
                          'App\\Models\\EntranceTicket'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Child Price
                      </th>

                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Total
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Expense
                      </th>
                      <th
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        Discount
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr
                      v-for="item in detail?.items ?? []"
                      :key="item"
                      class="bg-white even:bg-gray-50 hover:bg-gray-50"
                    >
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ item.crm_id }}
                      </td>
                      <td
                        v-if="item?.product_type == 'App\\Models\\Hotel'"
                        class="py-1 px-4 text-[10px] w-[300px] font-normal text-left"
                      >
                        {{ item?.room?.name }}
                      </td>
                      <td
                        v-if="
                          item?.product_type == 'App\\Models\\EntranceTicket'
                        "
                        class="py-1 px-4 text-[10px] w-[300px] font-normal text-left"
                      >
                        {{ item?.variation?.name }}
                      </td>
                      <td
                        v-if="item?.product_type == 'App\\Models\\Hotel'"
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ getFormatDate(item.checkin_date) }}
                      </td>
                      <td
                        v-if="item?.product_type == 'App\\Models\\Hotel'"
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ getFormatDate(item.checkout_date) }}
                      </td>
                      <td
                        v-if="
                          item?.product_type == 'App\\Models\\EntranceTicket'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ getFormatDate(item?.service_date) }}
                      </td>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ item.quantity }}
                        {{
                          item?.product_type != "App\\Models\\EntranceTicket"
                            ? `x ${daysBetween(
                                item.checkin_date,
                                item.checkout_date
                              )}`
                            : `, ${
                                item.individual_pricing != "null" &&
                                item.individual_pricing?.child
                                  ? item.individual_pricing?.child?.quantity
                                  : 0
                              }`
                        }}
                      </td>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ item.selling_price }}
                      </td>
                      <td
                        v-if="
                          item?.product_type == 'App\\Models\\EntranceTicket'
                        "
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{
                          item.individual_pricing != "null" &&
                          item.individual_pricing?.child
                            ? item.individual_pricing.child.selling_price
                            : 0
                        }}
                      </td>

                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ item.amount }}
                      </td>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ item.total_cost_price }}
                      </td>
                      <td
                        class="py-1 px-4 text-[10px] whitespace-nowrap font-normal text-left"
                      >
                        {{ item.discount }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="pt-2 relative flex justify-between items-center">
            <!-- line -->
            <!-- <div class="w-full h-[3px] absolute bottom-2.5 bg-gray-200"></div> -->
            <div
              class="flex justify-start items-center gap-x-3 cursor-pointer"
              @click="part = 'general'"
            >
              <div
                v-if="!state.general"
                @click="part = 'general'"
                class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
                :class="
                  part == 'general' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
                "
              >
                1
              </div>
              <div
                v-if="state.general"
                class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
                :class="part == 'general' ? 'bg-white text-white' : ''"
                @click="part = 'general'"
              >
                <img :src="checkImage" alt="" />
              </div>
              <p
                class="text-xs"
                :class="state.general ? 'text-[#04BA00]' : 'text-gray-800'"
              >
                Review
              </p>
            </div>
            <div
              class="relative z-10"
              :class="state.general ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </div>
            <div
              class="flex justify-start items-center gap-x-3 cursor-pointer"
              @click="part = 'passport'"
            >
              <div
                v-if="!state.passport"
                @click="part = 'passport'"
                class="w-6 h-6 flex justify-center cursor-pointer items-center text-[10px] rounded-full relative z-10"
                :class="
                  part == 'passport' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
                "
              >
                2
              </div>
              <div
                v-if="state.passport"
                @click="part = 'passport'"
                class="w-6 h-6 flex justify-center cursor-pointer shadow hover:shadow-none items-center text-[10px] rounded-full relative z-10"
                :class="part == 'passport' ? 'bg-white text-white' : ''"
              >
                <img :src="checkImage" alt="" />
              </div>
              <p
                class="text-xs"
                :class="state.passport ? 'text-[#04BA00]' : 'text-gray-800'"
              >
                Passport
              </p>
            </div>
            <div
              class="relative z-10"
              :class="state.passport ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </div>

            <div
              class="flex justify-start items-center gap-x-3 cursor-pointer"
              @click="part = 'booking'"
            >
              <div
                v-if="
                  !state.booking &&
                  (authStore.isReservation || authStore.isSuperAdmin)
                "
                @click="part = 'booking'"
                class="w-6 h-6 flex justify-center cursor-pointer items-center text-[10px] rounded-full relative z-10"
                :class="
                  part == 'booking' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
                "
              >
                3
              </div>
              <div
                v-if="
                  state.booking &&
                  (authStore.isReservation || authStore.isSuperAdmin)
                "
                @click="part = 'booking'"
                class="w-6 h-6 flex justify-center cursor-pointer shadow hover:shadow-none items-center text-[10px] rounded-full relative z-10"
                :class="part == 'booking' ? 'bg-white text-white' : ''"
              >
                <img :src="checkImage" alt="" />
              </div>
              <p
                class="text-xs"
                :class="state.booking ? 'text-[#04BA00]' : 'text-gray-800'"
              >
                Booking
              </p>
            </div>
            <div
              class="relative z-10"
              :class="state.booking ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </div>
            <div
              class="flex justify-start items-center gap-x-3 cursor-pointer"
              @click="part = 'invoice'"
            >
              <div
                v-if="
                  !state.invoice &&
                  (authStore.isReservation || authStore.isSuperAdmin)
                "
                @click="part = 'invoice'"
                class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
                :class="
                  part == 'invoice' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
                "
              >
                4
              </div>
              <div
                v-if="
                  state.invoice &&
                  (authStore.isReservation || authStore.isSuperAdmin)
                "
                @click="part = 'invoice'"
                class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
                :class="part == 'invoice' ? 'bg-white text-white' : ''"
              >
                <img :src="checkImage" alt="" />
              </div>
              <p
                class="text-xs"
                :class="state.invoice ? 'text-[#04BA00]' : 'text-gray-800'"
              >
                Invoice
              </p>
            </div>
            <div
              class="relative z-10"
              :class="state.invoice ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </div>
            <div
              class="flex justify-start items-center gap-x-3 cursor-pointer"
              @click="part = 'expense'"
            >
              <div
                v-if="
                  !state.expense &&
                  (authStore.isReservation || authStore.isSuperAdmin)
                "
                @click="part = 'expense'"
                class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
                :class="
                  part == 'expense' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
                "
              >
                5
              </div>
              <div
                v-if="
                  state.expense &&
                  (authStore.isReservation || authStore.isSuperAdmin)
                "
                @click="part = 'expense'"
                class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
                :class="part == 'expense' ? 'bg-white text-white' : ''"
              >
                <img :src="checkImage" alt="" />
              </div>
              <p
                class="text-xs"
                :class="state.expense ? 'text-[#04BA00]' : 'text-gray-800'"
              >
                Expense
              </p>
            </div>
            <div
              class="relative z-10"
              :class="state.expense ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </div>
            <div
              class="flex justify-start items-center gap-x-3 cursor-pointer"
              @click="part = 'expensemail'"
            >
              <div
                v-if="
                  !state.expensemail &&
                  (authStore.isReservation || authStore.isSuperAdmin)
                "
                @click="part = 'expensemail'"
                class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
                :class="
                  part == 'expensemail'
                    ? 'bg-[#FF613c] text-white'
                    : 'bg-gray-200'
                "
              >
                6
              </div>
              <div
                v-if="
                  state.expensemail &&
                  (authStore.isReservation || authStore.isSuperAdmin)
                "
                @click="part = 'expensemail'"
                class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
                :class="part == 'expensemail' ? 'bg-white text-white' : ''"
              >
                <img :src="checkImage" alt="" />
              </div>
              <p
                class="text-xs whitespace-nowrap"
                :class="state.expensemail ? 'text-[#04BA00]' : 'text-gray-800'"
              >
                Exp. Mail
              </p>
            </div>
            <div
              class="relative z-10"
              :class="state.expensemail ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </div>
            <div
              class="flex justify-start items-center gap-x-3 cursor-pointer"
              @click="part = 'confirmation'"
            >
              <div
                v-if="!state.confirmation"
                @click="part = 'confirmation'"
                class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
                :class="
                  part == 'confirmation'
                    ? 'bg-[#FF613c] text-white'
                    : 'bg-gray-200'
                "
              >
                7
              </div>
              <div
                v-if="state.confirmation"
                @click="part = 'confirmation'"
                class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
                :class="part == 'confirmation' ? 'bg-white text-white' : ''"
              >
                <img :src="checkImage" alt="" />
              </div>
              <p
                class="text-xs"
                :class="state.confirmation ? 'text-[#04BA00]' : 'text-gray-800'"
              >
                Confirmation
              </p>
            </div>
          </div>

          <div class="pt-2 flex justify-between items-center gap-x-2">
            <p
              class="w-full rounded-lg h-1"
              :class="{
                'bg-green-500': part === 'general' && state.general,
                'bg-[#FF613c]': part === 'general' && !state.general,
                'opacity-0': part !== 'general',
              }"
            ></p>
            <p
              class="w-full rounded-lg h-1"
              :class="{
                'bg-green-500': part === 'passport' && state.passport,
                'bg-[#FF613c]': part === 'passport' && !state.passport,
                'opacity-0': part !== 'passport',
              }"
            ></p>
            <p
              class="w-full rounded-lg h-1"
              :class="{
                'bg-green-500': part === 'booking' && state.booking,
                'bg-[#FF613c]': part === 'booking' && !state.booking,
                'opacity-0': part !== 'booking',
              }"
            ></p>
            <p
              class="w-full rounded-lg h-1"
              :class="{
                'bg-green-500': part === 'invoice' && state.invoice,
                'bg-[#FF613c]': part === 'invoice' && !state.invoice,
                'opacity-0': part !== 'invoice',
              }"
            ></p>
            <p
              class="w-full rounded-lg h-1"
              :class="{
                'bg-green-500': part === 'expense' && state.expense,
                'bg-[#FF613c]': part === 'expense' && !state.expense,
                'opacity-0': part !== 'expense',
              }"
            ></p>
            <p
              class="w-full rounded-lg h-1"
              :class="{
                'bg-green-500': part === 'expensemail' && state.expensemail,
                'bg-[#FF613c]': part === 'expensemail' && !state.expensemail,
                'opacity-0': part !== 'expensemail',
              }"
            ></p>
            <p
              class="w-full rounded-lg h-1"
              :class="{
                'bg-green-500': part === 'confirmation' && state.confirmation,
                'bg-[#FF613c]': part === 'confirmation' && !state.confirmation,
                'opacity-0': part !== 'confirmation',
              }"
            ></p>
          </div>

          <div class="relative" v-if="show != 3">
            <Transition :name="transition" mode="out-in">
              <div class="pt-6" :key="part">
                <component
                  :is="getComponent(part)"
                  :detail="detail"
                  :getDetailAction="getDetailAction"
                />
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
    <Modal :isOpen="selectTicketModal">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg mt-10 bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-start pb-20 pt-4 px-4"
        >
          <p></p>
        </DialogTitle>
        <!-- show date  -->
        <div class="relative">
          <div class="absolute -top-8 left-[43%]">
            <img
              :src="logo"
              class="w-16 h-16 bg-white rounded-full p-3"
              alt=""
            />
          </div>
          <div class="pt-10 pb-5 text-center space-y-2">
            <p class="font-medium text-lg text-[#FF613c]">Select Ticket Type</p>
            <p class="text-xs">
              မည်သည့် ticket အတွက် confirmation ထုတ်မည်ကို အတည်ပြုပေးပါ။,
            </p>
            <div
              class="flex justify-between items-center text-xs px-4 pt-5 pb-2"
            >
              <p>Ticket Type</p>
              <p class="w-[150px] text-start">Slip Code</p>
            </div>
            <div class="space-y-2 px-4">
              <div
                v-for="item in detail?.items"
                class="flex justify-between space-x-2 items-center"
                :key="item"
                @click="
                  () => {
                    reservation_ids.id = item.id;
                    reservation_ids.name = item.variation?.name;
                    reservation_ids.invoice_code = item.slip_code;
                  }
                "
              >
                <div
                  :class="
                    reservation_ids.id == item.id
                      ? 'bg-[#FF613c] text-white'
                      : ''
                  "
                  class="border border-gray-300 w-full px-3 flex justify-start items-center space-x-2 py-3 rounded-lg"
                >
                  <input
                    type="radio"
                    :checked="reservation_ids.id == item.id"
                    class="w-5 h-5 text-white border border-[#FF613c] rounded-full"
                  />
                  <label
                    :for="item.id"
                    class="ml-2 text-sm line-clamp-1 font-medium"
                  >
                    {{ item.variation?.name }}
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    v-model="reservation_ids.invoice_code"
                    class="border border-gray-300 w-[150px] px-3 py-3 text-sm rounded-lg"
                    :placeholder="item.slip_code ? item.slip_code : 'Slip Code'"
                  />
                </div>
              </div>
            </div>
            <div class="pt-4">
              <p
                v-if="reservation_ids.id != null"
                @click="goToPrint"
                class="cursor-pointer mr-2 inline-block text-white text-[10px] bg-[#FF613c] px-2 py-2 border border-[#FF613c] rounded-lg"
              >
                Go To Generate
              </p>
              <p
                v-if="reservation_ids.id == null"
                class="cursor-pointer mr-2 inline-block text-white text-[10px] bg-gray-200 px-2 py-2 border border-gray-200 rounded-lg"
              >
                Go To Generate
              </p>
              <p
                @click="selectTicketModal = false"
                class="cursor-pointer inline-block text-[#FF613c] border border-[#FF613c] text-[10px] bg-white px-2 py-2 rounded-lg"
              >
                Cancel
              </p>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Modal>
    <Modal :isOpen="showFailModal" @closeModal="showFailModal = false">
      <DialogPanel
        class="w-full max-w-sm transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-start pb-20 pt-4 px-4"
        >
          <p></p>
          <XCircleIcon
            class="w-5 h-5 text-white"
            @click="showFailModal = false"
          />
        </DialogTitle>
        <!-- show date  -->
        <div class="relative">
          <div class="absolute -top-8 left-[43%]">
            <img
              :src="logo"
              class="w-16 h-16 bg-white rounded-full p-3"
              alt=""
            />
          </div>
          <div class="py-10 text-center space-y-4">
            <p class="font-medium text-lg text-[#FF613c]">Data Missing !</p>
            <p class="text-xs">Please sure customer payment is paid</p>
            <p
              @click="goToFill"
              class="cursor-pointer inline-block text-white text-[10px] bg-[#FF613c] px-2 py-1 rounded-lg"
            >
              Go To Fill Data
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGroupStore } from "../../stores/group";
import { getFormatDate } from "../help/FormatData";
import { daysBetween } from "../help/DateBetween";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "../../stores/auth";
import GeneralDetail from "./GeneralDetail.vue";
import PassportInfo from "./Passport.vue";
import BookingRequest from "./Booking.vue";
import InvoiceUpdate from "./Invoice.vue";
import Expense from "./Expense.vue";
import Modal from "../../components/Modal.vue";
import ExpenseBooking from "./ExpenseMail.vue";
import Confirmation from "./Confirmation.vue";
import checkImage from "../../assets/check.png";
import { useToast } from "vue-toastification";
import logo from "../../assets/web-logo.png";

const props = defineProps({
  show: Number,
});
const toast = useToast();
const route = useRoute();
const router = useRouter();
const groupStore = useGroupStore();
const detail = ref(null);
const loading = ref(false);
const hasRouteId = ref(false);
const authStore = useAuthStore();

const part = ref("general");
const state = ref({
  general: false,
  passport: false,
  booking: false,
  invoice: false,
  expense: false,
  expensemail: false,
  confirmation: false,
});
const selectTicketModal = ref(false);

const getComponent = (part) => {
  const components = {
    general: GeneralDetail,
    passport: PassportInfo,
    booking: BookingRequest,
    invoice: InvoiceUpdate,
    expense: Expense,
    expensemail: ExpenseBooking,
    confirmation: Confirmation,
  };
  return components[part];
};

const goToPrint = () => {
  router.push(
    `/reservation/confirmations/entrance/${reservation_ids.value.id}?variation_name=${reservation_ids.value.name}&invoice_code=${reservation_ids.value.invoice_code}`
  );
};

const reservation_ids = ref({
  id: null,
  name: null,
  invoice_code: null,
});

const transition = ref("slide-right");

const changeState = (data) => {
  state.value.general = data.booking.payment_status == "fully_paid";
  state.value.passport = data.has_passport;
  state.value.booking = data.sent_booking_request == 1 ? true : false;
  state.value.invoice = data.has_booking_confirm_letter;
  state.value.expense = data.expense_status == "fully_paid";
  state.value.expensemail = data.sent_expense_mail == 1 ? true : false;
  state.value.confirmation = data.has_confirm_letter;
};

const getDetailAction = async (id) => {
  try {
    loading.value = true;
    console.log("getDetailAction", id);
    const res = await groupStore.detailAction(id);
    detail.value = res.result;
    changeState(res.result);
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    hasRouteId.value = false;
  }
};
const hide = ref(true);

const expenseStatus = (i) => {
  // If no bookings or items exist, return 'not_paid' as default
  if (!i?.booking || !i?.booking.items || i?.booking.items.length === 0) {
    return "not_paid";
  }

  const items = i?.booking.items;
  let hasFullyPaid = false;
  let hasNotPaid = false;

  // Check the status of each item
  for (let a = 0; a < items.length; a++) {
    const item_status = items[a].payment_status;

    if (item_status === "fully_paid") {
      hasFullyPaid = true;
    } else if (item_status === "not_paid") {
      hasNotPaid = true;
    }
  }

  console.log(hasFullyPaid, hasNotPaid, "this is has fully paid");

  // Determine overall status based on individual item statuses
  if (hasFullyPaid && hasNotPaid) {
    return "partially_paid";
  } else if (hasFullyPaid && !hasNotPaid) {
    return "fully_paid";
  } else {
    return "not_paid";
  }
};

const copyReservation = () => {
  try {
    console.log("====================================");
    console.log("Copying reservation details...", detail.value);
    console.log("====================================");

    const res = detail.value;

    // Check if we have data and items
    if (!res || !res.items || res.items.length === 0) {
      toast.error("No reservation items found");
      return;
    }

    // Helper function to check if a date is today, tomorrow, or the day after tomorrow
    function getUrgencyLabel(dateString) {
      if (!dateString || dateString === "null" || dateString === "-") return "";

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      // Parse the service date
      const serviceDateParts = dateString.split("-");
      // Assuming format is YYYY-MM-DD or DD-MM-YYYY
      let serviceDate;

      if (serviceDateParts[0].length === 4) {
        // YYYY-MM-DD format
        serviceDate = new Date(dateString);
      } else {
        // DD-MM-YYYY format
        serviceDate = new Date(
          `${serviceDateParts[2]}-${serviceDateParts[1]}-${serviceDateParts[0]}`
        );
      }

      serviceDate.setHours(0, 0, 0, 0);

      if (serviceDate.getTime() === today.getTime()) {
        return "*Urgent: Today*  \n";
      } else if (serviceDate.getTime() === tomorrow.getTime()) {
        return "*Urgent: Tomorrow*  \n";
      } else if (serviceDate.getTime() === dayAfterTomorrow.getTime()) {
        return "*Urgent: Day After Tomorrow*  \n";
      }

      return "";
    }

    // Calculate discount from items
    let discount = 0;
    for (let i = 0; i < res.items.length; i++) {
      discount += res.items[i].discount || 0;
    }

    // Calculate score using booking data
    let score = 0;
    if (res.booking && res.booking.sub_total && res.total_cost_price) {
      score =
        (res.booking.sub_total - res.total_cost_price) / res.total_cost_price;
    }

    // Check for earliest service date across all items
    let earliestServiceDate = null;
    for (const item of res.items) {
      if (item.service_date && item.service_date !== "null") {
        if (!earliestServiceDate || item.service_date < earliestServiceDate) {
          earliestServiceDate = item.service_date;
        }
      }
    }

    // Get urgency label based on earliest service date
    const urgencyLabel = earliestServiceDate
      ? getUrgencyLabel(earliestServiceDate)
      : "";

    // Create formatted output for all items
    let allFormattedOutput = "";

    // Add urgency label at the top if needed
    if (urgencyLabel) {
      allFormattedOutput += urgencyLabel;
    }

    // Add booking header using booking data
    allFormattedOutput += `💰 Total Cost: ${res.total_cost_price} THB 
💵 Price: ${res.booking?.sub_total || 0} THB 
💵 Balance Due: ${res.booking?.balance_due || 0} THB 
📝 Payment Status: ${res.booking?.payment_status || "unknown"}
---------------------
🏦 Bank Name: ${res.expense_bank_name || res.booking?.bank_name || "-"} 
🔢 Bank Account Number: ${
      res.expense_bank_account ? `➖${res.expense_bank_account}` : "-"
    }
🧑‍💼 Account Name: ${res.booking?.bill_to || "-"} 
#️⃣ CRM ID: ${res.booking_crm_id}\n`;

    // Add product header based on type
    if (res.product_type == "Hotel") {
      allFormattedOutput += `🏨 ${res.product_name}
---------------------\n`;
    } else {
      allFormattedOutput += `🎟️ ${res.product_name}
---------------------\n`;
    }

    // Add items based on product type
    if (res.product_type == "Hotel") {
      res.items.forEach((item, index) => {
        const itemUrgencyLabel = getUrgencyLabel(item.checkin_date).trim();
        const urgencyPrefix = itemUrgencyLabel ? `[${itemUrgencyLabel}] ` : "";
        allFormattedOutput += `🏩 Room Name: ${item.room?.name}
📆 Check-in Date: ${urgencyPrefix}${item.checkin_date || item.service_date} : ${
          item.checkout_date || ""
        }
#️⃣ Reservation Code: ${item.crm_id}: S: (${item.sale_price || item.amount})
---------------------\n`;
      });
    } else {
      res.items.forEach((item, index) => {
        const itemUrgencyLabel = getUrgencyLabel(item.service_date).trim();
        const urgencyPrefix = itemUrgencyLabel ? `[${itemUrgencyLabel}] ` : "";
        allFormattedOutput += `🎫 Ticket Name: ${item.variation?.name}
📆 Service Date: ${urgencyPrefix}${item.service_date}
#️⃣ Reservation Code: ${item.crm_id}: S: (${item.sale_price || item.amount})
🧑‍🧑‍🧒 Quantity: ${item.quantity || 1}A${
          item.individual_pricing?.child?.quantity
            ? ` - ${item.individual_pricing.child.quantity}C`
            : ""
        }
---------------------\n`;
      });
    }

    allFormattedOutput += `💵 Total Sale Amount: ${
      res.booking?.sub_total || 0
    } THB 
💸 Discount : ${res.booking?.discount || discount} THB 
📅 Sale Date: ${res.booking?.booking_date}
🤑 Score : ${score.toFixed(2)}\n`;

    // Copy to clipboard
    setTimeout(() => {
      navigator.clipboard.writeText(allFormattedOutput);
      toast.success("Success copy reservation");
    }, 0);

    return allFormattedOutput;
  } catch (error) {
    console.error("Error copying reservations:", error);
    toast.error("Failed to copy reservation");
  }
};

const goToHotelConfirmation = () => {
  router.push(
    `/reservation/confirmations/group/hotel/new/png?id=${route.query.id}`
  );
};
const showFailModal = ref(false);
const generateConfirmation = () => {
  if (detail.value?.booking?.payment_status != "not_paid") {
    selectTicketModal.value = true;
  } else {
    showFailModal.value = true;
  }
};

const goToFill = () => {
  router.push({
    name: "update_new_bookings",
    params: {
      id: detail.value?.booking?.id,
    },
  });

  showFailModal.value = false;
};

watch(
  () => route.query.id,
  () => {
    if (route.query.id) {
      getDetailAction(route.query.id);
    } else {
      hasRouteId.value = true;
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (route.query.id) {
    getDetailAction(route.query.id);
  } else {
    hasRouteId.value = true;
  }
});
</script>

<style scoped>
/* Slide Right (enter from right, leave to left) */
.slide-right-enter-active {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}
.slide-right-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide Left (enter from left, leave to right) */
.slide-left-enter-active {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}
.slide-left-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
