<template>
  <div>
    <canvas ref="qrCanvas"></canvas>
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  mounted() {
    const url = `https://www.thanywhere.com/ticket-checker/${this.id}`;
    const canvas = this.$refs.qrCanvas;

    QRCode.toCanvas(canvas, url, { width: 150 }, (error) => {
      if (error) console.error("QR Code generation error:", error);
    });
  },
};
</script>
