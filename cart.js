
// Initialisation du panier
function initCart() {
  
    let cartJson = getCart();
    
    // Si il n'y a pas d'article un panier vide s'initialise
    if (!cartJson) {
        localStorage.setItem("cart", "[]") 
    }

    // Affiche le panier si on est sur la page panier
    let check = document.querySelector(".page-cart");

    // si on est sur la page panier il initialise le panier et ajoute l'articleHTML
    if (check) {
        let cartProducts = getCart();

        setCartHTML(cartProducts);
    }

    renderHtmlTotalArticles(cartJson);

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
                if (newProductJson.id === cartJson[index].id && newProductJson.varnish === cartJson[index].varnish) {
                    cartJson[index].quantity += 1;
                    productFound = true;
                }
            }

            if (productFound == false) {
                cartJson.push(newProductJson)
            }

            // Ajout des data au localstorage
            localStorage.setItem("cart", JSON.stringify(cartJson))

            renderHtmlTotalArticles(cartJson);
        })
    };
}

// Initialisation du bouton de suppression d'un article du panier
function initdeleteFromCart() {

    let deleteEl = document.querySelectorAll(".deleteFromCart");

    for (let index = 0; index < deleteEl.length; index++) {
        const formEl = deleteEl[index];

        formEl.addEventListener('submit', function(e) {
            // Permet de bloquer la requete http
            e.preventDefault();

            // Permet de recuperer les champs du formulaire
            const data = new FormData(e.target);

            // Convertis les champs en json
            let newProductJson = Object.fromEntries(data.entries());

            let cartJson = getCart();

            // Boucle permettant de supprimer l'article au panier via splice
            for (let index = 0; index < cartJson.length; index++) {
                if (newProductJson.id === cartJson[index].id && newProductJson.varnish === cartJson[index].varnish) {
                    cartJson.splice(index, 1)
                    let deleteArticleEl = document.querySelector(".box[data-id='"+newProductJson.id+"'][data-varnish='"+newProductJson.varnish+"']");
                    deleteArticleEl.remove();

                    break;
                }
            }

            renderHtmlTotalArticles(cartJson);

            // Ajout des data au localstorage
            localStorage.setItem("cart", JSON.stringify(cartJson))



        })
    };
}

function initUpdateQuantity() {

    let quantitiesEl = document.querySelectorAll('.updateQuantity .box__input');

    for (let index = 0; index < quantitiesEl.length; index++) {
        const quantityEl = quantitiesEl[index];

        quantityEl.addEventListener('change', function(e) {

            // Permet de recuperer les champs du formulaire
            const data = new FormData(e.target.parentNode);

            // Convertis les champs en json
            let newProductJson = Object.fromEntries(data.entries());

            let cartJson = getCart();

            // Boucle permettant de supprimer l'article au panier via splice
            for (let i = 0; i < cartJson.length; i++) {
                if (newProductJson.id === cartJson[i].id && newProductJson.varnish === cartJson[i].varnish) {
                    cartJson[i].quantity = newProductJson.quantity;

                    break;
                }
            }

            renderHtmlTotalArticles(cartJson);

            // Ajout des data au localstorage
            localStorage.setItem("cart", JSON.stringify(cartJson))

        })
        
    }

}

// Permet de recuperer depuis le local storage le panier et de le renvoyer sous forme d'objet  
function getCart() {
    
    return JSON.parse(localStorage.getItem("cart"))

}

// Permet d'ecrire le panier
function setCartHTML(cartProducts) {
    
    let cartEl = document.querySelector("#cart");

    // Permet d'ajouter l'article selectionner depuis le panier dans le panierHTML
    for (let index = 0; index < cartProducts.length; index++) {
        let cartProduct = cartProducts[index];

            fetch("http://localhost:3000/api/furniture/" + cartProduct.id)
            .then((resp) => resp.json())
            .then(function(data) {

                let articleHTML = `
                <div class="box" data-id="${data._id}" data-varnish="${cartProduct.varnish}">
                    <div>
                        <img class="box__image_oak" src="${data.imageUrl}" />
                        <div class="box__label_large">${data.name}</div>
                        <div class="box__label_medium">${data.price / 100} €</div>
                        <form class="deleteFromCart">
                            <input type="hidden" value="${data._id}" name="id" />
                            <input type="hidden" value="${cartProduct.varnish}" name="varnish" />
                            <button type="submit">Supprimer du panier</button>
                        </form>
                        </br>
                        <div class="box__label_2">${data.description}</div>
                        <div>
                        <form class="updateQuantity">
                            <input class="box__input" type="number" value="${cartProduct.quantity}" name="quantity">
                            <input type="hidden" value="${data._id}" name="id" />
                            <input type="hidden" value="${cartProduct.varnish}" name="varnish" />                 </form>
                        </div>
                    </div>
                </div>
                `;
    
                cartEl.innerHTML = cartEl.innerHTML + articleHTML 

                initdeleteFromCart();
                initUpdateQuantity();
            })
    }
}

// Recuperation nombre total d'articles dans le panier
function nbTotalArticlesIntoCart(panier) {

    let totalQuantity = 0;

    for (let index = 0; index < panier.length; index++) {
        let nbArticles = panier[index].quantity;

        
        totalQuantity = totalQuantity + nbArticles
    }

    return totalQuantity;

}

function getHtmlTotalArticles(panier) {

    let htmlTotalArticle = `
        <div>`+nbTotalArticlesIntoCart(panier)+`</div>    
    `;

    return htmlTotalArticle;

}

function renderHtmlTotalArticles(panier) {
    
    let htmlTotalArticles = getHtmlTotalArticles(panier);

    document.querySelector(".test").innerHTML = htmlTotalArticles

};


// Appel de la fonction
initCart();

