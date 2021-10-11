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
    let check2 = document.querySelector(".page-info");
    let check3 = document.querySelector(".page-index");

    // si on est sur la page panier il initialise le panier et ajoute l'articleHTML
    if (check) {
        let cartProducts = getCart();

        setCartHTML(cartProducts);

        renderHtmlTotalArticles(cartJson);

        validateCart();
    }

    if (check2) {
        renderHtmlTotalArticles(cartJson);
    }

    if (check3) {
        renderHtmlTotalArticles(cartJson);
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
                            <a class="box_2_image" href="info.html?id=${cartProduct.id}">
                                <img class="box_2_image_oak" src="${data.imageUrl}" />
                            </a>
                            <div class="box_2_name">${data.name}</div>
                            <div class="box_2_price">${data.price / 100}€</div>
                            <div class="box_2_details">
                            <a class="box_2_label_details">Description du produit</a>
                            ${data.description}</div>

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
                            <div class="box_2_varnish">
                            <a class="box_2_label_varnish">Varnish:</a>
                            ${cartProduct.varnish}</div>
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

// Affichage HTML du total d'articles
function renderHtmlTotalArticles(panier) {
    
    let htmlTotalArticles = getHtmlTotalArticles(panier);

    document.querySelector(".nbTotalCart").innerHTML = htmlTotalArticles

};

// Prix total du panier
function totalPriceIntoCart(panier) {
    let total = 0;

    for (let index = 0; index < panier.length; index++) {
        let articleQuantity = panier[index].quantity;
        let articlePrice = priceById[panier[index].id];

        total = total + articleQuantity * articlePrice;

    }

    return total;
}

// Nombre d'articles dans la panier en HTML
function getHtmlTotalPrice(panier) {

    let htmlTotalPrice = `
        <div>`+totalPriceIntoCart(panier)+` €</div>    
    `;

    return htmlTotalPrice;

}

// Affichage HTML du prix total du panier
function renderHtmlTotalPrice(panier) {
    
    let htmlTotalPrice = getHtmlTotalPrice(panier);

    document.querySelector(".totalPrice").innerHTML = htmlTotalPrice;

};

// 
function validateCart() {

    let formValidateEl = document.querySelector('.info_customer');

    formValidateEl.addEventListener('submit', function(e) {
        // Permet de bloquer la requete http
        e.preventDefault();

        // Permet de recuperer les champs du formulaire
        const data = new FormData(e.target);

        // Convertis les champs en json
        let formJson = Object.fromEntries(data.entries());

        let cartJson = getCart();

        let arrayOfIds = [];
         
        for (let index = 0; index < cartJson.length; index++) {

            if (!arrayOfIds.includes(cartJson[index].id)) {
                arrayOfIds.push(cartJson[index].id)
            }
        }

        let payload = {

        };
        
        payload.contact = formJson;
        payload.products = arrayOfIds;

        fetch('http://localhost:3000/api/furniture/order', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then((resp) => resp.json())
        .then(function(data) {

            localStorage.setItem("cart", "[]");
            location.assign('confirm.html?id='+data.orderId+'&price='+totalPriceIntoCart(cartJson)+'');
    
        })

    })

}
        

// Appel de la fonction
initCart();

