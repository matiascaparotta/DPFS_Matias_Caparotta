# SPRINT 5

  * **Tablero de trabajo:**  [https://github.com/users/matiascaparotta/projects/5]

## **Proyecto de Registro y Login**

Este proyecto es una aplicación web que permite a los usuarios registrarse, iniciar sesión, y gestionar su perfil. Además, cuenta con rutas protegidas para usuarios autenticados
y rutas exclusivas para invitados.

## **Características Principales**
- **Formulario de Registro:**
  - Campos: Nombre, Apellido, Email, Contraseña, Confirmación de Contraseña.
  - Subida de imagen de perfil (opcional).
  - Encriptación de contraseña con `bcryptjs`.
  - Almacenamiento de datos en un archivo JSON.
- **Formulario de Login:**
  - Campos: Email y Contraseña.
  - Opción "Recordarme" para guardar datos del usuario en una cookie.
- **Protección de Rutas:**
  - Rutas protegidas para usuarios logueados (solo accesibles con sesión activa).
  - Rutas para invitados (redirigen al perfil si el usuario ya está logueado).

---

## **Rutas de la Aplicación**

### **Rutas de Usuarios**
| Método | Ruta              | Descripción                                                                                  |
|--------|-------------------|----------------------------------------------------------------------------------------------|
| `GET`  | `/users/register` | Muestra el formulario de registro.                                                           |
| `POST` | `/users/register` | Procesa el registro del usuario, valida los datos, guarda la imagen y encripta la contraseña. |
| `GET`  | `/users/login`    | Muestra el formulario de inicio de sesión.                                                   |
| `POST` | `/users/login`    | Procesa el login, valida las credenciales y crea la sesión.                                  |
| `GET`  | `/users/profile`  | Muestra el perfil del usuario logueado.                                                      |
| `GET`  | `/users/logout`   | Cierra la sesión del usuario y elimina las cookies de "Recordarme".                          |

---

### **Rutas de Huéspedes**
| Método | Ruta              | Descripción                                                                                  |
|--------|-------------------|----------------------------------------------------------------------------------------------|
| `GET`  | `/`               | Página principal (disponible para todos).                                                    |
| `GET`  | `/users/login`    | Si el usuario está logueado, redirige a `/users/profile`.                                     |
| `GET`  | `/users/register` | Si el usuario está logueado, redirige a `/users/profile`.                                     |

---


