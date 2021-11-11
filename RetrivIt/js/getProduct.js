
document.getElementById("getProduct").addEventListener('click', () => {
    console.log("Popup DOM fully loaded and parsed");

    function modifyDOM() {
        //You can play with your DOM here or check URL against your regex
        console.log(document.body);
        console.log(window.location.href);

        var Xpath = '//*[@id="product-description"]/div/div[2]/div/div[2]/div/div[1]/div/p[2]/img[1]';

        var headings = document.evaluate(Xpath, document, null, XPathResult.ANY_TYPE, null);
        var thisHeading = headings.iterateNext();
        var alertText = "Le résultat:\n";
        while (thisHeading) {
          alertText += thisHeading.textContent + "\n";
          thisHeading = headings.iterateNext();
        }
        console.log(alertText); // Alerts the text of all h2 elements

        // console.log(result);

        // var xpathResult = xmlDoc.evaluate( xpathExpression, contextNode, namespaceResolver, resultType, result );

        // product name
        let productName = document.getElementsByClassName('product-title-text')[0].innerText;
        console.log(productName);

        // price
        const myelements = document.getElementsByTagName("div");
        for (let i = 0; i < myelements.length; i++) {
            if (myelements[i].classList.contains("product-price-current")) {
                var product_price_current = true;
            }
        }
        if (product_price_current) {
            let price = document.getElementsByClassName('product-price-current')[0].innerText;
            console.log(price.replace('€', ''));
        } else {
            let price = document.getElementsByClassName('uniform-banner-box-price')[0].innerText;
            console.log(price.replace('€', ''));
        }

        // slider images product 
        let images_view_item = document.getElementsByClassName('images-view-item');
        if (images_view_item.length > 0) {
            for (let i = 0; i < images_view_item.length; i++) {
                console.log(images_view_item[i].innerHTML);
            }
        }

        // récupère les class des propriétés comme couleur, taille,...
        let property = document.getElementsByClassName('sku-title');
        for (let i = 0; i < property.length; i++) {
            let titleProperty = property[i].firstChild.textContent.replace('"', '');
            console.log(titleProperty);

            var curentProperty = '';


            if (titleProperty == 'Couleur' || titleProperty == 'Color') {
                let color = document.getElementsByClassName('sku-property-image');
                if (color.length > 0) {
                    for (let i = 0; i < color.length; i++) {
                        console.log(color[i].innerHTML);
                    }
                }
            }

            if (titleProperty == 'Taille' || titleProperty == 'Size') {
                let taille = document.getElementsByClassName('sku-property-text');
                if (taille.length > 0) {
                    for (let i = 0; i < taille.length; i++) {
                        console.log(taille[i].innerText);
                    }
                }
            }
        }




        var formData = new FormData();

        formData.append("body", document.getElementsByClassName('product-title-text')[0].innerText);


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




