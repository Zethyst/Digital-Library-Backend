import express from 'express';
import Book from '../models/Book.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books with pagination, search, and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    // Search by title or author
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex }
      ];
    }
    
    // Filter by genre
    if (req.query.genre) {
      query.genre = new RegExp(req.query.genre, 'i');
    }
    
    // Get books
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name'
        }
      });
    
    // Get total count for pagination
    const total = await Book.countDocuments(query);
    
    res.json({
      books,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/books/featured
// @desc    Get featured books
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredBooks = await Book.find({ featured: true })
      .limit(3)
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name'
        }
      });
    
    res.json(featuredBooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/books/:id
// @desc    Get book by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name'
        }
      });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/books
// @desc    Create a new book
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, author, description, coverImage, genre, publishedYear, featured } = req.body;
    
    const book = await Book.create({
      title,
      author,
      description,
      coverImage,
      genre,
      publishedYear,
      featured: featured || false
    });
    
    res.status(201).json(book);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Update fields
    const { title, author, description, coverImage, genre, publishedYear, featured } = req.body;
    
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.coverImage = coverImage || book.coverImage;
    book.genre = genre || book.genre;
    book.publishedYear = publishedYear || book.publishedYear;
    book.featured = featured !== undefined ? featured : book.featured;
    
    const updatedBook = await book.save();
    
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await book.deleteOne();
    
    res.json({ message: 'Book removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;