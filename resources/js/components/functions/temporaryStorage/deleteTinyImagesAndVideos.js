import Axios from "axios";

// detect if tinyMCE images are deleted and remove it from folder and db
export function deleteTinyImagesAndVideos(htmlContent) {
    let div_html_content = document.createElement("div");
    
    // get data from editorRef
    if (htmlContent.length > 0) div_html_content.innerHTML = htmlContent;

    let imgs_vids = div_html_content.querySelectorAll('img, source');
    let img_video_dom_tab = Array.from(imgs_vids);

    let img_video_dom_tab_src = []; // <-- contiendra toutes les src des images ou videos dans Editor
    img_video_dom_tab.forEach(item => {
        img_video_dom_tab_src.push(item.src.replace(window.location.origin + '/', ''))
    });

    // check si file est un base64 pour ne pas envoyer la requète tant qu'il n'a pas été save dans la db et le dossier et qu'on a pas récupéré son path pour le src
    function checkNoBase64(file) {
        return !file.includes('data:image') && !file.includes('data:video');
    }
    let noBase64_image_video = img_video_dom_tab_src.every(checkNoBase64);

    if (noBase64_image_video) {
        let tinyImagesVideosList = new FormData;

        // lastToDelete is used to informe that it is the last image or video to delete
        if (img_video_dom_tab.length === 0) {
            tinyImagesVideosList.append('lastToDelete', true);
        } else {
            tinyImagesVideosList.append('lastToDelete', false);
        }

        tinyImagesVideosList.append('value', img_video_dom_tab_src);
        console.log('img_video_dom_tab_src  ', img_video_dom_tab_src)
        Axios.post(`http://127.0.0.1:8000/deleteTinyMceTemporayStoredImagesVideos`, tinyImagesVideosList,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                console.log('images and videos been handled');
                tinyImagesVideosList.append('lastToDelete', false);
                return res.data;
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });

        div_html_content.remove();
        return;
    }
}