import passport from "passport";
import local from "passport-local";
import jwt, { ExtractJwt } from "passport-jwt";
import GitHubStrategy from "passport-github2";

import config from "./config.js";
import { createHash, isValidPassword } from "../utils.js";
import UserDB from "../daos/user.model.js";

const userDB = new UserDB();

const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;

const cookieExtractor = (req)=>{
    let token = null;

    if(req && req.cookies){
        token = req.cookies["user_jwt"];
    }

    return token;
}
const headerExtractor = (req)=>{
    let token = null;
    if(!!req.headers.authorization){
        token = req.headers.authorization.split(' ')[1];
    }

    return token;
}

const initializePassport = ()=>{
    passport.use("register", new LocalStrategy(
        {passReqToCallback:true, usernameField:"email"},
        async (req, username, password, done)=>{
            const {first_name, last_name, email, age} = req.body;

            try {
                let user = await userDB.getUserByEmail(email);

                if(!!user){
                    console.log("Este usuario ya existe");
                    return done(null, false, {message: "Este usuario ya existe", valCode:1});
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }

                let result = await userDB.addUser(newUser);

                return done(null, result);
            } catch (error) {
                return done("Error al registrar el usuario: "+error);
            }
        }
    ))

    passport.use("login", new LocalStrategy(
        {usernameField:"email"},
        async (username, password, done)=>{
            try {
                const user = await userDB.getUserByEmail(username);

                if(!!!user){
                    console.log("Usuario no encontrado.");
                    return done(null, false, {message:"Usuario no encontrado.", valCode:0});
                }
                if(!isValidPassword(user, password)){
                    console.log("Contraseña incorrecta.");
                    return done(null, false, {message:"Contraseña incorrecta.", valCode:2});
                }

                return done(null, user);
            } catch (error) {
                console.log("Error general en estrategia");
                return done("Error en estrategia de login: "+error);
            }
        })
    )

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor, headerExtractor]),
        secretOrKey: config.jwt_private_key
    }, async(jwt_payload, done)=>{
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use("github", new GitHubStrategy(
        {clientID:config.gitHub_ClientId, clientSecret:config.gitHub_ClientSecret, callbackURL:config.gitHub_CallbackURL},
        async (accessToken, refreshToken, profile, done)=>{
            try {
                let user = await userDB.getUserByEmail(profile._json.email);
                
                if(!!!user){
                    if(!!!profile._json.name || !!!profile._json.email) return done("Este perfil no cuenta con email o nombre publico.");
                    
                    const newUser = {
                        first_name: profile._json.name,
                        last_name: "",
                        email: profile._json.email,
                        age: 0,
                        password: ""
                    }

                    let result = await userDB.addUser(newUser);
                    done(null, result);
                }else{
                    done(null, user);
                }
            } catch (error) {
                done("Error de login con Github: "+error);
            }
        }
    ))

    
    passport.serializeUser((user, done)=>{
        done(null, user);
    })

    passport.deserializeUser(async (id, done)=>{
        let user = await userDB.getUserById(id);
        done(null, user);
    })
}

export default initializePassport;