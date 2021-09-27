<!-- ---- this file IS INCLUDE IN productSheet.blade.php ---- -->

<div class="reviews_wrapper">

    <div id="header_reviews_wrapper">
        <h2>Commentaires clients</h2>
        <button id="reviewBtn">Écrire un avis</button>
    </div>

    <div id="showReviews">
        @foreach($reviews as $review)
        <div class="customerReview" id="{{ $review->id }}" onclick="modalCard(this.id)">

            @foreach($review->images_reviews as $imageReview)
            <img src="{{ asset($imageReview->path) }}" alt="{{ asset($imageReview->alt) }}" class="imageReview" id="imgCard{{ $review->id }}">
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
            <p>
                {{ $review->review }}
            </p>
        </div>
        @endforeach
    </div>


    <div id="myModal-card" class="modal-card">
        <div class="slideshow-container">

            <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
            <a class="next" onclick="plusSlides(1)">&#10095;</a>
            <div class="mySlides fade">

            </div>

            <script>
                // MODAL CUSTOMER CARD IMAGES
                var card = null;
                function modalCard(reviewId) {
                    card = reviewId;
                    console.log(reviewId);

                    axios.get(`http://127.0.0.1:8000/reviews/${reviewId}`)
                .then(res => {
                    // console.log('res.data  --->  ok');
                    console.log(res.data);

                });
        

                    var modalCard = document.getElementById("myModal-card");
                    var image = document.createElement('img');
                    // image.src = imagePath;
                    modalCard.appendChild(image);

                    var clickedCard = document.getElementById(card);

                    // var spanCard = document.getElementsByClassName("close-card")[0];

                    clickedCard.onclick = function() {
                        modalCard.style.display = "block";
                    }

                    // // When the user clicks on <span> (x), close the modal
                    // spanCard.onclick = function() {
                    //     modalCard.style.display = "none";
                    // }

                    // When the user clicks anywhere outside of the modal, close it
                    window.onclick = function(event) {
                        if (event.target == modalCard) {
                            modalCard.style.display = "none";
                        }
                    }
                }


                // SLIDER CUSTOMER CARD IMAGES
                var slideIndex = 1;
                showSlides(slideIndex);

                function plusSlides(n) {
                    showSlides(slideIndex += n);
                }

                function currentSlide(n) {
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
                    slides[slideIndex - 1].style.display = "block";
                }
            </script>
        </div>

        <!-- The Modal --- The Modal ---The Modal ---The Modal -->
        <div id="myModal" class="modal">

            <!-- Modal content -->
            <div class="modal-content">
                <div class="modal-header">
                    <span class="close">&times;</span>
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