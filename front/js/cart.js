//Recuperation des items sous la forme d'objet itemObj

for (let i = 0; i < localStorage.length; i++) {
    const item = localStorage.getItem(localStorage.key(i))
    itemObj = JSON.parse(item)
    itemObj.idc = localStorage.key(i)
    fetch('http://localhost:3000/api/products/' + itemObj.id)
        .then((res) => res.json())
        .then((data) => product(data, itemObj),)

}
function product(data, obj) {
    const { altTxt, imageUrl, name, price } = data
    obj.price = Number(price)
    obj.imageUrl = imageUrl
    obj.altTxt = altTxt
    obj.name = name
    obj.idc = itemObj.idc
    makeHtml(obj)
    articleNumber()
    totalPrice(obj)
}

//mise en forme Html
function makeHtml(obj) {
    const article = document.createElement("article")
    article.className = "cart__item"
    article.id = obj.id + obj.color
    article.dataset.id = obj.id
    article.dataset.color = obj.color
    const divImg = createImg(obj)
    const description = createContent(obj)
    article.appendChild(divImg)
    article.appendChild(description)
    document.getElementById("cart__items").appendChild(article)
}

//Creation de l'image html
function createImg(obj) {
    const div = document.createElement("div")
    div.className = "cart__item__img"
    const img = document.createElement("img")
    img.src = obj.imageUrl
    img.alt = obj.altTxt
    div.appendChild(img)
    return div
}

//creation du contenu de l'objet
function createContent(obj) {
    const div = articleTitle(obj)
    const divSettings = articleQte(obj)
    div.appendChild(divSettings)
    const divDelete = deleteArticle(obj, obj.idc)
    divSettings.appendChild(divDelete)

    return div
}
//creation de la premiere partie de l'article
function articleTitle(obj) {
    const div = document.createElement('div')
    div.className = "cart__item__content"
    const divDescription = document.createElement('div')
    divDescription.className = "cart__item__content__description"
    const H2 = document.createElement('H2')
    H2.textContent = obj.name
    const color = document.createElement('p')
    color.textContent = obj.color
    const price = document.createElement('p')
    price.textContent = obj.price.toFixed(2) + " €"
    divDescription.appendChild(H2)
    divDescription.appendChild(color)
    divDescription.appendChild(price)
    div.appendChild(divDescription)

    return div
}

//creation de l'input quantité
function articleQte(obj) {
    const divSettings = document.createElement('div')
    divSettings.className = "cart__item__content__settings"
    const divQuantity = document.createElement('div')
    divQuantity.className = "cart__item__content__settings__quantity"
    const quantity = document.createElement('p')
    quantity.textContent = "Qté : "
    const inputQte = document.createElement('input')
    inputQte.type = "number"
    inputQte.className = "itemQuantity"
    inputQte.name = "itemQuantity"
    inputQte.min = "0"
    inputQte.max = "100"
    inputQte.value = obj.quantity
    inputQte.addEventListener("change", () => updateQte(obj, inputQte.value))
    divSettings.appendChild(divQuantity)
    divQuantity.appendChild(quantity)
    divQuantity.appendChild(inputQte)
    return divSettings
}

//Recuperation du nombre total d'article ds le panier
function articleNumber() {
    let number = 0
    for (let i = 0; i < localStorage.length; i++) {
        const item = localStorage.getItem(localStorage.key(i))
        itemObj = JSON.parse(item)
        number += Number(itemObj.quantity)
    }
    document.getElementById('totalQuantity').textContent = number
}

//Creation du bouton delete
function deleteArticle(obj, idc) {
    const divDelete = document.createElement('div')
    divDelete.className = "cart__item__content__settings__delete"
    divDelete.addEventListener("click", () => deleteItem(idc, obj))
    const boutonDelete = document.createElement('p')
    boutonDelete.className = "deleteItem"
    boutonDelete.textContent = 'supprimer'
    boutonDelete.dataset.idc = idc
    divDelete.appendChild(boutonDelete)
    return divDelete
}
//function update de quatité
function updateQte(obj, qte) {
    if (qte == 0) {
        deleteItem(obj.idc, obj)
    }
    else if (qte >= 0 && qte < 100) {
        obj.quantity = Number(qte)
        objPanier = {
            id: obj.id,
            color: obj.color,
            quantity: obj.quantity
        }
        localStorage.setItem(obj.idc, JSON.stringify(objPanier))
        articleNumber()
        totalPrice(obj)
    } else {
        alert('La quantité par article doit être comprise entre 1 et 100')
    }

}
//function de suppression de l'item
function deleteItem(id, obj) {
    const element = document.getElementById(id)
    element.remove()
    localStorage.removeItem(id)
    articleNumber()
    totalPrice(obj)
}

//calcul du prix total
function totalPrice(obj) {
    let number = 0
    for (let i = 0; i < localStorage.length; i++) {
        const item = localStorage.getItem(localStorage.key(i))
        itemObj = JSON.parse(item)
        number += itemObj.quantity * obj.price
    }
    document.getElementById('totalPrice').textContent = number.toFixed(2)
}

//FORMULAIRE

verif('firstName', /^([a-zA-Z])*$/, 'Nom non conforme')
verif('lastName', /^([a-zA-Z])*$/)
verif('address', /^([a-zA-Z 0-9])*$/)
verif('city', /^([a-zA-Z ])*$/)
verif('email', /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)

function verif(name, regex, msg = "erreur") {
    const nom = document.getElementById(name)
    const error = document.querySelector('#' + name + 'ErrorMsg')
    nom.addEventListener("input", function (event) {
        const expreg = new RegExp(regex)
        if (expreg.test(nom.value)) {
            error.textContent = ""
        } else {
            error.textContent = msg
        }
    })
}