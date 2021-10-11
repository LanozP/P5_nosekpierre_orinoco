// Initialisation du panier
function initConfirm() {

    let check = document.querySelector(".page-confirm");

    if (check) {

        let url = new URL(document.location.href)
        let id = url.searchParams.get("id");
        let price = url.searchParams.get("price");

        setConfirmHTML(id, price);
    }

}

function setConfirmHTML(id, price) {

    let articleEl = document.getElementById('confirm');

            let articleHTML = `

            <div class="box_4">

                    <a class="box_4_title">Merci et à bientot</a>
                    <a class="box_4_label">Identifiant de commande</a>
                    <div class="box_4_id">${id}</div>
                    <a class="box_4_label">Prix total</a>
                    <div class="box_4_price">${price}€</div>
                    
            </div>`;

            articleEl.innerHTML = articleEl.innerHTML + articleHTML

}


initConfirm();