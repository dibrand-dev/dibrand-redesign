# Dibrand Redesign - Project Rules

Estas directrices son obligatorias para todo el desarrollo actual y futuro.

## 1. Typography
La única fuente permitida para texto, UI y layouts es **'Outfit'** (mapeada a `font-sans` en Tailwind). 
Queda estrictamente prohibido el uso de Montserrat o cualquier otra fuente no especificada.

## 2. Color Token
El color hexadecimal oficial para:
- Estados seleccionados
- Botones principales
- Bordes activos
Es: **`#9e4d97`**

## 3. Casing
Todos los títulos y etiquetas de la plataforma deben usar **'Sentence case'**.
- ✅ Correcto: 'Gestión de hosting', 'Historial de pagos', 'Registrar renovación'.
- ❌ Incorrecto: 'Gestión De Hosting', 'HISTORIAL DE PAGOS', 'registrar renovación'.

## 4. Data Integrity
Está **estrictamente prohibido** el uso de 'mock data' o nombres duros inventados.
Toda la información debe provenir de tipos, esquemas reales de la base de datos o llamadas a la API correspondientes.

## 5. Workflow y Versionado
- **SIEMPRE** se debe hacer un commit y push a la rama `main` de manera automática tras desarrollar o solucionar un bug con éxito, para que el entorno de Vercel/Producción se actualice al instante.
- **SIEMPRE** proveer comandos SQL limpios y directos al usuario cuando haya que aplicar cambios a la base de datos de Supabase, porque es la vía más rápida y preferida por el usuario.
