var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/palangs';

module.exports = connectionString;