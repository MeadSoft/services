# Auth Package Spec

## Scope

The auth capability is split into three packages:

- `@meadsoft/auth-contracts`: shared auth types, schemas, and constants used by both backend and frontend code.
- `@meadsoft/auth-server-nestjs`: NestJS auth module, controller, guards, strategy, and persistence/infrastructure logic.
- `@meadsoft/auth-client-angular`: Angular client used to call auth endpoints.

## Package Responsibilities

### Contracts

- Defines canonical auth data contracts (`User`, `IUserAccount`, `IUserLoginMethod`).
- Owns runtime validation schemas (`UserSchema`, `UserAccountSchema`, `UserLoginMethodSchema`).
- Exposes shared constants and role definitions.

### Server

- Verifies Firebase ID tokens.
- Resolves or creates internal user account records.
- Persists account and login-method records.
- Issues and validates server JWT cookies.
- Exposes auth API endpoints (`/auth/firebase-login`, `/auth/logout`, `/auth/me`).

### Client

- Provides typed Angular client methods for auth endpoints.
- Sends auth requests with credentials enabled for cookie-based sessions.

## Data Model (ERD)

```mermaid
erDiagram
    users ||--o{ user_login_methods : has

    users {
        uuid id PK
        varchar email UK
        varchar display_name
        varchar firebase_uid UK
        text_array iam_roles
        boolean is_active
        timestamptz created_date
        timestamptz updated_date
        uuid created_by_id
        uuid updated_by_id
    }

    user_login_methods {
        uuid id PK
        uuid user_id FK
        varchar provider
        varchar provider_user_id
        varchar provider_email
        boolean is_active
        timestamptz linked_at
    }
```

## Account Creation and Login Flow

```mermaid
sequenceDiagram
    actor User
    participant Client as Angular Client
    participant API as AuthController
    participant Firebase as FirebaseAuthService
    participant AccountSvc as UserAccountService
    participant UserRepo as UserAccountRepository
    participant LoginRepo as UserLoginMethodRepository

    User->>Client: Sign in with Firebase
    Client->>API: POST /auth/firebase-login (Authorization: idToken)
    API->>Firebase: verifyIdToken(idToken)
    Firebase-->>API: DecodedIdToken

    API->>AccountSvc: findOrCreateFromFirebase(decoded)
    AccountSvc->>UserRepo: findByFirebaseUid(uid)
    alt User not found by uid
        AccountSvc->>UserRepo: findByEmail(email)
    end
    alt No existing account
        AccountSvc->>UserRepo: createOne(user)
    else Existing account
        AccountSvc->>UserRepo: updateOne(id, firebaseUid/roles)
    end

    AccountSvc->>LoginRepo: findByUserIdAndProvider(userId, provider)
    alt Login method missing
        AccountSvc->>LoginRepo: createOne(login_method)
    end

    AccountSvc-->>API: IUserAccount
    API->>API: sign JWT from account projection
    API-->>Client: 200 User + Set-Cookie(jwt)
```

## Invariants

- A single `users` row represents one logical account.
- `firebase_uid` is unique when present.
- A user can have multiple login methods, but only one per provider identity.
- Server JWT payload must validate against `UserSchema`.
