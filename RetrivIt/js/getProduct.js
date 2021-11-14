
document.getElementById("getProduct").addEventListener('click', () => {
    
    function modifyDOM() {
        //You can play with your DOM here or check URL against your regex
        console.log(document.body);
        console.log(window.location.href);


        // document.getElementsByClassName('feedback-item')[0].getElementsByClassName('fb-main')[0];

        // var customerStars = document.getElementsByClassName('feedback-item')[3].querySelector('.star-view').querySelector('span').style.width;

        // var customerComment = document.getElementsByClassName('feedback-item')[0].querySelector('.buyer-feedback').firstElementChild.innerText;

        // var dateCustomerComment = document.getElementsByClassName('feedback-item')[0].querySelector('.buyer-feedback').lastElementChild.innerText;

        // // var imagesCustomerComment = document.getElementsByClassName('feedback-item')[0].querySelector('.util-clearfix').querySelectorAll('li')[1];       
        
        // var imagesCustomerComment = document.getElementsByClassName('feedback-item')[0].querySelector('.util-clearfix').querySelectorAll('li');
        // for (let i = 0; i < imagesCustomerComment.length; i++) {
        //     console.log(imagesCustomerComment[i]);
        // }

        // var allReviews = document.getElementsByClassName('feedback-item')[0];
        // console.log(allReviews.getElementsByClassName('fb-main')[0].innerHTML);
        // // for (let i = 0; i < allReviews.length; i++) {
        // //     console.log(allReviews[i].getElementsByClassName('fb-main')[0].innerHTML);
        // // }
  
        var formData = new FormData();

        // urm product
        formData.append("urlProduct", window.location.href);

        var globalStars = document.getElementsByClassName('overview-rating-average')[0].innerText;
        var reviews = document.getElementsByClassName('product-reviewer-reviews')[0].innerText;
        var orders = document.getElementsByClassName('product-reviewer-sold')[0].innerText;
        formData.append("globalStars", globalStars);
        formData.append("reviews", reviews);
        formData.append("orders", orders);

        // big images product url
        var divImg = document.getElementsByClassName('product-overview')[0];
        var images = divImg.getElementsByTagName("img");
        var bigImagesProductUrl = [];
        for (let i = 0; i < images.length; i++) {
            bigImagesProductUrl.push(images[i].src);
        }
        var bigImagesProductUrlObj = JSON.stringify(bigImagesProductUrl);
        formData.append("bigImagesProductUrl", bigImagesProductUrlObj);

        // product name
        let productName = document.getElementsByClassName('product-title-text')[0].innerText;
        formData.append("productName", productName);

        // price
        const myelements = document.getElementsByTagName("div");
        var price = null;
        for (let i = 0; i < myelements.length; i++) {
            if (myelements[i].classList.contains("product-price-current")) {
                var product_price_current = true;
            }
        }
        if (product_price_current) {
            price = document.getElementsByClassName('product-price-current')[0].innerText;
        } else {
            price = document.getElementsByClassName('uniform-banner-box-price')[0].innerText;
        }

        formData.append("price", price);

        // slider images product 
        let images_view_item = document.getElementsByClassName('images-view-item');
        var slider_images_product = [];
        if (images_view_item.length > 0) {
            for (let i = 0; i < images_view_item.length; i++) {
                slider_images_product.push(images_view_item[i].innerHTML);
            }
        }
        var slider_images_productObj = JSON.stringify(slider_images_product);
        formData.append("slider_images_product", slider_images_productObj);

        // récupère les class des propriétés comme couleur, taille,...
        let property = document.getElementsByClassName('sku-title');
        var colorProperty = {};
        var sizeProperty = [];
        for (let i = 0; i < property.length; i++) {
            let titleProperty = property[i].firstChild.textContent.replace('"', '');
            console.log(titleProperty);

            var curentProperty = '';


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




