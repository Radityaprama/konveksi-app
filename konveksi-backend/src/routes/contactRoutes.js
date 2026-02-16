import express from 'express';
import {
  getContacts,
  createContact,
  markAsRead,
  deleteContact,
} from '../controllers/contactController.js';

const router = express.Router();

router.get('/', getContacts);

router.post('/', createContact);

router.put('/:id/read', markAsRead);

router.delete('/:id', deleteContact);

export default router;
