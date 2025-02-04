export const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';

export const MEDUSA_BACKEND_URL_NOSLASH = MEDUSA_BACKEND_URL.replace(/\/+$/, '');

// Temporary fix for the backend URL
// export const BACKEND_URL = process.env.MEDUSA_ADMIN_BACKEND_URL;
