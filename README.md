# Hexora API - Task Management System

SaaS backend robusto para la gestión de tareas, construido siguiendo los principios de **Arquitectura Hexagonal** y **Domain-Driven Design (DDD)**.

## 🚀 Tecnologías
* **Runtime:** Node.js con TypeScript
* **Framework:** Express.js
* **Base de Datos:** PostgreSQL (Dockerizado)
* **Arquitectura:** Hexagonal (Puertos y Adaptadores)
* **Seguridad:** Autenticación JWT y Hash de contraseñas con Bcrypt

## 🏗️ Estructura del Proyecto
El proyecto se divide en módulos desacoplados para garantizar la escalabilidad:
* `src/modules/users`: Gestión de identidad y acceso.
* `src/modules/tasks`: Lógica de negocio de tareas y persistencia.
* `src/shared`: Utilidades globales (Logger, Middleware de Auth).

## 🛠️ Instalación y Uso

1. **Levantar infraestructura:**
   ```bash
   docker-compose up -d
