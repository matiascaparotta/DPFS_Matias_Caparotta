const express = require('express');
const router = express.Router();

const users = [
  { email: 'user@example.com', password: 'password123' }, 
];


router.get('/', (req, res) => {
  res.render('login');
});


router.post('/', (req, res) => {
  const { email, password } = req.body;

 
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.send('Inicio de sesión exitoso'); 
  } else {
    res.status(401).send('Credenciales incorrectas');
  }
});

module.exports = router;