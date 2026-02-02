<template>
  <Layout>
    <button
      @click="router.push('/attraction-v2')"
      class="p-3 mb-5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50"
    >
      <ChevronLeftIcon class="w-5 h-5 text-gray-700" />
    </button>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mr-4"
      >
        <span class="sr-only">Loading...</span>
      </div>
      <span class="text-gray-600">Loading attraction data...</span>
    </div>

    <div v-else class="h-auto col-span-2 bg-white">
      <div class="h-auto pb-4">
        <div class="py-2 px-6">
          <div class="flex gap-6 items-center mt-5">
            <h3 class="text-xl font-bold text-gray-800">
              {{ formData.name }}
            </h3>
          </div>

          <div class="flex justify-start items-center gap-2 mt-6">
            <p
              class="px-4 py-2 cursor-pointer text-sm rounded-lg transition-all duration-200"
              @click="activeTab = 1"
              :class="
                activeTab == 1
                  ? 'bg-white text-[#ff613c] shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              General
            </p>
            <p
              class="px-4 py-2 cursor-pointer text-sm rounded-lg transition-all duration-200"
              @click="activeTab = 2"
              :class="
                activeTab == 2
                  ? 'bg-white text-[#ff613c] shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              Attraction Info & Details
            </p>
            <p
              class="px-4 py-2 cursor-pointer text-sm rounded-lg transition-all duration-200"
              @click="activeTab = 3"
              :class="
                activeTab == 3
                  ? 'bg-white text-[#ff613c] shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              Location & Media
            </p>
            <p
              class="px-4 py-2 cursor-pointer text-sm rounded-lg transition-all duration-200"
              @click="activeTab = 4"
              :class="
                activeTab == 4
                  ? 'bg-white text-[#ff613c] shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              Good to Know
            </p>
            <p
              class="px-4 py-2 cursor-pointer text-sm rounded-lg transition-all duration-200"
              @click="activeTab = 5"
              :class="
                activeTab == 5
                  ? 'bg-white text-[#ff613c] shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              "
            >
              Key Highlights
            </p>
          </div>
        </div>

        <div v-if="activeTab == 1">
          <form @submit.prevent="onSubmitHandler" class="bg-white rounded-xl p-6 relative">
            <button
              type="submit"
              :disabled="submitLoading"
              class="absolute -top-20 right-6 text-xs p-1.5 px-4 font-medium text-white bg-[#ff613c] border border-transparent rounded-lg shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div class="flex gap-1">
                <span>{{ submitLoading ? 'Updating...' : 'Update' }}</span>
              </div>
            </button>
            
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-8">
                <div class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30">
                  <h4 class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200">
                    General Information
                  </h4>
                  
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <label for="name" class="text-sm font-medium text-gray-700">
                        Attraction Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        v-model="formData.name"
                        id="name"
                        class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                        :class="validationErrors?.name || errors?.name ? 'border-2 border-red-500' : ''"
                      />
                      <p v-if="validationErrors?.name || errors?.name" class="mt-1 text-sm text-red-500">
                        {{ validationErrors.name || errors.name[0] }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label for="legal_name" class="text-sm font-medium text-gray-700">
                        Legal Name
                      </label>
                      <input
                        type="text"
                        v-model="formData.legal_name"
                        id="legal_name"
                        class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                      />
                      <p v-if="errors?.legal_name" class="mt-1 text-sm text-red-500">
                        {{ errors.legal_name[0] }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">
                        Show on Website
                      </label>
                      <div class="flex items-center gap-3 pt-1">
                        <Switch
                          v-model="formData.meta_data.is_show"
                          :class="formData.meta_data.is_show ? 'bg-orange-600' : 'bg-gray-400'"
                          class="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                        >
                          <span class="sr-only">Show on website</span>
                          <span
                            aria-hidden="true"
                            :class="formData.meta_data.is_show ? 'translate-x-7' : 'translate-x-0'"
                            class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                          />
                        </Switch>
                        <span class="text-sm text-gray-600">
                          {{ formData.meta_data.is_show ? "Visible on website" : "Hidden from website" }}
                        </span>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label for="city" class="text-sm font-medium text-gray-700">
                        Cities
                      </label>
                      <v-select
                        v-model="formData.city_id"
                        class="style-chooser bg-gray-100 border-0"
                        :options="citylist ?? []"
                        label="name"
                        multiple
                        :clearable="false"
                        :reduce="(city) => city.id"
                        placeholder="Choose City"
                      />
                      <p v-if="validationErrors?.city_id || errors?.city_id" class="mt-1 text-sm text-red-500">
                        {{ validationErrors.city_id || errors.city_id[0] }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label for="category" class="text-sm font-medium text-gray-700">
                        Categories
                      </label>
                      <v-select
                        v-model="formData.category_id"
                        class="style-chooser bg-gray-100 border-0"
                        :options="categoryList ?? []"
                        label="name"
                        multiple
                        :clearable="false"
                        :reduce="(d) => d.id"
                        placeholder="Choose Category"
                      />
                      <p v-if="errors?.category_id" class="mt-1 text-sm text-red-500">
                        {{ errors.category_id[0] }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30">
                  <div class="flex justify-between items-center mb-6 pb-3 border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800">
                      Contracts
                    </h4>
                    <input
                      type="file"
                      ref="contractInput"
                      multiple
                      @change="handleContractFileChange"
                      class="hidden"
                    />
                    <button
                      type="button"
                      @click="openContractFilePicker"
                      class="h-8 px-3 font-medium rounded-md shadow-sm text-[11px] transition-colors flex items-center gap-1"
                      :class="[
                        validationErrors?.contracts || errors?.contracts
                          ? 'border-2 border-red-500 bg-white text-red-600 hover:bg-red-50'
                          : 'bg-[#ff613c] text-white hover:bg-[#e05530]',
                      ]"
                    >
                      <PlusCircleIcon class="w-4 h-4" />
                      <p v-if="validationErrors?.contracts || errors?.contracts">
                        Files needed
                      </p>
                      <p v-else>Add files</p>
                    </button>
                  </div>
                  
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <label for="contract_name" class="text-sm font-medium text-gray-700">
                        Contract Name
                      </label>
                      <input
                        type="text"
                        v-model="formData.contract_name"
                        id="contract_name"
                        class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                      />
                      <p v-if="errors?.contract_name" class="mt-1 text-sm text-red-500">
                        {{ errors.contract_name[0] }}
                      </p>
                    </div>
                    
                  <!-- <div class="flex justify-between items-center">
                    <div class="mb-2 space-y-1">
                      <label for="name" class="text-sm text-gray-800"
                        >Contract Due Date</label
                      >
                      <input
                        v-model="formData.contract_due"
                        type="date"
                        class="w-full h-10 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <div class="mb-2 space-y-1">
                      <label for="name" class="text-sm text-gray-800"
                        >Data Checked</label
                      >
                      <div class="text-end">
                        <input
                          type="checkbox"
                          v-model="formData.data_checked"
                          class="w-8 h-8 px-4 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-300"
                        />
                      </div>
                    </div>
                  </div> -->

                    <div v-if="existingContracts.length > 0" class="space-y-3">
                      <p class="text-sm font-medium text-gray-700">
                        Existing Contracts:
                      </p>
                      <div
                        v-for="(contract, index) in existingContracts"
                        :key="contract.id"
                        class="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200"
                      >
                        <!-- <DocumentIcon class="w-5 h-5 text-gray-500" /> -->
                        <div class="flex-1 text-sm text-gray-700 truncate">
                          <div class="font-medium">
                                  <a
                          :href="contract.file"
                          target="_blank"
                          class="flex-1 text-sm hover:underline px-3 py-2 rounded truncate"
                        >
                        contract link {{ index + 1 }}
                        </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          @click.prevent="removeExistingContract(contract.id)"
                          class="h-8 w-8 flex items-center justify-center bg-[#ff613c] text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors"
                        >
                          <TrashIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                      <div
                        v-if="validationErrors?.contracts"
                        class="text-sm text-red-500 bg-red-50 px-3 py-2 rounded"
                      >
                        {{ validationErrors.contracts }}
                      </div>

                    <div v-if="formData.contract_files_preview.length > 0" class="space-y-3">
                      <p class="text-sm font-medium text-gray-700">
                        New Contract Files:
                      </p>
                      <div
                        v-for="(contract, index) in formData.contract_files_preview"
                        :key="index"
                        class="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200"
                      >
                        <!-- <DocumentIcon class="w-5 h-5 text-gray-500" /> -->
                        <div class="flex-1 text-sm text-gray-700 truncate">
                          <div class="font-medium">{{ contract.name }}</div>
                          <div class="text-xs text-gray-500">
                            {{ contract.size }} • {{ contract.type }}
                          </div>
                        </div>
                        <button
                          type="button"
                          @click.prevent="removeContractFile(index)"
                          class="h-8 w-8 flex items-center justify-center bg-[#ff613c] text-white text-sm font-medium rounded-md hover:bg-[#e05530] transition-colors"
                        >
                          <TrashIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p class="text-xs text-gray-500">
                      You can upload multiple contract files (PDF, DOC, DOCX, TXT, XLS, XLSX)
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-8">
                <div class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30">
                  <h4 class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200">
                    Payment Detail
                  </h4>
                  
                  <div class="space-y-5">
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">
                        VAT Inclusion
                      </label>
                      <v-select
                        v-model="formData.vat_inclusion"
                        class="style-chooser bg-gray-100 border-0"
                        :options="vatInclusionOptions"
                        label="name"
                        :clearable="false"
                        :reduce="(h) => h.name"
                        placeholder="Select VAT inclusion"
                      />
                      <p v-if="validationErrors?.vat_inclusion || errors?.vat_inclusion" class="mt-1 text-sm text-red-500">
                        {{ validationErrors.vat_inclusion || errors.vat_inclusion[0] }}
                      </p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="vat_id" class="text-sm font-medium text-gray-700">
                          VAT ID
                        </label>
                        <input
                          type="text"
                          v-model="formData.vat_id"
                          id="vat_id"
                          class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                        />
                      </div>

                      <div class="space-y-2">
                        <label for="vat_name" class="text-sm font-medium text-gray-700">
                          VAT Name
                        </label>
                        <input
                          type="text"
                          v-model="formData.vat_name"
                          id="vat_name"
                          class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label for="vat_address" class="text-sm font-medium text-gray-700">
                        VAT Address
                      </label>
                      <textarea
                        v-model="formData.vat_address"
                        id="vat_address"
                        rows="2"
                        class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white resize-none transition"
                      />
                    </div>

                    <div class="space-y-2">
                      <label for="bank_account_name" class="text-sm font-medium text-gray-700">
                        Bank Account Holder Name
                      </label>
                      <input
                        v-model="formData.account_name"
                        type="text"
                        id="bank_account_name"
                        class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                      />
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">
                        Bank Name
                      </label>
                      <v-select
                        v-model="formData.bank_name"
                        class="style-chooser bg-gray-100 border-0"
                        :options="bankOptions"
                        label="name"
                        :clearable="false"
                        :reduce="(bank) => bank.name"
                        placeholder="Choose Bank"
                      />
                    </div>

                    <div class="space-y-2">
                      <label for="bank_account_number" class="text-sm font-medium text-gray-700">
                        Bank Account Number
                      </label>
                      <input
                        v-model="formData.bank_account_number"
                        type="text"
                        id="bank_account_number"
                        class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                      />
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">
                        Payment Method
                      </label>
                      <v-select
                        v-model="formData.payment_method"
                        class="style-chooser bg-gray-100 border-0"
                        :options="paymentMethodOptions"
                        label="name"
                        :clearable="false"
                        :reduce="(payment) => payment.name"
                        placeholder="Choose Payment Method"
                      />
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">
                        Emails for Booking
                      </label>
                      <div class="space-y-2">
                        <div class="flex gap-2">
                          <input
                            type="email"
                            v-model="addEmail"
                            placeholder="Add email address"
                            class="flex-1 h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                          />
                          <div class="h-10 w-10 flex items-center justify-center">
                            <button
                              type="button"
                              @click="addEmailAction"
                              class="p-1 bg-blue-500 text-white text-sm font-medium rounded-full transition-colors"
                            >
                              <PlusIcon class="w-5 h-5" />
                            </button>
                          </div>
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
                              class="flex-1 h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                            />
                            <button
                              type="button"
                              @click="removeEmail(index)"
                              class="h-10 w-10 flex items-center justify-center p-1 bg-[#ff613c] text-white rounded-md hover:bg-[#e05530] transition-colors"
                            >
                              <TrashIcon class="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div v-if="activeTab == 2">
          <form @submit.prevent="onSubmitHandler" class="bg-white rounded-xl p-6 relative">
            <button
              type="submit"
              :disabled="submitLoading"
              class="absolute -top-20 right-6 text-xs p-1.5 px-4 font-medium text-white bg-[#ff613c] border border-transparent rounded-lg shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div class="flex gap-1">
                <span>{{ submitLoading ? 'Updating...' : 'Update' }}</span>
              </div>
            </button>
            
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-8">
                <div class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30">
                  <h4 class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200">
                    Description (Myanmar)
                  </h4>
                  <div class="space-y-2">
                    <div class="ql-container">
                      <QuillEditor
                        v-model:content="formData.description"
                        :options="editorOptions"
                        content-type="html"
                        theme="snow"
                        class="h-64"
                      />
                    </div>
                    <p v-if="errors?.description" class="mt-1 text-sm text-red-500">
                      {{ errors.description[0] }}
                    </p>
                  </div>
                </div>

                <div class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30">
                  <h4 class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200">
                    Feature Image
                  </h4>
                  <div class="space-y-4">
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">
                        Current Feature Image
                      </label>
                      <input
                        type="file"
                        ref="featureImageInput"
                        class="hidden"
                        @change="handlerFeatureFileChange"
                        accept="image/*"
                      />
                      
                      <div
                        v-if="!featureImagePreview && !editData.cover_image"
                        @click="openFileFeaturePicker"
                        class="cursor-pointer w-full h-[300px] border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center hover:border-[#ff613c] transition-colors bg-gray-100"
                      >
                        <PhotoIcon class="w-12 h-12 text-gray-400 mb-3" />
                        <p class="text-sm font-medium text-gray-700">Click to upload feature image</p>
                        <p class="text-xs text-gray-500 mt-1">Recommended size: 1200x800px</p>
                      </div>

                      <div v-else class="space-y-4">
                        <div class="relative group">
                          <img
                            class="w-full h-[300px] object-cover rounded-lg shadow-md"
                            :src="featureImagePreview || editData.cover_image"
                            alt="Feature image preview"
                          />
                          <button
                            type="button"
                            @click="removeFeatureSelectImage"
                            class="absolute top-2 right-2 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors"
                          >
                            <XMarkIcon class="w-5 h-5" />
                          </button>
                        </div>
                        <!-- <button
                          type="button"
                          @click="openFileFeaturePicker"
                          class="px-4 py-2 bg-[#ff613c] text-white text-sm font-medium rounded-lg hover:bg-[#e05530] transition-colors"
                        >
                          Change Feature Image
                        </button> -->
                      </div>
                    </div>
                    <p v-if="errors?.image" class="text-sm text-red-500">
                      {{ errors.image[0] }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-8">
                <div class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30">
                  <h4 class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200">
                    Description (English)
                  </h4>
                  <div class="space-y-2">
                    <div class="ql-container">
                      <QuillEditor
                        v-model:content="formData.full_description_en"
                        :options="editorOptions"
                        content-type="html"
                        theme="snow"
                        class="h-64"
                      />
                    </div>
                    <p v-if="errors?.full_description_en" class="mt-1 text-sm text-red-500">
                      {{ errors.full_description_en[0] }}
                    </p>
                  </div>
                </div>

                <div class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30">
                  <h4 class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200">
                    Gallery Images
                  </h4>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-700">Gallery Images</label>
                        <p class="text-xs text-gray-500">Upload multiple images for attraction gallery</p>
                      </div>
                      <!-- <button
                        type="button"
                        @click="openImageGallery"
                        class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <EyeIcon class="w-5 h-5" />
                        View All Images
                      </button> -->
                    </div>
                    
                    <input
                      multiple
                      type="file"
                      ref="imagesInput"
                      class="hidden"
                      @change="handlerImagesFileChange"
                      accept="image/*"
                    />

                    <div class="grid grid-cols-3 gap-2">
                      <div class="col-span-1">
                        <div
                          @click.prevent="openFileImagePicker"
                          class="cursor-pointer h-[200px] border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center hover:border-[#ff613c] transition-colors bg-gray-100"
                        >
                          <span class="text-gray-400">
                            <PhotoIcon class="w-8 h-8 mx-auto mb-2 text-[#ff613c]" />
                            <span class="text-xs block text-center"
                              >Click to upload image</span
                            >
                          </span>
                        </div>
                      </div>

                      <div class="col-span-2">
                        <div class="grid grid-cols-2 gap-2 h-full">
                          <template v-if="allImages.length > 0">
                            <div class="relative group row-span-2">
                              <template v-if="allImages[0]">
                                <img
                                  :src="typeof allImages[0] === 'string' ? allImages[0] : allImages[0].image"
                                  alt="Gallery image"
                                  class="w-full h-[200px] object-cover rounded-md"
                                />
                                <button
                                  @click.prevent="removeImageSelectImage(0)"
                                  class="absolute top-2 right-2 bg-[#ff613c] text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                  <XMarkIcon class="w-4 h-4" />
                                </button>
                              </template>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                              <template v-for="index in 4">
                                <div
                                  v-if="allImages[index]"
                                  :key="`image-${index}`"
                                  class="relative group"
                                >
                                  <img
                                    :src="typeof allImages[index] === 'string' ? allImages[index] : allImages[index].image"
                                    alt="Gallery image"
                                    class="w-full h-[94px] object-cover rounded-md"
                                  />
                                  <button
                                    @click.prevent="removeImageSelectImage(index)"
                                    class="absolute top-1 right-1 bg-[#ff613c] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                  >
                                    <XMarkIcon class="w-3 h-3" />
                                  </button>
                                  <div
                                    v-if="index === 4 && getRemainingImageCount() > 0"
                                    class="absolute inset-0 bg-black/40 rounded-md flex flex-col items-center justify-center cursor-pointer"
                                    @click="openImageGallery"
                                  >
                                    <span class="text-white font-bold text-lg">+{{ getRemainingImageCount() }}</span>
                                    <span class="text-white text-xs">More</span>
                                  </div>
                                </div>
                                <div
                                  v-else
                                  :key="`empty-${index}`"
                                  class="w-full h-[94px] bg-gray-100 rounded-md flex items-center justify-center"
                                >
                                  <span class="text-xs text-gray-400">No image</span>
                                </div>
                              </template>
                            </div>
                          </template>

                          <template v-else>
                            <div
                              class="row-span-2 bg-gray-100 rounded-md flex items-center justify-center"
                            >
                              <span class="text-gray-400 text-sm">No images</span>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                              <div
                                v-for="i in 4"
                                :key="i"
                                class="bg-gray-100 rounded-md h-[94px] flex items-center justify-center"
                              >
                                <span class="text-xs text-gray-400">No image</span>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>

                    <div class="pt-4 flex justify-between items-center">
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          @click.prevent="openFileImagePicker"
                          class="h-8 px-3 bg-[#ff613c] text-white text-xs font-medium rounded-md hover:bg-[#e05530] transition-colors flex items-center gap-1"
                        >
                          <PlusCircleIcon class="w-4 h-4" />
                          Add Images
                        </button>
                        <button
                          type="button"
                          @click="openImageGallery"
                          class="h-8 px-3 bg-white text-gray-700 text-xs font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-1"
                        >
                          <EyeIcon class="w-4 h-4" />
                          View All Images
                        </button>
                      </div>
                      <p class="text-sm text-gray-600">
                        Total {{ allImages.length }} images
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div v-if="activeTab == 3">
          <form @submit.prevent="onSubmitHandler" class="bg-white rounded-xl p-6 relative">
            <button
              type="submit"
              :disabled="submitLoading"
              class="absolute -top-20 right-6 text-xs p-1.5 px-4 font-medium text-white bg-[#ff613c] border border-transparent rounded-lg shadow-sm hover:bg-[#e05530] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff613c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div class="flex gap-1">
                <span>{{ submitLoading ? 'Updating...' : 'Update' }}</span>
              </div>
            </button>
            
            <div class="grid grid-cols-2 gap-8">
              <!-- Left Column - Location Details -->
              <div class="space-y-8">
                <div class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30">
                  <h4 class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200">
                    Location Details
                  </h4>
                  
                  <div class="space-y-5">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="latitude" class="text-sm font-medium text-gray-700">
                          Latitude
                        </label>
                        <input
                          type="text"
                          v-model="formData.latitude"
                          id="latitude"
                          placeholder="13.7563"
                          class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                        />
                        <p v-if="errors?.latitude" class="mt-1 text-sm text-red-500">
                          {{ errors.latitude[0] }}
                        </p>
                      </div>

                      <div class="space-y-2">
                        <label for="longitude" class="text-sm font-medium text-gray-700">
                          Longitude
                        </label>
                        <input
                          type="text"
                          v-model="formData.longitude"
                          id="longitude"
                          placeholder="100.5018"
                          class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                        />
                        <p v-if="errors?.longitude" class="mt-1 text-sm text-red-500">
                          {{ errors.longitude[0] }}
                        </p>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4">
                      <div class="space-y-2">
                        <label for="location_map" class="text-sm font-medium text-gray-700">
                          Location Map
                        </label>
                        <input
                          type="text"
                          v-model="formData.location_map"
                          id="location_map"
                          placeholder="Google Maps embed URL"
                          class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                        />
                        <p v-if="errors?.location_map" class="mt-1 text-sm text-red-500">
                          {{ errors.location_map[0] }}
                        </p>
                      </div>

                      <div class="space-y-2">
                        <label for="location_title" class="text-sm font-medium text-gray-700">
                          Location Map Title
                        </label>
                        <input
                          type="text"
                          v-model="formData.location_map_title"
                          id="location_title"
                          placeholder="Address"
                          class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div v-if="formData.location_map && formData.location_map !== 'null'" class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">Map Preview</label>
                      <div class="border border-gray-300 rounded-lg overflow-hidden">
                        <iframe
                          :src="formData.location_map"
                          class="w-full h-48 border-0"
                          allowfullscreen=""
                          loading="lazy"
                          referrerpolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-8">
                <div class="border border-gray-200 rounded-lg py-6 px-4 shadow-sm bg-gray-50/30">
                  <h4 class="text-lg font-semibold text-gray-800 mb-6 pb-3 border-gray-200">
                    Media Links
                  </h4>
                  
                  <div class="space-y-5">
                    <div class="grid grid-cols-1 gap-4">
                      <div class="space-y-2">
                        <label for="youtube_mm" class="text-sm font-medium text-gray-700">
                          YouTube Link (MM)
                        </label>
                        <input
                          type="text"
                          v-model="formData.youtube_link.mm_link"
                          id="youtube_mm"
                          placeholder="Video ID"
                          class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                        />
                      </div>

                      <div class="space-y-2">
                        <label for="youtube_en" class="text-sm font-medium text-gray-700">
                          YouTube Link (EN)
                        </label>
                        <input
                          type="text"
                          v-model="formData.youtube_link.en_link"
                          id="youtube_en"
                          placeholder="Video ID"
                          class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label for="youtube_how" class="text-sm font-medium text-gray-700">
                        YouTube Link (How to)
                      </label>
                      <input
                        type="text"
                        v-model="formData.youtube_link.how_link"
                        id="youtube_how"
                        placeholder="Video ID"
                        class="w-full h-10 px-4 py-2 text-sm text-gray-900 bg-gray-100 border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff613c] focus:bg-white transition"
                      />
                    </div>

                    <div class="p-3 bg-blue-50 rounded-md">
                      <p class="text-xs text-blue-700">
                        <span class="font-medium">Note:</span> Use only the video ID from YouTube URL.
                        Example: from https://www.youtube.com/watch?v=<span class="font-semibold">8E7X00VVApo</span>,
                        use <span class="font-semibold">8E7X00VVApo</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div v-if="activeTab == 4" class="bg-white rounded-xl p-6">
          <EntranceGoodToKnow
            :id="formData.id"
            :type="'entrance'"
            :productData="formData"
          />
        </div>

        <div v-if="activeTab == 5" class="bg-white rounded-xl p-6">
          <EntranceKeyHighLight
            :id="formData.id"
            :type="'entrance'"
            :highlightData="formData"
          />
        </div>
      </div>
    </div>

    <Dialog
      :open="imageGalleryModal"
      @close="closeImageGallery"
      class="relative z-50"
    >
      <div class="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div class="bg-white border-b border-gray-200 px-8 py-6">
              <div class="flex items-center justify-between">
                <DialogTitle class="text-2xl font-bold text-gray-800">
                  Attraction Images Gallery
                </DialogTitle>
                <button
                  @click="closeImageGallery"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </div>
              <p class="text-gray-600 mt-2">
                Manage your attraction images. You can upload new images or delete existing ones.
              </p>
            </div>

            <div class="p-8">
              <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                  All Gallery Images ({{ allImages.length }} total)
                </h3>
                
                <div v-if="allImages.length === 0" class="text-center py-12">
                  <PhotoIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p class="text-gray-600">No gallery images uploaded yet</p>
                </div>
                
                <div v-else class="grid grid-cols-3 gap-4">
                  <div
                    v-for="(image, index) in allImages"
                    :key="index"
                    class="relative group"
                  >
                    <div class="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        :src="typeof image === 'string' ? image : image.image"
                        :alt="`Gallery image ${index + 1}`"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <button
                      @click="removeImageSelectImage(index)"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <XMarkIcon class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div class="">
                    <input
                      type="file"
                      ref="galleryUploadInput"
                      multiple
                      @change="handleGalleryImageChange"
                      class="hidden"
                      accept="image/*"
                    />
                    <div
                      @click="galleryUploadInput?.click()"
                      class="w-full border-2 border-dashed border-gray-400 rounded-xl p-8 hover:border-[#ff613c] transition-colors bg-gray-50 flex flex-col items-center justify-center cursor-pointer"
                    >
                      <PlusCircleIcon class="w-12 h-12 text-[#ff613c] mb-4" />
                      <p class="text-lg font-medium text-gray-700 mb-2">
                        Upload More Images
                      </p>
                      <p class="text-sm text-gray-500 mb-1">
                        Click here or drag to add more images
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import {
  PlusIcon,
  ChevronLeftIcon,
  PhotoIcon,
  EyeIcon,
  XMarkIcon,
  PlusCircleIcon,
  TrashIcon,
  DocumentIcon,
} from "@heroicons/vue/24/outline";
import { Switch } from "@headlessui/vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import Layout from "./Layout.vue";
import EntranceGoodToKnow from "./EntranceGoodToKnow.vue";
import EntranceKeyHighLight from "./EntranceKeyHighLight.vue";

import { useEntranceStore } from "../stores/entrance";
import { useCityStore } from "../stores/city";
import { useProductStore } from "../stores/product";

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
const activeTab = ref(1);
const errors = ref({});
const validationErrors = ref({});

const editorOptions = {
  placeholder: "Enter description here...",
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  }
};

const citylist = ref([]);
const categoryList = ref([]);

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
  feature_image: "",
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
  contract_files_preview: [],
  meta_data: {
    is_show: true,
  },
  good_to_knows: [],
  key_highlights: [],
  cities: [],
  categories: [],
});

const editData = ref({
  cover_image: "",
  images: [],
  city_id: [],
  category_id: [],
});

const existingContracts = ref([]);

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
  if (addEmail.value && addEmail.value.trim() !== "") {
    formData.value.email.push(addEmail.value.trim());
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
  formData.value.cover_image = null;
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
const removeImageSelectImage = async (index) => {
  if (typeof allImages.value[index] !== 'string') {
    try {
      await entranceStore.deleteEntranceImageAction(allImages.value[index].id);
      editData.value.images = editData.value.images.filter(
        img => img.id !== allImages.value[index].id
      );
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  } else {
    const newImageIndex = imagesPreview.value.indexOf(allImages.value[index]);
    if (newImageIndex !== -1) {
      formData.value.images.splice(newImageIndex, 1);
      imagesPreview.value.splice(newImageIndex, 1);
    }
  }
};

const allImages = computed(() => {
  const existing = editData.value.images || [];
  return [...existing, ...imagesPreview.value];
});

const imageGalleryModal = ref(false);
const galleryUploadInput = ref(null);
const openImageGallery = () => {
  imageGalleryModal.value = true;
};
const closeImageGallery = () => {
  imageGalleryModal.value = false;
};
const handleGalleryImageChange = (e) => {
  let selectedFiles = e.target.files;
  if (selectedFiles) {
    for (let index = 0; index < selectedFiles.length; index++) {
      formData.value.images.push(selectedFiles[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFiles[index]));
    }
  }
};

const getRemainingImageCount = () => {
  const totalImages = allImages.value.length;
  return Math.max(0, totalImages - 5);
};

// Contract Files
const contractInput = ref(null);
const openContractFilePicker = () => {
  contractInput.value.click();
};
const handleContractFileChange = (e) => {
  let selectedFiles = e.target.files;
  if (selectedFiles && selectedFiles.length > 0) {
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      formData.value.contracts.push(file);

      const preview = {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type,
        url: URL.createObjectURL(file),
        file: file,
      };
      formData.value.contract_files_preview.push(preview);
    }
  }
  //   if (formData.value.contracts.length > 0) {
  //   delete validationErrors.value.contracts;
  // }
};
const removeContractFile = (index) => {
  if (formData.value.contracts[index]) {
    if (formData.value.contract_files_preview[index]?.url) {
      URL.revokeObjectURL(formData.value.contract_files_preview[index].url);
    }
    formData.value.contracts.splice(index, 1);
    formData.value.contract_files_preview.splice(index, 1);
  }
};

const removeExistingContract = async (contractId) => {
  try {
    await entranceStore.deleteContractAction(attractionId, contractId);
    existingContracts.value = existingContracts.value.filter(
      c => c.id !== contractId
    );
    toast.success("Contract deleted successfully");
  } catch (error) {
    toast.error("Failed to delete contract");
  }
};


const validateForm = () => {
  validationErrors.value = {};

  if (!formData.value.name || formData.value.name.trim() === "") {
    validationErrors.value.name = "Attraction name is required";
  }

  if (!formData.value.city_id || formData.value.city_id.length === 0) {
    validationErrors.value.city_id = "City is required";
  }

  if (!formData.value.vat_inclusion || formData.value.vat_inclusion.trim() === "") {
    validationErrors.value.vat_inclusion = "Vat inclusion is required";
  }

  // if (!formData.value.contracts || formData.value.contracts.length === 0) {
  //   validationErrors.value.contracts = "At least one contract file is required";
  // }

  return Object.keys(validationErrors.value).length === 0;
};

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};


const loadAttractionData = async () => {
  loading.value = true;
  try {
    const response = await entranceStore.getDetailAction(attractionId);
    const data = response.result;

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
      contract_files_preview: [],
      cover_image: "",
      good_to_knows: data.good_to_knows || [],
      key_highlights: data.key_highlights || [],
      cities: data.cities || [],
      categories: data.categories || [],
    };

    editData.value = {
      cover_image: data.cover_image || "",
      images: data.images || [],
      city_id: data.cities || [],
      category_id: data.categories || [],
    };

    existingContracts.value = data.contacts || [];

    if (route.query.tab) {
      activeTab.value = parseInt(route.query.tab);
    }
  } catch (error) {
    console.error("Error loading attraction:", error);
    toast.error(
      error.response?.data?.message || "Failed to load attraction details",
    );
    router.push("/products/6");
  } finally {
    loading.value = false;
  }
};


const onSubmitHandler = async () => {
  if (!validateForm()) {
    toast.error("Please fill in all required fields", {
      maxToasts: 1,
    });
    const firstErrorElement = document.querySelector(".border-red-500");
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

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

  // Gallery Images
  if (formData.value.images.length > 0) {
    formData.value.images.forEach((file, i) => {
      frmData.append(`images[${i}]`, file);
    });
  }

  // Feature Image
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
    imagesPreview.value = [];
    featureImagePreview.value = null;
    await loadAttractionData();
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    submitLoading.value = false;
  }
};


watch(activeTab, (newTab) => {
  router.replace({
    query: { ...route.query, tab: newTab }
  });
});

onMounted(async () => {
  await cityStore.getSimpleListAction();
  await productStore.getSimpleListAction();
  citylist.value = cities.value.data;
  categoryList.value = products.value.data;

  if (route.query.tab) {
    activeTab.value = parseInt(route.query.tab);
  }

  await loadAttractionData();
});
</script>

<style scoped>
.style-chooser {
  @apply text-sm border-none;
}

.style-chooser .vs__dropdown-toggle {
  @apply bg-gray-100 border-none rounded-md h-10 min-h-10;
}

.style-chooser .vs__selected {
  @apply text-sm bg-transparent;
}

.style-chooser .vs__search {
  @apply text-sm bg-transparent;
}

.style-chooser .vs__dropdown-menu {
  @apply text-sm;
}

.bg-gray-50\/30 {
  background-color: rgba(249, 250, 251, 0.3);
}

.ql-toolbar {
  @apply border-none !important;
  @apply bg-gray-100 !important;
}

.ql-container {
  @apply border-none !important;
  @apply bg-gray-100 !important;
}

input:focus,
textarea:focus,
select:focus {
  @apply ring-2 ring-[#ff613c] ring-opacity-50;
}

input,
textarea,
select {
  @apply bg-gray-100 focus:bg-white;
}
</style>