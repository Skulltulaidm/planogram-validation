<div align="center">

# 🛒 PlanoVista

### Sistema de Validación de Planogramas con IA para tiendas OXXO

[![Tech Stack](https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,supabase,vercel&theme=light)](https://skillicons.dev)

</div>

## ✨ Descripción

PlanoVista es una aplicación web para la validación y gestión de planogramas en tiendas de FEMSA. El sistema utiliza Computer Vision para analizar fotos de estantes, verificar el cumplimiento de planogramas y proporcionar feedback inmediato a empleados y supervisores.

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

## 💻 Capturas de pantalla


## 📝 Licencia

[MIT](LICENSE)
