@extends('layouts.head_admin')

@section('title')
<h2>Ajouter une catégorie</h2>
@endsection

@section('content')
<div class="main-panel">
    <div class="content-wrapper">
        <div class="row grid-margin">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">

                        <div id="drop-region-edit">
                            <button class="addButton" onclick="fakeInputAdd.click()">Importer des images</button>
                            <div className="drop-message">
                                Ou glissez déposez des images sur la page
                            </div>
                            <div id="image-preview-edit" class="withoutBlur"></div>
                        </div>

                        <script>
                            var dropRegion = null;
                            var imagePreviewRegion = null;
                            var formData = new FormData();
                            var tab = [];
                            // chargement des images déjà enregistrées
                            
                            var images_product = <?php echo json_encode($images_product); ?>;

                            var product_id = <?php echo json_encode($product_id); ?>;
           
                            // console.log($images_product, $product_id);

                            dropRegion = document.getElementById("drop-region-edit");
                            imagePreviewRegion = document.getElementById("image-preview-edit");

                            // open file selector when clicked on the drop region
                            var fakeInput = document.createElement("input");
                            fakeInput.type = "file";
                            fakeInput.accept = "image/*";
                            fakeInput.multiple = true;
                            // open files exploratore when click on dropRegion
                            // dropRegion.addEventListener('click', function() {
                            //     fakeInput.click();
                            // });

                            fakeInput.addEventListener("change", function() {
                                var files = fakeInput.files;
                                handleFiles(files);
                            });

                            // empèche le comportement par défault et la propagation
                            dropRegion.addEventListener('dragenter', preventDefault, false);
                            dropRegion.addEventListener('dragleave', preventDefault, false);
                            dropRegion.addEventListener('dragover', preventDefault, false);
                            dropRegion.addEventListener('drop', preventDefault, false);

                            dropRegion.addEventListener('drop', handleDrop, false);

                            // change the message if doesn't support drag & drop
                            var dragSupported = detectDragDrop();
                            if (!dragSupported) {
                                document.getElementsByClassName("drop-message")[0].innerHTML = 'Click to upload';
                            }

                            dropRegion.addEventListener('dragenter', highlight, false);
                            dropRegion.addEventListener('dragover', highlight, false);
                            dropRegion.addEventListener('dragleave', unhighlight, false);
                            dropRegion.addEventListener('drop', unhighlight, false);

                            // ajout d'images dans images_products
                            // -----------------------------------------------
                            var fakeInputAdd = document.createElement("input");
                            fakeInputAdd.type = "file";
                            fakeInputAdd.accept = "image/*";
                            fakeInputAdd.multiple = true;
                            fakeInputAdd.addEventListener("change", function() {

                                tab = [...fakeInputAdd.files];

                                for (var i = 0, len = tab.length; i < len; i++) {
                                    previewImage(fakeInputAdd.files[i]);
                                }

                                handleSubmit();
                                window.location.reload();
                            });
                            // ---------------------------------------------

                            // select pour changer l'ordre des images_products
                            //-----------------------------------------------
                            // var selectOrder = document.createElement("select");
                            // selectOrder.setAttribute("name", "selectOrder");
                            // selectOrder.setAttribute("id", "selectOrder");

                            // for (var j = 0; j < 12; j++) {
                            //     var optionOrder = document.createElement("option");
                            //     optionOrder.setAttribute("value", j + 1);
                            //     optionOrder.innerHTML = j + 1;
                            //     selectOrder.appendChild(optionOrder);
                            // }
                            // childrenContainer.appendChild(selectOrder); //Add the select list to the DOM


                            // selectOrder.addEventListener("change", function() {
                            //     var files = selectOrder.files;
                            //     handleFiles(files);
                            // });

                            //------------------------------------------------



                            function highlight() {
                                dropRegion.classList.add('highlighted');
                            }

                            function unhighlight() {
                                dropRegion.classList.remove("highlighted");
                            }

                            function preventDefault(e) {
                                e.preventDefault();
                                e.stopPropagation();
                            }


                            // récupère les files quand on drop et les envoi à handleFiles
                            function handleDrop(e) {
                                var dt = e.dataTransfer,
                                    files = dt.files;

                                if (files.length) {

                                    handleFiles(files);

                                } else {

                                    // check for img
                                    var html = dt.getData('text/html'),
                                        match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html),
                                        url = match && match[1];


                                    if (url) {
                                        uploadImageFromURL(url);
                                        return;
                                    }
                                }

                                function uploadImageFromURL(url) {
                                    var img = new Image;
                                    var c = document.createElement("canvas");
                                    var ctx = c.getContext("2d");

                                    img.onload = function() {
                                        c.width = this.naturalWidth; // update canvas size to match image
                                        c.height = this.naturalHeight;
                                        ctx.drawImage(this, 0, 0); // draw in image

                                        c.toBlob(function(blob) { // get content as blob
                                            handleFiles([blob]);
                                        }, 'image/png', 1);
                                    };
                                    img.onerror = function() {
                                        alert("Error in uploading");
                                    }
                                    img.crossOrigin = ""; // if from different origin
                                    img.src = url;
                                }
                            }


                            // affiche et sauvegarde les images
                            function handleFiles(files) {
                                tab.push(...files);
                                console.log(tab);
                                for (var i = 0, len = files.length; i < len; i++) {
                                    if (validateImage(files[i])) {
                                        previewImage(files[i]);
                                    }
                                }
                                handleSubmit();
                                tab = [];
                            }


                            function validateImage(image) {
                                // check the type
                                var validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
                                if (validTypes.indexOf(image.type) === -1) {
                                    alert("Invalid File Type");
                                    return false;
                                }

                                // check the size
                                var maxSizeInBytes = 10e6; // 10MB
                                if (image.size > maxSizeInBytes) {
                                    alert("File too large");
                                    return false;
                                }

                                return true;
                            }


                            // remplace une image
                            function replaceImagesProduct(editButton, id) {
                                var fakeInputEdit = document.createElement("input");
                                fakeInputEdit.type = "file";
                                fakeInputEdit.accept = "image/*";
                                fakeInputEdit.multiple = false;
                                editButton.addEventListener('click', function() {
                                    fakeInput.setAttribute('disabled', 'disabled');
                                    fakeInputEdit.click();
                                });

                                fakeInputEdit.addEventListener("change", function() {
                                    var files = fakeInputEdit.files;
                                    var data = new FormData();
                                    data.append("newImage", files[0]);
                                    data.append("id", id);
                                    axios.post(`http://127.0.0.1:8000/replaceImagesProduct`, data, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        })
                                        .then(res => {
                                            window.location.reload();
                                            console.log('res.data  --->  ok');

                                        });
                                });
                            }

                            // affiche toutes les images
                            showAllImages();

                            function showAllImages() {
                                console.log(images_product);
                                images_product.map((item, index) => {
                                    // container
                                    var imgView = document.createElement("div");
                                    imgView.className = "image-view-edit";
                                    imagePreviewRegion.appendChild(imgView);
                                    // previewing image
                                    var img = document.createElement("img");
                                    imgView.appendChild(img);

                                    img.src = window.location.origin + '/' + images_product[index].path;
                                    img.draggable = false;

                                    // edit button
                                    var editButton = document.createElement("button");
                                    editButton.className = "editButton";
                                    editButton.innerText = 'Modifier';
                                    editButton.onclick = replaceImagesProduct(editButton, images_product[index].id);
                                    imgView.appendChild(editButton);


                                    // delete button
                                    var deleteButton = document.createElement("button");
                                    deleteButton.className = "deleteButton";
                                    imgView.appendChild(deleteButton);

                                    // delete link
                                    var deleteLink = document.createElement('a');
                                    deleteLink.setAttribute('href', window.location.origin + '/' + 'deleteImagesProduct/' + images_product[index].id);
                                    deleteLink.innerHTML = 'Supprimer';
                                    deleteLink.onclick = function() {
                                        fakeInput.setAttribute('disabled', 'disabled')
                                    };
                                    deleteButton.appendChild(deleteLink);
                                });
                            }


                            // prévisualisation des images chargées
                            function previewImage(image) {
                                // container
                                var imgView = document.createElement("div");
                                imgView.className = "image-view-edit";
                                imagePreviewRegion.appendChild(imgView);

                                // previewing image
                                var img = document.createElement("img");
                                imgView.appendChild(img);
                                img.draggable = false;

                                // read the image...
                                var reader = new FileReader();
                                reader.onload = function(e) {
                                    img.src = e.target.result;
                                }

                                reader.readAsDataURL(image);
                                // window.location.reload();
                            }


                            function detectDragDrop() {
                                var div = document.createElement('div');
                                return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
                            }


                            function handleSubmit(e) {
                                // on boucle sur tab pour récupérer toutes les images
                                if (tab) {
                                    for (var i = 0, len = tab.length; i < len; i++) {
                                        if (validateImage(tab[i])) {
                                            formData.append('image[]', tab[i]);
                                        }
                                    }
                                }

                                formData.append('id', product_id);

                                axios.post(`http://127.0.0.1:8000/addImagesProduct`, formData, {
                                        headers: {
                                            'Content-Type': 'multipart/form-data'
                                        }
                                    })
                                    .then(res => {
                                        window.location.reload();
                                        console.log('res.data  --->  ok');

                                    });
                            }
                        </script>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

