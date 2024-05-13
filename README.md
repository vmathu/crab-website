# Crab-website
Đây là website hỗ trợ quản trị viên quản lý hệ thống và nhân viên xử lý các cuốc xe nhận qua tổng đài.

## Folder structure

```bash
.
├── public                                        # Static files
├── src                                           # Main src folder/
│   ├── assets                                    # Main assets folder
│   ├── libs
│   │   └── ui                                    # Styles and components/
│   │       ├── components                        # Code for <Component>.tsx
│   │       ├── color.ts
│   │       ├── index.ts
│   │       └── theme.ts
│   ├── pages
│   │   ├── admin
│   │   │   ├── members
│   │   │   │   └── index.tsx
│   │   │   ├── statistics
│   │   │   │   └── index.tsx
│   │   │   └── index.tsx
│   │   ├── auth
│   │   │   └── sign-in
│   │   │       └── index.tsx
│   │   ├── staff
│   │   │   ├── components
│   │   │   │   ├── AutocompletePlaceResolver.tsx
│   │   │   │   ├── EditGPSModal.tsx
│   │   │   │   ├── NewBooking.tsx
│   │   │   │   └── ResolveGPS.tsx
│   │   │   └── index.tsx
│   │   └── index.tsx
│   ├── utils                                      # utilties functions for PayOS
│   │   ├── APIRequest.ts
│   │   ├── Cookie.ts
│   │   └── JWT.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env                                           # Environment variables
├── crab.svg
├── index.html
├── package.json                                   # Packages and package manager
├── package-lock.json
├── pnpm-lock.yaml
├── README.md                                      # Instructions on setting up the environment
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

## Install requirement
- Install pnpm
  ```bash
  npm i -g pnpm
  ```
- Install project packages
  ```bash
  pnpm i
  ```

## Environment variables

```
VITE_GOOGLE_MAPS_API_KEY=AAA
VITE_BASE_URL=BBB
```

AAA là Google Map API key \
BBB là server URL 

## CLI to open tools

```bash
# Dev server 
pnpm dev
```
