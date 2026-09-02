# AFIS · prototipo web estático

Prototipo corporativo para AFIS Sabadell Corredoria d’Assegurances, S.L. Incluye la portada, un área cliente de demostración y una solicitud de tarificación por pasos.

## Demo sin datos reales

No introduzcas datos ni documentos reales. No existe backend, autenticación, envío, almacenamiento ni conexión con sistemas de AFIS, Elevia, MPM o Grup Coyfer. Todos los formularios se bloquean en el navegador y terminan en un mensaje de demostración.

## Verlo localmente

Abre `index.html` directamente en un navegador, o sirve la carpeta con cualquier servidor estático local. Por ejemplo, con la extensión Live Server de tu editor. No requiere Node, npm ni instalación alguna.

## Publicarlo en GitHub Pages

1. Sube todos los archivos de esta carpeta a una rama del repositorio.
2. En GitHub, abre **Settings → Pages**.
3. Elige **Deploy from a branch**, selecciona la rama y la carpeta `/(root)`.
4. Guarda los cambios. Las rutas son relativas y funcionan bajo `https://usuario.github.io/nombre-repositorio/`.

El archivo `.nojekyll` evita el procesamiento de GitHub Pages con Jekyll.

## Recursos y validaciones pendientes

Los recursos descargados y sus URL de origen se documentan en `ASSET_ORIGINS.md`. Antes de publicar se deben sustituir o aprobar los assets corporativos, validar los textos legales y confirmar permisos de marcas, imágenes y aseguradoras.

El aviso de protección de datos de `tarificacion.html` es una maqueta. AFIS y Grup Coyfer deben confirmar responsable, base jurídica, destinatarios, conservación y texto definitivo.

## Para convertirlo en producción

Harían falta un backend seguro, autenticación real, almacenamiento privado cifrado, controles de acceso, registro de actividad, política real de conservación y eliminación, integración segura con Elevia/MPM/Coyfer, revisión de protección de datos y textos legales, y la confirmación de permisos de marcas e imágenes.
