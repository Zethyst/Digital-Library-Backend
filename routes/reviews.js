import express from 'express';
import Review from '../models/Review.js';
import Book from '../models/Book.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get reviews for a book
// @access  Public
router.get('/', async (req, res) => {
  try {
    const bookId = req.query.book;
    
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }
    
    const reviews = await Review.find({ book: bookId })
      .sort({ createdAt: -1 })
      .populate('user', 'name');
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { book, rating, comment } = req.body;
    
    // Check if book exists
    const bookExists = await Book.findById(book);
    
    if (!bookExists) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user already reviewed this book
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      book
    });
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    
    // Create review
    const review = await Review.create({
      user: req.user._id,
      book,
      rating: Number(rating),
      comment
    });
    
    // Populate user data
    await review.populate('user', 'name');
    
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }
    
    // Update fields
    const { rating, comment } = req.body;
    
    review.rating = Number(rating) || review.rating;
    review.comment = comment || review.comment;
    
    const updatedReview = await review.save();
    
    // Populate user data
    await updatedReview.populate('user', 'name');
    
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    await review.deleteOne();
    
    res.json({ message: 'Review removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;