<div align="center">

# 🛒 PlanoVista

### Sistema de Validación de Planogramas con IA para tiendas OXXO

<img src="https://via.placeholder.com/400x140?text=PlanoVista" alt="PlanoVista Logo" width="400px"/>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

## ✨ Descripción

PlanoVista es una aplicación web para la validación y gestión de planogramas en tiendas de FEMSA. El sistema utiliza computer vision para analizar fotos de estantes, verificar el cumplimiento de planogramas y proporcionar feedback inmediato a empleados y supervisores.

## 🚀 Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (Auth, Database, Storage), Server Actions
- **Despliegue**: Vercel

## ⚙️ Instalación

1. Clona el repositorio
   ```bash
   git clone https://github.com/yourusername/planovista.git
   cd planovista
   ```

2. Instala dependencias
   ```bash
   npm install
   ```

3. Configura variables de entorno (crea archivo `.env.local`)
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   ```

4. Ejecuta el servidor de desarrollo
   ```bash
   npm run dev
   ```

## 👤 Roles de usuario

- **Empleado**: Verifica planogramas, visualiza tareas e historial
- **Supervisor**: Gestiona tiendas, crea planogramas, analiza métricas

## 📝 Licencia

[MIT](LICENSE)
