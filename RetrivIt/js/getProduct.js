// chrome extension scrapping product sheet from aliexpress

document.getElementById("getProduct").addEventListener('click', () => {

    function modifyDOM() {
        // !!! GERE L IMPORTATION DES DONNEES SUR UNE PAGE DE CATEGORY/COLLECTION ET SUR UNE PAGE DE BOUTIQUE DE VENDEUR !!!
        // entoure les cards avec les infos et le button add product
        
        function getProductCards() {
            // récupère les lass des cards à partir d'une page de catégorie
            var product_cards = document.getElementsByClassName('_3KNwG _2f4Ho');
            if (product_cards.length == 0) {
                // récupère les class des cards à partir d'une page de boutique d'un vendeur si les class '_3KNwG _2f4Ho n'existent pas et donc qu'on est sur une page de boutique de vendeur
                product_cards = document.getElementsByClassName('pic-rind');
            }

            // on habille les cards avec des bordures et des boutons pour add les produits
            for (let i = 0; i < product_cards.length; i++) {
                product_cards[i].onclick = function (event) {
                    event.preventDefault();
                };
                product_cards[i].style.border = 'solid 5px navy';
                product_cards[i].style.position = 'relative';

                var header_card = document.createElement('div');
                // header_card.classList.add('header_card');
                header_card.style.position = 'absolute';
                header_card.style.top = '0px';
                header_card.style.left = '0px';
                header_card.style.paddingTop = '7px';
                header_card.style.width = '100%';
                header_card.style.height = '35px';
                header_card.style.textAlign = 'center';
                header_card.style.backgroundColor = 'navy';
                header_card.style.color = 'white';
                header_card.innerText = product_cards[i].getElementsByClassName('_1XYdp')[0] ? product_cards[i].getElementsByClassName('_1XYdp')[0].textContent : 'Non communiqué';
                product_cards[i].appendChild(header_card);


                // add button
                var add_button = document.createElement('span');
                // header_card.classList.add('header_card');
                add_button.style.position = 'absolute';
                add_button.style.top = '40px';
                add_button.style.left = '0px';
                add_button.style.width = '100%';
                add_button.style.height = '45px';
                add_button.style.textAlign = 'center';
                add_button.style.backgroundColor = 'white';
                add_button.style.color = 'black';
                add_button.style.fontSize = '20px';
                add_button.style.zIndex = '10';

                add_button.innerText = 'Add product';
                product_cards[i].appendChild(add_button);



                // add_button.onclick = addProduct(product_cards[i].href);
                add_button.onclick = function (e) {
                    e.preventDefault();
                    // get card price

                    var cardPrice = product_cards[i].getElementsByClassName('_13_ga _37W_B');

                    // récupération du prix soit dans une page de catégorie soit dans une page de boutique de vendeur
                    if (cardPrice.length != 0) {
                        var from = 'category';
                        // si on est dans une page de catégorie/collection 
                        cardPrice = product_cards[i].getElementsByClassName('_13_ga _37W_B')[0];
                        // check if second span is ',' or '€' pour sélectionner les span qui contiennent le prix
                        if (cardPrice.getElementsByTagName('span')[1].textContent == ',') {
                            var price = cardPrice.getElementsByTagName('span')[0].textContent + '.' + cardPrice.getElementsByTagName('span')[2].textContent;
                        } else {
                            var price = cardPrice.getElementsByTagName('span')[0].textContent;
                        }
                    } else {
                        var from = 'store';
                        // on récupère le prix dans div.cost > b si on est dans une page de boutique d'un revendeur  
                        cardPrice = document.querySelector("div.cost > b").innerHTML;
                        // on extrait un chiffre suivi éventuellment d'une virgule et d'un ou plusieurs chiffres
                        const regex = /[0-9]+,?[0-9]*/;
                        cardPrice = cardPrice.match(regex);
                        price = cardPrice[0].replace(',', '.');
                    }

                    addProduct(product_cards[i].href, price, from);
                };

            }
        }

        getProductCards();

        function addProduct(url, price, from) {
            var data = new FormData();
            data.append('url', url);
            data.append('price', price);
            data.append('from', from);
            fetch('http://127.0.0.1:8000/importProduct', {
                method: 'post',
                body: data,
            })
                .then(console.log('res.dataUrl  --->  ok'))

        }




        // quand on pagine, attend 3sec et scroll pour déclencher getProductCards ce qui rafraichi product_cards
        function isExistPagination() {
            if (document.getElementsByClassName('next-pagination-pages')[0]) {

                var paginationButton = document.getElementsByClassName('next-pagination-pages')[0].querySelectorAll('button');

                for (let i = 0; i < paginationButton.length; i++) {
                    paginationButton[i].addEventListener("click", function (event) {
                        // setTimeout(function() { getProductCards(); }, 200);
                        setTimeout(function () { window.scrollTo(0, 1); }, 3000);

                    }, { passive: true });
                }
            }
        }

        window.addEventListener("scroll", function (event) {
            getProductCards();
            isExistPagination();
        }, { passive: true });



        // console.log(document.body);


        // console.log(window.open(myUrl));
        throw new Error("my error message");
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






document.getElementById("dev").addEventListener('click', () => {

    function devDOM() {


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
        code: '(' + devDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        //Here we have just the innerHTML and not DOM structure
        console.log('Popup script:')
        console.log(results[0]);
    });
});




