function infoEl() {

    fetch("http://localhost:3000/api/furniture/")
    .then((resp) => resp.json())
    .then(function(data) {
        let articles = data;
        let infoEl = document.getElementById('info');
        let openBtn = document.getElementsByClassName('openBtn');

        openBtn.addEventListener('click', () => {
            let article = articles[index];

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
                            <button>
                            <a class="openBtn" href="info.html">Plus d'infos</a>
                            </button>
                        </form>
                    <div class="box__label_2">${article.description}</div>
                </div>
            </div>
            `;

            infoEl.innerHTML = infoEl.innerHTML + articleHTML

        })

        initAddToCart();
    })
    .catch(function(error) {
        console.log(error);
    });

}

infoEl();


// id
// Fetch
// Json
// html

