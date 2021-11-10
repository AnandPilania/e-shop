/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************************!*\
  !*** ./RetrivIt/js/getProduct.js ***!
  \***********************************/
document.getElementById("getProduct").addEventListener('click', function () {
  console.log("Popup DOM fully loaded and parsed");

  function modifyDOM() {
    //You can play with your DOM here or check URL against your regex
    console.log(document.body); // console.log(document.getElementById('extends').innerText);

    console.log(document.getElementsByClassName('product-title-text')[0].innerText);
    var formData = new FormData();
    formData.append("body", document.getElementsByClassName('product-title-text')[0].innerText);
    fetch("http://127.0.0.1:8000/getAliExpressProduct", {
      method: 'post',
      body: formData
    }).then(console.log('res.data  --->  ok'));
    return document.body.innerHTML;
  } //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:


  chrome.tabs.executeScript({
    code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code

  }, function (results) {
    //Here we have just the innerHTML and not DOM structure
    console.log('Popup script:');
    console.log(results[0]);
  });
});
/******/ })()
;