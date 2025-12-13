# Frontend Directory Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── ...
├── pages/              # Page-level components (route targets)
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── ...
├── layouts/            # Layout components (headers, sidebars, etc.)
│   ├── MainLayout.tsx
│   ├── AuthLayout.tsx
│   └── ...
├── routes/             # Route configuration
│   └── index.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── ...
├── services/           # API calls and external services
│   ├── api.ts
│   ├── authService.ts
│   └── ...
├── utils/              # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── ...
├── types/              # TypeScript type definitions
│   ├── user.ts
│   ├── api.ts
│   └── ...
├── styles/             # Global styles
│   └── reset.css
├── App.tsx             # Root app component
└── main.tsx            # Entry point
```

## Best Practices

### Components

- Keep components small and focused on a single responsibility
- Use TypeScript interfaces for props
- Co-locate tests with components
- Export default for page/route components, named exports for reusable components

### Pages

- Each page should correspond to a route
- Keep business logic in hooks or services
- Use layouts for common page structures

### Hooks

- Prefix custom hooks with 'use'
- Keep hooks focused on a single concern
- Return objects instead of arrays for better named destructuring

### Services

- Centralize all API calls
- Use axios or fetch consistently
- Handle errors at the service level
- Return typed responses

### Utils

- Pure functions only
- Well-tested helper functions
- Clear, descriptive function names

### Types

- Share types with backend when possible (via `shared` package)
- Use interfaces for object shapes
- Use type aliases for unions and primitives
- Keep domain types organized by feature
