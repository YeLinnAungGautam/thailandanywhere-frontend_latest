<template>
  <div>
    <div class="flex justify-start items-center gap-x-4">
      <p class="text-lg text-[#FF613c] font-bold">CS-2567</p>
      <p class="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg">
        fully_paid
      </p>
    </div>
    <div class="pt-3 pb-6">
      <div className="w-full p-4">
        <table
          className="w-full rounded-lg overflow-hidden border border-gray-200"
        >
          <thead className="bg-orange-500">
            <tr>
              <th className="text-center text-xs text-white py-2">Code</th>
              <th className="text-center text-xs text-white py-2">Item Name</th>
              <th className="text-center text-xs text-white py-2">Check-in</th>
              <th className="text-center text-xs text-white py-2">Check-out</th>
              <th className="text-center text-xs text-white py-2">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            <tr
              className="bg-white even:bg-gray-50 hover:bg-gray-50"
              v-for="i in 5"
              :key="i"
            >
              <td className="text-center text-xs py-3">CS-34324-0{{ i }}</td>
              <td className="text-center text-xs py-3">
                item of variation name
              </td>
              <td className="text-center text-xs py-3">30 May, 2025</td>
              <td className="text-center text-xs py-3">30 May, 2025</td>
              <td className="text-center text-xs py-3">2000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-x-10">
      <div class="grid grid-cols-2 gap-2">
        <p class="text-[#FF613c] font-semibold text-xs py-2">Payment Summary</p>
        <p></p>
        <p class="text-xs font-semibold">Sub Total:</p>
        <p class="bg-gray-200 px-4 h-8 pt-2 text-xs rounded-lg">1540</p>
        <p class="text-xs font-semibold">Discount:</p>
        <p class="bg-gray-200 px-4 h-8 pt-2 text-xs rounded-lg">350</p>
        <p class="text-xs font-semibold">Total:</p>
        <p class="bg-gray-200 px-4 h-8 pt-2 text-xs rounded-lg">1540</p>
        <p class="text-xs font-semibold">Deposit:</p>
        <p class="bg-gray-200 px-4 h-8 pt-2 text-xs rounded-lg">1540</p>
        <p class="text-xs font-semibold">Balance Due:</p>
        <p class="bg-gray-200 px-4 h-8 pt-2 text-xs rounded-lg">0</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <p class="text-[#FF613c] font-semibold text-xs py-2">Payment Detail</p>
        <p></p>
        <div>
          <p class="text-[10px] pb-2">CRM ID</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">1540</p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Sales Date</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">12 May, 2025</p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Payment Method</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">Bank Transfer</p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Payment Currency</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">THB</p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Bank name</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">Kasikorn</p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Exchange Rate</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">0</p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Is inclusive ?</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">No</p>
        </div>
        <div>
          <p class="text-[10px] pb-2">Balance Due Date</p>
          <p class="bg-gray-200 px-4 py-2 text-xs rounded-lg">30 May, 2025</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
