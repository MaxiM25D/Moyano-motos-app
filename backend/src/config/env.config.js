import dotenv from 'dotenv';
dotenv.config();

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    DATABASE_URL: process.env.DATABASE_URL || '',
    SECRET_SESSION: process.env.SECRET_SESSION || '',
    JWT_SECRET: process.env.JWT_SECRET || ''
}

export function validateEnv() {
    const missing = [];
    if (!env.SECRET_SESSION) missing.push('SECRET_SESSION');
    if (!env.JWT_SECRET) missing.push('JWT_SECRET');
    if (!env.DATABASE_URL) missing.push('DATABASE_URL');
    if(missing.length){
        console.error(`[ENV] Faltan variables de entorno obligatorias` , missing.join(', '));
        process.exit(1);
    }
}

export function getPublicEnv() {
    return {
        NODE_ENV: env.NODE_ENV,
        PORT: env.PORT
    }
}

export default env;
