import { Router } from 'express';
import { classify, plan, execute } from '../controller/ai.js';

const router = Router();

router.post('/classify-query', classify);
router.post('/plan-tasks', plan);
router.post('/execute-tasks', execute);

export default router;