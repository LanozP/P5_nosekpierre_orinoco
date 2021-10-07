 // Tableau vide pour récuperer le prix (via l'id)
 var priceById = [];

// Initialisation du panier
function initCart() {
  
    // Panier
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
            // Si l'article n'est pas trouvé ajouté au panier
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
            for (let i = 0; i < cartJson.length; i++) {
                if (newProductJson.id === cartJson[i].id && newProductJson.varnish === cartJson[i].varnish) {
                    cartJson.splice(i, 1)
                    // 
                    let deleteArticleEl = document.querySelector(".box_2[data-id='"+newProductJson.id+"'][data-varnish='"+newProductJson.varnish+"']");
                    deleteArticleEl.remove();

                    break;
                }
            }

            renderHtmlTotalArticles(cartJson);
            renderHtmlTotalPrice(cartJson);

            // Ajout des data au localstorage
            localStorage.setItem("cart", JSON.stringify(cartJson))



        })
    };
}

// Initialisation de la quantité (du panier)
function initUpdateQuantity() {

    let quantitiesEl = document.querySelectorAll('.updateQuantity .box__input');

    // Boucle pour recuperer la quantité
    for (let index = 0; index < quantitiesEl.length; index++) {
        const quantityEl = quantitiesEl[index];

        quantityEl.addEventListener('change', function(e) {

            // Permet de recuperer les champs du formulaire
            const data = new FormData(e.target.parentNode);

            // Convertis les champs en json
            let newProductJson = Object.fromEntries(data.entries());

            // Panier
            let cartJson = getCart();

            // Boucle permettant de modifier la quantité d'articles dans le panier
            for (let i = 0; i < cartJson.length; i++) {
                if (newProductJson.id === cartJson[i].id && newProductJson.varnish === cartJson[i].varnish) {
                    cartJson[i].quantity = Number(newProductJson.quantity);

                    break;
                }
            }

            // Affichage du nb d'articles HTML
            renderHtmlTotalArticles(cartJson);
            renderHtmlTotalPrice(cartJson);

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
    let fetches = [];

    // Permet d'ajouter l'article selectionner depuis le panier dans le panierHTML
    for (let index = 0; index < cartProducts.length; index++) {
        let cartProduct = cartProducts[index];
        fetches.push(

            // Ajout de l'id a l'url de l'API
            fetch("http://localhost:3000/api/furniture/" + cartProduct.id)
            .then((resp) => resp.json())
            .then(function(data) {
                priceById[data._id] = data.price / 100;

                let articleHTML = `
                <div class="full_box">

                    <div class="box_2" data-id="${data._id}" data-varnish="${cartProduct.varnish}">
                            <img class="box_2_image_oak" src="${data.imageUrl}" />
                            <div class="box_2_label_name">${data.name}</div>
                            <div class="box_2_label_price">${data.price / 100}€</div>
                            <div class="box_2_details"><strong>Description du produit</strong>${data.description}</div>
                            <div class="box_2_varnish">${cartProduct.varnish}</div>

                            <form class="deleteFromCart">
                                <input type="hidden" value="${data._id}" name="id" />
                                <input type="hidden" value="${cartProduct.varnish}" name="varnish" />
                                <button class="deleteBtn" type="submit">Supprimer du panier</button>
                            </form>
                            </br>
                            <form class="updateQuantity">
                                <input class="box__input" type="number" min="1" value="${cartProduct.quantity}" name="quantity">
                                <input type="hidden" value="${data._id}" name="id" />
                                <input type="hidden" value="${cartProduct.varnish}" name="varnish" />
                            </form>
                    </div>

                </div>
                `;
    
                cartEl.innerHTML = cartEl.innerHTML + articleHTML 

            })
        )     
    }

    // Tous les fetch sont revenus
    Promise.all(fetches).then(function() {
        initdeleteFromCart();
        initUpdateQuantity();
        renderHtmlTotalPrice(getCart());
    })
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

// Nombre d'articles dans la panier en HTML
function getHtmlTotalArticles(panier) {

    let htmlTotalArticle = `
        <div>`+nbTotalArticlesIntoCart(panier)+`</div>    
    `;

    return htmlTotalArticle;

}

// 
function renderHtmlTotalArticles(panier) {
    
    let htmlTotalArticles = getHtmlTotalArticles(panier);

    document.querySelector(".nbTotalCart").innerHTML = htmlTotalArticles

};

//
function totalPriceIntoCart(panier) {
    let total = 0;

    for (let index = 0; index < panier.length; index++) {
        let articleQuantity = panier[index].quantity;
        let articlePrice = priceById[panier[index].id];

        total = total + articleQuantity * articlePrice;
        console.log(total);
    }

    return total;
}

// 
function renderHtmlTotalPrice(panier) {
    
    let htmlTotalPrice = totalPriceIntoCart(panier);

    document.querySelector(".totalPrice").innerHTML = htmlTotalPrice;

};
        

// Appel de la fonction
initCart();

