// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');

const UNSPLASH_ACCESS_KEY = 'VT4YHs2Sj9mWLIt1JS8k21ObuAES2WsUjYQ5JzgW_p8';

async function getRandomProfileImage(query = 'portrait') {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        query,
        orientation: 'squarish',
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    return response.data.urls.small;
  } catch (error) {
    console.error('Unsplash Error:', error.message);
    return null;
  }
}

module.exports = {
  getRandomProfileImage,
};
