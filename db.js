const mysql = require('mysql2');

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',  // Usuario por defecto en XAMPP
    password: '',  // Por defecto, no hay contraseña en XAMPP
    database: 'usuarios_db',  // Nombre de la base de datos que creaste
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportar el pool para usarlo en otros archivos
module.exports = pool;
