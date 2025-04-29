
// This is a reference implementation for the Node.js backend API
// This would typically be in a separate repository

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Store routes
app.get('/api/stores', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM store_progress_view
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/stores/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const storeResult = await pool.query(`
      SELECT * FROM store_progress_view
      WHERE store_id = $1
    `, [id]);
    
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json(storeResult.rows[0]);
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/stores', authenticateToken, async (req, res) => {
  try {
    const { code, name, brand, city } = req.body;
    
    // Validate inputs
    if (!code || !name || !brand || !city) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if code already exists
    const existingStore = await pool.query('SELECT id FROM stores WHERE code = $1', [code]);
    if (existingStore.rows.length > 0) {
      return res.status(400).json({ error: 'Store code already exists' });
    }
    
    // Insert new store
    const result = await pool.query(`
      INSERT INTO stores (code, name, brand, city)
      VALUES ($1, $2, $3, $4)
      RETURNING id, code, name, brand, city
    `, [code, name, brand, city]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/stores/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, brand, city } = req.body;
    
    // Validate inputs
    if (!code || !name || !brand || !city) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if store exists
    const existingStore = await pool.query('SELECT id FROM stores WHERE id = $1', [id]);
    if (existingStore.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    // Check if code is already used by another store
    const codeCheck = await pool.query('SELECT id FROM stores WHERE code = $1 AND id != $2', [code, id]);
    if (codeCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Store code already in use' });
    }
    
    // Update store
    const result = await pool.query(`
      UPDATE stores 
      SET code = $1, name = $2, brand = $3, city = $4
      WHERE id = $5
      RETURNING id, code, name, brand, city
    `, [code, name, brand, city, id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Store assets routes
app.get('/api/stores/:id/assets', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT sa.id, sa.store_id, sa.asset_id, a.code as asset_code, a.name as asset_name,
        a.category, a.price_per_unit, sa.quantity, sa.po_number, sa.invoice_number,
        sa.grn_number, sa.is_grn_done, sa.is_tagging_done, sa.is_project_head_approved,
        sa.is_audit_done, sa.is_finance_booked
      FROM store_assets sa
      JOIN assets a ON sa.asset_id = a.id
      WHERE sa.store_id = $1
      ORDER BY a.name
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get store assets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/stores/:id/assets', authenticateToken, async (req, res) => {
  try {
    const { id: storeId } = req.params;
    const { assets } = req.body;
    
    if (!Array.isArray(assets) || assets.length === 0) {
      return res.status(400).json({ error: 'Assets array is required' });
    }
    
    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const addedAssets = [];
      
      for (const { assetId, quantity } of assets) {
        // Check if asset already exists for this store
        const existingAsset = await client.query(
          'SELECT id FROM store_assets WHERE store_id = $1 AND asset_id = $2',
          [storeId, assetId]
        );
        
        if (existingAsset.rows.length > 0) {
          // Update quantity if asset already exists
          const updated = await client.query(
            'UPDATE store_assets SET quantity = quantity + $1 WHERE id = $2 RETURNING id',
            [quantity, existingAsset.rows[0].id]
          );
          addedAssets.push(updated.rows[0].id);
        } else {
          // Insert new store asset
          const result = await client.query(
            `INSERT INTO store_assets (store_id, asset_id, quantity)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [storeId, assetId, quantity]
          );
          addedAssets.push(result.rows[0].id);
        }
      }
      
      await client.query('COMMIT');
      
      res.status(201).json({ 
        success: true,
        message: `Added ${addedAssets.length} assets to store`,
        assetIds: addedAssets
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Add assets to store error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
