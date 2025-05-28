import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Review from '../models/Review.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/book-review-platform')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  }
];

const books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    genre: 'Fiction',
    publishedYear: 1960,
    featured: true
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: '1984 is a dystopian novel by English novelist George Orwell. It was published in June 1949 by Secker & Warburg as Orwell\'s ninth and final book completed in his lifetime.',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    genre: 'Sci-Fi',
    publishedYear: 1949,
    featured: true
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'Pride and Prejudice is a romantic novel of manners written by Jane Austen in 1813. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    genre: 'Romance',
    publishedYear: 1813,
    featured: true
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'The Great Gatsby is a 1925 novel written by American author F. Scott Fitzgerald that follows a cast of characters living in the fictional towns of West Egg and East Egg on prosperous Long Island in the summer of 1922.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    genre: 'Fiction',
    publishedYear: 1925,
    featured: true
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'The Hobbit, or There and Back Again is a children\'s fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction.',
    coverImage: 'https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    genre: 'Fantasy',
    publishedYear: 1937,
    featured: true
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'The Catcher in the Rye is a novel by J. D. Salinger, partially published in serial form in 1945–1946 and as a novel in 1951. It was originally intended for adults but is often read by adolescents for its themes of angst, alienation, and as a critique on superficiality in society.',
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    genre: 'Fiction',
    publishedYear: 1951,
    featured: false
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    description: 'The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien. The story began as a sequel to Tolkien\'s 1937 fantasy novel The Hobbit, but eventually developed into a much larger work.',
    coverImage: 'https://placehold.co/400x600/1e293b/ffffff?text=The+Lord+of+the+Rings',
    genre: 'Fantasy',
    publishedYear: 1954,
    featured: true
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    description: 'Harry Potter and the Philosopher\'s Stone is a fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling\'s debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday.',
    coverImage: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    genre: 'Fantasy',
    publishedYear: 1997,
    featured: true
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description: 'The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    genre: 'Fiction',
    publishedYear: 1988,
    featured: false
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    description: 'Brave New World is a dystopian novel by English author Aldous Huxley, written in 1931 and published in 1932. Largely set in a futuristic World State, inhabited by genetically modified citizens and an intelligence-based social hierarchy.',
    coverImage: 'https://images.unsplash.com/photo-1531072901881-d644216d4bf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    genre: 'Sci-Fi',
    publishedYear: 1932,
    featured: false
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear database
    await User.deleteMany();
    await Book.deleteMany();
    await Review.deleteMany();
    
    console.log('Database cleared');
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Insert books
    const createdBooks = await Book.insertMany(books);
    console.log(`${createdBooks.length} books created`);
    
    // Create some reviews
    const reviews = [
      {
        user: createdUsers[1]._id, // John Doe
        book: createdBooks[0]._id, // To Kill a Mockingbird
        rating: 5,
        comment: 'A timeless classic that everyone should read. The characters are so well developed and the story is powerful.'
      },
      {
        user: createdUsers[2]._id, // Jane Smith
        book: createdBooks[0]._id, // To Kill a Mockingbird
        rating: 4,
        comment: 'Beautifully written with important themes that are still relevant today.'
      },
      {
        user: createdUsers[1]._id, // John Doe
        book: createdBooks[1]._id, // 1984
        rating: 5,
        comment: 'A chilling and prophetic novel. Orwell\'s vision of a totalitarian future is frighteningly relevant.'
      },
      {
        user: createdUsers[2]._id, // Jane Smith
        book: createdBooks[2]._id, // Pride and Prejudice
        rating: 4,
        comment: 'A delightful read with witty dialogue and memorable characters. Jane Austen was ahead of her time.'
      },
      {
        user: createdUsers[1]._id, // John Doe
        book: createdBooks[3]._id, // The Great Gatsby
        rating: 4,
        comment: 'Fitzgerald\'s prose is beautiful and the story captures the essence of the Jazz Age perfectly.'
      }
    ];
    
    const createdReviews = await Review.insertMany(reviews);
    console.log(`${createdReviews.length} reviews created`);
    
    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();