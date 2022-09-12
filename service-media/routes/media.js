const express = require('express');
const router = express.Router();
const isBase64 = require('is-base64');
const base64Img = require('base64-img');
const fs = require('fs');

// Memanggil model
const { Media } = require('../models');

// Membuat api get media
router.get('/', async (req, res) => {
  const media = await Media.findAll({
    attributes: ['id', 'image'],
  });

  // Mengubah image menjadi url
  const mappedMedia = media.map((m) => {
    m.image = `${req.get('host')}/${m.image}`;
    return m;
  });

  return res.json({
    status: 'success',
    data: mappedMedia,
  });
});

// Create API post upload image
router.post('/', (req, res) => {
  const image = req.body.image;
  // Image must be base64 encoded
  if (!isBase64(image, { mimeRequired: true })) {
    return res.status(400).json({
      status: 'error',
      message: 'Image must be base64 encoded',
    });
  }
  // Upload image
  base64Img.img(image, './public/images', Date.now(), async (err, filepath) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
    // '/public/images/example.png'
    const filename = filepath.split('\\').pop().split('/').pop();

    // save in media
    const media = await Media.create({
      image: `images/${filename}`,
    });
    // Jika sukses
    return res.json({
      status: 'success',
      data: {
        id: media.id,
        // image yang bisa diakses di frontend
        image: `${req.get('host')}/images/${filename}`,
      },
    });
  });
});

// Create API Delete
router.delete('/:id', async (req, res) => {
  // Mengambil id
  const id = req.params.id;
  // Mencari media berdasarkan id
  const media = await Media.findByPk(id);
  // Check id media
  if (!media) {
    return res.status(404).json({
      status: 'error',
      message: 'Media not found',
    });
  }
  // Jika ditemukan
  fs.unlink(`./public/${media.image}`, async (err) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
    // Jika ditemukan
    await media.destroy();
    return res.json({
      status: 'success',
      message: 'Image deleted',
    });
  });
});

module.exports = router;
