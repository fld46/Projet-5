const id = new URLSearchParams(window.location.search)
const productId = id.get('id')

const item = {
    id: productId
}

fetch('http://localhost:3000/api/products/' + productId)
    .then((res) => res.json())
    .then((data) => infoProduct(data),)



function infoProduct(donnees) {
    const { altTxt, colors, description, imageUrl, name, price } = donnees
    const image = createImage(imageUrl, altTxt)
    item.price = price
    item.imageUrl = imageUrl
    item.altTxt = altTxt
    item.name = name
    createTitle(name)
    createPrice(price)
    createDescription(description)
    listCouleur(colors)
    document.querySelector(".item__img").appendChild(image)
}



function createImage(url, alt) {
    const image = document.createElement('img')
    image.src = url
    image.alt = alt
    return image
}
function createTitle(text) {
    const title = document.getElementById("title")
    title.textContent += text
    return title
}
function createPrice(prix) {
    const price = document.getElementById("price")
    price.textContent += prix
    return price
}
function createDescription(text) {
    const description = document.getElementById("description")
    description.textContent += text
    return title
}

function listCouleur(colors) {
    for (const key in colors) {
        const option = document.createElement('option')
        option.value = colors[key]
        option.textContent = colors[key]
        document.querySelector("#colors").appendChild(option)
    }
}

const button = document.querySelector("#addToCart")
button.addEventListener("click", event => { ajouterCaddie() })

function ajouterCaddie() {
    item.color = document.querySelector("#colors").value
    item.quantity = Number(document.querySelector("#quantity").value)
    if (item.color == null || item.color == "" || item.quantity == null || item.quantity <= 0 || item.quantity > 100) {
        alert("Merci de selectionner une couleur et une quantité")
    } else {
        localStorage.setItem(productId + item.color, JSON.stringify(item))
        alert(item.name + " de couleur " + item.color + " * " + item.quantity + " ajouté(s) au panier.")
        document.location.href = 'index.html'
    }

}



