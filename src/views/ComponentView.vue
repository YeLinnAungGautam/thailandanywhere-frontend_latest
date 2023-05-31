<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Button from "../components/Button.vue";
import { ref } from "vue";

const form = ref({
  name: "",
  email: "",
  password: "",
  phone: "",
});
</script>

<template>
  <Layout>
    <div class="mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Components</h3>
    </div>
    <div class="bg-white/60 p-4 rounded-lg shadow-sm mb-5">
      <h4 class="text-gray-600 font-medium mb-3 text-base">Form Input</h4>
      <div class="grid grid-cols-2 gap-5">
        <InputField label="Name" required>
          <Input
            type="text"
            placeholder="Enter your name"
            v-model="form.name"
          />
        </InputField>
        <InputField label="Email" required error="Invalid email address">
          <Input
            type="email"
            placeholder="Enter your email address"
            v-model="form.email"
          />
        </InputField>
        <InputField label="Phone">
          <Input
            type="phone"
            placeholder="Enter your phone number"
            v-model="form.phone"
          />
        </InputField>
        <InputField
          label="Password"
          required
          help="Password must be at least 8 characters"
        >
          <Input
            type="password"
            placeholder="Enter your password"
            v-model="form.password"
          />
        </InputField>
        <InputField label="Select Category" required>
          <select
            class="block px-4 appearance-none w-full py-2 border border-gray-300 rounded-md shadow focus:border-blue-100 focus:ring-blue-100"
            name=""
            id=""
          >
            <option value="1">Fashion</option>
            <option value="2">Food & Drink</option>
            <option value="3">Travel</option>
            <option value="4">Gaming</option>
            <option value="5">Sport</option>
          </select>
        </InputField>
        <InputField label="Image Upload" required>
          <Input type="file" placeholder="Enter your name" multiple
        /></InputField>
      </div>
    </div>
    <div class="bg-white/60 p-4 rounded-lg shadow-sm mb-5">
      <h4 class="text-gray-600 font-medium mb-3 text-base">Buttons</h4>
     <Button>Click Here</Button>
    </div>
  </Layout>
</template>
