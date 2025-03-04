import express from 'express';
import { login, signup,logout, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
const AuthRouter = express.Router();

AuthRouter.post('/signup',signup);
AuthRouter.post('/login', login);
AuthRouter.get('/logout',logout);
AuthRouter.get('/checkAuth',protectRoute,checkAuth);

export default AuthRouter;
