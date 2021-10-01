<!-- ---- this file IS INCLUDE IN productSheet.blade.php ---- -->

<div class="reviews_wrapper">

    <div id="header_reviews_wrapper">
        <h2>Commentaires clients</h2>
        <button id="reviewBtn">Écrire un avis</button>
    </div>

    <div id="showReviews">
        @foreach($reviews as $review)
        <div class="customerReview" id="{{ $review->id }}" onclick="modalDataCard(this.id)">

            @foreach($review->images_reviews as $imageReview)
            <img src="{{ asset($imageReview->path) }}" alt="{{ $imageReview->alt }}" class="imageReview">
            @if($loop->iteration >= 1)
            @break
            @endif
            @endforeach

            <div id="customerNameReview">
                <h4>{{ ucfirst($review->user->first_name)  }}</h4> &nbsp;
                <h4>{{ Str::limit(ucfirst($review->user->last_name), 1,  $end='.') }}</h4>
            </div>

            <span id="dateReview">
                {{ $review->created_at->format('d/m/Y') }}
            </span>

            <div id="starsReview">
                @for ($i = 0; $i < $review->stars; $i++)
                    <i class="fas fa-star"></i>
                    @endfor
                    @for ($j = 0; $j < (5 - $review->stars); $j++)
                        <i class="far fa-star"></i>
                        @endfor
            </div>
            <p id="textSlideReview">
                {{ $review->review }}
            </p>
        </div>
        @endforeach
    </div>


    <div id="myModal-card" class="modal-card">

        <div class="modal-card-content">

            <div id="slideshow-container">

                <!-- class="mySlides" Images de la card cutomer review -->

                <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
                <a class="next" onclick="plusSlides(1)">&#10095;</a>
            </div>

            <div id="slideText-container">
                <!-- <span class="close-card">x</span> -->
                <!-- name date stars -->
                <!-- Text de la card customer review -->
                <!-- miniImgReviewDiv -->
            </div>
        </div>
    </div>

    <script>
        // MODAL CUSTOMER CARD IMAGES
        var cardContent = null;
        var width = 0;
        var height = 0;
        var slideIndex = 1;

        function modalDataCard(reviewId) {
            axios.get(`http://127.0.0.1:8000/reviews/${reviewId}`)
                .then(res => {
                    // show the modal "slider customer images"
                    var modalCard = document.getElementById("myModal-card");
                    modalCard.style.display = "block";

                    // récupère la review et ses images s'il y en a
                    cardContent = res.data;
                    if (cardContent.imagesReview[0]) {
                        document.getElementById('slideText-container').style.width = '40%';
                        document.getElementById('slideshow-container').style.width = '60%';
                        document.getElementById('slideshow-container').style.display = 'flex';

                        // boucle sur imagesReview pour insérer toutes les images dans le dom
                        cardContent.imagesReview.map((image, index) => {
                            var imgCreatedLive = document.createElement('img');
                            imgCreatedLive.src = '../../../' + image.path;
                            imgCreatedLive.setAttribute('alt', image.alt);
                            imgCreatedLive.classList.add("mySlides");
                            document.getElementById('slideshow-container').appendChild(imgCreatedLive);
                            // récupère le size ing pour showSlides.
                            // sans ça impossible d'avoir le size pour le premier affichage !!!
                            if (index == 0) {
                                const img = new Image();
                                img.src = imgCreatedLive.src;
                                img.onload = function() {
                                    width = this.width;
                                    height = this.height;
                                    slideIndex = 1;
                                    showSlides(1);
                                }
                            }
                            if (index > 0) {
                                imgCreatedLive.style.display = 'none';
                            }
                        });
                    } else {
                        document.getElementById('slideText-container').style.width = '100%';
                        document.getElementById('slideshow-container').style.display = 'none';
                    }

                    // insertion du text de la card dans slideText-container
                    var close = document.createElement('span');
                    close.innerHTML = "\u2716"; // <-- le x pour close
                    close.setAttribute('class', 'close-card');
                    document.getElementById('slideText-container').appendChild(close);

                    var nameCustomer = document.createElement('h4');
                    nameCustomer.innerText = cardContent.name;
                    document.getElementById('slideText-container').appendChild(nameCustomer);

                    var dateCustomer = document.createElement('span');
                    dateCustomer.innerText = new Date(cardContent.review.created_at).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                    });
                    document.getElementById('slideText-container').appendChild(dateCustomer);

                    var divStars = document.createElement('div');
                    divStars.setAttribute('id', 'divStars');
                    document.getElementById('slideText-container').appendChild(divStars);
                    for (i = 0; i < cardContent.review.stars; i++) {
                        var starsCustomer = document.createElement('i');
                        starsCustomer.classList.add('fas', 'fa-star');
                        document.getElementById('divStars').appendChild(starsCustomer);
                    }
                    for (i = 0; i < (5 - cardContent.review.stars); i++) {
                        var starsCustomer = document.createElement('i');
                        starsCustomer.classList.add('far', 'fa-star');
                        document.getElementById('divStars').appendChild(starsCustomer);
                    }

                    var slideTextBody = document.createElement('div');
                    slideTextBody.setAttribute('id', 'slideText-body');
                    document.getElementById('slideText-container').appendChild(slideTextBody);

                    var textCustomer = document.createElement('p');
                    textCustomer.innerText = cardContent.review.review;
                    document.getElementById('slideText-body').appendChild(textCustomer);

                    var miniImgReviewDiv = document.createElement('div');
                    miniImgReviewDiv.setAttribute('id', 'miniImgReviewDiv');
                    document.getElementById('slideText-container').appendChild(miniImgReviewDiv);

                    // affichage des miniImages dans la partie texte du slider
                    if (cardContent.imagesReview[0]) {
                        cardContent.imagesReview.map((image, index) => {
                            // création des mini images
                            var miniImg = document.createElement('img');
                            miniImg.src = '../../../' + image.path;
                            miniImg.setAttribute('alt', image.alt);
                            miniImg.setAttribute('id', 'miniImage_' + (index + 1));
                            miniImg.style.boxSizing = 'border-box';
                            miniImg.classList.add("miniImg");
                            document.getElementById('miniImgReviewDiv').appendChild(miniImg);
                            // gestion des changements d'images par click sur les mini images
                            var miniImgId = document.getElementById('miniImage_' + (index + 1));
                            miniImgId.addEventListener('click', function() {
                                miniImageChange(parseInt(miniImgId.id.replace('miniImage_', ''), 10));
                            });
                            // bordure sur la 1er miniImg
                            if (index === 0) {
                                miniImg.style.border = "solid 2px black";
                            }
                        });
                    } else {
                        document.getElementById('miniImgReviewDiv').style.display = 'none';
                    }


                    // close modal
                    var spanCard = document.getElementsByClassName("close-card")[0];
                    spanCard.onclick = function() {
                        var imgCreatedLives = document.getElementsByClassName('mySlides');

                        // supprime toutes les images créées dans le dom avec imagesReview.map...
                        for (var i = imgCreatedLives.length - 1; i >= 0; i--) {
                            imgCreatedLives[0].parentNode.removeChild(imgCreatedLives[0])
                        };

                        // delete text from customer slider card and hide modal card
                        document.getElementById('slideText-container').innerHTML = '';
                        width = 0;
                        height = 0;
                        modalCard.style.display = "none";
                    }
                });
        }


        // SLIDER CUSTOMER CARD IMAGES -------------- //

        function plusSlides(n) {
            // on appel miniImageChange pour gérer les miniImg et ensuite showSlides est appelée pour afficher les grandes images
            miniImageChange(slideIndex += n);
        }

        function miniImageChange(n) {
            var slides = document.getElementsByClassName("miniImg");
            var ndx = 1;
            if (n > slides.length) {
                n = 1;
            }
            if (n < 1) {
                n = slides.length;
            }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.border = "none";
            }
            document.getElementById('miniImage_' + n).style.border = "solid 2px black";
            showSlides(slideIndex = n);
        }

        function showSlides(n) {
            var i;
            var slides = document.getElementsByClassName("mySlides");
            if (n > slides.length) {
                slideIndex = 1
            }
            if (n < 1) {
                slideIndex = slides.length
            }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            if (slides.length) {
                width = slides[slideIndex - 1].width;
                height = slides[slideIndex - 1].height;

                if (width > height) {
                    slides[slideIndex - 1].style.width = "100%";
                    slides[slideIndex - 1].style.height = "auto";
                }
                if (width <= height) {
                    slides[slideIndex - 1].style.height = "100%";
                    slides[slideIndex - 1].style.width = "auto";
                }
                if (width == height) {
                    slides[slideIndex - 1].style.borderRadius = "10px 0 0 10px";
                }
                slides[slideIndex - 1].style.display = "block"
            };
        }
    </script>

    <!-- The Modal --- The Modal ---The Modal ---The Modal -->
    <div id="myModal" class="modal">

        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <span class="close">&#10006;</span>
            </div>

            <div class="sliderReviews">

                <a id="a-slide-1" href="#commentaire-1"></a>
                <a id="a-slide-2" href="#commentaire-2"></a>
                <a id="a-slide-3" href="#commentaire-3"></a>
                <a id="a-slide-4" href="#commentaire-4"></a>

                <!-- stepper -->
                <div id="barrePageReview-1"></div>
                <div id="barrePageReview-2"></div>
                <div id="barrePageReview-3"></div>

                <!-- all sliders -->
                <div class="reviewsSlides modal-body">
                    <!-- slider 1 -->
                    <div id="commentaire-1">
                        <h3>Donnez votre note</h3>
                        <button class="scoreButtons" id="modal-button-score5" onclick="setScore(5, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i> <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i> &nbsp; &nbsp; Parfait !
                        </button>
                        <button class="scoreButtons" id="modal-button-score4" onclick="setScore(4, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i> <i class="fas fa-star"></i>
                            <i class="far fa-star"></i> &nbsp; &nbsp; J'aime
                        </button>
                        <button class="scoreButtons" id="modal-button-score3" onclick="setScore(3, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i> <i class="far fa-star"></i>
                            <i class="far fa-star"></i> &nbsp; &nbsp; Assez bien
                        </button>
                        <button class="scoreButtons" id="modal-button-score2" onclick="setScore(2, this.id)"><i class="fas fa-star"></i> <i class="fas fa-star"></i>
                            <i class="far fa-star"></i> <i class="far fa-star"></i>
                            <i class="far fa-star"></i> &nbsp; &nbsp; Je n'ai pas aimé
                        </button>
                        <button class="scoreButtons" id="modal-button-score1" onclick="setScore(1, this.id)"><i class="fas fa-star"></i> <i class="far fa-star"></i>
                            <i class="far fa-star"></i> <i class="far fa-star"></i>
                            <i class="far fa-star"></i> &nbsp; &nbsp; Je déteste
                        </button>
                    </div>
                    <!-- slider 2 -->
                    <div id="commentaire-2">
                        <div id="divTextReview">
                            <label for="textReview">Nous en dire plus !</label>
                            <textarea name="textReview" id="textReview" placeholder="Partagez votre expérience"></textarea>
                            <h5 id="warningReview">Veuillez écrire un commentaire</h5>
                        </div>

                        <div class="block-FileReview-BtnNext">
                            <div id="fileReview"></div>
                            <button id="btn-review-next" onclick="isEmptyReview()">Suivant &nbsp; <i class="fas fa-arrow-right"></i></i></button>
                        </div>

                        <ul id="nameFileReview"></ul>

                        <div class="arrowPrevious">
                            <i id="reply1" class="fas fa-reply"></i>
                        </div>
                    </div>
                    <!-- slider 3 -->
                    <div id="commentaire-3">
                        @guest
                        <input type="email" id="emailReveiw" placeholder="Email*">
                        <h5 id="warningEmailReview">Veuillez introduire une adresse email valide</h5>
                        <p>Par la présente, j'accepte les <a href="/conditionsUtilisation">Conditions générales d'utilisation</a> et la <a href="/vie-privee">Politique de Confidentialité</a> du site ainsi que l'affichage et le partage en ligne de mon avis</p>
                        <butoon id="btn-accept-CGU" onclick="isValidEmailReview()">Poster mon avis</butoon>
                        @endguest

                        @auth
                        <p>Par la présente, j'accepte les <a href="/conditionsUtilisation">Conditions générales d'utilisation</a> et la <a href="/vie-privee">Politique de Confidentialité</a> du site ainsi que l'affichage et le partage en ligne de mon avis</p>
                        <butoon id="btn-accept-CGU" onclick="storeReveiw()">Poster mon avis</butoon>
                        @endauth
                        <div class="arrowPrevious">
                            <i id="reply2" class="fas fa-reply"></i>
                        </div>
                    </div>
                    <!-- slider 4 -->
                    <div id="commentaire-4">
                        <br><br>
                        <h3>Merci!</h3>
                        <br>
                        <p>Votre avis a bien été envoyé</p>
                        <br>
                        <div class="shareReview">
                            <h3>Partagez le sur les réseaux sociaux</h3>
                        </div>
                        <br><br>
                        <button id="btn-closeReview" onclick="closeReview()">Fermer</button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>



<!-- create fake input to replace input type="file" button -->
<script>
    // crée un input file qui sera masqué et remplacé par un bouton pour un meilleur design 
    var fakeInput = document.createElement("input");
    fakeInput.type = "file";
    fakeInput.accept = "image/*";
    fakeInput.multiple = true;

    var getFileReview = document.getElementById('fileReview');
    getFileReview.innerText = "Ajouter des photos";

    // open files exploratore when click on button load file
    getFileReview.addEventListener('click', function() {
        fakeInput.click();
    });

    fakeInput.addEventListener("change", function() {
        var reviewFiles = fakeInput.files;

        Array.from(reviewFiles).forEach(file => {
            var li_FileReview = document.createElement("li");
            li_FileReview.innerText = file.name;
            var wrapper = document.getElementById("nameFileReview");
            wrapper.appendChild(li_FileReview);
            console.log(file);
        });

        // on boucle sur reviewFiles pour récupérer toutes les images
        if (reviewFiles) {
            for (var i = 0, len = reviewFiles.length; i < len; i++) {
                formData.append('image[]', reviewFiles[i]);
            }
        }

        console.log(reviewFiles[0].name)
        // handleFiles(files);
    });
</script>

<!-- Gestion modal ecire un avis-->
<script>
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("reviewBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
        // se positionne sur le premier slide
        document.getElementById('a-slide-1').click();
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // gestion score
    function setScore(scoreValue, scoreId) {

        var score = scoreValue;
        formData.append("stars", score);

        // met les background de tous les boutons de score en blanc 
        document.querySelectorAll('.scoreButtons').forEach(function(currentValue) {
            currentValue.style.backgroundColor = "#ffffff";
        })

        // donne un autre couleur ou bouton de score séléctionné
        document.getElementById(scoreId).style.backgroundColor = "rgb(112, 149, 250)";

        // passe au slide suivant quand on clique sur un bouton pour attribuer des étoiles
        document.getElementById('a-slide-2').click();

        // color la barre du stepper quand on arrive sur le slide courant 
        document.getElementById('barrePageReview-2').style.backgroundColor = "rgb(112, 149, 250)";

        // reviens au slide précédent 
        document.getElementById('reply1').addEventListener('click', function() {
            document.getElementById('a-slide-1').click();
            document.getElementById('barrePageReview-2').style.backgroundColor = "transparent";
        });

        document.getElementById('reply2').addEventListener('click', function() {
            document.getElementById('a-slide-2').click();
            document.getElementById('barrePageReview-3').style.backgroundColor = "transparent";
        });
    }

    // affiche warning si on a pas écrit de commentaire sinon passe au slide suivant
    function isEmptyReview() {
        if (document.getElementById("textReview").value == "") {
            document.getElementById("warningReview").style.display = "block";
        } else {
            document.getElementById('a-slide-3').click();
            document.getElementById('barrePageReview-3').style.backgroundColor = "rgb(112, 149, 250)";
            formData.append("review", document.getElementById("textReview").value);
        }
    }

    // affiche warning si on a pas écrit un mail valide sinon envoi les données via axios
    function isValidEmailReview() {
        var email = document.getElementById("emailReveiw").value;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(mailformat)) {
            document.getElementById("warningEmailReview").style.display = "none";
            // formData.append("email", email);
            // storeReveiw();
            document.getElementById('a-slide-4').click();
            hideBarrePageReview();
        } else {
            document.getElementById("warningEmailReview").style.display = "block";
        }
    }

    var formData = new FormData();

    function storeReveiw() {

        formData.append("product_id", <?php echo json_encode($product->id); ?>);
        formData.append("product_name", <?php echo json_encode($product->name); ?>);

        axios.post(`http://127.0.0.1:8000/storeReveiw`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                console.log('res.data  --->  ok');
                document.getElementById('a-slide-4').click();
                hideBarrePageReview();
            });
    }

    function closeReview() {
        // ferme la modal review et recharge la page en enlevant le  # et ce qui le suit
        history.replaceState(null, null, ' ');
        location.reload();
    }

    function hideBarrePageReview() {
        document.getElementById('barrePageReview-1').style.display = "none";
        document.getElementById('barrePageReview-2').style.display = "none";
        document.getElementById('barrePageReview-3').style.display = "none";
    }
</script>

<!-- load axios and put csrf -->
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<!-- <script src="{{ asset('js/app.js') }}"></script> -->
<script>
    let token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
    } else {
        console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
    }
</script>