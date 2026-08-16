const express = require('express');
const router = express.Router();
const { getDatabase, saveDatabase } = require('../data/dbPersistence');
const { verifyToken } = require('../middleware/auth');

const FOOD_COURTS = ["HUT CAFE", "REC CAFE", "6th Sense Garden", "Blackbuck Cafe"];

// Get College Canteen Menu & Ratings
router.get('/', verifyToken, (req, res) => {
  const db = getDatabase();
  const outlet = req.query.outlet || 'HUT CAFE';

  // Return outlet-specific categories if available, else general categories
  const categories = (db.canteenData.outletsMenu && db.canteenData.outletsMenu[outlet])
    ? db.canteenData.outletsMenu[outlet]
    : db.canteenData.menuCategories;

  res.json({
    success: true,
    foodCourts: FOOD_COURTS,
    selectedOutlet: outlet,
    rushGauge: db.canteenData.rushGauge || 'Low Rush',
    menuCategories: categories,
    categories: categories,
    ratings: db.canteenData.ratings || []
  });
});

// Submit Canteen Food Rating & Review
router.post('/review', verifyToken, (req, res) => {
  const db = getDatabase();
  const { canteenName, dishName, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5 || !dishName) {
    return res.status(400).json({ success: false, message: 'Please provide dish name and a valid rating (1-5 stars).' });
  }

  const newReview = {
    id: `cant-${Date.now()}`,
    canteenName: canteenName || '6th Sense Garden',
    dishName: dishName.trim(),
    rating: Number(rating),
    comment: comment ? comment.trim() : 'Great food!',
    studentName: `${req.user.name} (${req.user.designation || 'Student'})`,
    email: req.user.email,
    createdAt: new Date().toISOString()
  };

  if (!db.canteenData.ratings) db.canteenData.ratings = [];
  db.canteenData.ratings.unshift(newReview);
  saveDatabase();

  res.status(201).json({
    success: true,
    message: 'Thank you! Canteen rating & feedback submitted.',
    data: newReview
  });
});

// Support both /review and /rating endpoint aliases
router.post('/rating', verifyToken, (req, res) => {
  const db = getDatabase();
  const { canteenName, dishName, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5 || !dishName) {
    return res.status(400).json({ success: false, message: 'Please provide dish name and a valid rating (1-5 stars).' });
  }

  const newReview = {
    id: `cant-${Date.now()}`,
    canteenName: canteenName || 'Blackbuck Cafe',
    dishName: dishName.trim(),
    rating: Number(rating),
    comment: comment ? comment.trim() : 'Great food!',
    studentName: `${req.user.name} (${req.user.designation || 'Student'})`,
    email: req.user.email,
    createdAt: new Date().toISOString()
  };

  if (!db.canteenData.ratings) db.canteenData.ratings = [];
  db.canteenData.ratings.unshift(newReview);
  saveDatabase();

  res.status(201).json({
    success: true,
    message: 'Thank you! Canteen rating & feedback submitted.',
    data: newReview
  });
});

module.exports = router;
