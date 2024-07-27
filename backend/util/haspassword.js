
const crypto = require('crypto');
const util = require('util');

// Convert crypto.scrypt into a Promise-based function
const scrypt = util.promisify(crypto.scrypt);

const hashPassword = async (password) => {
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await scrypt(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Password hashing failed');
  }
};

module.exports = { hashPassword };
