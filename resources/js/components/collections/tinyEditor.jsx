import React, { useContext, useRef } from 'react';
import CollectionContext from '../contexts/CollectionContext';
import Axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { saveInTemporaryStorage } from '../functions/temporaryStorage/saveInTemporaryStorage';


const Tinyeditor = () => {

    const {
        descriptionCollection, setDescriptionCollection,
    } = useContext(CollectionContext);

    const handleDescriptionCollection = (description) => {
        setDescriptionCollection(description);
        localStorage.setItem("descriptionCollection", description);
    };

    const editorRef = useRef(null);

    // detect if tinyMCE images are deleted and remove it from folder and db
    function handleDeleteTinyImage(str) {

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

        let imgs = Div.getElementsByTagName('img');
        let img_dom_tab = Array.from(imgs);

        let base_url = window.location.origin;
        let img_dom_tab_src = [];
        img_dom_tab.forEach(image => img_dom_tab_src.push(image.src.replace(base_url, '')));

        // check if is a base64 file
        let noDataImage = img_dom_tab_src.every(src => {
            if (src.includes('data:image')) {
                return false;
            }
            return true;
        })

        if (noDataImage && img_dom_tab_src.length > 0) {

            let tinyImageToDelete = new FormData;
            tinyImageToDelete.append('key', 'tmp_tinyMceImages');
            tinyImageToDelete.append('value', img_dom_tab_src);

            Axios.post(`http://127.0.0.1:8000/deleteTinyMceTemporayStoredImages`, tinyImageToDelete,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(res => {
                    console.log('images handled');
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
        //success gère le stockage avec le json {location : "le path est dans  response"}
        response().then(response => {
            success(response);
            handleDeleteTinyImage(response);
            failure('Un erreur c\'est produite ==> ', { remove: true });
        });
    };



    return (
        <div className="sub-div-vert-align">
            <Editor
                apiKey="859uqxkoeg5bds7w4yx9ihw5exy86bhtgq56fvxwsjopxbf2"
                onInit={(evt, editor) => editorRef.current = editor}
                // initialValue={descriptionCollection}
                value={descriptionCollection}
                onEditorChange={
                    (newText) => {
                        handleDescriptionCollection(newText);
                    }
                }
                init={{
                    entity_encoding: "raw",
                    branding: false,
                    width: '100%',
                    height: 250,
                    autoresize_bottom_margin: 50,
                    max_height: 500,
                    menubar: true,
                    statusbar: false,
                    content_langs: [
                        { title: 'Arab', code: 'ar' },
                        { title: 'English', code: 'en_US' },
                        { title: 'Spanish', code: 'es_419' },
                        { title: 'French', code: 'fr_FR' },
                        { title: 'German', code: 'de' },
                        { title: 'Italian', code: 'it_IT' },
                        { title: 'Portuguese', code: 'pt_BR' },
                        { title: 'Russe', code: 'ru_RU' },
                        { title: 'Chinese', code: 'zh_CN' }
                    ],
                    language: 'fr_FR',
                    // langue_url: '@tinymce/tinymce-react/langs',
                    plugins: [
                        'advlist autolink lists link image media charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen autoresize',
                        'insertdatetime media table paste code help wordcount fullscreen code'
                    ],
                    menubar: 'tools insert',
                    toolbar: 'wordcount | undo redo | formatselect | ' +
                        'bold italic underline forecolor backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'image ' +
                        'media ' +
                        'removeformat | help | fullscreen ' +
                        'language ',
                    init_instance_callback: handleDeleteTinyImage(''),
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
                    file_picker_callback: function (cb, value, meta) {
                        var input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.onchange = function () {
                            var file = this.files[0];

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

                        input.click();
                    },
                    video_template_callback: function (data) {
                        return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' + '<source src="' + data.source + '"' + (data.sourcemime ? ' type="' + data.sourcemime + '"' : '') + ' />\n' + (data.altsource ? '<source src="' + data.altsource + '"' + (data.altsourcemime ? ' type="' + data.altsourcemime + '"' : '') + ' />\n' : '') + '</video>';
                    },
                    // a11y_advanced_options: true,
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
        </div>
    );
}

export default Tinyeditor;
