const mongoose = require('mongoose');
const Post = require('../models/Post');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const populateOptions = [
  { path: 'author', select: 'firstName lastName email role' },
  { path: 'film', select: 'name youtubeUrl' },
  { path: 'category', select: 'name' },
];

const postCreate = async (req, res) => {
  try {
    const { title, content, film, category } = req.body;

    if (film && !isValidId(film)) {
      return res.status(400).json({ message: 'Geçersiz film id' });
    }

    if (category && !isValidId(category)) {
      return res.status(400).json({ message: 'Geçersiz kategori id' });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user.id,
      film: film || undefined,
      category: category || undefined,
    });

    const populated = await Post.findById(post._id).populate(populateOptions);

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postSearch = async (req, res) => {
  try {
    const { title, film, category, author } = req.query;
    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (film) {
      if (!isValidId(film)) {
        return res.status(400).json({ message: 'Geçersiz film id' });
      }
      filter.film = film;
    }

    if (category) {
      if (!isValidId(category)) {
        return res.status(400).json({ message: 'Geçersiz kategori id' });
      }
      filter.category = category;
    }

    if (author) {
      if (!isValidId(author)) {
        return res.status(400).json({ message: 'Geçersiz yazar id' });
      }
      filter.author = author;
    }

    const posts = await Post.find(filter)
      .populate(populateOptions)
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postFind = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Geçersiz yazı id' });
    }

    const post = await Post.findById(id).populate(populateOptions);

    if (!post) {
      return res.status(404).json({ message: 'Yazı bulunamadı' });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, film, category } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Geçersiz yazı id' });
    }

    if (film && !isValidId(film)) {
      return res.status(400).json({ message: 'Geçersiz film id' });
    }

    if (category && !isValidId(category)) {
      return res.status(400).json({ message: 'Geçersiz kategori id' });
    }

    const updateData = {};
    if (title !== undefined) {
      updateData.title = title;
    }
    if (content !== undefined) {
      updateData.content = content;
    }
    if (film !== undefined) {
      updateData.film = film || null;
    }
    if (category !== undefined) {
      updateData.category = category || null;
    }

    const post = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate(populateOptions);

    if (!post) {
      return res.status(404).json({ message: 'Yazı bulunamadı' });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const postDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Geçersiz yazı id' });
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: 'Yazı bulunamadı' });
    }

    return res.status(200).json({ message: 'Yazı silindi', post });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  postCreate,
  postSearch,
  postFind,
  postUpdate,
  postDelete,
};
