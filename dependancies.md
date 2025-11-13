## Setting Up the Project

If you're opening this project in a fresh environment (e.g., GitHub Codespaces), follow these steps to install all dependencies and get it running.

### 1. Install dependencies
Run the following commands in your project root:

```bash
# Core Next.js and React
npm install next react react-dom --legacy-peer-deps

# TypeScript and types
npm install typescript @types/react @types/node --save-dev --legacy-peer-deps

# Supabase client
npm install @supabase/supabase-js --legacy-peer-deps

# Lucide React icons
npm install lucide-react --legacy-peer-deps

# UI dependencies (ShadCN/UI, Radix, Tailwind Variants)
npm install @radix-ui/react-primitive @radix-ui/react-slot @radix-ui/react-popover @radix-ui/react-tooltip class-variance-authority tailwind-variants --legacy-peer-deps

# Tailwind CSS and PostCSS
npm install tailwindcss postcss autoprefixer --legacy-peer-deps
npx tailwindcss init -p

# Additional utilities (optional)
npm install cn @tailwind-variants/react --legacy-peer-deps

# Dev tools (linting, formatting)
npm install eslint prettier eslint-config-next --save-dev --legacy-peer-deps
```
### 2. Configure environment variables
Create a .env.local file in the root with the following:
```bash
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```
3. Start the development server
```bash
npm run dev
```
Tip: Always use --legacy-peer-deps if npm complains about conflicting peer dependencies when installing packages.
