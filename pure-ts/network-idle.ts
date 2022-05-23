/* eslint-disable no-param-reassign,prefer-rest-params */
import ms from 'millisecond';

type Self = typeof globalThis

const requests = new Map<Self, number>();

export const networkIdle = async (w: Window, timeout: ReturnType<typeof ms> = ms('10 second')) => (

  new Promise((resolve) => {
    const self: Self = w as any;
    initWatching(self);

    const interval = setInterval(() => {
      console.log(requests.get(self));
      if (!requests.has(self) || (requests.get(self) || 0) <= 0) {
        clearInterval(interval);
        resolve(undefined);
      }
    }, timeout);
  })
);
export default {};

const initWatching = (self: Self) => {
  if (!requests.has(self)) {
    requests.set(self, 0);

    const increment = () => {
      requests.set(self, (requests.get(self) || 0) + 1);
    };

    const decrement = () => {
      requests.set(self, (requests.get(self) || 0) - 1);
    };

    const { open } = self.XMLHttpRequest.prototype;
    const { send } = self.XMLHttpRequest.prototype;

    const isRegularXHR = open.toString().indexOf('native code') !== -1;

    if (isRegularXHR) {
      self.XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', decrement);
        this.addEventListener('error', decrement);
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        return open.apply(this, arguments);
      };
      self.XMLHttpRequest.prototype.send = function () {
        increment();
        // @ts-ignore
        return send.apply(this, arguments);
      };
    }

    const fetch = self.fetch || '';
    const isFetchNative = fetch.toString().indexOf('native code') !== -1;

    if (isFetchNative) {
      self.fetch = function () {
        increment();
        // @ts-ignore
        const p = fetch.apply(this, arguments);
        p.then(decrement, decrement);
        return p;
      };
    }
  }
};
