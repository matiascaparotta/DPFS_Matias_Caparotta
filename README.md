# SPRINT 8

Tablero de trabajo: [https://github.com/users/matiascaparotta/projects/9]



# Proyecto SPRINT-8

## Descripción

Este proyecto incluye una API para gestionar usuarios y productos, así como un dashboard hecho en React para visualizar los datos. La API permite listar, crear, editar y eliminar usuarios y productos, y el dashboard muestra estadísticas y detalles de los mismos.


## Rutas de la API

### Usuarios

- **Listado de usuarios:**
  - **URL:** `/api/users`
  - **Método:** `GET`
  - **Descripción:** Devuelve un objeto con la lista de usuarios y la cantidad total de usuarios.

- **Detalle de usuario:**
  - **URL:** `/api/users/:id`
  - **Método:** `GET`
  - **Descripción:** Devuelve un objeto con los detalles de un usuario específico.

### Productos

- **Listado de productos:**
  - **URL:** `/api/products`
  - **Método:** `GET`
  - **Descripción:** Devuelve un objeto con la lista de productos, la cantidad total de productos.
- **Detalle de producto:**
  - **URL:** `/api/products/:id`
  - **Método:** `GET`
  - **Descripción:** Devuelve un objeto con los detalles de un producto específico.


## Dashboard en React

El dashboard incluye los siguientes paneles:

1. **Total de productos**
2. **Total de usuarios**
3. **Total de categorías**
4. **Detalle del último producto creado**
5. **Total de productos por categoría**
6. **Listado de productos**

