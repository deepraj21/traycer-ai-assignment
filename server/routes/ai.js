import { Router } from 'express';
import { classify, plan, execute, respond } from '../controller/ai.js';

const router = Router();

router.post('/classify-query', classify);
router.post('/respond', respond);
router.post('/plan-tasks', plan);
router.post('/execute-tasks', execute);

export default router;