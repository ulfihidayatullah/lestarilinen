(function (global) {
  'use strict';

  const utils = global.APP_UTILS = global.APP_UTILS || {};

  utils.createAutoplayController = function createAutoplayController({
    delay = 5000,
    advance,
    canRun = () => true
  } = {}) {
    if (typeof advance !== 'function') {
      throw new TypeError('createAutoplayController requires an advance function.');
    }

    let timer = null;

    const stop = () => {
      if (timer === null) return;
      global.clearTimeout(timer);
      timer = null;
    };

    const start = () => {
      stop();
      if (document.hidden || !canRun()) return;

      timer = global.setTimeout(() => {
        timer = null;
        advance();
        start();
      }, delay);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return {
      start,
      stop,
      restart: start,
      destroy() {
        stop();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  };
})(window);
