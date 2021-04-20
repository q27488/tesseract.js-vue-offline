<template>
  <div id="app">
    <button v-on:click="recognize">recognize</button>
    <!-- <img id="text-img" alt="Vue logo" src="./assets/chi_sim.png" /> -->
    <img id="text-img" alt="Vue logo" src="./assets/chi_eng.jpg" />
  </div>
</template>

<script>
/* eslint-disable */
import { createWorker, PSM, OEM } from "tesseract.js";
const path = require("path");
const worker = createWorker({
  workerPath: "/tesseract/tesseract.js/dist/worker.min.js",
  langPath: "/tesseract/lang-data",
  corePath: "/tesseract/tesseract.js-core/tesseract-core.wasm.js",
  logger: (m) => console.log(m),
});

export default {
  name: "app",
  methods: {
    recognize: async () => {
      console.time(1)
      const img = document.getElementById("text-img");
      console.log(img);
      await worker.load();
      await worker.loadLanguage("chi_sim");
      await worker.initialize("chi_sim", OEM.LSTM_ONLY);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      const {
        data: { text },
      } = await worker.recognize(img);
      console.log(text);
      console.timeEnd(1)

    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
