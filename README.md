# ?? selenium-webdriverio-automation

![WebdriverIO Tests](https://github.com/ozone11924-bot/selenium-webdriverio-automation/actions/workflows/wdio.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![WebdriverIO](https://img.shields.io/badge/WebdriverIO-9.x-EA5906)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Allure](https://img.shields.io/badge/Reports-Allure-orange)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

End-to-end UI automation suite for [The Internet](https://the-internet.herokuapp.com) built with **WebdriverIO v9**, **TypeScript**, and **Allure Reports**.

## Test Coverage

| Suite | Tests | What it covers |
|---|---|---|
| login.spec.ts | 6 | Data-driven: valid, invalid user/password, empty fields, logout |
| checkboxes.spec.ts | 5 | Check, uncheck, check-all, uncheck-all |
| dropdown.spec.ts | 5 | Data-driven: select by value and by text |
| dynamicLoading.spec.ts | 2 | Explicit waits for hidden and DOM-rendered elements |
| jsAlerts.spec.ts | 4 | Accept alert, accept/dismiss confirm, submit prompt |
| hovers.spec.ts | 4 | Mouse hover reveals captions across all avatars |

## Getting Started

```bash
npm install
npm test
npm run allure:report
```

## Tech Stack
- WebdriverIO v9, TypeScript, Mocha, Allure Reports, GitHub Actions