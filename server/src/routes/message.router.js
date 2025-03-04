import { getMessages, getUsers, sendMessage } from "../controllers/message.controller.js";
import express from 'express';
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
const MessageRouter = express.Router();

MessageRouter.get('/users', protectRoute, getUsers);
MessageRouter.get('/:id', protectRoute, getMessages);
MessageRouter.post('/send/:id',protectRoute, upload.single('image'), sendMessage);

export default MessageRouter;