const id = new URLSearchParams(window.location.search)
const productId = id.get('id')
const item = {
    id: productId
}
const button = document.querySelector("#addToCart")
button.addEventListener("click", event => { verifCaddie() })

fetch('http://localhost:3000/api/products/' + productId)
    .then((res) => res.json())
    .then((data) => infoProduct(data))

//Creation du contenu de la page d'un produit
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
//creation de l'image
function createImage(url, alt) {
    const image = document.createElement('img')
    image.src = url
    image.alt = alt
    return image
}
//creation du titre
function createTitle(text) {
    const title = document.getElementById("title")
    title.textContent += text
    return title
}
//creation du prix
function createPrice(prix) {
    const price = document.getElementById("price")
    price.textContent += prix
    return price
}
//creation de la description
function createDescription(text) {
    const description = document.getElementById("description")
    description.textContent += text
    return title
}
//creation des choix de couleur de l'objet
function listCouleur(colors) {
    for (const key in colors) {
        const option = document.createElement('option')
        option.value = colors[key]
        option.textContent = colors[key]
        document.querySelector("#colors").appendChild(option)
    }
}
//Verification qu'une couleur et entre 1 et 100 articles sont selectionnés
function verifCaddie() {
    item.color = document.querySelector("#colors").value
    item.quantity = Number(document.querySelector("#quantity").value)
    if (item.color == null || item.color == "" || item.quantity == null || item.quantity <= 0 || item.quantity > 100) {
        alert("Merci de selectionner une couleur et une quantité")
    } else {
        addCaddie()
    }
}
//Ajout au localstorage de ou des articles
function addCaddie() {
    itemAdd = {
        id: item.id,
        quantity: item.quantity,
        color: item.color
    }
    if (localStorage.getItem(productId + item.color) === null) {
        localStorage.setItem(productId + item.color, JSON.stringify(itemAdd))
        alert(item.name + " de couleur " + item.color + " * " + item.quantity + " ajouté(s) au panier.")
        redirection()
    } else {
        const kanapModel = localStorage.getItem(localStorage.key(productId + item.color))
        itemObj = JSON.parse(kanapModel)
        if ((itemObj.quantity + item.quantity) <= 100) {
            itemObj.quantity += item.quantity
            localStorage.setItem(productId + item.color, JSON.stringify(itemObj))
            alert(item.quantity + " " + item.name + " de couleur " + item.color + " ajouté(s) à ceux deja presents dans votre panier.")
        } else {
            alert("trop de canapés")
        }
        redirection()
    }

}

//Demande si redirection vers panier
function redirection() {
    if (confirm('Votre produit a ete ajouté au panier, voulez vous continuer vers celui-ci ?')) {
        document.location.href = 'cart.html'
    } else {
        document.location.href = 'index.html'
    }
}



