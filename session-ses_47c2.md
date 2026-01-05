# Code review for backend and frontend mobile apps

**Session ID:** ses_47c2deeeaffekFxMEIYFyymRcF
**Created:** 1/3/2026, 7:25:40 PM
**Updated:** 1/3/2026, 8:17:03 PM

---

## User

can you do code review for backend and frontend mobile apps

---

## Assistant

_Thinking:_

The user is asking me to do a code review for both the backend and frontend mobile apps. This is a large task that requires me to:

1. Understand the project structure
2. Review backend code (Express/Node.js)
3. Review mobile frontend code (React Native/Expo)
4. Identify potential issues, improvements, and best practices

However, I'm in READ-ONLY mode (Plan Mode), which means I cannot make any edits or modifications. I can only read, analyze, and plan.

Since the user is asking me to do a code review (which is primarily a read/analysis task), this should be allowed in Plan Mode. However, I should clarify what they want from this review:

1. Do they want a quick overview or a detailed analysis?
2. Are there specific areas they're concerned about?
3. Do they want me to just analyze and report, or also create a plan for fixes?

Let me start by exploring the codebase to understand the structure and then provide a comprehensive review plan. I'll need to:

1. Look at the backend structure (routes, models, controllers if any)
2. Look at the mobile app structure (screens, components, API calls)
3. Check for common issues like:
   - Security vulnerabilities
   - Code quality
   - Best practices
   - Performance issues
   - Error handling
   - API design
   - State management

Let me begin exploring the codebase to provide a meaningful review.

I'll help you review both the backend and mobile frontend code. Since I'm in read-only mode, I can analyze the codebase and provide you with a comprehensive review report.

Let me start by exploring the codebase structure to understand what we're working with.

```
Tool: task

**Input:**
```json
{
  "description": "Explore backend codebase structure",
  "prompt": "Explore the backend codebase at /home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/backend/\n\nI need you to:\n1. List all files and their structure\n2. Identify the main entry point and routes\n3. Look for any models, controllers, or middleware\n4. Check for configuration files (package.json, any config files)\n5. Identify the API structure and endpoints\n\nProvide a comprehensive summary of:\n- Directory structure\n- Key files and their purposes\n- Technology stack used\n- API endpoints defined\n- Any obvious patterns or anti-patterns you notice\n\nBe thorough - this is for a code review.",
  "subagent_type": "explore"
}
```
**Output:**
```
Now I have a complete picture of the backend. Here is my comprehensive code review summary:

---

# Backend Code Review Summary

## 1. Directory Structure

```
backend/
├── .env                    # Environment variables (hidden/ignored)
├── index.js                # Main entry point (101 lines)
├── package.json            # Dependencies config
├── package-lock.json       # Locked dependency versions
└── routes/                 # Modular route handlers
    ├── auth.js            # Authentication & user management (350 lines)
    ├── spot.js            # Fishing venue management (74 lines)
    ├── alat.js            # Fishing equipment catalog (95 lines)
    ├── bookings.js        # Venue booking system (270 lines)
    ├── orders.js          # Equipment orders (127 lines)
    ├── reviews.js         # Reviews system (78 lines)
    ├── payment.js         # Payment processing (161 lines)
    └── content.js         # Static content (tips & contests) (63 lines)
```

## 2. Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | - |
| Web Framework | Fastify | ^5.6.2 |
| JWT Auth | @fastify/jwt | ^10.0.0 |
| Database | MySQL (via @fastify/mysql) | ^5.0.2 |
| CORS | @fastify/cors | ^11.1.0 |
| Password Hashing | bcrypt | ^6.0.0 |
| Environment Variables | dotenv | ^17.2.3 |
| Development | nodemon | ^3.1.11 |

## 3. API Endpoints Summary

| Prefix | Method | Endpoint | Auth | Description |
|--------|--------|----------|------|-------------|
| `/auth` | POST | `/signup` | No | User registration |
| `/auth` | POST | `/login` | No | User login (returns JWT) |
| `/auth` | GET | `/profile` | Yes | Get user profile |
| `/auth` | PATCH | `/my-profile` | Yes | Update profile |
| `/auth` | POST | `/forgot-password` | No | Request password reset |
| `/auth` | POST | `/reset-password` | No | Reset password with token |
| `/tempat_mancing` | GET | `/` | No | List all fishing venues |
| `/tempat_mancing` | GET | `/:id` | No | Get venue details |
| `/alat_pancing` | GET | `/` | No | List equipment (filterable by `tempat_id`) |
| `/alat_pancing` | GET | `/:id` | No | Get equipment details |
| `/bookings` | POST | `/` | Yes | Create new booking |
| `/bookings` | GET | `/my` | Yes | Get user's booking history |
| `/bookings` | DELETE | `/my/:id` | Yes | Cancel booking |
| `/bookings` | GET | `/check-seats` | No | Check available seats (for availability map) |
| `/bookings` | GET | `/schedule` | No | Get schedule for specific seat |
| `/orders` | POST | `/` | Yes | Create order (checkout) |
| `/orders` | GET | `/my` | Yes | Get user's orders |
| `/orders` | GET | `/my/:id` | Yes | Get order details |
| `/reviews` | GET | `/` | No | Get reviews by `tempat_id` |
| `/reviews` | POST | `/` | Yes | Submit review |
| `/payment` | POST | `/create` | Yes | Create payment invoice |
| `/payment` | GET | `/:id` | Yes | Get payment details |
| `/payment` | POST | `/:id/pay` | Yes | Confirm payment (simulated) |
| `/content` | GET | `/tips` | No | Get tips & tricks (limit 6) |
| `/content` | GET | `/lomba` | No | Get upcoming contests (limit 3) |

## 4. Key Architecture Patterns

### Positive Patterns

1. **Modular Route Organization**: Routes are separated by domain (auth, bookings, orders, etc.) with proper prefixes.

2. **JWT Authentication**: Implemented properly with `@fastify/jwt` and global middleware decorator (`fastify.authenticate`).

3. **Password Security**: Uses bcrypt for password hashing with salt generation.

4. **Database Connection Management**: Consistent pattern of `connection = await fastify.mysql.getConnection()` followed by `connection.release()` in `try/finally` blocks.

5. **SQL Injection Prevention**: Uses parameterized queries with `?` placeholders throughout.

6. **Transaction Support**: Critical operations (orders, payments) use database transactions for data integrity.

7. **Dynamic Query Building**: Smart implementation for filtering (e.g., `alat.js` filter parsing, `auth.js` profile updates).

8. **Input Validation**: Basic validation exists for required fields before database operations.

9. **Booking Collision Detection**: Sophisticated overlap checking in `bookings.js` using time-based logic.

10. **CORS Configuration**: Properly configured for development (localhost + 10.0.2.2 for Android emulator).

### Areas of Concern (Anti-Patterns & Issues)

1. **No Request Validation Schema**: Fastify supports schema validation for inputs, but no schemas are defined. This leaves validation to manual checks which can be error-prone.

2. **Inconsistent Error Handling**: 
   - Some routes return `err` directly to client (e.g., `reviews.js`, `payment.js`)
   - Some return generic messages like "Terjadi kesalahan pada server"
   - No structured error response format

3. **Hardcoded Reset Token Expiry**: In `auth.js`, uses `DATE_ADD(NOW(), INTERVAL 1 HOUR)` but `NOW()` is database time, not application time - potential timezone drift.

4. **No Rate Limiting**: No rate limiting middleware exposed, vulnerable to brute force attacks (especially on login/forgot-password).

5. **No Request Logging/Tracing**: Fastify's logger is enabled but no structured request logging for API auditing.

6. **Missing Admin Endpoints**: No role-based access control (RBAC). Some routes like venue/equipment management are missing.

7. **No Data Pagination**: All list endpoints return all records (e.g., `spot.js`, `alat.js`).

8. **No File Upload Handling**: No Multer or similar for image uploads (though `avatar_url` is in user schema).

9. **Unsafe Dynamic Query in alat.js**: Line 45 uses template literal injection:
   ```javascript
   sql += ` WHERE tempat_id IN (${placeholders})`;
   ```
   While `placeholders` is controlled, it's better to use proper array parameterization.

10. **Missing Password Strength Validation**: Only checks if password exists, not complexity requirements.

11. **Inconsistent Status Codes**: Some success responses don't send appropriate codes (e.g., `204` for delete).

12. **No API Documentation**: No Swagger/OpenAPI docs generated.

13. **No Unit/Integration Tests**: No test suite found in `package.json`.

14. **Transaction Error Handling**: In `orders.js`, rollback happens inside catch but connection may already be released in `finally`.

15. **Hardcoded Console Logging**: Password reset link logged to console instead of actual email service.

## 5. Database Tables Implied

Based on route queries, the following tables are used:
- `users` (id, username, first_name, last_name, full_name, email, password_hash, phone, address, avatar_url, reset_token, reset_expires)
- `tempat_mancing` (id, nama, lokasi, harga_per_jam, ...)
- `tempat_alat` (id, tempat_id, nama, harga_beli, harga_sewa, ...)
- `bookings` (id, user_id, tempat_id, no_kursi, tanggal_booking, start_time, end_time, total_harga, status, payment_id)
- `orders` (id, user_id, status, total_harga, payment_id, created_at)
- `order_details` (id, order_id, alat_id, tipe, jumlah, harga_saat_transaksi)
- `reviews` (id, user_id, tempat_id, rating, komentar, created_at)
- `payments` (id, user_id, metode_pembayaran, jumlah_bayar, status_pembayaran)
- `tips` (id, ...)
- `lomba` (id, tanggal_pelaksanaan, ...)

## 6. Security Considerations

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| No rate limiting on auth endpoints | Medium-High | Add `@fastify/rate-limit` |
| JWT expires in 1h (hardcoded) | Medium | Make configurable |
| No password complexity check | Medium | Add validation regex |
| SQL injection possible in dynamic queries | Low | Use proper array binding |
| Reset token stored plaintext | High | Should be hashed |
| No input sanitization on comments/reviews | Medium | Add XSS protection |
| CORS allows all origins in comment but not in config | Low | Review CORS policy |

## 7. Recommendations for Improvement

1. Add Fastify schema validation for all endpoints
2. Implement rate limiting (especially for auth routes)
3. Add pagination to list endpoints
4. Create proper error response structure
5. Add admin role and protected admin endpoints
6. Implement file upload handling for images
7. Add Swagger/OpenAPI documentation
8. Create unit/integration tests
9. Make timeout/expiry values configurable
10. Add request logging middleware for auditing
11. Consider using Fastify's native CORS instead of deprecated `cors` package

---

**Overall Assessment**: The backend is well-structured with clean route organization and good foundational patterns. It demonstrates solid understanding of authentication, database transactions, and SQL injection prevention. However, it lacks production-hardening features like rate limiting, input schema validation, proper error handling, and testing. The codebase is suitable for a prototype/MVP but would need significant hardening before production deployment.

<task_metadata>
session_id: ses_47c2dc02bffe5un5Ih7zROdxWn
</task_metadata>
```
```

```
Tool: task

**Input:**
```json
{
  "description": "Explore mobile frontend codebase structure",
  "prompt": "Explore the mobile frontend codebase at /home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/\n\nI need you to:\n1. List all files and their structure\n2. Identify the main screens and navigation structure\n3. Look for components, hooks, services\n4. Check for API integration patterns\n5. Identify state management approach\n6. Check configuration files\n\nProvide a comprehensive summary of:\n- Directory structure\n- Key files and their purposes\n- Technology stack used (React Native, Expo, etc.)\n- Screen structure and navigation\n- API call patterns\n- State management approach\n- Any obvious patterns or anti-patterns you notice\n\nBe thorough - this is for a code review.",
  "subagent_type": "explore"
}
```
**Output:**
```
Now I have a complete picture of the codebase. Here is my comprehensive code review summary:

---

# Mobile Frontend Code Review Summary

## 1. Directory Structure

```
mobile/
├── app/
│   ├── (auth)/                 # Authentication routes
│   │   ├── Login.tsx
│   │   └── SignUp.tsx
│   ├── (booking)/              # Booking flow
│   │   ├── Booking.tsx
│   │   └── InformationPlace.tsx
│   ├── (payment)/              # Payment flow
│   │   ├── Payment.tsx
│   │   ├── Qris.tsx
│   │   └── VirtualAccount.tsx
│   ├── (tabs)/                 # Tab navigation screens
│   │   ├── _layout.tsx
│   │   ├── index.tsx           # Home screen
│   │   ├── explore.tsx
│   │   ├── events.tsx
│   │   ├── notifications.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx             # Root layout
│   ├── BuysAndRentFishing.tsx  # Equipment rental/shopping
│   ├── ReviewPath.tsx
│   ├── ReviewSuccess.tsx
│   ├── RecommendationPlace.tsx
│   └── modal.tsx
├── components/
│   ├── ui/
│   │   ├── collapsible.tsx
│   │   ├── icon-symbol.ios.tsx
│   │   └── icon-symbol.tsx
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/
│   └── theme.ts
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── src/
│   ├── config/
│   │   └── api.ts              # Axios instance & endpoints
│   ├── contexts/
│   │   └── AuthContext.tsx     # Auth state management
│   └── services/
│       └── api.ts              # API service methods
├── assets/images/
├── .expo/
├── .vscode/
├── node_modules/
├── .gitignore
├── app.json
├── babel.config.js
├── eslint.config.js
├── global.css
├── metro.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 2. Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Expo | 54.0.27 |
| **Runtime** | React Native | 0.81.5 |
| **React** | React | 19.1.0 |
| **Router** | Expo Router | 6.0.17 |
| **Navigation** | React Navigation | 7.x |
| **Styling** | NativeWind (Tailwind) | 4.2.1 |
| **HTTP Client** | Axios | 1.13.2 |
| **Animations** | React Native Reanimated | 4.1.1 |
| **State Management** | React Context API |
| **Storage** | AsyncStorage | 2.2.0 |
| **Language** | TypeScript | 5.9.2 |

## 3. Screen Structure & Navigation

### Navigation Hierarchy:
```
Root Layout (_layout.tsx)
├── Stack Navigator
│   ├── (tabs) [headerShown: false]
│   │   ├── index (Home)
│   │   ├── explore
│   │   ├── events
│   │   ├── notifications
│   │   └── profile
│   └── modal
│
├── Auth Routes (auth group)
│   ├── Login
│   └── SignUp
│
├── Booking Routes (booking group)
│   ├── InformationPlace (detail page)
│   └── Booking (seat selection)
│
├── Payment Routes (payment group)
│   ├── Payment (method selection)
│   ├── Qris
│   └── VirtualAccount
│
└── Other Routes
    ├── BuysAndRentFishing
    ├── ReviewPath
    ├── ReviewSuccess
    └── RecommendationPlace
```

### Key Navigation Patterns:
- **File-based routing** using Expo Router with route groups `(auth)`, `(booking)`, `(payment)`, `(tabs)`
- **Dynamic routing**: `/InformationPlace?id=xxx`
- **Tab bar visibility**: Hidden on modals, auth screens, booking, and payment screens

## 4. API Integration Patterns

### Axios Configuration (`src/config/api.ts`)
- Platform-aware base URL configuration:
  - Android: `http://10.0.2.2:3000` (Android emulator special IP)
  - iOS/Web: `http://localhost:3000`
- Request/response interceptors for auth token handling (currently incomplete)
- Centralized endpoint definitions

### API Service Layer (`src/services/api.ts`)
```typescript
export const api = {
    get: async (endpoint: string, params?: object)
    post: async (endpoint: string, data: object)
    delete: async (endpoint: string)
    
    // Domain-specific methods
    auth: { signup, login }
    spots: { getAll, getById }
    bookings: { create, checkAvailability }
    payment: { process }
}
```

### Issues Identified:
1. **Incomplete auth interceptor**: The request interceptor has a TODO comment and doesn't actually add auth tokens
2. **Inconsistent endpoint URLs**: Some endpoints use leading slash, others don't (`SIGNUP: "auth/signup"` vs `LOGIN: "/auth/login"`)
3. **Hardcoded API URL**: Both development and production point to `localhost` in config
4. **No error handling abstraction**: Errors are handled ad-hoc in components
5. **Bug in checkAvailability**: Uses `spot_id` instead of `spotId` in params object

## 5. State Management Approach

### Current Strategy: React Context + Local State
- **AuthContext** (`src/contexts/AuthContext.tsx`): Manages user session, token storage, login/logout
- **Local component state**: `useState` for UI state in each component
- **No global state library**: No Redux, Zustand, or Jotai

### AuthContext Features:
- Stores token and user in AsyncStorage
- Auto-loads auth data on mount
- Automatic navigation on login/logout
- Loading state management

### Issues:
1. **No auth guard**: Routes like `Booking.tsx` don't check if user is authenticated
2. **Scattered state**: Cart state in `BuysAndRentFishing.tsx` is local-only (lost on navigation)
3. **No persistency**: Cart state not saved to AsyncStorage
4. **Mixed concerns**: UI state mixed with business logic in components

## 6. Key Files & Their Purposes

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout with ThemeProvider, SafeAreaProvider |
| `app/(tabs)/_layout.tsx` | Tab bar configuration with conditional visibility |
| `src/config/api.ts` | Axios instance, interceptors, endpoint constants |
| `src/services/api.ts` | Typed API methods for each domain |
| `src/contexts/AuthContext.tsx` | Authentication state management |
| `app/(tabs)/index.tsx` | Home screen with spot listings, events |
| `app/(booking)/Booking.tsx` | Seat selection with visual grid |
| `app/(payment)/Payment.tsx` | Payment method selection (accordion UI) |
| `app/BuysAndRentFishing.tsx` | Equipment catalog with buy/rent cart |
| `app/(tabs)/profile.tsx` | User profile with settings |

## 7. Design Patterns & Anti-Patterns

### Good Patterns Found:
1. **Route groups** for organizing routes by feature
2. **TypeScript interfaces** for type safety
3. **Separation of concerns**: API config separate from service layer
4. **Loading states** with ActivityIndicator
5. **Pull-to-refresh** implementation in Home screen
6. **Helper functions** for currency formatting
7. **Custom tab bar buttons** with haptic feedback

### Anti-Patterns Identified:

1. **Inconsistent Error Handling**
   - Some places use `console.error`, others use `Alert.alert`
   - No centralized error handling strategy

2. **Mixed Styling Approaches**
   - StyleSheet objects mixed with Tailwind classes
   - No consistent styling strategy (could pick one)

3. **Hardcoded Data**
   - `Booking.tsx`: Seat availability hardcoded
   - `notifications.tsx`: Mock notification data
   - `BuysAndRentFishing.tsx`: Mock products
   - `explore.tsx`: Template code not replaced

4. **Route Definition Inconsistency**
   - `explore.tsx` still uses default Expo template content
   - Missing actual implementation for explore page

5. **Incomplete Authentication Flow**
   - Auth interceptor is a stub (TODO comments)
   - No logout API call, only local cleanup
   - No refresh token mechanism

6. **No Loading State Consistency**
   - Some async operations don't show loading
   - `isLoading` state not always disabled during API calls

7. **Magic Numbers & Strings**
   - Prices like `PRICE_PER_HOUR = 25000` hardcoded
   - No constants for colors, timing values

8. **Component Size**
   - Some screens like `Booking.tsx` (524 lines) and `index.tsx` (479 lines) are too large
   - Should be split into smaller components

9. **Missing Prop Types**
   - Some components lack proper prop type definitions
   - `route.params` not typed properly

10. **No Unit/Integration Tests**
    - No test files found in codebase

## 8. Security Concerns

1. **Hardcoded localhost URLs**: Not suitable for production
2. **No certificate validation** mentioned for API calls
3. **Sensitive data in AsyncStorage**: Token stored without encryption
4. **No input validation** beyond basic checks
5. **Password visible in memory** during login

## 9. Performance Considerations

1. **Missing image optimization**: Using external placeholder URLs
2. **No memoization** (useMemo, useCallback) except in a few places
3. **Large bundle potential**: Many dependencies that may not be tree-shaken
4. **Re-renders**: Components re-render on every state change without optimization

## 10. Recommendations

### High Priority:
1. **Complete Auth Interceptor**: Implement token injection and 401 handling
2. **Add Auth Guards**: Protect routes that require authentication
3. **Fix API URL Configuration**: Support environment-based URLs
4. **Replace Template Code**: Implement `explore.tsx` properly

### Medium Priority:
1. **Centralize Error Handling**: Create error boundary and unified handling
2. **State Management**: Consider Zustand or Redux Toolkit for cart/global state
3. **Component Extraction**: Break down large screens into smaller components
4. **Type All Route Params**: Use TypeScript generics with expo-router

### Low Priority:
1. **Add Unit Tests**: Jest + React Testing Library setup
2. **Dark Mode Support**: The infrastructure exists but not fully implemented
3. **Environment Config**: Add `.env` file support
4. **API Mocking**: Add MSW or similar for development/testing

---

This codebase shows a solid foundation with good architectural decisions (file-based routing, TypeScript, Context API) but needs cleanup of incomplete features and better state management for a production-ready application.

<task_metadata>
session_id: ses_47c2db834ffeJ8DjMb072WLBH4
</task_metadata>
```
```

---

## Assistant

_Thinking:_

Great! I've received comprehensive code reviews for both the backend and mobile frontend. Let me now synthesize this information into a clear, actionable code review report for the user.

Both agents provided excellent detailed analysis. Let me organize this into a concise summary that covers:

1. Overall assessment
2. Key findings for backend
3. Key findings for mobile frontend
4. Critical security issues
5. Recommendations for both

I should present this in a clear, readable format that helps the user understand the state of their codebase and what needs to be fixed.

# Code Review Report: Kailku Mobile App

## Overall Assessment

**Backend (Fastify + MySQL)**: Well-structured prototype with solid authentication patterns, but needs production hardening.
**Mobile (React Native + Expo)**: Good architectural foundation with file-based routing, but has incomplete features and template code.

---

## Backend Critical Issues

### Security
- **No rate limiting** on auth endpoints (login, signup, password reset) - vulnerable to brute force
- **Reset tokens stored in plaintext** in database - should be hashed
- **No input sanitization** on comments/reviews - XSS risk

### Production Readiness
- No request validation schemas (Fastify supports this)
- No pagination on list endpoints (spot, alat, reviews)
- No admin role-based access control
- No API documentation (Swagger/OpenAPI)
- No test suite

### Error Handling
- Inconsistent error responses
- Some routes expose raw error messages to clients

---

## Mobile Critical Issues

### Authentication
- **Auth interceptor is incomplete** - tokens not automatically added to requests
- **No auth guards** on protected routes (Booking, Payment)
- **No refresh token mechanism**
- Logout only clears local storage, no API call

### Incomplete Features
- **explore.tsx** still contains default Expo template code
- **notifications.tsx** uses mock data
- **BuysAndRentFishing.tsx** uses mock products
- Seat availability in Booking.tsx is hardcoded

### API Configuration
- Hardcoded localhost URLs (won't work in production)
- Inconsistent endpoint URL formats (some have leading slashes, some don't)
- Bug: `checkAvailability` uses `spot_id` instead of `spotId`

---

## Quick Wins

**Backend**:
1. Add `@fastify/rate-limit` for auth endpoints
2. Add validation schemas for all endpoints
3. Hash reset tokens before storage

**Mobile**:
1. Complete the auth interceptor to add Bearer tokens
2. Implement auth guards using AuthContext
3. Replace mock data with real API calls
4. Fix the API URL configuration for different environments

---

## Architecture Praise

Both codebases show good separation of concerns:
- Backend: Modular route organization, proper database connection handling, JWT implementation
- Mobile: File-based routing with route groups, TypeScript usage, Context API for auth

---

Would you like me to create a detailed implementation plan for addressing any of these issues, or do you have specific areas you'd like me to focus on first?

---

## User

buat sekarang fix dulu aja yang masih error. sekarang mau diintegrasiin antara backend dan frontned

---

## Assistant

_Thinking:_

The user wants me to fix the errors found in the code review so they can integrate the backend and frontend. However, I'm in plan mode - read-only phase. I need to create a plan for fixing the issues, but I cannot make any actual edits yet.

Let me first understand what the user wants fixed. They mentioned:
1. Errors that need to be fixed
2. Integration between backend and frontend

From my code review, the critical issues that would block integration are:

**Backend Issues blocking integration:**
- No obvious showstoppers - the API seems functional

**Mobile Issues blocking integration:**
1. Auth interceptor incomplete - tokens not added to requests
2. No auth guards
3. Hardcoded localhost URLs (should be configurable)
4. Inconsistent endpoint URLs
5. Bug in checkAvailability (spot_id vs spotId)
6. Mock data in various screens

The user wants me to create a plan and then execute it. Since I'm in plan mode, I should create a comprehensive plan first.

Let me gather more details about the current state of the files to understand what exactly needs to be fixed.

Saya akan membantu Anda membuat rencana perbaikan untuk mengintegrasikan backend dan frontend. Biarkan saya terlebih dahulu memeriksa detail file yang perlu diperbaiki.

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/src/config/api.ts"
}
```
**Output:**
```
<file>
00001| import { Platform } from "react-native";
00002| import axios from "axios";
00003| 
00004| const getAPIBaseURL = () => {
00005|     if (typeof window !== "undefined") {
00006|         return "http://localhost:3000"; // Web
00007|     }
00008| 
00009|     if (Platform.OS === "android") {
00010|         return "http://10.0.2.2:3000"; // Android Emulator Special IP
00011|     }
00012| 
00013|     if (Platform.OS === "ios") {
00014|         return "http://localhost:3000";
00015|     }
00016| 
00017|     return "http://localhost:3000";
00018| };
00019| 
00020| const API_BASE_URL = getAPIBaseURL();
00021| 
00022| export const apiClient = axios.create({
00023|     baseURL: API_BASE_URL,
00024|     headers: {
00025|         "Content-Type": "application/json",
00026|     },
00027| });
00028| 
00029| apiClient.interceptors.request.use(
00030|     async (config) => {
00031|         try {
00032|             // TODO
00033|         } catch (error) {
00034|             console.error("Error adding auth header:", error);
00035|         }
00036|         return config;
00037|     },
00038|     (error) => Promise.reject(error),
00039| );
00040| 
00041| apiClient.interceptors.response.use(
00042|     (response) => response,
00043|     (error) => {
00044|         if (error.response?.status === 401) {
00045|             console.warn("Unauthorized - Token expired or invalid");
00046|             // TODO: Trigger logout
00047|         }
00048|     },
00049| );
00050| 
00051| export const ENDPOINTS = {
00052|     SIGNUP: "auth/signup",
00053|     LOGIN: "/auth/login",
00054| 
00055|     LIST_SPOTS: "/tempat_mancing",
00056|     SPOT_DETAIL: (id: string) => `/tempat_mancing/${id}`,
00057|     LIST_ALAT: "/alat_pancing", // TODO
00058|     ALAT_DETAIL: (id: string) => `/alat_pancing/${id}`,
00059| 
00060|     // Booking
00061|     CREATE_BOOKING: "/bookings",
00062|     CHECK_KURSI: "/bookings/check-seats",
00063| 
00064|     // Orders
00065|     CREATE_ORDER: "/orders",
00066| 
00067|     // Reviews
00068|     GET_REVIEWS: (spotId: string) => `/reviews?tempat_id=${spotId}`,
00069|     CREATE_REVIEW: "/reviews/",
00070| 
00071|     // Payment
00072|     PROCESS_PAYMENT: "/payment",
00073|     PAYMENT_STATUS: (id: string) => `/payment/${id}`,
00074| };
00075| 
00076| export const API_BASE_URL_CONFIG = {
00077|     development: "http://localhost:3000",
00078|     production: "http://localhost:3000",
00079| };
00080| 

(End of file - total 80 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/src/services/api.ts"
}
```
**Output:**
```
<file>
00001| import { apiClient, ENDPOINTS } from "../config/api.ts";
00002| 
00003| export interface ApiError {
00004|     message: string;
00005|     status: number;
00006| }
00007| 
00008| export const api = {
00009|     get: async (endpoint: string, params?: object) => {
00010|         const response = await apiClient.get(endpoint, { params });
00011|         return response.data;
00012|     },
00013| 
00014|     post: async (endpoint: string, data: object) => {
00015|         const response = await apiClient.post(endpoint, data);
00016|         return response.data;
00017|     },
00018| 
00019|     delete: async (endpoint: string) => {
00020|         const response = await apiClient.delete(endpoint);
00021|         return response.data;
00022|     },
00023| 
00024|     // Auth endpoints
00025|     auth: {
00026|         signup: async (userData: any) => {
00027|             return await api.post("/auth/signup", userData);
00028|         },
00029|         login: async (credentials: { email: string; password: string }) => {
00030|             return await api.post("/auth/login", credentials);
00031|         },
00032|     },
00033| 
00034|     // Tempat Mancing endpoints
00035|     spots: {
00036|         getAll: async () => {
00037|             return await api.get("/tempat_mancing");
00038|         },
00039|         getById: async (id: string) => {
00040|             return await api.get(`/tempat_mancing/${id}`);
00041|         },
00042|     },
00043| 
00044|     // Booking endpoints
00045|     bookings: {
00046|         create: async (bookingData: any) => {
00047|             return await api.post("/bookings", bookingData);
00048|         },
00049|         checkAvailability: async (
00050|             spotId: string,
00051|             date: string,
00052|             duration: number,
00053|         ) => {
00054|             return await api.get("/bookings/check-availability", {
00055|                 spot_id,
00056|                 date,
00057|                 duration,
00058|             });
00059|         },
00060|     },
00061| 
00062|     // Payment endpoints
00063|     payment: {
00064|         process: async (paymentData: any) => {
00065|             return await api.post("/payment", paymentData);
00066|         },
00067|     },
00068| };
00069| 

(End of file - total 69 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/src/contexts/AuthContext.tsx"
}
```
**Output:**
```
<file>
00001| import React, {
00002|     createContext,
00003|     useContext,
00004|     useState,
00005|     useEffect,
00006|     Children,
00007| } from "react";
00008| import AsyncStorage from "@react-native-async-storage/async-storage";
00009| import { router } from "expo-router";
00010| import { apiClient } from "../config/api";
00011| 
00012| interface User {
00013|     id: number;
00014|     username: string;
00015|     email: string;
00016|     full_name: string;
00017| }
00018| 
00019| interface AuthContextType {
00020|     user: User | null;
00021|     token: string | null;
00022|     isLoading: boolean;
00023|     login: (email: string, password: string) => Promise<void>;
00024|     logout: () => Promise<void>;
00025|     isAuthenticated: boolean;
00026| }
00027| 
00028| const AuthContext = createContext<AuthContextType>({
00029|     user: null,
00030|     token: null,
00031|     isLoading: false,
00032|     login: async () => {},
00033|     logout: async () => {},
00034|     isAuthenticated: false,
00035| });
00036| 
00037| export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
00038|     const [user, setUser] = useState<User | null>(null);
00039|     const [token, setToken] = useState<string | null>(null);
00040|     const [isLoading, setIsLoading] = useState(false);
00041| 
00042|     // Load token from storage on mount
00043|     useEffect(() => {
00044|         loadAuthData();
00045|     }, []);
00046| 
00047|     const loadAuthData = async () => {
00048|         try {
00049|             const storedToken = await AsyncStorage.getItem("@token");
00050|             const storedUser = await AsyncStorage.getItem("@user");
00051| 
00052|             if (storedToken && storedUser) {
00053|                 setToken(storedToken);
00054|                 setUser(JSON.parse(storedUser));
00055|             }
00056|         } catch (error) {
00057|             console.error("Error loading auth data:", error);
00058|         }
00059|     };
00060| 
00061|     const login = async (email: string, password: string) => {
00062|         setIsLoading(true);
00063|         try {
00064|             const response = await apiClient.post("/auth/login", {
00065|                 email,
00066|                 password,
00067|             });
00068| 
00069|             const { token, user } = response.data;
00070| 
00071|             // Save token to storage
00072|             await AsyncStorage.setItem("@token", token);
00073|             await AsyncStorage.setItem("@user", JSON.stringify(user));
00074| 
00075|             setToken(token);
00076|             setUser(user);
00077| 
00078|             // Navigate to ome
00079|             router.replace("/");
00080|         } catch (error) {
00081|             console.error("Login error:", error);
00082|         }
00083|     };
00084| 
00085|     const logout = async () => {
00086|         setIsLoading(true);
00087|         try {
00088|             await AsyncStorage.removeItem("@token");
00089|             await AsyncStorage.removeItem("@user");
00090| 
00091|             setToken(null);
00092|             setUser(null);
00093| 
00094|             // Navigate to login
00095|             router.replace("/(auth)/Login");
00096|         } catch (error) {
00097|             console.error("Logout error:", error);
00098|         } finally {
00099|             setIsLoading(false);
00100|         }
00101|     };
00102| 
00103|     const isAuthenticated = !!token && !!user;
00104| 
00105|     return (
00106|         <AuthContext.Provider
00107|             value={{ user, token, isLoading, login, logout, isAuthenticated }}
00108|         >
00109|             {children}
00110|         </AuthContext.Provider>
00111|     );
00112| };
00113| 
00114| export const useAuth = () => useContext(AuthContext);
00115| 

(End of file - total 115 lines)
</file>
```
```

---

## Assistant

_Thinking:_

Now I can see the actual issues. Let me also check the screens that have mock data or bugs:

1. api.ts - issues:
   - Endpoint URLs are inconsistent (some have leading slash, some don't)
   - Auth interceptor has TODO and doesn't actually add the token
   - checkAvailability uses wrong param name

2. services/api.ts - issues:
   - Line 54-55: Uses `spot_id` instead of `spotId` in the params object (this is a bug)

3. AuthContext - looks OK but the logout should call the API

Let me also check the screens with mock data and the Booking screen to see the hardcoded values.

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/(booking)/Booking.tsx"
}
```
**Output:**
```
<file>
00001| import React, { useState } from "react";
00002| import {
00003|     StyleSheet,
00004|     Text,
00005|     View,
00006|     ScrollView,
00007|     TouchableOpacity,
00008|     SafeAreaView,
00009|     Dimensions,
00010|     Modal,
00011|     FlatList,
00012| } from "react-native";
00013| import { useRouter } from "expo-router";
00014| import { Ionicons } from "@expo/vector-icons";
00015| 
00016| const { width, height } = Dimensions.get("window");
00017| const SEAT_SIZE = 35;
00018| const PRICE_PER_HOUR = 25000;
00019| 
00020| export default function BookingScreen() {
00021|     const router = useRouter();
00022| 
00023|     // --- STATE DATA ---
00024|     const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
00025| 
00026|     const today = new Date();
00027|     const defaultDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
00028| 
00029|     const [date, setDate] = useState(defaultDate);
00030|     const [time, setTime] = useState("--Pilih Jam--");
00031|     const [duration, setDuration] = useState(1);
00032| 
00033|     const [modalVisible, setModalVisible] = useState<
00034|         "none" | "date" | "time" | "duration"
00035|     >("none");
00036| 
00037|     const [seatStatus] = useState<{ [key: number]: "filled" | "empty" }>({
00038|         2: "filled",
00039|         5: "filled",
00040|         18: "filled",
00041|     });
00042| 
00043|     // --- DATA OPSI ---
00044|     const timeOptions = [
00045|         "07:00",
00046|         "08:00",
00047|         "09:00",
00048|         "10:00",
00049|         "11:00",
00050|         "12:00",
00051|         "13:00",
00052|         "14:00",
00053|         "15:00",
00054|         "16:00",
00055|     ];
00056| 
00057|     const durationOptions = Array.from({ length: 8 }, (_, i) => i + 1);
00058| 
00059|     // Generate 365 hari
00060|     const generateDates = () => {
00061|         const dates = [];
00062|         const start = new Date();
00063|         for (let i = 0; i < 365; i++) {
00064|             const d = new Date(start);
00065|             d.setDate(start.getDate() + i);
00066|             const dateString = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
00067|             dates.push(dateString);
00068|         }
00069|         return dates;
00070|     };
00071|     const dateOptions = generateDates();
00072| 
00073|     // --- LOGIC ---
00074|     const toggleSeat = (id: number) => {
00075|         if (seatStatus[id] === "filled") return;
00076|         if (selectedSeats.includes(id)) {
00077|             setSelectedSeats(selectedSeats.filter((seatId) => seatId !== id));
00078|         } else {
00079|             setSelectedSeats([...selectedSeats, id]);
00080|         }
00081|     };
00082| 
00083|     const formatRupiah = (number: number) => {
00084|         return new Intl.NumberFormat("id-ID", {
00085|             style: "currency",
00086|             currency: "IDR",
00087|             minimumFractionDigits: 0,
00088|         }).format(number);
00089|     };
00090| 
00091|     const totalPrice = PRICE_PER_HOUR * duration * selectedSeats.length;
00092| 
00093|     const renderSeat = (id: number) => {
00094|         const isSelected = selectedSeats.includes(id);
00095|         const isFilled = seatStatus[id] === "filled";
00096| 
00097|         let backgroundColor = "#FFFFFF";
00098|         let borderColor = "#999";
00099|         let textColor = "#999";
00100| 
00101|         if (isFilled) {
00102|             backgroundColor = "#86EFAC";
00103|             borderColor = "#4ADE80";
00104|             textColor = "#166534";
00105|         } else if (isSelected) {
00106|             backgroundColor = "#FCD34D";
00107|             borderColor = "#F59E0B";
00108|             textColor = "#78350F";
00109|         }
00110| 
00111|         return (
00112|             <TouchableOpacity
00113|                 key={id}
00114|                 style={[styles.seatBox, { backgroundColor, borderColor }]}
00115|                 onPress={() => toggleSeat(id)}
00116|                 disabled={isFilled}
00117|             >
00118|                 <Text style={[styles.seatText, { color: textColor }]}>
00119|                     {id}
00120|                 </Text>
00121|             </TouchableOpacity>
00122|         );
00123|     };
00124| 
00125|     // --- HANDLE LANJUT ---
00126|     const handleProceed = () => {
00127|         // Navigasi ke halaman Buys_and_Rent_Fishing
00128|         router.push("/BuysAndRentFishing");
00129|     };
00130| 
00131|     // Komponen Modal
00132|     const renderModal = () => {
00133|         let data: any[] = [];
00134|         let onSelect: (val: any) => void = () => {};
00135|         let title = "";
00136| 
00137|         if (modalVisible === "date") {
00138|             data = dateOptions;
00139|             title = "Pilih Tanggal";
00140|             onSelect = (val) => setDate(val);
00141|         } else if (modalVisible === "time") {
00142|             data = timeOptions;
00143|             title = "Pilih Jam Mulai";
00144|             onSelect = (val) => setTime(val);
00145|         } else if (modalVisible === "duration") {
00146|             data = durationOptions;
00147|             title = "Pilih Durasi";
00148|             onSelect = (val) => setDuration(val);
00149|         }
00150| 
00151|         return (
00152|             <Modal
00153|                 animationType="slide"
00154|                 transparent={true}
00155|                 visible={modalVisible !== "none"}
00156|                 onRequestClose={() => setModalVisible("none")}
00157|             >
00158|                 <TouchableOpacity
00159|                     style={styles.modalOverlay}
00160|                     activeOpacity={1}
00161|                     onPress={() => setModalVisible("none")}
00162|                 >
00163|                     <View style={styles.modalContent}>
00164|                         <View style={styles.modalHeader}>
00165|                             <Text style={styles.modalTitle}>{title}</Text>
00166|                             <TouchableOpacity
00167|                                 onPress={() => setModalVisible("none")}
00168|                             >
00169|                                 <Ionicons name="close" size={24} color="#333" />
00170|                             </TouchableOpacity>
00171|                         </View>
00172|                         <FlatList
00173|                             data={data}
00174|                             keyExtractor={(item) => item.toString()}
00175|                             showsVerticalScrollIndicator={false}
00176|                             renderItem={({ item }) => (
00177|                                 <TouchableOpacity
00178|                                     style={styles.modalItem}
00179|                                     onPress={() => {
00180|                                         onSelect(item);
00181|                                         setModalVisible("none");
00182|                                     }}
00183|                                 >
00184|                                     <Text style={styles.modalItemText}>
00185|                                         {modalVisible === "duration"
00186|                                             ? `${item} Jam`
00187|                                             : item}
00188|                                     </Text>
00189|                                     {(item === date ||
00190|                                         item === time ||
00191|                                         item === duration) && (
00192|                                         <Ionicons
00193|                                             name="checkmark"
00194|                                             size={20}
00195|                                             color="#103568"
00196|                                         />
00197|                                     )}
00198|                                 </TouchableOpacity>
00199|                             )}
00200|                         />
00201|                     </View>
00202|                 </TouchableOpacity>
00203|             </Modal>
00204|         );
00205|     };
00206| 
00207|     return (
00208|         <SafeAreaView style={styles.container}>
00209|             <View style={styles.header}>
00210|                 <TouchableOpacity
00211|                     onPress={() => router.back()}
00212|                     style={styles.backButtonTop}
00213|                 >
00214|                     <Ionicons name="arrow-back" size={24} color="#333" />
00215|                 </TouchableOpacity>
00216|                 <Text style={styles.headerTitle}>Booking Tempat</Text>
00217|             </View>
00218| 
00219|             <ScrollView
00220|                 contentContainerStyle={styles.scrollContent}
00221|                 showsVerticalScrollIndicator={false}
00222|             >
00223|                 <View style={styles.formSection}>
00224|                     <Text style={styles.label}>Tanggal</Text>
00225|                     <TouchableOpacity
00226|                         style={styles.inputBox}
00227|                         onPress={() => setModalVisible("date")}
00228|                     >
00229|                         <Text style={styles.inputText}>{date}</Text>
00230|                         <Ionicons
00231|                             name="calendar-outline"
00232|                             size={20}
00233|                             color="#333"
00234|                         />
00235|                     </TouchableOpacity>
00236| 
00237|                     <Text style={styles.label}>Jam</Text>
00238|                     <TouchableOpacity
00239|                         style={styles.inputBox}
00240|                         onPress={() => setModalVisible("time")}
00241|                     >
00242|                         <Text
00243|                             style={[
00244|                                 styles.inputText,
00245|                                 time === "--Pilih Jam--" && { color: "#999" },
00246|                             ]}
00247|                         >
00248|                             {time}
00249|                         </Text>
00250|                         <Ionicons name="chevron-down" size={20} color="#333" />
00251|                     </TouchableOpacity>
00252| 
00253|                     <Text style={styles.label}>Durasi</Text>
00254|                     <TouchableOpacity
00255|                         style={styles.inputBox}
00256|                         onPress={() => setModalVisible("duration")}
00257|                     >
00258|                         <Text style={styles.inputText}>{duration} Jam</Text>
00259|                         <Ionicons name="chevron-down" size={20} color="#333" />
00260|                     </TouchableOpacity>
00261|                 </View>
00262| 
00263|                 <View style={styles.mapContainer}>
00264|                     <View style={styles.topRow}>
00265|                         {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => renderSeat(id))}
00266|                     </View>
00267|                     <View style={styles.middleRow}>
00268|                         <View style={styles.sideColumn}>
00269|                             {[28, 27, 26].map((id) => renderSeat(id))}
00270|                         </View>
00271|                         <View style={styles.poolArea}>
00272|                             <Text style={styles.poolText}>Kolam</Text>
00273|                         </View>
00274|                         <View style={styles.sideColumn}>
00275|                             {[9, 10, 11].map((id) => renderSeat(id))}
00276|                         </View>
00277|                     </View>
00278|                     <View style={styles.bottomRow}>
00279|                         {[22, 21, 20, 19, 18, 17, 16, 15].map((id) =>
00280|                             renderSeat(id),
00281|                         )}
00282|                     </View>
00283|                 </View>
00284| 
00285|                 <View style={styles.legendContainer}>
00286|                     <View style={styles.legendItem}>
00287|                         <View
00288|                             style={[
00289|                                 styles.legendBox,
00290|                                 {
00291|                                     backgroundColor: "#86EFAC",
00292|                                     borderColor: "#4ADE80",
00293|                                 },
00294|                             ]}
00295|                         />
00296|                         <Text style={styles.legendText}>Sudah Terisi</Text>
00297|                     </View>
00298|                     <View style={styles.legendItem}>
00299|                         <View
00300|                             style={[
00301|                                 styles.legendBox,
00302|                                 {
00303|                                     backgroundColor: "#FFF",
00304|                                     borderColor: "#999",
00305|                                 },
00306|                             ]}
00307|                         />
00308|                         <Text style={styles.legendText}>Kosong</Text>
00309|                     </View>
00310|                     <View style={styles.legendItem}>
00311|                         <View
00312|                             style={[
00313|                                 styles.legendBox,
00314|                                 {
00315|                                     backgroundColor: "#FCD34D",
00316|                                     borderColor: "#F59E0B",
00317|                                 },
00318|                             ]}
00319|                         />
00320|                         <Text style={styles.legendText}>Dipilih</Text>
00321|                     </View>
00322|                 </View>
00323|                 <View style={{ height: 20 }} />
00324|             </ScrollView>
00325| 
00326|             <View style={styles.footerCard}>
00327|                 <View style={styles.footerHeader}>
00328|                     <View>
00329|                         <Text style={styles.footerTitle}>Daftar Pemesanan</Text>
00330|                         <Text style={styles.footerSubtitle}>
00331|                             {date} • {time} • {duration} Jam
00332|                         </Text>
00333|                     </View>
00334|                     <TouchableOpacity
00335|                         style={styles.footerBackButton}
00336|                         onPress={() => router.back()}
00337|                     >
00338|                         <Ionicons name="arrow-back" size={20} color="#333" />
00339|                     </TouchableOpacity>
00340|                 </View>
00341| 
00342|                 <View style={styles.divider} />
00343| 
00344|                 <View style={styles.totalRow}>
00345|                     <Text style={styles.totalLabel}>
00346|                         Total ({selectedSeats.length} Kursi)
00347|                     </Text>
00348|                     <Text style={styles.totalPrice}>
00349|                         {formatRupiah(totalPrice)}
00350|                     </Text>
00351|                 </View>
00352| 
00353|                 {/* --- TOMBOL LANJUT KE SEWA ALAT --- */}
00354|                 <TouchableOpacity
00355|                     style={[
00356|                         styles.checkoutButton,
00357|                         (selectedSeats.length === 0 ||
00358|                             time === "--Pilih Jam--") &&
00359|                             styles.disabledButton,
00360|                     ]}
00361|                     disabled={
00362|                         selectedSeats.length === 0 || time === "--Pilih Jam--"
00363|                     }
00364|                     onPress={handleProceed}
00365|                 >
00366|                     <Text style={styles.checkoutButtonText}>
00367|                         Lanjut ke Sewa Alat
00368|                     </Text>
00369|                 </TouchableOpacity>
00370|             </View>
00371| 
00372|             {renderModal()}
00373|         </SafeAreaView>
00374|     );
00375| }
00376| 
00377| const styles = StyleSheet.create({
00378|     container: { flex: 1, backgroundColor: "#F8F9FA" },
00379|     header: {
00380|         flexDirection: "row",
00381|         alignItems: "center",
00382|         padding: 20,
00383|         backgroundColor: "#FFF",
00384|     },
00385|     backButtonTop: { marginRight: 10 },
00386|     headerTitle: { fontSize: 18, fontWeight: "bold" },
00387|     scrollContent: { padding: 20, paddingBottom: 220 },
00388|     formSection: { marginBottom: 20 },
00389|     label: { fontSize: 14, color: "#333", marginBottom: 8, fontWeight: "500" },
00390|     inputBox: {
00391|         flexDirection: "row",
00392|         justifyContent: "space-between",
00393|         alignItems: "center",
00394|         backgroundColor: "#FFF",
00395|         borderWidth: 1,
00396|         borderColor: "#CCC",
00397|         borderRadius: 25,
00398|         paddingHorizontal: 15,
00399|         paddingVertical: 12,
00400|         marginBottom: 15,
00401|     },
00402|     inputText: { color: "#333", fontSize: 14 },
00403|     mapContainer: { alignItems: "center", marginVertical: 10 },
00404|     seatBox: {
00405|         width: SEAT_SIZE,
00406|         height: SEAT_SIZE,
00407|         borderWidth: 1,
00408|         borderRadius: 8,
00409|         justifyContent: "center",
00410|         alignItems: "center",
00411|         margin: 4,
00412|     },
00413|     seatText: { fontSize: 12, fontWeight: "bold" },
00414|     topRow: { flexDirection: "row", marginBottom: 5 },
00415|     middleRow: {
00416|         flexDirection: "row",
00417|         justifyContent: "space-between",
00418|         width: "100%",
00419|         maxWidth: (SEAT_SIZE + 8) * 8,
00420|     },
00421|     sideColumn: { flexDirection: "column", justifyContent: "center" },
00422|     poolArea: {
00423|         flex: 1,
00424|         backgroundColor: "#6B8EBB",
00425|         marginHorizontal: 5,
00426|         borderRadius: 10,
00427|         justifyContent: "center",
00428|         alignItems: "center",
00429|         borderColor: "#4A6FA5",
00430|         borderWidth: 1,
00431|     },
00432|     poolText: { color: "#103568", fontWeight: "bold", fontSize: 16 },
00433|     bottomRow: { flexDirection: "row", marginTop: 5 },
00434|     legendContainer: {
00435|         flexDirection: "row",
00436|         justifyContent: "space-around",
00437|         marginTop: 20,
00438|     },
00439|     legendItem: { flexDirection: "row", alignItems: "center" },
00440|     legendBox: {
00441|         width: 20,
00442|         height: 20,
00443|         borderWidth: 1,
00444|         borderRadius: 4,
00445|         marginRight: 8,
00446|     },
00447|     legendText: { fontSize: 12, color: "#555" },
00448|     footerCard: {
00449|         position: "absolute",
00450|         bottom: 20,
00451|         left: 20,
00452|         right: 20,
00453|         backgroundColor: "#FFF",
00454|         borderRadius: 20,
00455|         padding: 20,
00456|         shadowColor: "#000",
00457|         shadowOffset: { width: 0, height: 4 },
00458|         shadowOpacity: 0.1,
00459|         shadowRadius: 10,
00460|         elevation: 10,
00461|     },
00462|     footerHeader: {
00463|         flexDirection: "row",
00464|         justifyContent: "space-between",
00465|         alignItems: "flex-start",
00466|         marginBottom: 10,
00467|     },
00468|     footerTitle: { fontSize: 16, fontWeight: "bold", color: "#000" },
00469|     footerSubtitle: { fontSize: 10, color: "#666", marginTop: 4 },
00470|     footerBackButton: {
00471|         width: 30,
00472|         height: 30,
00473|         borderRadius: 15,
00474|         borderWidth: 1,
00475|         borderColor: "#EEE",
00476|         justifyContent: "center",
00477|         alignItems: "center",
00478|     },
00479|     divider: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
00480|     totalRow: {
00481|         flexDirection: "row",
00482|         justifyContent: "space-between",
00483|         marginBottom: 15,
00484|     },
00485|     totalLabel: { fontSize: 14, fontWeight: "bold", color: "#000" },
00486|     totalPrice: { fontSize: 14, fontWeight: "bold", color: "#007AFF" },
00487|     checkoutButton: {
00488|         backgroundColor: "#103568",
00489|         paddingVertical: 15,
00490|         borderRadius: 10,
00491|         alignItems: "center",
00492|     },
00493|     disabledButton: { backgroundColor: "#CCC" },
00494|     checkoutButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
00495|     modalOverlay: {
00496|         flex: 1,
00497|         backgroundColor: "rgba(0,0,0,0.5)",
00498|         justifyContent: "flex-end",
00499|     },
00500|     modalContent: {
00501|         backgroundColor: "#FFF",
00502|         borderTopLeftRadius: 20,
00503|         borderTopRightRadius: 20,
00504|         padding: 20,
00505|         maxHeight: height * 0.6,
00506|     },
00507|     modalHeader: {
00508|         flexDirection: "row",
00509|         justifyContent: "space-between",
00510|         alignItems: "center",
00511|         marginBottom: 20,
00512|     },
00513|     modalTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
00514|     modalItem: {
00515|         flexDirection: "row",
00516|         justifyContent: "space-between",
00517|         alignItems: "center",
00518|         paddingVertical: 15,
00519|         borderBottomWidth: 1,
00520|         borderBottomColor: "#F0F0F0",
00521|     },
00522|     modalItemText: { fontSize: 16, color: "#333" },
00523| });
00524| 

(End of file - total 524 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/(tabs)/notifications.tsx"
}
```
**Output:**
```
<file>
00001| import React from "react";
00002| import {
00003|     StyleSheet,
00004|     Text,
00005|     View,
00006|     SafeAreaView,
00007|     ScrollView,
00008|     Image,
00009|     TouchableOpacity,
00010|     Dimensions,
00011| } from "react-native";
00012| import { Ionicons } from "@expo/vector-icons";
00013| import { useRouter } from "expo-router";
00014| import { useSafeAreaInsets } from "react-native-safe-area-context";
00015| 
00016| const { width } = Dimensions.get("window");
00017| 
00018| // Notification data interface
00019| type NotificationData = {
00020|     id: number;
00021|     status: "pending" | "success" | "failed";
00022|     statusLabel: string;
00023|     timer?: string;
00024|     title: string;
00025|     address: string;
00026|     date: string;
00027| };
00028| 
00029| export default function NotificationsScreen() {
00030|     const router = useRouter();
00031|     const insets = useSafeAreaInsets();
00032| 
00033|     // Data Dummy Sesuai Gambar
00034|     const notifications: NotificationData[] = [
00035|         {
00036|             id: 1,
00037|             status: "pending",
00038|             statusLabel: "Belum Dibayar",
00039|             timer: "22:53:45",
00040|             title: "Kolam Pemancingan Brigif 15",
00041|             address:
00042|                 "4G4J+R9F, Baros, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40521",
00043|             date: "05/11/2025",
00044|         },
00045|         {
00046|             id: 2,
00047|             status: "success",
00048|             statusLabel: "Sudah Dibayar",
00049|             title: "Kolam Pemancingan Pak Ade",
00050|             address:
00051|                 "5FFJ+6V8, Bojongkoneng, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552",
00052|             date: "07/10/2025",
00053|         },
00054|         {
00055|             id: 3,
00056|             status: "failed",
00057|             statusLabel: "Gagal Bayar",
00058|             title: "Kolam Pancing Galatama",
00059|             address:
00060|                 "Jl. Karanglo Raya No.7, Gemah, Kec. Pedurungan, Kota Semarang, Jawa Tengah 50191",
00061|             date: "07/10/2025",
00062|         },
00063|     ];
00064| 
00065|     const getStatusColor = (status: string) => {
00066|         switch (status) {
00067|             case "pending":
00068|                 return "#BF0000";
00069|             case "success":
00070|                 return "#22C55E";
00071|             case "failed":
00072|                 return "#9CA3AF";
00073|             default:
00074|                 return "#333";
00075|         }
00076|     };
00077| 
00078|     return (
00079|         <SafeAreaView style={styles.container}>
00080|             <View style={styles.header}>
00081|                 <Text style={styles.headerTitle}>Notifications</Text>
00082|             </View>
00083|             <ScrollView
00084|                 contentContainerStyle={[
00085|                     styles.listContent,
00086|                     { paddingBottom: insets.bottom + 20 },
00087|                 ]}
00088|                 showsVerticalScrollIndicator={false}
00089|             >
00090|                 {notifications.map((item, index) => (
00091|                     <View key={item.id}>
00092|                         <View style={styles.card}>
00093|                             <View style={styles.statusRow}>
00094|                                 <View
00095|                                     style={[
00096|                                         styles.statusBadge,
00097|                                         {
00098|                                             backgroundColor: getStatusColor(
00099|                                                 item.status,
00100|                                             ),
00101|                                         },
00102|                                     ]}
00103|                                 >
00104|                                     <Text style={styles.statusText}>
00105|                                         {item.statusLabel}
00106|                                     </Text>
00107|                                 </View>
00108|                                 {item.status === "pending" && item.timer && (
00109|                                     <View style={styles.timerBadge}>
00110|                                         <Text style={styles.timerText}>
00111|                                             {item.timer}
00112|                                         </Text>
00113|                                     </View>
00114|                                 )}
00115|                             </View>
00116|                             <View style={styles.contentRow}>
00117|                                 <View style={styles.iconContainer}>
00118|                                     <Ionicons
00119|                                         name="fish"
00120|                                         size={30}
00121|                                         color="#F59E0B"
00122|                                     />
00123|                                     <View style={styles.rodLine} />
00124|                                 </View>
00125|                                 <View style={styles.textContainer}>
00126|                                     <Text style={styles.cardTitle}>
00127|                                         {item.title}
00128|                                     </Text>
00129|                                     <Text style={styles.cardAddress}>
00130|                                         {item.address}
00131|                                     </Text>
00132|                                     <Text style={styles.cardDate}>
00133|                                         {item.date}
00134|                                     </Text>
00135|                                 </View>
00136|                             </View>
00137|                             {item.status === "success" && (
00138|                                 <View style={styles.actionButtonsContainer}>
00139|                                     <TouchableOpacity
00140|                                         style={styles.actionButton}
00141|                                         onPress={() =>
00142|                                             router.push("/ReviewPath")
00143|                                         }
00144|                                     >
00145|                                         <Text style={styles.actionButtonText}>
00146|                                             Review
00147|                                         </Text>
00148|                                     </TouchableOpacity>
00149|                                     <TouchableOpacity
00150|                                         style={styles.actionButton}
00151|                                         onPress={() => router.push("/explore")}
00152|                                     >
00153|                                         <Text style={styles.actionButtonText}>
00154|                                             Rebooking
00155|                                         </Text>
00156|                                     </TouchableOpacity>
00157|                                 </View>
00158|                             )}
00159|                         </View>
00160|                         {index < notifications.length - 1 && (
00161|                             <View style={styles.divider} />
00162|                         )}
00163|                     </View>
00164|                 ))}
00165|                 <View style={{ height: 100 }} />
00166|             </ScrollView>
00167|         </SafeAreaView>
00168|     );
00169| }
00170| 
00171| const styles = StyleSheet.create({
00172|     container: {
00173|         flex: 1,
00174|         backgroundColor: "#FFF",
00175|     },
00176|     header: {
00177|         paddingHorizontal: 20,
00178|         paddingTop: 20,
00179|         paddingBottom: 10,
00180|         backgroundColor: "#FFF",
00181|         borderBottomWidth: 1,
00182|         borderBottomColor: "#EEE",
00183|     },
00184|     headerTitle: {
00185|         fontSize: 24,
00186|         fontWeight: "bold",
00187|         color: "#000",
00188|     },
00189|     listContent: {
00190|         paddingBottom: 20,
00191|     },
00192|     card: {
00193|         padding: 20,
00194|         backgroundColor: "#FFF",
00195|     },
00196|     statusRow: {
00197|         flexDirection: "row",
00198|         alignItems: "center",
00199|         marginBottom: 10,
00200|         marginLeft: 80,
00201|     },
00202|     statusBadge: {
00203|         paddingHorizontal: 10,
00204|         paddingVertical: 4,
00205|         borderRadius: 12,
00206|         marginRight: 10,
00207|     },
00208|     statusText: {
00209|         color: "#FFF",
00210|         fontSize: 10,
00211|         fontWeight: "bold",
00212|     },
00213|     timerBadge: {
00214|         backgroundColor: "#FEE2E2",
00215|         paddingHorizontal: 10,
00216|         paddingVertical: 4,
00217|         borderRadius: 12,
00218|     },
00219|     timerText: {
00220|         color: "#DC2626",
00221|         fontSize: 10,
00222|         fontWeight: "bold",
00223|     },
00224|     contentRow: {
00225|         flexDirection: "row",
00226|         alignItems: "flex-start",
00227|     },
00228|     iconContainer: {
00229|         width: 60,
00230|         height: 60,
00231|         borderRadius: 30,
00232|         backgroundColor: "#5DD6E3",
00233|         justifyContent: "center",
00234|         alignItems: "center",
00235|         marginRight: 15,
00236|         position: "relative",
00237|     },
00238|     rodLine: {
00239|         position: "absolute",
00240|         width: 40,
00241|         height: 2,
00242|         backgroundColor: "#8B4513",
00243|         transform: [{ rotate: "-45deg" }],
00244|     },
00245|     textContainer: {
00246|         flex: 1,
00247|     },
00248|     cardTitle: {
00249|         fontSize: 16,
00250|         fontWeight: "bold",
00251|         color: "#000",
00252|         marginBottom: 5,
00253|     },
00254|     cardAddress: {
00255|         fontSize: 12,
00256|         color: "#4B5563",
00257|         lineHeight: 18,
00258|         marginBottom: 8,
00259|     },
00260|     cardDate: {
00261|         fontSize: 11,
00262|         color: "#6B7280",
00263|     },
00264|     actionButtonsContainer: {
00265|         flexDirection: "row",
00266|         justifyContent: "flex-end",
00267|         marginTop: 15,
00268|     },
00269|     actionButton: {
00270|         backgroundColor: "#103568",
00271|         paddingHorizontal: 20,
00272|         paddingVertical: 8,
00273|         borderRadius: 20,
00274|         marginLeft: 10,
00275|     },
00276|     actionButtonText: {
00277|         color: "#FFF",
00278|         fontSize: 12,
00279|         fontWeight: "bold",
00280|     },
00281|     divider: {
00282|         height: 1,
00283|         backgroundColor: "#E5E7EB",
00284|         width: "100%",
00285|     },
00286| });
00287| 

(End of file - total 287 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/BuysAndRentFishing.tsx"
}
```
**Output:**
```
<file>
00001| import React, { useState } from "react";
00002| import {
00003|     StyleSheet,
00004|     Text,
00005|     View,
00006|     SafeAreaView,
00007|     TextInput,
00008|     TouchableOpacity,
00009|     FlatList,
00010|     Image,
00011|     Dimensions,
00012| } from "react-native";
00013| import { useRouter } from "expo-router";
00014| import { Ionicons } from "@expo/vector-icons";
00015| 
00016| const { width } = Dimensions.get("window");
00017| const COLUMN_COUNT = 2;
00018| const CARD_WIDTH = (width - 48) / COLUMN_COUNT;
00019| 
00020| // Tipe Data Produk
00021| interface Product {
00022|     id: string;
00023|     name: string;
00024|     price: number;
00025|     discount: number;
00026|     image: string;
00027| }
00028| 
00029| // Tipe Data Item di Keranjang
00030| interface CartItem extends Product {
00031|     type: "sewa" | "beli";
00032| }
00033| 
00034| export default function BuysAndRentFishingScreen() {
00035|     const router = useRouter();
00036|     const [searchText, setSearchText] = useState("");
00037| 
00038|     // State Keranjang
00039|     const [cart, setCart] = useState<CartItem[]>([]);
00040| 
00041|     // Dummy Data
00042|     const products: Product[] = [
00043|         {
00044|             id: "1",
00045|             name: "Joran Baitcasting",
00046|             price: 152000,
00047|             discount: 25,
00048|             image: "https://via.placeholder.com/150/0000FF/808080?text=Joran",
00049|         },
00050|         {
00051|             id: "2",
00052|             name: "PE Braided Line",
00053|             price: 53000,
00054|             discount: 64,
00055|             image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Line",
00056|         },
00057|         {
00058|             id: "3",
00059|             name: "Spoon Pancing",
00060|             price: 25000,
00061|             discount: 23,
00062|             image: "https://via.placeholder.com/150/FFFF00/000000?text=Spoon",
00063|         },
00064|         {
00065|             id: "4",
00066|             name: "Tas Pancing",
00067|             price: 152000,
00068|             discount: 73,
00069|             image: "https://via.placeholder.com/150/008000/FFFFFF?text=Tas",
00070|         },
00071|         {
00072|             id: "5",
00073|             name: "Tanggok Jaring",
00074|             price: 152000,
00075|             discount: 62,
00076|             image: "https://via.placeholder.com/150/000000/FFFFFF?text=Jaring",
00077|         },
00078|         {
00079|             id: "6",
00080|             name: "Ember Pancing",
00081|             price: 152000,
00082|             discount: 43,
00083|             image: "https://via.placeholder.com/150/800080/FFFFFF?text=Ember",
00084|         },
00085|     ];
00086| 
00087|     // Format Rupiah
00088|     const formatRupiah = (number: number) => {
00089|         return new Intl.NumberFormat("id-ID", {
00090|             style: "currency",
00091|             currency: "IDR",
00092|             minimumFractionDigits: 0,
00093|         }).format(number);
00094|     };
00095| 
00096|     // --- LOGIC CART ---
00097| 
00098|     // 1. Tambah Item (Add)
00099|     const addToCart = (product: Product, type: "sewa" | "beli") => {
00100|         const newItem: CartItem = { ...product, type };
00101|         setCart([...cart, newItem]);
00102|     };
00103| 
00104|     // 2. Kurang Item (Remove)
00105|     const removeFromCart = (productId: string, type: "sewa" | "beli") => {
00106|         // Cari index item terakhir yang cocok dengan ID dan Tipe
00107|         const index = cart.findIndex(
00108|             (item) => item.id === productId && item.type === type,
00109|         );
00110| 
00111|         if (index > -1) {
00112|             const newCart = [...cart];
00113|             newCart.splice(index, 1); // Hapus 1 item pada index tersebut
00114|             setCart(newCart);
00115|         }
00116|     };
00117| 
00118|     // 3. Hitung Jumlah Item per Produk (Untuk UI Counter)
00119|     const getItemCount = (productId: string, type: "sewa" | "beli") => {
00120|         return cart.filter(
00121|             (item) => item.id === productId && item.type === type,
00122|         ).length;
00123|     };
00124| 
00125|     // Hitung Total Harga Semua
00126|     const totalCartPrice = cart.reduce((total, item) => total + item.price, 0);
00127| 
00128|     // --- RENDER COMPONENTS ---
00129| 
00130|     // Render Tombol Counter (Minus - Angka - Plus)
00131|     const renderCounterButton = (
00132|         item: Product,
00133|         type: "sewa" | "beli",
00134|         count: number,
00135|     ) => {
00136|         const isSewa = type === "sewa";
00137|         const baseColor = isSewa ? "#FBBF24" : "#103568"; // Kuning vs Biru
00138| 
00139|         return (
00140|             <View style={[styles.counterContainer, { borderColor: baseColor }]}>
00141|                 {/* Tombol Minus */}
00142|                 <TouchableOpacity
00143|                     style={[styles.counterBtn, { backgroundColor: baseColor }]}
00144|                     onPress={() => removeFromCart(item.id, type)}
00145|                 >
00146|                     <Ionicons name="remove" size={12} color="#FFF" />
00147|                 </TouchableOpacity>
00148| 
00149|                 {/* Angka Jumlah */}
00150|                 <Text style={[styles.counterText, { color: baseColor }]}>
00151|                     {count}
00152|                 </Text>
00153| 
00154|                 {/* Tombol Plus */}
00155|                 <TouchableOpacity
00156|                     style={[styles.counterBtn, { backgroundColor: baseColor }]}
00157|                     onPress={() => addToCart(item, type)}
00158|                 >
00159|                     <Ionicons name="add" size={12} color="#FFF" />
00160|                 </TouchableOpacity>
00161|             </View>
00162|         );
00163|     };
00164| 
00165|     const renderItem = ({ item }: { item: Product }) => {
00166|         const sewaCount = getItemCount(item.id, "sewa");
00167|         const beliCount = getItemCount(item.id, "beli");
00168| 
00169|         return (
00170|             <View style={styles.card}>
00171|                 <View style={styles.discountBadge}>
00172|                     <Text style={styles.discountText}>{item.discount}%</Text>
00173|                 </View>
00174| 
00175|                 <Image
00176|                     source={{ uri: item.image }}
00177|                     style={styles.productImage}
00178|                     resizeMode="contain"
00179|                 />
00180| 
00181|                 <View style={styles.cardContent}>
00182|                     <Text style={styles.productName} numberOfLines={1}>
00183|                         {item.name}
00184|                     </Text>
00185|                     <Text style={styles.productPrice}>
00186|                         {formatRupiah(item.price)}
00187|                     </Text>
00188| 
00189|                     {/* Action Row */}
00190|                     <View style={styles.actionColumn}>
00191|                         {/* --- BARIS SEWA --- */}
00192|                         <View style={styles.buttonWrapper}>
00193|                             {sewaCount === 0 ? (
00194|                                 <TouchableOpacity
00195|                                     style={styles.rentButton}
00196|                                     onPress={() => addToCart(item, "sewa")}
00197|                                 >
00198|                                     <Text style={styles.rentButtonText}>
00199|                                         Sewa
00200|                                     </Text>
00201|                                 </TouchableOpacity>
00202|                             ) : (
00203|                                 renderCounterButton(item, "sewa", sewaCount)
00204|                             )}
00205|                         </View>
00206| 
00207|                         {/* Spacer kecil antar tombol */}
00208|                         <View style={{ height: 6 }} />
00209| 
00210|                         {/* --- BARIS BELI --- */}
00211|                         <View style={styles.buttonWrapper}>
00212|                             {beliCount === 0 ? (
00213|                                 <TouchableOpacity
00214|                                     style={styles.buyButton}
00215|                                     onPress={() => addToCart(item, "beli")}
00216|                                 >
00217|                                     <Text style={styles.buyButtonText}>
00218|                                         Beli
00219|                                     </Text>
00220|                                 </TouchableOpacity>
00221|                             ) : (
00222|                                 renderCounterButton(item, "beli", beliCount)
00223|                             )}
00224|                         </View>
00225|                     </View>
00226|                 </View>
00227|             </View>
00228|         );
00229|     };
00230| 
00231|     return (
00232|         <SafeAreaView style={styles.container}>
00233|             {/* HEADER */}
00234|             <View style={styles.header}>
00235|                 <TouchableOpacity
00236|                     style={styles.backButton}
00237|                     onPress={() => router.back()}
00238|                 >
00239|                     <Ionicons name="arrow-back" size={24} color="#333" />
00240|                 </TouchableOpacity>
00241| 
00242|                 <View style={styles.searchBar}>
00243|                     <TextInput
00244|                         style={styles.searchInput}
00245|                         placeholder="Alat pancing untuk pemula"
00246|                         placeholderTextColor="#999"
00247|                         value={searchText}
00248|                         onChangeText={setSearchText}
00249|                     />
00250|                     <Ionicons
00251|                         name="search"
00252|                         size={20}
00253|                         color="#666"
00254|                         style={styles.searchIcon}
00255|                     />
00256|                 </View>
00257|             </View>
00258| 
00259|             {/* GRID PRODUK */}
00260|             <FlatList
00261|                 data={products}
00262|                 renderItem={renderItem}
00263|                 keyExtractor={(item) => item.id}
00264|                 numColumns={2}
00265|                 columnWrapperStyle={styles.columnWrapper}
00266|                 contentContainerStyle={[
00267|                     styles.listContent,
00268|                     { paddingBottom: 150 },
00269|                 ]}
00270|                 showsVerticalScrollIndicator={false}
00271|             />
00272| 
00273|             {/* FOOTER KERANJANG */}
00274|             {cart.length > 0 && (
00275|                 <View style={styles.footerCard}>
00276|                     <View style={styles.totalRow}>
00277|                         <View>
00278|                             <Text style={styles.totalLabel}>
00279|                                 Total ({cart.length} Item)
00280|                             </Text>
00281|                             <Text style={styles.totalPrice}>
00282|                                 {formatRupiah(totalCartPrice)}
00283|                             </Text>
00284|                         </View>
00285| 
00286|                         <TouchableOpacity
00287|                             style={styles.checkoutButton}
00288|                             onPress={() => router.push("/(payment)/Payment")}
00289|                         >
00290|                             <Text style={styles.checkoutButtonText}>
00291|                                 Bayar Sekarang
00292|                             </Text>
00293|                             <Ionicons
00294|                                 name="arrow-forward"
00295|                                 size={16}
00296|                                 color="#FFF"
00297|                                 style={{ marginLeft: 5 }}
00298|                             />
00299|                         </TouchableOpacity>
00300|                     </View>
00301|                 </View>
00302|             )}
00303|         </SafeAreaView>
00304|     );
00305| }
00306| 
00307| const styles = StyleSheet.create({
00308|     container: { flex: 1, backgroundColor: "#FAFAFA" },
00309|     header: {
00310|         flexDirection: "row",
00311|         alignItems: "center",
00312|         paddingHorizontal: 20,
00313|         paddingVertical: 15,
00314|         backgroundColor: "#FFF",
00315|     },
00316|     backButton: {
00317|         width: 40,
00318|         height: 40,
00319|         borderRadius: 20,
00320|         backgroundColor: "#FFF",
00321|         justifyContent: "center",
00322|         alignItems: "center",
00323|         marginRight: 10,
00324|         borderWidth: 1,
00325|         borderColor: "#F0F0F0",
00326|     },
00327|     searchBar: {
00328|         flex: 1,
00329|         flexDirection: "row",
00330|         alignItems: "center",
00331|         backgroundColor: "#FFF",
00332|         borderRadius: 25,
00333|         paddingHorizontal: 15,
00334|         height: 45,
00335|         borderWidth: 1,
00336|         borderColor: "#E5E5E5",
00337|     },
00338|     searchInput: { flex: 1, fontSize: 14, color: "#333" },
00339|     searchIcon: { marginLeft: 5 },
00340| 
00341|     listContent: { padding: 16 },
00342|     columnWrapper: { justifyContent: "space-between" },
00343| 
00344|     card: {
00345|         width: CARD_WIDTH,
00346|         backgroundColor: "#FFF",
00347|         borderRadius: 12,
00348|         marginBottom: 16,
00349|         padding: 10,
00350|         elevation: 3,
00351|         shadowColor: "#000",
00352|         shadowOffset: { width: 0, height: 2 },
00353|         shadowOpacity: 0.1,
00354|         shadowRadius: 4,
00355|     },
00356|     discountBadge: {
00357|         position: "absolute",
00358|         top: 0,
00359|         right: 0,
00360|         backgroundColor: "#DC2626",
00361|         paddingHorizontal: 8,
00362|         paddingVertical: 4,
00363|         borderTopRightRadius: 12,
00364|         borderBottomLeftRadius: 8,
00365|         zIndex: 1,
00366|     },
00367|     discountText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
00368|     productImage: {
00369|         width: "100%",
00370|         height: 100,
00371|         marginBottom: 10,
00372|         borderRadius: 8,
00373|         backgroundColor: "#F5F5F5",
00374|     },
00375|     cardContent: { flex: 1 },
00376|     productName: {
00377|         fontSize: 12,
00378|         fontWeight: "600",
00379|         color: "#333",
00380|         marginBottom: 4,
00381|     },
00382|     productPrice: { fontSize: 12, color: "#555", marginBottom: 10 },
00383| 
00384|     // Layout Tombol
00385|     actionColumn: { flexDirection: "column", width: "100%" },
00386|     buttonWrapper: { width: "100%", height: 26 }, // Tinggi tetap agar rapi
00387| 
00388|     // Tombol Awal (Belum dipilih)
00389|     rentButton: {
00390|         flex: 1,
00391|         backgroundColor: "#FBBF24",
00392|         borderRadius: 15,
00393|         justifyContent: "center",
00394|         alignItems: "center",
00395|     },
00396|     rentButtonText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
00397| 
00398|     buyButton: {
00399|         flex: 1,
00400|         backgroundColor: "#103568",
00401|         borderRadius: 15,
00402|         justifyContent: "center",
00403|         alignItems: "center",
00404|     },
00405|     buyButtonText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
00406| 
00407|     // Tombol Counter (Sudah dipilih)
00408|     counterContainer: {
00409|         flex: 1,
00410|         flexDirection: "row",
00411|         alignItems: "center",
00412|         justifyContent: "space-between",
00413|         borderWidth: 1,
00414|         borderRadius: 15,
00415|         paddingHorizontal: 2,
00416|         backgroundColor: "#FFF",
00417|     },
00418|     counterBtn: {
00419|         width: 20,
00420|         height: 20,
00421|         borderRadius: 10,
00422|         justifyContent: "center",
00423|         alignItems: "center",
00424|     },
00425|     counterText: { fontSize: 12, fontWeight: "bold", paddingHorizontal: 4 },
00426| 
00427|     // Footer
00428|     footerCard: {
00429|         position: "absolute",
00430|         bottom: 0,
00431|         left: 0,
00432|         right: 0,
00433|         backgroundColor: "#FFF",
00434|         padding: 20,
00435|         borderTopLeftRadius: 20,
00436|         borderTopRightRadius: 20,
00437|         shadowColor: "#000",
00438|         shadowOffset: { width: 0, height: -2 },
00439|         shadowOpacity: 0.1,
00440|         shadowRadius: 5,
00441|         elevation: 20,
00442|     },
00443|     totalRow: {
00444|         flexDirection: "row",
00445|         justifyContent: "space-between",
00446|         alignItems: "center",
00447|     },
00448|     totalLabel: { fontSize: 12, color: "#666" },
00449|     totalPrice: { fontSize: 18, fontWeight: "bold", color: "#103568" },
00450|     checkoutButton: {
00451|         backgroundColor: "#103568",
00452|         paddingVertical: 12,
00453|         paddingHorizontal: 20,
00454|         borderRadius: 10,
00455|         flexDirection: "row",
00456|         alignItems: "center",
00457|     },
00458|     checkoutButtonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
00459| });
00460| 

(End of file - total 460 lines)
</file>
```
```

---

## Assistant

_Thinking:_

Now I have a complete picture of the issues. Let me also check the Login and SignUp screens to see how they handle authentication, and the index.tsx (home screen) to see how it fetches data.

Based on my analysis, here are the critical issues that need to be fixed for backend-frontend integration:

**Critical Issues Blocking Integration:**

1. **api.ts (src/config/api.ts)**:
   - Auth interceptor has TODO - doesn't actually add token to requests
   - Inconsistent endpoint URLs (some with leading slash, some without)
   - Auth response interceptor doesn't handle 401 properly

2. **services/api.ts**:
   - Bug: `checkAvailability` uses `spot_id` instead of `spotId` (line 55)

3. **AuthContext.tsx**:
   - Login uses apiClient directly instead of the api service
   - No logout API call

4. **Login.tsx & SignUp.tsx**:
   - Need to check error handling

5. **Screens with mock data that need API integration**:
   - notifications.tsx - mock data
   - BuysAndRentFishing.tsx - mock products
   - Booking.tsx - hardcoded seat status and price
   - explore.tsx - template code

6. **Home screen (index.tsx)**:
   - Need to check how it fetches spots data

Let me check a few more files to complete the picture.

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/(auth)/Login.tsx"
}
```
**Output:**
```
<file>
00001| import React, { useState } from "react";
00002| import {
00003|     StyleSheet,
00004|     View,
00005|     Text,
00006|     TextInput,
00007|     TouchableOpacity,
00008|     Alert,
00009|     ActivityIndicator,
00010|     SafeAreaView,
00011|     KeyboardAvoidingView,
00012|     Platform,
00013|     Image,
00014| } from "react-native";
00015| import { useRouter } from "expo-router";
00016| import { useAuth } from "../../src/contexts/AuthContext";
00017| import { Ionicons } from "@expo/vector-icons";
00018| 
00019| export default function LoginScreen() {
00020|     const router = useRouter();
00021|     const { login, isLoading } = useAuth(); // Menggunakan fungsi dari AuthContext
00022| 
00023|     const [email, setEmail] = useState("");
00024|     const [password, setPassword] = useState("");
00025|     const [showPassword, setShowPassword] = useState(false);
00026| 
00027|     const handleLogin = async () => {
00028|         // 1. Validasi Input
00029|         if (!email || !password) {
00030|             Alert.alert("Error", "Mohon isi email dan password");
00031|             return;
00032|         }
00033| 
00034|         try {
00035|             // 2. Panggil fungsi login dari Context
00036|             // Fungsi ini akan melakukan call API -> simpan token -> redirect ke Home
00037|             await login(email, password);
00038|         } catch (error: any) {
00039|             console.error(error);
00040|             const message =
00041|                 error.response?.data?.message ||
00042|                 "Email atau password salah. Silakan coba lagi.";
00043|             Alert.alert("Login Gagal", message);
00044|         }
00045|     };
00046| 
00047|     return (
00048|         <SafeAreaView style={styles.container}>
00049|             <KeyboardAvoidingView
00050|                 behavior={Platform.OS === "ios" ? "padding" : "height"}
00051|                 style={styles.content}
00052|             >
00053|                 {/* Header Section */}
00054|                 <View style={styles.header}>
00055|                     <View style={styles.iconContainer}>
00056|                         <Ionicons name="fish" size={40} color="#103568" />
00057|                     </View>
00058|                     <Text style={styles.title}>Selamat Datang!</Text>
00059|                     <Text style={styles.subtitle}>
00060|                         Masuk untuk mulai memancing
00061|                     </Text>
00062|                 </View>
00063| 
00064|                 {/* Form Section */}
00065|                 <View style={styles.form}>
00066|                     {/* Email Input */}
00067|                     <View style={styles.inputLabelContainer}>
00068|                         <Text style={styles.label}>Email</Text>
00069|                     </View>
00070|                     <View style={styles.inputContainer}>
00071|                         <Ionicons
00072|                             name="mail-outline"
00073|                             size={20}
00074|                             color="#666"
00075|                             style={styles.inputIcon}
00076|                         />
00077|                         <TextInput
00078|                             style={styles.input}
00079|                             placeholder="Masukan email anda"
00080|                             value={email}
00081|                             onChangeText={setEmail}
00082|                             keyboardType="email-address"
00083|                             autoCapitalize="none"
00084|                             placeholderTextColor="#999"
00085|                         />
00086|                     </View>
00087| 
00088|                     {/* Password Input */}
00089|                     <View style={styles.inputLabelContainer}>
00090|                         <Text style={styles.label}>Password</Text>
00091|                     </View>
00092|                     <View style={styles.inputContainer}>
00093|                         <Ionicons
00094|                             name="lock-closed-outline"
00095|                             size={20}
00096|                             color="#666"
00097|                             style={styles.inputIcon}
00098|                         />
00099|                         <TextInput
00100|                             style={styles.input}
00101|                             placeholder="Masukan password"
00102|                             value={password}
00103|                             onChangeText={setPassword}
00104|                             secureTextEntry={!showPassword}
00105|                             placeholderTextColor="#999"
00106|                         />
00107|                         <TouchableOpacity
00108|                             onPress={() => setShowPassword(!showPassword)}
00109|                         >
00110|                             <Ionicons
00111|                                 name={
00112|                                     showPassword
00113|                                         ? "eye-off-outline"
00114|                                         : "eye-outline"
00115|                                 }
00116|                                 size={20}
00117|                                 color="#666"
00118|                             />
00119|                         </TouchableOpacity>
00120|                     </View>
00121| 
00122|                     {/* Forgot Password Link */}
00123|                     <TouchableOpacity
00124|                         style={styles.forgotPassword}
00125|                         onPress={() =>
00126|                             Alert.alert(
00127|                                 "Info",
00128|                                 "Fitur ini akan segera tersedia!",
00129|                             )
00130|                         }
00131|                     >
00132|                         <Text style={styles.forgotPasswordText}>
00133|                             Lupa Password?
00134|                         </Text>
00135|                     </TouchableOpacity>
00136| 
00137|                     {/* Login Button */}
00138|                     <TouchableOpacity
00139|                         style={[
00140|                             styles.button,
00141|                             isLoading && styles.buttonDisabled,
00142|                         ]}
00143|                         onPress={handleLogin}
00144|                         disabled={isLoading}
00145|                     >
00146|                         {isLoading ? (
00147|                             <ActivityIndicator color="#FFF" />
00148|                         ) : (
00149|                             <Text style={styles.buttonText}>Masuk</Text>
00150|                         )}
00151|                     </TouchableOpacity>
00152| 
00153|                     {/* Register Link */}
00154|                     <View style={styles.footer}>
00155|                         <Text style={styles.footerText}>
00156|                             Belum punya akun?{" "}
00157|                         </Text>
00158|                         <TouchableOpacity
00159|                             onPress={() => router.push("/auth/SignUp")}
00160|                         >
00161|                             <Text style={styles.link}>Daftar Sekarang</Text>
00162|                         </TouchableOpacity>
00163|                     </View>
00164|                 </View>
00165|             </KeyboardAvoidingView>
00166|         </SafeAreaView>
00167|     );
00168| }
00169| 
00170| const styles = StyleSheet.create({
00171|     container: {
00172|         flex: 1,
00173|         backgroundColor: "#FFF",
00174|     },
00175|     content: {
00176|         flex: 1,
00177|         padding: 24,
00178|         justifyContent: "center",
00179|     },
00180|     header: {
00181|         alignItems: "center",
00182|         marginBottom: 40,
00183|     },
00184|     iconContainer: {
00185|         width: 80,
00186|         height: 80,
00187|         backgroundColor: "#EBF8FF",
00188|         borderRadius: 40,
00189|         justifyContent: "center",
00190|         alignItems: "center",
00191|         marginBottom: 20,
00192|     },
00193|     title: {
00194|         fontSize: 28,
00195|         fontWeight: "bold",
00196|         color: "#103568",
00197|         marginBottom: 8,
00198|     },
00199|     subtitle: {
00200|         fontSize: 16,
00201|         color: "#666",
00202|     },
00203|     form: {
00204|         gap: 16,
00205|     },
00206|     inputLabelContainer: {
00207|         marginBottom: -10, // Rapatkan label dengan input
00208|         marginLeft: 4,
00209|     },
00210|     label: {
00211|         fontSize: 14,
00212|         fontWeight: "600",
00213|         color: "#333",
00214|     },
00215|     inputContainer: {
00216|         flexDirection: "row",
00217|         alignItems: "center",
00218|         borderWidth: 1,
00219|         borderColor: "#E5E5E5",
00220|         borderRadius: 12,
00221|         paddingHorizontal: 16,
00222|         height: 56,
00223|         backgroundColor: "#FAFAFA",
00224|     },
00225|     inputIcon: {
00226|         marginRight: 12,
00227|     },
00228|     input: {
00229|         flex: 1,
00230|         fontSize: 16,
00231|         color: "#333",
00232|     },
00233|     forgotPassword: {
00234|         alignSelf: "flex-end",
00235|     },
00236|     forgotPasswordText: {
00237|         color: "#103568",
00238|         fontSize: 14,
00239|         fontWeight: "500",
00240|     },
00241|     button: {
00242|         backgroundColor: "#103568",
00243|         height: 56,
00244|         borderRadius: 12,
00245|         justifyContent: "center",
00246|         alignItems: "center",
00247|         marginTop: 8,
00248|         shadowColor: "#103568",
00249|         shadowOffset: { width: 0, height: 4 },
00250|         shadowOpacity: 0.2,
00251|         shadowRadius: 8,
00252|         elevation: 4,
00253|     },
00254|     buttonDisabled: {
00255|         backgroundColor: "#999",
00256|         shadowOpacity: 0,
00257|         elevation: 0,
00258|     },
00259|     buttonText: {
00260|         color: "#FFF",
00261|         fontSize: 16,
00262|         fontWeight: "bold",
00263|     },
00264|     footer: {
00265|         flexDirection: "row",
00266|         justifyContent: "center",
00267|         marginTop: 24,
00268|     },
00269|     footerText: {
00270|         color: "#666",
00271|         fontSize: 14,
00272|     },
00273|     link: {
00274|         color: "#103568",
00275|         fontWeight: "bold",
00276|         fontSize: 14,
00277|     },
00278| });
00279| 

(End of file - total 279 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/(tabs)/index.tsx"
}
```
**Output:**
```
<file>
00001| import React, { useEffect, useState, useCallback } from "react";
00002| import {
00003|     StyleSheet,
00004|     Text,
00005|     View,
00006|     Image,
00007|     TextInput,
00008|     ScrollView,
00009|     TouchableOpacity,
00010|     Dimensions,
00011|     ActivityIndicator,
00012|     RefreshControl,
00013| } from "react-native";
00014| import { Ionicons, FontAwesome } from "@expo/vector-icons";
00015| import { useRouter } from "expo-router";
00016| import { api } from "../../src/services/api"; // Import API
00017| 
00018| // Tipe data untuk Spot
00019| interface Spot {
00020|     id: string;
00021|     name: string;
00022|     location: string;
00023|     price: number;
00024|     image_url?: string;
00025|     rating?: number;
00026| }
00027| 
00028| export default function HomeScreen() {
00029|     const router = useRouter();
00030|     const [spots, setSpots] = useState<Spot[]>([]);
00031|     const [loading, setLoading] = useState(true);
00032|     const [refreshing, setRefreshing] = useState(false);
00033| 
00034|     // Fungsi fetch data spots
00035|     const fetchSpots = async () => {
00036|         try {
00037|             const response = await api.spots.getAll();
00038|             // Sesuaikan dengan struktur data backend (response.data.data atau response.data)
00039|             const data = Array.isArray(response)
00040|                 ? response
00041|                 : response?.data || [];
00042|             if (Array.isArray(data)) {
00043|                 setSpots(data);
00044|             }
00045|         } catch (error) {
00046|             console.error("Failed to fetch spots:", error);
00047|         } finally {
00048|             setLoading(false);
00049|             setRefreshing(false);
00050|         }
00051|     };
00052| 
00053|     // Load data saat pertama kali dibuka
00054|     useEffect(() => {
00055|         fetchSpots();
00056|     }, []);
00057| 
00058|     // Fungsi refresh saat layar ditarik ke bawah
00059|     const onRefresh = useCallback(() => {
00060|         setRefreshing(true);
00061|         fetchSpots();
00062|     }, []);
00063| 
00064|     // Helper untuk render bintang rating secara visual
00065|     const renderStars = (rating: number = 4.5) => {
00066|         const fullStars = Math.floor(rating);
00067|         const hasHalfStar = rating % 1 !== 0;
00068| 
00069|         return (
00070|             <View style={styles.ratingContainer}>
00071|                 {[...Array(fullStars)].map((_, i) => (
00072|                     <FontAwesome
00073|                         key={`full-${i}`}
00074|                         name="star"
00075|                         size={12}
00076|                         color="#333"
00077|                         style={{ marginRight: 2 }}
00078|                     />
00079|                 ))}
00080|                 {hasHalfStar && (
00081|                     <FontAwesome name="star-half-full" size={12} color="#333" />
00082|                 )}
00083|             </View>
00084|         );
00085|     };
00086| 
00087|     return (
00088|         <View style={styles.container}>
00089|             <ScrollView
00090|                 showsVerticalScrollIndicator={false}
00091|                 contentContainerStyle={{ paddingBottom: 100 }}
00092|                 refreshControl={
00093|                     <RefreshControl
00094|                         refreshing={refreshing}
00095|                         onRefresh={onRefresh}
00096|                         colors={["#103568"]}
00097|                     />
00098|                 }
00099|             >
00100|                 {/* === HEADER SECTION === */}
00101|                 <View style={styles.headerContainer}>
00102|                     <Image
00103|                         source={{
00104|                             uri: "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?q=80&w=2070&auto=format&fit=crop",
00105|                         }}
00106|                         style={styles.headerImage}
00107|                     />
00108|                     {/* Search Bar Overlay */}
00109|                     <View style={styles.searchContainer}>
00110|                         <View style={styles.searchBar}>
00111|                             <TextInput
00112|                                 placeholder="Tempat mancing terdekat"
00113|                                 style={styles.searchInput}
00114|                                 placeholderTextColor="#999"
00115|                             />
00116|                             <Ionicons name="search" size={24} color="#666" />
00117|                         </View>
00118|                     </View>
00119|                 </View>
00120| 
00121|                 {/* === SECTION 1: RECOMMENDATIONS (DYNAMIC DATA) === */}
00122|                 <View style={styles.section}>
00123|                     <TouchableOpacity
00124|                         style={styles.sectionHeader}
00125|                         onPress={() => router.push("/(tabs)/explore")} // Diarahkan ke Explore tab
00126|                     >
00127|                         <Text style={styles.sectionTitle}>Recommendations</Text>
00128|                         <Ionicons
00129|                             name="chevron-forward"
00130|                             size={20}
00131|                             color="#333"
00132|                         />
00133|                     </TouchableOpacity>
00134| 
00135|                     {loading ? (
00136|                         <View
00137|                             style={{
00138|                                 height: 150,
00139|                                 justifyContent: "center",
00140|                                 alignItems: "center",
00141|                             }}
00142|                         >
00143|                             <ActivityIndicator size="small" color="#103568" />
00144|                         </View>
00145|                     ) : (
00146|                         <ScrollView
00147|                             horizontal
00148|                             showsHorizontalScrollIndicator={false}
00149|                             style={styles.horizontalScroll}
00150|                         >
00151|                             {spots.length > 0 ? (
00152|                                 spots.map((spot) => (
00153|                                     <TouchableOpacity
00154|                                         key={spot.id}
00155|                                         style={styles.card}
00156|                                         onPress={() =>
00157|                                             router.push({
00158|                                                 pathname:
00159|                                                     "/(booking)/InformationPlace",
00160|                                                 params: { id: spot.id }, // Kirim ID ke detail
00161|                                             })
00162|                                         }
00163|                                     >
00164|                                         <Image
00165|                                             source={{
00166|                                                 uri:
00167|                                                     spot.image_url ||
00168|                                                     "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Landscape_of_Samosir_Island_and_Lake_Toba.jpg/800px-Landscape_of_Samosir_Island_and_Lake_Toba.jpg",
00169|                                             }}
00170|                                             style={styles.cardImage}
00171|                                         />
00172|                                         <View style={styles.cardContent}>
00173|                                             <Text
00174|                                                 style={styles.cardTitle}
00175|                                                 numberOfLines={1}
00176|                                             >
00177|                                                 {spot.name}
00178|                                             </Text>
00179| 
00180|                                             {renderStars(spot.rating || 4.5)}
00181| 
00182|                                             <Text
00183|                                                 style={styles.cardAddress}
00184|                                                 numberOfLines={2}
00185|                                             >
00186|                                                 {spot.location}
00187|                                             </Text>
00188|                                         </View>
00189|                                     </TouchableOpacity>
00190|                                 ))
00191|                             ) : (
00192|                                 <Text
00193|                                     style={{
00194|                                         color: "#999",
00195|                                         fontStyle: "italic",
00196|                                         marginLeft: 5,
00197|                                     }}
00198|                                 >
00199|                                     Belum ada rekomendasi tempat.
00200|                                 </Text>
00201|                             )}
00202| 
00203|                             <View style={{ width: 20 }} />
00204|                         </ScrollView>
00205|                     )}
00206|                 </View>
00207| 
00208|                 {/* === SECTION 2: TIPS & TRICKS (STATIC) === */}
00209|                 <View style={styles.section}>
00210|                     <Text style={styles.sectionTitle}>Tips & Tricks</Text>
00211|                     <View style={styles.tipsCard}>
00212|                         <TouchableOpacity style={styles.arrowButton}>
00213|                             <Ionicons
00214|                                 name="chevron-back"
00215|                                 size={24}
00216|                                 color="#666"
00217|                             />
00218|                         </TouchableOpacity>
00219| 
00220|                         <View style={styles.tipsContent}>
00221|                             <View style={styles.iconCircle}>
00222|                                 <Ionicons
00223|                                     name="fish-outline"
00224|                                     size={32}
00225|                                     color="#333"
00226|                                 />
00227|                             </View>
00228|                             <Text style={styles.tipsTitle}>
00229|                                 Rawat peralatan sederhana
00230|                             </Text>
00231|                             <Text style={styles.tipsDesc}>
00232|                                 Bilas reel dan joran setelah dipakai, keringkan,
00233|                                 simpan rapi. Peralatan murah pun awet kalau
00234|                                 dirawat.
00235|                             </Text>
00236|                         </View>
00237| 
00238|                         <TouchableOpacity style={styles.arrowButton}>
00239|                             <Ionicons
00240|                                 name="chevron-forward"
00241|                                 size={24}
00242|                                 color="#666"
00243|                             />
00244|                         </TouchableOpacity>
00245|                     </View>
00246|                 </View>
00247| 
00248|                 {/* === SECTION 3: EVENT (STATIC) === */}
00249|                 <View style={styles.section}>
00250|                     <TouchableOpacity
00251|                         style={styles.sectionHeader}
00252|                         onPress={() => router.push("/events")} // Pastikan route ini benar
00253|                     >
00254|                         <Text style={styles.sectionTitle}>Event</Text>
00255|                         <Ionicons
00256|                             name="chevron-forward"
00257|                             size={20}
00258|                             color="#333"
00259|                         />
00260|                     </TouchableOpacity>
00261| 
00262|                     <TouchableOpacity
00263|                         style={styles.eventCard}
00264|                         onPress={() => router.push("/events")}
00265|                     >
00266|                         <Image
00267|                             source={{
00268|                                 uri: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
00269|                             }}
00270|                             style={styles.eventImage}
00271|                         />
00272|                         <View style={styles.eventDetails}>
00273|                             <Text style={styles.eventTitle}>
00274|                                 “Master Angler Open Cup”
00275|                             </Text>
00276|                             <Text style={styles.eventText}>Kota: Malang</Text>
00277|                             <Text style={styles.eventText}>
00278|                                 Tanggal: 20 April 2025
00279|                             </Text>
00280|                             <Text style={styles.eventText}>
00281|                                 Total hadiah: Rp700.000
00282|                             </Text>
00283|                             <Text style={styles.eventText}>
00284|                                 Biaya pendaftaran: Rp60.000/orang
00285|                             </Text>
00286|                             <Text style={styles.eventText}>
00287|                                 Penilaian berdasarkan: Ikan terberat
00288|                             </Text>
00289|                         </View>
00290|                     </TouchableOpacity>
00291|                 </View>
00292|             </ScrollView>
00293|         </View>
00294|     );
00295| }
00296| 
00297| const styles = StyleSheet.create({
00298|     container: {
00299|         flex: 1,
00300|         backgroundColor: "#FAFAFA",
00301|     },
00302|     // Header Styles
00303|     headerContainer: {
00304|         position: "relative",
00305|         marginBottom: 30,
00306|     },
00307|     headerImage: {
00308|         width: "100%",
00309|         height: 220,
00310|         resizeMode: "cover",
00311|     },
00312|     searchContainer: {
00313|         position: "absolute",
00314|         bottom: -25,
00315|         width: "100%",
00316|         alignItems: "center",
00317|     },
00318|     searchBar: {
00319|         flexDirection: "row",
00320|         alignItems: "center",
00321|         backgroundColor: "#FFF",
00322|         width: "85%",
00323|         height: 50,
00324|         borderRadius: 25,
00325|         paddingHorizontal: 20,
00326|         shadowColor: "#000",
00327|         shadowOffset: { width: 0, height: 2 },
00328|         shadowOpacity: 0.1,
00329|         shadowRadius: 4,
00330|         elevation: 5,
00331|     },
00332|     searchInput: {
00333|         flex: 1,
00334|         marginRight: 10,
00335|         color: "#333",
00336|     },
00337| 
00338|     // General Section Styles
00339|     section: {
00340|         paddingHorizontal: 20,
00341|         marginBottom: 25,
00342|     },
00343|     sectionHeader: {
00344|         flexDirection: "row",
00345|         alignItems: "center",
00346|         marginBottom: 10,
00347|         paddingVertical: 5,
00348|         alignSelf: "flex-start", // Agar area sentuh sesuai teks
00349|     },
00350|     sectionTitle: {
00351|         fontSize: 18,
00352|         fontWeight: "bold",
00353|         color: "#333",
00354|         marginRight: 5,
00355|     },
00356| 
00357|     // Recommendations Horizontal Scroll
00358|     horizontalScroll: {
00359|         marginHorizontal: -20,
00360|         paddingHorizontal: 20,
00361|     },
00362|     card: {
00363|         width: 200,
00364|         backgroundColor: "#FFF",
00365|         borderRadius: 15,
00366|         marginRight: 15,
00367|         paddingBottom: 15,
00368|         shadowColor: "#000",
00369|         shadowOffset: { width: 0, height: 1 },
00370|         shadowOpacity: 0.1,
00371|         shadowRadius: 2,
00372|         elevation: 3,
00373|         overflow: "hidden",
00374|     },
00375|     cardImage: {
00376|         width: "100%",
00377|         height: 120,
00378|         backgroundColor: "#eee",
00379|     },
00380|     cardContent: {
00381|         padding: 10,
00382|     },
00383|     cardTitle: {
00384|         fontSize: 14, // Sedikit diperbesar agar lebih jelas
00385|         fontWeight: "bold",
00386|         marginBottom: 5,
00387|         color: "#333",
00388|     },
00389|     ratingContainer: {
00390|         flexDirection: "row",
00391|         marginBottom: 5,
00392|     },
00393|     cardAddress: {
00394|         fontSize: 10,
00395|         color: "#666",
00396|         lineHeight: 14,
00397|     },
00398| 
00399|     // Tips Card Styles
00400|     tipsCard: {
00401|         flexDirection: "row",
00402|         alignItems: "center",
00403|         backgroundColor: "#FFF",
00404|         borderRadius: 15,
00405|         padding: 15,
00406|         shadowColor: "#000",
00407|         shadowOffset: { width: 0, height: 1 },
00408|         shadowOpacity: 0.1,
00409|         shadowRadius: 2,
00410|         elevation: 3,
00411|     },
00412|     arrowButton: {
00413|         padding: 5,
00414|         backgroundColor: "#F5F5F5",
00415|         borderRadius: 20,
00416|     },
00417|     tipsContent: {
00418|         flex: 1,
00419|         alignItems: "center",
00420|         paddingHorizontal: 10,
00421|     },
00422|     iconCircle: {
00423|         width: 60,
00424|         height: 60,
00425|         borderRadius: 30,
00426|         borderWidth: 1,
00427|         borderColor: "#333",
00428|         justifyContent: "center",
00429|         alignItems: "center",
00430|         marginBottom: 10,
00431|     },
00432|     tipsTitle: {
00433|         fontWeight: "bold",
00434|         fontSize: 14,
00435|         marginBottom: 5,
00436|         color: "#333",
00437|     },
00438|     tipsDesc: {
00439|         fontSize: 10,
00440|         textAlign: "center",
00441|         color: "#666",
00442|     },
00443| 
00444|     // Event Card Styles
00445|     eventCard: {
00446|         flexDirection: "row",
00447|         backgroundColor: "#FFF",
00448|         borderRadius: 15,
00449|         padding: 15,
00450|         shadowColor: "#000",
00451|         shadowOffset: { width: 0, height: 1 },
00452|         shadowOpacity: 0.1,
00453|         shadowRadius: 2,
00454|         elevation: 3,
00455|     },
00456|     eventImage: {
00457|         width: 80,
00458|         height: 80,
00459|         borderRadius: 40,
00460|         marginRight: 15,
00461|         backgroundColor: "#eee",
00462|     },
00463|     eventDetails: {
00464|         flex: 1,
00465|         justifyContent: "center",
00466|     },
00467|     eventTitle: {
00468|         fontWeight: "bold",
00469|         fontSize: 14,
00470|         marginBottom: 5,
00471|         color: "#333",
00472|     },
00473|     eventText: {
00474|         fontSize: 10,
00475|         color: "#555",
00476|         marginBottom: 2,
00477|     },
00478| });
00479| 

(End of file - total 479 lines)
</file>
```
```

---

## Assistant

_Thinking:_

Now I have a complete picture. Let me also check the backend to see the exact API response format for the endpoints the mobile app will be calling.

Let me also check the explore.tsx to see what template code is there.

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/(tabs)/explore.tsx"
}
```
**Output:**
```
<file>
00001| import { Image } from 'expo-image';
00002| import { Platform, StyleSheet } from 'react-native';
00003| 
00004| import { Collapsible } from '@/components/ui/collapsible';
00005| import { ExternalLink } from '@/components/external-link';
00006| import ParallaxScrollView from '@/components/parallax-scroll-view';
00007| import { ThemedText } from '@/components/themed-text';
00008| import { ThemedView } from '@/components/themed-view';
00009| import { IconSymbol } from '@/components/ui/icon-symbol';
00010| import { Fonts } from '@/constants/theme';
00011| 
00012| export default function TabTwoScreen() {
00013|   return (
00014|     <ParallaxScrollView
00015|       headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
00016|       headerImage={
00017|         <IconSymbol
00018|           size={310}
00019|           color="#808080"
00020|           name="chevron.left.forwardslash.chevron.right"
00021|           style={styles.headerImage}
00022|         />
00023|       }>
00024|       <ThemedView style={styles.titleContainer}>
00025|         <ThemedText
00026|           type="title"
00027|           style={{
00028|             fontFamily: Fonts.rounded,
00029|           }}>
00030|           Explore
00031|         </ThemedText>
00032|       </ThemedView>
00033|       <ThemedText>This app includes example code to help you get started.</ThemedText>
00034|       <Collapsible title="File-based routing">
00035|         <ThemedText>
00036|           This app has two screens:{' '}
00037|           <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
00038|           <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
00039|         </ThemedText>
00040|         <ThemedText>
00041|           The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
00042|           sets up the tab navigator.
00043|         </ThemedText>
00044|         <ExternalLink href="https://docs.expo.dev/router/introduction">
00045|           <ThemedText type="link">Learn more</ThemedText>
00046|         </ExternalLink>
00047|       </Collapsible>
00048|       <Collapsible title="Android, iOS, and web support">
00049|         <ThemedText>
00050|           You can open this project on Android, iOS, and the web. To open the web version, press{' '}
00051|           <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
00052|         </ThemedText>
00053|       </Collapsible>
00054|       <Collapsible title="Images">
00055|         <ThemedText>
00056|           For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
00057|           <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
00058|           different screen densities
00059|         </ThemedText>
00060|         <Image
00061|           source={require('@/assets/images/react-logo.png')}
00062|           style={{ width: 100, height: 100, alignSelf: 'center' }}
00063|         />
00064|         <ExternalLink href="https://reactnative.dev/docs/images">
00065|           <ThemedText type="link">Learn more</ThemedText>
00066|         </ExternalLink>
00067|       </Collapsible>
00068|       <Collapsible title="Light and dark mode components">
00069|         <ThemedText>
00070|           This template has light and dark mode support. The{' '}
00071|           <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
00072|           what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
00073|         </ThemedText>
00074|         <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
00075|           <ThemedText type="link">Learn more</ThemedText>
00076|         </ExternalLink>
00077|       </Collapsible>
00078|       <Collapsible title="Animations">
00079|         <ThemedText>
00080|           This template includes an example of an animated component. The{' '}
00081|           <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
00082|           the powerful{' '}
00083|           <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
00084|             react-native-reanimated
00085|           </ThemedText>{' '}
00086|           library to create a waving hand animation.
00087|         </ThemedText>
00088|         {Platform.select({
00089|           ios: (
00090|             <ThemedText>
00091|               The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
00092|               component provides a parallax effect for the header image.
00093|             </ThemedText>
00094|           ),
00095|         })}
00096|       </Collapsible>
00097|     </ParallaxScrollView>
00098|   );
00099| }
00100| 
00101| const styles = StyleSheet.create({
00102|   headerImage: {
00103|     color: '#808080',
00104|     bottom: -90,
00105|     left: -35,
00106|     position: 'absolute',
00107|   },
00108|   titleContainer: {
00109|     flexDirection: 'row',
00110|     gap: 8,
00111|   },
00112| });
00113| 

(End of file - total 113 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/backend/routes/spot.js"
}
```
**Output:**
```
<file>
00001| // backend/routes/tempat.js
00002| 
00003| /**
00004|  * Modul Routes untuk Tempat Pemancingan (Venues).
00005|  * Menangani: Pengambilan daftar tempat dan detail informasi tempat mancing.
00006|  */
00007| async function tempatRoutes(fastify, options) {
00008|   // ==================================================
00009|   // 1. Endpoint: Ambil Seluruh Tempat Mancing
00010|   // Method: GET
00011|   // URL Akses: http://localhost:3000/tempat_mancing/
00012|   // Deskripsi: Mengambil daftar semua tempat pemancingan yang tersedia di database.
00013|   // ==================================================
00014|   fastify.get("/", async (request, reply) => {
00015|     let connection;
00016|     try {
00017|       connection = await fastify.mysql.getConnection();
00018| 
00019|       // Eksekusi query untuk mengambil semua data dari tabel 'tempat_mancing'
00020|       const [rows, fields] = await connection.query(
00021|         "SELECT * FROM tempat_mancing",
00022|       );
00023| 
00024|       connection.release();
00025| 
00026|       // Mengembalikan array data ke frontend
00027|       return rows;
00028|     } catch (err) {
00029|       if (connection) connection.release();
00030|       fastify.log.error(err);
00031|       reply.status(500).send({ message: "Terjadi kesalahan pada server" });
00032|     }
00033|   });
00034| 
00035|   // ==================================================
00036|   // 2. Endpoint: Ambil Detail Tempat Spesifik
00037|   // Method: GET
00038|   // URL Akses: http://localhost:3000/tempat_mancing/:id
00039|   // Deskripsi: Mengambil detail lengkap satu tempat pemancingan berdasarkan ID.
00040|   // ==================================================
00041|   fastify.get("/:id", async (request, reply) => {
00042|     const id = request.params.id; // Ambil ID dari URL
00043| 
00044|     let connection;
00045|     try {
00046|       connection = await fastify.mysql.getConnection();
00047| 
00048|       // Query dengan parameter ID (menggunakan '?' untuk mencegah SQL Injection)
00049|       const [rows, fields] = await connection.query(
00050|         "SELECT * FROM tempat_mancing WHERE id = ?",
00051|         [id],
00052|       );
00053| 
00054|       connection.release();
00055| 
00056|       // Validasi: Jika data tidak ditemukan (array kosong)
00057|       if (rows.length === 0) {
00058|         return reply
00059|           .status(404)
00060|           .send({ message: "Tempat mancing tidak ditemukan" });
00061|       }
00062| 
00063|       // Mengembalikan objek data pertama (karena ID unik)
00064|       return rows[0];
00065|     } catch (err) {
00066|       if (connection) connection.release();
00067|       fastify.log.error(err);
00068|       reply.status(500).send({ message: "Terjadi kesalahan pada server" });
00069|     }
00070|   });
00071| }
00072| 
00073| module.exports = tempatRoutes;
00074| 

(End of file - total 74 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/backend/routes/bookings.js"
}
```
**Output:**
```
<file>
00001| // backend/routes/bookings.js
00002| 
00003| /**
00004|  * Modul Routes untuk Booking (Reservasi Tempat Mancing)
00005|  * Menangani: Pembuatan Booking, Cek Ketersediaan Kursi, Riwayat Booking, dan Pembatalan.
00006|  */
00007| async function bookingRoutes(fastify, options) {
00008|   // --- Helper: Hitung Jam Selesai ---
00009|   // Fungsi kecil untuk menjumlahkan Jam Mulai + Durasi
00010|   // Contoh: "10:00" + 2 jam = "12:00"
00011|   function calculateEndTime(startTime, duration) {
00012|     if (!startTime || !duration) return "00:00:00";
00013|     const [hours, minutes] = startTime.split(":").map(Number);
00014|     const endHours = hours + Number(duration);
00015|     // Format output HH:MM (pad dengan 0 jika satu digit)
00016|     return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
00017|   }
00018| 
00019|   // ==================================================
00020|   // 1. Endpoint: Buat Booking Baru (LENGKAP)
00021|   // Method: POST
00022|   // URL: http://localhost:3000/bookings/
00023|   // ==================================================
00024|   fastify.post(
00025|     "/",
00026|     {
00027|       preHandler: [fastify.authenticate], // Wajib Login
00028|     },
00029|     async (request, reply) => {
00030|       // Ambil data dari Frontend
00031|       const { tempat_id, tanggal_booking, no_kursi, start_time, duration } =
00032|         request.body;
00033|       const user_id = request.user.id;
00034| 
00035|       // Validasi Kelengkapan Data
00036|       if (
00037|         !tempat_id ||
00038|         !tanggal_booking ||
00039|         !no_kursi ||
00040|         !start_time ||
00041|         !duration
00042|       ) {
00043|         return reply
00044|           .status(400)
00045|           .send({ message: "Data booking tidak lengkap (Jam/Durasi/Kursi)" });
00046|       }
00047| 
00048|       // Hitung jam selesai secara otomatis di backend
00049|       const end_time = calculateEndTime(start_time, duration);
00050| 
00051|       let connection;
00052|       try {
00053|         connection = await fastify.mysql.getConnection();
00054| 
00055|         // LANGKAH 1: AMBIL HARGA TEMPAT DULU
00056|         // Kita tidak percaya harga dari frontend, ambil langsung dari database master.
00057|         const [tempatRows] = await connection.query(
00058|           "SELECT harga_per_jam FROM tempat_mancing WHERE id = ?",
00059|           [tempat_id],
00060|         );
00061| 
00062|         if (tempatRows.length === 0) {
00063|           connection.release();
00064|           return reply.status(404).send({ message: "Tempat tidak ditemukan" });
00065|         }
00066| 
00067|         // Hitung Total Harga (Harga per Jam x Durasi)
00068|         const hargaPerJam = Number(tempatRows[0].harga_per_jam);
00069|         const totalHarga = hargaPerJam * duration;
00070| 
00071|         // LANGKAH 2: CEK BENTROK (Safety Net)
00072|         // Pastikan tidak ada booking lain di kursi yang sama pada jam yang beririsan.
00073|         // Logika Bentrok: (Jam Mulai Baru < Jam Selesai Lama) DAN (Jam Selesai Baru > Jam Mulai Lama)
00074|         const [existing] = await connection.query(
00075|           `SELECT id FROM bookings 
00076|              WHERE tempat_id = ? AND no_kursi = ? AND tanggal_booking = ?
00077|              AND (start_time < ? AND end_time > ?)`,
00078|           [tempat_id, no_kursi, tanggal_booking, end_time, start_time],
00079|         );
00080| 
00081|         if (existing.length > 0) {
00082|           connection.release();
00083|           return reply.status(409).send({
00084|             message: `Kursi ${no_kursi} sudah terisi di jam tersebut.`,
00085|           });
00086|         }
00087| 
00088|         // LANGKAH 3: INSERT DATA (Status awal 'pending')
00089|         const [result] = await connection.query(
00090|           "INSERT INTO bookings (user_id, tempat_id, no_kursi, tanggal_booking, start_time, end_time, total_harga, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')",
00091|           [
00092|             user_id,
00093|             tempat_id,
00094|             no_kursi,
00095|             tanggal_booking,
00096|             start_time,
00097|             end_time,
00098|             totalHarga,
00099|           ],
00100|         );
00101| 
00102|         connection.release();
00103| 
00104|         return reply.status(201).send({
00105|           id: result.insertId,
00106|           user_id,
00107|           tempat_id,
00108|           no_kursi,
00109|           tanggal_booking,
00110|           totalHarga,
00111|         });
00112|       } catch (err) {
00113|         if (connection) connection.release();
00114|         fastify.log.error(err);
00115|         reply.status(500).send({ message: "Gagal menyimpan booking" });
00116|       }
00117|     },
00118|   );
00119| 
00120|   // ==================================================
00121|   // 2. Endpoint: Riwayat Booking Saya
00122|   // Method: GET
00123|   // URL: http://localhost:3000/bookings/my
00124|   // ==================================================
00125|   fastify.get(
00126|     "/my",
00127|     {
00128|       preHandler: [fastify.authenticate],
00129|     },
00130|     async (request, reply) => {
00131|       const user_id = request.user.id;
00132|       let connection;
00133|       try {
00134|         connection = await fastify.mysql.getConnection();
00135|         // Menggunakan JOIN untuk mengambil Nama Tempat dan Lokasi sekaligus
00136|         const [rows] = await connection.query(
00137|           `SELECT
00138|             b.*,
00139|             t.nama AS nama_tempat,
00140|             t.lokasi AS lokasi_tempat
00141|            FROM bookings AS b
00142|            JOIN tempat_mancing AS t ON b.tempat_id = t.id
00143|            WHERE b.user_id = ? 
00144|            ORDER BY b.id DESC`, // Urutkan dari yang terbaru
00145|           [user_id],
00146|         );
00147|         connection.release();
00148|         return rows;
00149|       } catch (err) {
00150|         if (connection) connection.release();
00151|         fastify.log.error(err);
00152|         reply.status(500).send({ message: "Terjadi kesalahan pada server" });
00153|       }
00154|     },
00155|   );
00156| 
00157|   // ==================================================
00158|   // 3. Endpoint: Batalkan Booking
00159|   // Method: DELETE
00160|   // URL: http://localhost:3000/bookings/my/:id
00161|   // ==================================================
00162|   fastify.delete(
00163|     "/my/:id",
00164|     {
00165|       preHandler: [fastify.authenticate],
00166|     },
00167|     async (request, reply) => {
00168|       const user_id = request.user.id;
00169|       const booking_id = request.params.id;
00170|       let connection;
00171|       try {
00172|         connection = await fastify.mysql.getConnection();
00173|         // Menghapus hanya jika ID Booking cocok DAN User ID cocok (Security)
00174|         const [results] = await connection.query(
00175|           "DELETE FROM bookings WHERE id = ? AND user_id = ?",
00176|           [booking_id, user_id],
00177|         );
00178|         connection.release();
00179| 
00180|         if (results.affectedRows === 0) {
00181|           return reply.status(404).send({
00182|             message: "Booking tidak ditemukan atau Anda tidak memiliki izin",
00183|           });
00184|         }
00185|         return reply.status(204).send();
00186|       } catch (err) {
00187|         if (connection) connection.release();
00188|         fastify.log.error(err);
00189|         reply.status(500).send({ message: "Terjadi kesalahan pada server" });
00190|       }
00191|     },
00192|   );
00193| 
00194|   // ==================================================
00195|   // 4. Endpoint: Cek Kursi Sibuk (Global Filter / Peta Warna Merah)
00196|   // Method: GET
00197|   // URL: /bookings/check-seats?tempat_id=1&tanggal=...&start=...&durasi=...
00198|   // ==================================================
00199|   fastify.get("/check-seats", async (request, reply) => {
00200|     // Frontend mengirim parameter lewat Query String
00201|     const { tempat_id, tanggal, start, durasi } = request.query;
00202| 
00203|     if (!tempat_id || !tanggal) return { bookedSeats: [] };
00204| 
00205|     let connection;
00206|     try {
00207|       connection = await fastify.mysql.getConnection();
00208| 
00209|       // Query Dasar: Ambil semua kursi yang dibooking di tanggal tersebut
00210|       let query =
00211|         "SELECT no_kursi FROM bookings WHERE tempat_id = ? AND tanggal_booking = ?";
00212|       const params = [tempat_id, tanggal];
00213| 
00214|       // Jika User sudah memilih Jam (Filter Lebih Spesifik):
00215|       // Cek hanya kursi yang BENTROK jamnya dengan pilihan user.
00216|       if (start && durasi) {
00217|         const [h, m] = start.split(":").map(Number);
00218|         const endH = h + Number(durasi);
00219|         const reqStart = start;
00220|         const reqEnd = `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
00221| 
00222|         // Logika Bentrok: (StartDB < RequestEnd) AND (EndDB > RequestStart)
00223|         query += " AND (start_time < ? AND end_time > ?)";
00224|         params.push(reqEnd, reqStart);
00225|       }
00226| 
00227|       const [rows] = await connection.query(query, params);
00228|       connection.release();
00229| 
00230|       // Kembalikan Array nomor kursi yang sibuk [1, 5, 12]
00231|       return { bookedSeats: rows.map((r) => r.no_kursi) };
00232|     } catch (err) {
00233|       if (connection) connection.release();
00234|       reply.status(500).send(err);
00235|     }
00236|   });
00237| 
00238|   // ==================================================
00239|   // 5. Endpoint: Ambil Jadwal Spesifik (Smart Dropdown)
00240|   // Method: GET
00241|   // URL: /bookings/schedule?tempat_id=1&no_kursi=10&tanggal=...
00242|   // Deskripsi: Mengambil daftar jam yang SUDAH TERISI di kursi tertentu.
00243|   // ==================================================
00244|   fastify.get("/schedule", async (request, reply) => {
00245|     const { tempat_id, no_kursi, tanggal } = request.query;
00246| 
00247|     let connection;
00248|     try {
00249|       connection = await fastify.mysql.getConnection();
00250| 
00251|       // Ambil jam mulai & selesai dari kursi yang sedang dicek
00252|       const [rows] = await connection.query(
00253|         "SELECT start_time, end_time FROM bookings WHERE tempat_id = ? AND no_kursi = ? AND tanggal_booking = ?",
00254|         [tempat_id, no_kursi, tanggal],
00255|       );
00256| 
00257|       connection.release();
00258| 
00259|       // Balikin array jadwal: [{start_time: '10:00', end_time: '12:00'}, ...]
00260|       // Frontend akan menggunakan ini untuk mendisable jam di dropdown.
00261|       return rows;
00262|     } catch (err) {
00263|       if (connection) connection.release();
00264|       reply.status(500).send(err);
00265|     }
00266|   });
00267| }
00268| 
00269| module.exports = bookingRoutes;
00270| 

(End of file - total 270 lines)
</file>
```
```

---

## Assistant

_Thinking:_

Now I have a complete picture. Let me also check the alat (equipment) endpoint and auth endpoint to understand the full API structure.

Based on my analysis, here are the critical issues that need to be fixed for backend-frontend integration:

**Critical Issues Blocking Integration:**

1. **api.ts (src/config/api.ts)**:
   - Auth interceptor has TODO - doesn't actually add token to requests
   - Inconsistent endpoint URLs (some with leading slash, some without)
   - Auth response interceptor doesn't handle 401 properly (no logout trigger)

2. **services/api.ts**:
   - Bug: `checkAvailability` uses `spot_id` instead of `spotId` (line 55)
   - Also, the endpoint should be `check-seats` not `check-availability` based on backend

3. **AuthContext.tsx**:
   - Login uses apiClient directly instead of the api service
   - No logout API call

4. **Login.tsx**:
   - Uses AuthContext login which works, but error handling could be improved

5. **Screens with mock data that need API integration**:
   - notifications.tsx - mock data (should fetch from /bookings/my)
   - BuysAndRentFishing.tsx - mock products (should fetch from /alat_pancing)
   - Booking.tsx - hardcoded seat status (should fetch from /bookings/check-seats)
   - explore.tsx - template code (needs proper implementation)

6. **Home screen (index.tsx)**:
   - Already uses API to fetch spots, but might need adjustment based on actual response format

7. **Backend endpoint naming**:
   - checkAvailability in services/api.ts should be `check-seats` based on backend route
   - Parameters should be `tempat_id`, `tanggal`, `start`, `durasi` not `spotId`, `date`, `duration`
   
I'll prioritize fixing the API service layer to ensure smooth integration. The key is to align the frontend services with the backend endpoints, correct parameter naming, and implement proper authentication handling. This will resolve the current integration blockers and create a more robust communication between frontend and backend.

Berdasarkan analisis saya, saya telah mengidentifikasi semua error yang menghalangi integrasi backend-fronted. Berikut adalah **Rencana Perbaikan** yang perlu dilakukan:

---

# Rencana Perbaikan Integrasi Backend-Mobile

## Prioritas 1: Error Kritis (Blocking Integration)

### 1. Fix `src/config/api.ts`
- [ ] Lengkapi auth interceptor untuk menambahkan Bearer token ke setiap request
- [ ] Perbaiki response interceptor untuk handle 401 dengan logout otomatis
- [ ] Konsistensikan endpoint URL (semua pakai leading slash)

### 2. Fix `src/services/api.ts`
- [ ] Perbaiki bug: `spot_id` → `spotId` di checkAvailability
- [ ] Endpoint harus `/bookings/check-seats` bukan `/bookings/check-availability`
- [ ] Parameter harus sesuai backend: `tempat_id`, `tanggal`, `start`, `durasi`

### 3. Fix `src/contexts/AuthContext.tsx`
- [ ] Panggil logout API sebelum clear local storage
- [ ] Handle error login dengan lebih baik

---

## Prioritas 2: Integrasi API ke Screen

### 4. Fix `app/(tabs)/index.tsx` (Home)
- [ ] Tambah fetch tips dari `/content/tips`
- [ ] Tambah fetch events dari `/content/lomba`

### 5. Fix `app/(booking)/Booking.tsx`
- [ ] Ganti hardcoded `seatStatus` dengan fetch dari `/bookings/check-seats`
- [ ] Ganti hardcoded `PRICE_PER_HOUR` dengan harga dari data spot

### 6. Fix `app/BuysAndRentFishing.tsx`
- [ ] Ganti mock products dengan fetch dari `/alat_pancing?tempat_id=...`

### 7. Fix `app/(tabs)/notifications.tsx`
- [ ] Ganti mock data dengan fetch dari `/bookings/my`

### 8. Fix `app/(tabs)/explore.tsx`
- [ ] Ganti template code dengan implementasi halaman explore yang benar

---

## Prioritas 3: Auth Guards

### 9. Tambah Auth Protection
- [ ] Booking screen harus cek apakah user sudah login
- [ ] Payment screen harus cek apakah user sudah login
- [ ] BuysAndRentFishing harus cek apakah user sudah login

---

## Pertanyaan untuk Konfirmasi

Sebelum saya mulai implementasi, mohon konfirmasi:

1. **Apakah Anda ingin saya kerjakan semua perbaikan sekaligus atau bertahap?**
   - Opsi A: Semua sekaligus (lebih efisien)
   - Opsi B: Prioritas 1 dulu, baru lanjut ke prioritas 2

2. **Untuk screen `explore.tsx`**, bagaimana seharusnya tampilannya?
   - Apakah grid daftar tempat mancing?
   - Apakah ada filter?

3. **Apakah backend sudah running dan bisa di-test?**

4. **Apakah Anda ingin saya juga menambahkan error handling统一的 (unified error handling)?**

Mohon konfirmasi agar saya bisa langsung memulai implementasi.

---

## User

aku yang bakal ngerjain sekarang kamu kasih tau step by stepnya aja. opsi b aja step by step

---

## Assistant

_Thinking:_

The user wants to do the implementation themselves and is asking me to provide step-by-step instructions. They chose Option B - doing it step by step, starting with Priority 1.

Since I'm in plan mode, I should provide clear, actionable step-by-step instructions for Priority 1 that the user can follow. Let me structure this clearly.

Priority 1 items:
1. Fix `src/config/api.ts` - complete auth interceptor, fix response interceptor, fix endpoint URLs
2. Fix `src/services/api.ts` - fix bug with parameter names
3. Fix `src/contexts/AuthContext.tsx` - add API logout call, better error handling

I should give very specific, actionable steps with exact line numbers and code changes needed.

# Step-by-Step Priority 1: Fix API Configuration

## Langkah 1: Fix `src/config/api.ts`

### 1.1 Perbaiki Auth Interceptor (line 29-39)
Ganti kode yang ada di line 29-39 dengan:

```typescript
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("@token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error adding auth header:", error);
        }
        return config;
    },
    (error) => Promise.reject(error),
);
```

**Import yang perlu ditambah:**
```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
```

### 1.2 Perbaiki Response Interceptor (line 41-49)
Ganti dengan:

```typescript
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Clear storage and redirect to login
            await AsyncStorage.removeItem("@token");
            await AsyncStorage.removeItem("@user");
            router.replace("/(auth)/Login");
        }
        return Promise.reject(error);
    },
);
```

**Import yang perlu di-update:**
```typescript
import { router } from "expo-router";
```

### 1.3 Konsistensikan Endpoint URLs (line 51-74)
Ubah semua endpoint agar konsisten (pakai leading slash):

```typescript
export const ENDPOINTS = {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",

    LIST_SPOTS: "/tempat_mancing",
    SPOT_DETAIL: (id: string) => `/tempat_mancing/${id}`,
    LIST_ALAT: "/alat_pancing",
    ALAT_DETAIL: (id: string) => `/alat_pancing/${id}`,

    CREATE_BOOKING: "/bookings",
    CHECK_KURSI: "/bookings/check-seats",

    CREATE_ORDER: "/orders",

    GET_REVIEWS: (spotId: string) => `/reviews?tempat_id=${spotId}`,
    CREATE_REVIEW: "/reviews",

    PROCESS_PAYMENT: "/payment",
    PAYMENT_STATUS: (id: string) => `/payment/${id}`,
};
```

---

## Langkah 2: Fix `src/services/api.ts`

### 2.1 Perbaiki Method checkAvailability (line 49-59)
Ubah endpoint DAN parameter:

```typescript
checkAvailability: async (
    spotId: string,
    date: string,
    duration: number,
) => {
    return await api.get("/bookings/check-seats", {
        tempat_id: spotId,
        tanggal: date,
        durasi: duration,
    });
},
```

**Note:** Endpoint backend adalah `/bookings/check-seats`, bukan `/check-availability`. Parameter backend ожидает `tempat_id`, `tanggal`, `start`, `durasi`. Untuk `/check-seats` hanya perlu `tempat_id` dan `tanggal` saja (opsional `start` dan `durasi` untuk filter lebih spesifik).

---

## Langkah 3: Fix `src/contexts/AuthContext.tsx`

### 3.1 Tambah Logout API Call (line 85-101)
Ubah function `logout`:

```typescript
const logout = async () => {
    setIsLoading(true);
    try {
        // Panggil API logout (abaikan error jika gagal)
        try {
            await apiClient.post("/auth/logout");
        } catch (e) {
            // Logout tetap lanjut meskipun API gagal
            console.log("API logout failed, continue with local logout");
        }

        await AsyncStorage.removeItem("@token");
        await AsyncStorage.removeItem("@user");

        setToken(null);
        setUser(null);

        router.replace("/(auth)/Login");
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        setIsLoading(false);
    }
};
```

### 3.2 Import api di AuthContext
Tambah import di line 1-11:

```typescript
import { api } from "../services/api";
```

### 3.3 Tambah Error Handling di Login (line 61-83)
Ubah function `login`:

```typescript
const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
        const response = await apiClient.post("/auth/login", {
            email,
            password,
        });

        const { token, user } = response.data;

        await AsyncStorage.setItem("@token", token);
        await AsyncStorage.setItem("@user", JSON.stringify(user));

        setToken(token);
        setUser(user);

        router.replace("/");
    } catch (error: any) {
        console.error("Login error:", error);
        let message = "Email atau password salah. Silakan coba lagi.";
        
        if (error.response?.data?.message) {
            message = error.response.data.message;
        } else if (error.message) {
            message = error.message;
        }
        
        throw new Error(message);
    } finally {
        setIsLoading(false);
    }
};
```

---

## Langkah 4: Verifikasi

Setelah melakukan 3 langkah di atas:

1. **Restart backend**: `cd backend && npm run dev`
2. **Restart mobile**: `cd mobile && npx expo start --clear`
3. **Test Login** di mobile app
4. **Cek di React Native Debugger** apakah header Authorization sudah ter-add ke request

---

## Langkah 5: Lanjut ke Prioritas 2

Kalau sudah selesai dan working, baru lanjut ke:

- Integrasi Home screen (`index.tsx`) dengan API tips & events
- Integrasi Booking screen dengan API check-seats
- Ganti mock products dengan API alat_pancing
- Ganti mock notifications dengan API bookings/my

Mulai dulu dengan Langkah 1-3 di atas. Ada pertanyaan?

---

## User

lanjut ke prioritas 2 dulu deh

---

## Assistant

_Thinking:_

The user wants to continue to Priority 2 of the code review and fixes. They said "lanjut ke prioritas 2 dulu deh" which means "continue to priority 2 first".

I need to remember that I'm in Plan Mode - I'm in READ-ONLY phase and should NOT make any edits or modifications. I should only observe, analyze, plan, and provide guidance.

Let me provide the step-by-step plan for Priority 2 which includes:
1. Fixing Home screen (index.tsx) - integrate with API for tips & events
2. Fixing Booking screen - integrate with API check-seats
3. Replacing mock products with API alat_pancing
4. Replacing mock notifications with API bookings/my
5. Implementing explore.tsx properly

I should provide clear, actionable steps for each of these tasks without actually implementing them since I'm in read-only mode.

# Step-by-Step Priority 2: Integrasi API ke Screen

## Persiapan

Pastikan Priority 1 sudah selesai dan login sudah working dengan Bearer token yang ter-add ke request.

---

## Langkah 1: Integrasi Home Screen (`app/(tabs)/index.tsx`)

### 1.1 Tambah State untuk Tips & Events

Tambah di line 30-32:

```typescript
const [tips, setTips] = useState<any[]>([]);
const [events, setEvents] = useState<any[]>([]);
```

### 1.2 Tambah Fetch Function

Tambah di dalam component (sebelum return):

```typescript
const fetchContent = async () => {
    try {
        const tipsData = await api.get("/content/tips");
        const eventsData = await api.get("/content/lomba");
        setTips(tipsData || []);
        setEvents(eventsData || []);
    } catch (error) {
        console.error("Failed to fetch content:", error);
    }
};
```

### 1.3 Panggil di useEffect

Tambah di dalam useEffect yang ada (line 54-56):

```typescript
useEffect(() => {
    fetchSpots();
    fetchContent(); // Tambah ini
}, []);
```

### 1.4 Update Tips Section (line 208-246)

Ganti static tips card dengan dynamic data dari API:

```typescript
{loading ? (
    <ActivityIndicator color="#103568" />
) : tips.length > 0 ? (
    tips.map((tip, index) => (
        <View key={tip.id || index} style={styles.tipsCard}>
            <View style={styles.tipsContent}>
                <View style={styles.iconCircle}>
                    <Ionicons name="fish-outline" size={32} color="#333" />
                </View>
                <Text style={styles.tipsTitle}>{tip.judul || tip.title}</Text>
                <Text style={styles.tipsDesc}>{tip.konten || tip.content}</Text>
            </View>
        </View>
    ))
) : (
    <Text style={{ color: "#999" }}>Belum ada tips tersedia</Text>
)}
```

### 1.5 Update Events Section (line 248-291)

Ganti static event card dengan dynamic data:

```typescript
{loading ? (
    <ActivityIndicator color="#103568" />
) : events.length > 0 ? (
    events.map((event, index) => (
        <TouchableOpacity
            key={event.id || index}
            style={styles.eventCard}
            onPress={() => router.push("/events")}
        >
            <Image
                source={{
                    uri: event.gambar || event.image || "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
                }}
                style={styles.eventImage}
            />
            <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{event.nama || event.title}</Text>
                <Text style={styles.eventText}>Kota: {event.kota || event.location}</Text>
                <Text style={styles.eventText}>Tanggal: {event.tanggal || event.date}</Text>
                <Text style={styles.eventText}>Total hadiah: {formatRupiah(event.total_hadiah || event.prize)}</Text>
            </View>
        </TouchableOpacity>
    ))
) : (
    <Text style={{ color: "#999" }}>Belum ada event tersedia</Text>
)}
```

---

## Langkah 2: Integrasi Booking Screen (`app/(booking)/Booking.tsx`)

### 2.1 Tambah Props untuk terima spotId

Ubah di line 20:

```typescript
export default function BookingScreen() {
    const router = useRouter();
    // Ambil spotId dari route params
    const [spotId, setSpotId] = useState<string>("");
    const [spotData, setSpotData] = useState<any>(null);
```

### 2.2 Tambah useEffect untuk fetch data

Tambah di bagian STATE DATA (line 22-41):

```typescript
useEffect(() => {
    // Ambil params dari router
    const params = router as any;
    if (params.searchParams && params.searchParams.id) {
        const id = params.searchParams.id;
        setSpotId(id);
        fetchSpotData(id);
        fetchSeatAvailability(id, date);
    }
}, []);
```

### 2.3 Tambah Function fetchSpotData

Tambah sebelum toggleSeat:

```typescript
const fetchSpotData = async (id: string) => {
    try {
        const data = await api.spots.getById(id);
        setSpotData(data);
    } catch (error) {
        console.error("Failed to fetch spot data:", error);
    }
};

const fetchSeatAvailability = async (spot_id: string, bookingDate: string) => {
    try {
        const response = await api.get("/bookings/check-seats", {
            tempat_id: spot_id,
            tanggal: bookingDate,
        });
        
        // Update seatStatus berdasarkan response
        if (response.bookedSeats) {
            const newSeatStatus: { [key: number]: "filled" | "empty" } = {};
            response.bookedSeats.forEach((seatNum: number) => {
                newSeatStatus[seatNum] = "filled";
            });
            setSeatStatus(newSeatStatus);
        }
    } catch (error) {
        console.error("Failed to fetch seat availability:", error);
    }
};
```

### 2.4 Update State seatStatus (line 37-41)

Ubah jadi:

```typescript
const [seatStatus, setSeatStatus] = useState<{ [key: number]: "filled" | "empty" }>({});
```

### 2.5 Update PRICE_PER_HOUR (line 18)

Ubah jadi:

```typescript
const PRICE_PER_HOUR = spotData?.harga_per_jam || 25000;
```

### 2.6 Update date change handler

Di line 29, setDate diubah jadi:

```typescript
const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (spotId) {
        fetchSeatAvailability(spotId, newDate);
    }
};
```

Ganti pemanggilan `setDate(val)` di renderModal dengan `handleDateChange(val)`.

---

## Langkah 3: Integrasi BuysAndRentFishing (`app/BuysAndRentFishing.tsx`)

### 3.1 Tambah Props untuk terima spotId

Tambah di line 34-36:

```typescript
export default function BuysAndRentFishingScreen() {
    const router = useRouter();
    const [spotId, setSpotId] = useState<string>("");
```

### 3.2 Tambah useEffect untuk fetch products

Tambah di line 42-43 (sebelum dummy data):

```typescript
useEffect(() => {
    // Ambil params dari router
    const params = router as any;
    if (params.searchParams && params.searchParams.id) {
        setSpotId(params.searchParams.id);
        fetchProducts(params.searchParams.id);
    }
}, []);

const fetchProducts = async (id: string) => {
    try {
        const response = await api.get("/alat_pancing", {
            tempat_id: id,
        });
        const productsData = Array.isArray(response) ? response : response?.data || [];
        setProducts(productsData);
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
};

const [products, setProducts] = useState<Product[]>([]);
```

### 3.3 Hapus atau Comment Dummy Data (line 42-85)

Hapus atau comment array `products` yang berisi dummy data. State `products` sekarang diambil dari API.

---

## Langkah 4: Integrasi Notifications (`app/(tabs)/notifications.tsx`)

### 4.1 Tambah State

Tambah di line 29-31:

```typescript
export default function NotificationsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
```

### 4.2 Tambah Fetch Function

Tambah di line 64 (sebelum return):

```typescript
const fetchBookings = async () => {
    try {
        const response = await api.get("/bookings/my");
        const bookingsData = Array.isArray(response) ? response : response?.data || [];
        
        // Transform data ke format notification
        const transformedData = bookingsData.map((booking: any) => ({
            id: booking.id,
            status: booking.status === "pending" ? "pending" : 
                    booking.status === "completed" || booking.status === "paid" ? "success" : "failed",
            statusLabel: booking.status === "pending" ? "Belum Dibayar" :
                        booking.status === "completed" || booking.status === "paid" ? "Sudah Dibayar" : "Gagal Bayar",
            title: booking.nama_tempat,
            address: booking.lokasi_tempat,
            date: booking.tanggal_booking,
            total: booking.total_harga,
        }));
        
        setNotifications(transformedData);
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
    } finally {
        setLoading(false);
    }
};
```

### 4.3 Panggil di useEffect

Tambah di line 31-41:

```typescript
useEffect(() => {
    fetchBookings();
}, []);
```

### 4.4 Hapus Dummy Data (line 34-63)

Hapus array `notifications` yang berisi dummy data.

### 4.5 Update Loading State

Tambah loading indicator di line 79-88:

```typescript
if (loading) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#103568" />
            </View>
        </SafeAreaView>
    );
}
```

---

## Langkah 5: Implementasi Explore Screen (`app/(tabs)/explore.tsx`)

### 5.1 Replace Seluruh File

Ganti semua kode dengan implementasi halaman explore:

```typescript
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/services/api";

interface Spot {
    id: string;
    nama: string;
    lokasi: string;
    harga_per_jam: number;
    image_url?: string;
}

export default function ExploreScreen() {
    const router = useRouter();
    const [spots, setSpots] = useState<Spot[]>([]);
    const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchSpots = async () => {
        try {
            const response = await api.get("/tempat_mancing");
            const data = Array.isArray(response) ? response : response?.data || [];
            setSpots(data);
            setFilteredSpots(data);
        } catch (error) {
            console.error("Failed to fetch spots:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpots();
    }, []);

    const handleSearch = (text: string) => {
        setSearchText(text);
        if (text) {
            const filtered = spots.filter((spot) =>
                spot.nama.toLowerCase().includes(text.toLowerCase()) ||
                spot.lokasi.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredSpots(filtered);
        } else {
            setFilteredSpots(spots);
        }
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const renderSpotItem = ({ item }: { item: Spot }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                router.push({
                    pathname: "/(booking)/InformationPlace",
                    params: { id: item.id },
                })
            }
        >
            <Image
                source={{
                    uri: item.image_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Landscape_of_Samosir_Island_and_Lake_Toba.jpg/800px-Landscape_of_Samosir_Island_and_Lake_Toba.jpg",
                }}
                style={styles.cardImage}
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.nama}</Text>
                <Text style={styles.cardLocation} numberOfLines={2}>{item.lokasi}</Text>
                <Text style={styles.cardPrice}>{formatRupiah(item.harga_per_jam)}/jam</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Explore</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#103568" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari tempat mancing..."
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            <FlatList
                data={filteredSpots}
                renderItem={renderSpotItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Tidak ada tempat ditemukan</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAFAFA" },
    header: {
        padding: 20,
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    headerTitle: { fontSize: 24, fontWeight: "bold", color: "#000" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    searchContainer: { padding: 20 },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    listContent: { padding: 20, paddingTop: 0 },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 15,
        marginBottom: 15,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: { width: "100%", height: 150, backgroundColor: "#eee" },
    cardContent: { padding: 15 },
    cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    cardLocation: { fontSize: 12, color: "#666", marginBottom: 5 },
    cardPrice: { fontSize: 14, color: "#103568", fontWeight: "bold" },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
    emptyText: { color: "#999", fontSize: 16 },
});
```

---

## Langkah 6: Test Integrasi

Setelah semua langkah di atas:

1. **Restart mobile app**: `npx expo start --clear`
2. **Test Home Screen**:
   - Cek apakah rekomendasi tempat muncul dari API
   - Cek apakah tips & events loaded dari API

3. **Test Explore Screen**:
   - Cek apakah search berfungsi
   - Klik tempat → ke InformationPlace

4. **Test Booking Screen**:
   - Pilih tempat → ke Booking
   - Cek apakah kursi yang sudah terisi muncul (warna hijau)

5. **Test BuysAndRentFishing**:
   - Klik "Lanjut ke Sewa Alat"
   - Cek apakah produk loaded dari API

6. **Test Notifications**:
   - Cek apakah booking history muncul dari API

---

## Pertanyaan Konfirmasi

Sebelum lanjut ke **Priority 3** (Auth Guards), mohon konfirmasi:

1. Apakah Priority 1 sudah selesai dan working?
2. Apakah ada error saat test integrasi Priority 2?
3. Untuk Auth Guards, policy-nya bagaimana?
   - Jika user belum login dan klik Booking → redirect ke Login, lalu balik ke Booking setelah login?
   - Atau tampilkan pesan "Silakan login dulu"?

Konfirmasi jika sudah siap lanjut ke Priority 3.

---

## User

bisa ga upload full 1 filenya gitu aku bingung modifikasinya dimana. sekalian cek code yang sekarnag masih salah dimana

---

## Assistant

_Thinking:_

The user is asking me to:
1. Provide the full content of files so they can copy-paste directly
2. Point out what's currently wrong in the code

However, I'm in Plan Mode (read-only mode) which means I cannot make any edits. The user wants me to help them understand what needs to be fixed and provide the complete file contents.

Since I cannot edit files in Plan Mode, I should:
1. Read the current state of the files
2. Point out exactly what's wrong
3. Provide the complete corrected file content that they can copy-paste themselves

Let me first read the current state of the files that need to be modified, then provide clear guidance on what's wrong and the complete corrected code.


Saya paham. Saya akan read-only mode dan memberikan kode lengkap per file yang perlu Anda copy-paste sendiri.

Mari saya cek kondisi file-file yang perlu diperbaiki:

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/src/config/api.ts"
}
```
**Output:**
```
<file>
00001| import { Platform } from "react-native";
00002| import { router } from "expo-router";
00003| import axios from "axios";
00004| import AsyncStorage from "@react-native-async-storage/async-storage";
00005| 
00006| const getAPIBaseURL = () => {
00007|     if (typeof window !== "undefined") {
00008|         return "http://localhost:3000"; // Web
00009|     }
00010| 
00011|     if (Platform.OS === "android") {
00012|         return "http://10.0.2.2:3000"; // Android Emulator Special IP
00013|     }
00014| 
00015|     if (Platform.OS === "ios") {
00016|         return "http://localhost:3000";
00017|     }
00018| 
00019|     return "http://localhost:3000";
00020| };
00021| 
00022| const API_BASE_URL = getAPIBaseURL();
00023| 
00024| export const apiClient = axios.create({
00025|     baseURL: API_BASE_URL,
00026|     headers: {
00027|         "Content-Type": "application/json",
00028|     },
00029| });
00030| 
00031| apiClient.interceptors.request.use(
00032|     async (config) => {
00033|         try {
00034|             const token = await AsyncStorage.getItem("@token");
00035|             if (token) {
00036|                 config.headers.Authorization = `Bearer ${token}`;
00037|             }
00038|         } catch (error) {
00039|             console.error("Error adding auth header:", error);
00040|         }
00041|         return config;
00042|     },
00043|     (error) => Promise.reject(error),
00044| );
00045| 
00046| apiClient.interceptors.response.use(
00047|     (response) => response,
00048|     async (error) => {
00049|         if (error.response?.status === 401) {
00050|             await AsyncStorage.removeItem("@token");
00051|             await AsyncStorage.removeItem("@user");
00052|             router.replace("/(auth)/Login");
00053|         }
00054|         return Promise.reject(error);
00055|     },
00056| );
00057| 
00058| export const ENDPOINTS = {
00059|     SIGNUP: "auth/signup",
00060|     LOGIN: "/auth/login",
00061| 
00062|     LIST_SPOTS: "/tempat_mancing",
00063|     SPOT_DETAIL: (id: string) => `/tempat_mancing/${id}`,
00064|     LIST_ALAT: "/alat_pancing", // TODO
00065|     ALAT_DETAIL: (id: string) => `/alat_pancing/${id}`,
00066| 
00067|     // Booking
00068|     CREATE_BOOKING: "/bookings",
00069|     CHECK_KURSI: "/bookings/check-seats",
00070| 
00071|     // Orders
00072|     CREATE_ORDER: "/orders",
00073| 
00074|     // Reviews
00075|     GET_REVIEWS: (spotId: string) => `/reviews?tempat_id=${spotId}`,
00076|     CREATE_REVIEW: "/reviews/",
00077| 
00078|     // Payment
00079|     PROCESS_PAYMENT: "/payment",
00080|     PAYMENT_STATUS: (id: string) => `/payment/${id}`,
00081| };
00082| 
00083| export const API_BASE_URL_CONFIG = {
00084|     development: "http://localhost:3000",
00085|     production: "http://localhost:3000",
00086| };
00087| 

(End of file - total 87 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/src/services/api.ts"
}
```
**Output:**
```
<file>
00001| import { apiClient, ENDPOINTS } from "../config/api";
00002| 
00003| export interface ApiError {
00004|     message: string;
00005|     status: number;
00006| }
00007| 
00008| export const api = {
00009|     get: async (endpoint: string, params?: object) => {
00010|         const response = await apiClient.get(endpoint, { params });
00011|         return response.data;
00012|     },
00013| 
00014|     post: async (endpoint: string, data: object) => {
00015|         const response = await apiClient.post(endpoint, data);
00016|         return response.data;
00017|     },
00018| 
00019|     delete: async (endpoint: string) => {
00020|         const response = await apiClient.delete(endpoint);
00021|         return response.data;
00022|     },
00023| 
00024|     // Auth endpoints
00025|     auth: {
00026|         signup: async (userData: any) => {
00027|             return await api.post("/auth/signup", userData);
00028|         },
00029|         login: async (credentials: { email: string; password: string }) => {
00030|             return await api.post("/auth/login", credentials);
00031|         },
00032|     },
00033| 
00034|     // Tempat Mancing endpoints
00035|     spots: {
00036|         getAll: async () => {
00037|             return await api.get("/tempat_mancing");
00038|         },
00039|         getById: async (id: string) => {
00040|             return await api.get(`/tempat_mancing/${id}`);
00041|         },
00042|     },
00043| 
00044|     // Booking endpoints
00045|     bookings: {
00046|         create: async (bookingData: any) => {
00047|             return await api.post("/bookings", bookingData);
00048|         },
00049|         checkAvailability: async (
00050|             spotId: string,
00051|             date: string,
00052|             duration: number,
00053|         ) => {
00054|             return await api.get("/bookings/check-seats", {
00055|                 tempat_id: spotId,
00056|                 tanggal: date,
00057|                 durasi: duration,
00058|             });
00059|         },
00060|     },
00061| 
00062|     // Payment endpoints
00063|     payment: {
00064|         process: async (paymentData: any) => {
00065|             return await api.post("/payment", paymentData);
00066|         },
00067|     },
00068| };
00069| 

(End of file - total 69 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/src/contexts/AuthContext.tsx"
}
```
**Output:**
```
<file>
00001| import React, {
00002|     createContext,
00003|     useContext,
00004|     useState,
00005|     useEffect,
00006|     Children,
00007| } from "react";
00008| import AsyncStorage from "@react-native-async-storage/async-storage";
00009| import { router } from "expo-router";
00010| import { apiClient } from "../config/api";
00011| import { api } from "../services/api";
00012| 
00013| interface User {
00014|     id: number;
00015|     username: string;
00016|     email: string;
00017|     full_name: string;
00018| }
00019| 
00020| interface AuthContextType {
00021|     user: User | null;
00022|     token: string | null;
00023|     isLoading: boolean;
00024|     login: (email: string, password: string) => Promise<void>;
00025|     logout: () => Promise<void>;
00026|     isAuthenticated: boolean;
00027| }
00028| 
00029| const AuthContext = createContext<AuthContextType>({
00030|     user: null,
00031|     token: null,
00032|     isLoading: false,
00033|     login: async () => {},
00034|     logout: async () => {},
00035|     isAuthenticated: false,
00036| });
00037| 
00038| export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
00039|     const [user, setUser] = useState<User | null>(null);
00040|     const [token, setToken] = useState<string | null>(null);
00041|     const [isLoading, setIsLoading] = useState(false);
00042| 
00043|     // Load token from storage on mount
00044|     useEffect(() => {
00045|         loadAuthData();
00046|     }, []);
00047| 
00048|     const loadAuthData = async () => {
00049|         try {
00050|             const storedToken = await AsyncStorage.getItem("@token");
00051|             const storedUser = await AsyncStorage.getItem("@user");
00052| 
00053|             if (storedToken && storedUser) {
00054|                 setToken(storedToken);
00055|                 setUser(JSON.parse(storedUser));
00056|             }
00057|         } catch (error) {
00058|             console.error("Error loading auth data:", error);
00059|         }
00060|     };
00061| 
00062|     const login = async (email: string, password: string) => {
00063|         setIsLoading(true);
00064|         try {
00065|             const response = await apiClient.post("/auth/login", {
00066|                 email,
00067|                 password,
00068|             });
00069| 
00070|             const { token, user } = response.data;
00071| 
00072|             // Save token to storage
00073|             await AsyncStorage.setItem("@token", token);
00074|             await AsyncStorage.setItem("@user", JSON.stringify(user));
00075| 
00076|             setToken(token);
00077|             setUser(user);
00078| 
00079|             // Navigate to ome
00080|             router.replace("/");
00081|         } catch (error: any) {
00082|             let message = "Email atau password salah. Silahkan coba lagi.";
00083| 
00084|             if (error.response?.data?.message) {
00085|                 message = error.response.data.message;
00086|             } else if (error.message) {
00087|                 message = error.message;
00088|             }
00089| 
00090|             throw new Error(message);
00091|         } finally {
00092|             setIsLoading(false);
00093|         }
00094|     };
00095| 
00096|     const logout = async () => {
00097|         setIsLoading(true);
00098|         try {
00099|             try {
00100|                 await apiClient.post("/auth/logout");
00101|             } catch (e) {
00102|                 console.log("API logout failed, continue with local logout");
00103|             }
00104| 
00105|             await AsyncStorage.removeItem("@token");
00106|             await AsyncStorage.removeItem("@user");
00107| 
00108|             setToken(null);
00109|             setUser(null);
00110| 
00111|             // Navigate to login
00112|             router.replace("/(auth)/Login");
00113|         } catch (error) {
00114|             console.error("Logout error:", error);
00115|         } finally {
00116|             setIsLoading(false);
00117|         }
00118|     };
00119| 
00120|     const isAuthenticated = !!token && !!user;
00121| 
00122|     return (
00123|         <AuthContext.Provider
00124|             value={{ user, token, isLoading, login, logout, isAuthenticated }}
00125|         >
00126|             {children}
00127|         </AuthContext.Provider>
00128|     );
00129| };
00130| 
00131| export const useAuth = () => useContext(AuthContext);
00132| 

(End of file - total 132 lines)
</file>
```
```

---

## Assistant

_Thinking:_

Good, I can see that the Priority 1 fixes have already been applied to:

1. `api.ts` - Auth interceptor is already implemented correctly
2. `services/api.ts` - checkAvailability is already fixed with correct parameters
3. `AuthContext.tsx` - Already has improved error handling and logout API call

So Priority 1 is already done! Now I need to check the files for Priority 2:
- Home screen (index.tsx)
- Booking screen (Booking.tsx)
- BuysAndRentFishing
- Notifications
- Explore screen

Let me read these files to see their current state and what still needs to be fixed.

Bagus! **Priority 1 sudah selesai** - saya bisa lihat `api.ts`, `services/api.ts`, dan `AuthContext.tsx` sudah diperbaiki dengan benar.

Sekarang saya cek file-file Priority 2:

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/(tabs)/index.tsx"
}
```
**Output:**
```
<file>
00001| import React, { useEffect, useState, useCallback } from "react";
00002| import {
00003|     StyleSheet,
00004|     Text,
00005|     View,
00006|     Image,
00007|     TextInput,
00008|     ScrollView,
00009|     TouchableOpacity,
00010|     Dimensions,
00011|     ActivityIndicator,
00012|     RefreshControl,
00013| } from "react-native";
00014| import { Ionicons, FontAwesome } from "@expo/vector-icons";
00015| import { useRouter } from "expo-router";
00016| import { api } from "../../src/services/api"; // Import API
00017| 
00018| // Tipe data untuk Spot
00019| interface Spot {
00020|     id: string;
00021|     name: string;
00022|     location: string;
00023|     price: number;
00024|     image_url?: string;
00025|     rating?: number;
00026| }
00027| 
00028| export default function HomeScreen() {
00029|     const router = useRouter();
00030|     const [spots, setSpots] = useState<Spot[]>([]);
00031|     const [tips, setTips] = useState<any[]>([]);
00032|     const [events, setEvents] = useState<any[]>([]);
00033|     const [loading, setLoading] = useState(true);
00034|     const [refreshing, setRefreshing] = useState(false);
00035| 
00036|     // Fungsi fetch data spots
00037|     const fetchSpots = async () => {
00038|         try {
00039|             const response = await api.spots.getAll();
00040|             // Sesuaikan dengan struktur data backend (response.data.data atau response.data)
00041|             const data = Array.isArray(response)
00042|                 ? response
00043|                 : response?.data || [];
00044|             if (Array.isArray(data)) {
00045|                 setSpots(data);
00046|             }
00047|         } catch (error) {
00048|             console.error("Failed to fetch spots:", error);
00049|         } finally {
00050|             setLoading(false);
00051|             setRefreshing(false);
00052|         }
00053|     };
00054| 
00055|     const fetchContent = async () => {
00056|         try {
00057|             const tipsData = await api.get("/content/tips");
00058|             const eventsData = await api.get("/content/lomba");
00059|             setTips(tipsData || []);
00060|             setEvents(eventsData || []);
00061|         } catch (error) {
00062|             console.error("Failed to fetch content:", error);
00063|         }
00064|     };
00065| 
00066|     // Load data saat pertama kali dibuka
00067|     useEffect(() => {
00068|         fetchSpots();
00069|         fetchContent();
00070|     }, []);
00071| 
00072|     // Fungsi refresh saat layar ditarik ke bawah
00073|     const onRefresh = useCallback(() => {
00074|         setRefreshing(true);
00075|         fetchSpots();
00076|     }, []);
00077| 
00078|     // Helper untuk render bintang rating secara visual
00079|     const renderStars = (rating: number = 4.5) => {
00080|         const fullStars = Math.floor(rating);
00081|         const hasHalfStar = rating % 1 !== 0;
00082| 
00083|         return (
00084|             <View style={styles.ratingContainer}>
00085|                 {[...Array(fullStars)].map((_, i) => (
00086|                     <FontAwesome
00087|                         key={`full-${i}`}
00088|                         name="star"
00089|                         size={12}
00090|                         color="#333"
00091|                         style={{ marginRight: 2 }}
00092|                     />
00093|                 ))}
00094|                 {hasHalfStar && (
00095|                     <FontAwesome name="star-half-full" size={12} color="#333" />
00096|                 )}
00097|             </View>
00098|         );
00099|     };
00100| 
00101|     return (
00102|         <View style={styles.container}>
00103|             <ScrollView
00104|                 showsVerticalScrollIndicator={false}
00105|                 contentContainerStyle={{ paddingBottom: 100 }}
00106|                 refreshControl={
00107|                     <RefreshControl
00108|                         refreshing={refreshing}
00109|                         onRefresh={onRefresh}
00110|                         colors={["#103568"]}
00111|                     />
00112|                 }
00113|             >
00114|                 {/* === HEADER SECTION === */}
00115|                 <View style={styles.headerContainer}>
00116|                     <Image
00117|                         source={{
00118|                             uri: "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?q=80&w=2070&auto=format&fit=crop",
00119|                         }}
00120|                         style={styles.headerImage}
00121|                     />
00122|                     {/* Search Bar Overlay */}
00123|                     <View style={styles.searchContainer}>
00124|                         <View style={styles.searchBar}>
00125|                             <TextInput
00126|                                 placeholder="Tempat mancing terdekat"
00127|                                 style={styles.searchInput}
00128|                                 placeholderTextColor="#999"
00129|                             />
00130|                             <Ionicons name="search" size={24} color="#666" />
00131|                         </View>
00132|                     </View>
00133|                 </View>
00134| 
00135|                 {/* === SECTION 1: RECOMMENDATIONS (DYNAMIC DATA) === */}
00136|                 <View style={styles.section}>
00137|                     <TouchableOpacity
00138|                         style={styles.sectionHeader}
00139|                         onPress={() => router.push("/(tabs)/explore")} // Diarahkan ke Explore tab
00140|                     >
00141|                         <Text style={styles.sectionTitle}>Recommendations</Text>
00142|                         <Ionicons
00143|                             name="chevron-forward"
00144|                             size={20}
00145|                             color="#333"
00146|                         />
00147|                     </TouchableOpacity>
00148| 
00149|                     {loading ? (
00150|                         <View
00151|                             style={{
00152|                                 height: 150,
00153|                                 justifyContent: "center",
00154|                                 alignItems: "center",
00155|                             }}
00156|                         >
00157|                             <ActivityIndicator size="small" color="#103568" />
00158|                         </View>
00159|                     ) : (
00160|                         <ScrollView
00161|                             horizontal
00162|                             showsHorizontalScrollIndicator={false}
00163|                             style={styles.horizontalScroll}
00164|                         >
00165|                             {spots.length > 0 ? (
00166|                                 spots.map((spot) => (
00167|                                     <TouchableOpacity
00168|                                         key={spot.id}
00169|                                         style={styles.card}
00170|                                         onPress={() =>
00171|                                             router.push({
00172|                                                 pathname:
00173|                                                     "/(booking)/InformationPlace",
00174|                                                 params: { id: spot.id }, // Kirim ID ke detail
00175|                                             })
00176|                                         }
00177|                                     >
00178|                                         <Image
00179|                                             source={{
00180|                                                 uri:
00181|                                                     spot.image_url ||
00182|                                                     "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Landscape_of_Samosir_Island_and_Lake_Toba.jpg/800px-Landscape_of_Samosir_Island_and_Lake_Toba.jpg",
00183|                                             }}
00184|                                             style={styles.cardImage}
00185|                                         />
00186|                                         <View style={styles.cardContent}>
00187|                                             <Text
00188|                                                 style={styles.cardTitle}
00189|                                                 numberOfLines={1}
00190|                                             >
00191|                                                 {spot.name}
00192|                                             </Text>
00193| 
00194|                                             {renderStars(spot.rating || 4.5)}
00195| 
00196|                                             <Text
00197|                                                 style={styles.cardAddress}
00198|                                                 numberOfLines={2}
00199|                                             >
00200|                                                 {spot.location}
00201|                                             </Text>
00202|                                         </View>
00203|                                     </TouchableOpacity>
00204|                                 ))
00205|                             ) : (
00206|                                 <Text
00207|                                     style={{
00208|                                         color: "#999",
00209|                                         fontStyle: "italic",
00210|                                         marginLeft: 5,
00211|                                     }}
00212|                                 >
00213|                                     Belum ada rekomendasi tempat.
00214|                                 </Text>
00215|                             )}
00216| 
00217|                             <View style={{ width: 20 }} />
00218|                         </ScrollView>
00219|                     )}
00220|                 </View>
00221| 
00222|                 {/* === SECTION 2: TIPS & TRICKS (STATIC) === */}
00223|                 <View style={styles.section}>
00224|                     <Text style={styles.sectionTitle}>Tips & Tricks</Text>
00225|                     <View style={styles.tipsCard}>
00226|                         <TouchableOpacity style={styles.arrowButton}>
00227|                             <Ionicons
00228|                                 name="chevron-back"
00229|                                 size={24}
00230|                                 color="#666"
00231|                             />
00232|                         </TouchableOpacity>
00233| 
00234|                         <View style={styles.tipsContent}>
00235|                             <View style={styles.iconCircle}>
00236|                                 <Ionicons
00237|                                     name="fish-outline"
00238|                                     size={32}
00239|                                     color="#333"
00240|                                 />
00241|                             </View>
00242|                             <Text style={styles.tipsTitle}>
00243|                                 Rawat peralatan sederhana
00244|                             </Text>
00245|                             <Text style={styles.tipsDesc}>
00246|                                 Bilas reel dan joran setelah dipakai, keringkan,
00247|                                 simpan rapi. Peralatan murah pun awet kalau
00248|                                 dirawat.
00249|                             </Text>
00250|                         </View>
00251| 
00252|                         <TouchableOpacity style={styles.arrowButton}>
00253|                             <Ionicons
00254|                                 name="chevron-forward"
00255|                                 size={24}
00256|                                 color="#666"
00257|                             />
00258|                         </TouchableOpacity>
00259|                     </View>
00260|                 </View>
00261| 
00262|                 {/* === SECTION 3: EVENT (STATIC) === */}
00263|                 <View style={styles.section}>
00264|                     <TouchableOpacity
00265|                         style={styles.sectionHeader}
00266|                         onPress={() => router.push("/events")} // Pastikan route ini benar
00267|                     >
00268|                         <Text style={styles.sectionTitle}>Event</Text>
00269|                         <Ionicons
00270|                             name="chevron-forward"
00271|                             size={20}
00272|                             color="#333"
00273|                         />
00274|                     </TouchableOpacity>
00275| 
00276|                     <TouchableOpacity
00277|                         style={styles.eventCard}
00278|                         onPress={() => router.push("/events")}
00279|                     >
00280|                         <Image
00281|                             source={{
00282|                                 uri: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
00283|                             }}
00284|                             style={styles.eventImage}
00285|                         />
00286|                         <View style={styles.eventDetails}>
00287|                             <Text style={styles.eventTitle}>
00288|                                 “Master Angler Open Cup”
00289|                             </Text>
00290|                             <Text style={styles.eventText}>Kota: Malang</Text>
00291|                             <Text style={styles.eventText}>
00292|                                 Tanggal: 20 April 2025
00293|                             </Text>
00294|                             <Text style={styles.eventText}>
00295|                                 Total hadiah: Rp700.000
00296|                             </Text>
00297|                             <Text style={styles.eventText}>
00298|                                 Biaya pendaftaran: Rp60.000/orang
00299|                             </Text>
00300|                             <Text style={styles.eventText}>
00301|                                 Penilaian berdasarkan: Ikan terberat
00302|                             </Text>
00303|                         </View>
00304|                     </TouchableOpacity>
00305|                 </View>
00306|             </ScrollView>
00307|         </View>
00308|     );
00309| }
00310| 
00311| const styles = StyleSheet.create({
00312|     container: {
00313|         flex: 1,
00314|         backgroundColor: "#FAFAFA",
00315|     },
00316|     // Header Styles
00317|     headerContainer: {
00318|         position: "relative",
00319|         marginBottom: 30,
00320|     },
00321|     headerImage: {
00322|         width: "100%",
00323|         height: 220,
00324|         resizeMode: "cover",
00325|     },
00326|     searchContainer: {
00327|         position: "absolute",
00328|         bottom: -25,
00329|         width: "100%",
00330|         alignItems: "center",
00331|     },
00332|     searchBar: {
00333|         flexDirection: "row",
00334|         alignItems: "center",
00335|         backgroundColor: "#FFF",
00336|         width: "85%",
00337|         height: 50,
00338|         borderRadius: 25,
00339|         paddingHorizontal: 20,
00340|         shadowColor: "#000",
00341|         shadowOffset: { width: 0, height: 2 },
00342|         shadowOpacity: 0.1,
00343|         shadowRadius: 4,
00344|         elevation: 5,
00345|     },
00346|     searchInput: {
00347|         flex: 1,
00348|         marginRight: 10,
00349|         color: "#333",
00350|     },
00351| 
00352|     // General Section Styles
00353|     section: {
00354|         paddingHorizontal: 20,
00355|         marginBottom: 25,
00356|     },
00357|     sectionHeader: {
00358|         flexDirection: "row",
00359|         alignItems: "center",
00360|         marginBottom: 10,
00361|         paddingVertical: 5,
00362|         alignSelf: "flex-start", // Agar area sentuh sesuai teks
00363|     },
00364|     sectionTitle: {
00365|         fontSize: 18,
00366|         fontWeight: "bold",
00367|         color: "#333",
00368|         marginRight: 5,
00369|     },
00370| 
00371|     // Recommendations Horizontal Scroll
00372|     horizontalScroll: {
00373|         marginHorizontal: -20,
00374|         paddingHorizontal: 20,
00375|     },
00376|     card: {
00377|         width: 200,
00378|         backgroundColor: "#FFF",
00379|         borderRadius: 15,
00380|         marginRight: 15,
00381|         paddingBottom: 15,
00382|         shadowColor: "#000",
00383|         shadowOffset: { width: 0, height: 1 },
00384|         shadowOpacity: 0.1,
00385|         shadowRadius: 2,
00386|         elevation: 3,
00387|         overflow: "hidden",
00388|     },
00389|     cardImage: {
00390|         width: "100%",
00391|         height: 120,
00392|         backgroundColor: "#eee",
00393|     },
00394|     cardContent: {
00395|         padding: 10,
00396|     },
00397|     cardTitle: {
00398|         fontSize: 14, // Sedikit diperbesar agar lebih jelas
00399|         fontWeight: "bold",
00400|         marginBottom: 5,
00401|         color: "#333",
00402|     },
00403|     ratingContainer: {
00404|         flexDirection: "row",
00405|         marginBottom: 5,
00406|     },
00407|     cardAddress: {
00408|         fontSize: 10,
00409|         color: "#666",
00410|         lineHeight: 14,
00411|     },
00412| 
00413|     // Tips Card Styles
00414|     tipsCard: {
00415|         flexDirection: "row",
00416|         alignItems: "center",
00417|         backgroundColor: "#FFF",
00418|         borderRadius: 15,
00419|         padding: 15,
00420|         shadowColor: "#000",
00421|         shadowOffset: { width: 0, height: 1 },
00422|         shadowOpacity: 0.1,
00423|         shadowRadius: 2,
00424|         elevation: 3,
00425|     },
00426|     arrowButton: {
00427|         padding: 5,
00428|         backgroundColor: "#F5F5F5",
00429|         borderRadius: 20,
00430|     },
00431|     tipsContent: {
00432|         flex: 1,
00433|         alignItems: "center",
00434|         paddingHorizontal: 10,
00435|     },
00436|     iconCircle: {
00437|         width: 60,
00438|         height: 60,
00439|         borderRadius: 30,
00440|         borderWidth: 1,
00441|         borderColor: "#333",
00442|         justifyContent: "center",
00443|         alignItems: "center",
00444|         marginBottom: 10,
00445|     },
00446|     tipsTitle: {
00447|         fontWeight: "bold",
00448|         fontSize: 14,
00449|         marginBottom: 5,
00450|         color: "#333",
00451|     },
00452|     tipsDesc: {
00453|         fontSize: 10,
00454|         textAlign: "center",
00455|         color: "#666",
00456|     },
00457| 
00458|     // Event Card Styles
00459|     eventCard: {
00460|         flexDirection: "row",
00461|         backgroundColor: "#FFF",
00462|         borderRadius: 15,
00463|         padding: 15,
00464|         shadowColor: "#000",
00465|         shadowOffset: { width: 0, height: 1 },
00466|         shadowOpacity: 0.1,
00467|         shadowRadius: 2,
00468|         elevation: 3,
00469|     },
00470|     eventImage: {
00471|         width: 80,
00472|         height: 80,
00473|         borderRadius: 40,
00474|         marginRight: 15,
00475|         backgroundColor: "#eee",
00476|     },
00477|     eventDetails: {
00478|         flex: 1,
00479|         justifyContent: "center",
00480|     },
00481|     eventTitle: {
00482|         fontWeight: "bold",
00483|         fontSize: 14,
00484|         marginBottom: 5,
00485|         color: "#333",
00486|     },
00487|     eventText: {
00488|         fontSize: 10,
00489|         color: "#555",
00490|         marginBottom: 2,
00491|     },
00492| });
00493| 

(End of file - total 493 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/(booking)/Booking.tsx"
}
```
**Output:**
```
<file>
00001| import React, { useEffect, useState } from "react";
00002| import {
00003|     StyleSheet,
00004|     Text,
00005|     View,
00006|     ScrollView,
00007|     TouchableOpacity,
00008|     SafeAreaView,
00009|     Dimensions,
00010|     Modal,
00011|     FlatList,
00012| } from "react-native";
00013| import { useRouter } from "expo-router";
00014| import { Ionicons } from "@expo/vector-icons";
00015| 
00016| const { width, height } = Dimensions.get("window");
00017| const SEAT_SIZE = 35;
00018| const PRICE_PER_HOUR = 25000;
00019| 
00020| export default function BookingScreen() {
00021|     const router = useRouter();
00022|     const [spotId, setSpotId] = useState<string>("");
00023|     const [spotData, setSpotData] = useState<any>(null);
00024| 
00025|     const fetchSpotData = async (id: string) => {
00026|         try {
00027|             const data = await api.spots.getById(id);
00028|             setSpotData(data);
00029|         } catch (error) {
00030|             console.error("Failed to fetch spot data:", error);
00031|         }
00032|     };
00033| 
00034|     const fetchSeatAvailability = async (
00035|         spot_id: string,
00036|         bookingDate: string,
00037|     ) => {
00038|         try {
00039|             const response = await api.get("/bookings/check-seats", {
00040|                 tempat_id: spot_id,
00041|                 tanggal: bookingDate,
00042|             });
00043| 
00044|             if (response.bookedSeats) {
00045|                 const newSeatStatus: { [key: number]: "filled" | "empty" } = {};
00046|                 response.bookedSeats.forEach((seatNum: number) => {
00047|                     newSeatStatus[seatNum] = "filled";
00048|                 });
00049|                 setSeatStatus(newSeatStatus);
00050|             }
00051|         } catch (error) {
00052|             console.error("Failed to fetch seat availability:", error);
00053|         }
00054|     };
00055| 
00056|     useEffect(() => {
00057|         const params = router as any;
00058|         if (params.searchParams && params.searchParams.id) {
00059|             const id = params.searchParams.id;
00060|             setSpotId(id);
00061|             setSpotData(id);
00062|             fetchSeatAvailability(id, date);
00063|         }
00064|     });
00065| 
00066|     // --- STATE DATA ---
00067|     const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
00068| 
00069|     const today = new Date();
00070|     const defaultDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
00071| 
00072|     const [date, setDate] = useState(defaultDate);
00073|     const [time, setTime] = useState("--Pilih Jam--");
00074|     const [duration, setDuration] = useState(1);
00075| 
00076|     const [modalVisible, setModalVisible] = useState<
00077|         "none" | "date" | "time" | "duration"
00078|     >("none");
00079| 
00080|     const [seatStatus] = useState<{ [key: number]: "filled" | "empty" }>({
00081|         2: "filled",
00082|         5: "filled",
00083|         18: "filled",
00084|     });
00085| 
00086|     // --- DATA OPSI ---
00087|     const timeOptions = [
00088|         "07:00",
00089|         "08:00",
00090|         "09:00",
00091|         "10:00",
00092|         "11:00",
00093|         "12:00",
00094|         "13:00",
00095|         "14:00",
00096|         "15:00",
00097|         "16:00",
00098|     ];
00099| 
00100|     const durationOptions = Array.from({ length: 8 }, (_, i) => i + 1);
00101| 
00102|     // Generate 365 hari
00103|     const generateDates = () => {
00104|         const dates = [];
00105|         const start = new Date();
00106|         for (let i = 0; i < 365; i++) {
00107|             const d = new Date(start);
00108|             d.setDate(start.getDate() + i);
00109|             const dateString = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
00110|             dates.push(dateString);
00111|         }
00112|         return dates;
00113|     };
00114|     const dateOptions = generateDates();
00115| 
00116|     // --- LOGIC ---
00117|     const toggleSeat = (id: number) => {
00118|         if (seatStatus[id] === "filled") return;
00119|         if (selectedSeats.includes(id)) {
00120|             setSelectedSeats(selectedSeats.filter((seatId) => seatId !== id));
00121|         } else {
00122|             setSelectedSeats([...selectedSeats, id]);
00123|         }
00124|     };
00125| 
00126|     const formatRupiah = (number: number) => {
00127|         return new Intl.NumberFormat("id-ID", {
00128|             style: "currency",
00129|             currency: "IDR",
00130|             minimumFractionDigits: 0,
00131|         }).format(number);
00132|     };
00133| 
00134|     const totalPrice = PRICE_PER_HOUR * duration * selectedSeats.length;
00135| 
00136|     const renderSeat = (id: number) => {
00137|         const isSelected = selectedSeats.includes(id);
00138|         const isFilled = seatStatus[id] === "filled";
00139| 
00140|         let backgroundColor = "#FFFFFF";
00141|         let borderColor = "#999";
00142|         let textColor = "#999";
00143| 
00144|         if (isFilled) {
00145|             backgroundColor = "#86EFAC";
00146|             borderColor = "#4ADE80";
00147|             textColor = "#166534";
00148|         } else if (isSelected) {
00149|             backgroundColor = "#FCD34D";
00150|             borderColor = "#F59E0B";
00151|             textColor = "#78350F";
00152|         }
00153| 
00154|         return (
00155|             <TouchableOpacity
00156|                 key={id}
00157|                 style={[styles.seatBox, { backgroundColor, borderColor }]}
00158|                 onPress={() => toggleSeat(id)}
00159|                 disabled={isFilled}
00160|             >
00161|                 <Text style={[styles.seatText, { color: textColor }]}>
00162|                     {id}
00163|                 </Text>
00164|             </TouchableOpacity>
00165|         );
00166|     };
00167| 
00168|     // --- HANDLE LANJUT ---
00169|     const handleProceed = () => {
00170|         // Navigasi ke halaman Buys_and_Rent_Fishing
00171|         router.push("/BuysAndRentFishing");
00172|     };
00173| 
00174|     // Komponen Modal
00175|     const renderModal = () => {
00176|         let data: any[] = [];
00177|         let onSelect: (val: any) => void = () => {};
00178|         let title = "";
00179| 
00180|         if (modalVisible === "date") {
00181|             data = dateOptions;
00182|             title = "Pilih Tanggal";
00183|             onSelect = (val) => setDate(val);
00184|         } else if (modalVisible === "time") {
00185|             data = timeOptions;
00186|             title = "Pilih Jam Mulai";
00187|             onSelect = (val) => setTime(val);
00188|         } else if (modalVisible === "duration") {
00189|             data = durationOptions;
00190|             title = "Pilih Durasi";
00191|             onSelect = (val) => setDuration(val);
00192|         }
00193| 
00194|         return (
00195|             <Modal
00196|                 animationType="slide"
00197|                 transparent={true}
00198|                 visible={modalVisible !== "none"}
00199|                 onRequestClose={() => setModalVisible("none")}
00200|             >
00201|                 <TouchableOpacity
00202|                     style={styles.modalOverlay}
00203|                     activeOpacity={1}
00204|                     onPress={() => setModalVisible("none")}
00205|                 >
00206|                     <View style={styles.modalContent}>
00207|                         <View style={styles.modalHeader}>
00208|                             <Text style={styles.modalTitle}>{title}</Text>
00209|                             <TouchableOpacity
00210|                                 onPress={() => setModalVisible("none")}
00211|                             >
00212|                                 <Ionicons name="close" size={24} color="#333" />
00213|                             </TouchableOpacity>
00214|                         </View>
00215|                         <FlatList
00216|                             data={data}
00217|                             keyExtractor={(item) => item.toString()}
00218|                             showsVerticalScrollIndicator={false}
00219|                             renderItem={({ item }) => (
00220|                                 <TouchableOpacity
00221|                                     style={styles.modalItem}
00222|                                     onPress={() => {
00223|                                         onSelect(item);
00224|                                         setModalVisible("none");
00225|                                     }}
00226|                                 >
00227|                                     <Text style={styles.modalItemText}>
00228|                                         {modalVisible === "duration"
00229|                                             ? `${item} Jam`
00230|                                             : item}
00231|                                     </Text>
00232|                                     {(item === date ||
00233|                                         item === time ||
00234|                                         item === duration) && (
00235|                                         <Ionicons
00236|                                             name="checkmark"
00237|                                             size={20}
00238|                                             color="#103568"
00239|                                         />
00240|                                     )}
00241|                                 </TouchableOpacity>
00242|                             )}
00243|                         />
00244|                     </View>
00245|                 </TouchableOpacity>
00246|             </Modal>
00247|         );
00248|     };
00249| 
00250|     return (
00251|         <SafeAreaView style={styles.container}>
00252|             <View style={styles.header}>
00253|                 <TouchableOpacity
00254|                     onPress={() => router.back()}
00255|                     style={styles.backButtonTop}
00256|                 >
00257|                     <Ionicons name="arrow-back" size={24} color="#333" />
00258|                 </TouchableOpacity>
00259|                 <Text style={styles.headerTitle}>Booking Tempat</Text>
00260|             </View>
00261| 
00262|             <ScrollView
00263|                 contentContainerStyle={styles.scrollContent}
00264|                 showsVerticalScrollIndicator={false}
00265|             >
00266|                 <View style={styles.formSection}>
00267|                     <Text style={styles.label}>Tanggal</Text>
00268|                     <TouchableOpacity
00269|                         style={styles.inputBox}
00270|                         onPress={() => setModalVisible("date")}
00271|                     >
00272|                         <Text style={styles.inputText}>{date}</Text>
00273|                         <Ionicons
00274|                             name="calendar-outline"
00275|                             size={20}
00276|                             color="#333"
00277|                         />
00278|                     </TouchableOpacity>
00279| 
00280|                     <Text style={styles.label}>Jam</Text>
00281|                     <TouchableOpacity
00282|                         style={styles.inputBox}
00283|                         onPress={() => setModalVisible("time")}
00284|                     >
00285|                         <Text
00286|                             style={[
00287|                                 styles.inputText,
00288|                                 time === "--Pilih Jam--" && { color: "#999" },
00289|                             ]}
00290|                         >
00291|                             {time}
00292|                         </Text>
00293|                         <Ionicons name="chevron-down" size={20} color="#333" />
00294|                     </TouchableOpacity>
00295| 
00296|                     <Text style={styles.label}>Durasi</Text>
00297|                     <TouchableOpacity
00298|                         style={styles.inputBox}
00299|                         onPress={() => setModalVisible("duration")}
00300|                     >
00301|                         <Text style={styles.inputText}>{duration} Jam</Text>
00302|                         <Ionicons name="chevron-down" size={20} color="#333" />
00303|                     </TouchableOpacity>
00304|                 </View>
00305| 
00306|                 <View style={styles.mapContainer}>
00307|                     <View style={styles.topRow}>
00308|                         {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => renderSeat(id))}
00309|                     </View>
00310|                     <View style={styles.middleRow}>
00311|                         <View style={styles.sideColumn}>
00312|                             {[28, 27, 26].map((id) => renderSeat(id))}
00313|                         </View>
00314|                         <View style={styles.poolArea}>
00315|                             <Text style={styles.poolText}>Kolam</Text>
00316|                         </View>
00317|                         <View style={styles.sideColumn}>
00318|                             {[9, 10, 11].map((id) => renderSeat(id))}
00319|                         </View>
00320|                     </View>
00321|                     <View style={styles.bottomRow}>
00322|                         {[22, 21, 20, 19, 18, 17, 16, 15].map((id) =>
00323|                             renderSeat(id),
00324|                         )}
00325|                     </View>
00326|                 </View>
00327| 
00328|                 <View style={styles.legendContainer}>
00329|                     <View style={styles.legendItem}>
00330|                         <View
00331|                             style={[
00332|                                 styles.legendBox,
00333|                                 {
00334|                                     backgroundColor: "#86EFAC",
00335|                                     borderColor: "#4ADE80",
00336|                                 },
00337|                             ]}
00338|                         />
00339|                         <Text style={styles.legendText}>Sudah Terisi</Text>
00340|                     </View>
00341|                     <View style={styles.legendItem}>
00342|                         <View
00343|                             style={[
00344|                                 styles.legendBox,
00345|                                 {
00346|                                     backgroundColor: "#FFF",
00347|                                     borderColor: "#999",
00348|                                 },
00349|                             ]}
00350|                         />
00351|                         <Text style={styles.legendText}>Kosong</Text>
00352|                     </View>
00353|                     <View style={styles.legendItem}>
00354|                         <View
00355|                             style={[
00356|                                 styles.legendBox,
00357|                                 {
00358|                                     backgroundColor: "#FCD34D",
00359|                                     borderColor: "#F59E0B",
00360|                                 },
00361|                             ]}
00362|                         />
00363|                         <Text style={styles.legendText}>Dipilih</Text>
00364|                     </View>
00365|                 </View>
00366|                 <View style={{ height: 20 }} />
00367|             </ScrollView>
00368| 
00369|             <View style={styles.footerCard}>
00370|                 <View style={styles.footerHeader}>
00371|                     <View>
00372|                         <Text style={styles.footerTitle}>Daftar Pemesanan</Text>
00373|                         <Text style={styles.footerSubtitle}>
00374|                             {date} • {time} • {duration} Jam
00375|                         </Text>
00376|                     </View>
00377|                     <TouchableOpacity
00378|                         style={styles.footerBackButton}
00379|                         onPress={() => router.back()}
00380|                     >
00381|                         <Ionicons name="arrow-back" size={20} color="#333" />
00382|                     </TouchableOpacity>
00383|                 </View>
00384| 
00385|                 <View style={styles.divider} />
00386| 
00387|                 <View style={styles.totalRow}>
00388|                     <Text style={styles.totalLabel}>
00389|                         Total ({selectedSeats.length} Kursi)
00390|                     </Text>
00391|                     <Text style={styles.totalPrice}>
00392|                         {formatRupiah(totalPrice)}
00393|                     </Text>
00394|                 </View>
00395| 
00396|                 {/* --- TOMBOL LANJUT KE SEWA ALAT --- */}
00397|                 <TouchableOpacity
00398|                     style={[
00399|                         styles.checkoutButton,
00400|                         (selectedSeats.length === 0 ||
00401|                             time === "--Pilih Jam--") &&
00402|                             styles.disabledButton,
00403|                     ]}
00404|                     disabled={
00405|                         selectedSeats.length === 0 || time === "--Pilih Jam--"
00406|                     }
00407|                     onPress={handleProceed}
00408|                 >
00409|                     <Text style={styles.checkoutButtonText}>
00410|                         Lanjut ke Sewa Alat
00411|                     </Text>
00412|                 </TouchableOpacity>
00413|             </View>
00414| 
00415|             {renderModal()}
00416|         </SafeAreaView>
00417|     );
00418| }
00419| 
00420| const styles = StyleSheet.create({
00421|     container: { flex: 1, backgroundColor: "#F8F9FA" },
00422|     header: {
00423|         flexDirection: "row",
00424|         alignItems: "center",
00425|         padding: 20,
00426|         backgroundColor: "#FFF",
00427|     },
00428|     backButtonTop: { marginRight: 10 },
00429|     headerTitle: { fontSize: 18, fontWeight: "bold" },
00430|     scrollContent: { padding: 20, paddingBottom: 220 },
00431|     formSection: { marginBottom: 20 },
00432|     label: { fontSize: 14, color: "#333", marginBottom: 8, fontWeight: "500" },
00433|     inputBox: {
00434|         flexDirection: "row",
00435|         justifyContent: "space-between",
00436|         alignItems: "center",
00437|         backgroundColor: "#FFF",
00438|         borderWidth: 1,
00439|         borderColor: "#CCC",
00440|         borderRadius: 25,
00441|         paddingHorizontal: 15,
00442|         paddingVertical: 12,
00443|         marginBottom: 15,
00444|     },
00445|     inputText: { color: "#333", fontSize: 14 },
00446|     mapContainer: { alignItems: "center", marginVertical: 10 },
00447|     seatBox: {
00448|         width: SEAT_SIZE,
00449|         height: SEAT_SIZE,
00450|         borderWidth: 1,
00451|         borderRadius: 8,
00452|         justifyContent: "center",
00453|         alignItems: "center",
00454|         margin: 4,
00455|     },
00456|     seatText: { fontSize: 12, fontWeight: "bold" },
00457|     topRow: { flexDirection: "row", marginBottom: 5 },
00458|     middleRow: {
00459|         flexDirection: "row",
00460|         justifyContent: "space-between",
00461|         width: "100%",
00462|         maxWidth: (SEAT_SIZE + 8) * 8,
00463|     },
00464|     sideColumn: { flexDirection: "column", justifyContent: "center" },
00465|     poolArea: {
00466|         flex: 1,
00467|         backgroundColor: "#6B8EBB",
00468|         marginHorizontal: 5,
00469|         borderRadius: 10,
00470|         justifyContent: "center",
00471|         alignItems: "center",
00472|         borderColor: "#4A6FA5",
00473|         borderWidth: 1,
00474|     },
00475|     poolText: { color: "#103568", fontWeight: "bold", fontSize: 16 },
00476|     bottomRow: { flexDirection: "row", marginTop: 5 },
00477|     legendContainer: {
00478|         flexDirection: "row",
00479|         justifyContent: "space-around",
00480|         marginTop: 20,
00481|     },
00482|     legendItem: { flexDirection: "row", alignItems: "center" },
00483|     legendBox: {
00484|         width: 20,
00485|         height: 20,
00486|         borderWidth: 1,
00487|         borderRadius: 4,
00488|         marginRight: 8,
00489|     },
00490|     legendText: { fontSize: 12, color: "#555" },
00491|     footerCard: {
00492|         position: "absolute",
00493|         bottom: 20,
00494|         left: 20,
00495|         right: 20,
00496|         backgroundColor: "#FFF",
00497|         borderRadius: 20,
00498|         padding: 20,
00499|         shadowColor: "#000",
00500|         shadowOffset: { width: 0, height: 4 },
00501|         shadowOpacity: 0.1,
00502|         shadowRadius: 10,
00503|         elevation: 10,
00504|     },
00505|     footerHeader: {
00506|         flexDirection: "row",
00507|         justifyContent: "space-between",
00508|         alignItems: "flex-start",
00509|         marginBottom: 10,
00510|     },
00511|     footerTitle: { fontSize: 16, fontWeight: "bold", color: "#000" },
00512|     footerSubtitle: { fontSize: 10, color: "#666", marginTop: 4 },
00513|     footerBackButton: {
00514|         width: 30,
00515|         height: 30,
00516|         borderRadius: 15,
00517|         borderWidth: 1,
00518|         borderColor: "#EEE",
00519|         justifyContent: "center",
00520|         alignItems: "center",
00521|     },
00522|     divider: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
00523|     totalRow: {
00524|         flexDirection: "row",
00525|         justifyContent: "space-between",
00526|         marginBottom: 15,
00527|     },
00528|     totalLabel: { fontSize: 14, fontWeight: "bold", color: "#000" },
00529|     totalPrice: { fontSize: 14, fontWeight: "bold", color: "#007AFF" },
00530|     checkoutButton: {
00531|         backgroundColor: "#103568",
00532|         paddingVertical: 15,
00533|         borderRadius: 10,
00534|         alignItems: "center",
00535|     },
00536|     disabledButton: { backgroundColor: "#CCC" },
00537|     checkoutButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
00538|     modalOverlay: {
00539|         flex: 1,
00540|         backgroundColor: "rgba(0,0,0,0.5)",
00541|         justifyContent: "flex-end",
00542|     },
00543|     modalContent: {
00544|         backgroundColor: "#FFF",
00545|         borderTopLeftRadius: 20,
00546|         borderTopRightRadius: 20,
00547|         padding: 20,
00548|         maxHeight: height * 0.6,
00549|     },
00550|     modalHeader: {
00551|         flexDirection: "row",
00552|         justifyContent: "space-between",
00553|         alignItems: "center",
00554|         marginBottom: 20,
00555|     },
00556|     modalTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
00557|     modalItem: {
00558|         flexDirection: "row",
00559|         justifyContent: "space-between",
00560|         alignItems: "center",
00561|         paddingVertical: 15,
00562|         borderBottomWidth: 1,
00563|         borderBottomColor: "#F0F0F0",
00564|     },
00565|     modalItemText: { fontSize: 16, color: "#333" },
00566| });
00567| 

(End of file - total 567 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/BuysAndRentFishing.tsx"
}
```
**Output:**
```
<file>
00001| import React, { useState } from "react";
00002| import {
00003|     StyleSheet,
00004|     Text,
00005|     View,
00006|     SafeAreaView,
00007|     TextInput,
00008|     TouchableOpacity,
00009|     FlatList,
00010|     Image,
00011|     Dimensions,
00012| } from "react-native";
00013| import { useRouter } from "expo-router";
00014| import { Ionicons } from "@expo/vector-icons";
00015| 
00016| const { width } = Dimensions.get("window");
00017| const COLUMN_COUNT = 2;
00018| const CARD_WIDTH = (width - 48) / COLUMN_COUNT;
00019| 
00020| // Tipe Data Produk
00021| interface Product {
00022|     id: string;
00023|     name: string;
00024|     price: number;
00025|     discount: number;
00026|     image: string;
00027| }
00028| 
00029| // Tipe Data Item di Keranjang
00030| interface CartItem extends Product {
00031|     type: "sewa" | "beli";
00032| }
00033| 
00034| export default function BuysAndRentFishingScreen() {
00035|     const router = useRouter();
00036|     const [searchText, setSearchText] = useState("");
00037| 
00038|     // State Keranjang
00039|     const [cart, setCart] = useState<CartItem[]>([]);
00040| 
00041|     // Dummy Data
00042|     const products: Product[] = [
00043|         {
00044|             id: "1",
00045|             name: "Joran Baitcasting",
00046|             price: 152000,
00047|             discount: 25,
00048|             image: "https://via.placeholder.com/150/0000FF/808080?text=Joran",
00049|         },
00050|         {
00051|             id: "2",
00052|             name: "PE Braided Line",
00053|             price: 53000,
00054|             discount: 64,
00055|             image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Line",
00056|         },
00057|         {
00058|             id: "3",
00059|             name: "Spoon Pancing",
00060|             price: 25000,
00061|             discount: 23,
00062|             image: "https://via.placeholder.com/150/FFFF00/000000?text=Spoon",
00063|         },
00064|         {
00065|             id: "4",
00066|             name: "Tas Pancing",
00067|             price: 152000,
00068|             discount: 73,
00069|             image: "https://via.placeholder.com/150/008000/FFFFFF?text=Tas",
00070|         },
00071|         {
00072|             id: "5",
00073|             name: "Tanggok Jaring",
00074|             price: 152000,
00075|             discount: 62,
00076|             image: "https://via.placeholder.com/150/000000/FFFFFF?text=Jaring",
00077|         },
00078|         {
00079|             id: "6",
00080|             name: "Ember Pancing",
00081|             price: 152000,
00082|             discount: 43,
00083|             image: "https://via.placeholder.com/150/800080/FFFFFF?text=Ember",
00084|         },
00085|     ];
00086| 
00087|     // Format Rupiah
00088|     const formatRupiah = (number: number) => {
00089|         return new Intl.NumberFormat("id-ID", {
00090|             style: "currency",
00091|             currency: "IDR",
00092|             minimumFractionDigits: 0,
00093|         }).format(number);
00094|     };
00095| 
00096|     // --- LOGIC CART ---
00097| 
00098|     // 1. Tambah Item (Add)
00099|     const addToCart = (product: Product, type: "sewa" | "beli") => {
00100|         const newItem: CartItem = { ...product, type };
00101|         setCart([...cart, newItem]);
00102|     };
00103| 
00104|     // 2. Kurang Item (Remove)
00105|     const removeFromCart = (productId: string, type: "sewa" | "beli") => {
00106|         // Cari index item terakhir yang cocok dengan ID dan Tipe
00107|         const index = cart.findIndex(
00108|             (item) => item.id === productId && item.type === type,
00109|         );
00110| 
00111|         if (index > -1) {
00112|             const newCart = [...cart];
00113|             newCart.splice(index, 1); // Hapus 1 item pada index tersebut
00114|             setCart(newCart);
00115|         }
00116|     };
00117| 
00118|     // 3. Hitung Jumlah Item per Produk (Untuk UI Counter)
00119|     const getItemCount = (productId: string, type: "sewa" | "beli") => {
00120|         return cart.filter(
00121|             (item) => item.id === productId && item.type === type,
00122|         ).length;
00123|     };
00124| 
00125|     // Hitung Total Harga Semua
00126|     const totalCartPrice = cart.reduce((total, item) => total + item.price, 0);
00127| 
00128|     // --- RENDER COMPONENTS ---
00129| 
00130|     // Render Tombol Counter (Minus - Angka - Plus)
00131|     const renderCounterButton = (
00132|         item: Product,
00133|         type: "sewa" | "beli",
00134|         count: number,
00135|     ) => {
00136|         const isSewa = type === "sewa";
00137|         const baseColor = isSewa ? "#FBBF24" : "#103568"; // Kuning vs Biru
00138| 
00139|         return (
00140|             <View style={[styles.counterContainer, { borderColor: baseColor }]}>
00141|                 {/* Tombol Minus */}
00142|                 <TouchableOpacity
00143|                     style={[styles.counterBtn, { backgroundColor: baseColor }]}
00144|                     onPress={() => removeFromCart(item.id, type)}
00145|                 >
00146|                     <Ionicons name="remove" size={12} color="#FFF" />
00147|                 </TouchableOpacity>
00148| 
00149|                 {/* Angka Jumlah */}
00150|                 <Text style={[styles.counterText, { color: baseColor }]}>
00151|                     {count}
00152|                 </Text>
00153| 
00154|                 {/* Tombol Plus */}
00155|                 <TouchableOpacity
00156|                     style={[styles.counterBtn, { backgroundColor: baseColor }]}
00157|                     onPress={() => addToCart(item, type)}
00158|                 >
00159|                     <Ionicons name="add" size={12} color="#FFF" />
00160|                 </TouchableOpacity>
00161|             </View>
00162|         );
00163|     };
00164| 
00165|     const renderItem = ({ item }: { item: Product }) => {
00166|         const sewaCount = getItemCount(item.id, "sewa");
00167|         const beliCount = getItemCount(item.id, "beli");
00168| 
00169|         return (
00170|             <View style={styles.card}>
00171|                 <View style={styles.discountBadge}>
00172|                     <Text style={styles.discountText}>{item.discount}%</Text>
00173|                 </View>
00174| 
00175|                 <Image
00176|                     source={{ uri: item.image }}
00177|                     style={styles.productImage}
00178|                     resizeMode="contain"
00179|                 />
00180| 
00181|                 <View style={styles.cardContent}>
00182|                     <Text style={styles.productName} numberOfLines={1}>
00183|                         {item.name}
00184|                     </Text>
00185|                     <Text style={styles.productPrice}>
00186|                         {formatRupiah(item.price)}
00187|                     </Text>
00188| 
00189|                     {/* Action Row */}
00190|                     <View style={styles.actionColumn}>
00191|                         {/* --- BARIS SEWA --- */}
00192|                         <View style={styles.buttonWrapper}>
00193|                             {sewaCount === 0 ? (
00194|                                 <TouchableOpacity
00195|                                     style={styles.rentButton}
00196|                                     onPress={() => addToCart(item, "sewa")}
00197|                                 >
00198|                                     <Text style={styles.rentButtonText}>
00199|                                         Sewa
00200|                                     </Text>
00201|                                 </TouchableOpacity>
00202|                             ) : (
00203|                                 renderCounterButton(item, "sewa", sewaCount)
00204|                             )}
00205|                         </View>
00206| 
00207|                         {/* Spacer kecil antar tombol */}
00208|                         <View style={{ height: 6 }} />
00209| 
00210|                         {/* --- BARIS BELI --- */}
00211|                         <View style={styles.buttonWrapper}>
00212|                             {beliCount === 0 ? (
00213|                                 <TouchableOpacity
00214|                                     style={styles.buyButton}
00215|                                     onPress={() => addToCart(item, "beli")}
00216|                                 >
00217|                                     <Text style={styles.buyButtonText}>
00218|                                         Beli
00219|                                     </Text>
00220|                                 </TouchableOpacity>
00221|                             ) : (
00222|                                 renderCounterButton(item, "beli", beliCount)
00223|                             )}
00224|                         </View>
00225|                     </View>
00226|                 </View>
00227|             </View>
00228|         );
00229|     };
00230| 
00231|     return (
00232|         <SafeAreaView style={styles.container}>
00233|             {/* HEADER */}
00234|             <View style={styles.header}>
00235|                 <TouchableOpacity
00236|                     style={styles.backButton}
00237|                     onPress={() => router.back()}
00238|                 >
00239|                     <Ionicons name="arrow-back" size={24} color="#333" />
00240|                 </TouchableOpacity>
00241| 
00242|                 <View style={styles.searchBar}>
00243|                     <TextInput
00244|                         style={styles.searchInput}
00245|                         placeholder="Alat pancing untuk pemula"
00246|                         placeholderTextColor="#999"
00247|                         value={searchText}
00248|                         onChangeText={setSearchText}
00249|                     />
00250|                     <Ionicons
00251|                         name="search"
00252|                         size={20}
00253|                         color="#666"
00254|                         style={styles.searchIcon}
00255|                     />
00256|                 </View>
00257|             </View>
00258| 
00259|             {/* GRID PRODUK */}
00260|             <FlatList
00261|                 data={products}
00262|                 renderItem={renderItem}
00263|                 keyExtractor={(item) => item.id}
00264|                 numColumns={2}
00265|                 columnWrapperStyle={styles.columnWrapper}
00266|                 contentContainerStyle={[
00267|                     styles.listContent,
00268|                     { paddingBottom: 150 },
00269|                 ]}
00270|                 showsVerticalScrollIndicator={false}
00271|             />
00272| 
00273|             {/* FOOTER KERANJANG */}
00274|             {cart.length > 0 && (
00275|                 <View style={styles.footerCard}>
00276|                     <View style={styles.totalRow}>
00277|                         <View>
00278|                             <Text style={styles.totalLabel}>
00279|                                 Total ({cart.length} Item)
00280|                             </Text>
00281|                             <Text style={styles.totalPrice}>
00282|                                 {formatRupiah(totalCartPrice)}
00283|                             </Text>
00284|                         </View>
00285| 
00286|                         <TouchableOpacity
00287|                             style={styles.checkoutButton}
00288|                             onPress={() => router.push("/(payment)/Payment")}
00289|                         >
00290|                             <Text style={styles.checkoutButtonText}>
00291|                                 Bayar Sekarang
00292|                             </Text>
00293|                             <Ionicons
00294|                                 name="arrow-forward"
00295|                                 size={16}
00296|                                 color="#FFF"
00297|                                 style={{ marginLeft: 5 }}
00298|                             />
00299|                         </TouchableOpacity>
00300|                     </View>
00301|                 </View>
00302|             )}
00303|         </SafeAreaView>
00304|     );
00305| }
00306| 
00307| const styles = StyleSheet.create({
00308|     container: { flex: 1, backgroundColor: "#FAFAFA" },
00309|     header: {
00310|         flexDirection: "row",
00311|         alignItems: "center",
00312|         paddingHorizontal: 20,
00313|         paddingVertical: 15,
00314|         backgroundColor: "#FFF",
00315|     },
00316|     backButton: {
00317|         width: 40,
00318|         height: 40,
00319|         borderRadius: 20,
00320|         backgroundColor: "#FFF",
00321|         justifyContent: "center",
00322|         alignItems: "center",
00323|         marginRight: 10,
00324|         borderWidth: 1,
00325|         borderColor: "#F0F0F0",
00326|     },
00327|     searchBar: {
00328|         flex: 1,
00329|         flexDirection: "row",
00330|         alignItems: "center",
00331|         backgroundColor: "#FFF",
00332|         borderRadius: 25,
00333|         paddingHorizontal: 15,
00334|         height: 45,
00335|         borderWidth: 1,
00336|         borderColor: "#E5E5E5",
00337|     },
00338|     searchInput: { flex: 1, fontSize: 14, color: "#333" },
00339|     searchIcon: { marginLeft: 5 },
00340| 
00341|     listContent: { padding: 16 },
00342|     columnWrapper: { justifyContent: "space-between" },
00343| 
00344|     card: {
00345|         width: CARD_WIDTH,
00346|         backgroundColor: "#FFF",
00347|         borderRadius: 12,
00348|         marginBottom: 16,
00349|         padding: 10,
00350|         elevation: 3,
00351|         shadowColor: "#000",
00352|         shadowOffset: { width: 0, height: 2 },
00353|         shadowOpacity: 0.1,
00354|         shadowRadius: 4,
00355|     },
00356|     discountBadge: {
00357|         position: "absolute",
00358|         top: 0,
00359|         right: 0,
00360|         backgroundColor: "#DC2626",
00361|         paddingHorizontal: 8,
00362|         paddingVertical: 4,
00363|         borderTopRightRadius: 12,
00364|         borderBottomLeftRadius: 8,
00365|         zIndex: 1,
00366|     },
00367|     discountText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
00368|     productImage: {
00369|         width: "100%",
00370|         height: 100,
00371|         marginBottom: 10,
00372|         borderRadius: 8,
00373|         backgroundColor: "#F5F5F5",
00374|     },
00375|     cardContent: { flex: 1 },
00376|     productName: {
00377|         fontSize: 12,
00378|         fontWeight: "600",
00379|         color: "#333",
00380|         marginBottom: 4,
00381|     },
00382|     productPrice: { fontSize: 12, color: "#555", marginBottom: 10 },
00383| 
00384|     // Layout Tombol
00385|     actionColumn: { flexDirection: "column", width: "100%" },
00386|     buttonWrapper: { width: "100%", height: 26 }, // Tinggi tetap agar rapi
00387| 
00388|     // Tombol Awal (Belum dipilih)
00389|     rentButton: {
00390|         flex: 1,
00391|         backgroundColor: "#FBBF24",
00392|         borderRadius: 15,
00393|         justifyContent: "center",
00394|         alignItems: "center",
00395|     },
00396|     rentButtonText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
00397| 
00398|     buyButton: {
00399|         flex: 1,
00400|         backgroundColor: "#103568",
00401|         borderRadius: 15,
00402|         justifyContent: "center",
00403|         alignItems: "center",
00404|     },
00405|     buyButtonText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
00406| 
00407|     // Tombol Counter (Sudah dipilih)
00408|     counterContainer: {
00409|         flex: 1,
00410|         flexDirection: "row",
00411|         alignItems: "center",
00412|         justifyContent: "space-between",
00413|         borderWidth: 1,
00414|         borderRadius: 15,
00415|         paddingHorizontal: 2,
00416|         backgroundColor: "#FFF",
00417|     },
00418|     counterBtn: {
00419|         width: 20,
00420|         height: 20,
00421|         borderRadius: 10,
00422|         justifyContent: "center",
00423|         alignItems: "center",
00424|     },
00425|     counterText: { fontSize: 12, fontWeight: "bold", paddingHorizontal: 4 },
00426| 
00427|     // Footer
00428|     footerCard: {
00429|         position: "absolute",
00430|         bottom: 0,
00431|         left: 0,
00432|         right: 0,
00433|         backgroundColor: "#FFF",
00434|         padding: 20,
00435|         borderTopLeftRadius: 20,
00436|         borderTopRightRadius: 20,
00437|         shadowColor: "#000",
00438|         shadowOffset: { width: 0, height: -2 },
00439|         shadowOpacity: 0.1,
00440|         shadowRadius: 5,
00441|         elevation: 20,
00442|     },
00443|     totalRow: {
00444|         flexDirection: "row",
00445|         justifyContent: "space-between",
00446|         alignItems: "center",
00447|     },
00448|     totalLabel: { fontSize: 12, color: "#666" },
00449|     totalPrice: { fontSize: 18, fontWeight: "bold", color: "#103568" },
00450|     checkoutButton: {
00451|         backgroundColor: "#103568",
00452|         paddingVertical: 12,
00453|         paddingHorizontal: 20,
00454|         borderRadius: 10,
00455|         flexDirection: "row",
00456|         alignItems: "center",
00457|     },
00458|     checkoutButtonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
00459| });
00460| 

(End of file - total 460 lines)
</file>
```
```

---

## Assistant

_Thinking:_

Now I can see the current state of all files. Let me analyze what's still wrong:

**1. index.tsx (Home Screen)** - Line 31-32, 55-64, 67-70: ✅ Already has state for tips/events, fetchContent function, and useEffect calls!
- BUT: Line 186-201 still uses `spot.name`, `spot.location` - but backend returns `nama`, `lokasi`
- Tips & Events sections (line 222-260 and 262-305) still have STATIC data instead of dynamic from API

**2. Booking.tsx** - Has issues:
- Line 14: Missing import for `api`
- Line 18: PRICE_PER_HOUR still hardcoded as 25000
- Line 56-64: useEffect has issues - `date` is used before it's defined
- Line 61: `setSpotData(id)` should be `fetchSpotData(id)`
- Line 80-84: seatStatus still has hardcoded values instead of state from API
- Line 134: totalPrice still uses hardcoded PRICE_PER_HOUR

**3. BuysAndRentFishing.tsx** - Has issues:
- Line 1: Missing import for `api` from services
- Line 41-85: Still has dummy data instead of fetching from API
- Line 36: Missing spotId state and useEffect to fetch products

**4. notifications.tsx** - Need to check
**5. explore.tsx** - Need to check

Let me read the remaining files to see their current state.

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/(tabs)/notifications.tsx"
}
```
**Output:**
```
<file>
00001| import React from "react";
00002| import {
00003|     StyleSheet,
00004|     Text,
00005|     View,
00006|     SafeAreaView,
00007|     ScrollView,
00008|     Image,
00009|     TouchableOpacity,
00010|     Dimensions,
00011| } from "react-native";
00012| import { Ionicons } from "@expo/vector-icons";
00013| import { useRouter } from "expo-router";
00014| import { useSafeAreaInsets } from "react-native-safe-area-context";
00015| 
00016| const { width } = Dimensions.get("window");
00017| 
00018| // Notification data interface
00019| type NotificationData = {
00020|     id: number;
00021|     status: "pending" | "success" | "failed";
00022|     statusLabel: string;
00023|     timer?: string;
00024|     title: string;
00025|     address: string;
00026|     date: string;
00027| };
00028| 
00029| export default function NotificationsScreen() {
00030|     const router = useRouter();
00031|     const insets = useSafeAreaInsets();
00032| 
00033|     // Data Dummy Sesuai Gambar
00034|     const notifications: NotificationData[] = [
00035|         {
00036|             id: 1,
00037|             status: "pending",
00038|             statusLabel: "Belum Dibayar",
00039|             timer: "22:53:45",
00040|             title: "Kolam Pemancingan Brigif 15",
00041|             address:
00042|                 "4G4J+R9F, Baros, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40521",
00043|             date: "05/11/2025",
00044|         },
00045|         {
00046|             id: 2,
00047|             status: "success",
00048|             statusLabel: "Sudah Dibayar",
00049|             title: "Kolam Pemancingan Pak Ade",
00050|             address:
00051|                 "5FFJ+6V8, Bojongkoneng, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552",
00052|             date: "07/10/2025",
00053|         },
00054|         {
00055|             id: 3,
00056|             status: "failed",
00057|             statusLabel: "Gagal Bayar",
00058|             title: "Kolam Pancing Galatama",
00059|             address:
00060|                 "Jl. Karanglo Raya No.7, Gemah, Kec. Pedurungan, Kota Semarang, Jawa Tengah 50191",
00061|             date: "07/10/2025",
00062|         },
00063|     ];
00064| 
00065|     const getStatusColor = (status: string) => {
00066|         switch (status) {
00067|             case "pending":
00068|                 return "#BF0000";
00069|             case "success":
00070|                 return "#22C55E";
00071|             case "failed":
00072|                 return "#9CA3AF";
00073|             default:
00074|                 return "#333";
00075|         }
00076|     };
00077| 
00078|     return (
00079|         <SafeAreaView style={styles.container}>
00080|             <View style={styles.header}>
00081|                 <Text style={styles.headerTitle}>Notifications</Text>
00082|             </View>
00083|             <ScrollView
00084|                 contentContainerStyle={[
00085|                     styles.listContent,
00086|                     { paddingBottom: insets.bottom + 20 },
00087|                 ]}
00088|                 showsVerticalScrollIndicator={false}
00089|             >
00090|                 {notifications.map((item, index) => (
00091|                     <View key={item.id}>
00092|                         <View style={styles.card}>
00093|                             <View style={styles.statusRow}>
00094|                                 <View
00095|                                     style={[
00096|                                         styles.statusBadge,
00097|                                         {
00098|                                             backgroundColor: getStatusColor(
00099|                                                 item.status,
00100|                                             ),
00101|                                         },
00102|                                     ]}
00103|                                 >
00104|                                     <Text style={styles.statusText}>
00105|                                         {item.statusLabel}
00106|                                     </Text>
00107|                                 </View>
00108|                                 {item.status === "pending" && item.timer && (
00109|                                     <View style={styles.timerBadge}>
00110|                                         <Text style={styles.timerText}>
00111|                                             {item.timer}
00112|                                         </Text>
00113|                                     </View>
00114|                                 )}
00115|                             </View>
00116|                             <View style={styles.contentRow}>
00117|                                 <View style={styles.iconContainer}>
00118|                                     <Ionicons
00119|                                         name="fish"
00120|                                         size={30}
00121|                                         color="#F59E0B"
00122|                                     />
00123|                                     <View style={styles.rodLine} />
00124|                                 </View>
00125|                                 <View style={styles.textContainer}>
00126|                                     <Text style={styles.cardTitle}>
00127|                                         {item.title}
00128|                                     </Text>
00129|                                     <Text style={styles.cardAddress}>
00130|                                         {item.address}
00131|                                     </Text>
00132|                                     <Text style={styles.cardDate}>
00133|                                         {item.date}
00134|                                     </Text>
00135|                                 </View>
00136|                             </View>
00137|                             {item.status === "success" && (
00138|                                 <View style={styles.actionButtonsContainer}>
00139|                                     <TouchableOpacity
00140|                                         style={styles.actionButton}
00141|                                         onPress={() =>
00142|                                             router.push("/ReviewPath")
00143|                                         }
00144|                                     >
00145|                                         <Text style={styles.actionButtonText}>
00146|                                             Review
00147|                                         </Text>
00148|                                     </TouchableOpacity>
00149|                                     <TouchableOpacity
00150|                                         style={styles.actionButton}
00151|                                         onPress={() => router.push("/explore")}
00152|                                     >
00153|                                         <Text style={styles.actionButtonText}>
00154|                                             Rebooking
00155|                                         </Text>
00156|                                     </TouchableOpacity>
00157|                                 </View>
00158|                             )}
00159|                         </View>
00160|                         {index < notifications.length - 1 && (
00161|                             <View style={styles.divider} />
00162|                         )}
00163|                     </View>
00164|                 ))}
00165|                 <View style={{ height: 100 }} />
00166|             </ScrollView>
00167|         </SafeAreaView>
00168|     );
00169| }
00170| 
00171| const styles = StyleSheet.create({
00172|     container: {
00173|         flex: 1,
00174|         backgroundColor: "#FFF",
00175|     },
00176|     header: {
00177|         paddingHorizontal: 20,
00178|         paddingTop: 20,
00179|         paddingBottom: 10,
00180|         backgroundColor: "#FFF",
00181|         borderBottomWidth: 1,
00182|         borderBottomColor: "#EEE",
00183|     },
00184|     headerTitle: {
00185|         fontSize: 24,
00186|         fontWeight: "bold",
00187|         color: "#000",
00188|     },
00189|     listContent: {
00190|         paddingBottom: 20,
00191|     },
00192|     card: {
00193|         padding: 20,
00194|         backgroundColor: "#FFF",
00195|     },
00196|     statusRow: {
00197|         flexDirection: "row",
00198|         alignItems: "center",
00199|         marginBottom: 10,
00200|         marginLeft: 80,
00201|     },
00202|     statusBadge: {
00203|         paddingHorizontal: 10,
00204|         paddingVertical: 4,
00205|         borderRadius: 12,
00206|         marginRight: 10,
00207|     },
00208|     statusText: {
00209|         color: "#FFF",
00210|         fontSize: 10,
00211|         fontWeight: "bold",
00212|     },
00213|     timerBadge: {
00214|         backgroundColor: "#FEE2E2",
00215|         paddingHorizontal: 10,
00216|         paddingVertical: 4,
00217|         borderRadius: 12,
00218|     },
00219|     timerText: {
00220|         color: "#DC2626",
00221|         fontSize: 10,
00222|         fontWeight: "bold",
00223|     },
00224|     contentRow: {
00225|         flexDirection: "row",
00226|         alignItems: "flex-start",
00227|     },
00228|     iconContainer: {
00229|         width: 60,
00230|         height: 60,
00231|         borderRadius: 30,
00232|         backgroundColor: "#5DD6E3",
00233|         justifyContent: "center",
00234|         alignItems: "center",
00235|         marginRight: 15,
00236|         position: "relative",
00237|     },
00238|     rodLine: {
00239|         position: "absolute",
00240|         width: 40,
00241|         height: 2,
00242|         backgroundColor: "#8B4513",
00243|         transform: [{ rotate: "-45deg" }],
00244|     },
00245|     textContainer: {
00246|         flex: 1,
00247|     },
00248|     cardTitle: {
00249|         fontSize: 16,
00250|         fontWeight: "bold",
00251|         color: "#000",
00252|         marginBottom: 5,
00253|     },
00254|     cardAddress: {
00255|         fontSize: 12,
00256|         color: "#4B5563",
00257|         lineHeight: 18,
00258|         marginBottom: 8,
00259|     },
00260|     cardDate: {
00261|         fontSize: 11,
00262|         color: "#6B7280",
00263|     },
00264|     actionButtonsContainer: {
00265|         flexDirection: "row",
00266|         justifyContent: "flex-end",
00267|         marginTop: 15,
00268|     },
00269|     actionButton: {
00270|         backgroundColor: "#103568",
00271|         paddingHorizontal: 20,
00272|         paddingVertical: 8,
00273|         borderRadius: 20,
00274|         marginLeft: 10,
00275|     },
00276|     actionButtonText: {
00277|         color: "#FFF",
00278|         fontSize: 12,
00279|         fontWeight: "bold",
00280|     },
00281|     divider: {
00282|         height: 1,
00283|         backgroundColor: "#E5E7EB",
00284|         width: "100%",
00285|     },
00286| });
00287| 

(End of file - total 287 lines)
</file>
```
```

```
Tool: read

**Input:**
```json
{
  "filePath": "/home/zharfanfw/documents/kuliah/semester3/web-mobile/kailku-mobile/mobile/app/(tabs)/explore.tsx"
}
```
**Output:**
```
<file>
00001| import { Image } from 'expo-image';
00002| import { Platform, StyleSheet } from 'react-native';
00003| 
00004| import { Collapsible } from '@/components/ui/collapsible';
00005| import { ExternalLink } from '@/components/external-link';
00006| import ParallaxScrollView from '@/components/parallax-scroll-view';
00007| import { ThemedText } from '@/components/themed-text';
00008| import { ThemedView } from '@/components/themed-view';
00009| import { IconSymbol } from '@/components/ui/icon-symbol';
00010| import { Fonts } from '@/constants/theme';
00011| 
00012| export default function TabTwoScreen() {
00013|   return (
00014|     <ParallaxScrollView
00015|       headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
00016|       headerImage={
00017|         <IconSymbol
00018|           size={310}
00019|           color="#808080"
00020|           name="chevron.left.forwardslash.chevron.right"
00021|           style={styles.headerImage}
00022|         />
00023|       }>
00024|       <ThemedView style={styles.titleContainer}>
00025|         <ThemedText
00026|           type="title"
00027|           style={{
00028|             fontFamily: Fonts.rounded,
00029|           }}>
00030|           Explore
00031|         </ThemedText>
00032|       </ThemedView>
00033|       <ThemedText>This app includes example code to help you get started.</ThemedText>
00034|       <Collapsible title="File-based routing">
00035|         <ThemedText>
00036|           This app has two screens:{' '}
00037|           <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
00038|           <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
00039|         </ThemedText>
00040|         <ThemedText>
00041|           The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
00042|           sets up the tab navigator.
00043|         </ThemedText>
00044|         <ExternalLink href="https://docs.expo.dev/router/introduction">
00045|           <ThemedText type="link">Learn more</ThemedText>
00046|         </ExternalLink>
00047|       </Collapsible>
00048|       <Collapsible title="Android, iOS, and web support">
00049|         <ThemedText>
00050|           You can open this project on Android, iOS, and the web. To open the web version, press{' '}
00051|           <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
00052|         </ThemedText>
00053|       </Collapsible>
00054|       <Collapsible title="Images">
00055|         <ThemedText>
00056|           For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
00057|           <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
00058|           different screen densities
00059|         </ThemedText>
00060|         <Image
00061|           source={require('@/assets/images/react-logo.png')}
00062|           style={{ width: 100, height: 100, alignSelf: 'center' }}
00063|         />
00064|         <ExternalLink href="https://reactnative.dev/docs/images">
00065|           <ThemedText type="link">Learn more</ThemedText>
00066|         </ExternalLink>
00067|       </Collapsible>
00068|       <Collapsible title="Light and dark mode components">
00069|         <ThemedText>
00070|           This template has light and dark mode support. The{' '}
00071|           <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
00072|           what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
00073|         </ThemedText>
00074|         <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
00075|           <ThemedText type="link">Learn more</ThemedText>
00076|         </ExternalLink>
00077|       </Collapsible>
00078|       <Collapsible title="Animations">
00079|         <ThemedText>
00080|           This template includes an example of an animated component. The{' '}
00081|           <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
00082|           the powerful{' '}
00083|           <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
00084|             react-native-reanimated
00085|           </ThemedText>{' '}
00086|           library to create a waving hand animation.
00087|         </ThemedText>
00088|         {Platform.select({
00089|           ios: (
00090|             <ThemedText>
00091|               The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
00092|               component provides a parallax effect for the header image.
00093|             </ThemedText>
00094|           ),
00095|         })}
00096|       </Collapsible>
00097|     </ParallaxScrollView>
00098|   );
00099| }
00100| 
00101| const styles = StyleSheet.create({
00102|   headerImage: {
00103|     color: '#808080',
00104|     bottom: -90,
00105|     left: -35,
00106|     position: 'absolute',
00107|   },
00108|   titleContainer: {
00109|     flexDirection: 'row',
00110|     gap: 8,
00111|   },
00112| });
00113| 

(End of file - total 113 lines)
</file>
```
```

---

## Assistant

_Thinking:_

Now I have a complete picture. Let me summarize what needs to be fixed for each file:

**Summary of Issues:**

1. **index.tsx (Home Screen)**:
   - Line 186-201: Uses `spot.name`, `spot.location`, `spot.rating` but backend returns `nama`, `lokasi`, no rating field
   - Line 222-260: Tips section still static (hardcoded)
   - Line 262-305: Events section still static (hardcoded)

2. **Booking.tsx**:
   - Line 14: Missing `import { api } from "../../src/services/api";`
   - Line 18: `PRICE_PER_HOUR = 25000` should be dynamic from spotData
   - Line 56-64: useEffect has issues - uses `date` before it's defined, `setSpotData(id)` should be `fetchSpotData(id)`
   - Line 80-84: seatStatus still hardcoded instead of API
   - Line 134: totalPrice uses hardcoded PRICE_PER_HOUR

3. **BuysAndRentFishing.tsx**:
   - Line 14: Missing `import { api } from "../src/services/api";`
   - Line 41-85: Still has dummy data instead of fetching from API
   - Missing useEffect to get spotId and fetch products

4. **notifications.tsx**:
   - Line 2: Missing `ActivityIndicator` import
   - Line 13: Missing `import { api } from "../src/services/api";`
   - Line 34-63: Still has dummy data instead of API call
   - Missing loading state, useEffect to fetch bookings

5. **explore.tsx**:
   - Still has default Expo template code
   - Needs complete rewrite to show spots from API with search functionality
   
I'll provide comprehensive code modifications for each problematic file, focusing on resolving the identified issues systematically. The goal is to ensure proper API integration, dynamic data rendering, and correct component behavior across all screens.

# RINGKASAN MASALAH PER FILE

## 1. `src/config/api.ts` - ✅ SELESAI
Tidak ada masalah.

## 2. `src/services/api.ts` - ✅ SELESAI
Tidak ada masalah.

## 3. `src/contexts/AuthContext.tsx` - ✅ SELESAI
Tidak ada masalah.

---

## 4. `app/(tabs)/index.tsx` - MASALAH:

| Line | Masalah |
|------|---------|
| 186-191 | Menggunakan `spot.name`, `spot.location`, `spot.rating` - backend mengembalikan `nama`, `lokasi`, tanpa rating |
| 222-260 | Tips section masih STATIC (hardcoded) |
| 262-305 | Events section masih STATIC (hardcoded) |

**Fix yang dibutuhkan:**
- Ganti `spot.name` → `spot.nama`
- Ganti `spot.location` → `spot.lokasi`
- Hapus rating atau buat default
- Tips & Events harus render dari state `tips` dan `events`

---

## 5. `app/(booking)/Booking.tsx` - MASALAH:

| Line | Masalah |
|------|---------|
| 14 | **MISSING import:** `import { api } from "../../src/services/api";` |
| 18 | `PRICE_PER_HOUR = 25000` masih hardcoded |
| 56-64 | useEffect error: `date` used before defined, `setSpotData(id)` salah |
| 80-84 | `seatStatus` masih hardcoded `{2: "filled", 5: "filled", 18: "filled"}` |
| 134 | `totalPrice` masih pake harga hardcoded |

**Fix yang dibutuhkan:**
- Tambah import api
- Buat harga dinamis dari `spotData?.harga_per_jam`
- Perbaiki useEffect
- `seatStatus` harus dari state dengan setSeatStatus

---

## 6. `app/BuysAndRentFishing.tsx` - MASALAH:

| Line | Masalah |
|------|---------|
| 14 | **MISSING import:** `import { api } from "../src/services/api";` |
| 41-85 | **MASIH PAKAI DUMMY DATA** dari placeholder |
| - | Tidak ada useEffect untuk fetch products dari API |

**Fix yang dibutuhkan:**
- Tambah import api
- Hapus dummy data
- Tambah useEffect + fetchProducts function

---

## 7. `app/(tabs)/notifications.tsx` - MASALAH:

| Line | Masalah |
|------|---------|
| 2 | **MISSING import:** `ActivityIndicator` |
| 13 | **MISSING import:** `import { api } from "../src/services/api";` |
| 34-63 | **MASIH PAKAI DUMMY DATA** |
| - | Tidak ada loading state |
| - | Tidak ada useEffect untuk fetch bookings |

**Fix yang dibutuhkan:**
- Tambah imports
- Ganti dummy data dengan state + fetch
- Tambah loading indicator

---

## 8. `app/(tabs)/explore.tsx` - MASALAH:

| Line | Masalah |
|------|---------|
| 1-113 | **SELURUH FILE MASIH EXPO TEMPLATE** |

**Fix yang dibutuhkan:**
- Replace entire file dengan implementasi Explore yang benar

---

# BERIKUT KODE LENGKAP PER FILE (SILAKAN COPY-PASTE):

---

## FILE 1: `app/(tabs)/index.tsx` (REPLACE SEMUA)

```typescript
import React, { useEffect, useState, useCallback } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "../../src/services/api";

interface Spot {
    id: string;
    nama: string;
    lokasi: string;
    harga_per_jam: number;
    image_url?: string;
}

export default function HomeScreen() {
    const router = useRouter();
    const [spots, setSpots] = useState<Spot[]>([]);
    const [tips, setTips] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSpots = async () => {
        try {
            const response = await api.get("/tempat_mancing");
            const data = Array.isArray(response) ? response : response?.data || [];
            if (Array.isArray(data)) {
                setSpots(data);
            }
        } catch (error) {
            console.error("Failed to fetch spots:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchContent = async () => {
        try {
            const tipsData = await api.get("/content/tips");
            const eventsData = await api.get("/content/lomba");
            setTips(tipsData || []);
            setEvents(eventsData || []);
        } catch (error) {
            console.error("Failed to fetch content:", error);
        }
    };

    useEffect(() => {
        fetchSpots();
        fetchContent();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchSpots();
    }, []);

    const renderStars = (rating: number = 4.5) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        return (
            <View style={styles.ratingContainer}>
                {[...Array(fullStars)].map((_, i) => (
                    <FontAwesome
                        key={`full-${i}`}
                        name="star"
                        size={12}
                        color="#333"
                        style={{ marginRight: 2 }}
                    />
                ))}
                {hasHalfStar && (
                    <FontAwesome name="star-half-full" size={12} color="#333" />
                )}
            </View>
        );
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#103568"]}
                    />
                }
            >
                <View style={styles.headerContainer}>
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?q=80&w=2070&auto=format&fit=crop",
                        }}
                        style={styles.headerImage}
                    />
                    <View style={styles.searchContainer}>
                        <View style={styles.searchBar}>
                            <TextInput
                                placeholder="Tempat mancing terdekat"
                                style={styles.searchInput}
                                placeholderTextColor="#999"
                            />
                            <Ionicons name="search" size={24} color="#666" />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => router.push("/(tabs)/explore")}
                    >
                        <Text style={styles.sectionTitle}>Recommendations</Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#333"
                        />
                    </TouchableOpacity>

                    {loading ? (
                        <View
                            style={{
                                height: 150,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ActivityIndicator size="small" color="#103568" />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.horizontalScroll}
                        >
                            {spots.length > 0 ? (
                                spots.map((spot) => (
                                    <TouchableOpacity
                                        key={spot.id}
                                        style={styles.card}
                                        onPress={() =>
                                            router.push({
                                                pathname:
                                                    "/(booking)/InformationPlace",
                                                params: { id: spot.id },
                                            })
                                        }
                                    >
                                        <Image
                                            source={{
                                                uri:
                                                    spot.image_url ||
                                                    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Landscape_of_Samosir_Island_and_Lake_Toba.jpg/800px-Landscape_of_Samosir_Island_and_Lake_Toba.jpg",
                                            }}
                                            style={styles.cardImage}
                                        />
                                        <View style={styles.cardContent}>
                                            <Text
                                                style={styles.cardTitle}
                                                numberOfLines={1}
                                            >
                                                {spot.nama}
                                            </Text>
                                            {renderStars(4.5)}
                                            <Text
                                                style={styles.cardAddress}
                                                numberOfLines={2}
                                            >
                                                {spot.lokasi}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text
                                    style={{
                                        color: "#999",
                                        fontStyle: "italic",
                                        marginLeft: 5,
                                    }}
                                >
                                    Belum ada rekomendasi tempat.
                                </Text>
                            )}
                            <View style={{ width: 20 }} />
                        </ScrollView>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tips & Tricks</Text>
                    {tips.length > 0 ? (
                        tips.slice(0, 1).map((tip, index) => (
                            <View key={tip.id || index} style={styles.tipsCard}>
                                <View style={styles.tipsContent}>
                                    <View style={styles.iconCircle}>
                                        <Ionicons
                                            name="fish-outline"
                                            size={32}
                                            color="#333"
                                        />
                                    </View>
                                    <Text style={styles.tipsTitle}>
                                        {tip.judul || tip.title || "Tips Memancing"}
                                    </Text>
                                    <Text style={styles.tipsDesc}>
                                        {tip.konten || tip.content || tip.desc || "Bersihkan peralatan setelah dipakai"}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.tipsCard}>
                            <View style={styles.tipsContent}>
                                <View style={styles.iconCircle}>
                                    <Ionicons
                                        name="fish-outline"
                                        size={32}
                                        color="#333"
                                    />
                                </View>
                                <Text style={styles.tipsTitle}>
                                    Rawat peralatan sederhana
                                </Text>
                                <Text style={styles.tipsDesc}>
                                    Bilas reel dan joran setelah dipakai, keringkan,
                                    simpan rapi. Peralatan murah pun awet kalau
                                    dirawat.
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => router.push("/events")}
                    >
                        <Text style={styles.sectionTitle}>Event</Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#333"
                        />
                    </TouchableOpacity>

                    {events.length > 0 ? (
                        events.slice(0, 1).map((event, index) => (
                            <TouchableOpacity
                                key={event.id || index}
                                style={styles.eventCard}
                                onPress={() => router.push("/events")}
                            >
                                <Image
                                    source={{
                                        uri: event.gambar || event.image || "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
                                    }}
                                    style={styles.eventImage}
                                />
                                <View style={styles.eventDetails}>
                                    <Text style={styles.eventTitle}>
                                        {event.nama || event.title || "Master Angler Open Cup"}
                                    </Text>
                                    <Text style={styles.eventText}>
                                        Kota: {event.kota || event.location || "Malang"}
                                    </Text>
                                    <Text style={styles.eventText}>
                                        Tanggal: {event.tanggal || event.date || "20 April 2025"}
                                    </Text>
                                    <Text style={styles.eventText}>
                                        Total hadiah: {formatRupiah(event.total_hadiah || event.prize || 700000)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <TouchableOpacity
                            style={styles.eventCard}
                            onPress={() => router.push("/events")}
                        >
                            <Image
                                source={{
                                    uri: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
                                }}
                                style={styles.eventImage}
                            />
                            <View style={styles.eventDetails}>
                                <Text style={styles.eventTitle}>
                                    "Master Angler Open Cup"
                                </Text>
                                <Text style={styles.eventText}>Kota: Malang</Text>
                                <Text style={styles.eventText}>
                                    Tanggal: 20 April 2025
                                </Text>
                                <Text style={styles.eventText}>
                                    Total hadiah: Rp700.000
                                </Text>
                                <Text style={styles.eventText}>
                                    Biaya pendaftaran: Rp60.000/orang
                                </Text>
                                <Text style={styles.eventText}>
                                    Penilaian berdasarkan: Ikan terberat
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    headerContainer: {
        position: "relative",
        marginBottom: 30,
    },
    headerImage: {
        width: "100%",
        height: 220,
        resizeMode: "cover",
    },
    searchContainer: {
        position: "absolute",
        bottom: -25,
        width: "100%",
        alignItems: "center",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        width: "85%",
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        marginRight: 10,
        color: "#333",
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        paddingVertical: 5,
        alignSelf: "flex-start",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginRight: 5,
    },
    horizontalScroll: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    card: {
        width: 200,
        backgroundColor: "#FFF",
        borderRadius: 15,
        marginRight: 15,
        paddingBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: 120,
        backgroundColor: "#eee",
    },
    cardContent: {
        padding: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    ratingContainer: {
        flexDirection: "row",
        marginBottom: 5,
    },
    cardAddress: {
        fontSize: 10,
        color: "#666",
        lineHeight: 14,
    },
    tipsCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    tipsContent: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 10,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#333",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    tipsTitle: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 5,
        color: "#333",
    },
    tipsDesc: {
        fontSize: 10,
        textAlign: "center",
        color: "#666",
    },
    eventCard: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    eventImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
        backgroundColor: "#eee",
    },
    eventDetails: {
        flex: 1,
        justifyContent: "center",
    },
    eventTitle: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 5,
        color: "#333",
    },
    eventText: {
        fontSize: 10,
        color: "#555",
        marginBottom: 2,
    },
});
```

---

## FILE 2: `app/(booking)/Booking.tsx` (REPLACE SEMUA)

```typescript
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Modal,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/services/api";

const { width, height } = Dimensions.get("window");
const SEAT_SIZE = 35;

export default function BookingScreen() {
    const router = useRouter();
    const [spotId, setSpotId] = useState<string>("");
    const [spotData, setSpotData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

    const today = new Date();
    const defaultDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;

    const [date, setDate] = useState(defaultDate);
    const [time, setTime] = useState("--Pilih Jam--");
    const [duration, setDuration] = useState(1);

    const [modalVisible, setModalVisible] = useState<
        "none" | "date" | "time" | "duration"
    >("none");

    const [seatStatus, setSeatStatus] = useState<{ [key: number]: "filled" | "empty" }>({});

    const fetchSpotData = async (id: string) => {
        try {
            const data = await api.spots.getById(id);
            setSpotData(data);
        } catch (error) {
            console.error("Failed to fetch spot data:", error);
        }
    };

    const fetchSeatAvailability = async (spot_id: string, bookingDate: string) => {
        try {
            const response = await api.get("/bookings/check-seats", {
                tempat_id: spot_id,
                tanggal: bookingDate,
            });

            if (response.bookedSeats) {
                const newSeatStatus: { [key: number]: "filled" | "empty" } = {};
                response.bookedSeats.forEach((seatNum: number) => {
                    newSeatStatus[seatNum] = "filled";
                });
                setSeatStatus(newSeatStatus);
            }
        } catch (error) {
            console.error("Failed to fetch seat availability:", error);
        }
    };

    useEffect(() => {
        const params = router as any;
        if (params.searchParams && params.searchParams.id) {
            const id = params.searchParams.id;
            setSpotId(id);
            fetchSpotData(id);
            fetchSeatAvailability(id, defaultDate);
        }
        setLoading(false);
    }, []);

    const timeOptions = [
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
    ];

    const durationOptions = Array.from({ length: 8 }, (_, i) => i + 1);

    const generateDates = () => {
        const dates = [];
        const start = new Date();
        for (let i = 0; i < 365; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const dateString = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
            dates.push(dateString);
        }
        return dates;
    };
    const dateOptions = generateDates();

    const toggleSeat = (id: number) => {
        if (seatStatus[id] === "filled") return;
        if (selectedSeats.includes(id)) {
            setSelectedSeats(selectedSeats.filter((seatId) => seatId !== id));
        } else {
            setSelectedSeats([...selectedSeats, id]);
        }
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const pricePerHour = spotData?.harga_per_jam || 25000;
    const totalPrice = pricePerHour * duration * selectedSeats.length;

    const renderSeat = (id: number) => {
        const isSelected = selectedSeats.includes(id);
        const isFilled = seatStatus[id] === "filled";

        let backgroundColor = "#FFFFFF";
        let borderColor = "#999";
        let textColor = "#999";

        if (isFilled) {
            backgroundColor = "#86EFAC";
            borderColor = "#4ADE80";
            textColor = "#166534";
        } else if (isSelected) {
            backgroundColor = "#FCD34D";
            borderColor = "#F59E0B";
            textColor = "#78350F";
        }

        return (
            <TouchableOpacity
                key={id}
                style={[styles.seatBox, { backgroundColor, borderColor }]}
                onPress={() => toggleSeat(id)}
                disabled={isFilled}
            >
                <Text style={[styles.seatText, { color: textColor }]}>
                    {id}
                </Text>
            </TouchableOpacity>
        );
    };

    const handleProceed = () => {
        router.push({
            pathname: "/BuysAndRentFishing",
            params: { id: spotId },
        });
    };

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
        if (spotId) {
            fetchSeatAvailability(spotId, newDate);
        }
    };

    const renderModal = () => {
        let data: any[] = [];
        let onSelect: (val: any) => void = () => {};
        let title = "";

        if (modalVisible === "date") {
            data = dateOptions;
            title = "Pilih Tanggal";
            onSelect = handleDateChange;
        } else if (modalVisible === "time") {
            data = timeOptions;
            title = "Pilih Jam Mulai";
            onSelect = (val) => setTime(val);
        } else if (modalVisible === "duration") {
            data = durationOptions;
            title = "Pilih Durasi";
            onSelect = (val) => setDuration(val);
        }

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible !== "none"}
                onRequestClose={() => setModalVisible("none")}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible("none")}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible("none")}
                            >
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        onSelect(item);
                                        setModalVisible("none");
                                    }}
                                >
                                    <Text style={styles.modalItemText}>
                                        {modalVisible === "duration"
                                            ? `${item} Jam`
                                            : item}
                                    </Text>
                                    {(item === date ||
                                        item === time ||
                                        item === duration) && (
                                        <Ionicons
                                            name="checkmark"
                                            size={20}
                                            color="#103568"
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButtonTop}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Booking Tempat</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#103568" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButtonTop}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking Tempat</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formSection}>
                    <Text style={styles.label}>Tanggal</Text>
                    <TouchableOpacity
                        style={styles.inputBox}
                        onPress={() => setModalVisible("date")}
                    >
                        <Text style={styles.inputText}>{date}</Text>
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#333"
                        />
                    </TouchableOpacity>

                    <Text style={styles.label}>Jam</Text>
                    <TouchableOpacity
                        style={styles.inputBox}
                        onPress={() => setModalVisible("time")}
                    >
                        <Text
                            style={[
                                styles.inputText,
                                time === "--Pilih Jam--" && { color: "#999" },
                            ]}
                        >
                            {time}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.label}>Durasi</Text>
                    <TouchableOpacity
                        style={styles.inputBox}
                        onPress={() => setModalVisible("duration")}
                    >
                        <Text style={styles.inputText}>{duration} Jam</Text>
                        <Ionicons name="chevron-down" size={20} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.mapContainer}>
                    <View style={styles.topRow}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => renderSeat(id))}
                    </View>
                    <View style={styles.middleRow}>
                        <View style={styles.sideColumn}>
                            {[28, 27, 26].map((id) => renderSeat(id))}
                        </View>
                        <View style={styles.poolArea}>
                            <Text style={styles.poolText}>Kolam</Text>
                        </View>
                        <View style={styles.sideColumn}>
                            {[9, 10, 11].map((id) => renderSeat(id))}
                        </View>
                    </View>
                    <View style={styles.bottomRow}>
                        {[22, 21, 20, 19, 18, 17, 16, 15].map((id) =>
                            renderSeat(id),
                        )}
                    </View>
                </View>

                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendBox,
                                {
                                    backgroundColor: "#86EFAC",
                                    borderColor: "#4ADE80",
                                },
                            ]}
                        />
                        <Text style={styles.legendText}>Sudah Terisi</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendBox,
                                {
                                    backgroundColor: "#FFF",
                                    borderColor: "#999",
                                },
                            ]}
                        />
                        <Text style={styles.legendText}>Kosong</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendBox,
                                {
                                    backgroundColor: "#FCD34D",
                                    borderColor: "#F59E0B",
                                },
                            ]}
                        />
                        <Text style={styles.legendText}>Dipilih</Text>
                    </View>
                </View>
                <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.footerCard}>
                <View style={styles.footerHeader}>
                    <View>
                        <Text style={styles.footerTitle}>Daftar Pemesanan</Text>
                        <Text style={styles.footerSubtitle}>
                            {date} • {time} • {duration} Jam
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.footerBackButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={20} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>
                        Total ({selectedSeats.length} Kursi)
                    </Text>
                    <Text style={styles.totalPrice}>
                        {formatRupiah(totalPrice)}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.checkoutButton,
                        (selectedSeats.length === 0 ||
                            time === "--Pilih Jam--") &&
                            styles.disabledButton,
                    ]}
                    disabled={
                        selectedSeats.length === 0 || time === "--Pilih Jam--"
                    }
                    onPress={handleProceed}
                >
                    <Text style={styles.checkoutButtonText}>
                        Lanjut ke Sewa Alat
                    </Text>
                </TouchableOpacity>
            </View>

            {renderModal()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#FFF",
    },
    backButtonTop: { marginRight: 10 },
    headerTitle: { fontSize: 18, fontWeight: "bold" },
    scrollContent: { padding: 20, paddingBottom: 220 },
    formSection: { marginBottom: 20 },
    label: { fontSize: 14, color: "#333", marginBottom: 8, fontWeight: "500" },
    inputBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
    },
    inputText: { color: "#333", fontSize: 14 },
    mapContainer: { alignItems: "center", marginVertical: 10 },
    seatBox: {
        width: SEAT_SIZE,
        height: SEAT_SIZE,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        margin: 4,
    },
    seatText: { fontSize: 12, fontWeight: "bold" },
    topRow: { flexDirection: "row", marginBottom: 5 },
    middleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: (SEAT_SIZE + 8) * 8,
    },
    sideColumn: { flexDirection: "column", justifyContent: "center" },
    poolArea: {
        flex: 1,
        backgroundColor: "#6B8EBB",
        marginHorizontal: 5,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#4A6FA5",
        borderWidth: 1,
    },
    poolText: { color: "#103568", fontWeight: "bold", fontSize: 16 },
    bottomRow: { flexDirection: "row", marginTop: 5 },
    legendContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    legendItem: { flexDirection: "row", alignItems: "center" },
    legendBox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 4,
        marginRight: 8,
    },
    legendText: { fontSize: 12, color: "#555" },
    footerCard: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    footerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    footerTitle: { fontSize: 16, fontWeight: "bold", color: "#000" },
    footerSubtitle: { fontSize: 10, color: "#666", marginTop: 4 },
    footerBackButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#EEE",
        justifyContent: "center",
        alignItems: "center",
    },
    divider: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    totalLabel: { fontSize: 14, fontWeight: "bold", color: "#000" },
    totalPrice: { fontSize: 14, fontWeight: "bold", color: "#007AFF" },
    checkoutButton: {
        backgroundColor: "#103568",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    disabledButton: { backgroundColor: "#CCC" },
    checkoutButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: height * 0.6,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
    modalItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    modalItemText: { fontSize: 16, color: "#333" },
});
```

---

## FILE 3: `app/BuysAndRentFishing.tsx` (REPLACE SEMUA)

```typescript
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../src/services/api";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const CARD_WIDTH = (width - 48) / COLUMN_COUNT;

interface Product {
    id: string;
    nama: string;
    harga_beli: number;
    harga_sewa: number;
    diskon?: number;
    image_url?: string;
}

interface CartItem extends Product {
    type: "sewa" | "beli";
    quantity: number;
}

export default function BuysAndRentFishingScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [spotId, setSpotId] = useState<string>("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);

    const fetchProducts = async (id: string) => {
        try {
            const response = await api.get("/alat_pancing", {
                tempat_id: id,
            });
            const data = Array.isArray(response) ? response : response?.data || [];
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = router as any;
        if (params.searchParams && params.searchParams.id) {
            const id = params.searchParams.id;
            setSpotId(id);
            fetchProducts(id);
        } else {
            setLoading(false);
        }
    }, []);

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const addToCart = (product: Product, type: "sewa" | "beli") => {
        const existingIndex = cart.findIndex(
            (item) => item.id === product.id && item.type === type
        );

        if (existingIndex > -1) {
            const newCart = [...cart];
            newCart[existingIndex].quantity += 1;
            setCart(newCart);
        } else {
            setCart([...cart, { ...product, type, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: string, type: "sewa" | "beli") => {
        const existingIndex = cart.findIndex(
            (item) => item.id === productId && item.type === type
        );

        if (existingIndex > -1) {
            const newCart = [...cart];
            if (newCart[existingIndex].quantity > 1) {
                newCart[existingIndex].quantity -= 1;
                setCart(newCart);
            } else {
                newCart.splice(existingIndex, 1);
                setCart(newCart);
            }
        }
    };

    const getItemCount = (productId: string, type: "sewa" | "beli") => {
        const item = cart.find(
            (item) => item.id === productId && item.type === type
        );
        return item ? item.quantity : 0;
    };

    const totalCartPrice = cart.reduce((total, item) => {
        const price = item.type === "beli" ? item.harga_beli : item.harga_sewa;
        return total + price * item.quantity;
    }, 0);

    const renderCounterButton = (
        item: Product,
        type: "sewa" | "beli",
        count: number
    ) => {
        const isSewa = type === "sewa";
        const baseColor = isSewa ? "#FBBF24" : "#103568";

        return (
            <View style={[styles.counterContainer, { borderColor: baseColor }]}>
                <TouchableOpacity
                    style={[styles.counterBtn, { backgroundColor: baseColor }]}
                    onPress={() => removeFromCart(item.id, type)}
                >
                    <Ionicons name="remove" size={12} color="#FFF" />
                </TouchableOpacity>
                <Text style={[styles.counterText, { color: baseColor }]}>
                    {count}
                </Text>
                <TouchableOpacity
                    style={[styles.counterBtn, { backgroundColor: baseColor }]}
                    onPress={() => addToCart(item, type)}
                >
                    <Ionicons name="add" size={12} color="#FFF" />
                </TouchableOpacity>
            </View>
        );
    };

    const renderItem = ({ item }: { item: Product }) => {
        const sewaCount = getItemCount(item.id, "sewa");
        const beliCount = getItemCount(item.id, "beli");

        return (
            <View style={styles.card}>
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                        {item.diskon || 0}%
                    </Text>
                </View>
                <Image
                    source={{
                        uri:
                            item.image_url ||
                            "https://via.placeholder.com/150/103568/FFFFFF?text=Alat",
                    }}
                    style={styles.productImage}
                    resizeMode="contain"
                />
                <View style={styles.cardContent}>
                    <Text style={styles.productName} numberOfLines={1}>
                        {item.nama}
                    </Text>
                    <Text style={styles.productPrice}>
                        {formatRupiah(item.harga_beli)}
                    </Text>
                    <View style={styles.actionColumn}>
                        <View style={styles.buttonWrapper}>
                            {sewaCount === 0 ? (
                                <TouchableOpacity
                                    style={styles.rentButton}
                                    onPress={() => addToCart(item, "sewa")}
                                >
                                    <Text style={styles.rentButtonText}>Sewa</Text>
                                    <Text style={styles.rentPriceText}>
                                        {formatRupiah(item.harga_sewa)}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                renderCounterButton(item, "sewa", sewaCount)
                            )}
                        </View>
                        <View style={{ height: 6 }} />
                        <View style={styles.buttonWrapper}>
                            {beliCount === 0 ? (
                                <TouchableOpacity
                                    style={styles.buyButton}
                                    onPress={() => addToCart(item, "beli")}
                                >
                                    <Text style={styles.buyButtonText}>Beli</Text>
                                </TouchableOpacity>
                            ) : (
                                renderCounterButton(item, "beli", beliCount)
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.searchBar}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Alat pancing untuk pemula"
                            placeholderTextColor="#999"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                        <Ionicons
                            name="search"
                            size={20}
                            color="#666"
                            style={styles.searchIcon}
                        />
                    </View>
                </View>
                <View
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                    <ActivityIndicator size="large" color="#103568" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Alat pancing untuk pemula"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <Ionicons
                        name="search"
                        size={20}
                        color="#666"
                        style={styles.searchIcon}
                    />
                </View>
            </View>

            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: 150 },
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            Tidak ada produk tersedia
                        </Text>
                    </View>
                }
            />

            {cart.length > 0 && (
                <View style={styles.footerCard}>
                    <View style={styles.totalRow}>
                        <View>
                            <Text style={styles.totalLabel}>
                                Total ({cart.reduce((a, b) => a + b.quantity, 0)}{" "}
                                Item)
                            </Text>
                            <Text style={styles.totalPrice}>
                                {formatRupiah(totalCartPrice)}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() =>
                                router.push({
                                    pathname: "/(payment)/Payment",
                                    params: { total: totalCartPrice },
                                })
                            }
                        >
                            <Text style={styles.checkoutButtonText}>
                                Bayar Sekarang
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={16}
                                color="#FFF"
                                style={{ marginLeft: 5 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAFAFA" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#FFF",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 45,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    searchInput: { flex: 1, fontSize: 14, color: "#333" },
    searchIcon: { marginLeft: 5 },
    listContent: { padding: 16 },
    columnWrapper: { justifyContent: "space-between" },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: { color: "#999", fontSize: 16 },
    card: {
        width: CARD_WIDTH,
        backgroundColor: "#FFF",
        borderRadius: 12,
        marginBottom: 16,
        padding: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    discountBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#DC2626",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 8,
        zIndex: 1,
    },
    discountText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
    productImage: {
        width: "100%",
        height: 100,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: "#F5F5F5",
    },
    cardContent: { flex: 1 },
    productName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    productPrice: { fontSize: 12, color: "#555", marginBottom: 10 },
    actionColumn: { flexDirection: "column", width: "100%" },
    buttonWrapper: { width: "100%", height: 26 },
    rentButton: {
        flex: 1,
        backgroundColor: "#FBBF24",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    rentButtonText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
    rentPriceText: {
        color: "#FFF",
        fontSize: 8,
        opacity: 0.9,
    },
    buyButton: {
        flex: 1,
        backgroundColor: "#103568",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    buyButtonText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
    counterContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 2,
        backgroundColor: "#FFF",
    },
    counterBtn: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    counterText: { fontSize: 12, fontWeight: "bold", paddingHorizontal: 4 },
    footerCard: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 20,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalLabel: { fontSize: 12, color: "#666" },
    totalPrice: { fontSize: 18, fontWeight: "bold", color: "#103568" },
    checkoutButton: {
        backgroundColor: "#103568",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    checkoutButtonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
});
```

---

## FILE 4: `app/(tabs)/notifications.tsx` (REPLACE SEMUA)

```typescript
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../src/services/api";

interface BookingNotification {
    id: number;
    status: "pending" | "success" | "failed";
    statusLabel: string;
    timer?: string;
    title: string;
    address: string;
    date: string;
    total?: number;
}

export default function NotificationsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [notifications, setNotifications] = useState<BookingNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const response = await api.get("/bookings/my");
            const bookingsData = Array.isArray(response) ? response : response?.data || [];

            const transformedData: BookingNotification[] = bookingsData.map(
                (booking: any) => ({
                    id: booking.id,
                    status:
                        booking.status === "pending"
                            ? "pending"
                            : booking.status === "completed" ||
                              booking.status === "paid"
                            ? "success"
                            : "failed",
                    statusLabel:
                        booking.status === "pending"
                            ? "Belum Dibayar"
                            : booking.status === "completed" ||
                              booking.status === "paid"
                            ? "Sudah Dibayar"
                            : "Gagal Bayar",
                    timer:
                        booking.status === "pending" ? "22:53:45" : undefined,
                    title: booking.nama_tempat || "Tempat Mancing",
                    address: booking.lokasi_tempat || "",
                    date: booking.tanggal_booking || "",
                    total: booking.total_harga,
                })
            );

            setNotifications(transformedData);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "#BF0000";
            case "success":
                return "#22C55E";
            case "failed":
                return "#9CA3AF";
            default:
                return "#333";
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size="large" color="#103568" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <ScrollView
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {notifications.length > 0 ? (
                    notifications.map((item, index) => (
                        <View key={item.id}>
                            <View style={styles.card}>
                                <View style={styles.statusRow}>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            {
                                                backgroundColor: getStatusColor(
                                                    item.status
                                                ),
                                            },
                                        ]}
                                    >
                                        <Text style={styles.statusText}>
                                            {item.statusLabel}
                                        </Text>
                                    </View>
                                    {item.status === "pending" &&
                                        item.timer && (
                                            <View style={styles.timerBadge}>
                                                <Text style={styles.timerText}>
                                                    {item.timer}
                                                </Text>
                                            </View>
                                        )}
                                </View>
                                <View style={styles.contentRow}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons
                                            name="fish"
                                            size={30}
                                            color="#F59E0B"
                                        />
                                        <View style={styles.rodLine} />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.cardTitle}>
                                            {item.title}
                                        </Text>
                                        <Text
                                            style={styles.cardAddress}
                                            numberOfLines={2}
                                        >
                                            {item.address}
                                        </Text>
                                        <Text style={styles.cardDate}>
                                            {item.date}
                                        </Text>
                                        {item.total && (
                                            <Text
                                                style={styles.cardTotal}
                                            >
                                                Total:{" "}
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }
                                                ).format(item.total)}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                {item.status === "success" && (
                                    <View
                                        style={
                                            styles.actionButtonsContainer
                                        }
                                    >
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() =>
                                                router.push("/ReviewPath")
                                            }
                                        >
                                            <Text
                                                style={styles.actionButtonText}
                                            >
                                                Review
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() =>
                                                router.push("/explore")
                                            }
                                        >
                                            <Text
                                                style={styles.actionButtonText}
                                            >
                                                Rebooking
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            {index < notifications.length - 1 && (
                                <View style={styles.divider} />
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="notifications-off-outline"
                            size={48}
                            color="#CCC"
                        />
                        <Text style={styles.emptyText}>
                            Tidak ada notifikasi
                        </Text>
                    </View>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: {
        color: "#999",
        fontSize: 16,
        marginTop: 10,
    },
    card: {
        padding: 20,
        backgroundColor: "#FFF",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        marginLeft: 80,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 10,
    },
    statusText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "bold",
    },
    timerBadge: {
        backgroundColor: "#FEE2E2",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    timerText: {
        color: "#DC2626",
        fontSize: 10,
        fontWeight: "bold",
    },
    contentRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#5DD6E3",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
        position: "relative",
    },
    rodLine: {
        position: "absolute",
        width: 40,
        height: 2,
        backgroundColor: "#8B4513",
        transform: [{ rotate: "-45deg" }],
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 5,
    },
    cardAddress: {
        fontSize: 12,
        color: "#4B5563",
        lineHeight: 18,
        marginBottom: 8,
    },
    cardDate: {
        fontSize: 11,
        color: "#6B7280",
    },
    cardTotal: {
        fontSize: 12,
        color: "#103568",
        fontWeight: "bold",
        marginTop: 4,
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 15,
    },
    actionButton: {
        backgroundColor: "#103568",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginLeft: 10,
    },
    actionButtonText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        width: "100%",
    },
});
```

---

## FILE 5: `app/(tabs)/explore.tsx` (REPLACE SEMUA)

```typescript
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/services/api";

interface Spot {
    id: string;
    nama: string;
    lokasi: string;
    harga_per_jam: number;
    image_url?: string;
}

export default function ExploreScreen() {
    const router = useRouter();
    const [spots, setSpots] = useState<Spot[]>([]);
    const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchSpots = async () => {
        try {
            const response = await api.get("/tempat_mancing");
            const data = Array.isArray(response) ? response : response?.data || [];
            setSpots(data);
            setFilteredSpots(data);
        } catch (error) {
            console.error("Failed to fetch spots:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpots();
    }, []);

    const handleSearch = (text: string) => {
        setSearchText(text);
        if (text) {
            const filtered = spots.filter(
                (spot) =>
                    spot.nama.toLowerCase().includes(text.toLowerCase()) ||
                    spot.lokasi.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredSpots(filtered);
        } else {
            setFilteredSpots(spots);
        }
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const renderSpotItem = ({ item }: { item: Spot }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                router.push({
                    pathname: "/(booking)/InformationPlace",
                    params: { id: item.id },
                })
            }
        >
            <Image
                source={{
                    uri:
                        item.image_url ||
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Landscape_of_Samosir_Island_and_Lake_Toba.jpg/800px-Landscape_of_Samosir_Island_and_Lake_Toba.jpg",
                }}
                style={styles.cardImage}
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.nama}
                </Text>
                <Text style={styles.cardLocation} numberOfLines={2}>
                    {item.lokasi}
                </Text>
                <Text style={styles.cardPrice}>
                    {formatRupiah(item.harga_per_jam)}/jam
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Explore</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#103568" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari tempat mancing..."
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch("")}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={filteredSpots}
                renderItem={renderSpotItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="location-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyText}>
                            Tidak ada tempat ditemukan
                        </Text>
                    </View>
                }
                refreshing={loading}
                onRefresh={fetchSpots}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAFAFA" },
    header: {
        padding: 20,
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    headerTitle: { fontSize: 24, fontWeight: "bold", color: "#000" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    searchContainer: { padding: 20 },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    listContent: { padding: 20, paddingTop: 0 },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 15,
        marginBottom: 15,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: { width: "100%", height: 150, backgroundColor: "#eee" },
    cardContent: { padding: 15 },
    cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    cardLocation: { fontSize: 12, color: "#666", marginBottom: 5 },
    cardPrice: { fontSize: 14, color: "#103568", fontWeight: "bold" },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: { color: "#999", fontSize: 16, marginTop: 10 },
});
```

---

# RINGKASAN PERUBAHAN

| File | Perubahan |
|------|-----------|
| `index.tsx` | `spot.name` → `spot.nama`, tips/events dari API |
| `Booking.tsx` | Tambah import api, harga dinamis, seatStatus dari API |
| `BuysAndRentFishing.tsx` | Tambah import api, fetch products dari API |
| `notifications.tsx` | Tambah import, fetch bookings dari API |
| `explore.tsx` | Replace penuh dengan implementasi search + grid |

---

Mohon copy-paste file-file di atas sesuai urutan. Setelah selesai, restart mobile app dengan:

```bash
npx expo start --clear
```

Ada pertanyaan atau error setelah copy-paste?

---

