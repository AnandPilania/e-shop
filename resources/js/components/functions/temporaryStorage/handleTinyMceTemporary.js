import Axios from "axios";

export function handleTinyMceTemporary(htmlContent) {
    let div_html_content = document.createElement("div");

    // get data htmlContent from tiny Editor
    if (htmlContent.length > 0) div_html_content.innerHTML = htmlContent;

    let imgs_vids = div_html_content.querySelectorAll('img, source');
    let img_video_dom_tab = Array.from(imgs_vids);

    // récupère toutes les src des images ou videos présents dans htmlContent
    let img_video_dom_tab_src = []; 
    img_video_dom_tab.forEach(item => {
        img_video_dom_tab_src.push(item.src.replace(window.location.origin + '/', ''))
    });

    let tinySrcList = new FormData;
    tinySrcList.append('value', img_video_dom_tab_src);

    Axios.post(`http://127.0.0.1:8000/handleTinyMceTemporaryElements`, tinySrcList,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            console.log('images and videos been handled');
            return res.data;
        })
        .catch(error => {
            console.log('Error : ' + error.status);
        });

    div_html_content.remove();
    return;

}