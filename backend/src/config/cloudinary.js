const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary with environment credentials
cloudinary.config({
  cloud_name: 'duxckw10g',
  api_key: '225233671234976',
  api_secret: 'OOf-HKRQ7OAatIat9tIKXOMOhro'
});

const verifyCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    if (result.status === 'ok') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Cloudinary Connection Error:', error);
    return false;
  }
};

module.exports = {
  cloudinary,
  verifyCloudinaryConnection
};
