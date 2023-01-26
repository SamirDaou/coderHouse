
let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || []


let botonCarrito = document.getElementById("botonCarrito")
let modalBody = document.getElementById("modal-body")
let botonFinalizarCompra = document.getElementById("botonFinalizarCompra")
let parrafoCompra = document.getElementById('precioTotal')
let acumulador
let divProductos = document.getElementById("productos")
let inputBuscar = document.getElementById("buscador") 
let btnBuscar = document.getElementById("btnBuscar")

function mostrarCatalogo(array){
    divProductos.innerHTML = ""
    array.forEach((articulo)=>{
        let nuevoProducto = document.createElement("div")
        nuevoProducto.innerHTML = `<article id="${articulo.id}" class="card">
                                        <h3 class="tituloCard">${articulo.titulo}</h3>
                                        <img src="${articulo.imagen}" alt="${articulo.titulo}">
                                        <div class="content">
                                            <p class="descriptionCard">${articulo.description}</p>
                                            <p class="precioCard">Precio: ${articulo.precio}</p>
                                            <button id="agregarBtn${articulo.id}">Agregar al carrito</button>
                                        </div>
                                    </article>`
        divProductos.appendChild(nuevoProducto)
        
        //código btnAgregar
        let btnAgregar = document.getElementById(`agregarBtn${articulo.id}`)
        console.log(btnAgregar);
        //invocar agregarAlCarrito
        btnAgregar.addEventListener("click", () =>{agregarAlCarrito(articulo)})
        })
        
        
    }
function agregarAlCarrito(articulo){
    console.log(`El articulo ${articulo.titulo}  ha sido agregado. N° identificación articulo: ${articulo.id}`)
    let articuloAgregado = productosEnCarrito.find((elem) => (elem.id == articulo.id))
    console.log(articuloAgregado)
    console.log(productosEnCarrito);
    if (articuloAgregado == undefined){
        productosEnCarrito.push(articulo)
        console.log(productosEnCarrito);
        //Cargar al storage
        localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))        
        Swal.fire({
            title: "Ha agregado el producto",
            text: `El articulo ${articulo.titulo} de ${articulo.autor} ha sido agregado`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            confirmButtonText:"Entendido",
        })
    }else{
        console.log(`El articulo ${articulo.titulo} ya se encuentra en el carrito`)
        Swal.fire({
                    title: "Producto ya agregado",
                    text: `El articulo ${articulo.titulo} ya se encuentra en el carrito`,
                    icon: "info",
                    timer:4000,
                    confirmButtonText:"Aceptar",
                    confirmButtonColor: 'green',
                    
                })
    }       
}

function cargarProductosCarrito(productosDelStorage) {

    modalBody.innerHTML = " "  
    productosDelStorage.forEach((productoCarrito) => {
        
        modalBody.innerHTML += `
            <div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">
                <img class="card-img-top" src="${productoCarrito.imagen}" alt="${productoCarrito.titulo}">
                <div class="card-body">
                        <h4 class="card-title">${productoCarrito.titulo}</h4>
                    
                        <p class="card-text">$${productoCarrito.precio}</p> 
                        <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
                </div>    
            </div>
    `

})

productosDelStorage.forEach((productoCarrito, indice)=>{
        //capturamos el boton sin usar variable y adjuntamos evento
        document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener('click', () => {
            //Cartel emergente:
            Toastify({
                text: `${productoCarrito.titulo} ha sido eliminado`,
                duration: 2500,
                gravity: "bottom",
                position: "left",
                style:{
                    background: "linear-gradient(to right, #00b09b, #96c92d)",
                    color: "white", 
                }
                
                }).showToast();
            //Dentro del evento:
            console.log(`Producto ${productoCarrito.titulo} eliminado`)
            //Eliminamos del DOM
            let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
            console.log(cardProducto);
            cardProducto.remove()

            //Eliminamos del array compras
            productosEnCarrito.splice(indice, 1)
            console.log(productosEnCarrito)
            localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))

            //Vuelvo a imprimir
            cargarProductosCarrito(productosEnCarrito)
        })  

})

compraTotal(...productosDelStorage)
}

//Transformamos la function con spread y reduce
function compraTotal(...productosTotal) {
    acumulador = 0;

    acumulador = productosTotal.reduce((acumulador, productoCarrito)=>{
        return acumulador + productoCarrito.precio
    },0)
    
    console.log(acumulador)
    
    //Reemplazar con ternario
    acumulador > 0 ? parrafoCompra.innerHTML = `Importe de su compra es ${acumulador}`: parrafoCompra.innerHTML = `<p>Productos en el carrito</p>`

}

function finalizarCompra(){
    Swal.fire({
        title: 'Está seguro de realizar la compra❓',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '✅Sí, seguro',
        cancelButtonText: '❌No, no quiero',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then((result) => {
        let DateTime = luxon.DateTime
        const dt = DateTime.now()
        
        let fecha = `Siendo las ${dt.toLocaleString(DateTime.TIME_SIMPLE)} del ${dt.toLocaleString(DateTime.DATE_FULL)}`
    if (result.isConfirmed) {
        Swal.fire({
            title: 'Compra realizada',
            icon: 'success',
            confirmButtonColor: 'green',
            text: `✅Muchas gracias por su compra ha adquirido nuestros productos. `,
            footer: `<p>${fecha} 🕔 nos comprometemos que en el plazo de 48hs nos comunicaremos con usted</p>`
        })
        //Ahora pusimos el código dentro del THEN para que se ejecute en caso de que result sea confirmado. 
        productosEnCarrito = []
        localStorage.removeItem('carrito')
        //Mostramos total
        console.log(`El total de su compra es ${acumulador}`)
        //Volvemos a cargar el modal con el array vacío por lo que quedará sin nada
        cargarProductosCarrito(productosEnCarrito)
        }
        else{
            Swal.fire({
                title: 'Compra no realizada',
                icon: 'info',
                text: `❌La compra NO ha sido realizada! Sus productos siguen en el carrito `,
                confirmButtonColor: 'green',
                timer:3500
            })
        }
    })}

    botonCarrito.addEventListener('click', () => {
        cargarProductosCarrito(productosEnCarrito)
    })
    botonFinalizarCompra.addEventListener('click',()=>{
        finalizarCompra()
    })
    btnBuscar.addEventListener('click', ()=>{
        //function de buscado
        event.preventDefault()
        console.log("click");
        console.log(inputBuscar.value.toLowerCase());
        let tituloBuscado = estanteria.filter(articulo =>(articulo.titulo.toLowerCase() == inputBuscar.value.toLowerCase()))
        console.log(tituloBuscado);
        if(tituloBuscado.length == 0){
            console.log(`No hay coincidencia`);
            mostrarCatalogo(estanteria)
        }else{
            mostrarCatalogo(tituloBuscado)
    
        }
    })

    let divLoader = document.getElementById("loader")

const loading = setTimeout(()=>{

    divLoader.remove()

    mostrarCatalogo(estanteria)
},2000)