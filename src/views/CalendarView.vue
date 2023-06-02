<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Pagination from "../components/Pagination.vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import Button from "../components/Button.vue";
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Calendar</h3>
    </div>
    <div class="bg-white/60 p-4 rounded-lg shadow-sm mb-5">
      <div class="flex items-center justify-between">
        <div class="">
          <p class="text-xl tracking-wide text-gray-600 font-medium mb-1">
            January 22, 2022
          </p>
          <p class="text-base text-gray-500">Saturday</p>
        </div>
        <div>
          <Button>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button> <span>Today</span> </Button>
          <Button>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  </Layout>
</template>
