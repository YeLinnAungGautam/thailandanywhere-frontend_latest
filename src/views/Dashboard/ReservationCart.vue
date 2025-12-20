<template>
  <div class="px-4 pb-2 relative cursor-pointer">
    <div
      class="absolute top-[36px] left-3 rounded-full w-2 h-2"
      :class="backgroundCustom"
    ></div>
    <div class="pl-5 pt-2 gap-y-4 gap-x-3" @click="open = !open">
      <div class="flex justify-between items-center">
        <div>
          <p
            class="text-[10px] space-x-1"
            v-if="data?.product_type != 'App\\Models\\Hotel'"
          >
            <span class="font-medium">{{ data?.service_date }}</span>
          </p>
          <p
            class="text-[10px] space-x-1"
            v-if="data?.product_type == 'App\\Models\\Hotel'"
          >
            <span class="font-medium"
              >{{ data?.checkin_date }} / {{ data?.checkout_date }}</span
            >
          </p>
        </div>
        <div class="">
          <div
            class="text-[10px] text-[#ff613c] space-x-1 flex justify-end items-center"
            v-if="data?.product_type != 'App\\Models\\Hotel'"
          >
            <p class="font-medium">E-{{ data?.cost_price * data?.quantity }}</p>

            <p class="font-medium" v-if="authStore.isSuperAdmin">
              : P-{{ data?.selling_price * data?.quantity }}
            </p>
            <p
              class="text-white bg-gray-800 px-1 rounded-md"
              v-if="data?.booking?.is_inclusive == 1"
            >
              Inclusive
            </p>
          </div>
          <p
            class="text-[10px] text-[#ff613c] space-x-1"
            v-if="data?.product_type == 'App\\Models\\Hotel'"
          >
            <span class="font-medium"
              >E-{{
                data?.cost_price *
                data?.quantity *
                daysBetween(data?.checkin_date, data?.checkout_date)
              }}</span
            >

            <span class="font-medium" v-if="authStore.isSuperAdmin"
              >: P-{{
                data?.selling_price *
                data?.quantity *
                daysBetween(data?.checkin_date, data?.checkout_date)
              }}</span
            >
          </p>
        </div>
      </div>
      <div class="py-2 flex justify-start items-center gap-x-2">
        <p
          class="text-xs px-1 py-0.5 text-white inline-block rounded-lg"
          :class="{
            'bg-blue-600': data.product_type === 'App\\Models\\EntranceTicket',
            'bg-green-600': data.product_type === 'App\\Models\\Hotel',
            'bg-yellow-600':
              data.product_type === 'App\\Models\\PrivateVanTour',
          }"
        >
          {{
            data?.product_type == "App\\Models\\EntranceTicket" ? "Ticket" : ""
          }}
          {{ data?.product_type == "App\\Models\\Hotel" ? "Hotel" : "" }}
          {{
            data?.product_type == "App\\Models\\PrivateVanTour" ? "Vantour" : ""
          }}
        </p>
        <p
          class="text-xs bg-[#ff613c] px-1 py-0.5 text-white inline-block rounded-lg"
        >
          {{ data?.crm_id }}
        </p>
        <p
          class="text-xs bg-gray-600 px-1 py-0.5 text-white inline-block rounded-lg"
        >
          {{ data.customer_info?.name }}
        </p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-[14px] font-medium space-x-2 text-gray-900 line-clamp-1">
          <span>{{ data.product?.name }}</span>
          <span class="bg-gray-900 w-1 h-1 rounded-full inline-block"></span
          ><span v-if="data.product_type == 'App\\Models\\EntranceTicket'">{{
            data.variation?.name
          }}</span>
          <span v-if="data.product_type == 'App\\Models\\Hotel'">{{
            data.room?.name
          }}</span>
          <span v-if="data.product_type == 'App\\Models\\PrivateVanTour'">{{
            data.car?.name
          }}</span>
        </p>
        <p
          class="text-[10px] space-x-2 text-gray-500 whitespace-nowrap"
          v-if="data?.product_type == 'App\\Models\\Hotel'"
        >
          {{ data?.quantity }} rooms,
          {{ daysBetween(data?.checkin_date, data?.checkout_date) }} nights
        </p>
        <p
          class="text-[10px] space-x-2 text-gray-500 whitespace-nowrap"
          v-if="data?.product_type == 'App\\Models\\EntranceTicket'"
        >
          {{ data?.quantity }} tickets
        </p>
        <p
          class="text-[10px] space-x-2 text-gray-500 whitespace-nowrap"
          v-if="data?.product_type == 'App\\Models\\PrivateVanTour'"
        >
          {{ data?.quantity }} cars
        </p>
      </div>
      <div
        class="flex justify-start overflow-x-scroll no-sidebar-container space-x-4 pt-2 items-center transition-all duration-150"
        v-if="!open"
      >
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.booking?.payment_status == 'fully_paid'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] whitespace-nowrap text-green-600">
            Customer paid
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.booking?.payment_status == 'partially_paid'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] whitespace-nowrap text-yellow-600">
            C.partially paid
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="data?.booking?.payment_status == 'not_paid'"
        >
          <CurrencyDollarIcon class="w-4 h-4 text-red-600" />
          <p class="text-[9px] whitespace-nowrap text-red-600">C.not paid</p>
        </div>

        <!-- <ChevronRightIcon class="w-3 h-3" /> -->

        <!-- changes -->

        <div class="flex justify-start space-x-1 items-center">
          <CurrencyDollarIcon
            class="w-4 h-4"
            :class="
              data?.customer_passports.length > 0
                ? 'text-green-600'
                : 'text-red-600'
            "
          />
          <p
            class="text-[9px] whitespace-nowrap"
            :class="
              data?.customer_passports.length > 0
                ? 'text-green-600'
                : 'text-red-600'
            "
          >
            Passport
          </p>
        </div>
        <div class="flex justify-start space-x-1 items-center">
          <CurrencyDollarIcon
            class="w-4 h-4"
            :class="
              data?.is_booking_request == 1 ? 'text-green-600' : 'text-red-600'
            "
          />
          <p
            class="text-[9px] whitespace-nowrap"
            :class="
              data?.is_booking_request == 1 ? 'text-green-600' : 'text-red-600'
            "
          >
            Request Sent
          </p>
        </div>
        <div class="flex justify-start space-x-1 items-center">
          <CurrencyDollarIcon
            class="w-4 h-4"
            :class="
              data?.booking_status == 'receive'
                ? 'text-green-600'
                : 'text-red-600'
            "
          />
          <p
            class="text-[9px] whitespace-nowrap"
            :class="
              data?.booking_status == 'receive'
                ? 'text-green-600'
                : 'text-red-600'
            "
          >
            Invoice
          </p>
        </div>

        <!-- changes -->
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.payment_status == 'fully_paid' &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <CreditCardIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] whitespace-nowrap text-green-600">
            Expense paid
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.payment_status == 'partially_paid' &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <CreditCardIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] whitespace-nowrap text-yellow-600">
            E.partially paid
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.payment_status == 'not_paid' &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <CreditCardIcon class="w-4 h-4 text-red-600" />
          <p class="text-[9px] whitespace-nowrap text-red-600">
            Expense not paid
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.is_expense_email_sent == 1 &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <EnvelopeIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] whitespace-nowrap text-green-600">Email sent</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.is_expense_email_sent == 0 &&
            data.product_type != 'App\\Models\\PrivateVanTour'
          "
        >
          <EnvelopeIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] whitespace-nowrap text-yellow-600">
            Email not sent
          </p>
        </div>

        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_car_info?.supplier_id != null &&
            data.product_type == 'App\\Models\\PrivateVanTour'
          "
        >
          <TruckIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] whitespace-nowrap text-green-600">Supplier</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_car_info?.supplier_id == null &&
            data.product_type == 'App\\Models\\PrivateVanTour'
          "
        >
          <TruckIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] whitespace-nowrap text-yellow-600">
            Supplier Missing
          </p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_car_info?.driver_id != null &&
            data.product_type == 'App\\Models\\PrivateVanTour'
          "
        >
          <TruckIcon class="w-4 h-4 text-green-600" />
          <p class="text-[9px] whitespace-nowrap text-green-600">Driver</p>
        </div>
        <div
          class="flex justify-start space-x-1 items-center"
          v-if="
            data?.reservation_car_info?.driver_id == null &&
            data.product_type == 'App\\Models\\PrivateVanTour'
          "
        >
          <TruckIcon class="w-4 h-4 text-yellow-600" />
          <p class="text-[9px] whitespace-nowrap text-yellow-600">
            Driver Missing
          </p>
        </div>
      </div>
    </div>

    <div
      class="relative space-y-4 pb-2 transition-all duration-150"
      v-if="open"
    >
      <div
        class="w-[1px] bg-black/20 absolute top-1 left-[27px]"
        :class="
          data?.product_type == 'App\\Models\\PrivateVanTour'
            ? 'h-[130px]'
            : 'h-[160px]'
        "
      ></div>
      <div
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <div
          v-if="data?.booking?.payment_status == 'fully_paid'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div>
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.booking?.payment_status == 'fully_paid'"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="data?.booking?.payment_status != 'fully_paid'"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Customer Payment</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.booking?.payment_status == 'fully_paid',
              'text-yellow-600':
                data?.booking?.payment_status == 'partially_paid',
              'text-red-600': data?.booking?.payment_status == 'not_paid',
            }"
          >
            {{ data?.booking?.payment_status }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.booking?.receipts.length > 0
                ? formatDate(data?.booking?.receipts[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <p
            class="text-[10px] text-gray-600"
            @click="
              // router.push({
              //   name: 'update_new_bookings',
              //   params: { id: data.booking.id },
              // })
              goToBooking(data?.booking?.id)
            "
          >
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type != 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <div
          v-if="data?.customer_passports.length != 0"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div>
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.customer_passports.length != 0"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="data?.customer_passports.length == 0"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Passport Info</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.customer_passports.length != 0,
              'text-red-600': data?.customer_passports.length == 0,
            }"
          >
            {{
              data?.customer_passports.length == 0
                ? "not available"
                : "available"
            }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.customer_passports.length > 0
                ? formatDate(data?.customer_passports[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <!-- router.push({
            name: 'update_new_bookings',
            params: { id: data.booking.id },
            query: {
              crm_id: data?.crm_id,
            },
          }) -->
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon
              class="w-4 h-4"
              @click="goToReservationDetail(data)"
            />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type != 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <div
          v-if="data?.is_booking_request == 1"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div>
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.is_booking_request == 1"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="data?.is_booking_request == 0"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Booking Request</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.is_booking_request == 1,
              'text-red-600': data?.is_booking_request == 0,
            }"
          >
            {{ data?.is_booking_request == 1 ? "email sent" : "not sent" }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.paid_slip.length > 0
                ? formatDate(data?.paid_slip[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <p
            class="text-[10px] text-gray-300"
            v-if="data?.product_type == 'App\\Models\\EntranceTicket'"
          >
            <PencilSquareIcon class="w-4 h-4" />
          </p>
          <p
            class="text-[10px] text-gray-300"
            v-if="data?.product_type != 'App\\Models\\EntranceTicket'"
          >
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type != 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <div
          v-if="data?.booking_status == 'receive'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div>
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.booking_status == 'receive'"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="
            data?.booking_status == 'not_receive' ||
            data?.booking_status == null
          "
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Invoice Update</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.booking_status == 'receive',
              'text-red-600': data?.booking_status == 'not_receive',
            }"
          >
            {{ data?.booking_status == "receive" ? "receive" : "not receive" }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.paid_slip.length > 0
                ? formatDate(data?.paid_slip[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <p
            class="text-[10px] text-gray-300"
            v-if="data?.product_type == 'App\\Models\\EntranceTicket'"
          >
            <PencilSquareIcon class="w-4 h-4" />
          </p>
          <p
            class="text-[10px] text-gray-300"
            v-if="data?.product_type != 'App\\Models\\EntranceTicket'"
          >
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type != 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <div
          v-if="data?.payment_status == 'fully_paid'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div>
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.payment_status == 'fully_paid'"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="data?.payment_status != 'fully_paid'"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Expense</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.payment_status == 'fully_paid',
              'text-yellow-600': data?.payment_status == 'partially_paid',
              'text-red-600': data?.payment_status == 'not_paid',
            }"
          >
            {{ data?.payment_status }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.paid_slip.length > 0
                ? formatDate(data?.paid_slip[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <p
            class="text-[10px] text-gray-600"
            @click="goToReservationDetail(data)"
            v-if="data?.product_type == 'App\\Models\\EntranceTicket'"
          >
            <PencilSquareIcon class="w-4 h-4" />
          </p>
          <p
            class="text-[10px] text-gray-300"
            v-if="data?.product_type != 'App\\Models\\EntranceTicket'"
          >
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type != 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <div
          v-if="data?.is_expense_email_sent == 1"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div>
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.is_expense_email_sent == 1"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="data?.is_expense_email_sent == 0"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Expense Mail</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.is_expense_email_sent == 1,
              'text-red-600': data?.is_expense_email_sent == 0,
            }"
          >
            {{ data?.is_expense_email_sent == 1 ? "email sent" : "not sent" }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.paid_slip.length > 0
                ? formatDate(data?.paid_slip[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <p
            class="text-[10px] text-gray-300"
            v-if="data?.product_type == 'App\\Models\\EntranceTicket'"
          >
            <PencilSquareIcon class="w-4 h-4" />
          </p>
          <p
            class="text-[10px] text-gray-300"
            v-if="data?.product_type != 'App\\Models\\EntranceTicket'"
          >
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type != 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <!-- <div
          v-if="data?.payment_status == 'fully_paid'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div> -->
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="data?.reservation_status == 'confirmed'"
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-yellow-600 bg-white z-4 relative"
          v-if="data?.reservation_status != 'confirmed'"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Confirmation</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.reservation_status == 'confirmed',
              'text-yellow-600': data?.reservation_status == 'awaiting',
            }"
          >
            {{ data?.reservation_status }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">
            {{
              data?.receipt_images.length > 0
                ? formatDate(data?.receipt_images[0]?.created_at)
                : "--/--/--"
            }}
          </p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type === 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <!-- <div
          v-if="data?.payment_status == 'fully_paid'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div> -->
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="
            data?.reservation_car_info != null &&
            data?.reservation_car_info?.supplier_id != null
          "
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-gray-600 bg-white z-4 relative"
          v-if="data?.reservation_car_info == null"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Supplier</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.reservation_car_info != 'null',
              'text-yellow-600': data?.reservation_car_info == 'null',
            }"
          >
            {{ data?.reservation_car_info?.supplier_name }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">--/--/--</p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        v-if="data?.product_type === 'App\\Models\\PrivateVanTour'"
        class="flex justify-start items-center px-5 gap-x-2 z-2 bg-white relative"
      >
        <!-- <div
          v-if="data?.payment_status == 'fully_paid'"
          class="h-[30px] w-[1px] bg-green-500 absolute top-1 z-1 left-[27px]"
        ></div> -->
        <CurrencyDollarIcon
          class="w-4 h-4 text-green-600 bg-white z-4 relative"
          v-if="
            data?.reservation_car_info != null &&
            data?.reservation_car_info?.driver_id != null
          "
        />
        <CurrencyDollarIcon
          class="w-4 h-4 text-gray-600 bg-white z-4 relative"
          v-if="data?.reservation_car_info == null"
        />
        <div class="grid grid-cols-6 gap-x-4 w-full">
          <p class="text-[10px] text-gray-600 col-span-2">Supplier</p>
          <p
            class="text-[10px] col-span-2"
            :class="{
              'text-green-600': data?.reservation_car_info != 'null',
              'text-yellow-600': data?.reservation_car_info == 'null',
            }"
          >
            {{ data?.reservation_car_info?.driver_name }}
          </p>
          <p class="text-[10px] text-gray-600 flex justify-end">--/--/--</p>
          <p class="text-[10px] text-gray-600">
            <PencilSquareIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <div class="flex justify-start items-center space-x-2">
          <p
            @click="
              // router.push(`/reservation/update/${data.id}/${data.crm_id}`)
              goToReservationDetail(data)
            "
            class="text-[10px] bg-blue-600 shadow-lg rounded-lg text-white px-3 py-1 cursor-pointer"
          >
            reservation
          </p>
          <p
            @click="
              // router.push({
              //   name: 'update_new_bookings',
              //   params: { id: data.booking.id },
              // })
              goToBooking(data?.booking?.id)
            "
            class="text-[10px] bg-green-600 shadow-lg rounded-lg text-white px-3 py-1 cursor-pointer"
          >
            sales invoice
          </p>
        </div>
      </div>
    </div>

    <Modal :isOpen="openExpenseModal" @closeModal="goToExpense">
      <DialogPanel
        class="w-full max-w-4xl transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm font-medium flex justify-between items-center leading-6 text-gray-900 mb-2 px-4"
        >
          <p>Expense Copy & Expense Data Form</p>
          <p
            @click="copyReservation(formData.id)"
            class="flex justify-end items-center gap-x-1 cursor-pointer text-[12px] font-normal"
          >
            <ClipboardDocumentCheckIcon class="w-4 h-4" /><span>Copy</span>
          </p>
        </DialogTitle>
        <div>
          <ExpensePartVue
            :data="formData"
            :info="data"
            :expenseUpdateAction="expenseUpdateAction"
            :expenseCancelAction="expenseCancelAction"
          />
        </div>
      </DialogPanel>
    </Modal>

    <!-- <Modal :isOpen="openPassportInfoModal" @closeModal="goToPassportInfo">
      <DialogPanel
        class="w-full max-w-lg transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm font-medium flex justify-between items-center leading-6 text-gray-900 mb-2 px-4"
        >
          <p>Passport Info</p>
        </DialogTitle>
        <div>
          <PassportInfoPart
            :closeTravellerModal="goToPassportInfo"
            :data="data"
          />
        </div>
      </DialogPanel>
    </Modal> -->
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TruckIcon,
  EnvelopeIcon,
} from "@heroicons/vue/24/solid";
import { useAuthStore } from "../../stores/auth";
import {
  PencilIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";
import router from "../../router";
import ExpensePartVue from "./ExpensePart.vue";
import PassportInfoPart from "./PassportInfoPart.vue";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Modal from "../../components/Modal.vue";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const toast = useToast();
const open = ref(false);
const reservationStore = useReservationStore();

const daysBetween = (a, b) => {
  console.log(a, b);
  if (a && b) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const startDateTimestamp = new Date(a).getTime();
    const endDateTimestamp = new Date(b).getTime();
    let result = Math.abs(
      Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
    );
    return result;
  } else {
    return 1;
  }
};

const props = defineProps({
  backgroundCustom: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const openExpenseModal = ref(false);

const openPassportInfoModal = ref(false);

const goToExpense = () => {
  openExpenseModal.value = !openExpenseModal.value;
};

const goToPassportInfo = () => {
  // openPassportInfoModal.value = !openPassportInfoModal.value;
  // console.log("passport info", props.data);
  router.push("/reservation-second?id=" + props.data.id + "&part=passport");
};

const formData = ref({
  id: "",
  reservation_id: "",
  cost_price: "",
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  payment_status: "",
  hotalQuantity: "",
  quantity: "",
  receipt_image: [],
  booking_receipt_image: [],
  product_type: "",
  customer_feedback: "",
  child_quantity: "",
  child_price: 0,
  total_cost_price: 0,
});

const formatDate = (date) => {
  const [datePart] = date.split(" ");
  const [day, month, year] = datePart.split("-");
  return `${day}/${month}/${year}`;
};

const expenseUpdateAction = async () => {
  // your logic to update the expense data goes here
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  formData.value.cost_price &&
    frmData.append("cost_price", formData.value.cost_price);
  formData.value.payment_method &&
    frmData.append("payment_method", formData.value.payment_method);
  formData.value.quantity &&
    frmData.append("quantity", formData.value.quantity);
  formData.value.payment_status &&
    frmData.append("payment_status", formData.value.payment_status);
  if (props.data?.product_type == "App\\Models\\EntranceTicket") {
    frmData.append(
      "individual_pricing[child][quantity]",
      formData.value.child_quantity
    );
    frmData.append(
      "individual_pricing[child][selling_price]",
      props.data?.individual_pricing?.child?.selling_price ?? 0
    );
    frmData.append(
      "individual_pricing[child][cost_price]",
      formData.value.child_price ?? 0
    );
    frmData.append(
      "individual_pricing[child][total_cost_price]",
      formData.value.child_price ?? 0 * formData.value.child_quantity
    );
    frmData.append(
      "individual_pricing[child][amount]",
      props.data?.individual_pricing?.child?.selling_price
        ? props.data?.individual_pricing?.child?.selling_price *
            formData.value.child_quantity
        : 0
    );
  }
  if (formData.value.cost_price) {
    if (!formData.value.hotalQuantity) {
      frmData.append(
        "total_cost_price",
        formData.value.cost_price * formData.value.quantity +
          (formData.value.child_price ??
            0 * formData.value.child_quantity ??
            0) *
            1
      );
    } else {
      frmData.append(
        "total_cost_price",
        formData.value.cost_price * formData.value.hotalQuantity
      );
    }
  }
  const response = await reservationStore.updateAction(
    frmData,
    formData.value.id
  );

  if (response.status) {
    const secfrm = new FormData();
    secfrm.append("_method", "PUT");
    if (formData.value.customer_feedback) {
      secfrm.append("customer_feedback", formData.value.customer_feedback);
    }

    if (formData.value.bank_name) {
      secfrm.append("bank_name", formData.value.bank_name);
    }
    if (formData.value.bank_account_number) {
      secfrm.append("bank_account_number", formData.value.bank_account_number);
    }
    // if (formData.value.receipt_image.length != 0) {
    //   if (formData.value.receipt_image.length > 0) {
    //     for (let i = 0; i < formData.value.receipt_image.length; i++) {
    //       let file = formData.value.receipt_image[i];
    //       secfrm.append("receipt_image[" + i + "]", file);
    //     }
    //   }
    // }

    await reservationStore.updateInfoAction(secfrm, formData.value.id);

    toast.success(response.message);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
};

const goToReservationDetail = (data) => {
  // console.log("====================================");
  // console.log(data);
  // console.log("====================================");
  if (data.product_type == "App\\Models\\EntranceTicket") {
    // router.push("/reservation-second?id=" + data.id);
    window.open("/group-attraction?id=" + data?.group_id, "_blank", "_blank");
  }
  if (data.product_type == "App\\Models\\PrivateVanTour") {
    // router.push("/reservation-second?id=" + data.id);
    window.open("/group-vantour?id=" + data?.group_id, "_blank", "_blank");
  }
  if (data.product_type == "App\\Models\\Hotel") {
    // router.push(
    //   "/reservation-hotel?id=" +
    //     data?.booking?.id +
    //     "&product_id=" +
    //     data?.product?.id
    // );
    window.open("/group-hotel?id=" + data?.group_id, "_blank", "_blank");
    // console.log(data);
  }
};

const goToBooking = (id) => {
  window.open(`/bookings/new-update/${id}`, "_blank");
  console.log("Navigating to booking:", id);
};

const expenseCancelAction = () => {
  // your logic to cancel the expense update goes here
  openExpenseModal.value = false;
};

const copyReservation = async (id) => {
  const res = await reservationStore.copyReservationDetail(id);
  console.log(res, "this is cpy reservation");

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

  let formattedOutput;
  let urgencyLabel = "";

  if (res.result.checkin_date != undefined) {
    // For hotel reservations, check check-in date
    urgencyLabel = getUrgencyLabel(res.result.checkin_date);

    formattedOutput = `${urgencyLabel}💰 Total Cost: ${
      res.result.total_cost
    } THB 🏦 Bank Name: ${
      res.result.bank_name != "null" ? res.result.bank_name : "-"
    }
🔢 Bank Account Number: ${
      res.result.bank_account_number != "null"
        ? `➖${res.result.bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${
      res.result.account_name != "null" ? res.result.account_name : "-"
    }
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
🏨 Hotel Name: ${res.result.product_name}
🏩 Room Name : ${res.result.room_name != "null" ? res.result.room_name : "-"}
🛌 Total Rooms: ${
      res.result.total_rooms != "null" ? res.result.total_rooms : "-"
    }
🌙 Total Nights: ${
      res.result.total_nights != "null" ? res.result.total_nights : "-"
    }
💵 Price: ${res.result.sale_price} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💸 Discount : ${res.result.discount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
📅 Check-in Date: ${
      res.result.checkin_date != "null" ? res.result.checkin_date : "-"
    }
📅 Checkout Date: ${
      res.result.checkout_date != "null" ? res.result.checkout_date : "-"
    }
🤑 Score : ${res.result.score}
    `;
  } else if (res.result.entrance_ticket_variation_name) {
    // For attraction tickets, check service date
    urgencyLabel = getUrgencyLabel(res.result.service_date);

    formattedOutput = `${urgencyLabel}💰 Total Cost: ${
      res.result.total_cost_price
    } THB
🏦 Bank Name: ${res.result.bank_name != "null" ? res.result.bank_name : "-"}
🔢 Bank Account Number: ${
      res.result.bank_account_number != "null"
        ? `➖${res.result.bank_account_number}`
        : "-"
    }
🧑‍💼 Account Name: ${res.result.account_name}
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
🎫 Attraction : ${res.result.product_name}
🎫 Entrance Ticket Name : ${res.result.entrance_ticket_variation_name}
👨🏻 Adult : ${
      res.result.individual_pricing?.adult?.quantity
        ? res.result.individual_pricing?.adult?.quantity
        : res.result.quantity
    } x ${
      res.result.individual_pricing?.adult?.cost_price
        ? res.result.individual_pricing?.adult?.cost_price
        : res.result.total_cost / res.result.quantity
    } THB
👶🏻 Child : ${
      res.result.individual_pricing?.child?.quantity
        ? res.result.individual_pricing?.child?.quantity
        : 0
    } x ${
      res.result.individual_pricing?.child?.cost_price
        ? res.result.individual_pricing?.child?.cost_price
        : 0
    } THB
💵 Price: ${res.result.sale_price} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💸 Discount : ${res.result.discount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
🗓️ Service Date: ${
      res.result.service_date != "null" ? res.result.service_date : "-"
    }
🤑 Score : ${res.result.score}
    `;
  } else if (res.result.ticket_type) {
    // For airline tickets, check service date
    urgencyLabel = getUrgencyLabel(res.result.service_date);

    formattedOutput = `${urgencyLabel}💰 Total Cost: ${
      res.result.total_cost
    } THB
#️⃣ CRM ID: ${res.result.crm_id}
#️⃣ Reservation Code: ${res.result.reservation_code}
✈️ Airline Name : ${res.result.product_name}
🎫 Ticket Type : ${res.result.ticket_type}
🎫 Total Tickets : ${res.result.total_ticket}
💵 Price: ${res.result.sale_price} THB
💵 Total Sale Amount: ${res.result.total_sale_amount} THB
💸 Discount : ${res.result.discount} THB
💵 Balance Due: ${res.result.balance_due} THB
📝 Payment Status: ${res.result.payment_status}
📅 Sale Date: ${res.result.sale_date != "null" ? res.result.sale_date : "-"}
🗓️ Service Date: ${
      res.result.service_date != "null" ? res.result.service_date : "-"
    }
🧾 Payment Status: ${res.result.payment_status}
🤑 Score : ${res.result.score}
📝 Expense Comment:
  `;
  }

  setTimeout(() => {
    navigator.clipboard.writeText(formattedOutput);
  }, 0);

  toast.success("success copy reservation");
};

onMounted(async () => {
  if (props.data) {
    formData.value.id = props.data?.id;
    formData.value.cost_price = props.data?.cost_price;
    formData.value.payment_method = props.data?.payment_method;
    formData.value.bank_name =
      props.data?.reservation_info?.bank_name ||
      props.data?.bank_name ||
      props.data?.product?.bank_name ||
      "";
    formData.value.bank_account_number =
      props.data?.reservation_info?.bank_account_number ||
      props.data?.bank_account_number ||
      props.data?.product?.bank_account_number ||
      "";
    formData.value.payment_status = props.data?.payment_status;
    formData.value.hotalQuantity =
      props.data?.quantity *
      daysBetween(props.data?.checkin_date, props.data?.checkout_date);
    formData.value.quantity = props.data?.quantity;
    // formData.value.receipt_image = props.data?.receipt_image;
    formData.value.booking_receipt_image = props.data?.receipt_images;
    formData.value.product_type = props.data?.product_type;
    formData.value.customer_feedback =
      props.data?.reservation_info?.customer_feedback || "";
    formData.value.child_quantity =
      props.data?.individual_pricing && props.data?.individual_pricing?.child
        ? props?.data?.individual_pricing?.child?.quantity
        : 0;
    formData.value.child_price =
      props.data?.individual_pricing && props.data?.individual_pricing?.child
        ? props?.data?.individual_pricing?.child?.cost_price
        : 0;
    formData.value.total_cost_price = props.data?.total_cost_price;
  }
});
</script>
