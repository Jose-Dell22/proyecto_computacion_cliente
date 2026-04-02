import { Router } from "express";
import { register, 
         login, 
         logout,
         profile } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema  } from "../middlewares/validator.middlewares.js";
import {registerSchema, loginSchema} from '../schema/schema.js'

const router = Router();
// Se usa el post para guardar datos
// Registrar
router.post('/register', validateSchema(registerSchema), register)
// Login
router.post('/login', validateSchema(loginSchema), login)
// Logout
router.post('/logout', logout)
// Profile, se usa el metod GET para obtener el perfil
// authRequired -> Para la autenticacion de la persona.
router.get('/profile', authRequired, profile)


export default  router;