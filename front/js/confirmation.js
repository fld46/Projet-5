const idOrder = new URLSearchParams(window.location.search)
const orderId = idOrder.get('id')
showOrder(orderId)

//Affichage de l'orderId et suppression du localStorage
function showOrder(orderId) {
    const span = document.querySelector("#orderId")
    span.textContent = orderId
    localStorage.clear()
}