/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/checkout6-custom.js":
/*!*********************************!*\
  !*** ./src/checkout6-custom.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _controller_DeliverController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller/DeliverController */ \"./src/controller/DeliverController.js\");\n// // import AddressController from './controller/AddressController';\n// import CollectController from './controller/CollectController';\n // import FormController from './controller/FormController';\n// import ViewController from './controller/ViewController';\n// // AddressController.init();\n// ViewController.init();\n// FormController.init();\n// CollectController.init();\n\n_controller_DeliverController__WEBPACK_IMPORTED_MODULE_0__[\"default\"].init();\n\n//# sourceURL=webpack://custom-shipping-step-by-items/./src/checkout6-custom.js?");

/***/ }),

/***/ "./src/controller/DeliverController.js":
/*!*********************************************!*\
  !*** ./src/controller/DeliverController.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _partials_Deliver_DeliverContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../partials/Deliver/DeliverContainer */ \"./src/partials/Deliver/DeliverContainer.js\");\n/* harmony import */ var _utils_const__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/const */ \"./src/utils/const.js\");\n\n\n\nconst DeliverController = (() => {\n  const state = {\n    view: 'list' // list, addNew, add, edit, complete, selected\n\n  };\n\n  const setupDeliver = () => {\n    if ($('#bash--deliver-container').length) return;\n    $('#postalCode-finished-loading').after((0,_partials_Deliver_DeliverContainer__WEBPACK_IMPORTED_MODULE_0__[\"default\"])());\n  };\n\n  $(window).on('hashchange', () => {\n    if (window.location.hash === _utils_const__WEBPACK_IMPORTED_MODULE_1__.STEPS.SHIPPING) {\n      console.info('Hash change');\n      setupDeliver();\n    }\n  }); // {\n  //   action: \"setDeliverView\",\n  //   view: \"select-address\"\n  // }\n\n  $(document).on('click', 'a[data-view]', function (e) {\n    e.preventDefault();\n    const viewTarget = $(this).data('view');\n    window.postMessage({\n      action: 'setDeliveryView',\n      view: viewTarget\n    });\n  });\n  window.addEventListener('message', event => {\n    const {\n      data\n    } = event;\n    if (!data || !data.action) return;\n\n    switch (data.action) {\n      case 'setDeliveryView':\n        document.querySelector('.bash--delivery-container').setAttribute('data-view', data.view);\n        break;\n\n      default:\n        console.error('Unknown action', data.action);\n    }\n  });\n  return {\n    state,\n    init: () => {}\n  };\n})();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DeliverController);\n\n//# sourceURL=webpack://custom-shipping-step-by-items/./src/controller/DeliverController.js?");

/***/ }),

/***/ "./src/partials/Deliver/AddressListing.js":
/*!************************************************!*\
  !*** ./src/partials/Deliver/AddressListing.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst AddressListing = address => {\n  console.info('AddressListing', {\n    address\n  });\n  const {\n    number,\n    street,\n    neighborhood,\n    postalCode,\n    city,\n    receiverName,\n    complement\n  } = address;\n  const addressLine = [`${number} ${street}`, neighborhood ?? city, postalCode].join(', ');\n  const contactLine = [receiverName, complement].join(' - ');\n  return `\n<div class=\"bash--address-listing\">\n  <div class=\"address-radio\">\n   <svg class=\"empty-radio\" height=\"16\" viewBox=\"0 0 16 16\" width=\"16\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path\n        d=\"M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm0 14.4A6.398 6.398 0 0 1 1.6 8c0-3.536 2.864-6.4 6.4-6.4 3.536 0 6.4 2.864 6.4 6.4 0 3.536-2.864 6.4-6.4 6.4z\"\n        fill=\"#040404\"></path>\n    </svg>\n    <svg class=\"checked-radio\" height=\"16\" viewBox=\"0 0 16 16\" width=\"16\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path\n        d=\"M8 4C5.792 4 4 5.792 4 8s1.792 4 4 4 4-1.792 4-4-1.792-4-4-4zm0-4C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm0 14.4A6.398 6.398 0 0 1 1.6 8c0-3.536 2.864-6.4 6.4-6.4 3.536 0 6.4 2.864 6.4 6.4 0 3.536-2.864 6.4-6.4 6.4z\"\n        fill=\"#040404\"></path>\n    </svg>\n  </div>\n  <div class=\"address-text\">\n    <div>${addressLine}</div>  \n    <div>${contactLine}</div>  \n  </div>\n  <div class=\"address-edit\">\n    <a href=\"#\" data-view=\"edit-address\">\n    Edit\n    </a>\n  </div>\n</div>\n`;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AddressListing);\n\n//# sourceURL=webpack://custom-shipping-step-by-items/./src/partials/Deliver/AddressListing.js?");

/***/ }),

/***/ "./src/partials/Deliver/AddressSearch.js":
/*!***********************************************!*\
  !*** ./src/partials/Deliver/AddressSearch.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst AddressSearch = () => {\n  function initialize() {\n    const input = document.getElementById('bash--address-search');\n    const autocomplete = new window.google.maps.places.Autocomplete(input);\n    window.google.maps.event.addListener(autocomplete, 'place_changed', () => {\n      const place = autocomplete.getPlace();\n      console.info({\n        place\n      });\n      document.getElementById('city2').value = place.name;\n      document.getElementById('cityLat').value = place.geometry.location.lat();\n      document.getElementById('cityLng').value = place.geometry.location.lng();\n    });\n  }\n\n  setTimeout(() => {\n    initialize();\n  }, 500);\n  return `\n  Search...\n  <input name=\"bash-address-search\" id=\"bash--address-search\" placeholder=\"Start typing an address\" />`;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AddressSearch);\n\n//# sourceURL=webpack://custom-shipping-step-by-items/./src/partials/Deliver/AddressSearch.js?");

/***/ }),

/***/ "./src/partials/Deliver/Addresses.js":
/*!*******************************************!*\
  !*** ./src/partials/Deliver/Addresses.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/functions */ \"./src/utils/functions.js\");\n/* harmony import */ var _AddressListing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AddressListing */ \"./src/partials/Deliver/AddressListing.js\");\n\n\n\nconst Addresses = () => {\n  (0,_utils_functions__WEBPACK_IMPORTED_MODULE_0__.getAddresses)().then(({\n    data: addresses\n  }) => {\n    // if(addresses.length < 1)... go to Add Address\n    const addressesHtml = addresses.map(address => (0,_AddressListing__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(address));\n    document.getElementById('bash-address-list').innerHTML = addressesHtml.join('');\n    (0,_utils_functions__WEBPACK_IMPORTED_MODULE_0__.clearLoaders)();\n  });\n  return `\n <div class=\"bash--addresses shimmer\" id=\"bash-address-list\">\n    Loading addresses...\n  </div>  \n  `;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Addresses);\n\n//# sourceURL=webpack://custom-shipping-step-by-items/./src/partials/Deliver/Addresses.js?");

/***/ }),

/***/ "./src/partials/Deliver/DeliverContainer.js":
/*!**************************************************!*\
  !*** ./src/partials/Deliver/DeliverContainer.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Addresses__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Addresses */ \"./src/partials/Deliver/Addresses.js\");\n/* harmony import */ var _AddressSearch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AddressSearch */ \"./src/partials/Deliver/AddressSearch.js\");\n\n\n\nconst DeliverContainer = () => `\n  <div class=\"bash--delivery-container\" data-view=\"select-address\">\n    <section class=\"bash--delivery-view\" data-section=\"select-address\">\n      <h3>Select address</h3>\n      <a href=\"#\" data-view=\"address-search\">Add address</a>\n      ${(0,_Addresses__WEBPACK_IMPORTED_MODULE_0__[\"default\"])()}\n    </section>\n\n    <section class=\"bash--delivery-view\" data-section=\"address-search\">\n      <h3>Add a new delivery address</h3>\n      <a href=\"#\" data-view=\"select-address\">&lt; Back</a>\n\n      ${(0,_AddressSearch__WEBPACK_IMPORTED_MODULE_1__[\"default\"])()}\n\n    <p>Search....</p>\n    </section>\n\n    <section class=\"bash--delivery-view\" data-section=\"complete-address\">\n      <h3>Complete address</h3>\n      <a href=\"#\" data-view=\"select-address\">&lt; Back</a>\n    </section>\n\n    <section class=\"bash--delivery-view\" data-section=\"edit-address\">\n      <h3>Edit address</h3>\n      <a href=\"#\" data-view=\"select-address\">&lt; Back</a>\n    </section>\n    \n  </div>`;\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DeliverContainer);\n\n//# sourceURL=webpack://custom-shipping-step-by-items/./src/partials/Deliver/DeliverContainer.js?");

/***/ }),

/***/ "./src/utils/const.js":
/*!****************************!*\
  !*** ./src/utils/const.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AD_TYPE\": () => (/* binding */ AD_TYPE),\n/* harmony export */   \"BASE_URL_API\": () => (/* binding */ BASE_URL_API),\n/* harmony export */   \"COUNTRIES\": () => (/* binding */ COUNTRIES),\n/* harmony export */   \"COUNTRIES_AVAILABLES\": () => (/* binding */ COUNTRIES_AVAILABLES),\n/* harmony export */   \"FURNITURE_APP\": () => (/* binding */ FURNITURE_APP),\n/* harmony export */   \"FURNITURE_CAT\": () => (/* binding */ FURNITURE_CAT),\n/* harmony export */   \"FURNITURE_FEES\": () => (/* binding */ FURNITURE_FEES),\n/* harmony export */   \"FURNITURE_FEE_LINK\": () => (/* binding */ FURNITURE_FEE_LINK),\n/* harmony export */   \"RICA_APP\": () => (/* binding */ RICA_APP),\n/* harmony export */   \"SIM_CAT\": () => (/* binding */ SIM_CAT),\n/* harmony export */   \"STEPS\": () => (/* binding */ STEPS),\n/* harmony export */   \"TIMEOUT_500\": () => (/* binding */ TIMEOUT_500),\n/* harmony export */   \"TIMEOUT_750\": () => (/* binding */ TIMEOUT_750),\n/* harmony export */   \"TV_APP\": () => (/* binding */ TV_APP),\n/* harmony export */   \"TV_CAT\": () => (/* binding */ TV_CAT)\n/* harmony export */ });\n// Checkout steps\nconst STEPS = {\n  CART: '#/cart',\n  PROFILE: '#/profile',\n  SHIPPING: '#/shipping',\n  PAYMENT: '#/payment'\n}; // Address types\n\nconst AD_TYPE = {\n  PICKUP: 'search',\n  DELIVERY: 'residential'\n}; // TIMEOUT\n\nconst TIMEOUT_500 = 500;\nconst TIMEOUT_750 = 750; // APP CONFIGURATION IDs\n\nconst RICA_APP = 'ricafields';\nconst TV_APP = 'tvfields';\nconst FURNITURE_APP = 'furniturefields'; // Furniture fees Url\n\nconst FURNITURE_FEES = 'http://image.tfgmedia.co.za/image/1/process/500x790?source=http://cdn.tfgmedia.co.za' + '/15/Marketing/HTMLPages/Furniture_Delivery_Fees_tab_image.jpg';\nconst COUNTRIES = {\n  za: {\n    code: 'za',\n    phonePlaceholder: '(+27)'\n  } // South Africa\n\n};\nconst COUNTRIES_AVAILABLES = [COUNTRIES.za.code];\nconst BASE_URL_API = window.location.host.includes('bash.com') ? 'https://store-api.www.bash.com/custom-api/' : `${window.location.protocol}//${window.location.host}/custom-api/`;\nconst FURNITURE_FEE_LINK = `\n<a \n  href=\"${FURNITURE_FEES}\"\n  class=\"furniture-fees-link\" \n  target=\"_blank\"\n>\n  Furniture delivery costs\n</a>\n`;\nconst FURNITURE_CAT = '1169288799';\nconst TV_CAT = '938942995';\nconst SIM_CAT = '24833302';\n\n\n//# sourceURL=webpack://custom-shipping-step-by-items/./src/utils/const.js?");

/***/ }),

/***/ "./src/utils/functions.js":
/*!********************************!*\
  !*** ./src/utils/functions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"addBorderTop\": () => (/* binding */ addBorderTop),\n/* harmony export */   \"checkoutGetCustomData\": () => (/* binding */ checkoutGetCustomData),\n/* harmony export */   \"checkoutSendCustomData\": () => (/* binding */ checkoutSendCustomData),\n/* harmony export */   \"clearLoaders\": () => (/* binding */ clearLoaders),\n/* harmony export */   \"getAddresses\": () => (/* binding */ getAddresses),\n/* harmony export */   \"getShippingData\": () => (/* binding */ getShippingData),\n/* harmony export */   \"getSpecialCategories\": () => (/* binding */ getSpecialCategories),\n/* harmony export */   \"isValidNumberBash\": () => (/* binding */ isValidNumberBash),\n/* harmony export */   \"saveAddress\": () => (/* binding */ saveAddress),\n/* harmony export */   \"setMasterdataFields\": () => (/* binding */ setMasterdataFields),\n/* harmony export */   \"setRicaFields\": () => (/* binding */ setRicaFields),\n/* harmony export */   \"waitAndResetLocalStorage\": () => (/* binding */ waitAndResetLocalStorage)\n/* harmony export */ });\n/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./const */ \"./src/utils/const.js\");\n/* harmony import */ var _phoneFields__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./phoneFields */ \"./src/utils/phoneFields.js\");\n\n // API Functions\n\nconst catchError = message => {\n  console.error('ERROR', message);\n  throw new Error(message);\n};\n\nconst getHeadersByConfig = ({\n  cookie,\n  cache,\n  json\n}) => {\n  const headers = new Headers();\n  if (cookie) headers.append('Cookie', document?.cookie);\n  if (cache) headers.append('Cache-Control', 'no-cache');\n  if (json) headers.append('Content-type', 'application/json');\n  return headers;\n};\n\nconst getAddresses = async () => {\n  const {\n    email\n  } = window.vtexjs.checkout.orderForm?.clientProfileData;\n  const fields = ['id', 'addressType', 'addressQuery', 'addressName', 'reference', 'number', 'geolocation', 'receiverName', 'complement', 'companyBuilding', 'street', 'neighborhood', 'city', 'postalCode', 'state', 'country', 'buildingType', 'parkingDistance', 'deliveryFloor', 'liftOrStairs', 'hasSufficientSpace', 'assembleFurniture', 'tvID'].join(',');\n  const headers = getHeadersByConfig({\n    cookie: true,\n    cache: true,\n    json: false\n  });\n  const options = {\n    headers,\n    credentials: 'include'\n  };\n  return fetch(`${_const__WEBPACK_IMPORTED_MODULE_0__.BASE_URL_API}masterdata/addresses?_fields=${fields}&_where=${encodeURIComponent(`userIdQuery=${email}`)}`, // + `&timestamp=${Date.now()}`\n  options).then(res => res.json()).then(data => data).catch(error => catchError(`GET_ADDRESSES_ERROR: ${error?.message}`));\n};\n\nconst getShippingData = async (addressName, fields) => {\n  let data = {};\n  const headers = getHeadersByConfig({\n    cookie: true,\n    cache: true,\n    json: false\n  });\n  const options = {\n    headers,\n    credentials: 'include'\n  };\n  const response = await fetch(`${_const__WEBPACK_IMPORTED_MODULE_0__.BASE_URL_API}masterdata/addresses/${fields}&_where=addressName=${addressName}&timestamp=${Date.now()}`, options).then(res => res.json()).catch(error => catchError(`GET_ADDRESS_ERROR: ${error?.message}`));\n\n  if (response && !response.error && response.data && response.data.length > 0) {\n    [data] = response.data;\n  }\n\n  return data;\n};\n\nconst saveAddress = async (fields = {}) => {\n  let path;\n  const {\n    email\n  } = window.vtexjs.checkout.orderForm.clientProfileData;\n  const {\n    address\n  } = window.vtexjs.checkout.orderForm.shippingData;\n  if (!address) return; // Address already exists (?)\n\n  const savedAddress = address?.addressId ? await getShippingData(address.addressId, '?_fields=id') : {}; // Guardado del nuevo addressType\n\n  address.addressType = localStorage.getItem('addressType');\n\n  if (savedAddress?.id) {\n    path = `${_const__WEBPACK_IMPORTED_MODULE_0__.BASE_URL_API}masterdata/address/${savedAddress.id}`;\n  } else {\n    path = `${_const__WEBPACK_IMPORTED_MODULE_0__.BASE_URL_API}masterdata/addresses`;\n  }\n\n  address.complement = address.complement || (0,_phoneFields__WEBPACK_IMPORTED_MODULE_1__.getBestPhoneNumber)(); // Importante respetar el orden de address para no sobreescribir receiver, complement y neighborhood\n\n  const newAddress = {\n    userId: email,\n    ...address,\n    ...fields\n  };\n\n  if (!savedAddress.id) {\n    newAddress.addressName = address.addressId;\n  }\n\n  const headers = getHeadersByConfig({\n    cookie: true,\n    cache: true,\n    json: true\n  });\n  const options = {\n    method: 'PATCH',\n    headers,\n    body: JSON.stringify(newAddress),\n    credentials: 'include'\n  };\n  await fetch(path, options).then(res => {\n    localStorage.setItem('shippingDataCompleted', true);\n\n    if (res.status !== 204) {\n      res.json();\n    }\n  }).catch(error => catchError(`SAVE_ADDRESS_ERROR: ${error?.message}`));\n};\n\nconst setMasterdataFields = async (completeFurnitureForm, completeTVIDForm, tries = 1) => {\n  /* Data will only be searched and set if any of the custom fields for TFG are displayed. */\n  if (completeFurnitureForm || completeTVIDForm) {\n    const {\n      address\n    } = window.vtexjs.checkout.orderForm.shippingData;\n    /* Setting Masterdata custom fields */\n\n    const fields = '?_fields=buildingType,parkingDistance,deliveryFloor,liftOrStairs,hasSufficientSpace,assembleFurniture,tvID';\n    const shippingData = await getShippingData(address.addressId, fields);\n\n    if (shippingData && !jQuery.isEmptyObject(shippingData)) {\n      /* Setting furniture form values */\n      if (completeFurnitureForm) {\n        $('#tfg-building-type').val(shippingData.buildingType);\n        $('#tfg-parking-distance').val(shippingData.parkingDistance);\n        $('#tfg-delivery-floor').val(shippingData.deliveryFloor);\n\n        if ($('#tfg-delivery-floor').val() === 'Ground') {\n          $('#tfg-lift-stairs').attr('disabled', 'disabled');\n        } else {\n          $('#tfg-lift-stairs').val(shippingData.liftOrStairs);\n        }\n\n        $('#tfg-sufficient-space').prop('checked', shippingData.hasSufficientSpace);\n        $('#tfg-assemble-furniture').prop('checked', shippingData.assembleFurniture);\n      }\n      /* Setting TV form values */\n\n\n      if (completeTVIDForm) {\n        $('#tfg-tv-licence').val(shippingData.tvID);\n      }\n    } else if (tries <= 5) {\n      setTimeout(() => {\n        setMasterdataFields(completeFurnitureForm, completeTVIDForm, tries += 1);\n      }, 3000);\n    }\n  }\n}; // Functions to manage CustomData\n\n\nconst checkoutGetCustomData = appId => {\n  const {\n    customData\n  } = window.vtexjs.checkout.orderForm;\n  let fields = {};\n\n  if (customData && customData.customApps && customData.customApps.length > 0) {\n    customData.customApps.forEach(app => {\n      if (app.id === appId) {\n        fields = app.fields;\n      }\n    });\n  }\n\n  return fields;\n};\n\nconst checkoutSendCustomData = (appId, customData) => {\n  const {\n    orderFormId\n  } = window.vtexjs.checkout.orderForm;\n  return $.ajax({\n    type: 'PUT',\n    url: `/api/checkout/pub/orderForm/${orderFormId}/customData/${appId}`,\n    dataType: 'json',\n    contentType: 'application/json; charset=utf-8',\n    data: JSON.stringify(customData)\n  });\n};\n\nconst setRicaFields = (getDataFrom = 'customApps') => {\n  let ricaFields;\n\n  if (getDataFrom === 'shippingAddress') {\n    const {\n      address\n    } = window.vtexjs.checkout.orderForm.shippingData;\n    ricaFields = {\n      idOrPassport: '',\n      sameAddress: 'true',\n      fullName: address.receiverName || $('#ship-receiverName').val(),\n      streetAddress: `${address.street}, ${address.number}`,\n      suburb: address.neighborhood,\n      city: address.city,\n      postalCode: address.postalCode,\n      province: address.state\n    };\n  } else if (getDataFrom === 'customApps') {\n    ricaFields = checkoutGetCustomData(_const__WEBPACK_IMPORTED_MODULE_0__.RICA_APP);\n  }\n\n  if (ricaFields && !jQuery.isEmptyObject(ricaFields)) {\n    if (getDataFrom === 'customApps') {\n      $('#tfg-rica-id-passport').val(ricaFields.idOrPassport);\n      $('#tfg-rica-same-address').prop('checked', ricaFields.sameAddress === 'true');\n    }\n\n    $('#tfg-rica-fullname').val(ricaFields.fullName);\n    $('#tfg-rica-street').val(ricaFields.streetAddress);\n    $('#tfg-rica-suburb').val(ricaFields.suburb);\n    $('#tfg-rica-city').val(ricaFields.city);\n    $('#tfg-rica-postal-code').val(ricaFields.postalCode);\n    $('#tfg-rica-province').val(ricaFields.province);\n  }\n}; // Random Functions\n\n\nconst addBorderTop = elementClass => {\n  $(elementClass).addClass('custom-step-border');\n  $(elementClass).last().addClass('last-custom-step-border');\n};\n\nconst waitAndResetLocalStorage = () => {\n  setTimeout(() => {\n    localStorage.removeItem('shippingDataCompleted');\n  }, 5000);\n};\n\nconst isValidNumberBash = tel => (0,_phoneFields__WEBPACK_IMPORTED_MODULE_1__.validatePhoneNumber)(tel);\n\nconst getSpecialCategories = items => {\n  const furnitureCategories = [_const__WEBPACK_IMPORTED_MODULE_0__.FURNITURE_CAT];\n  const tvCategories = [_const__WEBPACK_IMPORTED_MODULE_0__.TV_CAT];\n  const simCardCategories = [_const__WEBPACK_IMPORTED_MODULE_0__.SIM_CAT];\n  const categories = [];\n  let hasTVs = false;\n  let hasSimCards = false;\n  let hasFurniture = false;\n  items.forEach(item => {\n    const itemCategories = item.productCategoryIds.split('/');\n    categories.push(itemCategories);\n    itemCategories.forEach(category => {\n      if (!category) return;\n      if (tvCategories.includes(category)) hasTVs = true;\n      if (simCardCategories.includes(category)) hasSimCards = true;\n      if (furnitureCategories.includes(category)) hasFurniture = true;\n    });\n  });\n  return {\n    hasFurniture,\n    hasSimCards,\n    hasTVs,\n    categories\n  };\n};\n\nconst clearLoaders = () => {\n  $('.shimmer').removeClass('shimmer');\n};\n\n\n//# sourceURL=webpack://custom-shipping-step-by-items/./src/utils/functions.js?");

/***/ }),

/***/ "./src/utils/phoneFields.js":
/*!**********************************!*\
  !*** ./src/utils/phoneFields.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"getBestPhoneNumber\": () => (/* binding */ getBestPhoneNumber),\n/* harmony export */   \"preparePhoneField\": () => (/* binding */ preparePhoneField),\n/* harmony export */   \"validatePhoneNumber\": () => (/* binding */ validatePhoneNumber)\n/* harmony export */ });\n/**\n * validatePhoneNumber\n * Determine if number is valid.\n * Numbers and spaces only, 9 digits or longer.\n * @param tel - string\n * @returns boolean\n */\nconst validatePhoneNumber = tel => {\n  if (!tel) return false;\n  tel = tel.replace(/\\s/g, '');\n  if (tel[0] === '0') return tel.match(/[0-9\\s]{10}/);\n  return tel.match(/[0-9\\s]{9,}/);\n};\n/**\n * formattedPhoneNumber\n * Add spaces to help guide the user how the number should look.\n * Adds space after 3rd and 6th digits only.\n * xxx xxx xxxxxxxxx\n * @param value - string value\n * @returns string\n */\n\nconst formattedPhoneNumber = (value, doFormat = true) => {\n  value = value.replace(/[^0-9+*#]+/g, '').trim(); // 'xxx xxx *'\n\n  if (value.length >= 6 && doFormat) {\n    return [value.slice(0, 3), value.slice(3, 6), value.slice(6)].join(' ');\n  } // 'xxx *'\n\n\n  if (value.length >= 3 && doFormat) {\n    return [value.slice(0, 3), value.slice(3)].join(' ');\n  }\n\n  return value;\n};\n/**\n * preparePhoneField\n * When phone fields are loaded onto the DOM\n * Prepare them for proper display and validation.\n *\n * @param  input - string css selector to the element.\n */\n\n\nconst preparePhoneField = input => {\n  const phoneInput = document.querySelector(input);\n  if (!phoneInput) return;\n  phoneInput.setAttribute('type', 'tel');\n  phoneInput.setAttribute('maxlength', 12);\n  phoneInput.value = formattedPhoneNumber(phoneInput.value);\n  const $phoneInput = $(input);\n  $phoneInput.keyup(e => {\n    const value = e.currentTarget.value.replace(/[^0-9+*#]+/g, '').trim();\n    let displayValue = value;\n    const isBackSpace = e.keyCode === 8;\n    displayValue = formattedPhoneNumber(value, !isBackSpace);\n    $phoneInput.parent('.text').removeClass('error');\n    $phoneInput.parent('.text').find('span.error').hide();\n    $phoneInput.val(displayValue);\n  });\n};\nconst getBestPhoneNumber = () => window.vtexjs.checkout.orderForm?.shippingData?.address?.complement || window.vtexjs.checkout.orderForm?.clientProfileData?.phone || document?.getElementById('client-phone')?.value;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  validatePhoneNumber\n});\n\n//# sourceURL=webpack://custom-shipping-step-by-items/./src/utils/phoneFields.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/checkout6-custom.js");
/******/ 	
/******/ })()
;