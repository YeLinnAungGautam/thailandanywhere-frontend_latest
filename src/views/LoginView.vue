<template>
  <div class="flex items-center justify-center min-h-screen login-image">
    <div
      class="bg-white/60 w-[400px] px-6 py-4 rounded-md shadow-xl backdrop-blur-lg backdrop-filter"
    >
      <div class="flex flex-col items-center justify-start gap-3 mb-8">
        <img src="../../public/web-logo.png" class="w-20 h-20" alt="" />
        <p class="text-lg font-medium tracking-wide text-gray-600 font-poppins">
          Welcome to Dashboard
        </p>
      </div>
      <form @submit.prevent="loginHandler" class="flex flex-col space-y-6">
        <InputField label="Email address" required>
          <Input type="email" v-model="formData.email" />
        </InputField>
        <InputField label="Password" required>
          <Input type="password" v-model="formData.password" />
        </InputField>
        <Button type="submit"> Login to Dashboard </Button>
      </form>
    </div>
  </div>
</template>

<script setup>
import Button from "../components/Button.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import { ArrowRightOnRectangleIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "../stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  email: "",
  password: "",
});

const loginHandler = async () => {
  try {
    const response = await authStore.login(formData.value);
    toast.success(response.message);
    if (authStore.isSuperAdmin) {
      router.push({ name: "home" });
    } else if (authStore.isAuditor) {
      router.push({ name: "auditor_dashboard" });
    } else if (authStore.isSaleAdmin) {
      router.push({ name: "sales_dashboard" });
    } else {
      router.push({ name: "dashboard" });
    }
  } catch (error) {
    console.log("🚀 ~ file: LoginView.vue:54 ~ loginHandler ~ error:", error);
    formData.value = { email: "", password: "" };
    if (error.response) {
      toast.error(error.response.data.message);
    }
  }
};
</script>

<style scoped>
.login-image {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/login.jpg");
}
</style>
