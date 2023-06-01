<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import { ref } from "vue";
import Button from "../components/Button.vue";
import { DocumentCheckIcon } from "@heroicons/vue/24/outline";
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">New Booking</h3>
    </div>
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <h4 class="text-gray-600 font-medium mb-8 text-base">
        Customer Booking Form
      </h4>
      <form action="" class="grid grid-cols-2 gap-8 mb-5">
        <InputField label="Name" required>
          <Input type="text" />
        </InputField>
        <InputField label="Email address" required>
          <Input type="email" />
        </InputField>
        <InputField label="Phone Number" required>
          <Input type="text" />
        </InputField>
        <InputField label="Date" required>
          <Input type="date" />
        </InputField>
        <InputField label="Address" required>
          <Input type="text" />
        </InputField>
      </form>
      <Button class="">
        <DocumentCheckIcon class="w-5 h-5 inline-block mr-2" /><span
          >Submit Form</span
        >
      </Button>
    </div>
  </Layout>
</template>
