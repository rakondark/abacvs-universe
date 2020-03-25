// Get the Host from Environment or use default
const host = process.env.DB_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.DB_USER || 'praetorians';

// Get the Password for DB from Environment or use default
<<<<<<< HEAD
const password = process.env.DB_PASS || 'xxxxxxxxxxx';
=======
const password = process.env.DB_PASS || 'xxxxxxxxx';
>>>>>>> 4807c2d537252c3ccc8dc1a367a7803d4157751b

// Get the Database from Environment or use default
const database = process.env.DB_DATABASE || 'praetorians';

module.exports = {user, password, host, database};
