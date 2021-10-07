// Initialisation page info
function initInfo() {

    let check = document.querySelector(".page-info");

    if (check) {

        let url = new URL(document.location.href)
        let id = url.searchParams.get("id");

        infoEl(id);
    }
}

// Initialisation du bouton "plus d'infos"
function initMoreInfo() {
    
    let formsEl = document.querySelectorAll(".openBtn");

    for (let index = 0; index < formsEl.length; index++) {
        const formEl = formsEl[index];

        formEl.addEventListener('submit', function(e) {
            // Permet de bloquer la requete http
            e.preventDefault();

            // Permet de recuperer les champs du formulaire
            const data = new FormData(e.target);

            // Convertis les champs en json
            let newProductJson = Object.fromEntries(data.entries());

            let cartJson = getCart();

            let productFound = false;

            // Boucle permettant d'ajouter l'article
            for (let index = 0; index < cartJson.length; index++) {
                if (newProductJson.id === cartJson[index].id) {
                    productFound = true;
                }
            }

            // Ajout des data au localstorage
            localStorage.setItem("cart", JSON.stringify(cartJson))

        })
    };
}

// Permet d'afficher l'article selectionner
function infoEl(id) {

    fetch("http://localhost:3000/api/furniture/" + id)
    .then((resp) => resp.json())
    .then(function(data) {
        let article = data;
        let articleEl = document.getElementById('info');

            let articleHTML = `
        <div class="full_box">

            <div class="box_3">
            
                    <img class="box_3_image_oak" src="${article.imageUrl}" />
                    <div class="box_3_label_name">${article.name}</div>
                    <div class="box_3_label_price">${article.price / 100} €</div>
                    </br>

                    <div class="selection">

                        <form class="addToCart">

                            <select class="select" name="varnish">
                                    <option select disabled value="">Varnish</option>`;

                                for (let i = 0; i < article.varnish.length; i++) {
                                    const varnishSelect = article.varnish[i];

                                    articleHTML += `
                                    <option value="${varnishSelect}">${varnishSelect}</option>`

                                };
                                
                                    articleHTML += `

                            </select>

                    
                            <input type="hidden" value="${article._id}" name="id" />
                            <input type="hidden" value="${article.name}" name="name" />
                            <button class="openBtn" type="submit">Ajouter au panier</button>
                        </form>

                    </div>

                    <div class="box_3_label_details">${article.description}</div>

            </div>
        </div>`;

            articleEl.innerHTML = articleEl.innerHTML + articleHTML


        initMoreInfo();
        initAddToCart();
    })
    .catch(function(error) {
        console.log(error);
    });

}

initInfo();