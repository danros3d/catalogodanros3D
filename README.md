# Dan Ros 3D — primera versión

Catálogo estático en español, responsive, buscador y categorías derivadas de los productos. Carrito con cantidades de 1 a 99, persistencia local y mensaje de WhatsApp a **+52 7533500414**. Precios en MXN. Panel en `admin.html` con acceso mediante Supabase Auth, alta, edición, eliminación, fotos y visibilidad. Sin dependencias de JavaScript externas ni proceso de compilación.

## Revisar localmente

Sirve esta carpeta mediante un servidor HTTP (por ejemplo `python -m http.server 8080`) y abre http://localhost:8080. Los módulos requieren HTTP; no abras index.html con doble clic. Sin configuración aparecen tres ejemplos inequívocos; no hay fotos inventadas y WhatsApp está desactivado. Los ejemplos no se guardan en Supabase. El nombre tipográfico funciona como marca provisional: no necesitas un logotipo para iniciar.

## Configurar Supabase

1. Crea un proyecto nuevo. En SQL Editor ejecuta `supabase/schema.sql` una sola vez. No uses un proyecto con tablas existentes del mismo nombre sin revisar la migración.
2. En Authentication, desactiva **Allow new users to sign up**. Crea tu usuario administrador desde el dashboard y establece una contraseña segura, o completa la invitación según el flujo de Supabase. Este panel usa correo y contraseña y no implementa recuperación: las invitaciones/restablecimientos deben completarse por el flujo de Supabase; puedes establecer la contraseña desde sus herramientas administrativas. No guardes la contraseña en el repositorio.
3. Copia el UUID del usuario desde Authentication → Users. En SQL Editor ejecuta lo siguiente sustituyendo el marcador: `insert into public.admins(user_id) values ('UUID-DEL-USUARIO');`. Solo el propietario del proyecto debe modificar esta tabla; el navegador no puede conceder permisos.
4. En `config.js`, rellena `supabaseUrl` con `https://TU-PROYECTO.supabase.co` y `supabaseKey` con la clave **publishable** (o anon pública heredada). No coloques claves secret, service_role, contraseña de base de datos ni tokens de GitHub en archivos públicos. URL y clave pública son visibles por diseño; la seguridad reside en RLS.
5. Configura Site URL como `https://danros3d.github.io` y permite únicamente las URLs de redirección que necesites. Para desarrollo usa localhost temporalmente. No uses comodines amplios.
6. Entra a `/admin.html`, agrega un producto real con fotografía y precio y marca Visible para publicarlo. Las categorías se crean al escribir su nombre en los productos. No se insertan productos ficticios en la base de datos.

## Publicar en GitHub Pages

1. En la cuenta **danros3d**, crea el repositorio **danros3d.github.io**. Para la URL prevista el nombre debe coincidir exactamente. Usa un repositorio público si tu plan lo requiere para Pages.
2. Sube el contenido de esta carpeta a la raíz de la rama `main`, incluyendo `.github/workflows/pages.yml`. No subas el ZIP ni una carpeta contenedora adicional. Puedes usar GitHub Desktop para incluir las carpetas ocultas.
3. En Settings → Pages → Build and deployment, selecciona **GitHub Actions**. Ejecuta el flujo “Publicar catálogo” desde Actions o realiza un push a `main`.
4. Espera la ejecución correcta y abre **https://danros3d.github.io**. Cada push a main publica los cambios. El flujo solo publica los siete archivos de la aplicación; SQL y documentación no se incluyen en el sitio.

No se ha creado un repositorio ni publicado el sitio desde esta entrega. No se requieren tokens para revisar los archivos.

## Seguridad y límites concretos

- RLS permite a visitantes leer solo productos visibles. Usuarios autenticados sin pertenencia en `admins` tampoco pueden escribir. El HTML del panel es público en GitHub Pages; los datos y las operaciones administrativas están protegidos por Supabase.
- La sesión administrativa vive solo en memoria; al recargar se requiere iniciar sesión. Se renueva el token mientras usas el panel, y cerrar sesión revoca su sesión en Supabase.
- Las fotos están en un bucket **público**. Ocultar/eliminar un producto retira su ficha, pero una URL de foto conocida sigue siendo accesible. No subas imágenes confidenciales. Las fotos sustituidas, retiradas o de productos eliminados se conservan para no borrar archivos aún referenciados; puedes limpiar huérfanas manualmente en Storage tras verificar referencias. La aplicación intenta limpiar una foto nueva si falla el guardado.
- La base limita precios, texto y rutas; Storage limita tipo y tamaño (5 MB). Los textos se insertan como texto, nunca HTML. Permitir solo administradores para uploads evita cargas públicas.
- El subtotal excluye envío. WhatsApp contiene una solicitud editable por el cliente, no una transacción ni un comprobante de pago. Confirma precio, disponibilidad, envío y pago en la conversación. Los precios se verifican al preparar el pedido, pero podrían cambiar después.
- No almacena pedidos ni datos de clientes en Supabase. El carrito permanece en este navegador. No incluye pagos, inventario, tarifas de envío ni facturación.
- Antes de publicar, revisa Security Advisor de Supabase y las comprobaciones siguientes. Mantén copias de seguridad de datos/fotos y protege las cuentas GitHub/Supabase con MFA.

## Comprobación con Supabase real antes de lanzar

1. Sin sesión: verifica que ves productos visibles y no ocultos. Intenta INSERT/PATCH/DELETE a la API con la clave pública: deben denegarse.
2. Crea temporalmente un usuario autenticado que no esté en `admins`: no debe leer productos ocultos ni escribir productos/fotos ni agregar membresías. Borra ese usuario después.
3. Con administrador: agrega, edita, oculta y elimina un producto; verifica el catálogo en una ventana privada. Prueba JPEG/PNG/WebP y rechazo de un archivo mayor de 5 MB.
4. Revisa buscador, categorías, vacío, cantidades, recarga del carrito, nota y WhatsApp en móvil. Cambia un precio/visibilidad en otra sesión antes de enviar: debe pedir revisar el carrito.
5. Comprueba cierre de sesión y ausencia de claves privadas en el repositorio/historial. Cambiar claves en config.js exige republicar; cambios de productos se ven al recargar sin republicar.

Las políticas y el flujo no se han ejecutado contra un proyecto real en esta entrega porque no hay conexión configurada.

Validación realizada: sintaxis de los cuatro módulos JavaScript y comprobaciones automatizadas del modo ejemplo (buscador, agregar, cantidades, límite de 99, quitar, carrito vacío y bloqueo de pedidos ficticios). No se ha verificado visualmente en un navegador ni realizado una prueba de autenticación, Storage o RLS en Supabase real.

## Fuentes oficiales

- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/security/access-control
- https://supabase.com/docs/guides/api/api-keys
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
