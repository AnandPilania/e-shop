<span id="quantityBuy">Quantité</span>
        <div class="nbArticles">
            <div class="wrapper_quantity">
                <button class="btn-quantity" onclick="dec_NbArticle(event), addQuantityToCart(event)" aria-label="Augmenter la quantité de l'article de un">-</button>

                <input type="text" maxlength="3" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value="1" id="quantity" name="quantity" class="nbArticles_input" onchange="addQuantityToCart(event)">

                <button onclick="inc_NbArticle(event), addQuantityToCart(event)" aria-label="Réduire la quantité de l'article de un">+</button>
            </div>
        </div>


        <!-- gestion input quantity -->
        <script>
            // ajoute 1 à la quantité
            const inc_NbArticle = (e) => {
                e.preventDefault();
                if (document.getElementById('quantity').value < 999) {
                    document.getElementById('quantity').value++;
                }
            };

            // enlève 1 de la quantité
            const dec_NbArticle = (e) => {
                e.preventDefault();
                if (document.getElementById('quantity').value > 1) {
                    document.getElementById('quantity').value--;
                }
            };

            // empèche le paste sur l'input quantité de produit
            var inputQuantity = document.getElementById('quantity');
            inputQuantity.addEventListener('paste', e => e.preventDefault());

            // met à 1 la quantité si elle est == à '' ou == à 0
            window.addEventListener('click', e => {
                if (document.getElementById('quantity').value == '' || document.getElementById('quantity').value == 0)
                    document.getElementById('quantity').value = 1
            });
        </script>