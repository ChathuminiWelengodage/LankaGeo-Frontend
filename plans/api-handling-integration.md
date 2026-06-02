### # Implementation Plan: Live Analysis API Integration (SCRUM-46)

### ## Approach
- **Why this solution**: We need to connect the frontend to the `POST /analyze/live` endpoint while handling various response states cleanly. We'll use the existing `apiFetch` utility since it already handles JWT authentication automatically. We will enhance `apiFetch` slightly to expose HTTP status codes on the thrown errors so we can accurately distinguish between 422 (Validation), 504 (Timeout), and other errors.
- **Alternatives considered**: Using `fetch` directly in the component, but this would duplicate the JWT injection logic and base URL configuration already present in `apiFetch`.

### ## Steps
1. **Update API Utility** (5 min)
   - Files to modify: `src/lib/api.ts`
   - Introduce an `ApiError` class extending `Error` to store the HTTP status code.
   - Update the `throw` statement in `apiFetch` to use `ApiError` so the frontend can check `error.status === 422` or `error.status === 504`.

2. **Update Search Bar for Validation Errors** (10 min)
   - Files to modify: `src/components/dashboard/LocationSearchBar.tsx`
   - Add `errorMessage?: string` and `onInputChange?: () => void` to `LocationSearchBarProps`.
   - Render the validation error directly below the search input field in red (`text-ruby-alert`).
   - Trigger `onInputChange` when the user modifies their input to clear the error state.

3. **Core Integration & State Handling** (20 min)
   - Files to modify: `src/app/dashboard/page.tsx`
   - Import `apiFetch` and `ApiError`.
   - Add a `validationError` state variable.
   - Replace the `setTimeout` mock inside `startAnalysis` with a real `apiFetch` call to `POST /analyze/live`.
   - Implement the `catch` block to handle different states:
     - `error.status === 422`: Set `validationError` to the error message.
     - `error.status === 504`: Set `error` state to `'timeout'`.
     - `TypeError` (fetch failed): Set `error` state to `'offline'`.
     - On Success (200): Clear errors, set the received data to `geoJsonData` to render the overlays.
   - Pass `validationError` and a clear handler down to `LocationSearchBar`.

### ## Timeline
| Phase | Duration |
|-------|----------|
| API Utils Update | 5 min |
| Search Bar UI | 10 min |
| Integration & State | 20 min |
| Testing | 10 min |
| **Total** | **45 min** |

### ## Rollback Plan
1. Revert `src/app/dashboard/page.tsx` back to using the `setTimeout` simulation.
2. Remove the `validationError` state and props passed to `LocationSearchBar`.
3. Undo the `ApiError` changes in `src/lib/api.ts` if they conflict with other components.

### ## Security Checklist
- [x] Input validation (handled via 422 status from backend)
- [x] Auth checks (JWT securely appended via `apiFetch`)
- [ ] Rate limiting (assumed handled on backend)
- [x] Error handling (offline, timeout, 422 handled)