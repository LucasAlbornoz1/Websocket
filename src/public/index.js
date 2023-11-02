const socket = io()
const table = document.getElementById('realProductsTable')

document.getElementById('createBtn').addEventListener('click', () => {
    const body = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
    }
    fetch('/api/products', {
        method: 'POST', 
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }, 
    }) 
    .then(result => result.json()) 
    .then(result => {
        if (result.status === 'error') throw new Error(result.error)
    }) 
    .then(() => fetch('/api/products')) 
    .then(result => result.json())
    .then(result => {
        if (result.status === 'error') throw new Error(result.error)
        else socket.emit('productList', result.payload)
        alert('Producto creado sin problemas')
        document.getElementById('title').value = '' 
        document.getElementById('description').value = ''
        document.getElementById('price').value = ''
        document.getElementById('code').value = ''
        document.getElementById('stock').value = ''
        document.getElementById('category').value = ''
    }) 
    .catch(error => alert(`Ocurrio un error : ${error}`))
})

deleteProduct = (id) => {
    fetch(`/api/products/${id}`, {
        method: 'DELETE', // método HTTP
    }) 
        .then(result => result.json()) 
        .then(result => {
            if (result.status === 'error') throw new Error(result.error)
            else socket.emit('productList', result.payload) 
            alert('Producto eliminado con éxito!')
        })
        .catch(error => alert(`Ocurrio un error : ${error}`)) 
}

socket.on('updatedProducts', data => {
    table.innerHTML =
        `<tr>
            <td></td>
            <td>Producto</td>
            <td>Descripción</td>
            <td>Precio</td>
            <td>Código</td>
            <td>Stock</td>
            <td>Categoría</td>
        </tr>`;
        for (product of data) {
            let tr = document.createElement('tr')
            tr.innerHTML=
                `<td><button onclick="deleteProduct(${product.id})">Eliminar</button></td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.code}</td>
                <td>${product.stock}</td>
                <td>${product.category}</td>`;
            table.getElementsByTagName('tbody')[0].appendChild(tr);
        }
})