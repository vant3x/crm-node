const Clientes = require('../models/Clientes');

// agrega un nuevo cliente

exports.nuevoCliente = async (req, res) => {
    const { nombre, apellido, empresa, email, telefono } = req.body;
    const cliente = new Clientes({
        nombre, apellido, empresa, email, telefono
    });

    const errores = [];

    if (!nombre) {
        errores.push({text: 'Por favor escriba un nombre'});
    }

    if (!apellido) {
        errores.push({text: 'Por favor escriba un apellido'});
    }
    
   if (!email) {
        errores.push({text: 'Por favor escriba un email'});
    }
   if (!telefono) {
        errores.push({text: 'Por favor escriba un telefono'});
    }

    if (errores.length > 0) {
        res.render('clientes/nuevo-cliente', {
            errores,
            nombre,
            apellido,
            empresa,
            email,
            telefono
        });
    } else {

        try {
            // almacenar el registro
            await cliente.save();
            res.redirect('/clientes', {statusNew: 1});
        } catch (error) {
            console.log(error);
            res.send(error);
            next();
        }
    }
}

// mostrar todos los clientes
exports.mostrarClientes = async (req, res) => {
    
    try {
        const clientes = await Clientes.find({});
       // res.json(clientes);
       res.render('clientes/clientes', {nombrePagina: 'Clientes' ,clientes});
    } catch (error) {
        console.log(error);
        next();
    }
}

// mostrar cliente en especifico
exports.mostrarCliente = async (req, res, next) => {
    const cliente = await Clientes.findById(req.params.idCliente);

    if (!cliente) {
        res.json({mensaje: "El cliente buscado no existe"});
        next();
    }
    // Mostrar el cliente
     res.json(cliente);
}

// mostrar cliente en especifico antes de editar
exports.mostrarClienteEditar = async (req, res, next) => {
    const cliente = await Clientes.findById(req.params.idCliente);

    if (!cliente) {
        res.json({mensaje: "El cliente buscado no existe"});
        next();
    }
    // Mostrar el cliente
     res.render('clientes/editar-cliente', {cliente});
}


// Actualiza un cliente 
exports.actualizarCliente = async (req, res, next) => {
    try {
        const cliente = await Clientes.findOneAndUpdate({_id : req.params.idCliente}, 
            req.body, {
                new: true
            });
           //  res.json(cliente);  
           res.redirect('/clientes');
            
    } catch (eror) {
        res.send(error);
        next();
    }
} 

// Eliminar un cliente

exports.eliminarCliente = async (req, res, next) => {
    try {
        const cliente = await Clientes.findByIdAndDelete({_id : req.params.idCliente});
       // res.json({mensaje: `El cliente ${cliente.nombre} se ha eliminado`});
       res.redirect('/clientes');   
    } catch (eror) {
        console.log(error);
    }
}