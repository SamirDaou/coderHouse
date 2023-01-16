let carrito = []

const contenedorCards = document.querySelector(".container")

const cardsAHtml = ( array ) => {
    const tarjeta = array.reduce( (acc, element ) => {
        return acc + `
            <div class="card" id="card-${element.id}">
                <div class="card-img">
                    <img src=${element.img} alt=${element.producto}>
                </div>   
                <h2>${element.producto}</h2>    
                <h3>${element.description}</h3>
                <h3>${element.precio}</h3>    
                <button class="boton-carrito" id="button-${element.id}">Añadir al carrito</button>     
            </div>
        `
    }, "")
    return tarjeta
}

contenedorCards.innerHTML = cardsAHtml(productos)

const alLs = ( clave, valor ) => {
    return localStorage.setItem(clave, JSON.stringify(valor))
}

const pushearAArray = ( array, value ) => {
    array.push(value)
}

const buscarProducto = ( producto, array) => {
    return array.find( product => {
        return product.id === Number(producto)
    })
}

const obtenerDelLs = ( clave ) => {
    return JSON.parse(localStorage.getItem(clave))
}

const subirAlCarrito = () => {
    const botonesCards = document.querySelectorAll(".boton-carrito")   
    botonesCards.forEach( boton => {
        boton.onclick = () => {     
            const recortarId = boton.id.slice(7) 
            console.log(recortarId) 
            const producto = buscarProducto(recortarId, productos)
            pushearAArray(carrito, producto)
            alLs("carrito", carrito)           
        }
    })
}

subirAlCarrito()

const carritoActualizado = obtenerDelLs("carrito") || []
carrito = carritoActualizado