# Vehicle Spruce System API (Backend)

API REST para el sistema de gestión de lavado de vehículos "Vehicle Spruce System". Esta API proporciona endpoints para administrar clientes, vehículos, servicios, empleados, inventario y más.

## Características

- ✅ API RESTful completa
- 🔒 Validación de datos en endpoints
- 📦 Gestión de clientes y vehículos
- 🚗 Seguimiento de servicios de lavado
- 👥 Administración de empleados
- 🧰 Control de inventario
- 📊 Estadísticas para dashboard

## Tecnologías

- Node.js
- Express
- TypeScript
- MySQL
- mysql2 (driver para MySQL)
- dotenv (gestión de variables de entorno)

## Estructura del Proyecto

```
src/
 ├── config/          # Configuración de la base de datos, variables de entorno
 ├── controllers/     # Controladores para manejar las solicitudes HTTP
 ├── models/          # Modelos que representan entidades de la base de datos
 ├── routes/          # Definición de rutas y endpoints de la API
 ├── services/        # Lógica de negocio y operaciones con los modelos
 └── server.ts        # Punto de entrada de la aplicación
```

## Requisitos Previos

- Node.js (v14.x o superior)
- npm (v6.x o superior)
- MySQL (v5.7 o superior)

## Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/tu-usuario/vehicle-spruce-system-api.git
   cd vehicle-spruce-system-api
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=vehicle_spruce_system
   DB_PORT=3306
   PORT=3001
   ```
   *Nota: Ajusta los valores según tu configuración de MySQL.*

4. Crear la base de datos y tablas necesarias (puedes usar el script SQL proporcionado):
   ```
   mysql -u root -p < database.sql
   ```

## Ejecutar la Aplicación

### Desarrollo

```bash
npm run dev
```

Este comando inicia el servidor en modo desarrollo con hot-reload a través de `ts-node-dev`.

### Producción

```bash
npm run build
npm start
```

## Endpoints de la API

### Clientes

- `GET /api/customers` - Obtener todos los clientes
- `GET /api/customers/:id` - Obtener un cliente por ID
- `POST /api/customers` - Crear un nuevo cliente
- `PUT /api/customers/:id` - Actualizar un cliente existente
- `DELETE /api/customers/:id` - Eliminar un cliente
- `GET /api/customers/search/:term` - Buscar clientes
- `GET /api/customers/:id/vehicles` - Obtener vehículos de un cliente

### Vehículos

- `GET /api/vehicles` - Obtener todos los vehículos
- `GET /api/vehicles/:id` - Obtener un vehículo por ID
- `POST /api/vehicles` - Crear un nuevo vehículo
- `PUT /api/vehicles/:id` - Actualizar un vehículo existente
- `DELETE /api/vehicles/:id` - Eliminar un vehículo
- `GET /api/vehicles/search/:term` - Buscar vehículos
- `GET /api/vehicles/customer/:customerId` - Obtener vehículos por cliente

### Servicios

- `GET /api/services` - Obtener todos los servicios
- `GET /api/services/:id` - Obtener un servicio por ID
- `POST /api/services` - Crear un nuevo servicio
- `PUT /api/services/:id` - Actualizar un servicio existente
- `DELETE /api/services/:id` - Eliminar un servicio
- `GET /api/services/categories` - Obtener categorías de servicios
- `GET /api/services/category/:categoryId` - Obtener servicios por categoría
- `POST /api/services/categories` - Crear una nueva categoría de servicio

### Empleados

- `GET /api/employees` - Obtener todos los empleados
- `GET /api/employees/:id` - Obtener un empleado por ID
- `POST /api/employees` - Crear un nuevo empleado
- `PUT /api/employees/:id` - Actualizar un empleado existente
- `DELETE /api/employees/:id` - Eliminar un empleado
- `GET /api/employees/search/:term` - Buscar empleados
- `PATCH /api/employees/:id/status` - Cambiar estado del empleado

### Servicios Pendientes

- `GET /api/pending-services` - Obtener todos los servicios pendientes
- `GET /api/pending-services/:id` - Obtener un servicio pendiente por ID
- `POST /api/pending-services` - Crear un nuevo servicio pendiente
- `PUT /api/pending-services/:id` - Actualizar un servicio pendiente
- `DELETE /api/pending-services/:id` - Eliminar un servicio pendiente
- `GET /api/pending-services/status/:status` - Filtrar por estado
- `GET /api/pending-services/search/:term` - Buscar servicios
- `PATCH /api/pending-services/:id/assign` - Asignar a empleado
- `PATCH /api/pending-services/:id/complete` - Marcar como completado

### Inventario

- `GET /api/inventory` - Obtener todos los items
- `GET /api/inventory/:id` - Obtener un item por ID
- `POST /api/inventory` - Crear un nuevo item
- `PUT /api/inventory/:id` - Actualizar un item existente
- `DELETE /api/inventory/:id` - Eliminar un item
- `GET /api/inventory/low-stock` - Obtener items con stock bajo
- `GET /api/inventory/category/:category` - Filtrar por categoría
- `GET /api/inventory/search/:term` - Buscar items
- `GET /api/inventory/categories` - Obtener categorías
- `PATCH /api/inventory/:id/quantity` - Ajustar cantidad
- `GET /api/inventory/:id/usage` - Obtener historial de uso
- `POST /api/inventory/usage` - Registrar uso de inventario

### Dashboard

- `GET /api/dashboard/stats` - Obtener estadísticas del dashboard

## Scripts

- `npm run dev` - Inicia el servidor en modo desarrollo con recarga automática
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor en modo producción
- `npm run lint` - Ejecuta ESLint para verificar el código
- `npm run test` - Ejecuta las pruebas (si están configuradas)

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva característica'`)
4. Sube tus cambios a tu fork (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Sebastian Ordoñez Giraldo - [sebastian789go@gmail.com]

Link del Proyecto: [https://github.com/SebastianOrdonezGiraldo/carwash-backend.git]