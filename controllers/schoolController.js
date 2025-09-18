const db = require('../config/db');


exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Basic Validation
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ message: 'Latitude and longitude must be numbers.' });
  }

  try {
    const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    await db.query(sql, [name, address, latitude, longitude]);
    res.status(201).json({ message: 'School added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding school.' });
  }
};


exports.listSchools = async (req, res) => {
  const { lat, lon } = req.query;

  
  if (!lat || !lon) {
    return res.status(400).json({ message: 'User latitude (lat) and longitude (lon) are required.' });
  }
  const userLat = parseFloat(lat);
  const userLon = parseFloat(lon);
  if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({ message: 'Invalid latitude or longitude format.' });
  }


  try {
   
    const sql = `
      SELECT id, name, address, latitude, longitude,
        ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance
      FROM schools
      ORDER BY distance;
    `;

    const [schools] = await db.query(sql, [userLat, userLon, userLat]);
    res.status(200).json(schools);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching schools.' });
  }
};