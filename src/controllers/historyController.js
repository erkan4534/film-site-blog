const mongoose = require('mongoose');
const History = require('../models/History');
const Film = require('../models/Film');
const Post = require('../models/Post');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const populateOptions = [
  { path: 'film', select: 'name youtubeUrl category' },
  { path: 'post', select: 'title film category' },
];

const historyCreate = async (req, res) => {
  try {
    const { type, film, post } = req.body;
    const userId = req.user.id;

    if (type === 'watch') {
      if (!isValidId(film)) {
        return res.status(400).json({ message: 'Geçersiz film id' });
      }

      const filmExists = await Film.findById(film).select('_id');
      if (!filmExists) {
        return res.status(404).json({ message: 'Film bulunamadı' });
      }

      const history = await History.findOneAndUpdate(
        { user: userId, type: 'watch', film },
        {
          $set: { user: userId, type: 'watch', film },
          $unset: { post: 1 },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
      ).populate(populateOptions);

      return res.status(200).json(history);
    }

    if (!isValidId(post)) {
      return res.status(400).json({ message: 'Geçersiz yazı id' });
    }

    const postExists = await Post.findById(post).select('_id');
    if (!postExists) {
      return res.status(404).json({ message: 'Yazı bulunamadı' });
    }

    const history = await History.findOneAndUpdate(
      { user: userId, type: 'read', post },
      {
        $set: { user: userId, type: 'read', post },
        $unset: { film: 1 },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    ).populate(populateOptions);

    return res.status(200).json(history);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bu geçmiş kaydı zaten var' });
    }
    return res.status(500).json({ message: error.message });
  }
};

const historySearch = async (req, res) => {
  try {
    const { type } = req.query;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const filter = { user: req.user.id };

    if (type) {
      filter.type = type;
    }

    const histories = await History.find(filter)
      .populate(populateOptions)
      .sort({ updatedAt: -1 })
      .limit(limit);

    return res.status(200).json(histories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const historyDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Geçersiz geçmiş id' });
    }

    const history = await History.findByIdAndDelete(id);

    if (!history) {
      return res.status(404).json({ message: 'Geçmiş kaydı bulunamadı' });
    }

    return res.status(200).json({ message: 'Geçmiş kaydı silindi', history });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  historyCreate,
  historySearch,
  historyDelete,
};
