
function initIndex() {

    // Affiche le panier si on est sur la page panier
    let check = document.querySelector(".page-index");

    if (check) {
        setIndexHTML();
    }
}

function setIndexHTML() {

    fetch("http://localhost:3000/api/furniture")
    .then((resp) => resp.json())
    .then(function(data) {
        let articles = data;
        let articleEl = document.querySelector('#articles');

        for (let index = 0; index < articles.length; index++) {
            const article = articles[index];

            let articleHTML = `
            <div class="box">
            <div>
                    <img class="box__image_oak" src="${article.imageUrl}" />
                    <div class="box__label_large">${article.name}</div>
                    <div class="box__label_medium">${article.price / 100} €</div>
                    </br>
                    <select class="select">
                        <option value="">Varnish</option>`;

                    for (let i = 0; i < article.varnish.length; i++) {
                        const varnishSelect = article.varnish[i];

                        articleHTML += `
                            <option value="1">${varnishSelect}</option>`
                    };
                        
                    articleHTML += `</select>

                    <form class="addToCart">
                        <input type="hidden" value="${article._id}" name="id" />
                        <input type="hidden" value="${article.name}" name="name" />
                        <button type="submit">Ajouter au panier</button>
                    </form>

                    <div class="box__label_2">${article.description}</div>
                </div>
            </div>
            `;

            articleEl.innerHTML = articleEl.innerHTML + articleHTML
        };

        initAddToCart();
    })
    .catch(function(error) {
        console.log(error);
    });

}

initIndex();