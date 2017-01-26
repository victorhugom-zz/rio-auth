const argv = require('minimist')(process.argv.slice(2));

export const PORT = argv.PORT || 3010;;
export const MONGO_URI = argv.MONGO_URI || 'mongodb://localhost:27017/rio-auth';
export const AUDIENCE = argv.AUDIENCE || 'myapp';
export const ISSUER = argv.ISSUER || 'myapp';
export const EXPIRE_TIME = parseInt(argv.EXPIRE_TIME) || 60 * 60 * 24 * 30; // 1 month in seconds
export const APP_SECRET = argv.APP_SECRET || "d6d89355-a4f9-4a74-905a-e604114ddd43"