
function initIndex() {

    // Affiche l'index si on est sur la page accueil
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
        let articleEl = document.getElementById('articles');

        for (let index = 0; index < articles.length; index++) {
            const article = articles[index];

            let articleHTML = `
            <div class="box">
                <div>
                    <img class="box__image_oak" src="${article.imageUrl}" />
                    <div class="box__label_name">${article.name}</div>
                    <div class="box__label_price">${article.price / 100} €</div>
                    </br>
                        <form class="addToCart">
                            <input type="hidden" value="${article._id}" name="id" />
                            <input type="hidden" value="${article.name}" name="name" />

                            <a class="openBtn" href="info.html?id=${article._id}">Plus d'infos</a>
                        </form>
                    <div class="box__label_details">${article.description}</div>
                </div>
            </div>
            `;

            articleEl.innerHTML = articleEl.innerHTML + articleHTML

        }

        initAddToCart();
    })
    .catch(function(error) {
        console.log(error);
    });

}

initIndex();