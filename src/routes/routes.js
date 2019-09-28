const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const clienteController = require('../controllers/clienteController');
const productosController = require('../controllers/productosController');
const pedidosController = require('../controllers/pedidosController');
const usuariosController = require('./../controllers/usuariosController');

router.get('/', (req, res) => {
    res.render('index', {
        nombrePagina: 'CRM AcaGeek',
        tagLine: 'Administra clientes, productos y pedidos facilmente'
    });
});
// -------***--- Rutas clientes --------***---

// agregar nuevos clientes
router.get('/clientes/nuevo', (req, res) => { res.render('clientes/nuevo-cliente', {nombrePagina:'Nuevo Cliente'})});
router.post('/clientes/nuevo-cliente', clienteController.nuevoCliente);
// Obtener todos los clientes
router.get('/clientes', clienteController.mostrarClientes);
/*router.get('/clientes', (req, res) => {
    res.render('clientes/clientes');
})*/

// Obtener un cliente en especifico por ID
router.get('/api/clientes/:idCliente', clienteController.mostrarCliente);

// Actualizar cliente
router.get('/clientes/editar/:idCliente', clienteController.mostrarClienteEditar);
router.put('/clientes/:idCliente', clienteController.actualizarCliente);

// Eliminar cliente 
router.delete('/clientes/:idCliente', clienteController.eliminarCliente);


// -------***--- Rutas Productos --------***---
// nuevo producto
router.post('/api/productos', 
    productosController.subirArchivo,
    productosController.nuevoProducto
);

// mostrar productos
router.get('/productos',  productosController.mostrarProductos);

// mostrar producto especifico por su id
router.get('/api/productos/:idProducto', productosController.mostrarProducto);

// actualizar productos 
router.put('/api/productos/:idProducto', 
    productosController.subirArchivo,
    productosController.actualizarProducto
);

// eliminar producto 
router.delete('/api/productos/:idProducto', 
    productosController.eliminarProducto
);

// Busqueda de producto
router.post('/api/productos/busqueda/:query', productosController.buscarProducto);

// -------***--- Rutas Pedidos --------***---

//  Agrega nuevo pedido
router.post('/api/pedidos/nuevo/:idUsuario', pedidosController.nuevoPedido);

// mostrar todos los pedidos 
router.get('/pedidos', pedidosController.mostrarPedidos);

// mostrar un pedido por su id
router.get('/api/pedidos/:idPedido', pedidosController.mostrarPedido);

// actualizar pedidos 
router.put('/api/pedidos/:idPedido', pedidosController.actualizarPedido);

// eliminar un pedido 
router.delete('/api/pedidos/:idPedido', pedidosController.eliminarPedido);

// Usuarios ---------------

router.post('/api/signup',  passport.authenticate('signup', { session: false }), async (req, res, next) => {
    res.json({
        mensaje: 'Registro exitoso',
        user: req.usuario
    });
});

router.get('/signup', usuariosController.formSignUp);

router.post('/api/login', async (req, res, next) => {
    passport.authenticate('login', async (err, usuario, info) => {
        try {
            if (err || !usuario) {
                const error = new Error('Ha ocurrido un error :(')
                return next(error);
            }

            req.login(usuario, { session: false }, async (error) => {
                if ( error ) return next(error)

                const body = {_id: usuario._id, email: usuario.email };

                const token = jwt.sign({usuario: body}, 'top_secret');

                return res.json({ token });
            } );

            } catch (error) {
                return next(error);
            }
    }) (req, res, next);
});

router.get('/login', usuariosController.formLogin);

module.exports = router;