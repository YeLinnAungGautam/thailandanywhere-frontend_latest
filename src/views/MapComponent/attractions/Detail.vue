<template>
  <div class="flex h-[62vh] bg-white">
    <!-- Left Sidebar - Navigation -->
    <div class="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div class="p-4">
        <nav>
          <ul class="space-y-1">
            <li v-if="detail?.description || detail?.full_description_en">
              <a
                href="#description"
                @click="setActiveSection('description')"
                :class="
                  activeSection === 'description'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'description'
                      ? 'bg-[#FF613c]'
                      : 'bg-gray-400'
                  "
                ></span>
                Description
              </a>
            </li>

            <li v-if="detail?.location_map_title || detail?.place">
              <a
                href="#location"
                @click="setActiveSection('location')"
                :class="
                  activeSection === 'location'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'location'
                      ? 'bg-[#FF613c]'
                      : 'bg-gray-400'
                  "
                ></span>
                Location
              </a>
            </li>

            <li v-if="detail?.activities && detail.activities.length > 0">
              <a
                href="#activities"
                @click="setActiveSection('activities')"
                :class="
                  activeSection === 'activities'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'activities'
                      ? 'bg-[#FF613c]'
                      : 'bg-gray-400'
                  "
                ></span>
                Activities
              </a>
            </li>

            <li v-if="detail?.payment_method">
              <a
                href="#payment"
                @click="setActiveSection('payment')"
                :class="
                  activeSection === 'payment'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'payment' ? 'bg-[#FF613c]' : 'bg-gray-400'
                  "
                ></span>
                Payment Information
              </a>
            </li>

            <li v-if="detail?.contract_name">
              <a
                href="#contract"
                @click="setActiveSection('contract')"
                :class="
                  activeSection === 'contract'
                    ? 'bg-[#FF613c]/10 text-[#FF613c]'
                    : 'text-gray-700 hover:bg-gray-100'
                "
                class="block px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <span
                  class="w-2 h-2 inline-block rounded-full mr-1"
                  :class="
                    activeSection === 'contract'
                      ? 'bg-[#FF613c]'
                      : 'bg-gray-400'
                  "
                ></span>
                Contract Information
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Right Content Area -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-6 max-w-full">
        <!-- Description Section -->
        <section
          id="description"
          v-if="detail?.description || detail?.full_description_en"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">Description</h2>
          </div>
          <div class="space-y-3 text-sm">
            <div v-if="detail?.full_description_en">
              <div
                class="text-gray-700 bg-gray-50 p-6 rounded-lg leading-relaxed min-h-[300px]"
              >
                {{ detail.full_description_en }}
              </div>
            </div>
            <div v-else-if="detail?.description">
              <div
                class="text-gray-700 bg-gray-50 p-6 rounded-lg leading-relaxed min-h-[300px]"
              >
                {{ detail.description }}
              </div>
            </div>
          </div>
        </section>

        <!-- Location Section -->
        <section
          id="location"
          v-if="detail?.location_map_title || detail?.place"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">Location</h2>
          </div>
          <div class="space-y-2 text-sm">
            <p
              v-if="detail?.place"
              class="text-gray-700 p-6 bg-gray-50 rounded-lg"
            >
              {{ detail.place }}
            </p>
            <p v-if="detail?.location_map_title" class="text-gray-600 px-6">
              {{ detail.location_map_title }}
            </p>
            <div
              v-if="detail?.latitude && detail?.longitude"
              class="text-gray-600 px-6 text-xs"
            >
              <span class="font-medium">Coordinates:</span>
              {{ detail.latitude }}, {{ detail.longitude }}
            </div>
            <div v-if="detail?.location_map" class="mt-4">
              <iframe
                :src="detail.location_map"
                class="w-full h-80 rounded-lg"
                style="border: 0"
                allowfullscreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>

        <!-- Activities Section -->
        <section
          id="activities"
          v-if="detail?.activities && detail.activities.length > 0"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">Activities</h2>
          </div>
          <div class="space-y-3 bg-gray-50 p-6 rounded-lg min-h-[300px]">
            <div
              v-for="(activity, index) in detail.activities"
              :key="index"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-[#FF613c]/10 rounded-full flex items-center justify-center"
                >
                  <span class="text-[#FF613c] font-semibold">{{
                    index + 1
                  }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700">
                    {{ activity.name || activity }}
                  </p>
                  <p v-if="activity.description" class="text-xs text-gray-500">
                    {{ activity.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Payment Information Section -->
        <section
          id="payment"
          v-if="detail?.payment_method"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">
              Payment Information
            </h2>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg min-h-[300px]">
            <div class="space-y-4 text-sm">
              <div
                class="flex items-center justify-between border-b border-gray-200 pb-4"
              >
                <span class="text-gray-500 font-medium">Payment Method:</span>
                <span class="text-gray-900 font-semibold">{{
                  detail.payment_method
                }}</span>
              </div>
              <div
                v-if="detail?.bank_name"
                class="flex items-center justify-between border-b border-gray-200 pb-4"
              >
                <span class="text-gray-500 font-medium">Bank Name:</span>
                <span class="text-gray-900">{{ detail.bank_name }}</span>
              </div>
              <div
                v-if="detail?.bank_account_number"
                class="flex items-center justify-between border-b border-gray-200 pb-4"
              >
                <span class="text-gray-500 font-medium">Account Number:</span>
                <span class="text-gray-900 font-mono">{{
                  detail.bank_account_number
                }}</span>
              </div>
              <div
                v-if="detail?.account_name"
                class="flex items-center justify-between"
              >
                <span class="text-gray-500 font-medium">Account Name:</span>
                <span class="text-gray-900">{{ detail.account_name }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Contract Information Section -->
        <section
          id="contract"
          v-if="detail?.contract_name"
          class="mb-8 scroll-mt-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-[#FF613c]">
              Contract Information
            </h2>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg min-h-[300px]">
            <div class="space-y-4 text-sm">
              <div
                class="flex items-center justify-between border-b border-gray-200 pb-4"
              >
                <span class="text-gray-500 font-medium">Contract Name:</span>
                <span class="text-gray-900 font-semibold">{{
                  detail.contract_name
                }}</span>
              </div>
              <div
                v-if="detail?.legal_name"
                class="flex items-center justify-between border-b border-gray-200 pb-4"
              >
                <span class="text-gray-500 font-medium">Legal Name:</span>
                <span class="text-gray-900">{{ detail.legal_name }}</span>
              </div>
              <div
                v-if="detail?.vat_name && detail.vat_name !== 'null'"
                class="flex items-center justify-between border-b border-gray-200 pb-4"
              >
                <span class="text-gray-500 font-medium">VAT Name:</span>
                <span class="text-gray-900">{{ detail.vat_name }}</span>
              </div>
              <div
                v-if="detail?.vat_id && detail.vat_id !== 'null'"
                class="flex items-center justify-between border-b border-gray-200 pb-4"
              >
                <span class="text-gray-500 font-medium">VAT ID:</span>
                <span class="text-gray-900">{{ detail.vat_id }}</span>
              </div>
              <div
                v-if="detail?.vat_address && detail.vat_address !== 'null'"
                class="flex items-center justify-between"
              >
                <span class="text-gray-500 font-medium">VAT Address:</span>
                <span class="text-gray-900">{{ detail.vat_address }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});

const activeSection = ref("description");

const setActiveSection = (section) => {
  activeSection.value = section;
};

// Intersection Observer to track which section is in view
onMounted(() => {
  const sections = document.querySelectorAll("section[id]");

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          activeSection.value = entry.target.id;
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: "-50px 0px -50px 0px",
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Cleanup observer on unmount
  return () => {
    sections.forEach((section) => {
      observer.unobserve(section);
    });
  };
});
</script>
