# InvoiceApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.

## Development server


### 🚀 Requisitos previos
- Node.js (v16 o superior recomendado)

- npm o Yarn

- Angular CLI instalado globalmente:
```bash
npm install -g @angular/cli
```

### ⚙️ Configuración del entorno

Antes de ejecutar la aplicación, asegúrate de configurar correctamente el entorno.

1. Crear o edita el archivo de entorno src/environments/environment.ts

```bash
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1', # Dirección del backend (API)
  clientId: 'frontend_app', # ID del cliente para autenticación
  apiKey: 'frontend_api_key' # Clave del cliente para autenticación
};

```
y src/environments/environment.development.ts
```bash
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  clientId: 'frontend_app',
  apiKey: 'frontend_api_key'
};
```
### 📦 Instalación de dependencias
Desde la raíz del proyecto, ejecuta:
```bash
npm install
# o
yarn install
```
 ### Servir en entorno de desarrollo
```bash
yarn start
#0
npm start
```

 ### Abrir app en el navegador
```bash
http://localhost:4200
```
