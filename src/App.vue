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
  corePath: "/tesseract/tesseract.js-core/tesseract-core.wasm.js",
  langPath: "/tesseract/tesseract-lang",  // TODO：prd环境下会报错
  logger: (m) => console.log(m),
});

export default {
  name: "app",
  data() {
    return {
      haveInit: false,
    };
  },
  methods: {
    async recognize() {
      console.time('time:');
      console.log(img);
      if (!this.haveInit) {
        await worker.load();
        await worker.loadLanguage("chi_sim");
        await worker.initialize("chi_sim", OEM.LSTM_ONLY);
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        });
        this.haveInit = true;
      }

      const img = document.getElementById("text-img");
      const {
        data: { text },
      } = await worker.recognize(img);
      console.log(text);
      console.timeEnd('time:');
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
