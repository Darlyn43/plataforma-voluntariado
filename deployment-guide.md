# Guía de Deployment - Manuchar Perú Voluntariado

## Opción 1: Deployment con Replit (Recomendado)

La aplicación ya está configurada para deployment automático en Replit:

1. **Usar Replit Deployments**
   - Ve a la pestaña "Deploy" en tu proyecto Replit
   - Configura las variables de entorno (ya están configuradas)
   - Haz clic en "Deploy" para publicar la aplicación
   - Obtendrás una URL `.replit.app` automáticamente

## Opción 2: Deployment Manual con Firebase

### Paso 1: Configurar Firebase CLI en tu máquina local

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Autenticar con tu cuenta de Google
firebase login
```

### Paso 2: Conectar proyecto Firebase

```bash
# En el directorio del proyecto, configurar Firebase
firebase use --add

# Seleccionar tu proyecto Firebase existente
# Confirmar configuración
```

### Paso 3: Build y Deploy

```bash
# Hacer build de la aplicación
npm run build

# Build específico para hosting
npx vite build --outDir dist

# Deploy a Firebase Hosting
firebase deploy --only hosting
```

## Configuración Requerida en Firebase Console

### 1. Authentication
- Habilitar "Email/Password" en Authentication > Sign-in methods
- Agregar dominios autorizados:
  - Para desarrollo: `localhost:5000`
  - Para producción: tu dominio Replit o Firebase

### 2. Firestore Database
- Crear base de datos en modo "test" inicialmente
- Aplicar reglas de seguridad:

```bash
firebase deploy --only firestore:rules
```

### 3. Variables de Entorno
Asegurar que estas variables estén configuradas:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_PROJECT_ID`
- `OPENAI_API_KEY`

## URL de la Aplicación

Una vez desplegada, la aplicación estará disponible en:
- **Replit**: `https://[tu-proyecto].replit.app`
- **Firebase**: `https://[proyecto-id].web.app`

## Monitoreo Post-Deployment

### Métricas a Verificar:
1. Autenticación de usuarios funcionando
2. Creación de perfiles completándose
3. Evaluaciones psicológicas guardándose
4. Recomendaciones de IA generándose
5. Dashboard de admin mostrando datos

### Logs a Revistar:
- Console de Firebase para errores de autenticación
- OpenAI API logs para errores de matching
- Console del navegador para errores de frontend

## Troubleshooting Común

### Error: Firebase Auth Domain
- Verificar que el dominio está en "Authorized domains"
- Configurar redirect URLs correctamente

### Error: OpenAI API
- Verificar que la API key es válida
- Confirmar créditos disponibles en cuenta OpenAI

### Error: Firestore Permissions
- Revisar reglas de Firestore
- Confirmar que los usuarios autenticados tienen permisos

## Backup y Seguridad

- Exportar datos de Firestore regularmente
- Rotar API keys periódicamente
- Monitorear uso de OpenAI API
- Mantener variables de entorno seguras