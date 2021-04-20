const resolvePaths = require('./utils/resolvePaths');
const circularize = require('./utils/circularize');
const createJob = require('./createJob');
const { log } = require('./utils/log');
const getId = require('./utils/getId');
const { defaultOEM } = require('./constants/config');
const {
  defaultOptions,
  spawnWorker,
  terminateWorker,
  onMessage,
  loadImage,
  send,
} = require('./worker/node');

let workerCounter = 0;

module.exports = (_options = {}) => {
  const id = getId('Worker', workerCounter);
  const {
    logger,
    ...options
  } = resolvePaths({
    ...defaultOptions,
    ..._options,
  });
  const resolves = {};
  const rejects = {};
  let worker = spawnWorker(options);

  workerCounter += 1;

  const setResolve = (action, res) => {
    resolves[action] = res;
  };

  const setReject = (action, rej) => {
    rejects[action] = rej;
  };

  const startJob = ({ id: jobId, action, payload }) => (
    new Promise((resolve, reject) => {
      log(`[${id}]: Start ${jobId}, action=${action}`);
      setResolve(action, resolve);
      setReject(action, reject);
      send(worker, {
        workerId: id,
        jobId,
        action,
        payload,
      });
    })
  );

  const load = jobId => (
    startJob(createJob({
      id: jobId, action: 'load', payload: { options },
    }))
  );

  const loadLanguage = (langs = 'eng', jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'loadLanguage',
      payload: { langs, options },
    }))
  );

  const initialize = (langs = 'eng', oem = defaultOEM, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'initialize',
      payload: { langs, oem },
    }))
  );

  const setParameters = (params = {}, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'setParameters',
      payload: { params },
    }))
  );

  const recognize = async (image, opts = {}, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'recognize',
      payload: { image: await loadImage(image), options: opts },
    }))
  );

  const getPDF = (title = 'Tesseract OCR Result', textonly = false, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'getPDF',
      payload: { title, textonly },
    }))
  );

  const detect = async (image, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'detect',
      payload: { image: await loadImage(image) },
    }))
  );

  const terminate = async (jobId) => {
    if (worker !== null) {
      await startJob(createJob({
        id: jobId,
        action: 'terminate',
      }));
      terminateWorker(worker);
      worker = null;
    }
    return Promise.resolve();
  };

  onMessage(worker, ({
    workerId, jobId, status, action, data,
  }) => {
    if (status === 'resolve') {
      log(`[${workerId}]: Complete ${jobId}`);
      let d = data;
      if (action === 'recognize') {
        d = circularize(data);
      } else if (action === 'getPDF') {
        d = Array.from({ ...data, length: Object.keys(data).length });
      }
      resolves[action]({ jobId, data: d });
    } else if (status === 'reject') {
      rejects[action](data);
      throw Error(data);
    } else if (status === 'progress') {
      logger(data);
    }
  });

  return {
    id,
    worker,
    setResolve,
    setReject,
    load,
    loadLanguage,
    initialize,
    setParameters,
    recognize,
    getPDF,
    detect,
    terminate,
  };
};
