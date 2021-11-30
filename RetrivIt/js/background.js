
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'test') {
        // var url = new FormData();
        // url.append("url", request.url);
        // fetch('http://127.0.0.1:8000/importProduct', {
        //     method: 'post',
        //     body: url,
        // })
        //     .then(console.log('res.dataUrl  --->  ok'));

        console.log(request.url)
        sendResponse(request.url);
    }
});

