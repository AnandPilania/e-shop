import React, { useEffect, useContext, useRef } from 'react';
import CollectionContext from '../contexts/CollectionContext';
import Axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { saveInTemporaryStorage } from '../functions/temporaryStorage/saveInTemporaryStorage';


const Tinyeditor = () => {

    const {
        descriptionCollection, setDescriptionCollection, setDescriptionCollectionForMeta, tinyLanguage
    } = useContext(CollectionContext);

    // reçois le contenu de Editor au format text "sans les balises" pour mettre à la place de metaDescrption s'il est vide
    const initDescriptionForMeta = () => {
        setDescriptionCollectionForMeta(editorRef.current.getContent({ format: 'text' }));
    };

    const handleDescriptionCollection = (description) => {
        setDescriptionCollection(description);
        localStorage.setItem("descriptionCollection", description);
    };

    const editorRef = useRef(null);

    // detect if tinyMCE images are deleted and remove it from folder and db
    function handleDeleteTinyImagesAndVideos(str) {

        let Div = document.createElement("div");
        // when init_instance_callback('')
        if (str.length === 0) {
            if (editorRef.current) {
                Div.innerHTML = editorRef.current.getContent();
            }
        }
        // when tinyMCE_image_upload_handler with (response)
        if (str.length > 0) {
            Div.innerHTML = str;
        }

        let imgs_vids = Div.querySelectorAll('img, source'); 
        let img_video_dom_tab = Array.from(imgs_vids);
        
        let img_video_dom_tab_src = []; // <-- contiendra toutes les src des images ou videos dans Editor
        img_video_dom_tab.forEach(item => {
            img_video_dom_tab_src.push(item.src.replace(window.location.origin, ''))
        });

        // check si file est un base64 pour ne pas envoyer la requète tant qu'il n'a pas été save dans la db et le dossier et qu'on a pas récupéré son path pour le src
        function checkNoBase64(file) {
            return !file.includes('data:image') && !file.includes('data:video');
        }
        let noBase64_image_video = img_video_dom_tab_src.every(checkNoBase64);

        if (noBase64_image_video) {
            let tinyImagesVideosList = new FormData;
            tinyImagesVideosList.append('value', img_video_dom_tab_src);

            Axios.post(`http://127.0.0.1:8000/deleteTinyMceTemporayStoredImagesVideos`, tinyImagesVideosList,
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

            Div.remove();
            return;
        }
    }

    // save tinymce images in temporary Storage folder and db table
    function tinyMCE_image_upload_handler(blobInfo, success, failure, progress) {
        let tab = [];
        tab.push(blobInfo.blob());
        let response = async () => {
            return saveInTemporaryStorage('tmp_tinyMceImages', tab)
        }
        //success gère le stockage en recevant le path dans le json {location : "le path/name est dans  response"}
        response().then(response => {
            success(response);
            handleDeleteTinyImagesAndVideos(response);
            failure('Un erreur c\'est produite ==> ', { remove: true });
        });
    };

    function handleCallBack(cb, value, meta) { console.log('yes');
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        let filesAccepted = meta.filetype === 'media' ? 'video/*' : 'image/*';
        input.setAttribute('accept', filesAccepted);
        input.onchange = function () {
            var file = this.files[0];

            if (meta.filetype == 'image') {
                var reader = new FileReader();
                reader.onload = function () {
                    var id = 'blobid' + (new Date()).getTime();
                    var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                    var base64 = reader.result.split(',')[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);

                    /* call the callback and populate the Title field with the file name */
                    cb(blobInfo.blobUri(), { title: file.name });
                };
                reader.readAsDataURL(file);
            };

            if (meta.filetype == 'media') {
                var reader = new FileReader();
                var videoElement = document.createElement('video');
                reader.onload = (e) => {
                    videoElement.src = e.target.result;
                    var timer = setInterval(() => {
                        if (videoElement.readyState === 4) {
                            if (videoElement.duration) {
                                let videoFile = new FormData;
                                videoFile.append('key', 'tmp_tinyMceVideos');
                                videoFile.append('value', file);
                                Axios.post(`http://127.0.0.1:8000/temporaryStoreTinyDescription`, videoFile,
                                    {
                                        headers: {
                                            'Content-Type': 'multipart/form-data'
                                        }
                                    })
                                    .then(res => {
                                        console.log('res.data  --->  ok');
                                        if (res.data) {
                                            cb(res.data, { source2: 'alt.ogg', poster: '' });

                                        }
                                    });
                            }
                            clearInterval(timer);
                        }
                    }, 500)
                }
                reader.readAsDataURL(file);
            }
        }
        input.click();
    }


    return (
        <div className="sub-div-vert-align">
            <Editor
                id='tinyEditor'
                apiKey="859uqxkoeg5bds7w4yx9ihw5exy86bhtgq56fvxwsjopxbf2"
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                    initDescriptionForMeta();
                    console.log(editorRef.current.getContent({ format: 'html' }));
                }
                }
                // initialValue={descriptionCollection}
                value={descriptionCollection}
                onEditorChange={
                    (newText) => {
                        handleDescriptionCollection(newText);
                    }
                }
                init={{
                    selector: '#tinyEditor',
                    entity_encoding: "raw",
                    branding: false,
                    width: '100%',
                    height: 250,
                    autoresize_bottom_margin: 50,
                    max_height: 500,
                    menubar: false,
                    statusbar: false,
                    toolbar_mode: 'wrap',
                    language: tinyLanguage,
                    plugins: [
                        'advlist autolink lists link image media charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen autoresize',
                        'insertdatetime media table paste code help wordcount fullscreen code'
                    ],
                    // menubar: 'tools insert',
                    toolbar: 'formatselect | undo redo | ' +
                        'bold italic underline forecolor backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'image ' +
                        'media ' +
                        'removeformat | fullscreen | wordcount | code',
                    init_instance_callback: handleDeleteTinyImagesAndVideos(''),
                    // configure la base du path du stockage des images  
                    relative_urls: false,
                    remove_script_host: false,
                    document_base_url: 'http://127.0.0.1:8000',
                    //------------------------------------------
                    images_upload_handler: tinyMCE_image_upload_handler,
                    // allow drop images
                    paste_data_images: true,
                    /* enable title field in the Image dialog*/
                    image_title: true,
                    file_picker_types: 'image media',
                    /* and here's our custom image picker*/
                    file_picker_callback: handleCallBack,
                    // file_picker_callback: function (cb, value, meta) {
                    //     var input = document.createElement('input');
                    //     input.setAttribute('type', 'file');
                    //     let filesAccepted = meta.filetype === 'media' ? 'video/*' : 'image/*';
                    //     input.setAttribute('accept', filesAccepted);
                    //     input.onchange = function () {
                    //         var file = this.files[0];

                    //         if (meta.filetype == 'image') {
                    //             var reader = new FileReader();
                    //             reader.onload = function () {
                    //                 var id = 'blobid' + (new Date()).getTime();
                    //                 var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                    //                 var base64 = reader.result.split(',')[1];
                    //                 var blobInfo = blobCache.create(id, file, base64);
                    //                 blobCache.add(blobInfo);

                    //                 /* call the callback and populate the Title field with the file name */
                    //                 cb(blobInfo.blobUri(), { title: file.name });
                    //             };
                    //             reader.readAsDataURL(file);
                    //         };

                    //         if (meta.filetype == 'media') {
                    //             var reader = new FileReader();
                    //             var videoElement = document.createElement('video');
                    //             reader.onload = (e) => {
                    //                 videoElement.src = e.target.result;
                    //                 var timer = setInterval(() => {
                    //                     if (videoElement.readyState === 4) {
                    //                         if (videoElement.duration) {
                    //                             let videoFile = new FormData;
                    //                             videoFile.append('key', 'tmp_tinyMceVideos');
                    //                             videoFile.append('value', file);
                    //                             Axios.post(`http://127.0.0.1:8000/temporaryStoreTinyDescription`, videoFile,
                    //                                 {
                    //                                     headers: {
                    //                                         'Content-Type': 'multipart/form-data'
                    //                                     }
                    //                                 })
                    //                                 .then(res => {
                    //                                     console.log('res.data  --->  ok');
                    //                                     if (res.data) {
                    //                                         cb(res.data, { source2: 'alt.ogg', poster: '' });

                    //                                     }
                    //                                 });
                    //                         }
                    //                         clearInterval(timer);
                    //                     }
                    //                 }, 500)
                    //             }
                    //             reader.readAsDataURL(file);
                    //         }
                    //     }
                    //     input.click();
                    //     console.log('value  ', value);
                    //     console.log('meta  ', meta);
                    // },
                    media_url_resolver: function (data, resolve/*, reject*/) {
                        if (data.url.indexOf(data) !== -1) {
                            var embedHtml =
                                '<iframe src="' + data.url +
                                '" width="' + data.width +
                                '" height="' + data.height +
                                '" ></iframe>';
                            resolve({ html: embedHtml });
                        } else {
                            resolve({ html: '' });
                        }
                    },
                    video_template_callback: function (data) {

                        return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' + '<source src="' + data.source + '"' + (data.sourcemime ? ' type="' + data.sourcemime + '"' : '') + ' />\n' + (data.altsource ? '<source src="' + data.altsource + '"' + (data.altsourcemime ? ' type="' + data.altsourcemime + '"' : '') + ' />\n' : '') + '</video>';
                    },
                    // a11y_advanced_options: true,
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; } body::-webkit-scrollbar-track { box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); border-radius: 10px; background-color: #f5f5f5; color: red;}' + 'tox-sidebar--sliding-closed { background-color: #f5f5f5; }'
                }}
            />
        </div>
    );
}

export default Tinyeditor;
