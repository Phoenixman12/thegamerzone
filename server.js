const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const pool = require('./db'); // Asegúrate de que el pool se importe correctamente
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir la página de inicio de sesión
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para servir la página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Faltan datos');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO usuarios (username, password) VALUES (?, ?)';

        // Usar pool.query para insertar en la base de datos
        pool.query(query, [username, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error insertando en la base de datos: ', err);
                return res.status(500).send('Error en el servidor');
            }
            res.send('Usuario registrado exitosamente');
        });
    } catch (error) {
        console.error('Error en el proceso de registro: ', error);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Faltan datos');
    }

    const query = 'SELECT * FROM usuarios WHERE username = ?';

    // Usar pool.query para consultar la base de datos
    pool.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error consultando la base de datos: ', err);
            return res.status(500).send('Error en el servidor');
        }

        if (results.length === 0) {
            return res.status(400).send('Usuario no encontrado');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Contraseña incorrecta');
        }

        res.send('Inicio de sesión exitoso');
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
