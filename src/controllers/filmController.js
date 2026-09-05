const mongoose = require('mongoose');
const Film = require('../models/Film');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const filmCreate = async (req, res) => {
  try {
    const { name, description, category, youtubeUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Film adı zorunludur' });
    }

    if (category && !isValidId(category)) {
      return res.status(400).json({ message: 'Geçersiz kategori id' });
    }

    const film = await Film.create({ name, description, category, youtubeUrl });

    return res.status(201).json(film);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filmSearch = async (req, res) => {
  try {
    const { name, category } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      if (!isValidId(category)) {
        return res.status(400).json({ message: 'Geçersiz kategori id' });
      }
      filter.category = category;
    }

    const films = await Film.find(filter)
      .select('-youtubeUrl')
      .populate('category')
      .sort({ createdAt: -1 });

    return res.status(200).json(films);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filmFind = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Geçersiz film id' });
    }

    const film = await Film.findById(id).populate('category');

    if (!film) {
      return res.status(404).json({ message: 'Film bulunamadı' });
    }

    return res.status(200).json(film);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filmUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, youtubeUrl } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Geçersiz film id' });
    }

    if (category && !isValidId(category)) {
      return res.status(400).json({ message: 'Geçersiz kategori id' });
    }

    const film = await Film.findByIdAndUpdate(
      id,
      { name, description, category, youtubeUrl },
      { new: true, runValidators: true }
    ).populate('category');

    if (!film) {
      return res.status(404).json({ message: 'Film bulunamadı' });
    }

    return res.status(200).json(film);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filmDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Geçersiz film id' });
    }

    const film = await Film.findByIdAndDelete(id);

    if (!film) {
      return res.status(404).json({ message: 'Film bulunamadı' });
    }

    return res.status(200).json({ message: 'Film silindi', film });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  filmCreate,
  filmSearch,
  filmFind,
  filmUpdate,
  filmDelete,
};
