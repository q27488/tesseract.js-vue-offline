### 启动
```shell
npm install

npm run serve

```

### 背景
近期公司项目有用到ocr识别图片输出文字的需求，一番搜索找到了[tesseract.js](https://tesseract.projectnaptha.com/)，测试了一下性能，识别大概在**4s**左右，达到预期。  
然后又因为是银行内部项目没有外网环境，需要做offline适配。做完之后，发现国内关于tesseract.js文章极少，特别还是offline版本，所以就有这篇文章。  
要源码的可直接跳到文章最后自取。

### 初试[tesseract.js-offline](https://github.com/jeromewu/tesseract.js-offline)
这是一个官方的offline版本，分为浏览器（bower）版本和node版本，node版本的offline我是没整明白，考虑到vue使用的是bower环境，故在此基础上借鉴开发。  
关键代码如下
```javascript
// index.html
<script>
const { createWorker } = Tesseract;
    const worker = createWorker({
      workerPath: '../node_modules/tesseract.js/dist/worker.min.js',
      langPath: '../lang-data',
      corePath: '../node_modules/tesseract.js-core/tesseract-core.wasm.js',
      logger: m => console.log(m),
    });

    (async () => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize('../images/testocr.png');
      console.log(text);
      await worker.terminate();
    })();
</script>
```
##### 分析
offline版本相比官方版本区别就在于`createWorker`的初始化配置项的`workerPath`、`langPath`、`corePath`,将这3个依赖下载到本地项目内是关键。  
但是vue应用直接使用如上代码是会找不到路径，更别说`npm run build`生产环境下没有`node_modules`的情况。  
##### 解决关键
关键在于`path`路径，解决方案如下
1. 安装`tesseract.js`、`tesseract.js-core`: `npm i -S tesseract.js tesseract.js-core`
2. 去到node_modules找到如上2个依赖包，将他们复制到vue项目的`public`文件夹下
3. 接下来解决语言包，打开[tesseractjs官方语言包地址](https://github.com/naptha/tessdata/tree/gh-pages/4.0.0),找到你需要的语言包，我这里需要的是中文简体：**chi_sim_vert.traineddata.gz** *(经测试-中文简体语言包也支持26个英文识别)*
4. 将语言包同样放置`public`目录下
5. 修改代码`path`路径，如下
```
const worker = createWorker({
  workerPath: "/tesseract/tesseract.js/dist/worker.min.js",
  langPath: "/tesseract/lang-data",
  corePath: "/tesseract/tesseract.js-core/tesseract-core.wasm.js",
  logger: (m) => console.log(m),
});
```

### 其他
##### 资源cdn优化
`public`目录下的`tesseract.j`、`lang-data`、`tesseract.js-core`文件大小均超过**10m**，以后项目`npm run build`和部署到服务器时都会比较慢，故建议有条件的同学放到**cdn**托管。

### github
[https://github.com/q27488/tesseract.js-vue-offline](https://github.com/q27488/tesseract.js-vue-offline)### 背景
近期公司项目有用到ocr识别图片输出文字的需求，一番搜索找到了[tesseract.js](https://tesseract.projectnaptha.com/)，测试了一下性能，识别大概在**4s**左右，达到预期。  
然后又因为是银行内部项目没有外网环境，需要做offline适配。做完之后，发现国内关于tesseract.js文章极少，特别还是offline版本，所以就有这篇文章。  
要源码的可直接跳到文章最后自取。

### 初试[tesseract.js-offline](https://github.com/jeromewu/tesseract.js-offline)
这是一个官方的offline版本，分为浏览器（bower）版本和node版本，node版本的offline我是没整明白，考虑到vue使用的是bower环境，故在此基础上借鉴开发。  
关键代码如下
```javascript
// index.html
<script>
const { createWorker } = Tesseract;
    const worker = createWorker({
      workerPath: '../node_modules/tesseract.js/dist/worker.min.js',
      langPath: '../lang-data',
      corePath: '../node_modules/tesseract.js-core/tesseract-core.wasm.js',
      logger: m => console.log(m),
    });

    (async () => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize('../images/testocr.png');
      console.log(text);
      await worker.terminate();
    })();
</script>
```
##### 分析
offline版本相比官方版本区别就在于`createWorker`的初始化配置项的`workerPath`、`langPath`、`corePath`,将这3个依赖下载到本地项目内是关键。  
但是vue应用直接使用如上代码是会找不到路径，更别说`npm run build`生产环境下没有`node_modules`的情况。  
##### 解决关键
关键在于`path`路径，解决方案如下
1. 安装`tesseract.js`、`tesseract.js-core`: `npm i -S tesseract.js tesseract.js-core`
2. 去到node_modules找到如上2个依赖包，将他们复制到vue项目的`public`文件夹下
3. 接下来解决语言包，打开[tesseractjs官方语言包地址](https://github.com/naptha/tessdata/tree/gh-pages/4.0.0),找到你需要的语言包，我这里需要的是中文简体：**chi_sim_vert.traineddata.gz** *(经测试-中文简体语言包也支持26个英文识别)*
4. 将语言包同样放置`public`目录下
5. 修改代码`path`路径，如下
```
const worker = createWorker({
  workerPath: "/tesseract/tesseract.js/dist/worker.min.js",
  langPath: "/tesseract/lang-data",
  corePath: "/tesseract/tesseract.js-core/tesseract-core.wasm.js",
  logger: (m) => console.log(m),
});
```

### 其他
##### 资源cdn优化
`public`目录下的`tesseract.j`、`lang-data`、`tesseract.js-core`文件大小均超过**10m**，以后项目`npm run build`和部署到服务器时都会比较慢，故建议有条件的同学放到**cdn**托管。

### github
[https://github.com/q27488/tesseract.js-vue-offline](https://github.com/q27488/tesseract.js-vue-offline)### 背景
近期公司项目有用到ocr识别图片输出文字的需求，一番搜索找到了[tesseract.js](https://tesseract.projectnaptha.com/)，测试了一下性能，识别大概在**4s**左右，达到预期。  
然后又因为是银行内部项目没有外网环境，需要做offline适配。做完之后，发现国内关于tesseract.js文章极少，特别还是offline版本，所以就有这篇文章。  
要源码的可直接跳到文章最后自取。

### 初试[tesseract.js-offline](https://github.com/jeromewu/tesseract.js-offline)
这是一个官方的offline版本，分为浏览器（bower）版本和node版本，node版本的offline我是没整明白，考虑到vue使用的是bower环境，故在此基础上借鉴开发。  
关键代码如下
```javascript
// index.html
<script>
const { createWorker } = Tesseract;
    const worker = createWorker({
      workerPath: '../node_modules/tesseract.js/dist/worker.min.js',
      langPath: '../lang-data',
      corePath: '../node_modules/tesseract.js-core/tesseract-core.wasm.js',
      logger: m => console.log(m),
    });

    (async () => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize('../images/testocr.png');
      console.log(text);
      await worker.terminate();
    })();
</script>
```
##### 分析
offline版本相比官方版本区别就在于`createWorker`的初始化配置项的`workerPath`、`langPath`、`corePath`,将这3个依赖下载到本地项目内是关键。  
但是vue应用直接使用如上代码是会找不到路径，更别说`npm run build`生产环境下没有`node_modules`的情况。  
##### 解决关键
关键在于`path`路径，解决方案如下
1. 安装`tesseract.js`、`tesseract.js-core`: `npm i -S tesseract.js tesseract.js-core`
2. 去到node_modules找到如上2个依赖包，将他们复制到vue项目的`public`文件夹下
3. 接下来解决语言包，打开[tesseractjs官方语言包地址](https://github.com/naptha/tessdata/tree/gh-pages/4.0.0),找到你需要的语言包，我这里需要的是中文简体：**chi_sim_vert.traineddata.gz** *(经测试-中文简体语言包也支持26个英文识别)*
4. 将语言包同样放置`public`目录下
5. 修改代码`path`路径，如下
```
const worker = createWorker({
  workerPath: "/tesseract/tesseract.js/dist/worker.min.js",
  langPath: "/tesseract/lang-data",
  corePath: "/tesseract/tesseract.js-core/tesseract-core.wasm.js",
  logger: (m) => console.log(m),
});
```

### 其他
##### 资源cdn优化
`public`目录下的`tesseract.j`、`lang-data`、`tesseract.js-core`文件大小均超过**10m**，以后项目`npm run build`和部署到服务器时都会比较慢，故建议有条件的同学放到**cdn**托管。

### github
[https://github.com/q27488/tesseract.js-vue-offline](https://github.com/q27488/tesseract.js-vue-offline)