import React, { useContext, useRef } from 'react';
import CollectionContext from '../contexts/CollectionContext';
import Axios from 'axios';
import { loadProgressBar } from 'axios-progress-bar';
import { Editor } from '@tinymce/tinymce-react';
import { saveInTemporaryStorage } from '../functions/temporaryStorage/saveInTemporaryStorage';


const Tinyeditor = () => {

    const {
        descriptionCollection, setDescriptionCollection, setDescriptionCollectionForMeta, tinyLanguage
    } = useContext(CollectionContext);

    const editorRef = useRef(null);

    // reçois le contenu de Editor au format text "sans les balises" pour mettre à la place de metaDescrption s'il est vide
    const initDescriptionForMeta = () => {
        setDescriptionCollectionForMeta(editorRef.current.getContent({ format: 'text' }));
    };

    const handleDescriptionCollection = (description, editor) => {
        setDescriptionCollection(description);
        localStorage.setItem("descriptionCollection", description);
    };


    // save tinymce images in temporary Storage folder and db 
    function tinyMCE_image_upload_handler(blobInfo, success, failure, progress) {
        // loadProgressBar();
        let response = async () => {
            return saveInTemporaryStorage('tmp_tinyMceImages', blobInfo.blob())
        }
        //success gère le stockage en recevant le path dans le json {location : "le path/name est dans  response"}
        response().then(response => {
            success(response);
            failure('Un erreur c\'est produite ==> ', { remove: true });
        });
    };

    // handle add images and videos
    function handleCallBack(cb, value, meta) {
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
                loadProgressBar();
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
                                Axios.post(`http://127.0.0.1:8000/temporaryStoreImages`, videoFile,
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
                }
                }
                // initialValue={descriptionCollection}
                value={descriptionCollection}
                onEditorChange={
                    (newValue, editor) => {
                        handleDescriptionCollection(newValue, editor);
                    }
                }
                init={{
                    // setup: function (editor) {
                    //     editor.on('undo', function (e) {
                    //         console.log('undo event', e);
                    //     });
                    // },
                    setProgressState: true,
                    selector: '#tinyEditor',
                    entity_encoding: "raw",
                    branding: false,
                    width: '100%',
                    height: 250,
                    autoresize_bottom_margin: 50,
                    max_height: 500,
                    menubar: false,
                    statusbar: false,
                    toolbar_mode: 'floating',
                    language: tinyLanguage,
                    plugins: [
                        'advlist autolink lists image media charmap print preview anchor searchreplace visualblocks code fullscreen autoresize insertdatetime link media table paste code help wordcount fullscreen code'
                    ],
                    // menubar: 'tools insert',
                    toolbar: 'formatselect | undo redo | ' +
                        'bold italic underline forecolor backcolor | ' +
                        'alignment | ' +
                        'bullist numlist | ' +
                        'image | media | table | link | ' +
                        'removeformat | fullscreen | wordcount | code',
                    setup: function (editor) {
                        /* adding a group toolbar button */
                        editor.ui.registry.addGroupToolbarButton('alignment', {
                            icon: 'align-left',
                            tooltip: 'Alignment',
                            items: 'alignleft aligncenter alignright | alignjustify'
                        });

                    },
                    // init_instance_callback: my_function_fired_on_init(),
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
                    // setup: function (editor) {
                    //     editor.UndoManager.hasUndo(false)
                    //     editor.UndoManager.hasRedo(false)
                    // },
                    // a11y_advanced_options: true,
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; } body::-webkit-scrollbar-track { box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); border-radius: 10px; background-color: #f5f5f5; color: red;}' + 'tox-sidebar--sliding-closed { background-color: #f5f5f5; }'
                }}

            />
        </div>
    );
}

export default Tinyeditor;
