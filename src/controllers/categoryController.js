const mongoose = require('mongoose');
const Category = require('../models/Category');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleDuplicateName = (error, res) => {
  if (error.code === 11000) {
    return res.status(400).json({ message: 'Bu kategori adı zaten kayıtlı' });
  }
  return res.status(500).json({ message: error.message });
};

const categoryCreate = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Kategori adı zorunludur' });
    }

    const category = await Category.create({ name, description });

    return res.status(201).json(category);
  } catch (error) {
    return handleDuplicateName(error, res);
  }
};

const categorySearch = async (req, res) => {
  try {
    const { name } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const categoryFind = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Geçersiz kategori id' });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const categoryUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Geçersiz kategori id' });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return handleDuplicateName(error, res);
  }
};

const categoryDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Geçersiz kategori id' });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    return res.status(200).json({ message: 'Kategori silindi', category });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  categoryCreate,
  categorySearch,
  categoryFind,
  categoryUpdate,
  categoryDelete,
};
