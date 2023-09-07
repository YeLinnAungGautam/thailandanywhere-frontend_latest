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
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Edit Booking</h3>
    </div>
    <div class="p-6 mb-5 bg-white rounded-lg shadow-sm">
      <h4 class="mb-8 text-base font-medium text-gray-600">
        Customer Booking Form
      </h4>
      <form
        action=""
        class="grid grid-cols-1 gap-6 mb-5 md:grid-cols-2 md:gap-8"
      >
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
        <DocumentCheckIcon class="inline-block w-5 h-5 mr-2" /><span
          >Submit Form</span
        >
      </Button>
    </div>
  </Layout>
</template>
