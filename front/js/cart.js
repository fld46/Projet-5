//Recuperation des items sous la forme d'objet itemObj
function showPanier() {
    document.getElementById("cart__items").innerText = ""
    document.title = "Panier"
    for (let i = 0; i < localStorage.length; i++) {
        let item = localStorage.getItem(localStorage.key(i))
        let itemObj = JSON.parse(item)
        itemObj.idc = localStorage.key(i)
        fetch('http://localhost:3000/api/products/' + itemObj.id)
            .then((res) => res.json())
            .then((data) => product(data, itemObj))
    }
}
showPanier()
//creation de l'objet obj avec toutes les infos de celui-ci et appel des fonctions pour le html
function product(data, obj) {
    const { altTxt, imageUrl, name, price } = data
    obj.price = Number(price)
    obj.imageUrl = imageUrl
    obj.altTxt = altTxt
    obj.name = name
    makeHtml(obj)
    articleNumber()
    totalPrice(obj)
}

//mise en forme Html
function makeHtml(obj) {
    const article = document.createElement("article")
    article.className = "cart__item"
    article.id = obj.idc
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
    const divDelete = deleteArticle(obj)
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
    price.textContent = obj.price.toFixed(2) + " ???"
    divDescription.appendChild(H2)
    divDescription.appendChild(color)
    divDescription.appendChild(price)
    div.appendChild(divDescription)
    return div
}

//creation de l'input quantit??
function articleQte(obj) {

    const divSettings = document.createElement('div')
    divSettings.className = "cart__item__content__settings"
    const divQuantity = document.createElement('div')
    divQuantity.className = "cart__item__content__settings__quantity"
    const quantity = document.createElement('p')
    quantity.textContent = "Qt?? : "
    const inputQte = document.createElement('input')
    inputQte.type = "number"
    inputQte.className = "itemQuantity"
    inputQte.name = "itemQuantity"
    inputQte.min = "1"
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
function deleteArticle(obj) {
    const divDelete = document.createElement('div')
    divDelete.className = "cart__item__content__settings__delete"
    divDelete.addEventListener("click", () => deleteItem(obj.idc, obj))
    const boutonDelete = document.createElement('p')
    boutonDelete.className = "deleteItem"
    boutonDelete.textContent = 'supprimer'
    boutonDelete.dataset.idc = obj.idc
    divDelete.appendChild(boutonDelete)
    return divDelete
}
//function update de quatit??
function updateQte(obj, qte) {
    if (qte > 0 && qte < 100) {
        obj.quantity = Number(qte)
        objPanier = {
            id: obj.id,
            color: obj.color,
            quantity: obj.quantity
        }
        localStorage.setItem(objPanier.id + objPanier.color, JSON.stringify(objPanier))
        articleNumber()
        totalPrice(obj)
    } else {
        alert('La quantit?? par article doit ??tre comprise entre 1 et 100')
        //document.location.href = 'cart.html'
        showPanier()
        return
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
const erreurs = []
verif('firstName', /^([a-zA-Z])*$/, 'Prenom non conforme')
verif('lastName', /^([a-zA-Z])*$/, 'Nom non conforme')
verif('address', /^([a-zA-Z 0-9])*$/, 'Adresse non conforme')
verif('city', /^([a-zA-Z ])*$/, 'Ville non conforme')
verif('email', /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Adresse e-mail non conforme')
const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))

//comparaison d'une valeur d'un champ no avec un regex
function verif(name, regex, msg = "erreur") {
    const nom = document.getElementById(name)
    const error = document.querySelector('#' + name + 'ErrorMsg')
    if (nom.value == "") {
        error.textContent = "Champ obligatoire"

    }
    nom.addEventListener("input", function (event) {
        const expreg = new RegExp(regex)
        if (expreg.test(nom.value) && nom.value != "") {
            error.textContent = ""
            createError(msg, 'delete')
        } else {
            error.textContent = msg
            createError(msg)
        }
    })
}
//function de stockage d'erreur(s)
function createError(msg, opt = 'add') {
    if (opt == "add") {
        if (erreurs.indexOf(msg) == -1) {
            erreurs.push(msg)
        }
    } else {
        erreurs.forEach(function (item) {
            if (item == msg) {
                erreurs.splice(erreurs.indexOf(item), 1);
            }
        })

    }
}

//fonction d'envoi du formulaire
function submitForm(e) {
    e.preventDefault()
    if (localStorage.length === 0) {
        alert("Le panier doit contenir un article minimum")
        return
    }

    const form = document.querySelector(".cart__order__form")
    const body = makeRequestPost(form.elements)
    console.log(form.elements)
    if (erreurs.length > 0) {
        alert("Formulaire mal rempli")
        return
    }
    if (form.elements.firstName.value === "" || form.elements.lastName.value === "" || form.elements.address.value === "" || form.elements.city.value === "" || form.elements.email.value === "") {
        alert('Formulaire mal rempli')
        return
    }
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((data) => confirmation(data.orderId))

}

//fonction pour creer l'objet body du POST
function makeRequestPost(elements) {

    const body = {
        contact: {
            firstName: elements.firstName.value,
            lastName: elements.lastName.value,
            address: elements.address.value,
            city: elements.city.value,
            email: elements.email.value
        },
        products: getIdsfromLocal()
    }
    return body
}

//function getIdsfromlocal 

function getIdsfromLocal() {
    const ids = []
    for (let i = 0; i < localStorage.length; i++) {
        const item = localStorage.getItem(localStorage.key(i))
        itemObj = JSON.parse(item)
        if (ids.indexOf(itemObj.id) === -1) {
            ids.push(itemObj.id)
        }
    }
    return ids
}

//function envoie sur la page confirmation
function confirmation(id) {
    window.location.href = 'confirmation.html?id=' + id
}