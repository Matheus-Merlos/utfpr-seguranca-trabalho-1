# Design: GitHub Actions CI/CD

## Workflows

### `.github/workflows/ci.yml` - Validação em PRs

```yaml
on: pull_request

jobs:
  backend:
    - npm ci
    - npm run lint (se existir)
    - npm run build
  
  frontend:
    - npm ci
    - npm run build
```

### `.github/workflows/cd.yml` - Deploy em push to main

```yaml
on:
  push:
    branches: [main]

jobs:
  build-backend:
    - Checkout
    - Login Docker Hub
    - Build e push: $DOCKERHUB_USERNAME/sigacad-api:latest

  build-frontend:
    - Checkout
    - npm ci && npm run build
    - Login Docker Hub
    - Build e push: $DOCKERHUB_USERNAME/sigacad-frontend:latest

  deploy:
    needs: [build-backend, build-frontend]
    - SCP frontend dist para /var/www/frontend
    - SSH: docker pull && docker-compose up -d && systemctl restart caddy
```

## Arquivos Docker

### `backend/Dockerfile` (atualizar para prod)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### `frontend/Dockerfile` (novo, para build multi-stage)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### `docker-compose.prod.yml` (produção no servidor)

```yaml
services:
  api:
    image: $DOCKERHUB_USERNAME/sigacad-api:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=...
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER/PASSWORD/DB
```

## Secrets necessários (GitHub)

| Secret | Descrição |
|--------|-----------|
| `DOCKERHUB_USERNAME` | Usuário Docker Hub |
| `DOCKERHUB_TOKEN` | Token de acesso Docker Hub |
| `DROPLET_IP` | IP do droplet |
| `DROPLET_SSH_KEY` | Chave SSH privada para acessar o droplet |

## Configuração manual

1. Criar token no Docker Hub (Settings → Security → New Access Token)
2. Adicionar secrets no GitHub (Settings → Secrets → Actions)
3. Garantir que a chave SSH está autorizada no droplet
