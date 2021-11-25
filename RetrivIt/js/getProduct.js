// scrapping product sheet from aliexpress

document.getElementById("getProduct").addEventListener('click', () => {

    function modifyDOM() {

        //  window.scrollTo( 0, 50000 );
        //  window.scrollTo( 0, 0 );

         var lazy = document.getElementsByClassName('lazyload-placeholder');
         for (let i = 0; i < lazy.length; i++) {
            lazy[i].style.display = 'block';

        }
            var product_cards = document.getElementsByClassName('_3KNwG _2f4Ho');
            for (let i = 0; i < product_cards.length; i++) {
                product_cards[i].style.border = 'solid 5px red';
                product_cards[i].style.position = 'relative';
                
    
                var header_card = document.createElement('div');
                header_card.classList.add('header_card');
                header_card.style.position = 'absolute';
                header_card.style.top = '0px';
                header_card.style.left = '0px';
                header_card.style.width = '100%';
                header_card.style.height = '25px';
                header_card.style.textAlign = 'center';
                header_card.style.backgroundColor = 'blue';
                header_card.style.color = 'white';
                header_card.innerText = product_cards[i].getElementsByClassName('_1XYdp')[0].textContent;
                // availableProductPropertiesElement.setAttribute('id', 'item-sku-library');
                product_cards[i].appendChild(header_card);
    
                // var href_product_card_[i] = product_cards[i].href;
    
            }
      

        // console.log(document.body);

        var myUrl = 'https://fr.aliexpress.com/item/4000874659885.html?spm=a2g0o.tm800039653.9966668930.8.5c8a7dbbwhDHlA&pdp_ext_f=%7B%22ship_from%22:%22US%22,%22sku_id%22:%2212000018733172121%22%7D&&scm=1007.25281.247653.0&scm_id=1007.25281.247653.0&scm-url=1007.25281.247653.0&pvid=6cb9eb1c-1a64-4490-8718-20016a8c93c8&utparam=%257B%2522process_id%2522%253A%25221%2522%252C%2522x_object_type%2522%253A%2522product%2522%252C%2522pvid%2522%253A%25226cb9eb1c-1a64-4490-8718-20016a8c93c8%2522%252C%2522belongs%2522%253A%255B%257B%2522floor_id%2522%253A%252223051931%2522%252C%2522id%2522%253A%2522876052%2522%252C%2522type%2522%253A%2522dataset%2522%257D%252C%257B%2522id_list%2522%253A%255B%25221000126943%2522%255D%252C%2522type%2522%253A%2522gbrain%2522%257D%255D%252C%2522scm%2522%253A%25221007.25281.247653.0%2522%252C%2522tpp_buckets%2522%253A%252221669%25230%2523186385%25230_21669%25234190%252319166%2523884_15281%25230%2523247653%25233%2522%252C%2522x_object_id%2522%253A%25224000874659885%2522%257D';

        var dataUrl = new FormData();
        dataUrl.append("dataUrl", myUrl);


        fetch('http://127.0.0.1:8000/importProduct', {
            method: 'post',
            body: dataUrl,
        })
            .then(console.log('res.dataUrl  --->  ok'));


        // console.log(window.open(myUrl));
        throw new Error("my error message");




        console.log('ce qui suis est la fiche du produit sur aliexpress');
        console.log(window.location.href);

        // on récupère le script qui contien "window.runParams" pour en extraire les data
        for (const script_window_runParams of document.querySelectorAll("script")) {
            if (script_window_runParams.textContent.includes("window.runParams")) {
                // on retire ce qu'on a pas besoin pour obtenir un fichier json prêt à l'emploi
                var myJsonData = script_window_runParams.textContent;
                var n = myJsonData.indexOf('csrfToken: \'');
                myJsonData = myJsonData.substring(0, n != -1 ? n : myJsonData.length);
                var jsonData = myJsonData.replace(' window.runParams = {', '').replace('     data: ', '');
                console.log(jsonData);

                console.log('ce qui suis est le jsonData');
                var aliExData = JSON.parse(jsonData.trim().slice(0, -1));
                console.log(aliExData);




                // --------------------------------------------------------------------
                /* ------------------PRODUCT ALL SKU-------------------- */
                /* Collect all SKU */

                console.log('ce qui suis est le CODE DU SCRAPPEUR');
                aliExData.skuModule.productSKUPropertyList.forEach(function (nextPropertyGroup) {

                    // récupère le nom de la propriété
                    var skuPropertyName = nextPropertyGroup.skuPropertyName + ': ';
                    var nextGroupItems = [];

                    // on parcoure toutes les itérations de la propriété courrante
                    nextPropertyGroup.skuPropertyValues.forEach(function (nextPropertyGroupValue) {
                        var nextParam = (typeof nextPropertyGroupValue.skuPropertyImagePath !== 'undefined' ? nextPropertyGroupValue.skuPropertyImagePath : '') + ' ' +
                            // en français propertyValueName au lieu de propertyValueDisplayName
                            nextPropertyGroupValue.propertyValueName;

                        skuPropertyName += nextParam + ' ';
                    });

                    skuPropertyName += nextGroupItems.join(', ');

                    console.log('skuPropertyName  ' + skuPropertyName);
                });


                /* Collect all variants */
                aliExData.skuModule.skuPriceList.forEach(function (skuPriceOffer) {

                    var skuVariantFullName = [];
                    var skuProps = skuPriceOffer.skuPropIds.split(',');
                    var imageLinkIfSpecified = '';
                    skuProps.forEach(function (skuId) {
                        aliExData.skuModule.productSKUPropertyList.forEach(function (nextPropertyGroup) {
                            nextPropertyGroup.skuPropertyValues.forEach(function (nextPropertyGroupValue) {
                                if (Number(nextPropertyGroupValue.propertyValueId) === Number(skuId)) {
                                    // nextParam contient le nom de la propriété et sa valeur
                                    var nextParam = nextPropertyGroup.skuPropertyName + ': ' + nextPropertyGroupValue.propertyValueDisplayName;
                                    // on met nextParam dans un tableau
                                    skuVariantFullName.push(nextParam);
                                    // si cette propriété aune image on la récupère dans imageLinkIfSpecified
                                    if (typeof nextPropertyGroupValue.skuPropertyImagePath !== 'undefined')
                                        imageLinkIfSpecified = nextPropertyGroupValue.skuPropertyImagePath;
                                }
                            });
                        });

                    });

                    var nextSKUOffer = skuVariantFullName.join(', ') + (typeof skuPriceOffer.skuVal.availQuantity !== 'undefined' ? ', Available: ' + skuPriceOffer.skuVal.availQuantity : '') + ', Price: ' + skuPriceOffer.skuVal.skuActivityAmount.value;
                    if (imageLinkIfSpecified.length > 0)
                        nextSKUOffer += ', Image: ' + imageLinkIfSpecified;

                    console.log('nextSKUOffer   ' + nextSKUOffer);




                });
                // throw new Error("my error message");
                //------------------------------------------------------------------------






                // slider lien img big format
                console.log('ce qui suis est le slider img big format');
                aliExData.imageModule.imagePathList.forEach(function (nextPathImage) {
                    console.log('slide img big format ' + nextPathImage);
                });

                console.log('ce qui suis sont les propriétés');
                aliExData.skuModule.productSKUPropertyList.forEach(function (nextProperty) {
                    console.log('Property  ' + nextProperty.skuPropertyName);
                    nextProperty.skuPropertyValues.forEach(function (nextPropertyDetail, index) {
                        console.log('propertyValueName  ' + nextPropertyDetail.propertyValueName);
                        console.log('imgPath  ' + nextPropertyDetail.skuPropertyImagePath);
                    });
                });


                // aliExData.skuModule.productSKUPropertyList.forEach(function(nextProperty) {
                //     console.log(nextProperty.skuPropertyValues);
                //     // console.log(nextProperty.skuPropertyValues.skuPropertyImagePath);
                // });
                // console.log(aliExData.skuModule.productSKUPropertyList[0].skuPropertyValues);

                console.log('ce qui suis est aliExData.imageModule');
                console.log(aliExData.imageModule);

                console.log('ce qui suis sont les détails techniques');
                aliExData.specsModule.props.forEach(function (nextProps) {
                    console.log(nextProps.attrName + '  ' + nextProps.attrValue);
                });

                // description produit "les grandes images dans la description"
                var descriptionUrlImages = aliExData.descriptionModule.descriptionUrl;
                aliExData.specsModule.props.forEach(function (nextProps) {

                    console.log(nextProps.attrName + '  ' + nextProps.attrValue);
                });
            }
        }


        var formData = new FormData();

        // url product
        formData.append("urlProduct", window.location.href);

        if (document.getElementsByClassName('overview-rating-average').length > 0) {
            var globalStars = parseInt(document.getElementsByClassName('overview-rating-average')[0].innerText.trim().replace(/\D/g, ''), 10) / 10;
            console.log("globalStars", globalStars);
        }
        if (document.getElementsByClassName('product-reviewer-reviews').length > 0) {
            var reviews = parseInt(document.getElementsByClassName('product-reviewer-reviews')[0].innerText.trim().replace(/\D/g, ''), 10);
            console.log("reviews", reviews);
        }
        if (document.getElementsByClassName('product-reviewer-sold').length > 0) {
            var orders = parseInt(document.getElementsByClassName('product-reviewer-sold')[0].innerText.trim().replace(/\D/g, ''), 10);
            console.log("orders", orders);
        }

        formData.append("globalStars", globalStars);
        formData.append("reviews", reviews);
        formData.append("orders", orders);

        // description big images product url
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
            console.log("description big images", bigImagesProductObj);
        }
        formData.append("descriptionBigImages", bigImagesProductObj);

        // product name
        if (document.getElementsByClassName('product-title-text').length > 0) {
            var productName = document.getElementsByClassName('product-title-text')[0].innerText;
            console.log("productName", productName);
        }
        formData.append("productName", productName);

        // price
        console.log('ce qui suis est le prix');
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
            console.log(price);
        }
        formData.append("price", price);



        // slider images product thumbnail 
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
            console.log("slider_images_product", slider_images_productObj);
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
                    console.log("color", colorPropertyObj);
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
                    console.log("size", sizePropertyObj);
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




