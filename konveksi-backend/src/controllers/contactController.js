import Contact from '../models/Contact.js';

// Get all contacts
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// Create contact message
export const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Pesan Anda telah dikirim. Kami akan segera menghubungi Anda.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Mark contact as read
export const markAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Pesan tidak ditemukan',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Pesan berhasil ditandai sebagai sudah dibaca',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Delete contact
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Pesan tidak ditemukan',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Pesan berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};
