<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Button from "../components/Button.vue";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
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
      </div>
    </div>
    <div class="bg-white/60 p-4 rounded-lg shadow-sm mb-5">
      <h4 class="text-gray-600 font-medium mb-3 text-base">Buttons</h4>
      <div class="space-y-5">
        <div class="flex items-center gap-3">
          <Button intent="primary">Primary</Button>
          <Button intent="secondary">Secondary</Button>
          <Button intent="warning">Warning</Button>
          <Button intent="danger">Danger</Button>
          <Button intent="success">Success</Button>
          <Button intent="text">Text</Button>
        </div>
        <div class="flex items-center gap-3">
          <Button intent="primary" :left-icon="EnvelopeIcon">Primary</Button>
          <Button intent="secondary" :left-icon="EnvelopeIcon"
            >Secondary</Button
          >
          <Button intent="warning" :left-icon="EnvelopeIcon">Warning</Button>
          <Button intent="danger" :left-icon="EnvelopeIcon">Danger</Button>
          <Button intent="success" :left-icon="EnvelopeIcon">Success</Button>
          <Button intent="text" :left-icon="EnvelopeIcon">Text</Button>
        </div>
        <div class="flex items-center gap-3">
          <Button intent="primary" :right-icon="EnvelopeIcon">Primary</Button>
          <Button intent="secondary" :right-icon="EnvelopeIcon"
            >Secondary</Button
          >
          <Button intent="warning" :right-icon="EnvelopeIcon">Warning</Button>
          <Button intent="danger" :right-icon="EnvelopeIcon">Danger</Button>
          <Button intent="success" :right-icon="EnvelopeIcon">Success</Button>
          <Button intent="text" :right-icon="EnvelopeIcon">Text</Button>
        </div>
        <div class="flex items-center gap-3">
          <Button intent="primary" :right-icon="EnvelopeIcon" loading
            >Primary</Button
          >
          <Button intent="secondary" :right-icon="EnvelopeIcon" loading
            >Secondary</Button
          >
          <Button intent="warning" :right-icon="EnvelopeIcon" loading
            >Warning</Button
          >
          <Button intent="danger" :right-icon="EnvelopeIcon" loading
            >Danger</Button
          >
          <Button intent="success" :right-icon="EnvelopeIcon" loading
            >Success</Button
          >
          <Button intent="text" :right-icon="EnvelopeIcon" loading>Text</Button>
        </div>
        <div class="flex items-center gap-3">
          <Button intent="primary" disabled :right-icon="EnvelopeIcon"
            >Primary</Button
          >
          <Button intent="secondary" disabled :right-icon="EnvelopeIcon"
            >Secondary</Button
          >
          <Button intent="warning" disabled :right-icon="EnvelopeIcon"
            >Warning</Button
          >
          <Button intent="danger" disabled :right-icon="EnvelopeIcon"
            >Danger</Button
          >
          <Button intent="success" disabled :right-icon="EnvelopeIcon"
            >Success</Button
          >
          <Button intent="text" disabled :right-icon="EnvelopeIcon"
            >Text</Button
          >
        </div>
      </div>
    </div>
  </Layout>
</template>
