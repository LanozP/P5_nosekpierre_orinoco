
// Initialisation du panier
function initCart() {
  
    let cartJson = getCart();

    if (!cartJson) {
        localStorage.setItem("cart", "[]") 
    }

    // Affiche le panier si on est sur la page panier
    let check = document.querySelector(".page-cart");

    if (check) {
        let cartProducts = getCart();

        setCartHTML(cartProducts);
    }
}


// Initialisation du bouton d'ajout du panier
function initAddToCart() {
    
    let formsEl = document.querySelectorAll(".addToCart");

    for (let index = 0; index < formsEl.length; index++) {
        const formEl = formsEl[index];

        formEl.addEventListener('submit', function(e) {
            // Permet de bloquer la requete http
            e.preventDefault();

            // Permet de recuperer les champs du formulaire
            const data = new FormData(e.target);

            // Convertis les champs en json
            let newProductJson = Object.fromEntries(data.entries());
            newProductJson.quantity = 1;

            let cartJson = getCart();

            let productFound = false;

            // Boucle permettant d'ajouter l'article au panier ou d'augmenter la quantité
            for (let index = 0; index < cartJson.length; index++) {
                if (newProductJson.id === cartJson[index].id) {
                    cartJson[index].quantity += 1;
                    productFound = true;
                }
            }

            if (productFound == false) {
                cartJson.push(newProductJson)
            }

            // Ajout des data au localstorage
            localStorage.setItem("cart", JSON.stringify(cartJson))

        })
    };
}

// Permet de recuperer depuis le local storage le panier et de le renvoyer sous forme d'objet  
function getCart() {
    
    return JSON.parse(localStorage.getItem("cart"))

}

// Permet d'ajouter les articles au panier
function setCartHTML(cartProducts) {
    
    let cartEl = document.querySelector("#cart");

    // Permet d'ajouter l'article selectionner depuis le panier dans le panierHTML
    for (let index = 0; index < cartProducts.length; index++) {
        let cartProduct = cartProducts[index];

            fetch("http://localhost:3000/api/furniture/" + cartProduct.id)
            .then((resp) => resp.json())
            .then(function(data) {

                let articleHTML = `
                <div class="box">
                    <div>
                        <img class="box__image_oak" src="${data.imageUrl}" />
                        <div class="box__label_large">${data.name}</div>
                        <div class="box__label_medium">${data.price / 100} €</div>
                        <form class="deleteFromCart">
                            <input type="hidden" value="${data._id}" name="id" />
                            <button type="submit">Supprimer du panier</button>
                        </form>
                        </br>
                        <div class="box__label_2">${data.description}</div>
                        <div class="box__label_2">${cartProduct.quantity}</div>
                    </div>
                </div>
                `;
    
                cartEl.innerHTML = cartEl.innerHTML + articleHTML 
            })

        }


}

function deleteFromCart() {

    let deleteEl = document.querySelectorAll(".deleteFromCart");

    

    
}

// Appel de la fonction
initCart();

