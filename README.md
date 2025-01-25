# SPRINT 6

Tablero de trabajo: [https://github.com/users/matiascaparotta/projects/7]

## Proyecto: Gestión de Base de Datos y Funcionalidad CRUD

Este sprint estuvo enfocado en la creación, implementación y gestión de la base de datos en mySQL workbench utilizando Sequelize, así como en la incorporación de funcionalidades CRUD para usuarios y productos. A continuación, se detalla lo realizado.

---

### **Características Principales**

#### **Diagrama de Base de Datos (DER)**
- Se diseñó un Diagrama de Entidad-Relación para reflejar las tablas necesarias:
  - Usuarios.
  - Productos.
  - Categorías
  - Carrito de compras y productos relacionados.
- Este diseño asegura relaciones adecuadas y restricciones de integridad.
  (Se encuentra en la carpeta database de este proyecto en formato pdf)


#### **Script de Creación de Base de Datos**
- Se escribió un script SQL (`structure.sql`) que:
  - Crea la base de datos y todas las tablas necesarias.
  - Define los campos, tipos de datos y restricciones.
  - Configura las relaciones entre las tablas.
(Se encuentra en la carpeta database de este proyecto.)


#### **Script de Datos )**
- Se generó un archivo `data.sql`) para poblar las tablas con datos iniciales:
  - Usuarios (mockeados con datos de prueba).
  - Productos.
  - Categorías.
(Se encuentra en la carpeta database de este proyecto.)


#### **Configuración de Sequelize**
- Se configuró Sequelize para conectarse a la base de datos y manejar:
  - Modelos para Usuarios, Productos y Categorías.
  - Relaciones (asociaciones entre tablas).
   

#### **Implementación de CRUD**
- Se implementaron las siguientes operaciones para productos y usuarios:

##### **Productos**
| Operación | Descripción |
|-----------|-------------|
| Crear     | Formulario para agregar nuevos productos. |
| Editar    | Formulario para modificar datos de un producto. |
| Eliminar  | Opción para borrar un producto de la base de datos. |
| Listar    | Vista general de todos los productos. |
| Buscar    | Barra de búsqueda para encontrar productos por nombre. |
| Detalle   | Página para ver información detallada de un producto. |

##### **Usuarios**
| Operación | Descripción |
|-----------|-------------|
| Crear     | Formulario de registro para nuevos usuarios. |
| Editar    | Formulario para actualizar los datos del perfil. |
| Detalle   | Página con información del perfil del usuario. |

#### **Protección de Rutas**
- Se implementaron middlewares para restringir el acceso:
  - Rutas protegidas (solo accesibles con sesión activa).
  - Rutas exclusivas para invitados (redirigen al perfil si el usuario ya está logueado).

#### **Gestión de Imágenes**
- Las imágenes de usuarios y productos se procesan y almacenan localmente:
  - Imágenes base64 se convierten en archivos físicos.
  - Se asignan imágenes predeterminadas si faltan.

---

### **Rutas de la Aplicación**

#### **Productos**
| Método | Ruta                 | Descripción |
|--------|----------------------|-------------|
| GET    | /products            | Listar productos. |
| GET    | /products/create     | Mostrar formulario de creación de productos. |
| POST   | /products/create     | Procesar y almacenar un nuevo producto. |
| GET    | /products/:id/edit   | Mostrar formulario de edición de un producto. |
| PUT    | /products/:id        | Actualizar datos de un producto. |
| DELETE | /products/:id        | Eliminar un producto. |
| GET    | /products/:id        | Ver detalle de un producto. |
| GET    | /products/search     | Buscar productos por nombre. |

#### **Usuarios**
| Método | Ruta                 | Descripción |
|--------|----------------------|-------------|
| GET    | /users/register      | Mostrar formulario de registro. |
| POST   | /users/register      | Procesar el registro de usuario. |
| GET    | /users/login         | Mostrar formulario de login. |
| POST   | /users/login         | Procesar login y crear sesión. |
| GET    | /users/profile       | Mostrar perfil del usuario logueado. |
| GET    | /users/logout        | Cerrar sesión y eliminar cookies. |

---


