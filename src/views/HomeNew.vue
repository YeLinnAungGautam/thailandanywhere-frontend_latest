<template>
  <div>
    <!-- Loading Screen with GIF -->

    <!-- Main Content -->
    <Layout title="Travel & Tour Agency">
      <div class="grid grid-cols-7 gap-2">
        <div class="col-span-5">
          <div class="grid grid-cols-5 gap-2">
            <div class="col-span-3 grid grid-cols-2 gap-2">
              <StatCard title="AVERAGE SALES" value="฿ 820,000" />
              <BookingStats :tours="20" :tickets="15" :packages="15" />
              <div class="col-span-2">
                <SalesOverview
                  :salesData="monthlySalesData"
                  :averageValue="80000"
                />
              </div>
            </div>
            <div class="col-span-2">
              <div class="gird grid-cols-2 gap-2">
                <div class="col-span-2 mb-2">
                  <RevenueByProduct />
                </div>
                <ConversionRate :rate="120000" :value="10" />
              </div>
            </div>
            <div class="col-span-5">
              <div class="grid grid-cols-2 gap-2">
                <BookingsBySource />
                <AverageBookingValue />
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-2 space-y-2">
          <MonthlyTarget :percentage="72" />
          <TopSalesReps />
          <RecentBookings />
        </div>
      </div>
    </Layout>
  </div>
</template>

<script setup>
import Layout from "./Layout.vue";
import StatCard from "./HomeNewComponent/Statcard.vue";
import BookingStats from "./HomeNewComponent/Bookingstats.vue";
import RevenueByProduct from "./HomeNewComponent/Revenuebyproduct.vue";
import MonthlyTarget from "./HomeNewComponent/Monthlytarget.vue";
import SalesOverview from "./HomeNewComponent/Salesoverview.vue";
import ConversionRate from "./HomeNewComponent/Conversionrate.vue";
import TopSalesReps from "./HomeNewComponent/Topsalesreps.vue";
import BookingsBySource from "./HomeNewComponent/Bookingsbysource.vue";
import AverageBookingValue from "./HomeNewComponent/Averagebookingvalue.vue";
import RecentBookings from "./HomeNewComponent/Recentbookings.vue";
import { ref, onMounted } from "vue";

const monthlySalesData = ref([
  45000, 52000, 48000, 61000, 58000, 63000, 59000, 67000, 71000, 68000, 74000,
  45000, 52000, 48000, 61000, 58000, 63000, 59000, 67000, 51000, 88000, 74000,
  78000, 82000, 79000, 85000, 88000, 92000, 89000, 95000, 98000, 94000,
]);
</script>
