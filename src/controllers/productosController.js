  
const Productos = require('../models/Productos');

// subida de imagen producto al servidor
const multer = require('multer');
const shortid = require('shortid');

const configMulter = {
   storage: fileStorage = multer.diskStorage({
       destination: (req, file, cb) => {
           cb(null, __dirname+'../../uploads/');
       },
       filename: (req, file, cb) => {
           const extension = file.mimetype.split('/')[1];
           cb(null, `${shortid.generate()}.${extension}`);
       }
   }),
   fileFilter(req, file, cb) {
       if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
           cb(null, true);
       } else {
           cb(new Error('Formato No válido'))
       }
   },
}

// pasar la configuracion y el campo
const upload = multer(configMulter).single('imagen');

// sube un archivo
exports.subirArchivo = (req, res, next) => {
   upload(req, res, function(error) {
       if (error) {
           res.json({mensaje: error});
       }
       return next();
   });
}

// agrega nuevos productos
exports.nuevoProducto = async (req, res, next) => {
   const producto = new Productos(req.body);

   try {
       console.log(req.body);
       
       if (req.file) { // req.file || req.file.filename
           producto.imagen = req.file.filename
       }
       await producto.save();
       res.json({mensaje: 'Se agregó un nuevo producto'}); 
   } catch (error) {
       console.log(error);
       next();
   }
}

// mostrar todos los productos
exports.mostrarProductos = async (req, res, next) => {
   try {
       const productos = await Productos.find({});
       // res.json(productos);
       res.render('productos/productos', {nombrePagina: 'Productos' , productos});
   } catch (error) {
       console.log(error);
       next();
   }
}

// mostrar producto en especifico mediante su id
exports.mostrarProducto = async (req, res, next) => {
   try {
       const producto = await Productos.findById(req.params.idProducto);
       res.json(producto);
   } catch (error) {
       console.log(error);
       res.json({mensaje:"Este producto no existe"});
       next();
   }
   
}

// actualizar producto via  id
exports.actualizarProducto = async (req, res, next) => {
   try {

       let productoAnterior = await Productos.findById(req.params.idProducto);

       // construir un nuevo producto
       let nuevoProducto = req.body;

       // verificar si hay imagen nueva
       if (req.file) {
           nuevoProducto.imagen = req.file.filename;
       } else {
           nuevoProducto.imagen = productoAnterior.imagen;
       }

       let producto = await Productos.findOneAndUpdate({_id: req.params.idProducto}, nuevoProducto, {
               new: true,
           });
       res.json(producto);
   } catch (error) {
       console.log(error);
       res.json({error: `No se pudo actualizar el producto de id: ${req.params.idProducto}`});
       next(); 
   }
}

// Eliminar un producto via id 
   // aun falta eliminar el archivo del servidor
exports.eliminarProducto = async (req, res, next) => {
   try {
       await Productos.findByIdAndDelete({ _id :  req.params.idProducto});
       res.json({mensaje: 'El producto se ha eliminado'});
   } catch (error) {
       console.log(error);
       next();
   }
}

// buscador
exports.buscarProducto = async (req, res, next) => {
    try {
        const { query } = req.params;
        const producto = await Productos.find({ nombre: new RegExp(query, 'i') });
        res.json(producto);

    } catch(error) {
        console.log(error);
        next();
    }
}