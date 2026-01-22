# Data Storage Architecture Improvement Plan

## Current State Analysis

### Current Architecture
The KinkSwipe application currently uses:
- **Zustand** for state management with **localStorage** persistence
- **Static data files** for activities (activities-en.ts, activities-es.ts, activities-th.ts)
- **Category definitions** loaded from static files
- **Custom categories** stored in Zustand store with localStorage persistence

### Issues with Current Architecture

1. **Bundle Size Impact**
   - All activities are bundled into the main chunk (~86KB for EN alone)
   - All language versions are included in the bundle
   - Activities load synchronously on page load

2. **Loading Performance**
   - Large initial payload affects Time to Interactive (TTI)
   - Activities loaded even when not immediately needed

3. **Scalability**
   - Adding new activities increases bundle size linearly
   - No efficient way to load specific categories on demand

4. **Data Redundancy**
   - Activities include full descriptions that may not always be needed
   - No compression for text-heavy content

5. **Custom Categories**
   - Limited structure for storing custom activities
   - No versioning or backup mechanism

## Proposed Architecture Improvements

### Phase 1: Lazy Loading & Code Splitting (HIGH PRIORITY)

**Goal**: Reduce initial bundle size and improve TTI

**Implementation**:
1. **Dynamic Imports for Activities**
   - Split activities by category into separate chunks
   - Load activities on-demand when category is selected
   - Keep only basics activities in initial bundle

2. **Language-Specific Chunks**
   - Separate chunks for each language
   - Load only the active language's activities
   - Preload other languages in background

3. **Activity Data Compression**
   - Use LZ-String compression for activity descriptions
   - Decompress on-demand when displaying
   - Store compressed data in bundle

**Expected Benefits**:
- Initial bundle size reduction: ~60% (from 86KB to ~34KB)
- TTI improvement: ~40%
- Memory usage: Reduced by not loading unused categories

### Phase 2: IndexedDB Integration (MEDIUM PRIORITY)

**Goal**: Better offline support and larger data storage

**Implementation**:
1. **IndexedDB for Activity Cache**
   - Cache loaded activities in IndexedDB
   - Check cache before loading from network
   - Periodic cache invalidation

2. **Custom Categories in IndexedDB**
   - Migrate custom categories from localStorage to IndexedDB
   - Support larger custom activity lists
   - Faster read/write operations

3. **Sync Mechanism**
   - Background sync when network is available
   - Conflict resolution for concurrent edits
   - Backup/restore functionality

**Expected Benefits**:
- Faster subsequent loads (cached activities)
- Better offline experience
- Support for more complex custom categories

### Phase 3: Optimized Data Structure (MEDIUM PRIORITY)

**Goal**: More efficient data representation

**Implementation**:
1. **Normalized Activity Data**
   ```typescript
   // Current: Duplicated text in each activity
   {
     id: 'kissing',
     texts: { en: { text: 'Kissing', desc: '...' }, es: {...} }
   }

   // Proposed: Reference-based
   {
     id: 'kissing',
     categoryId: 'basics',
     textIds: { en: 'kissing.text', enDesc: 'kissing.desc' }
   }
   ```

2. **Text Asset Compression**
   - Extract all strings to a single compressed blob
   - Use integer references for activity text
   - Smaller memory footprint

3. **Binary Format for Ratings**
   - Store ratings as bit arrays (4 bits per rating)
   - 1000 ratings = 500 bytes (vs ~15KB current)
   - Faster serialization/deserialization

**Expected Benefits**:
- 70% smaller rating storage
- Faster read/write operations
- Lower memory usage

### Phase 4: Backend Integration (LOW PRIORITY - FUTURE)

**Goal**: Cloud sync and advanced features

**Implementation**:
1. **User Accounts**
   - Auth via email/social login
   - Secure cloud storage for preferences
   - Profile management

2. **Cloud Sync**
   - Real-time sync across devices
   - Conflict resolution
   - Offline-first with automatic sync

3. **Shared Lists**
   - Share custom categories with others
   - Community category marketplace
   - Version control for updates

**Expected Benefits**:
- Access from any device
- Social features
- Backup protection

## Implementation Plan

### Sprint 1: Lazy Loading & Compression (1-2 days)

1. **Split activities by category**
   ```bash
   # Create separate files
   src/data/activities-en/basics.ts
   src/data/activities-en/bondage.ts
   src/data/activities-en/impact.ts
   ...
   ```

2. **Create dynamic loader**
   ```typescript
   // src/utils/ActivityLoader.ts
   export async function loadCategoryActivities(
     categoryId: string,
     lang: Language
   ): Promise<ActivityDef[]> {
     const module = await import(`../data/activities-${lang}/${categoryId}.ts`);
     return module.activities;
   }
   ```

3. **Add compression**
   ```typescript
   // src/utils/compress.ts
   import LZString from 'lz-string';

   export function compressActivityText(text: string): string {
     return LZString.compress(text);
   }

   export function decompressActivityText(compressed: string): string {
     return LZString.decompress(compressed);
   }
   ```

4. **Update SwipeScreen**
   - Load activities on category change
   - Show loading state while fetching
   - Cache loaded categories

### Sprint 2: IndexedDB Migration (2-3 days)

1. **Create IDB wrapper**
   ```typescript
   // src/db/indexedDB.ts
   export const db = {
     activities: cacheActivities,
     customCategories: manageCustomCategories,
     ratings: manageRatings
   }
   ```

2. **Migrate localStorage to IDB**
   - Migration script to transfer existing data
   - Fallback to localStorage if IDB fails
   - Version management for schema changes

3. **Update useAppStore**
   - Replace localStorage persistence with IDB
   - Keep localStorage as fallback
   - Add loading states

### Sprint 3: Data Optimization (1-2 days)

1. **Normalize activity structure**
   - Extract text strings to separate files
   - Create ID mapping
   - Update type definitions

2. **Compress rating storage**
   ```typescript
   // src/utils/ratingEncoder.ts
   export function encodeRatings(ratings: UserRatings): string {
     // Use 2 bits per rating: 00=yes, 01=maybe, 10=skip, 11=no
     return encodeToBase64(bitArray);
   }
   ```

3. **Update SummaryScreen**
   - Decode ratings efficiently
   - Calculate stats from encoded data
   - Lazy decode only displayed items

## Success Metrics

### Performance Targets
- **Initial Bundle Size**: < 30KB (currently ~86KB for activities)
- **TTI**: < 1.5s on 3G (currently ~2.5s)
- **Category Load Time**: < 200ms (currently immediate but with large initial payload)
- **Ratings Storage**: < 1KB for 1000 ratings (currently ~15KB)

### Functionality Targets
- **Offline Support**: Full functionality with cached data
- **Custom Categories**: Support 100+ activities per category
- **Language Switch**: < 500ms switch time
- **Cache Hit Rate**: > 80% for repeat visits

## Risks & Mitigation

### Risk 1: Complexity Increase
**Mitigation**: Keep fallback to localStorage, gradual rollout, thorough testing

### Risk 2: Browser Compatibility
**Mitigation**: Feature detection, fallbacks for older browsers, polyfills

### Risk 3: Data Migration Issues
**Mitigation**: Version tracking, backup before migration, rollback capability

### Risk 4: Cache Invalidation
**Mitigation**: Version stamps on data, clear cache on updates, force refresh option

## Next Steps

1. ✅ **Phase 1.1**: Split activities by category (Start immediately)
2. **Phase 1.2**: Implement dynamic loader
3. **Phase 1.3**: Add LZ-String compression
4. **Phase 2.1**: Create IndexedDB wrapper
5. **Phase 2.2**: Migrate existing data
6. **Phase 2.3**: Update store to use IDB

## Conclusion

The proposed improvements will significantly enhance the performance and scalability of KinkSwipe. Starting with lazy loading and compression will provide immediate benefits, while IndexedDB and data optimization will provide long-term stability and room for growth.

The incremental approach ensures we can:
- Ship improvements continuously
- Measure impact of each change
- Roll back quickly if issues arise
- Maintain backward compatibility
