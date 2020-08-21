const jwt = require('jsonwebtoken');

module.exports = (user) => {
    const payload = {
        subject: user.id,
        username: user.username
    }

    const secret = 'secret';

    const options = {
        expiresIn: '.1d'
    };

    return jwt.sign(payload, secret, options);
}