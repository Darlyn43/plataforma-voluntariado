# Manuchar Perú - Plataforma de Voluntariado Corporativo

Una plataforma integral de voluntariado corporativo que conecta a los empleados de Manuchar Perú con oportunidades de impacto social mediante evaluaciones psicológicas y matching personalizado con IA.

## 🌟 Características Principales

- **Autenticación Segura**: Sistema de login con Firebase Authentication
- **Evaluación Psicológica**: Test de Fortalezas Gallup profesional
- **Matching Inteligente**: Recomendaciones personalizadas usando OpenAI
- **Dashboard Dual**: Interfaces específicas para empleados y administradores
- **Métricas de Impacto**: Análisis en tiempo real de participación y ODS
- **Sistema de Insignias**: Reconocimiento por logros y participación
- **Interfaz en Español**: Completamente localizado para el mercado peruano

## 🚀 Inicio Rápido

### Prerrequisitos

1. Cuenta de Firebase con proyecto creado
2. Clave API de OpenAI
3. Node.js 18+ instalado

### Configuración

1. **Clona el repositorio**
   ```bash
   git clone [repository-url]
   cd manuchar-peru-voluntariado
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   Las siguientes claves son requeridas:
   - `OPENAI_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_PROJECT_ID`

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Accede a la aplicación**
   Abre http://localhost:5000 en tu navegador

## 📱 Flujo de Usuario

### Para Empleados
1. **Registro/Login**: Autenticación con email corporativo
2. **Perfil**: Completar información personal y departamental
3. **Evaluación**: Test de Fortalezas Gallup (5 preguntas)
4. **Recomendaciones**: Oportunidades personalizadas basadas en perfil
5. **Participación**: Unirse a Labs de Voluntariado o Misiones Sociales
6. **Seguimiento**: Dashboard con horas, proyectos e insignias

### Para Administradores
1. **Dashboard Ejecutivo**: Métricas clave de participación
2. **Gestión de Proyectos**: Crear y administrar oportunidades
3. **Análisis de Impacto**: Reportes de ODS y departamentos
4. **Ranking de Voluntarios**: Top performers y reconocimientos

## 🏗️ Arquitectura

### Frontend (React + TypeScript)
- **Framework**: React 18 con TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: Wouter
- **Estado**: TanStack Query
- **Formularios**: React Hook Form + Zod

### Backend (Node.js + Express)
- **Runtime**: Node.js con Express
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **IA**: OpenAI GPT-4o para matching
- **Storage**: Memoria (MemStorage) para desarrollo

### Servicios Externos
- **Firebase**: Autenticación, base de datos, hosting
- **OpenAI**: Análisis psicológico y matching inteligente

## 🔧 Firebase Setup

1. **Configura Authentication**
   - Habilita Email/Password en Firebase Console
   - Agrega dominio de Replit a dominios autorizados

2. **Configura Firestore**
   - Crea base de datos en modo test
   - Las reglas de seguridad están en `firestore.rules`

3. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

## 🚀 Deployment

### Firebase Hosting

1. **Autentica con Firebase**
   ```bash
   firebase login
   ```

2. **Inicializa proyecto**
   ```bash
   firebase init hosting
   ```

3. **Despliega**
   ```bash
   ./deploy.sh
   ```

### Replit Deployment

La aplicación está optimizada para Replit Deployments:
- Configuración automática de puertos
- Variables de entorno seguras
- Build y deployment automatizado

## 📊 Métricas y Analytics

### Dashboard de Empleado
- Horas de voluntariado acumuladas
- Proyectos completados
- Insignias obtenidas
- Personas impactadas
- Recomendaciones personalizadas

### Dashboard de Administrador
- Voluntarios activos
- Horas totales del programa
- Proyectos activos
- Impacto por ODS (Objetivos de Desarrollo Sostenible)
- Participación por departamento
- Ranking de voluntarios destacados

## 🎯 Tipos de Voluntariado

### Labs de Voluntariado
- Actividades de 1-8 horas
- Impacto inmediato y medible
- Participación flexible
- Ejemplos: Talleres educativos, campañas ambientales

### Misiones Sociales
- Proyectos de 2-3 meses
- Desarrollo de habilidades profesionales
- Compromiso a largo plazo
- Ejemplos: Mentoría, desarrollo de apps, consultoría

## 🏆 Sistema de Reconocimiento

### Insignias Disponibles
- **Eco Warrior**: 5 proyectos ambientales
- **Educator**: 3 proyectos educativos
- **Helper**: Primer proyecto completado
- **Leader**: Liderazgo en 2 proyectos
- **Expert**: 50+ horas de voluntariado
- **Champion**: 10 proyectos completados

### Niveles de Usuario
- Colaborador (0-500 puntos)
- Líder (500-1000 puntos)
- Experto (1000+ puntos)

## 🔒 Seguridad y Privacidad

- Cumplimiento con Ley de Protección de Datos del Perú
- Encriptación de datos sensibles
- Autenticación segura con Firebase
- Reglas de Firestore para control de acceso
- Validación de entrada con Zod

## 🛠️ Desarrollo

### Estructura del Proyecto
```
├── client/src/           # Frontend React
│   ├── components/       # Componentes UI
│   ├── pages/           # Páginas principales
│   ├── hooks/           # Hooks personalizados
│   └── lib/             # Utilidades y configuración
├── server/              # Backend Express
│   ├── services/        # Servicios (OpenAI, matching)
│   ├── routes.ts        # Rutas API
│   └── storage.ts       # Capa de datos
├── shared/              # Esquemas compartidos
└── firebase.json        # Configuración Firebase
```

### Scripts Disponibles
- `npm run dev`: Servidor de desarrollo
- `npm run build`: Build de producción
- `npm run check`: Verificación de tipos
- `./deploy.sh`: Deployment a Firebase

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte técnico o preguntas sobre la plataforma:
- Crear un issue en el repositorio
- Contactar al equipo de IT de Manuchar Perú
- Revisar la documentación de Firebase y OpenAI

---

**Desarrollado con ❤️ para Manuchar Perú**