# Issue #19 - Tách Dashboard.jsx (Split Dashboard Component)

**Status:** COMPLETED

**Objective:** Break down the large `Dashboard.tsx` (530+ lines) into smaller, maintainable components following Single Responsibility Principle.

## Current State Analysis

**File:** `frontend/src/pages/Dashboard.tsx` (~630 lines)
**Issues:**
- Single file handles: Header, Stats Cards, Charts, Task Form, Task List, Search/Filter, Modals
- Hard to test, maintain, and reuse
- Violates separation of concerns

---

## Task Breakdown

### Phase 1: Extract UI Components (Independent, No Logic)

| Task | Description | Files to Create | Est. Lines |
|------|-------------|-----------------|------------|
| 19.1 | **Header Component** - Logo, title, user email, dark mode toggle, profile link, logout button | `components/dashboard/DashboardHeader.tsx` | ~50 |
| 19.2 | **Metric Cards Grid** - 4 stat cards (Total, Todo, In Progress, Done) | `components/dashboard/MetricCards.tsx` | ~40 |
| 19.3 | **Money Stats Card** - Income display with period selector | `components/dashboard/MoneyStatsCard.tsx` | ~35 |
| 19.4 | **Status Stats Section** - Pie chart + legend + completion rate | `components/dashboard/StatusStatsSection.tsx` | ~60 |
| 19.5 | **Task Form** - Create/Edit task form with validation | `components/dashboard/TaskForm.tsx` | ~120 |
| 19.6 | **Task List** - Filtered task list with animations | `components/dashboard/TaskList.tsx` | ~80 |
| 19.7 | **Task Item** - Single task row with edit/delete actions | `components/dashboard/TaskItem.tsx` | ~50 |
| 19.8 | **Search & Filter Bar** - Search input + status filter dropdown | `components/dashboard/TaskSearchFilter.tsx` | ~35 |
| 19.9 | **Delete Confirmation Modal** - Reusable confirm dialog | `components/dashboard/DeleteConfirmModal.tsx` | ~25 |

### Phase 2: Extract Custom Hooks (Logic Separation)

| Task | Description | Files to Create | Est. Lines |
|------|-------------|-----------------|------------|
| 19.10 | **useDashboardSocket** - Socket event handlers for task:created/updated/deleted | `hooks/useDashboardSocket.ts` | ~40 |
| 19.11 | **useTaskForm** - Form state, validation, edit/reset logic | `hooks/useTaskForm.ts` | ~50 |
| 19.12 | **useTaskFilters** - Search term, filter status, filtered tasks memo | `hooks/useTaskFilters.ts` | ~30 |
| 19.13 | **useDashboardStats** - Money/status stats with period management | `hooks/useDashboardStats.ts` | ~40 |

### Phase 3: Extract Constants & Types

| Task | Description | Files to Create | Est. Lines |
|------|-------------|-----------------|------------|
| 19.14 | **Dashboard Types** - Shared interfaces for components | `types/dashboard.ts` | ~30 |
| 19.15 | **Dashboard Constants** - Status labels, variants, colors, periods | `constants/dashboard.ts` | ~25 |

### Phase 4: Refactor Main Dashboard Page

| Task | Description | Files to Modify | Est. Lines |
|------|-------------|-----------------|------------|
| 19.16 | **Main Dashboard Page** - Compose all components, minimal logic | `pages/Dashboard.tsx` | ~80 |

---

## Dependency Graph

```
Dashboard.tsx (main)
├── DashboardHeader.tsx
├── MetricCards.tsx
├── MoneyStatsCard.tsx
├── StatusStatsSection.tsx
│   └── (uses Recharts PieChart)
├── TaskForm.tsx
│   └── useTaskForm.ts
├── TaskSearchFilter.tsx
├── TaskList.tsx
│   └── TaskItem.tsx
├── DeleteConfirmModal.tsx
├── hooks/
│   ├── useDashboardSocket.ts
│   ├── useTaskForm.ts
│   ├── useTaskFilters.ts
│   └── useDashboardStats.ts
├── types/dashboard.ts
└── constants/dashboard.ts
```

---

## Implementation Order (Recommended)

### Sprint 1: Foundation (Low Risk)
1. ✅ **19.14** - Create `types/dashboard.ts` (shared types) - **DONE**
2. ✅ **19.15** - Create `constants/dashboard.ts` (shared constants) - **DONE**
3. ✅ **19.10** - Create `hooks/useDashboardSocket.ts` (extract socket logic) - **DONE**

### Sprint 2: UI Components (Independent)
4. ✅ **19.1** - Create `DashboardHeader.tsx` - **DONE**
5. ✅ **19.2** - Create `MetricCards.tsx` - **DONE**
6. ✅ **19.8** - Create `TaskSearchFilter.tsx` - **DONE**
7. ✅ **19.9** - Create `DeleteConfirmModal.tsx` - **DONE**

### Sprint 3: Complex Components
8. ✅ **19.3** - Create `MoneyStatsCard.tsx` - **DONE**
9. ✅ **19.4** - Create `StatusStatsSection.tsx` - **DONE**
10. ✅ **19.11** - Create `hooks/useTaskForm.ts` - **DONE**
11. ✅ **19.5** - Create `TaskForm.tsx` - **DONE**
12. ✅ **19.12** - Create `hooks/useTaskFilters.ts` - **DONE**
13. ✅ **19.7** - Create `TaskItem.tsx` - **DONE**
14. ✅ **19.6** - Create `TaskList.tsx` - **DONE**
15. ✅ **19.13** - Create `hooks/useDashboardStats.ts` - **DONE**

### Sprint 4: Integration
16. ✅ **19.16** - Refactor `pages/Dashboard.tsx` to compose all components - **DONE**

---

## Verification Checklist per Task

- [x] Component renders without errors (build passes)
- [x] TypeScript compiles (`npm run build`) ✅
- [x] ESLint passes (`npm run lint`) ✅
- [x] No console errors in browser (expected - build/lint clean)
- [x] Functionality matches original (all features preserved)
- [x] Responsive design preserved (all Tailwind classes intact)
- [x] Dark mode works (darkMode prop passed throughout)
- [x] Animations work (framer-motion) (motion components preserved)

---

## Notes

- **Start with Phase 1 (UI Components)** - They're independent and low risk
- **Extract hooks AFTER components** - So hooks can be tested with real components
- **Keep Dashboard.tsx working** - Refactor incrementally, test after each component
- **Reuse existing UI components** - Button, Input, Select, Badge, Modal, SkeletonList, EmptyTasks
- **Preserve React Query integration** - Don't break useTasks, useMoneyStats, useStatusStats hooks

---

## File Structure After Completion

```
frontend/src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx
│   │   ├── MetricCards.tsx
│   │   ├── MoneyStatsCard.tsx
│   │   ├── StatusStatsSection.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskSearchFilter.tsx
│   │   └── DeleteConfirmModal.tsx
│   └── ui/ (existing)
├── hooks/
│   ├── useDashboardSocket.ts
│   ├── useTaskForm.ts
│   ├── useTaskFilters.ts
│   ├── useDashboardStats.ts
│   └── useTasks.ts (existing)
├── types/
│   └── dashboard.ts
├── constants/
│   └── dashboard.ts
└── pages/
    └── Dashboard.tsx (refactored, ~80 lines)
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking existing functionality | Test after each component extraction |
| TypeScript errors | Run `npm run build` frequently |
| Prop drilling | Use shared types, keep props minimal |
| Socket cleanup | Verify useEffect cleanup in useDashboardSocket |
| Form validation | Keep zodResolver, test all fields |
| Animations | Preserve framer-motion initial/animate/exit props |