const { User } = require('../models');

const userController = {
  // Método para listar usuarios en formato JSON con paginación
  listUsers: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10; // Número de resultados por página
      const offset = parseInt(req.query.offset) || 0; // Desplazamiento

      const { count, rows: users } = await User.findAndCountAll({
        limit,
        offset
      });

      const nextOffset = offset + limit;
      const previousOffset = offset - limit < 0 ? 0 : offset - limit;

      res.json({
        count,
        users: users.map(user => ({
          id: user.userId,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          detail: `/api/users/${user.userId}`
        })),
        next: nextOffset < count ? `/api/users?limit=${limit}&offset=${nextOffset}` : null,
        previous: offset > 0 ? `/api/users?limit=${limit}&offset=${previousOffset}` : null
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
    }
  },

  // Método para obtener el detalle de un usuario en formato JSON
  getUserDetail: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        res.json({
          id: user.userId,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          user_image: user.user_image
        });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el detalle del usuario' });
    }
  }
};

module.exports = userController;