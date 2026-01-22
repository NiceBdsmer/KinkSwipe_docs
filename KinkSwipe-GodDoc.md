# KinkSwipe – Product “God Doc” / Biblia del Proyecto

## 1. Visión y Posicionamiento

**Nombre provisional:** `KinkSwipe`  
**Tagline (ejemplo):** _Swipe your kinks. Own your limits._

**Descripción corta**  
KinkSwipe es una _web app_ **mobile-first y privacy-first** para explorar, aclarar y compartir preferencias BDSM/kink mediante cartas tipo Tinder: swipes rápidos, anonimato total y export fácil para negociar con parejas o en talleres.

**Objetivo principal**  
Convertir la negociación de límites en algo **claro, consensuado y divertido**, sin fricción técnica ni necesidad de crear cuentas, ni subir datos a un servidor.

**Público objetivo (personas)**

1. **Curiosos / Novatos**
   - Quieren descubrir qué les gusta sin juicio.
   - Necesitan lenguaje accesible, UI amigable, sin registro.

2. **Parejas kinky (o explorando)**
   - Quieren alinear límites y fantasías.
   - Valoran la comparación entre listas y la exportación para guardarla o revisarla.

3. **Educadores / Facilitadores / Eventos**
   - Quieren una herramienta para talleres, dinámicas de grupo y “homework” de parejas.
   - Les sirve el QR y el “modo pareja/grupo” en el futuro para ejercicios rápidos.

**Principios clave**

- 🔒 **Privacidad extrema**  
  - 100% client-side. Sin login, sin base de datos, sin enviar datos de preferencias al servidor.
  - Datos guardados solo en `localStorage` y/o codificados en la URL.
- 📱 **Mobile-first de verdad**  
  - Interacción swipe pensada para dedo pulgar.
  - Layout vertical, buttons grandes y accesibles.
- 🌈 **Inclusivo y no-juicioso**  
  - Sin kinkshaming, lenguaje neutro, roles flexibles (Give / Receive / Both).
  - No se asume género/rol por defecto.
- 🎮 **Lúdico pero responsable**  
  - Estética “playful & sexy”, tono juguetón.
  - Tooltips claros en prácticas potencialmente riesgosas (edge play).
- 🌍 **Multi-idioma desde el diseño**  
  - Soporte EN / ES / TH desde el principio (i18n bien separado).


## 2. Identidad Visual y Tono

### 2.1. Estilo visual (Playful & Sexy)

- Paleta base:
  - Fondo oscuro (negro / gris carbón).
  - Acentos en rojo / fucsia para acciones principales (YES, CTA, etc.).
  - Grises suaves para estados neutrales (MEH, MAYBE).
- Estética:
  - Cartas con bordes redondeados (radius grande).
  - Sombras suaves, sensación de app moderna (tipo dating app).
  - Animaciones suaves de entrada/salida de cartas (no excesivas).
- Iconos:
  - Sencillos y limpios (corazón, ❌, ?, 😈 de forma moderada).
  - Evitar iconografía explícita o gráfica.

### 2.2. Tono de copy (Mixto)

- **UI copy**: corto, juguetón, ligero. Ejemplos:
  - “Start swiping 😈”
  - “Tap or swipe to decide.”
- **Tooltips y explicaciones**: claros, neutros, serios cuando toca.
  - “Breath play implica control de la respiración. Es una práctica de riesgo y requiere formación. No lo intentes sin conocimiento adecuado.”
- **Regla**: la UI puede bromear ligeramente, pero en temas edge siempre priorizar claridad y seguridad.


## 3. Features & Roadmap (MVP y más allá)

### 3.1. MVP Absoluto

1. **Swipe cards tipo Tinder (single user)**
   - Interacción principal:
     - ➡️ Right → **Yes**
     - ⬆️ Up → **Maybe**
     - ⬇️ Down → **Tolerate** (Meh / aceptaría, pero no es prioridad)
     - ⬅️ Left → **No**
   - La carta muestra:
     - Categoría (chip arriba).
     - Nombre de la actividad.
     - Descripción corta.
     - Icono/etiqueta si es práctica “edge” (con tooltip informativo).
   - Overlay labels según el swipe:
     - YES / MAYBE / MEH / NOPE.
   - Botones debajo de la carta con las mismas opciones para accesibilidad (tap instead of swipe).

2. **Onboarding con modo Give/Receive**
   - Flow:
     1. Selector de idioma (EN / ES / TH).
     2. Seleccionar modo de evaluación:
        - _“Evaluate as Giver”_
        - _“Evaluate as Receiver”_
        - _“Both (two rounds)”_
     3. Nivel de experiencia:
        - _Newbie_
        - _Curious_
        - _Experienced_
     4. Aviso de seguridad / consentimiento (breve).

   - Si el usuario elige **Both**:
     - Primero se completa la ronda como **Giver** (todas las categorías).
     - Al finalizar, se pregunta: _“Do you want to rate the same list as Receiver now?”_
       - Sí → segunda ronda como **Receiver**.
       - No → pasa al resumen.

3. **Categorías por defecto y actividades**
   - Dataset inicial: ~150–250 actividades agrupadas en categorías como:
     - Bondage & Restraints
     - Impact Play
     - Sensory Play
     - Power Exchange
     - Edge Play
     - Sexual Activities
     - Fetishes
     - Humiliation & Degradation
     - (En el futuro: Roleplay, Medical, Watersports, etc.)
   - Cada actividad:
     - `id` estable.
     - `categoryId`.
     - `edge?: boolean` (para marcar si es de riesgo especial).
     - Textos multi-idioma (EN/ES/TH).

4. **Custom categories & activities**
   - Desde la pantalla de resumen (y opcionalmente menú lateral):
     - Botón “Add category” → formulario minimal:
       - Nombre de categoría.
     - Dentro de una categoría:
       - “Add activity” → `text`, `desc` y opcional flag `edge`.
   - Custom data se guarda junto al resto del payload del usuario.

5. **Resumen final (Your Kink Map)**
   - Vista global:
     - Total de YES / MAYBE / TOLERATE / NOPE.
     - Porcentaje completado.
   - Vista por categoría (accordion):
     - En cada categoría:
       - Contadores por estado.
       - Listas de actividades agrupadas por estado.
   - Diseño pensado para:
     - Lectura rápida en móvil.
     - Buena base para export a texto/imagen.

6. **Shareable link (Modelo 1 – ver mi lista)**
   - Datos codificados con **LZ-string + base64** en un parámetro de la URL.
   - Estructura sugerida:
     - `/s/<shortId>?d=<payloadCodificado>`
   - Botones:
     - “Copy link” (copiar al portapapeles).
     - En dispositivos compatibles: `navigator.share` para compartir directamente.

7. **Export básico**
   - Export a texto:
     - Botón “Copy text summary” que genera un bloque de texto legible:
       - Por categoría, actividades con estado.
   - Export a imagen:
     - Usar `html2canvas` sobre la vista de resumen para generar PNG descargable.
   - PDF:
     - Plan para fase 1.1 (no obligatorio para el primer MVP).

8. **Dark mode por defecto**
   - La app arranca en dark mode, alineado con la estética “playful & sexy”.
   - Modo claro es opcional y puede añadirse más adelante.


### 3.2. Post-MVP (V1.1+)

1. **Comparador de parejas (Modelos 2 y 3)**
   - **Modelo 2**: Comparar dos listas mediante sus links.
     - Inputs: Link A y Link B.
     - Salida:
       - Lista de actividades donde ambos dicen YES.
       - Yes / Maybe combinados.
       - Conflictos (Yes vs No) resaltados.
   - **Modelo 3**: QR para compartir en persona.
     - Generar QR del link del usuario para que otra persona lo escanee en eventos/talleres.
     - Escanear y comparar rápidamente desde el móvil.

2. **Quiz mode / Guided mode** para principiantes.
   - Versión más guiada, con explicaciones paso a paso.
   - Menos categorías iniciales, más contexto.

3. **Export PDF con diseño bonito**
   - Usar `jsPDF` para generar un PDF con resumen y secciones por categoría.
   - Opcional: portada sencilla, branding KinkSwipe.

4. **Temas / Skins**
   - Temas adicionales (ej: más soft, más minimal, etc.) que podrían ser parte de un futuro modelo freemium.

5. **Integraciones para educadores**
   - Modo “Workshop” donde se genera un QR o código para que varias personas usen la app de forma independiente y luego el educador vea resultados agregados **en local** (sin almacenar en servidor, solo importando manualmente).


## 4. Flujos de Usuario (UX detallado)

### 4.1. Flujo principal (primer uso)

1. **Pantalla Welcome**
   - Elementos:
     - Logo y nombre “KinkSwipe”.
     - Breve frase explicativa (1–2 líneas).
     - Botones principales:
       - “Start swiping 😈”
       - “Load someone’s link”
     - Selector de idioma EN / ES / TH (dropdown o 3 botones pequeños en el footer).

2. **Onboarding**

   - **Paso 1 – Objetivo**
     - Pregunta: “What do you want to do?”
     - Opciones:
       - “Explore my own preferences” (MVP principal).
       - “Compare with someone” (deshabilitado o marcado como “coming soon”).

   - **Paso 2 – Rol**
     - Pregunta: “How do you want to rate things?”
     - Opciones:
       - “As Giver”
       - “As Receiver”
       - “Both (two rounds)”

   - **Paso 3 – Experiencia**
     - Pregunta: “How experienced are you with BDSM/kinks?”
     - Opciones:
       - Newbie
       - Curious
       - Experienced

     (Esto puede usarse luego para elegir qué tooltips se muestran o qué categorías sugerir primero.)

   - **Paso 4 – Aviso de seguridad**
     - Pequeño texto:
       - “KinkSwipe doesn’t teach safety. Some activities can be risky. Always research, communicate and get consent. This is not medical or psychological advice.”
     - Checkbox de aceptación (opcional) o simplemente un botón “I understand / Got it”.

3. **Pantalla de Swipe (ronda 1: Giver, si aplica)**

   - Header:
     - `<` (back)
     - Nombre de la categoría actual (ej. “Impact Play”).
     - Indicador de progreso (“3/10” en la categoría y un progreso global “25% complete”).

   - Cuerpo:
     - Carta central con animación (Framer Motion + react-tinder-card):
       - Chip superior: nombre de categoría.
       - Título de la actividad.
       - Descripción corta (1–2 líneas).
       - Icono de información `i` o símbolo de advertencia si `edge = true`.
       - Tooltip al pulsar en `i` con breve explicación / nota de seguridad.

   - Interacción:
     - Swipe en cuatro direcciones, con overlays: YES / MAYBE / MEH / NOPE.
     - Debajo de la carta: fila de botones con icono + texto:
       - [ NOPE ] [ MEH ] [ MAYBE ] [ YES ]

   - Opciones extras:
     - Botón pequeño “Skip category” para saltar categorías completas si alguien no quiere tratar ese tema.

4. **Fin de ronda (Giver)**

   - Si el modo = Both:
     - Pantalla intermedia:
       - Mensaje del tipo:
         - “You finished your Giver round. Do you want to rate the same list as Receiver now?”
       - Botones:
         - “Yes, rate as Receiver”
         - “No, go to summary”

   - Si modo = Giver o Receiver solamente:
     - Ir directo a la pantalla de resumen.

5. **Resumen (Summary / Your Kink Map)**

   - Sección global:
     - Un pequeño panel con:
       - “You said YES to X activities.”
       - “MAYBE: Y activities.”
       - “MEH: Z activities.”
       - “NOPE: W activities.”

   - Sección por categoría:
     - Lista tipo accordion donde cada categoría desplegable muestra:
       - Contadores por estado.
       - Listas de actividades (solo texto):
         - YES: actividades…
         - MAYBE: actividades…
         - MEH: actividades…
         - NOPE: actividades…

   - Desde esta pantalla:
     - Botón para añadir categoría/actividad custom.
     - Botones para compartir/exportar.

6. **Share & Export**

   - Botones principales:
     - “Copy share link” → genera la URL con payload comprimido.
     - “Copy text summary” → copia el resumen en formato de texto plano.
     - “Download image” → genera PNG con html2canvas.
   - En post-MVP:
     - “Show QR code” para mostrar un código QR del link.


### 4.2. Flujo “Load someone’s link”

1. Usuario abre la app con un link o pega un link en “Load someone’s link”.
2. La app decodifica el parámetro `d=<payload>`:
   - Valida versión.
   - Carga datos en modo “read-only” o “compare-ready” (según más adelante).
3. Muestra un resumen de la persona remota:
   - Igual diseño de summary, pero con algún indicador de que no es tu lista.


## 5. Estructura de Datos y Modelado

### 5.1. Estado principal de usuario

```ts
type RatingValue = "yes" | "maybe" | "tolerate" | "no";

type UserMode = "give" | "receive" | "both";
type ExperienceLevel = "newbie" | "curious" | "experienced";

interface UserMeta {
  mode: UserMode;
  experience: ExperienceLevel;
}

interface UserState {
  version: string;      // "1.0"
  lang: "en" | "es" | "th";
  user: UserMeta;
  ratings: {
    give: Record<string, RatingValue | undefined>;     // key: activityId
    receive: Record<string, RatingValue | undefined>;  // key: activityId
  };
  customCategories: CustomCategory[];
  meta: {
    createdAt: number;
    appVersion: string;
  };
}
```

### 5.2. Definición de actividades (dataset base)

```ts
type ActivityTexts = {
  text: string;
  desc?: string;
};

interface ActivityDef {
  id: string;
  categoryId: string;
  edge?: boolean;
  texts: {
    en: ActivityTexts;
    es?: ActivityTexts;
    th?: ActivityTexts;
  };
}

interface CategoryDef {
  id: string;
  name: {
    en: string;
    es?: string;
    th?: string;
  };
  activities: string[]; // array de activityId
}
```

### 5.3. Categorías y actividades custom

```ts
interface CustomActivity {
  id: string;
  text: string;
  desc?: string;
  edge?: boolean;
}

interface CustomCategory {
  id: string;
  name: string;
  activities: CustomActivity[];
}
```


## 6. Tech Stack y Arquitectura de Código

### 6.1. Stack recomendado

- **Framework:** React + Vite + TypeScript
- **Estado global:** Zustand
- **Estilos:** Tailwind CSS + shadcn/ui
- **Animaciones:** Framer Motion
- **Gestos / Swipe:** `react-tinder-card` (o similar)
- **Compresión:** `lz-string`
- **Export:** `html2canvas` (PNG), `jsPDF` (PDF en fases posteriores)
- **Hosting:** Vercel / Netlify

### 6.2. Estructura de carpetas (propuesta)

```txt
src/
  components/
    SwipeCard.tsx
    CategoryProgress.tsx
    SummaryView.tsx
    LanguageSwitcher.tsx
    Header.tsx
    Footer.tsx
  screens/
    Welcome.tsx
    Onboarding.tsx
    SwipeScreen.tsx
    SummaryScreen.tsx
    LoadFromLinkScreen.tsx
  store/
    useAppStore.ts
  data/
    activities-en.ts
    activities-es.ts
    activities-th.ts
    categories.ts
  utils/
    encodePayload.ts
    decodePayload.ts
    exportImage.ts
    exportPdf.ts
  i18n/
    strings-en.ts
    strings-es.ts
    strings-th.ts
  styles/
    globals.css
```


## 7. Seguridad, Consentimiento y Educación Ligera

### 7.1. Mensajes mínimos obligatorios

- **Aviso inicial de seguridad** en Onboarding:
  - Recordar que la app no sustituye educación, terapia ni formación en prácticas de riesgo.
- **Tooltips en prácticas edge**:
  - Breath play, blood play, knife play, fire play, etc.
  - Mensajes cortos, enfatizando:
    - Riesgos.
    - Necesidad de formación.
    - Importancia de la comunicación y consentimiento.

### 7.2. Lo que NO debe hacer la app

- No dar instrucciones técnicas detalladas de cómo hacer prácticas de riesgo.
- No dar consejos médicos o psicológicos.
- No animar ni presionar a probar nada; solo ayuda a clasificar preferencias.


## 8. Internacionalización (EN/ES/TH)

### 8.1. Enfoque i18n

- Todo texto se integra mediante **keys** (`screen.welcome.title`, `btn.start`, etc.).
- Diccionarios por idioma (`strings-en.ts`, `strings-es.ts`, `strings-th.ts`).
- Las actividades tienen textos por idioma adjuntos al dataset, no embebidos en la UI.

### 8.2. Consideraciones UX para idiomas

- Evitar strings demasiado largos en botones (especialmente en ES).
- Thai requiere cuidado con fuentes, tamaño de letra y ancho de contenedores.
- Mantener el copy breve y modular.


## 9. Modelo de Negocio y Futuro

- El producto se concibe como **herramienta cerrada y gratuita** inicialmente.
- No será open-source por defecto, pero puede usar datasets y contenidos open.
- Monetización futura (ideas):
  - Features premium (temas visuales, export avanzados, comparaciones avanzadas).
  - Packs para educadores (modos taller, plantillas).
  - Afiliados con tiendas de equipamiento / cursos / workshops.
- Priorización actual: **uso, utilidad real y viralización** (links y QR).


## 10. Roadmap de Desarrollo (alto nivel)

### Fase 0 — Setup (Repo + base técnica)
- Crear repo `KinkSwipe` (ya definido en GitHub).
- Inicializar proyecto con Vite + React + TS.
- Configurar Tailwind + shadcn/ui.
- Añadir Zustand.
- Integrar estructura base de carpetas.

### Fase 1 — MVP funcional
- Implementar:
  - Welcome → Onboarding → Swipe → Summary.
- Integrar `react-tinder-card` y definir swipe → estados.
- Guardar progreso en Zustand + `localStorage`.
- Implementar `encodePayload` / `decodePayload` con `lz-string`.
- Crear botones de “Copy link” y “Copy text summary”.
- Crear `exportImage` para PNG de resumen.
- Pulir UX mínima (animaciones básicas, estados de carga).

### Fase 1.1 — Refinamiento UX + Contenido
- Ajustar copy (EN como idioma base).
- Integrar dataset de categorías/actividades completo.
- Añadir ES (traducciones).
- Añadir tooltips de seguridad para edge play.
- Mejorar feedback visual de swipes.

### Fase 1.2 — i18n + Export extra
- Añadir soporte TH.
- Probar truncamientos / tamaños.
- Integrar `jsPDF` para export PDF básico.

### Fase 2 — Parejas y QR
- Implementar pantalla de comparación (dos payloads).
- Definir lógica de intersección y conflictos.
- Integrar generador de QR para compartir link propio.
- Evaluar primeros pasos de monetización futura (si aplica).


---

Este documento sirve como **Biblia / God Doc** para el proyecto KinkSwipe: define visión, UX, features, arquitectura técnica, i18n y roadmap para que cualquier desarrollador (o agente de automatización tipo Ralphy) pueda entender y construir el MVP y las siguientes iteraciones.

---

## 11. Estado de Implementación (Actualizado 2026-01-22)

### 11.1. Features Implementadas ✅

#### Mobile-First Interface & Interaction Overhaul
- **US-001: Fix Mobile Viewport Layout** ✅
  - Contenedor principal con `overflow-x: hidden` para prevenir scroll horizontal
  - Safe-area margins implementadas para dispositivos con notch
  - Card stack centrado dinámicamente para diferentes anchos de pantalla
  - Verificado en viewports pequeños (iPhone SE) y grandes
  - Validado: `npm run typecheck` y `npm run lint` pasan

- **US-002: Implement 4-Directional Swipe Logic** ✅
  - Left Swipe → "No" (Reject)
  - Right Swipe → "Yes" (Like/Accept)
  - Up Swipe → "Maybe" (Details/Super Like)
  - Down Swipe → "Skip" (Dismiss/Next)
  - Visual feedback implementado (rotación/opacity) durante gestos de arrastre
  - Threshold de swipe configurado para prevenir activaciones accidentales
  - Validado: `npm run typecheck` y `npm run lint` pasan

- **US-003: Add Onboarding Tutorial Card** ✅
  - Card de tutorial visual que muestra las 4 direcciones de swipe
  - Insertado como primer item en el stack de cartas
  - Comportamiento como carta normal (requiere swipe para descartar)
  - Lógica para mostrar solo una vez por usuario/instalación
  - Validado: `npm run typecheck` y `npm run lint` pasan

- **US-004: Create Persistent Footer Navigation** ✅
  - Footer sticky fijo al bottom del viewport
  - Botón "Home" que navega a la landing page
  - Botón "Reset All" que reinicia la sesión/stack actual
  - z-index configurado para mantenerlo visible sin obscurir contenido
  - Validado: `npm run typecheck` y `npm run lint` pasan

### 11.2. Commits de Implementación

La implementación se encuentra en la rama `master` con los siguientes commits:

1. `29b698d` - feat: US-001 - Fix Mobile Viewport Layout
2. `ac420eb` - feat: US-002 - Implement 4-Directional Swipe Logic
3. `a41504a` - feat: US-003 - Add Onboarding Tutorial Card
4. `1953a6f` - feat: US-004 - Create Persistent Footer Navigation

### 11.3. Próximos Pasos Pendientes

- Implementar flujo completo Welcome → Onboarding → Swipe → Summary
- Integrar `react-tinder-card` con estados de swipe (parcialmente implementado)
- Guardar progreso en Zustand + `localStorage`
- Implementar `encodePayload` / `decodePayload` con `lz-string`
- Crear botones de "Copy link" y "Copy text summary"
- Crear `exportImage` para PNG de resumen
- Integrar dataset de categorías/actividades completo
- Añadir tooltips de seguridad para edge play
- Implementar traducciones ES y TH
- Implementar pantalla de comparación (dos payloads)
- Generar QR para compartir link propio
