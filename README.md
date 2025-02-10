# SPRINT 7

Tablero de trabajo: [https://github.com/users/matiascaparotta/projects/8]



### **Validaciones Implementadas**

#### **Usuarios**
- **Registro**:
  - **Nombre**: Obligatorio, al menos 2 caracteres.
  - **Apellido**: Obligatorio, al menos 2 caracteres.
  - **Correo Electrónico**: Obligatorio, formato válido, único en la base de datos.
  - **Contraseña**: Obligatoria, al menos 8 caracteres, debe contener letras mayúsculas, minúsculas, un número y un carácter especial.
  - **Imagen de Perfil**: Archivo válido (JPG, JPEG, PNG, GIF).

- **Login**:
  - **Correo Electrónico**: Obligatorio, formato válido, debe existir en la base de datos.
  - **Contraseña**: Obligatoria, debe coincidir con la existente en la base de datos.

#### **Productos**
- **Creación y Edición**:
  - **Nombre**: Obligatorio, al menos 5 caracteres.
  - **Descripción**: Obligatoria, al menos 20 caracteres.
  - **Precio**: Obligatorio, número válido mayor a 0.
  - **Categoría**: Obligatoria.
  - **Imagen de Producto**: Archivo válido (JPG, JPEG, PNG, GIF).
```