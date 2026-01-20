<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <div class="flex justify-start items-center gap-x-4">
        <Button @click="router.push('/products/6')" intent="text" class="">
          <ChevronLeftIcon class="w-5 h-5" />
        </Button>
        <h3 class="text-2xl font-medium text-gray-600">Edit Attraction</h3>
      </div>
      <div class="flex justify-end cursor-pointer items-center gap-x-3">
        <p
          @click="part = 0"
          :class="part == 0 ? 'underline text-[#FF5B00]' : ''"
        >
          General Details
        </p>
        <p
          @click="part = 1"
          :class="part == 1 ? 'underline text-[#FF5B00]' : ''"
        >
          Good to Know
        </p>
        <p
          @click="part = 2"
          :class="part == 2 ? 'underline text-[#FF5B00]' : ''"
        >
          Key Highlights
        </p>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mr-4"
      >
        <span class="sr-only">Loading...</span>
      </div>
      <span class="text-gray-600">Loading attraction data...</span>
    </div>

    <form @submit.prevent="onSubmitHandler" v-if="part == 0 && !loading">
      <div class="grid grid-cols-3 gap-4">
        <!-- Left Column - Form Sections -->
        <div class="col-span-2 space-y-4">
          <!-- Section 1: Basic Details -->
          <div class="bg-white/60 p-6 rounded-lg shadow-sm space-y-4">
            <h4 class="text-lg font-semibold text-gray-700 border-b pb-2">
              Basic Information
            </h4>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="name" class="text-sm text-gray-800 font-medium">
                  Attraction Name
                </label>
                <input
                  type="text"
                  v-model="formData.name"
                  id="name"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
                <p v-if="errors?.name" class="text-xs text-red-600">
                  {{ errors.name[0] }}
                </p>
              </div>

              <div class="space-y-1">
                <label class="text-sm text-gray-800 font-medium">
                  Is Show on Website?
                </label>
                <div class="flex items-center gap-3 pt-1">
                  <Switch
                    v-model="formData.meta_data.is_show"
                    :class="
                      formData.meta_data.is_show
                        ? 'bg-orange-600'
                        : 'bg-gray-400'
                    "
                    class="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <span class="sr-only">Show on website</span>
                    <span
                      aria-hidden="true"
                      :class="
                        formData.meta_data.is_show
                          ? 'translate-x-7'
                          : 'translate-x-0'
                      "
                      class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                    />
                  </Switch>
                  <span class="text-sm text-gray-600">
                    {{ formData.meta_data.is_show ? "Visible" : "Hidden" }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-800 font-medium">Cities</label>
              <v-select
                v-model="formData.city_id"
                class="style-chooser"
                :options="citylist ?? []"
                label="name"
                multiple
                :clearable="false"
                :reduce="(city) => city.id"
                placeholder="Choose City"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-800 font-medium"
                >Categories</label
              >
              <v-select
                v-model="formData.category_id"
                class="style-chooser"
                :options="categoryList ?? []"
                label="name"
                multiple
                :clearable="false"
                :reduce="(d) => d.id"
                placeholder="Choose Category"
              />
            </div>

            <div class="space-y-1">
              <label
                for="description"
                class="text-sm text-gray-800 font-medium"
              >
                Description
              </label>
              <textarea
                v-model="formData.description"
                id="description"
                rows="3"
                class="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent resize-none"
              />
              <p v-if="errors?.description" class="text-xs text-red-600">
                {{ errors.description[0] }}
              </p>
            </div>

            <div class="space-y-1">
              <label
                for="description_en"
                class="text-sm text-gray-800 font-medium"
              >
                Description (English)
              </label>
              <textarea
                v-model="formData.full_description_en"
                id="description_en"
                rows="3"
                class="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent resize-none"
              />
              <p
                v-if="errors?.full_description_en"
                class="text-xs text-red-600"
              >
                {{ errors.full_description_en[0] }}
              </p>
            </div>
          </div>

          <!-- Section 2: Company Data & Banking -->
          <div class="bg-white/60 p-6 rounded-lg shadow-sm space-y-4">
            <h4 class="text-lg font-semibold text-gray-700 border-b pb-2">
              Company & Banking Information
            </h4>

            <div class="space-y-1">
              <label for="legal_name" class="text-sm text-gray-800 font-medium">
                Legal Name
              </label>
              <input
                type="text"
                v-model="formData.legal_name"
                id="legal_name"
                class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
              />
              <p v-if="errors?.legal_name" class="text-xs text-red-600">
                {{ errors.legal_name[0] }}
              </p>
            </div>

            <div class="space-y-1">
              <label
                for="contract_name"
                class="text-sm text-gray-800 font-medium"
              >
                Contract Name
              </label>
              <input
                type="text"
                v-model="formData.contract_name"
                id="contract_name"
                class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
              />
              <p v-if="errors?.contract_name" class="text-xs text-red-600">
                {{ errors.contract_name[0] }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-gray-800 font-medium">
                Email For Booking
              </label>
              <div class="flex gap-2">
                <input
                  type="email"
                  v-model="addEmail"
                  placeholder="Enter email address"
                  class="flex-1 h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-l-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
                <button
                  type="button"
                  @click="addEmailAction"
                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded-r-md hover:bg-blue-700 transition"
                >
                  + Add
                </button>
              </div>
              <div v-if="formData.email.length" class="space-y-2">
                <div
                  v-for="(email, index) in formData.email"
                  :key="index"
                  class="flex gap-2"
                >
                  <input
                    type="email"
                    v-model="formData.email[index]"
                    class="flex-1 h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-l-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                  />
                  <button
                    type="button"
                    @click="removeEmail(index)"
                    class="px-4 py-2 bg-red-600 text-white text-sm rounded-r-md hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-sm text-gray-800 font-medium"
                  >Bank Name</label
                >
                <v-select
                  v-model="formData.bank_name"
                  class="style-chooser"
                  :options="bankOptions"
                  label="name"
                  :clearable="false"
                  :reduce="(bank) => bank.name"
                  placeholder="Choose Bank"
                />
              </div>

              <div class="space-y-1">
                <label class="text-sm text-gray-800 font-medium">
                  Payment Method
                </label>
                <v-select
                  v-model="formData.payment_method"
                  class="style-chooser"
                  :options="paymentMethodOptions"
                  label="name"
                  :clearable="false"
                  :reduce="(payment) => payment.name"
                  placeholder="Choose Payment"
                />
              </div>

              <div class="space-y-1">
                <label
                  for="bank_account"
                  class="text-sm text-gray-800 font-medium"
                >
                  Bank Account Number
                </label>
                <input
                  v-model="formData.bank_account_number"
                  type="text"
                  id="bank_account"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
              </div>

              <div class="space-y-1">
                <label
                  for="account_name"
                  class="text-sm text-gray-800 font-medium"
                >
                  Account Holder Name
                </label>
                <input
                  v-model="formData.account_name"
                  type="text"
                  id="account_name"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="contracts" class="text-sm text-gray-800 font-medium">
                Contracts
              </label>
              <input
                type="file"
                multiple
                @change="contractFileChange"
                id="contracts"
                class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
              />
              <p v-if="errors?.contracts" class="text-xs text-red-600">
                {{ errors.contracts[0] }}
              </p>

              <!-- Existing Contracts -->
              <div v-if="linkContract.contacts?.length" class="space-y-2 mt-3">
                <p class="text-xs text-gray-600 font-medium">
                  Existing Contracts:
                </p>
                <div
                  v-for="(contract, index) in linkContract.contacts"
                  :key="contract.id"
                  class="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <a
                    :href="contract.file"
                    target="_blank"
                    class="text-sm text-blue-600 hover:text-blue-700 truncate flex-1"
                  >
                    Contract {{ index + 1 }}
                  </a>
                  <button
                    type="button"
                    @click="removeExistingContract(contract.id)"
                    class="ml-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: VAT Information -->
          <div class="bg-white/60 p-6 rounded-lg shadow-sm space-y-4">
            <h4 class="text-lg font-semibold text-gray-700 border-b pb-2">
              VAT Information
            </h4>

            <div class="space-y-1">
              <label class="text-sm text-gray-800 font-medium">
                VAT Inclusion
              </label>
              <v-select
                v-model="formData.vat_inclusion"
                class="style-chooser"
                :options="vatInclusionOptions"
                label="name"
                :clearable="false"
                :reduce="(h) => h.name"
                placeholder="Select VAT inclusion"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="vat_id" class="text-sm text-gray-800 font-medium">
                  VAT ID
                </label>
                <input
                  type="text"
                  v-model="formData.vat_id"
                  id="vat_id"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
              </div>

              <div class="space-y-1">
                <label for="vat_name" class="text-sm text-gray-800 font-medium">
                  VAT Name
                </label>
                <input
                  type="text"
                  v-model="formData.vat_name"
                  id="vat_name"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label
                for="vat_address"
                class="text-sm text-gray-800 font-medium"
              >
                VAT Address
              </label>
              <textarea
                v-model="formData.vat_address"
                id="vat_address"
                rows="2"
                class="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent resize-none"
              />
            </div>
          </div>

          <!-- Section 4: Location & Media -->
          <div class="bg-white/60 p-6 rounded-lg shadow-sm space-y-4">
            <h4 class="text-lg font-semibold text-gray-700 border-b pb-2">
              Location & Media Links
            </h4>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="latitude" class="text-sm text-gray-800 font-medium">
                  Latitude
                </label>
                <input
                  type="text"
                  v-model="formData.latitude"
                  id="latitude"
                  placeholder="13.7563"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
                <p v-if="errors?.latitude" class="text-xs text-red-600">
                  {{ errors.latitude[0] }}
                </p>
              </div>

              <div class="space-y-1">
                <label
                  for="longitude"
                  class="text-sm text-gray-800 font-medium"
                >
                  Longitude
                </label>
                <input
                  type="text"
                  v-model="formData.longitude"
                  id="longitude"
                  placeholder="100.5018"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
                <p v-if="errors?.longitude" class="text-xs text-red-600">
                  {{ errors.longitude[0] }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label
                  for="location_map"
                  class="text-sm text-gray-800 font-medium"
                >
                  Location Map
                </label>
                <input
                  type="text"
                  v-model="formData.location_map"
                  id="location_map"
                  placeholder="Google Maps embed URL"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
                <p v-if="errors?.location_map" class="text-xs text-red-600">
                  {{ errors.location_map[0] }}
                </p>
              </div>

              <div class="space-y-1">
                <label
                  for="location_title"
                  class="text-sm text-gray-800 font-medium"
                >
                  Location Map Title
                </label>
                <input
                  type="text"
                  v-model="formData.location_map_title"
                  id="location_title"
                  placeholder="Address"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label
                  for="youtube_mm"
                  class="text-sm text-gray-800 font-medium"
                >
                  YouTube Link (MM)
                </label>
                <input
                  type="text"
                  v-model="formData.youtube_link.mm_link"
                  id="youtube_mm"
                  placeholder="Video ID"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
              </div>

              <div class="space-y-1">
                <label
                  for="youtube_en"
                  class="text-sm text-gray-800 font-medium"
                >
                  YouTube Link (EN)
                </label>
                <input
                  type="text"
                  v-model="formData.youtube_link.en_link"
                  id="youtube_en"
                  placeholder="Video ID"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
              </div>

              <div class="space-y-1 col-span-2">
                <label
                  for="youtube_how"
                  class="text-sm text-gray-800 font-medium"
                >
                  YouTube Link (How to)
                </label>
                <input
                  type="text"
                  v-model="formData.youtube_link.how_link"
                  id="youtube_how"
                  placeholder="Video ID"
                  class="w-full h-10 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF613c] focus:border-transparent"
                />
              </div>
            </div>

            <!-- Map Preview -->
            <div
              v-if="formData.location_map && formData.location_map !== 'null'"
              class="space-y-1"
            >
              <label class="text-sm text-gray-800 font-medium">
                Location Map Preview
              </label>
              <iframe
                :src="formData.location_map"
                class="w-full h-[300px] rounded-lg border border-gray-300"
                style="border: 0"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <!-- Right Column - Images Section -->
        <div class="space-y-4">
          <div class="bg-white/60 p-6 rounded-lg shadow-sm">
            <h4 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
              Images
            </h4>

            <!-- Gallery Images -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-3">
                <p class="text-sm font-medium text-gray-800">Gallery Images</p>
                <button
                  type="button"
                  @click="openFileImagePicker"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  <PlusIcon class="w-5 h-5" />
                </button>
              </div>
              <input
                multiple
                type="file"
                ref="imagesInput"
                class="hidden"
                @change="handlerImagesFileChange"
                accept="image/*"
              />

              <!-- New Images Preview -->
              <div
                v-if="imagesPreview.length > 0"
                class="grid grid-cols-3 gap-2 mb-3"
              >
                <div
                  v-for="(image, index) in imagesPreview"
                  :key="`new-${index}`"
                  class="relative group"
                >
                  <img
                    class="h-[130px] w-full rounded object-cover"
                    :src="image"
                    alt=""
                  />
                  <button
                    type="button"
                    @click="removeImageSelectImage(index)"
                    class="absolute top-[-0.5rem] right-[-0.5rem] rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <XCircleIcon class="w-8 h-8" />
                  </button>
                </div>
              </div>

              <!-- Existing Images -->
              <div
                v-if="editData.images.length > 0"
                class="grid grid-cols-3 gap-2"
              >
                <div
                  v-for="image in editData.images"
                  :key="`existing-${image.id}`"
                  class="relative group"
                >
                  <img
                    class="h-[130px] w-full rounded object-cover"
                    :src="image.image"
                    alt=""
                  />
                  <button
                    type="button"
                    @click="removeExistingImage(image.id)"
                    class="absolute top-[-0.5rem] right-[-0.5rem] rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <XCircleIcon class="w-8 h-8" />
                  </button>
                </div>
              </div>

              <!-- Empty state or Add button -->
              <div
                v-if="
                  editData.images.length === 0 && imagesPreview.length === 0
                "
                class="grid grid-cols-3 gap-2"
              >
                <div
                  v-for="i in 3"
                  :key="i"
                  @click="openFileImagePicker"
                  class="cursor-pointer w-full h-[130px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center hover:border-[#FF613c] transition"
                >
                  <PlusIcon class="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>

            <!-- Feature Image -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <p class="text-sm font-medium text-gray-800">Feature Image</p>
                <button
                  v-if="featureImagePreview || editData.cover_image"
                  type="button"
                  @click="removeFeatureSelectImage"
                  class="text-sm text-red-600 hover:text-red-700"
                >
                  <XCircleIcon class="w-6 h-6" />
                </button>
              </div>
              <input
                type="file"
                ref="featureImageInput"
                class="hidden"
                @change="handlerFeatureFileChange"
                accept="image/*"
              />

              <!-- New feature image preview -->
              <div v-if="featureImagePreview" class="relative group">
                <img
                  class="h-auto w-full rounded"
                  :src="featureImagePreview"
                  alt=""
                />
              </div>

              <!-- Existing feature image -->
              <div
                v-else-if="editData.cover_image"
                @click="openFileFeaturePicker"
                class="relative group cursor-pointer"
              >
                <img
                  class="h-auto w-full rounded"
                  :src="editData.cover_image"
                  alt=""
                />
                <div
                  class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition flex items-center justify-center"
                >
                  <span
                    class="text-white opacity-0 group-hover:opacity-100 transition"
                    >Click to change</span
                  >
                </div>
              </div>

              <!-- Empty state -->
              <div
                v-else
                @click="openFileFeaturePicker"
                class="cursor-pointer w-full h-[200px] border-2 border-dashed border-gray-400 rounded flex justify-center items-center hover:border-[#FF613c] transition"
              >
                <PlusIcon class="w-12 h-12 text-gray-400" />
              </div>

              <p v-if="errors?.image" class="mt-2 text-xs text-red-600">
                {{ errors.image[0] }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end items-center gap-3 mt-6">
        <button
          type="button"
          @click="router.push('/products/6')"
          class="px-6 py-2 text-[#FF613c] border border-[#FF613c] rounded-md hover:bg-red-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="submitLoading"
          class="px-6 py-2 bg-[#FF613c] text-white rounded-md hover:bg-[#e5552f] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitLoading ? "Updating..." : "Update Attraction" }}
        </button>
      </div>
    </form>
    <div v-if="part == 1 && !loading">
      <EntranceGoodToKnow
        :id="formData.id"
        :type="'entrance'"
        :productData="formData"
      />
    </div>
    <div v-if="part == 2 && !loading">
      <EntranceKeyHighLight
        :id="formData.id"
        :type="'entrance'"
        :highlightData="formData"
      />
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import {
  PlusIcon,
  XCircleIcon,
  ListBulletIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
} from "@heroicons/vue/24/outline";
import { Switch } from "@headlessui/vue";

import Layout from "./Layout.vue";
import Button from "../components/Button.vue";

import { useEntranceStore } from "../stores/entrance";
import { useCityStore } from "../stores/city";
import { useProductStore } from "../stores/product";
import EntranceGoodToKnow from "./EntranceGoodToKnow.vue";
import EntranceKeyHighLight from "./EntranceKeyHighLight.vue";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const entranceStore = useEntranceStore();
const cityStore = useCityStore();
const productStore = useProductStore();

const { cities } = storeToRefs(cityStore);
const { products } = storeToRefs(productStore);

const attractionId = route.params.id;
const loading = ref(false);
const submitLoading = ref(false);
const errors = ref({});

const citylist = ref([]);
const categoryList = ref([]);
const part = ref(0);

const formData = ref({
  id: "",
  name: "",
  description: "",
  full_description_en: "",
  cover_image: "",
  city_id: [],
  category_id: [],
  vat_inclusion: "",
  images: [],
  payment_method: "",
  bank_name: "",
  bank_account_number: "",
  account_name: "",
  legal_name: "",
  latitude: "",
  longitude: "",
  vat_id: "",
  vat_name: "",
  vat_address: "",
  email: [],
  contract_name: "",
  location_map_title: "",
  location_map: "",
  youtube_link: {
    mm_link: "",
    en_link: "",
    how_link: "",
  },
  contracts: [],
  meta_data: {
    is_show: true,
  },
  good_to_knows: [],
  key_highlights: [],
  cities: [],
  categories: [],
  lowest_variation_price: "",
  lowest_walk_in_price: "",
});

const editData = ref({
  cover_image: "",
  images: [],
  city_id: [],
  category_id: [],
});

const linkContract = ref({});

const bankOptions = [
  { id: "1", name: "K +" },
  { id: "2", name: "SCB" },
  { id: "3", name: "Bangkok Bank" },
  { id: "4", name: "Other Bank" },
  { id: "5", name: "CIMB Bank" },
  { id: "6", name: "Krungsri" },
  { id: "7", name: "Krungthai Bank" },
  { id: "8", name: "Land and Houses Bank" },
  { id: "9", name: "Standard Chartered Bank (Thai)" },
  { id: "10", name: "TMBThanachart" },
  { id: "11", name: "UOB" },
  { id: "12", name: "Government Savings Bank" },
  { id: "13", name: "Kiatnakin Phatra Bank" },
  { id: "14", name: "Citibank" },
  { id: "15", name: "Government Housing Bank" },
  { id: "16", name: "Bank for Agriculture and Agricultural Cooperatives" },
  { id: "17", name: "MHCB" },
  { id: "18", name: "Islamic Bank of Thailand" },
  { id: "19", name: "ICBC Thai" },
  { id: "20", name: "Thai Credit" },
  { id: "21", name: "SMBC" },
  { id: "22", name: "HSBC" },
  { id: "23", name: "BNPP" },
  { id: "24", name: "DEUTSCHE BANK AG" },
  { id: "25", name: "Bank of China" },
  { id: "26", name: "Indian Overseas Bank" },
];

const paymentMethodOptions = [
  { id: "1", name: "Bank Transfer" },
  { id: "2", name: "International Remittance" },
  { id: "3", name: "Cash" },
  { id: "4", name: "Other ..." },
];

const vatInclusionOptions = [
  { id: 1, name: "Inclusive of VAT" },
  { id: 2, name: "No VAT" },
];

// Email Management
const addEmail = ref("");
const addEmailAction = () => {
  if (addEmail.value && !formData.value.email.includes(addEmail.value)) {
    formData.value.email.push(addEmail.value);
    addEmail.value = "";
  }
};
const removeEmail = (index) => {
  formData.value.email.splice(index, 1);
};

// Feature Image
const featureImageInput = ref(null);
const featureImagePreview = ref(null);
const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};
const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  if (selectedFile) {
    formData.value.cover_image = selectedFile;
    featureImagePreview.value = URL.createObjectURL(selectedFile);
  }
};
const removeFeatureSelectImage = () => {
  formData.value.cover_image = "";
  featureImagePreview.value = null;
  editData.value.cover_image = "";
};

// Gallery Images
const imagesInput = ref(null);
const imagesPreview = ref([]);
const openFileImagePicker = () => {
  imagesInput.value.click();
};
const handlerImagesFileChange = (e) => {
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.images.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};
const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

const removeExistingImage = async (imageId) => {
  try {
    await entranceStore.deleteEntranceImageAction(imageId);
    editData.value.images = editData.value.images.filter(
      (img) => img.id !== imageId,
    );
    toast.success("Image deleted successfully");
  } catch (error) {
    toast.error("Failed to delete image");
  }
};

// Contract Files
const contractFileChange = (e) => {
  let selectedFiles = e.target.files;
  if (selectedFiles) {
    for (let index = 0; index < selectedFiles.length; index++) {
      formData.value.contracts.push(selectedFiles[index]);
    }
  }
};

const removeExistingContract = async (contractId) => {
  try {
    await entranceStore.deleteContractAction(attractionId, contractId);
    linkContract.value.contacts = linkContract.value.contacts.filter(
      (c) => c.id !== contractId,
    );
    toast.success("Contract deleted successfully");
  } catch (error) {
    toast.error("Failed to delete contract");
  }
};

// Load Attraction Data
const loadAttractionData = async () => {
  loading.value = true;
  try {
    const response = await entranceStore.getDetailAction(attractionId);
    const data = response.result;
    console.log(data, "this is data");

    // Map cities and categories
    const cityIds = data.cities?.map((city) => city.id) || [];
    const categoryIds = data.categories?.map((category) => category.id) || [];

    formData.value = {
      id: data.id,
      name: data.name || "",
      description: data.description || "",
      full_description_en: data.full_description_en || "",
      account_name: data.account_name || "",
      payment_method: data.payment_method || "",
      bank_name: data.bank_name || "",
      bank_account_number: data.bank_account_number || "",
      legal_name: data.legal_name || "",
      latitude: data.latitude || "",
      longitude: data.longitude || "",
      vat_id: data.vat_id || "",
      vat_name: data.vat_name || "",
      vat_address: data.vat_address || "",
      contract_name: data.contract_name || "",
      location_map: data.location_map || "",
      location_map_title: data.location_map_title || "",
      vat_inclusion: data.vat_inclusion || "",
      city_id: cityIds,
      category_id: categoryIds,
      email: data.email || [],
      youtube_link: {
        mm_link: data.youtube_link?.[0]?.mm_link || "",
        en_link: data.youtube_link?.[0]?.en_link || "",
        how_link: data.youtube_link?.[0]?.how_link || "",
      },
      meta_data: {
        is_show: data.meta_data?.is_show == 1 ? true : false,
      },
      images: [],
      contracts: [],
      cover_image: "",
      good_to_knows: data.good_to_knows || [],
      key_highlights: data.key_highlights || [],
      cities: data.cities || [],
      categories: data.categories || [],
      lowest_variation_price: data.lowest_variation_price || "",
      lowest_walk_in_price: data.lowest_walk_in_price || "",
    };

    editData.value = {
      cover_image: data.cover_image || "",
      images: data.images || [],
      city_id: data.cities || [],
      category_id: data.categories || [],
    };

    linkContract.value = data;

    part.value = route.query.part || 0;
  } catch (error) {
    console.error("Error loading attraction:", error);
    toast.error(
      error.response?.data?.message || "Failed to load attraction details",
    );
    // router.push("/products/6");
  } finally {
    loading.value = false;
  }
};

// Submit Handler
const onSubmitHandler = async () => {
  submitLoading.value = true;
  const frmData = new FormData();

  frmData.append("name", formData.value.name);
  frmData.append("description", formData.value.description);
  frmData.append("full_description_en", formData.value.full_description_en);
  frmData.append("account_name", formData.value.account_name);
  frmData.append("payment_method", formData.value.payment_method);
  frmData.append("bank_name", formData.value.bank_name);
  frmData.append("bank_account_number", formData.value.bank_account_number);
  frmData.append("legal_name", formData.value.legal_name);
  frmData.append("latitude", formData.value.latitude);
  frmData.append("longitude", formData.value.longitude);
  frmData.append("vat_id", formData.value.vat_id);
  frmData.append("vat_name", formData.value.vat_name);
  frmData.append("vat_address", formData.value.vat_address);
  frmData.append("contract_name", formData.value.contract_name);

  if (formData.value.location_map) {
    frmData.append("location_map", formData.value.location_map);
  }
  if (formData.value.location_map_title) {
    frmData.append("location_map_title", formData.value.location_map_title);
  }

  // Email
  if (formData.value.email.length > 0) {
    formData.value.email.forEach((email, i) => {
      frmData.append(`email[${i}]`, email);
    });
  }

  // YouTube links
  frmData.append(
    "youtube_link[0][mm_link]",
    formData.value.youtube_link.mm_link || "",
  );
  frmData.append(
    "youtube_link[0][en_link]",
    formData.value.youtube_link.en_link || "",
  );
  frmData.append(
    "youtube_link[0][how_link]",
    formData.value.youtube_link.how_link || "",
  );

  // Meta data
  frmData.append(
    "meta_data[is_show]",
    formData.value.meta_data.is_show ? 1 : 0,
  );

  // Images
  if (formData.value.images.length > 0) {
    formData.value.images.forEach((file, i) => {
      frmData.append(`images[${i}]`, file);
    });
  }

  if (formData.value.cover_image) {
    frmData.append("cover_image", formData.value.cover_image);
  }

  // City IDs
  formData.value.city_id.forEach((id, i) => {
    frmData.append(`city_ids[${i}]`, id);
  });

  // Category IDs
  if (formData.value.category_id.length > 0) {
    formData.value.category_id.forEach((id, i) => {
      frmData.append(`category_ids[${i}]`, id);
    });
  }

  // VAT Inclusion
  if (formData.value.vat_inclusion) {
    frmData.append("vat_inclusion", formData.value.vat_inclusion);
  }

  // Contracts
  if (formData.value.contracts.length > 0) {
    formData.value.contracts.forEach((file, i) => {
      frmData.append(`contracts[${i}]`, file);
    });
  }

  frmData.append("_method", "PUT");

  try {
    const response = await entranceStore.updateAction(frmData, attractionId);
    toast.success(response.message);
    router.push("/products/6");
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    submitLoading.value = false;
  }
};

watch(part, () => {
  router.push({
    name: "entranceupdate",
    params: {
      id: route.params.id,
    },
    query: {
      part: part.value,
    },
  });
});

onMounted(async () => {
  await cityStore.getSimpleListAction();
  await productStore.getSimpleListAction();
  citylist.value = cities.value.data;
  categoryList.value = products.value.data;

  await loadAttractionData();
});
</script>

<style>
.style-chooser .vs__dropdown-toggle {
  border: 1px solid #d1d5db;
  padding: 10px 5px;
  border-radius: 8px;
}

.style-chooser .vs__dropdown-menu .vs__dropdown-option--highlight {
  background: #2563eb;
}

.style-chooser .vs__dropdown-menu .vs__dropdown-option {
  padding: 10px 18px;
}

.style-chooser .vs__dropdown-toggle .vs__selected-options .vs__selected {
  padding: 4px 10px;
  border: none;
}
</style>
