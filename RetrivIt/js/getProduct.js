// scrapping product sheet from aliexpress
document.getElementById("getProduct").addEventListener('click', () => {

    function modifyDOM() {

        console.log(document.body);
        console.log(window.location.href);

        for (const script_window_runParams of document.querySelectorAll("script")) {
            if (script_window_runParams.textContent.includes("window.runParams")) {
                var myJsonData = script_window_runParams.textContent;
                var n = myJsonData.indexOf('csrfToken: \'');
                myJsonData = myJsonData.substring(0, n != -1 ? n : myJsonData.length);
                var jsonData = myJsonData.replace(' window.runParams = {','').replace('     data: ','');
                var aliExData = JSON.parse(jsonData.trim().slice(0, -1));


                // imga du slider "grandes images"
                aliExData.imageModule.imagePathList.forEach(function(nextPathImage) {
                    console.log(nextPathImage);
                });

                aliExData.skuModule.productSKUPropertyList.forEach(function (nextProperty) {
                    console.log(nextProperty.skuPropertyName);
                    nextProperty.skuPropertyValues.forEach(function (nextPropertyDetail, index) {
                        console.log(nextPropertyDetail.propertyValueName);
                        console.log(nextPropertyDetail.skuPropertyImagePath);
                    });
                });


                // aliExData.skuModule.productSKUPropertyList.forEach(function(nextProperty) {
                //     console.log(nextProperty.skuPropertyValues);
                //     // console.log(nextProperty.skuPropertyValues.skuPropertyImagePath);
                // });
                // console.log(aliExData.skuModule.productSKUPropertyList[0].skuPropertyValues);
                console.log(aliExData.imageModule);
            }
        }
        
 
        var formData = new FormData();

        // url product
        formData.append("urlProduct", window.location.href);

        if (document.getElementsByClassName('overview-rating-average').length > 0) {
            var globalStars = parseInt(document.getElementsByClassName('overview-rating-average')[0].innerText.trim().replace(/\D/g,''), 10) / 10;
        }
        if (document.getElementsByClassName('product-reviewer-reviews').length > 0) {
            var reviews = parseInt(document.getElementsByClassName('product-reviewer-reviews')[0].innerText.trim().replace(/\D/g,''), 10);
        }
        if (document.getElementsByClassName('product-reviewer-sold').length > 0) {
            var orders = parseInt(document.getElementsByClassName('product-reviewer-sold')[0].innerText.trim().replace(/\D/g,''), 10);
        }

        formData.append("globalStars", globalStars);
        formData.append("reviews", reviews);
        formData.append("orders", orders);

        // big images product url
        if (document.getElementsByClassName('product-overview').length > 0) {
            var divImg = document.getElementsByClassName('product-overview')[0];
            var images = divImg.getElementsByTagName("img");
            var bigImagesProduct = {};
            for (let i = 0; i < images.length; i++) {
                bigImagesProduct['src_' + i] = images[i].src;
                bigImagesProduct['alt_' + i] = images[i].alt;
                bigImagesProduct['title_' + i] = images[i].title;
            }
            var bigImagesProductObj = JSON.stringify(bigImagesProduct);
        }
        formData.append("bigImagesProduct", bigImagesProductObj);

        // product name
        if (document.getElementsByClassName('product-title-text').length > 0) {
            var productName = document.getElementsByClassName('product-title-text')[0].innerText;
        }
        formData.append("productName", productName);

        // price
        if (document.getElementsByTagName('div').length > 0) {
            const divsContainPrice = document.getElementsByTagName("div");
            var price = null;
            for (let i = 0; i < divsContainPrice.length; i++) {
                if (divsContainPrice[i].classList.contains("product-price-current")) {
                    var product_price_current = true;
                }
            }
            if (product_price_current) {
                price = document.getElementsByClassName('product-price-current')[0].innerText;
            } else {
                price = document.getElementsByClassName('uniform-banner-box-price')[0].innerText;
            }
        }
        formData.append("price", price);

        // slider images product 
        if (document.getElementsByClassName('images-view-item').length > 0) {
            let images_view_item = document.getElementsByClassName('images-view-item');
            var slider_images_product = {};
            if (images_view_item.length > 0) {
                for (let i = 0; i < images_view_item.length; i++) {
                    slider_images_product['src_' + i] = images_view_item[i].querySelector('img').src;
                    slider_images_product['alt_' + i] = images_view_item[i].querySelector('img').alt;
                    slider_images_product['title_' + i] = images_view_item[i].querySelector('img').title;
                }
                var slider_images_productObj = JSON.stringify(slider_images_product);
            }
        }
        formData.append("slider_images_product", slider_images_productObj);

        // récupère les class des propriétés comme couleur, taille,...
        if (document.getElementsByClassName('sku-title').length > 0) {
            let property = document.getElementsByClassName('sku-title');
            var colorProperty = {};
            var sizeProperty = [];
            for (let i = 0; i < property.length; i++) {
                let titleProperty = property[i].firstChild.textContent.replace('"', '');
                // get src from thumbnail images for color details 
                if (titleProperty == 'Couleur' || titleProperty == 'Color') {
                    let color = document.getElementsByClassName('sku-property-image');
                    if (color.length > 0) {
                        for (let i = 0; i < color.length; i++) {
                            colorProperty['color_src_' + i] = color[i].querySelector('img').src;
                            colorProperty['color_alt_' + i] = color[i].querySelector('img').alt;
                            colorProperty['color_title_' + i] = color[i].querySelector('img').title;
                        }
                    }
                    var colorPropertyObj = JSON.stringify(colorProperty);
                    formData.append("color", colorPropertyObj);
                }
                // get size for size details
                if (titleProperty == 'Taille' || titleProperty == 'Size') {
                    let size = document.getElementsByClassName('sku-property-text');
                    if (size.length > 0) {
                        for (let i = 0; i < size.length; i++) {
                            sizeProperty.push(size[i].innerText);
                        }
                    }
                    var sizePropertyObj = JSON.stringify(sizeProperty);
                    formData.append("size", sizePropertyObj);
                }
            }
        }

        fetch(`http://127.0.0.1:8000/getAliExpressProduct`, {
            method: 'post',
            body: formData
        })
            .then(console.log('res.data  --->  ok'));

        return document.body.innerHTML;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        //Here we have just the innerHTML and not DOM structure
        console.log('Popup script:')
        console.log(results[0]);
    });
});



