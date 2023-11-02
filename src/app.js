import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'

const PORT = 8080; 


const app = express();
app.use(express.json()); 
app.use(express.static('./src/public'));

const serverHttp = app.listen(PORT, () => console.log('server listo'))
const io = new Server(serverHttp) 

app.use((req, res, next) => {
    req.io = io
    next()
})

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');


app.get('/', (req, res) => res.render('index'));

app.use('/products', viewsRouter); 
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter); 
io.on('connection', socket => {
    console.log('Nuevo cliente')
    socket.on('updatedProducts', data => { 
        io.emit('productList', data) 
    }) 
}) 