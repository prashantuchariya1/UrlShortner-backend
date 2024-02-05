import express from 'express';
const router = express.Router();
import {convertUrl, getLongUrl} from '../controllers/userController.js';


//Public Routes
router.post('/make-short-url', convertUrl)
router.get('/:shortUrl', getLongUrl)

export default router;