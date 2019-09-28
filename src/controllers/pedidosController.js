const Pedidos = require('./../models/Pedidos');

// crear nuevos pedidos

exports.nuevoPedido = async (req, res, next) => {
    const pedido = new Pedidos(req.body);
    try {
        await pedido.save();
        res.json({mensaje: 'Se agregó un nuevo pedido'});
        console.log(pedido);
    } catch (error) {
        console.log(error);
        next();
    }
}

// mostrar todos los pedidos
exports.mostrarPedidos = async (req, res, next) => {
    try {
        const pedidos = await Pedidos.find({}).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });
      //  res.json(pedidos);
      res.render('pedidos/pedidos', {nombrePagina:'Pedidos',pedidos});
      
    } catch (error) {
        console.log(error);
        next();
    }
}

// mostrar pedido en especifico via id
exports.mostrarPedido = async (req, res, next) => {
    try {
    const pedido = await Pedidos.findById(req.params.idPedido).populate('cliente').populate({
        path: 'pedido.producto',
        model: 'Productos'
     });
     res.json(pedido);
    } catch (error) {   
       res.json({mensaje: 'Ese pedido que buscas no existe :('});
       next();
    }
}

// actualizar pedido
exports.actualizarPedido = async (req, res, next) => {
    try {
        let pedido = await Pedidos.findOneAndUpdate({_id : req.params.idPedido}, req.body, {
            new: true
        });
        res.json(pedido);
    } catch (error) {
        console.log(error);
        next();
    }
}

// elimina un pedido
exports.eliminarPedido = async (req, res, next) => {
    try {
        await Pedidos.findOneAndDelete({_id:req.params.idPedido});
        res.json({mensaje: `El pedido de id ${req.params.idPedido} se eliminó`});
    } catch (error) {
        console.log(error);
        next();
    }
}