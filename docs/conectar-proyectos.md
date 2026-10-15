# MUXI - Guia para conectar proyectos

## Objetivo

Centralizar la documentacion de varios proyectos en un repositorio GitHub privado, manteniendo una carpeta `.muxi` dentro de cada proyecto original.

Repositorio central:

https://github.com/MrFoxxz/MUXI

## 1. Preparar un computador nuevo

Requisitos:

- Git instalado.
- Node.js instalado si se ejecutara la aplicacion o los scripts de MUXI.
- Acceso autorizado al repositorio privado de GitHub.

Clonar el repositorio de documentacion:

```bash
git clone https://github.com/MrFoxxz/MUXI.git
cd MUXI
```

No ejecutar `git init`, porque el repositorio ya existe en GitHub.

## 2. Agregar MUXI a un proyecto existente

Ejemplo: `seralogin_plus`.

Entrar al proyecto original y crear la carpeta `.muxi` si todavia no existe:

```powershell
cd "C:\RUTA\seralogin_plus"
New-Item -ItemType Directory -Force ".muxi"
```

Si la carpeta ya existe, conservar todos sus archivos.

La estructura local sera:

```text
seralogin_plus/
├── .git/
├── src/
├── package.json
└── .muxi/
    ├── README.md
    ├── architecture.md
    └── decisions.md
```

Los archivos son ejemplos. No es necesario crear documentos vacios ni inventar informacion.

La carpeta `.muxi` no debe contener otro repositorio `.git`.

## 3. Importar la documentacion a MUXI

En el computador donde esta `seralogin_plus`, abrir el repositorio central MUXI.

Actualizarlo primero:

```bash
git pull --ff-only origin main
```

Desde la raiz de MUXI, utilizar el importador:

```bash
node scripts/import-docs.js --project seralogin_plus --source "C:/RUTA/seralogin_plus/.muxi"
```

Este comando usa los parametros `--project` y `--source` del importador incluido en este repositorio.

Si todavia no esta disponible esa interfaz, copiar los documentos manualmente a:

```text
MUXI/muxi_docs/seralogin_plus/
```

No copiar credenciales, archivos `.env`, claves privadas ni informacion sensible.

No sobrescribir documentos existentes sin revisar los cambios.

## 4. Revisar y publicar

Desde la raiz de MUXI:

```bash
git status
git add muxi_docs/seralogin_plus
git diff --cached
```

Revisar los documentos preparados.

Solo despues de la aprobacion humana:

```bash
git commit -m "docs(seralogin_plus): importar documentacion"
git push origin main
```

Esto publica la documentacion seleccionada dentro del repositorio central, siempre que no existan otros commits locales pendientes.

No modifica el repositorio Git del codigo fuente de `seralogin_plus`.

## 5. Trabajar desde otro computador

En el repositorio central MUXI:

```bash
git pull --ff-only origin main
```

La documentacion de `seralogin_plus` estara disponible en:

```text
muxi_docs/seralogin_plus/
```

Para llevarla a la carpeta `.muxi` local, copiar unicamente los documentos revisados. No sobrescribir cambios locales sin compararlos previamente.

## 6. Reglas de documentacion

- La documentacion debe describir el estado real del proyecto.
- No inventar funciones, componentes ni decisiones.
- Distinguir hechos verificados, propuestas y decisiones aprobadas.
- Solicitar aprobacion humana antes de publicar cambios.
- Conservar la carpeta `.muxi` dentro de cada proyecto.
- Mantener separado el Git del codigo y el Git de documentacion.
- No activar MCP ni automatizaciones en esta fase.

## 7. Agregar otro proyecto

Repetir el procedimiento, sustituyendo `seralogin_plus` por el identificador del nuevo proyecto.

Ejemplo:

```text
muxi_docs/
├── seralogin_plus/
├── madbius_page/
├── intelapp/
└── intelcare/
```

Cada proyecto tendra su propia documentacion y sus propios commits identificables.
