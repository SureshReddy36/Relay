const express = require('express');
const mongoose = require('mongoose');
const AppConfig = require('../models/AppConfig');

const router = express.Router();

const stripTrailingSlash = (url) => (url ? url.replace(/\/+$/, '') : '');

/**
 * @desc    Public bootstrap configuration endpoint for mobile clients.
 *          Returns only non-sensitive active backend URLs.
 * @route   GET /api/config
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    let dbConfig = null;
    if (mongoose.connection.readyState === 1) {
      try {
        dbConfig = await AppConfig.findOne({ key: 'backend_urls' }).lean();
      } catch (_) {
        // If DB query fails, fall back to env / request host
      }
    }

    const requestOrigin = `${req.protocol}://${req.get('host')}`;
    const envBaseUrl = stripTrailingSlash(process.env.RENDER_EXTERNAL_URL || '');

    const rawSocketUrl =
      dbConfig?.socketUrl ||
      process.env.PUBLIC_SOCKET_URL ||
      envBaseUrl ||
      requestOrigin;

    const socketUrl = stripTrailingSlash(rawSocketUrl);

    const rawApiUrl =
      dbConfig?.apiUrl ||
      process.env.PUBLIC_API_URL ||
      `${socketUrl}/api`;

    const apiUrl = stripTrailingSlash(rawApiUrl);

    res.set('Cache-Control', 'public, max-age=60');
    res.status(200).json({
      success: true,
      apiUrl,
      socketUrl,
      updatedAt: dbConfig?.updatedAt || new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resolve backend configuration',
    });
  }
});

module.exports = router;
