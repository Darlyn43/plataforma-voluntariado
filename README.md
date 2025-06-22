# Manuchar Perú - Plataforma de Voluntariado Corporativo

Una plataforma completa de emparejamiento de voluntariado corporativo para Manuchar Perú, con evaluaciones psicológicas, recomendaciones impulsadas por IA y análisis de impacto.

## Características Principales

### 🔐 Sistema de Autenticación
- Autenticación segura con Firebase
- Roles diferenciados (Empleado/Administrador)
- Gestión de perfiles de usuario

### 🧠 Evaluación Psicológica
- Test de Fortalezas de Gallup integrado
- Análisis de personalidad y habilidades
- Recomendaciones personalizadas

### 🤖 Emparejamiento con IA
- Algoritmo de matching impulsado por OpenAI
- Recomendaciones basadas en personalidad, habilidades e intereses
- Puntuación de compatibilidad con oportunidades

### 📊 Dashboards Duales
- **Dashboard de Empleado**: Oportunidades recomendadas, participaciones, badges
- **Dashboard de Administrador**: Métricas, análisis de impacto, gestión de oportunidades

### 🌍 Seguimiento de Impacto SDG
- Métricas alineadas con Objetivos de Desarrollo Sostenible
- Análisis de impacto por departamento y proyecto
- Reportes de horas de voluntariado y participación

### 🏆 Sistema de Reconocimiento
- Badges por logros y participación
- Seguimiento de horas de voluntariado
- Certificados de participación

## Tecnologías Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Express.js, Node.js
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **IA**: OpenAI GPT-4o para matching y análisis
- **UI Components**: Radix UI, Lucide Icons
- **Estado**: React Query (TanStack Query)
- **Routing**: Wouter

## Configuración e Instalación

### Requisitos Previos
- Node.js 18+
- Cuenta de Firebase
- API Key de OpenAI

### Variables de Entorno
```env
VITE_FIREBASE_API_KEY=tu-firebase-api-key
VITE_FIREBASE_APP_ID=tu-firebase-app-id
VITE_FIREBASE_PROJECT_ID=tu-firebase-project-id
OPENAI_API_KEY=tu-openai-api-key
```

### Instalación
```bash
npm install
npm run dev
```

### Deployment
Para deployment en producción, ver `deployment-guide.md` y `firebase-deploy-instructions.md`

## Estructura del Proyecto

```
├── client/src/
│   ├── components/         # Componentes React
│   ├── hooks/             # Hooks personalizados
│   ├── lib/               # Utilidades y configuración
│   ├── pages/             # Páginas de la aplicación
│   └── App.tsx            # Componente principal
├── server/
│   ├── services/          # Servicios backend
│   ├── index.ts           # Servidor Express
│   ├── routes.ts          # Rutas API
│   └── storage.ts         # Gestión de datos
├── shared/
│   └── schema.ts          # Esquemas de datos compartidos
└── firebase.json          # Configuración Firebase
```

## Características de Seguridad

- Autenticación robusta con Firebase
- Reglas de seguridad de Firestore
- Validación de datos con Zod
- Gestión segura de variables de entorno

## Localización

La plataforma está completamente localizada en español para el mercado peruano, incluyendo:
- Interfaz de usuario en español
- Contenido y mensajes localizados
- Formatos de fecha y hora locales

## Soporte y Mantenimiento

Para soporte técnico o consultas sobre la plataforma, contactar al equipo de desarrollo.