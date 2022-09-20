const apiAdapter = require('../../apiAdapter');
const jwt = require('jsonwebtoken');

const { URL_SERVICE_USER, JWT_REFRESH_TOKEN_EXPIRED, JWT_ACCES_TOKEN_EXPIRED, JWT_SECRET_REFRESH_TOKEN, JWT_SECRET } =
  process.env;

// Memanggil adapter
const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    const users = await api.post('/users/login', req.body);
    const data = users.data.data;

    // Generate token
    const token = jwt.sign({ data }, JWT_SECRET, { expiresIn: JWT_ACCES_TOKEN_EXPIRED });
    const refreshToken = jwt.sign({ data }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

    // Simpan refresh token ke database
    await api.post('/refresh_token', {
      refresh_token: refreshToken,
      user_id: data.id,
    });

    // Kirim response
    return res.json({
      status: 'success',
      data: {
        token,
        refresh_token: refreshToken,
      },
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({
        status: 'error',
        message: 'Service unavailable',
      });
    }

    const { status, data } = error.response;
    return res.status(status).json({
      status: status,
      message: data.message,
    });
  }
};
