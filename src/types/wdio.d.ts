/// <reference types="@wdio/globals/types" />

declare global {
  const driver: WebdriverIO.Browser;
  const browser: WebdriverIO.Browser;
  const $: WebdriverIO.Browser['$'];
  const $$: WebdriverIO.Browser['$$'];
  const expect: ExpectWebdriverIO.Expect;
}

export {};
