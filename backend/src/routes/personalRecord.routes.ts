import express from 'express';
import { addPersonalRecord, getPersonalRecords, deletePersonalRecord } from '../controllers/personalRecord.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, addPersonalRecord);
router.get('/', protect, getPersonalRecords);
router.delete('/:id', protect, deletePersonalRecord);

export default router;
