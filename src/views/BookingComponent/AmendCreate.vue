<template>
  <div class="relative">
    <div
      class="absolute flex justify-start items-center gap-x-4 -top-12 right-0"
    >
      <p
        @click="variationChange = true"
        class="text-sm font-medium cursor-pointer"
        :class="
          variationChange
            ? 'text-[#FF613c] bg-[#FF613c]/20 px-4 py-1 rounded-lg'
            : ''
        "
      >
        Variation Change
      </p>
      <p
        @click="variationChange = false"
        class="text-sm font-medium cursor-pointer"
        :class="
          !variationChange
            ? 'text-[#FF613c] bg-[#FF613c]/20 px-4 py-1 rounded-lg'
            : ''
        "
      >
        Other Change
      </p>
    </div>
    <div class="grid grid-cols-2 gap-4" v-if="!variationChange">
      <div
        class="h-[450px] overflow-y-scroll py-2 space-y-2 pr-1"
        v-if="amendData != null"
      >
        <p class="text-sm font-medium">Current Data</p>
        <div v-if="amendData.product_type != 6" class="space-y-2">
          <div class="grid grid-cols-2 gap-x-2">
            <div class="space-y-1" v-if="amendData.product_type == 1">
              <label for="" class="text-[12px] text-gray-500"
                >Pick up time <span class="text-red-800">*</span></label
              >
              <input
                type="time"
                disabled
                v-model="amendData.pickup_time"
                name=""
                class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Service date <span class="text-red-800">*</span></label
              >
              <input
                type="date"
                disabled
                v-model="amendData.service_date"
                name=""
                class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                :class="todayVali ? '' : ''"
                id=""
              />
            </div>
          </div>
          <div class="space-y-1" v-if="amendData.product_type == 1">
            <label for="" class="text-[12px] text-gray-500"
              >Pick up location <span class="text-red-800">*</span></label
            >
            <input
              type="text"
              disabled
              v-model="amendData.pickup_location"
              name=""
              class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div class="grid grid-cols-2 gap-x-2">
            <div class="space-y-1" v-if="amendData.product_type == 1">
              <label for="" class="text-[12px] text-gray-500"
                >Payment Method <span class="text-red-800">*</span></label
              >
              <div class="flex justify-start items-center gap-x-2">
                <input
                  type="checkbox"
                  disabled
                  name=""
                  v-model="amendData.is_driver_collect"
                  class="px-4 w-6 h-6 py-4 text-sm rounded-sm focus:outline-none"
                  id=""
                />
                <p class="text-xs">
                  Is Driver Collect ? <span class="text-red-800">*</span>
                </p>
              </div>
            </div>
            <div class="space-y-1" v-if="amendData.product_type != 7">
              <label for="" class="text-[12px] text-gray-500"
                >Qty - selling : {{ amendData.selling_price }}
                <span class="text-red-800">*</span></label
              >
              <input
                type="number"
                disabled
                v-model="amendData.quantity"
                name=""
                class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div
              class="relative space-y-1"
              v-for="i in amendData.child_info ?? []"
              :key="i"
            >
              <div class="flex justify-between items-center pb-1 pt-1">
                <label for="" class="text-xs text-gray-500 relative"
                  >Child Qty - selling : {{ i.child_price
                  }}<span class="text-red-800">*</span>
                </label>
                <p
                  :title="i?.info"
                  class="absolute top-0 cursor-pointer text-[10px] bg-[#FF613c] shadow-xl border border-white px-1 text-white rounded-full w-5 h-5 right-1 flex justify-center items-center custom-tooltip"
                >
                  ?
                </p>
              </div>
              <input
                type="number"
                v-model="amendData.individual_pricing.child.quantity"
                disabled
                name=""
                class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id="adult_pricing"
              />
            </div>
            <div class="space-y-1 col-span-2">
              <label for="" class="text-[12px] text-gray-500"
                >Ticket Info <span class="text-red-800">*</span></label
              >
              <div class="grid-cols-2 grid gap-2">
                <div class="relative space-y-1">
                  <label for="" class="text-xs text-gray-500"
                    >Selling Price <span class="text-red-800">*</span></label
                  >
                  <input
                    type="number"
                    v-model="amendData.selling_price"
                    disabled
                    name=""
                    class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                    id=""
                  />
                </div>
                <div
                  class="relative space-y-1"
                  v-if="amendData.product_type == 7"
                >
                  <label for="" class="text-xs text-gray-500"
                    >Ticket Qty <span class="text-red-800">*</span></label
                  >
                  <input
                    type="number"
                    v-model="amendData.quantity"
                    disabled
                    name=""
                    class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                    id=""
                  />
                  <p
                    @click="amendData.quantity++"
                    class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-8"
                  >
                    +
                  </p>
                  <p
                    @click="amendData.quantity--"
                    v-if="amendData.quantity > 1"
                    class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-1"
                  >
                    -
                  </p>
                  <p
                    v-if="amendData.quantity == 1"
                    class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-1"
                  >
                    -
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2" v-if="amendData.product_type == 6">
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Check in date <span class="text-red-800">*</span></label
            >
            <input
              type="date"
              disabled
              v-model="amendData.service_date"
              name=""
              class="border w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Check out date <span class="text-red-800">*</span></label
            >
            <input
              type="date"
              disabled
              v-model="amendData.checkout_date"
              name=""
              class="border w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Total Rooms <span class="text-red-800">*</span></label
            >
            <input
              type="number"
              disabled
              v-model="amendData.quantity"
              name=""
              class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Qty <span class="text-red-800">*</span></label
            >
            <p
              class="bg-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            >
              {{ amendData.days }} Night x {{ amendData.quantity }} Rooms
            </p>
          </div>
        </div>
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500">Discount</label>
          <input
            type="number"
            disabled
            v-model="amendData.discount"
            name=""
            class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          />
        </div>
        <p class="text-xs text-gray-500">Total Price</p>
        <div>
          <p class="text-sm text-start py-1.5 rounded-lg px-2">
            <span class="font-medium text-[#ff613c]"
              >{{
                amendData.selling_price * 1 * amendData.quantity -
                amendData.discount * 1 +
                (amendData.individual_pricing?.child?.amount &&
                amendData.individual_pricing?.child?.amount != "NaN"
                  ? amendData.individual_pricing?.child?.amount
                  : 0) *
                  1
              }}
              ฿</span
            >
          </p>
        </div>
        <div class="space-y-1" v-if="amendData.product_type == 1">
          <label for="" class="text-[12px] text-gray-500"
            >Route Plan <span class="text-red-800">*</span></label
          >
          <textarea
            name=""
            disabled
            v-model="amendData.route_plan"
            class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          ></textarea>
        </div>
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500"
            >Special Request <span class="text-red-800">*</span></label
          >
          <textarea
            name=""
            disabled
            v-model="amendData.special_request"
            class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          ></textarea>
        </div>
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500"
            >Description <span class="text-red-800">*</span></label
          >
          <textarea
            name=""
            disabled
            v-model="amendData.comment"
            class="w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          ></textarea>
        </div>
      </div>
      <div
        class="h-[450px] overflow-y-scroll py-2 space-y-2 pr-1"
        v-if="amendData != null"
      >
        <p class="text-sm font-medium">Amend Data</p>
        <div v-if="amendData.product_type != 6" class="space-y-2">
          <div class="grid grid-cols-2 gap-x-2">
            <div class="space-y-1" v-if="amendData.product_type == 1">
              <label for="" class="text-[12px] text-gray-500"
                >Pick up time <span class="text-red-800">*</span></label
              >
              <input
                type="time"
                disabled
                name=""
                class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div class="space-y-1">
              <label for="" class="text-[12px] text-gray-500"
                >Service date <span class="text-red-800">*</span></label
              >
              <input
                type="date"
                v-model="amendChangesData.service_date"
                name=""
                class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
          </div>
          <div class="space-y-1" v-if="amendData.product_type == 1">
            <label for="" class="text-[12px] text-gray-500"
              >Pick up location <span class="text-red-800">*</span></label
            >
            <input
              type="text"
              disabled
              v-model="amendData.pickup_location"
              name=""
              class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div class="grid grid-cols-2 gap-x-2">
            <div class="space-y-1" v-if="amendData.product_type == 1">
              <label for="" class="text-[12px] text-gray-500"
                >Payment Method <span class="text-red-800">*</span></label
              >
              <div class="flex justify-start items-center gap-x-2">
                <input
                  type="checkbox"
                  disabled
                  name=""
                  v-model="amendData.is_driver_collect"
                  class="px-4 w-6 h-6 py-4 text-sm border border-gray-300 rounded-sm focus:outline-none"
                  id=""
                />
                <p class="text-xs">
                  Is Driver Collect ? <span class="text-red-800">*</span>
                </p>
              </div>
            </div>
            <div class="space-y-1" v-if="amendData.product_type != 7">
              <label for="" class="text-[12px] text-gray-500"
                >Qty - selling : {{ amendData.selling_price }}
                <span class="text-red-800">*</span></label
              >
              <input
                type="number"
                v-model="amendChangesData.quantity"
                name=""
                class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id=""
              />
            </div>
            <div
              class="relative space-y-1"
              v-for="i in amendData.child_info ?? []"
              :key="i"
            >
              <div class="flex justify-between items-center pb-1 pt-1">
                <label for="" class="text-xs text-gray-500 relative"
                  >Child Qty - selling : {{ i.child_price
                  }}<span class="text-red-800">*</span>
                </label>
                <p
                  :title="i?.info"
                  class="absolute top-0 cursor-pointer text-[10px] bg-[#FF613c] shadow-xl border border-white px-1 text-white rounded-full w-5 h-5 right-1 flex justify-center items-center custom-tooltip"
                >
                  ?
                </p>
              </div>
              <input
                type="number"
                v-model="amendChangesData.child_quantity"
                name=""
                class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                id="adult_pricing"
              />
            </div>
            <div class="space-y-1 col-span-2">
              <label for="" class="text-[12px] text-gray-500"
                >Ticket Info <span class="text-red-800">*</span></label
              >
              <div class="grid-cols-2 grid gap-2">
                <div class="relative space-y-1">
                  <label for="" class="text-xs text-gray-500"
                    >Selling Price <span class="text-red-800">*</span></label
                  >
                  <input
                    type="number"
                    v-model="amendData.selling_price"
                    disabled
                    name=""
                    class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                    id=""
                  />
                </div>
                <div
                  class="relative space-y-1"
                  v-if="amendData.product_type == 7"
                >
                  <label for="" class="text-xs text-gray-500"
                    >Ticket Qty <span class="text-red-800">*</span></label
                  >
                  <input
                    type="number"
                    v-model="amendChangesData.quantity"
                    name=""
                    class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
                    id=""
                  />
                  <p
                    @click="amendChangesData.quantity++"
                    class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-8"
                  >
                    +
                  </p>
                  <p
                    @click="amendChangesData.quantity--"
                    v-if="amendChangesData.quantity > 1"
                    class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-1"
                  >
                    -
                  </p>
                  <p
                    v-if="amendChangesData.quantity == 1"
                    class="bg-[#ff613c]/10 text-[#ff613c] cursor-pointer inline-block px-2 z-50 rounded-lg absolute top-7 right-1"
                  >
                    -
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2" v-if="amendData.product_type == 6">
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Check in date <span class="text-red-800">*</span></label
            >
            <input
              type="date"
              v-model="amendChangesData.service_date"
              name=""
              class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Check out date <span class="text-red-800">*</span></label
            >
            <input
              type="date"
              v-model="amendChangesData.checkout_date"
              name=""
              class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Total Rooms <span class="text-red-800">*</span></label
            >
            <input
              type="number"
              v-model="amendChangesData.quantity"
              name=""
              class="border border-blue-600 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
              id=""
            />
          </div>
          <div class="space-y-1">
            <label for="" class="text-[12px] text-gray-500"
              >Qty <span class="text-red-800">*</span></label
            >
            <p
              class="border border-gray-300 bg-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            >
              {{
                daysBetween(
                  amendChangesData.service_date,
                  amendChangesData.checkout_date
                )
              }}
              Night x {{ amendChangesData.quantity }} Rooms
            </p>
          </div>
        </div>
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500">Discount</label>
          <input
            type="number"
            disabled
            v-model="amendData.discount"
            name=""
            class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          />
        </div>
        <p class="text-xs text-gray-500">Total Price</p>
        <div>
          <p
            class="text-sm text-start border border-gray-300 py-1.5 rounded-lg px-2"
          >
            <span class="font-medium text-[#ff613c]"
              >{{
                amendData.selling_price * 1 * amendData.quantity -
                amendData.discount * 1 +
                (amendData.individual_pricing?.child?.amount &&
                amendData.individual_pricing?.child?.amount != "NaN"
                  ? amendData.individual_pricing?.child?.amount
                  : 0) *
                  1
              }}
              ฿</span
            >
          </p>
        </div>
        <div class="space-y-1" v-if="amendData.product_type == 1">
          <label for="" class="text-[12px] text-gray-500"
            >Route Plan <span class="text-red-800">*</span></label
          >
          <textarea
            name=""
            disabled
            v-model="amendData.route_plan"
            class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          ></textarea>
        </div>
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500"
            >Special Request <span class="text-red-800">*</span></label
          >
          <textarea
            name=""
            disabled
            v-model="amendData.special_request"
            class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          ></textarea>
        </div>
        <div class="space-y-1">
          <label for="" class="text-[12px] text-gray-500"
            >Description <span class="text-red-800">*</span></label
          >
          <textarea
            name=""
            disabled
            v-model="amendData.comment"
            class="border border-gray-300 w-full px-2 py-2 rounded-lg text-xs focus:outline-none"
            id=""
          ></textarea>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" v-if="variationChange">
      <div>
        <div
          class="h-[450px] overflow-y-scroll py-2 space-y-2 pr-1"
          v-if="amendData != null"
        >
          <p class="text-sm font-medium">Current Data</p>
          <div
            class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2"
            v-for="i in amendData.car_list || []"
            :key="i"
            :class="
              amendData.car_id == i.id
                ? 'border-[#ff613c] bg-[#ff613c]/20'
                : 'border-gray-200'
            "
          >
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="amendData?.product_type == 1"
            >
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full h-16">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-[#ff613c]">{{ i.name }}</p>
                  <p class="text-xs">{{ i.max_person }} Pax</p>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.price }}</span> / car
                  </p>
                </div>
              </div>
            </div>
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="amendData?.product_type == 4"
            >
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full">
                <div class="space-y-1">
                  <p class="text-xs font-medium text-[#ff613c]">{{ i.name }}</p>
                  <div class="flex justify-start items-center gap-x-1">
                    <p
                      class="text-[8px] text-white px-2 py-0.5 rounded-full inline-block"
                      :class="
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_main == 1
                          ? 'bg-green-500'
                          : 'hidden'
                      "
                    >
                      {{
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? "main"
                          : "-"
                      }}
                    </p>
                    <p
                      class="text-[8px] text-white px-2 py-0.5 rounded-full inline-block"
                      :class="
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? 'bg-green-500'
                          : 'hidden'
                      "
                    >
                      {{
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? "show"
                          : "no show"
                      }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[10px] text-gray-800"
                      v-for="a in i?.including_services != null &&
                      i?.including_services != ''
                        ? JSON.parse(i?.including_services)
                        : []"
                      :key="a"
                    >
                      <span
                        class="h-1.5 w-1.5 mr-2 bg-gray-500 inline-block rounded-full"
                      ></span
                      >{{ a }}
                    </p>
                  </div>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.price }}</span> / ticket
                  </p>
                </div>
              </div>
            </div>
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="amendData?.product_type == 6"
            >
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full gap-x-2">
                <div class="space-y-1">
                  <p class="text-xs font-medium text-[#ff613c]">{{ i.name }}</p>
                  <p class="text-xs">{{ i.max_person }} Pax</p>
                  <p class="text-[10px] text-green-600">
                    {{ i?.has_breakfast == 1 ? "Breakfast included" : "" }}
                  </p>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.room_price }}</span> / night
                  </p>
                </div>
              </div>
            </div>
            <div v-if="amendData?.product_type == 7">
              <div class="flex justify-start items-start gap-x-2">
                <img
                  src="https://placehold.co/400"
                  class="w-16 h-16 object-cover rounded-lg"
                  alt=""
                />
                <div
                  class="flex justify-between items-start gap-x-2 w-full h-auto"
                >
                  <div class="pt-2">
                    <p class="text-xs font-medium">{{ i?.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          class="h-[450px] overflow-y-scroll py-2 space-y-2 pr-1"
          v-if="amendData != null"
        >
          <p class="text-sm font-medium">Amend Data</p>
          <div
            class="bg-white p-2 rounded-xl border mt-2 shadow-sm space-y-2"
            v-for="i in amendData.car_list || []"
            :key="i"
            @click="selectAction(i)"
            :class="
              amendChangesData.variation_id == i.id
                ? 'border-[#ff613c] bg-[#ff613c]/20'
                : 'border-gray-200'
            "
          >
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="amendData?.product_type == 1"
            >
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full h-16">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-[#ff613c]">{{ i.name }}</p>
                  <p class="text-xs">{{ i.max_person }} Pax</p>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.price }}</span> / car
                  </p>
                </div>
              </div>
            </div>
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="amendData?.product_type == 4"
            >
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full">
                <div class="space-y-1">
                  <p class="text-xs font-medium text-[#ff613c]">{{ i.name }}</p>
                  <div class="flex justify-start items-center gap-x-1">
                    <p
                      class="text-[8px] text-white px-2 py-0.5 rounded-full inline-block"
                      :class="
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_main == 1
                          ? 'bg-green-500'
                          : 'hidden'
                      "
                    >
                      {{
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? "main"
                          : "-"
                      }}
                    </p>
                    <p
                      class="text-[8px] text-white px-2 py-0.5 rounded-full inline-block"
                      :class="
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? 'bg-green-500'
                          : 'hidden'
                      "
                    >
                      {{
                        i?.meta_data != null &&
                        JSON.parse(i?.meta_data)[0].is_show == 1
                          ? "show"
                          : "no show"
                      }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[10px] text-gray-800"
                      v-for="a in i?.including_services != null &&
                      i?.including_services != ''
                        ? JSON.parse(i?.including_services)
                        : []"
                      :key="a"
                    >
                      <span
                        class="h-1.5 w-1.5 mr-2 bg-gray-500 inline-block rounded-full"
                      ></span
                      >{{ a }}
                    </p>
                  </div>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.price }}</span> / ticket
                  </p>
                </div>
              </div>
            </div>
            <div
              class="flex justify-start items-start gap-x-2"
              v-if="amendData?.product_type == 6"
            >
              <img
                src="https://placehold.co/400"
                class="w-16 h-16 rounded-lg"
                alt=""
              />
              <div class="flex justify-between items-start w-full gap-x-2">
                <div class="space-y-1">
                  <p class="text-xs font-medium text-[#ff613c]">{{ i.name }}</p>
                  <p class="text-xs">{{ i.max_person }} Pax</p>
                  <p class="text-[10px] text-green-600">
                    {{ i?.has_breakfast == 1 ? "Breakfast included" : "" }}
                  </p>
                </div>
                <div class="my-auto">
                  <p class="text-xs font-semibold whitespace-nowrap">
                    <span class="text-lg">{{ i?.room_price }}</span> / night
                  </p>
                </div>
              </div>
            </div>
            <div v-if="amendData?.product_type == 7">
              <div class="flex justify-start items-start gap-x-2">
                <img
                  src="https://placehold.co/400"
                  class="w-16 h-16 object-cover rounded-lg"
                  alt=""
                />
                <div
                  class="flex justify-between items-start gap-x-2 w-full h-auto"
                >
                  <div class="pt-2">
                    <p class="text-xs font-medium">{{ i?.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end items-center gap-x-2 pt-4">
      <button
        @click="amendRequestCreate"
        class="bg-[#ff613c] text-white px-4 py-1.5 rounded-lg text-xs"
      >
        Amend Request Create
      </button>
      <button
        @click="amendRequestDelete"
        class="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs"
      >
        Amend Delete Request
      </button>
      <button
        @click="amendCloseAction"
        class="bg-white text-[#FF613c] border border-[#FF613c] px-4 py-1.5 rounded-lg text-xs"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { daysBetween } from "../help/DateBetween";
import Swal from "sweetalert2";
import { useAmendStore } from "../../stores/amend";
import { useToast } from "vue-toastification";

const amendStore = useAmendStore();
const toast = useToast();

const props = defineProps({
  amendData: {
    type: Object,
    default: null,
  },
  amendCloseAction: {
    type: Function,
    default: () => {},
  },
});
const emit = defineEmits(["amendCloseAction"]);

const variationChange = ref(false);

const amendChangesData = ref({
  variation_id: null,
  current_variation_id: null,
  variation_name: null,
  current_variation_name: null,
  service_date: null,
  current_service_date: null,
  quantity: null,
  current_quantity: null,
  child_quantity: null,
  current_child_quantity: null,
  checkout_date: null,
  current_checkout_date: null,
});

const selectAction = (i) => {
  amendChangesData.value.variation_id = i.id;
  amendChangesData.value.variation_name = i.name;
};

const amendHistoryData = computed(() => {
  let changes = [];

  // Check for variation change
  if (
    amendChangesData.value.variation_id !== null &&
    amendChangesData.value.variation_id !==
      amendChangesData.value.current_variation_id
  ) {
    changes.push(
      `Variation: <span class="old-value">${
        amendChangesData.value.current_variation_name || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.variation_name || "N/A"
      }</span>`
    );
  }

  // Check for service date change
  if (
    amendChangesData.value.service_date !== null &&
    amendChangesData.value.service_date !==
      amendChangesData.value.current_service_date
  ) {
    changes.push(
      `Service date: <span class="old-value">${
        amendChangesData.value.current_service_date || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.service_date || "N/A"
      }</span>`
    );
  }

  // Check for quantity change
  if (
    amendChangesData.value.quantity !== null &&
    amendChangesData.value.quantity !== amendChangesData.value.current_quantity
  ) {
    changes.push(
      `Quantity: <span class="old-value">${
        amendChangesData.value.current_quantity || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.quantity || "N/A"
      }</span>`
    );
  }

  // Check for child quantity change
  if (
    amendChangesData.value.child_quantity !== null &&
    amendChangesData.value.child_quantity !==
      amendChangesData.value.current_child_quantity
  ) {
    changes.push(
      `Child quantity: <span class="old-value">${
        amendChangesData.value.current_child_quantity || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.child_quantity || "N/A"
      }</span>`
    );
  }

  // Check for checkout date change
  if (
    amendChangesData.value.checkout_date !== null &&
    amendChangesData.value.checkout_date !==
      amendChangesData.value.current_checkout_date
  ) {
    changes.push(
      `Checkout date: <span class="old-value">${
        amendChangesData.value.current_checkout_date || "N/A"
      }</span> → <span class="new-value">${
        amendChangesData.value.checkout_date || "N/A"
      }</span>`
    );
  }

  if (changes.length === 0) {
    return "";
  }

  // Convert array of changes to an HTML list with Poppins font styling
  return `
    <ul style="font-family: 'Poppins', sans-serif; text-align: left; list-style-type: none; padding-left: 0;">
      ${changes
        .map(
          (
            change
          ) => `<li style="margin-bottom: 8px; padding-left: 20px; position: relative;">
        <span style="position: absolute; left: 0; top: 2px; color: #FF613C;">•</span>
        ${change}
      </li>`
        )
        .join("")}
    </ul>
    <style>
      .old-value { color: #D1D5DB; text-decoration: line-through; }
      .new-value { color: #FF613C; font-weight: 500; }
    </style>
  `;
});

const amendRequestCreate = () => {
  // Check if any changes were actually made
  const changesHTML = amendHistoryData.value;

  if (!changesHTML) {
    Swal.fire({
      title: "No changes detected",
      text: "Please make some changes before submitting an amendment request.",
      icon: "info",
    });
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    html: `
      <div style="font-family: 'Poppins', sans-serif;">
        <p style="margin-bottom: 12px;">Do you want to apply these changes?</p>
        ${changesHTML}
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, create it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      // console.log("Amend Request Create: ", amendChangesData.value);
      try {
        let changes = {};

        if (amendChangesData.value.variation_id) {
          changes.variation_id = amendChangesData.value.variation_id;
        }
        if (amendChangesData.value.variation_id) {
          changes.current_variation_id =
            amendChangesData.value.current_variation_id;
        }
        if (amendChangesData.value.variation_name) {
          changes.variation_name = amendChangesData.value.variation_name;
        }
        if (amendChangesData.value.variation_name) {
          changes.current_variation_name =
            amendChangesData.value.current_variation_name;
        }
        if (amendChangesData.value.service_date) {
          changes.service_date = amendChangesData.value.service_date;
        }
        if (amendChangesData.value.service_date) {
          changes.current_service_date =
            amendChangesData.value.current_service_date;
        }
        if (amendChangesData.value.quantity) {
          changes.quantity = amendChangesData.value.quantity;
        }
        if (amendChangesData.value.quantity) {
          changes.current_quantity = amendChangesData.value.current_quantity;
        }
        if (amendChangesData.value.child_quantity) {
          changes.child_quantity = amendChangesData.value.child_quantity;
        }
        if (amendChangesData.value.child_quantity) {
          changes.current_child_quantity =
            amendChangesData.value.current_child_quantity;
        }
        if (amendChangesData.value.checkout_date) {
          changes.checkout_date = amendChangesData.value.checkout_date;
        }
        if (amendChangesData.value.checkout_date) {
          changes.current_checkout_date =
            amendChangesData.value.current_checkout_date;
        }

        const frmData = new FormData();
        frmData.append("booking_item_id", props.amendData.reservation_id);
        frmData.append("changes", JSON.stringify(changes));

        const res = await amendStore.addNewAction(frmData);
        if (res.status == "Request was successful.") {
          toast.success("Amend request created successfully.");
          props.amendCloseAction();
        } else {
          toast.error("Failed to create amend request.");
        }
      } catch (error) {
        console.error("Error creating amend request:", error);
        toast.error("An error occurred while creating the amend request.");
      }
    }
  });
};

const amendRequestDelete = () => {
  Swal.fire({
    title: "Are you sure?",
    html: `
      <div style="font-family: 'Poppins', sans-serif;">
        <p style="margin-bottom: 12px;">Do you wanna remove this reservation?</p>
        <p style="margin-bottom: 12px;">Please confirm to proceed.</p>
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, create it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      // console.log("Amend Request Create: ", amendChangesData.value);
      try {
        let changes = {};

        changes.delete = true;

        const frmData = new FormData();
        frmData.append("booking_item_id", props.amendData.reservation_id);
        frmData.append("changes", JSON.stringify(changes));

        const res = await amendStore.addNewAction(frmData);
        if (res.status == "Request was successful.") {
          toast.success("Amend request created successfully.");
          props.amendCloseAction();
        } else {
          toast.error("Failed to create amend request.");
        }
      } catch (error) {
        console.error("Error creating amend request:", error);
        toast.error("An error occurred while creating the amend request.");
      }
    }
  });
};

// Add a watch on props.amendData to set current values
watch(
  () => props.amendData,
  (newData) => {
    if (newData) {
      amendChangesData.value.current_variation_id = newData.car_id;
      amendChangesData.value.current_variation_name = newData.item_name;
      amendChangesData.value.current_service_date = newData.service_date;
      amendChangesData.value.current_quantity = newData.quantity;
      amendChangesData.value.current_child_quantity =
        newData.individual_pricing?.child?.quantity || 0;
      amendChangesData.value.current_checkout_date = newData.checkout_date;
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log("Amend Data: ", props.amendData);
});
</script>
