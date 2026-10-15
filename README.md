# MUXI

MUXI significa **Madbius UX/UI Intelligence**.

Este repositorio centraliza documentacion tecnica, de diseno y desarrollo de proyectos Madbius. La etapa actual se enfoca en una base documental simple, versionada y preparada para crecer. No incluye servidor MCP, busqueda semantica, autenticacion ni automatizaciones documentales.

Repositorio central: https://github.com/MrFoxxz/MUXI

## Estructura inicial

```text
muxi/
├── docs/
│   └── conectar-proyectos.md
├── muxi_docs/
│   ├── seralogin_plus/
│   ├── madbius_page/
│   ├── intelapp/
│   └── intelcare/
├── apps/
│   └── web/
├── scripts/
│   └── import-docs.js
├── package.json
├── .gitignore
└── README.md
```

## Desarrollo local

Instalar dependencias:

```bash
npm install
```

Ejecutar la aplicacion web:

```bash
npm run dev
```

Construir la aplicacion:

```bash
npm run build
```

## Importar documentacion de un proyecto

La integracion inicial copia documentacion desde una carpeta `.muxi` existente hacia `muxi_docs/<project>`. No mueve ni modifica la carpeta original.

Ejemplo:

```bash
node scripts/import-docs.js --project seralogin_plus --source "C:/ruta/seralogin_plus/.muxi"
```

El script valida que el origen exista, que sea una carpeta llamada `.muxi`, omite carpetas `.git` y archivos sensibles conocidos, y evita sobrescribir archivos existentes sin confirmacion.

## Agregar un nuevo proyecto

La guia completa para conectar proyectos existentes esta en [docs/conectar-proyectos.md](docs/conectar-proyectos.md).

1. Confirmar que el proyecto original tiene una carpeta `.muxi` real.
2. Elegir un identificador estable en minusculas, por ejemplo `nuevo_proyecto`.
3. Ejecutar el importador:

```bash
node scripts/import-docs.js --project nuevo_proyecto --source "C:/ruta/nuevo_proyecto/.muxi"
```

4. Revisar los cambios con Git antes de hacer commit.
5. Solicitar revision humana antes de publicar cambios.

## Reglas de seguridad documental

- No inventar documentacion tecnica.
- No sobrescribir documentos sin revision.
- No mover ni eliminar carpetas `.muxi` originales.
- No modificar repositorios Git de proyectos fuente.
- No incluir credenciales, tokens ni archivos sensibles.
- No publicar cambios automaticamente.
