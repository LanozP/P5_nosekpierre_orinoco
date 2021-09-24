// function createNode(element) {
//     return document.createElement(element);
// };

fetch("http://localhost:3000/api/furniture")
.then((resp) => resp.json())
.then(function(data) {
    let articles = data;
    let articleEl = document.querySelector('#articles');

    for (let index = 0; index < articles.length; index++) {
        const article = articles[index];

        articleEl.innerHTML = articleEl.innerHTML + `
        <div class="box">
        <div id="articles">
                <img class="box__image_oak" src="${article.imageUrl}" />
                <div class="box__label_large">${article.name}</div>
                <div class="box__label_medium">${article.price} €</div>
                </br>
                <select class="select">
                    <option value="">Varnish</option>
                    <option value="1">${article.varnish[0]}</option>
                    <option value="1">${article.varnish[1]}</option>
                    <option value="1">${article.varnish[2]}</option>
                </select>
                <div class="box__label_2 hide">${article._id}</div>
                <div class="box__label_2">${article.description}</div>
            </div>
        </div>
        `; 
    }
})
.catch(function(error) {
    console.log(error);
});