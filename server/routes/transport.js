const express = require('express');
const router = express.Router();
const { getDatabase } = require('../data/dbPersistence');
const { verifyToken } = require('../middleware/auth');

// Get all bus routes, trips, helplines (Accessible to ALL authenticated users)
router.get('/', verifyToken, (req, res) => {
  const db = getDatabase();
  const transport = db.transportData;

  const search = (req.query.search || '').trim().toLowerCase();
  let routes = transport.routes || [];

  if (search) {
    routes = routes.filter(r => 
      r.routeNo.toLowerCase().includes(search) ||
      r.startPoint.toLowerCase().includes(search) ||
      r.viaStops.some(stop => stop.toLowerCase().includes(search)) ||
      r.busNo.toLowerCase().includes(search)
    );
  }

  res.json({
    success: true,
    busesTotalCount: transport.busesTotalCount || 130,
    helplines: transport.helplines || [],
    officialEmail: transport.officialEmail || "rectransport@rajalakshmi.edu.in",
    websiteUrl: transport.websiteUrl || "https://www.rectransport.com",
    trips: transport.trips || [],
    routes
  });
});

// Search specific route/stop endpoint
router.get('/search', verifyToken, (req, res) => {
  const db = getDatabase();
  const transport = db.transportData;
  const q = (req.query.q || '').trim().toLowerCase();

  if (!q) {
    return res.json({ success: true, count: transport.routes.length, data: transport.routes });
  }

  const filtered = transport.routes.filter(r => 
    r.routeNo.toLowerCase().includes(q) ||
    r.startPoint.toLowerCase().includes(q) ||
    r.viaStops.some(stop => stop.toLowerCase().includes(q))
  );

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

module.exports = router;
