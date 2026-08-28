import express from 'express';
import { addPersonalRecord, getPersonalRecords, deletePersonalRecord } from '../controllers/personalRecord.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', requireAuth, addPersonalRecord);
router.get('/', requireAuth, getPersonalRecords);
router.delete('/:id', requireAuth, deletePersonalRecord);

export default router;
