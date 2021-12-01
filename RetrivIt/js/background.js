var result = {};
result['url'] = 'http://127.0.0.1:8000/importProduct';
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'test') {

        (async () => {
            var response = await fetch(request.url);
            switch (response.status) {
                // status "OK"
                case 200:
                    result['page'] = await response.text();
                    break;
                // status "Not Found"
                case 404:
                    result['page'] = 'Not Found';
                    break;
            }
        })();
    }
    sendResponse(result);
})






