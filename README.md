# Escola Conecta — API

Comunicação entre a escola e as famílias dos alunos: **comunicados com confirmação de leitura**, **agenda escolar** e **mensagens diretas** entre responsáveis e professores.

Front-end: repositório `escola-conecta-front`.

Stack: NestJS 12 · TypeORM · PostgreSQL · JWT · Swagger · porta 4001.

## Papéis

| Papel           | O que faz                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **Direção** (`admin`) | Tudo: cadastra usuários, turmas e alunos; publica para a escola inteira; vê quem confirmou cada comunicado. |
| **Professor**   | Vê as suas turmas e alunos; publica comunicados e eventos para as suas turmas; responde às famílias. |
| **Responsável** | Vê os filhos, os comunicados e a agenda da escola e das turmas deles; confirma ciência; conversa com a escola. |

A regra de "quem enxerga o quê" está num só lugar: `src/common/acesso/acesso.service.ts`.

## Como rodar

Pré-requisitos: Node 20+ e PostgreSQL (local ou Neon).

```bash
cp .env.example .env        # ajuste DATABASE_URL (ou DB_*) e JWT_SECRET
npm install
npm run seed                # cria as tabelas e os dados de demonstração (APAGA o banco!)
npm run start:dev           # http://localhost:4001 · Swagger em http://localhost:4001/api
```

### Usuários de demonstração

Todos com a senha **`Senha@123`**:

| Papel                         | E-mail                         |
| ----------------------------- | ------------------------------ |
| Direção                       | `direcao@escolaconecta.com.br` |
| Professora do 5º Ano A        | `carla@escolaconecta.com.br`   |
| Professor do 2º Ano B         | `roberto@escolaconecta.com.br` |
| Mãe do Lucas e da Beatriz     | `maria@email.com`              |
| Pai do Lucas e da Beatriz     | `joao@email.com`               |
| Mãe do Gabriel                | `fernanda@email.com`           |

## API (resumo)

Tudo exige `Authorization: Bearer <token>`, exceto `POST /auth/entrar` e `GET /saude`.

| Método | Rota                          | Quem             |
| ------ | ----------------------------- | ---------------- |
| POST   | `/auth/entrar`                | público          |
| GET/PATCH | `/usuarios/eu`             | todos            |
| GET    | `/usuarios?papel=`            | equipe           |
| POST/PATCH | `/usuarios`, `/usuarios/:id` | direção       |
| GET    | `/turmas`, `/alunos`          | todos (filtrado) |
| POST/PATCH/DELETE | `/turmas`, `/alunos` | direção          |
| GET    | `/comunicados`                | todos (filtrado) |
| POST/DELETE | `/comunicados`           | equipe           |
| POST   | `/comunicados/:id/ciencia`    | responsável      |
| GET    | `/eventos?de=&ate=`           | todos (filtrado) |
| POST/DELETE | `/eventos`               | equipe           |
| GET/POST | `/conversas`                | todos (filtrado) |
| GET    | `/conversas/:id` (marca como lida) | participantes |
| POST   | `/conversas/:id/mensagens`    | participantes    |

## Banco em produção (Supabase, Neon, Render…)

No `back/.env`:

```
DATABASE_URL=postgresql://usuario:senha@host:5432/postgres
DB_SSL=true
DB_SYNC=false
```

`DB_SYNC=true` cria as tabelas automaticamente a partir das entidades — prático no desenvolvimento, arriscado em produção. Antes de publicar, troque por migrations do TypeORM.

## Próximos passos sugeridos

- Migrations do TypeORM (hoje o esquema vem do `DB_SYNC`).
- Recuperação de senha por e-mail (hoje a secretaria redefine).
- Notificações (e-mail / push) quando sai um comunicado ou chega mensagem.
- Mensagens em tempo real (WebSocket); hoje a conversa aberta atualiza a cada 15 s.
- Anexos em comunicados (PDF, fotos) e autorizações de passeio com assinatura.
- Frequência e boletim.
