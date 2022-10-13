fetch('http://localhost:3000/api/products/')
    .then((res) => res.json())
    .then((data) => addProducts(data))

function addProducts(donnees) {
    for (const key in donnees) {
        const imageUrl = donnees[key].imageUrl
        const _id = donnees[key]._id
        const name = donnees[key].name
        const price = donnees[key].price
        const description = donnees[key].description
        const altTxt = donnees[key].altTxt
        const anchor = makeLiens(_id)
        const article = document.createElement("article")
        const img = makeImage(imageUrl, altTxt)
        const titre = makeH3('productName', name)
        const texte = makeDescription('productDescription', description)
        document.querySelector("#items").appendChild(anchor).appendChild(article).appendChild(img)
        article.appendChild(titre)
        article.appendChild(texte)
    }
    function makeLiens(id) {
        const anchor = document.createElement("a")
        anchor.href = "product.html?id=" + id
        return anchor
    }

    function makeImage(image, alt) {
        const img = document.createElement('img')
        img.src = image
        img.alt = alt
        return img
    }

    function makeH3(tag, txt) {
        const titre = document.createElement("h3")
        titre.classList.add(tag)
        titre.textContent = txt
        return titre
    }

    function makeDescription(tag, txt) {
        const texte = document.createElement('p')
        texte.classList.add(tag)
        texte.textContent = txt
        return texte
    }
}    