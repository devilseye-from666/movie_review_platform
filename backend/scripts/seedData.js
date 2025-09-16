const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');

const connectDB = require('../config/database');

const sampleMovies = [
  {
    title: "The Shawshank Redemption",
    genre: ["Drama"],
    releaseYear: 1994,
    director: "Frank Darabont",
    cast: [
      { name: "Tim Robbins", character: "Andy Dufresne" },
      { name: "Morgan Freeman", character: "Ellis 'Red' Redding" }
    ],
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    runtime: 142,
    isFeatured: true,
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
  },
  {
    title: "The Godfather",
    genre: ["Crime", "Drama"],
    releaseYear: 1972,
    director: "Francis Ford Coppola",
    cast: [
      { name: "Marlon Brando", character: "Vito Corleone" },
      { name: "Al Pacino", character: "Michael Corleone" }
    ],
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    runtime: 175,
    isFeatured: true,
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
  },
  {
    title: "The Dark Knight",
    genre: ["Action", "Crime", "Drama"],
    releaseYear: 2008,
    director: "Christopher Nolan",
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman" },
      { name: "Heath Ledger", character: "Joker" }
    ],
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    runtime: 152,
    isFeatured: true,
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    title: "Pulp Fiction",
    genre: ["Crime", "Drama"],
    releaseYear: 1994,
    director: "Quentin Tarantino",
    cast: [
      { name: "John Travolta", character: "Vincent Vega" },
      { name: "Samuel L. Jackson", character: "Jules Winnfield" }
    ],
    synopsis: "The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    runtime: 154,
    isFeatured: true,
    posterUrl: "https://image.tmdb.org/t/p/w500/dM2w364MScsjFf8pfMbaWUcWrR.jpg"
  },
  {
    title: "Forrest Gump",
    genre: ["Drama", "Romance"],
    releaseYear: 1994,
    director: "Robert Zemeckis",
    cast: [
      { name: "Tom Hanks", character: "Forrest Gump" },
      { name: "Robin Wright", character: "Jenny Curran" }
    ],
    synopsis: "The presidencies of Kennedy and Johnson, Vietnam, Watergate, and other history unfold through the perspective of an Alabama man with a low IQ.",
    runtime: 142,
    isFeatured: true,
    posterUrl: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"
  },
  {
    title: "Inception",
    genre: ["Action", "Sci-Fi", "Thriller"],
    releaseYear: 2010,
    director: "Christopher Nolan",
    cast: [
      { name: "Leonardo DiCaprio", character: "Dom Cobb" },
      { name: "Joseph Gordon-Levitt", character: "Arthur" }
    ],
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    runtime: 148,
    isFeatured: true,
    posterUrl: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg"
  },
  {
    title: "Fight Club",
    genre: ["Drama"],
    releaseYear: 1999,
    director: "David Fincher",
    cast: [
      { name: "Brad Pitt", character: "Tyler Durden" },
      { name: "Edward Norton", character: "The Narrator" }
    ],
    synopsis: "An insomniac office worker and a soapmaker form an underground fight club that evolves into something much more.",
    runtime: 139,
    isFeatured: true,
    posterUrl: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg"
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    genre: ["Adventure", "Fantasy"],
    releaseYear: 2001,
    director: "Peter Jackson",
    cast: [
      { name: "Elijah Wood", character: "Frodo Baggins" },
      { name: "Ian McKellen", character: "Gandalf" }
    ],
    synopsis: "A meek Hobbit and eight companions set out on a journey to destroy the One Ring and save Middle-earth from the Dark Lord Sauron.",
    runtime: 178,
    isFeatured: true,
    posterUrl: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg"
  },
  {
    title: "Interstellar",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    releaseYear: 2014,
    director: "Christopher Nolan",
    cast: [
      { name: "Matthew McConaughey", character: "Cooper" },
      { name: "Anne Hathaway", character: "Brand" }
    ],
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    runtime: 169,
    isFeatured: true,
    posterUrl: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"
  },
  {
    title: "The Matrix",
    genre: ["Action", "Sci-Fi"],
    releaseYear: 1999,
    director: "The Wachowskis",
    cast: [
      { name: "Keanu Reeves", character: "Neo" },
      { name: "Laurence Fishburne", character: "Morpheus" }
    ],
    synopsis: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
    runtime: 136,
    isFeatured: true,
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
  }
];


const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Review.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@moviereview.com',
      password: 'admin123',
      isAdmin: true
    });
    
    console.log('Created admin user');
    
    // Create sample movies
    const movies = await Promise.all(
      sampleMovies.map(movieData => 
        Movie.create({ ...movieData, addedBy: adminUser._id })
      )
    );
    
    console.log('Created sample movies');
    
    // Create sample user
    const sampleUser = await User.create({
      username: 'moviefan',
      email: 'user@example.com',
      password: 'password123'
    });
    
    console.log('Created sample user');
    
    // Create sample reviews
    const sampleReviews = [
      {
        user: sampleUser._id,
        movie: movies[0]._id,
        rating: 5,
        reviewText: "Absolutely phenomenal movie! The story is gripping and the acting is superb. Tim Robbins and Morgan Freeman deliver outstanding performances."
      },
      {
        user: sampleUser._id,
        movie: movies[1]._id,
        rating: 5,
        reviewText: "A masterpiece of cinema. Marlon Brando's performance is iconic and the storytelling is unmatched."
      }
    ];
    
    for (const reviewData of sampleReviews) {
      const review = await Review.create(reviewData);
      const movie = movies.find(m => m._id.equals(review.movie));
      if (movie) {
        await movie.addReview(review.rating);
      }
    }
    
    console.log('Created sample reviews and updated movie ratings');
    
    console.log('Database seeded successfully!');
    console.log('Admin user: admin@moviereview.com / admin123');
    console.log('Sample user: user@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();