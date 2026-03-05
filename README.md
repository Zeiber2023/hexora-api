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

2. **Instalar dependencias:**
   npm install

3. **Variables de Entorno:**
   Crea un archivo .env basado en .env.example.
   
5. **Ejecutar en desarrollo:**
   npm run dev

## 🔒 Seguridad e Integridad
Multi-tenancy: Los usuarios solo pueden visualizar, editar o borrar sus propias tareas mediante validación en la capa de aplicación.

Validación: Implementación de esquemas con Zod para asegurar contratos de datos estrictos.

---

## 2. Preparando la Validación con Zod

Para que tu API sea "irrompible", vamos a instalar Zod. Esto evitará errores como enviar un texto donde debería ir una fecha o un estado inválido.



### Paso 1: Instalación
Ejecuta en tu terminal:
``bash
npm install zod

### Paso 2: Crear el Esquema de Tareas
Crea el archivo src/modules/tasks/interfaces/http/dtos/task.schema.ts:

import { z } from 'zod';
import { TaskStatus } from '../../../domain/task-status';
import { TaskPriority } from '../../../domain/task-priority';

export const createTaskSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(100),
  description: z.string().max(500).optional(),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  dueDate: z.string().datetime().optional(), // Valida formato ISO
});

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus, {
    errorMap: () => ({ message: "Estado de tarea no válido" })
  })
});
