# KinkSwipe - Sprint 1 & 2 Plan

## Overview
Este documento define el plan para completar el MVP y mejoras prioritarias. Las tareas se organizan en dos sprints con user stories independientes.

---

## Sprint 1: MVP Completion (1-2 días)

### US-001: Fix SwipeScreen Tests

**Story:** Como desarrollador, quiero que los tests de SwipeScreen pasen correctamente para tener confianza en las pruebas automatizadas.

**Acceptance Criteria:**
- [ ] Todos los tests de `SwipeScreen.test.tsx` pasan (13 tests)
- [ ] Tests usan `@testing-library/user-event` para simular swipe gestures
- [ ] Mock de `react-tinder-card` está correctamente configurado
- [ ] Tests cubren: swipe directions, rating updates, navigation, both mode
- [ ] Tests son determinísticos y no flaky

**Technical Details:**
- Issue actual: SwipeCard usa `react-tinder-card` con callbacks complejos
- Solución: Usar `userEvent.pointerUp/pointerDown` o mock completo de TinderCard
- Tests afectados: 8 tests en `src/screens/SwipeScreen.test.tsx`

**Dependencies:** Ninguna

**Estimated Time:** 2-3 horas

---

### US-002: Implement Custom Categories & Activities

**Story:** Como usuario, quiero añadir mis propias categorías y actividades personalizadas para que la app refleje mis preferencias únicas.

**Acceptance Criteria:**
- [ ] Botón "Add Custom" en SummaryScreen abre un dialog modal
- [ ] Dialog permite crear nueva categoría con nombre
- [ ] Dentro de categoría, se pueden añadir actividades con:
  - [ ] Nombre de actividad (obligatorio)
  - [ ] Descripción (opcional)
  - [ ] Marca de "edge" (checkbox)
- [ ] Custom categories se guardan en localStorage
- [ ] Custom activities aparecen en resumen con actividades por defecto
- [ ] Validación: nombre no vacío, categoría mínima 1 actividad
- [ ] Se pueden editar y eliminar custom items

**Technical Details:**
- Reemplazar `setError('Custom categories are not yet available')` con implementación
- Usar `Dialog`, `Input`, `Textarea`, `Checkbox` de shadcn/ui
- Integrar con `useAppStore.addCustomCategory`
- ID generation: `custom-${Date.now()}` para activities

**Mockups:**
```
┌─────────────────────────────────┐
│ Add Custom Category            │
├─────────────────────────────────┤
│ Category Name: [My Kinks     ] │
│                                │
│ Activities:                    │
│ ┌─────────────────────────────┐ │
│ │ Activity: [Roleplay      ] │ │
│ │ Desc: [Costumes &     ]    │ │
│ │        [scenarios...    ]    │ │
│ │ [x] High Risk             │ │
│ └─────────────────────────────┘ │
│ [+ Add Another Activity]        │
│                                │
│ [Cancel]              [Save]   │
└─────────────────────────────────┘
```

**Dependencies:** Ninguna

**Estimated Time:** 4-6 horas

---

### US-003: Add Toast Notifications

**Story:** Como usuario, quiero recibir feedback visual claro cuando copio links, exporto resultados o ocurre un error para confirmar que mis acciones funcionaron.

**Acceptance Criteria:**
- [ ] Sistema de toast notifications implementado (usar shadcn/ui `sonner` o similar)
- [ ] Toast aparece al copiar share link con éxito
- [ ] Toast aparece al copiar text summary con éxito
- [ ] Toast aparece al descargar imagen con éxito
- [ ] Toast de error aparece cuando fallan las acciones anteriores
- [ ] Toast tiene variante: success (verde), error (rojo)
- [ ] Toast desaparece automáticamente después de 3-5 segundos
- [ ] Reemplazar todos los comentarios `// TODO: Show success toast`

**Technical Details:**
- Instalar `sonner` o similar: `npm install sonner`
- Configurar `<Toaster />` en `App.tsx`
- Crear helper: `showToast(message, variant)`
- Integrar en `SummaryScreen.tsx` handlers

**Mockups:**
```
┌──────────────────────────────┐
│ ✓ Link copied to clipboard! │
└──────────────────────────────┘

┌──────────────────────────────┐
│ ✗ Failed to copy link      │
└──────────────────────────────┘
```

**Dependencies:** Ninguna

**Estimated Time:** 2 horas

---

## Sprint 2: Polish & Optimization (2-3 días)

### US-004: Complete i18n Translations

**Story:** Como usuario que habla español o tailandés, quiero ver todos los textos traducidos correctamente para tener una experiencia nativa en mi idioma.

**Acceptance Criteria:**
- [ ] Añadir `tutorial.*` keys a todos los archivos `strings-*.ts`:
  - [ ] `tutorial.title`
  - [ ] `tutorial.heading`
  - [ ] `tutorial.description`
  - [ ] `tutorial.swipeRight`
  - [ ] `tutorial.swipeUp`
  - [ ] `tutorial.swipeDown`
  - [ ] `tutorial.swipeLeft`
  - [ ] `tutorial.dismissHint`
- [ ] Añadir `footer.*` keys a todos los archivos `strings-*.ts`:
  - [ ] `footer.home`
  - [ ] `footer.resetAll`
- [ ] Verificar que no hay textos hardcodeados en inglés
- [ ] Validar traducciones ES y TH con speakers nativos (o revisión)

**Technical Details:**
- Archivos afectados:
  - `src/i18n/strings-en.ts` - agregar keys
  - `src/i18n/strings-es.ts` - agregar keys + traducciones
  - `src/i18n/strings-th.ts` - agregar keys + traducciones
  - `src/components/FooterNavigation.tsx` - usar `t.footer.*`
  - `src/components/TutorialCard.tsx` - usar `t.tutorial.*`

**Translation Draft (ES):**
```typescript
tutorial: {
  title: 'Tutorial',
  heading: '¿Cómo funciona?',
  description: 'Desliza en diferentes direcciones para clasificar actividades.',
  swipeRight: 'Like/Yes',
  swipeUp: 'Quizás/Maybe',
  swipeDown: 'Meh/Tolerar',
  swipeLeft: 'Nope/No',
  dismissHint: 'Desliza cualquier dirección para continuar'
},
footer: {
  home: 'Inicio',
  resetAll: 'Reiniciar Todo'
}
```

**Dependencies:** Ninguna

**Estimated Time:** 2-3 horas

---

### US-005: Code Splitting & Bundle Optimization

**Story:** Como usuario móvil, quiero que la app cargue rápido y use poco ancho de banda para tener una experiencia fluida incluso en conexiones lentas.

**Acceptance Criteria:**
- [ ] Bundle principal reducido de 685KB a <400KB
- [ ] Implementar lazy loading para screens pesadas
- [ ] Configurar manual chunks para libraries grandes (framer-motion, html2canvas)
- [ ] Warning de chunk size eliminado o mitigado
- [ ] Time to interactive (TTI) reducido en >30%
- [ ] Build optimizado sin breaking changes

**Technical Details:**

**1. Dynamic Imports para Screens:**
```typescript
// App.tsx
const SwipeScreen = lazy(() => import('./screens/SwipeScreen'))
const SummaryScreen = lazy(() => import('./screens/SummaryScreen'))
const LoadFromLink = lazy(() => import('./screens/LoadFromLink'))
```

**2. Manual Chunks en `vite.config.ts`:**
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', ...],
        'animation': ['framer-motion'],
        'export': ['html2canvas'],
        'utils': ['lz-string']
      }
    }
  }
}
```

**3. Code Splitting por categoría:**
```typescript
// Lazy load activities por categoría
const loadActivities = async (lang: string, category: string) => {
  const module = await import(`../data/activities-${lang}.ts`)
  return module.default.filter(a => a.categoryId === category)
}
```

**Dependencies:** Ninguna

**Estimated Time:** 3-4 horas

---

### US-006: Comprehensive Testing & QA

**Story:** como usuario, quiero que todas las funcionalidades de la app funcionen correctamente sin bugs ni errores para tener una experiencia confiable.

**Acceptance Criteria:**
- [ ] Todos los tests pasan (97/97 tests)
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] Build de producción exitosa sin warnings críticos
- [ ] Manual testing en:
  - [ ] Desktop (Chrome, Safari, Firefox)
  - [ ] Mobile Safari (iOS)
  - [ ] Mobile Chrome (Android)
  - [ ] Small viewport (iPhone SE 375x667)
  - [ ] Large viewport (Desktop 1920x1080)
- [ ] Flows E2E validados:
  - [ ] Onboarding completo (give/receive/both)
  - [ ] Swipe en todas las categorías
  - [ ] Resumen y export
  - [ ] Load from link
  - [ ] Reset state
- [ ] Edge cases probados:
  - [ ] URL con payload inválido
  - [ ] Sin localStorage (modo privado)
  - [ ] Cambiar idioma durante swipe
  - [ ] Interrupción de navegación (back button)

**Technical Details:**

**1. Fix Remaining Tests:**
- `SwipeScreen.test.tsx` (8 tests) - implementados en US-001
- `onboarding-flow.test.tsx` (8 tests) - actualizar con nuevos flujos
- `summary.test.tsx` (2 tests skipped) - desbloquear y pasar

**2. Manual QA Checklist:**
```markdown
### Desktop Testing
- [ ] Welcome screen displays correctly
- [ ] Onboarding flow works with all options
- [ ] Swipe gestures work with mouse drag
- [ ] Action buttons work with click
- [ ] Theme toggle switches between dark/light
- [ ] Language switcher works (EN/ES/TH)
- [ ] Summary displays correctly with all ratings
- [ ] Share link copies to clipboard
- [ ] Export text works
- [ ] Export image downloads PNG
- [ ] Load from link validates and loads

### Mobile Testing
- [ ] Touch/swipe gestures work smoothly
- [ ] Safe areas respected (notch, home indicator)
- [ ] Buttons large enough for touch (44px min)
- [ ] No horizontal scroll on any screen
- [ ] Keyboard doesn't appear inappropriately
- [ ] Native share works (navigator.share)
- [ ] Back button works correctly

### Cross-browser
- [ ] Chrome/Edge (Desktop + Android)
- [ ] Safari (Desktop + iOS)
- [ ] Firefox (Desktop)
```

**3. Performance Testing:**
- [ ] Lighthouse score >90 on mobile
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s
- [ ] Total Bundle Size <500KB gzipped

**Dependencies:**
- US-001 (SwipeScreen tests)
- US-002 (Custom categories)
- US-003 (Toast notifications)
- US-004 (i18n complete)
- US-005 (Code splitting)

**Estimated Time:** 4-6 horas

---

## Sprint Timeline

### Sprint 1 (Días 1-2)
| Tarea | Día 1 | Día 2 |
|-------|-------|-------|
| US-001: Fix SwipeScreen Tests | 3h | - |
| US-002: Custom Categories | 2h | 2h |
| US-003: Toast Notifications | 2h | - |
| Buffer/Testing | 1h | 2h |

**Total Sprint 1:** ~12 horas (1.5 días)

### Sprint 2 (Días 3-5)
| Tarea | Día 3 | Día 4 | Día 5 |
|-------|-------|-------|-------|
| US-004: Complete i18n | 2h | 1h | - |
| US-005: Code Splitting | 2h | 2h | - |
| US-006: QA Testing | 2h | 1h | 4h |
| Buffer/Deployment | - | - | 2h |

**Total Sprint 2:** ~16 horas (2 días)

---

## Definition of Done

Para considerar cada User Story como "Done":

- [ ] Todos los acceptance criteria cumplidos
- [ ] Code review aprobado
- [ ] Tests pasando (100% coverage para new code)
- [ ] TypeScript sin errores
- [ ] ESLint sin warnings
- [ ] Manual testing en al menos 1 dispositivo móvil
- [ ] Documentación actualizada (si aplica)
- [ ] Commit con message descriptivo siguiendo Conventional Commits

---

## Success Metrics

Al finalizar Sprint 1 & 2:

- **Tests:** 97/97 pasando (100%)
- **Coverage:** >80% para código nuevo
- **Bundle Size:** <400KB main chunk
- **Performance:** Lighthouse >90 en móvil
- **Features:** Custom categories + toasts + i18n completo
- **QA:** Zero bugs críticos conocidos

---

## Notes & Risks

**Riesgos:**
1. **SwipeCard mocking complexity** - Puede requerir refactor si tests no pasan fácilmente
2. **Bundle optimization tradeoffs** - Code splitting puede afectar perceived performance
3. **i18n validation** - Requiere speaker nativo para ES/TH

**Mitigación:**
1. Tener plan B: integración testing en lugar de unit testing para swipe
2. Monitorear real-world performance con analytics o RUM
3. Usar traducción profesional o community review

---

*Last Updated: 2026-01-23*
*Author: AI Assistant based on project analysis*
