import Product from '../models/Product.js';

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Produk berhasil dibuat',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Produk berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};
