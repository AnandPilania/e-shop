<style>
    /* modal_cart background */
    .modal_cart {
        display: none;
        position: fixed;
        z-index: 1;
        padding-top: 100px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.4);
    }

    /* Modal_cart Content */
    .modal-content_cart {
        position: relative;
        background-color: #fefefe;
        margin: auto;
        padding: 0;
        border: 1px solid #888;
        width: 80%;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        -webkit-animation-name: animatetop_cart;
        -webkit-animation-duration: 0.4s;
        animation-name: animatetop_cart;
        animation-duration: 0.4s
    }

    /* Add Animation */
    @-webkit-keyframes animatetop_cart {
        from {
            top: -300px;
            opacity: 0
        }

        to {
            top: 0;
            opacity: 1
        }
    }

    @keyframes animatetop_cart {
        from {
            top: -300px;
            opacity: 0
        }

        to {
            top: 0;
            opacity: 1
        }
    }

    .modal-body_cart {
        padding: 2px 16px;
    }
</style>

<!-- The Modal_Cart -->
<div id="modal_double_in_cart" class="modal_cart">

    <!-- Modal_cart content -->
    <div class="modal-content_cart">
        <div class="modal-body_cart">
            <h5 id="message_modal_cart"></h5>
        </div>
        <button>Oui</button>
        <button onclick="modalCart.style.display = 'none'">Annuler</button>
    </div>

</div>

<script>
    var modalCart = document.getElementById("modal_double_in_cart");
    var spanCloseCart = document.getElementsByClassName("close_cart")[0];

    const messageDoubleInCart = (nameProdcut) => {
        document.getElementById("message_modal_cart").innerText = "l'article " + nameProdcut + " est déjà dans votre panier. <br> Voulez-vous augmenter la quantité ?";
        modalCart.style.display = "block";
    }

</script>