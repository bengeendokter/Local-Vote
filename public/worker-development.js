/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./app/_worker/index.ts":
/*!******************************!*\
  !*** ./app/_worker/index.ts ***!
  \******************************/
/***/ (() => {

eval("// caches.match(\"/_next/static/chunks/app/settings/page-9c69dc597e6e324e.js?__WB_REVISION__=yV6_dFGC4SJOS9n0MQ_Sm\");\nconst installEvent = ()=>{\n    self.addEventListener(\"install\", ()=>{\n        console.log(\"service worker installed\");\n    });\n};\ninstallEvent();\nconst activateEvent = ()=>{\n    self.addEventListener(\"activate\", ()=>{\n        console.log(\"service worker activated\");\n    });\n};\nactivateEvent();\nconst fetchEvent = ()=>{\n    self.addEventListener(\"fetch\", (evt)=>{\n        const fetchEvent = evt;\n        console.log(\"EventListener evt: \", fetchEvent);\n        console.log(\"EventListener url fetch: \", fetchEvent.request.url);\n        const requestURL = new URL(fetchEvent.request.url);\n        if (requestURL.pathname.startsWith(\"/ranking\")) {\n            console.log(\"startsWith /ranking\");\n            const frontStrippedPathName = requestURL.pathname.replace(\"/ranking/\", \"\").replace(\"/ranking\", \"\");\n            if (frontStrippedPathName.length === 0) {\n                console.log(\"frontStrippedPathName.length === 0\");\n                return fetch(fetchEvent.request);\n            }\n            if (requestURL.pathname.includes(\"edit\")) {\n                console.log(\"pathname.includes(edit)\");\n            // TODO fetch generic cached edit page\n            }\n            fetchEvent.respondWith(caches.match(\"/ranking\").then((response)=>{\n                return response || fetch(fetchEvent.request);\n            }));\n        }\n    });\n};\nfetchEvent();\n\n\n//# sourceURL=webpack://local-vote/./app/_worker/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./app/_worker/index.ts"]();
/******/ 	
/******/ })()
;