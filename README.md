# SPRINT 4

  * **Tablero de trabajo:**  [https://github.com/users/matiascaparotta/projects/4/views/1]
  * **Link de Rama/Repositorio en GitHub:** [https://github.com/matiascaparotta/DPFS_Matias_Caparotta/tree/sprint-4]


  **Rutas Generales Sprint 4**

Estas rutas están disponibles:

| Método | Ruta               | Descripción                                |
|--------|--------------------|--------------------------------------------|
| GET    | `/`                | Página principal.                         |
| GET    | `/products`        | Listado de todos los productos.           |

---

* **Rutas de Creación de Productos**

Permite agregar nuevos productos al sistema:

| Método | Ruta               | Descripción                           |
|--------|--------------------|---------------------------------------|
| GET    | `/products/create` | Muestra el formulario para crear un producto. |
| POST   | `/products/create` | Crea un nuevo producto.               |

---

* **Rutas de Edición de Productos**

Permite modificar productos existentes:

| Método | Ruta                  | Descripción                         |
|--------|-----------------------|-------------------------------------|
| GET    | `/products/:id/edit`  | Muestra el formulario para editar un producto. |
| POST   | `/products/:id/edit`  | Actualiza un producto existente.    |

---

* **Rutas de Eliminación de Productos**

Permite eliminar productos del sistema:

| Método | Ruta                   | Descripción                       |
|--------|------------------------|-----------------------------------|
| POST   | `/products/:id/delete` | Elimina un producto específico.  |

---

* **Rutas de Detalle de Productos**

Permite ver información detallada de un producto:

| Método | Ruta               | Descripción                        |
|--------|--------------------|------------------------------------|
| GET    | `/products/:id`    | Muestra el detalle de un producto. |

---
