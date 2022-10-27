const idOrder = new URLSearchParams(window.location.search)
const orderId = idOrder.get('id')
showOrder(orderId)

function showOrder(orderId) {
    const span = document.querySelector("#orderId")
    span.textContent = orderId
}