
function initIndex() {

    // Affiche l'index si on est sur la page accueil
    let check = document.querySelector(".page-index");

    if (check) {
        setIndexHTML();
    }
}

function setIndexHTML() {

    // const openBtn = document.getElementById('openBtn');
    // const closeBtn = document.getElementById('closeBtn');

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
                    <div class="box__label_large">${article.name}</div>
                    <div class="box__label_medium">${article.price / 100} €</div>
                    </br>
                        <form class="addToCart">
                            <input type="hidden" value="${article._id}" name="id" />
                            <input type="hidden" value="${article.name}" name="name" />
                            <button type="submit">Ajouter au panier</button>
                            <button>
                            <a class="openBtn" href="info.html">Plus d'infos</a>
                            </button>
                        </form>
                    <div class="box__label_2">${article.description}</div>
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

    // openBtn.addEventListener('click', () => {
    //     window.open('info.html');

    //     let articleEl2 = document.getElementById('info');

    //     for (let index = 0; index < articles2.length; index++) {
    //         const article2 = articles2[index];

    //         let articleHTML2 = `
    //         <div class="box" id="info">
    //             <div>
    //                 <img class="box__image_oak" src="${article2.imageUrl}" />
    //                 <div class="box__label_large">${article2.name}</div>
    //                 <div class="box__label_medium">${article2.price / 100} €</div>
    //                 </br>
    //                 <div class="selection">
    //                 <select class="select">
    //                     <option value="">Varnish</option>`;

    //                 for (let i = 0; i < article2.varnish.length; i++) {
    //                     const varnishSelect = article2.varnish[i];

    //                     articleHTML2 += `
    //                         <option value="1">${varnishSelect}</option>`
    //                 };
                        
    //                 articleHTML2 += `</select>

    //                 <form class="addToCart">
    //                     <input type="hidden" value="${article2._id}" name="id" />
    //                     <input type="hidden" value="${article2.name}" name="name" />
    //                     <button type="submit">Ajouter au panier</button>
    //                     <button type="submit" id="closeBtn">Fermer</button>
    //                 </form>
    //             </div>

    //                 <div class="box__label_2">${article2.description}</div>

    //         </div>`;

    //         articleEl2.innerHTML = articleEl2.innerHTML + articleHTML2
    //     }

    // })