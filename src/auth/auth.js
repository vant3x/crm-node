const passport = require('passport');
const localStrategy = require('passort-local').Strategy;
const Usuarios = require('../models/Usuarios');

// middleware de passport que se encarga de registrar un usuario
passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',

}, async (email, password, done) => {
    try {
         const usuario = await Usuarios.create({email, password});
         // enviar la información al siguiente middleware
         return (null, usuario);
    } catch (error) {
        done(error);
    }
}));

// middleware de passport para manejar el login de usuario
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // encontrar el usuario asociado al email
        const usuario = await Usuarios.findOne({ email });
        if (!usuario) {
            return done(null, false, { mensaje: 'Usuario no encontrado'});
        }        

        // validar password
        const validate = await usuario.isValidPassword(password);
        if (!validate) {
            return done(null, false, { mensaje: 'Password incorrecta'});
        }
        return done(null, usuario, { mensaje: 'Inicio de Sesión exitoso'});
    } catch (error) {
        return done(error);
    }
}));

const JWTstrategy = require('passport-jwt').Strategy;

const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(new JWTstrategy({
    secretOrKey: 'top_secret',
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
    try {
        return done(null, token.usuario);
    } catch (error) {
        done(error)
    }
})); 