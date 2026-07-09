# Especificação Técnica - APIs REST
## Arquitetura Multi-Portal Gamellito

**Data:** 2026-06-24  
**Versão:** 1.0  
**Status:** Rascunho Técnico

---

## Índice
1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [APIs de Autenticação](#apis-de-autenticação)
4. [APIs de Família](#apis-de-família)
5. [APIs de Profissional](#apis-de-profissional)
6. [APIs de Educador](#apis-de-educador)
7. [APIs de Instituição](#apis-de-instituição)
8. [APIs de Permissões](#apis-de-permissões)
9. [APIs de Loja](#apis-de-loja)
10. [APIs de Convites](#apis-de-convites)
11. [Padrões e Convenções](#padrões-e-convenções)

---

## Visão Geral

### Base URL
```
Production: https://api.gamellito.com/v1
Staging:    https://staging-api.gamellito.com/v1
Development: http://localhost:3000/api/v1
```

### Rate Limiting
```
- Usuários autenticados: 1000 req/hora
- Usuários não autenticados: 100 req/hora
- Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
```

### Erro Padrão (JSON)
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Descrição legível do erro",
    "details": {
      "field": "email",
      "reason": "Email inválido"
    },
    "request_id": "req-12345-abcde",
    "timestamp": "2026-06-24T14:30:00Z"
  }
}
```

---

## Autenticação

### JWT Token
```
Header: Authorization: Bearer <jwt_token>
Token válido por: 24 horas
Refresh token válido por: 7 dias
```

### Refresh Token Flow
```
1. POST /auth/refresh com refresh_token
2. Recebe novo access_token + refresh_token
3. Remover refresh_token antigo do banco
```

---

## APIs de Autenticação

### 1. POST /auth/signup
**Criar nova conta (seleção de role)**

```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "pai@example.com",
  "password": "senhaSegura123!",
  "nome": "João Silva",
  "role": "familia"
}
```

**Response 201 Created**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "pai@example.com",
  "role": "familia",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400,
  "next_step": "/familia/onboarding/crianca"
}
```

**Response 400 Bad Request**
```json
{
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Este email já está registrado",
    "details": {
      "email": "pai@example.com"
    }
  }
}
```

**Response 400 Bad Request - Validação**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": {
      "password": "Mínimo 8 caracteres, com letra maiúscula, número e caractere especial"
    }
  }
}
```

---

### 2. POST /auth/login
**Fazer login**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "pai@example.com",
  "password": "senhaSegura123!"
}
```

**Response 200 OK**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "pai@example.com",
  "role": "familia",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

**Response 401 Unauthorized**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou senha inválidos"
  }
}
```

**cURL**
```bash
curl -X POST https://api.gamellito.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pai@example.com",
    "password": "senhaSegura123!"
  }'
```

---

### 3. POST /auth/refresh
**Renovar access token**

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 OK**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

---

### 4. GET /auth/select-role
**Obter lista de roles disponíveis**

```http
GET /api/v1/auth/select-role
```

**Response 200 OK**
```json
{
  "roles": [
    {
      "id": "familia",
      "label": "Sou Responsável/Família",
      "description": "Acompanhe a saúde e nutrição das crianças",
      "icon": "👨‍👩‍👧"
    },
    {
      "id": "profissional",
      "label": "Sou Profissional de Saúde",
      "description": "Acompanhe pacientes e crie notas clínicas",
      "icon": "👨‍⚕️"
    },
    {
      "id": "educador",
      "label": "Sou Educador",
      "description": "Acompanhe turmas e alunos",
      "icon": "👨‍🏫"
    },
    {
      "id": "instituicao",
      "label": "Sou Instituição",
      "description": "Gerencie sua escola, clínica ou hospital",
      "icon": "🏫"
    }
  ]
}
```

---

### 5. POST /auth/logout
**Fazer logout**

```http
POST /api/v1/auth/logout
Authorization: Bearer <jwt_token>
```

**Response 204 No Content**

---

## APIs de Família

### 1. GET /familia/dashboard
**Dashboard principal da família**

```http
GET /api/v1/familia/dashboard?limit=10&offset=0
Authorization: Bearer <jwt_token>
```

**Query Parameters**
| Param | Type | Default | Descrição |
|-------|------|---------|-----------|
| limit | int | 10 | Quantidade de registros |
| offset | int | 0 | Paginação |

**Response 200 OK**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "pai@example.com",
    "nome": "João Silva",
    "avatar_url": "https://gamellito.com/avatares/joao.png"
  },
  "criancas": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "nome": "Marina",
      "data_nascimento": "2020-01-15",
      "foto_url": "https://gamellito.com/fotos/marina.jpg",
      "humor_hoje": "feliz",
      "registros_hoje": 3,
      "moedas": 150
    }
  ],
  "registros_recentes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "crianca_id": "550e8400-e29b-41d4-a716-446655440001",
      "tipo": "glicemia",
      "valor": 120,
      "unidade": "mg/dL",
      "data_hora": "2026-06-24T14:30:00Z",
      "notas": "Após almoço"
    }
  ],
  "moedas_totais": 450,
  "proximos_objetivos": [
    {
      "id": "1",
      "descricao": "10 registros em um dia",
      "progresso": 3,
      "meta": 10,
      "recompensa": 50
    }
  ]
}
```

**Response 401 Unauthorized**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido ou expirado"
  }
}
```

**cURL**
```bash
curl -X GET https://api.gamellito.com/v1/familia/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 2. POST /familia/crianca
**Adicionar nova criança**

```http
POST /api/v1/familia/crianca
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "nome": "Marina",
  "data_nascimento": "2020-01-15",
  "genero": "feminino",
  "condicao": "diabetes"
}
```

**Response 201 Created**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "nome": "Marina",
  "data_nascimento": "2020-01-15",
  "genero": "feminino",
  "condicao": "diabetes",
  "criada_em": "2026-06-24T14:30:00Z"
}
```

---

### 3. GET /familia/crianca/{id}/registros
**Listar registros da criança**

```http
GET /api/v1/familia/crianca/550e8400-e29b-41d4-a716-446655440001/registros?
  tipo=glicemia&
  data_inicio=2026-06-01&
  data_fim=2026-06-30&
  limit=50&
  offset=0
Authorization: Bearer <jwt_token>
```

**Query Parameters**
| Param | Type | Descrição |
|-------|------|-----------|
| tipo | string | glicemia, alimentacao, exercicio, medicamento, etc |
| data_inicio | date | ISO 8601 |
| data_fim | date | ISO 8601 |
| limit | int | Default: 50 |
| offset | int | Default: 0 |

**Response 200 OK**
```json
{
  "registros": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "crianca_id": "550e8400-e29b-41d4-a716-446655440001",
      "tipo": "glicemia",
      "valor": 120,
      "unidade": "mg/dL",
      "data_hora": "2026-06-24T14:30:00Z",
      "notas": "Após almoço",
      "foto_url": null,
      "criado_em": "2026-06-24T14:35:00Z",
      "atualizado_em": "2026-06-24T14:35:00Z",
      "profissional_comentarios": [
        {
          "profissional_id": "550e8400-e29b-41d4-a716-446655440003",
          "profissional_nome": "Dra. Ana Silva",
          "comentario": "Valor dentro do normal",
          "data": "2026-06-24T15:00:00Z"
        }
      ]
    }
  ],
  "total": 500,
  "limit": 50,
  "offset": 0,
  "has_more": true
}
```

---

### 4. POST /familia/crianca/{id}/compartilhar
**Compartilhar dados da criança com profissional**

```http
POST /api/v1/familia/crianca/550e8400-e29b-41d4-a716-446655440001/compartilhar
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "email_profissional": "medico@clinic.com",
  "tipo_acesso": "readonly",
  "expira_em": "2026-12-31T23:59:59Z",
  "tipos_consentimento": [
    "registros_glicemia",
    "registros_alimentacao"
  ]
}
```

**Request Schema**
```json
{
  "email_profissional": "string (email, required)",
  "tipo_acesso": "enum (readonly, comment, full) (required)",
  "expira_em": "datetime (ISO 8601, optional, null = never)",
  "tipos_consentimento": "array[enum] (optional, default: all)"
}
```

**Response 201 Created**
```json
{
  "convite_id": "550e8400-e29b-41d4-a716-446655440010",
  "permissao_id": "550e8400-e29b-41d4-a716-446655440011",
  "profissional_email": "medico@clinic.com",
  "tipo_acesso": "readonly",
  "expira_em": "2026-12-31T23:59:59Z",
  "status": "pendente",
  "qr_code_url": "https://gamellito.com/qr/abc123",
  "link_convite": "https://gamellito.com/convites/abc123?token=xyz789",
  "criado_em": "2026-06-24T14:30:00Z"
}
```

**Response 409 Conflict**
```json
{
  "error": {
    "code": "ALREADY_SHARED",
    "message": "Dados já compartilhados com este profissional",
    "details": {
      "permissao_id": "550e8400-e29b-41d4-a716-446655440011",
      "expira_em": "2026-12-31T23:59:59Z"
    }
  }
}
```

---

### 5. GET /familia/compartilhamentos
**Listar todos os compartilhamentos feitos**

```http
GET /api/v1/familia/compartilhamentos?status=ativo
Authorization: Bearer <jwt_token>
```

**Query Parameters**
| Param | Type | Default | Descrição |
|-------|------|---------|-----------|
| status | enum | ativo | ativo, expirado, revogado, todos |

**Response 200 OK**
```json
{
  "compartilhamentos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "crianca_id": "550e8400-e29b-41d4-a716-446655440001",
      "crianca_nome": "Marina",
      "profissional_id": "550e8400-e29b-41d4-a716-446655440003",
      "profissional_nome": "Dra. Ana Silva",
      "profissional_email": "medico@clinic.com",
      "profissional_foto": "https://gamellito.com/fotos/ana.jpg",
      "tipo_acesso": "readonly",
      "status": "ativo",
      "criado_em": "2026-06-01T10:00:00Z",
      "expira_em": "2026-12-31T23:59:59Z",
      "revogado_em": null
    }
  ],
  "total": 5
}
```

---

### 6. DELETE /familia/compartilhamentos/{id}
**Revogar compartilhamento**

```http
DELETE /api/v1/familia/compartilhamentos/550e8400-e29b-41d4-a716-446655440011
Authorization: Bearer <jwt_token>
```

**Response 204 No Content**

**cURL**
```bash
curl -X DELETE https://api.gamellito.com/v1/familia/compartilhamentos/550e8400-e29b-41d4-a716-446655440011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## APIs de Profissional

### 1. GET /profissional/dashboard
**Dashboard do profissional**

```http
GET /api/v1/profissional/dashboard?limit=20&offset=0
Authorization: Bearer <jwt_token>
```

**Response 200 OK**
```json
{
  "profissional": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "nome": "Dra. Ana Silva",
    "email": "medico@clinic.com",
    "crm": "CRM-123456",
    "especialidade": "Pediatria",
    "foto_url": "https://gamellito.com/fotos/ana.jpg",
    "verificado": true
  },
  "pacientes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "nome": "Marina",
      "data_nascimento": "2020-01-15",
      "condicao": "diabetes",
      "compartilhado_em": "2026-06-01T10:00:00Z",
      "ultimo_registro": "2026-06-24T14:30:00Z",
      "registros_pendentes": 3,
      "tipo_acesso": "readonly"
    }
  ],
  "total_pacientes": 15,
  "registros_pendentes_total": 45
}
```

---

### 2. GET /profissional/paciente/{id}
**Detalhes do paciente**

```http
GET /api/v1/profissional/paciente/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <jwt_token>
```

**Response 200 OK**
```json
{
  "paciente": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "nome": "Marina",
    "data_nascimento": "2020-01-15",
    "genero": "feminino",
    "condicao": "diabetes",
    "foto_url": "https://gamellito.com/fotos/marina.jpg"
  },
  "compartilhamento": {
    "tipo_acesso": "readonly",
    "consentimentos": [
      "registros_glicemia",
      "registros_alimentacao"
    ],
    "desde": "2026-06-01T10:00:00Z",
    "expira_em": null
  },
  "registros_ultimos_20": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "tipo": "glicemia",
      "valor": 120,
      "unidade": "mg/dL",
      "data_hora": "2026-06-24T14:30:00Z",
      "notas": "Após almoço",
      "lido_por_profissional": true,
      "lido_em": "2026-06-24T15:00:00Z"
    }
  ],
  "notas_clinicas": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440012",
      "texto": "Paciente apresenta adesão excelente ao tratamento",
      "data": "2026-06-24T15:30:00Z",
      "privada": true
    }
  ]
}
```

---

### 3. POST /profissional/paciente/{id}/notas
**Adicionar nota clínica privada**

```http
POST /api/v1/profissional/paciente/550e8400-e29b-41d4-a716-446655440001/notas
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "texto": "Paciente apresenta adesão excelente ao tratamento",
  "privada": true
}
```

**Response 201 Created**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440012",
  "paciente_id": "550e8400-e29b-41d4-a716-446655440001",
  "profissional_id": "550e8400-e29b-41d4-a716-446655440003",
  "texto": "Paciente apresenta adesão excelente ao tratamento",
  "privada": true,
  "criada_em": "2026-06-24T15:30:00Z",
  "atualizada_em": "2026-06-24T15:30:00Z"
}
```

---

### 4. POST /profissional/paciente/{id}/registros/{registro_id}/comentario
**Adicionar comentário em um registro**

```http
POST /api/v1/profissional/paciente/550e8400-e29b-41d4-a716-446655440001/registros/550e8400-e29b-41d4-a716-446655440002/comentario
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "texto": "Valor dentro do normal, bom controle!"
}
```

**Response 201 Created**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440020",
  "registro_id": "550e8400-e29b-41d4-a716-446655440002",
  "profissional_id": "550e8400-e29b-41d4-a716-446655440003",
  "profissional_nome": "Dra. Ana Silva",
  "texto": "Valor dentro do normal, bom controle!",
  "criado_em": "2026-06-24T15:35:00Z"
}
```

---

## APIs de Educador

### 1. GET /educador/dashboard
**Dashboard do educador**

```http
GET /api/v1/educador/dashboard
Authorization: Bearer <jwt_token>
```

**Response 200 OK**
```json
{
  "educador": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "nome": "Prof. Carlos Santos",
    "email": "carlos@escola.com",
    "instituicao_id": "550e8400-e29b-41d4-a716-446655440100"
  },
  "grupos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440101",
      "nome": "Turma 5A",
      "total_alunos": 25,
      "alunos_com_registros": 18,
      "adesao_percentual": 72,
      "criado_em": "2026-03-01T09:00:00Z"
    }
  ],
  "total_alunos": 45,
  "registros_hoje": 32
}
```

---

### 2. GET /educador/grupo/{id}
**Detalhes de um grupo**

```http
GET /api/v1/educador/grupo/550e8400-e29b-41d4-a716-446655440101?include=alunos,registros
Authorization: Bearer <jwt_token>
```

**Query Parameters**
| Param | Type | Descrição |
|-------|------|-----------|
| include | string | alunos, registros, estatisticas (comma-separated) |

**Response 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440101",
  "nome": "Turma 5A",
  "instituicao_id": "550e8400-e29b-41d4-a716-446655440100",
  "educador_id": "550e8400-e29b-41d4-a716-446655440004",
  "criado_em": "2026-03-01T09:00:00Z",
  "alunos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "nome": "Marina",
      "email": "responsavel@example.com",
      "registros_semana": 15,
      "adesao": 100
    }
  ],
  "registros": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "aluno_nome": "Marina",
      "tipo": "glicemia",
      "valor": 120,
      "data_hora": "2026-06-24T14:30:00Z"
    }
  ],
  "estatisticas": {
    "registros_totais": 450,
    "adesao_media": 85.5,
    "alunos_ativos": 20
  }
}
```

---

## APIs de Instituição

### 1. GET /instituicao/dashboard
**Dashboard administrativo da instituição**

```http
GET /api/v1/instituicao/dashboard
Authorization: Bearer <jwt_token>
X-Institution-ID: 550e8400-e29b-41d4-a716-446655440100
```

**Response 200 OK**
```json
{
  "instituicao": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "nome": "Escola Exemplo",
    "tipo": "escola",
    "cnpj": "12.345.678/0001-99",
    "email": "admin@escola.com",
    "ativa": true
  },
  "estatisticas": {
    "total_usuarios": 150,
    "total_criancas": 45,
    "total_responsaveis": 80,
    "total_educadores": 15,
    "total_profissionais": 10,
    "adesao_percentual": 78.5,
    "registros_mes": 1200
  },
  "grupos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440101",
      "nome": "Turma 5A",
      "educador": "Prof. Carlos Santos",
      "total_alunos": 25,
      "adesao": 72
    }
  ]
}
```

---

### 2. POST /instituicao/grupos
**Criar novo grupo/turma**

```http
POST /api/v1/instituicao/grupos
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "nome": "Turma 5A",
  "descricao": "Quinta série, turma A",
  "educador_id": "550e8400-e29b-41d4-a716-446655440004"
}
```

**Response 201 Created**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440101",
  "instituicao_id": "550e8400-e29b-41d4-a716-446655440100",
  "nome": "Turma 5A",
  "descricao": "Quinta série, turma A",
  "educador_id": "550e8400-e29b-41d4-a716-446655440004",
  "ativo": true,
  "criado_em": "2026-06-24T14:30:00Z"
}
```

---

### 3. GET /instituicao/relatorios/grupo/{id}
**Relatório detalhado de um grupo**

```http
GET /api/v1/instituicao/relatorios/grupo/550e8400-e29b-41d4-a716-446655440101?
  data_inicio=2026-06-01&
  data_fim=2026-06-30
Authorization: Bearer <jwt_token>
```

**Response 200 OK**
```json
{
  "grupo": {
    "id": "550e8400-e29b-41d4-a716-446655440101",
    "nome": "Turma 5A",
    "educador": "Prof. Carlos Santos",
    "total_alunos": 25
  },
  "periodo": {
    "data_inicio": "2026-06-01",
    "data_fim": "2026-06-30"
  },
  "estatisticas": {
    "registros_totais": 450,
    "registros_dia": 15,
    "adesao_media": 85.5,
    "adesao_min": 60,
    "adesao_max": 100,
    "membros_ativos": 20,
    "membros_inativos": 5
  },
  "distribuicao_tipos": {
    "glicemia": 200,
    "alimentacao": 150,
    "exercicio": 100
  },
  "alunos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "nome": "Marina",
      "registros": 25,
      "adesao": 100,
      "ultima_atualizacao": "2026-06-24T14:30:00Z"
    }
  ]
}
```

---

### 4. POST /instituicao/relatorios/exportar
**Exportar relatório em CSV/PDF**

```http
POST /api/v1/instituicao/relatorios/exportar
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "tipo": "grupo",
  "grupo_id": "550e8400-e29b-41d4-a716-446655440101",
  "formato": "pdf",
  "data_inicio": "2026-06-01",
  "data_fim": "2026-06-30"
}
```

**Response 200 OK**
```
File: grupo-turma-5a-202606.pdf (binary)
Header: Content-Type: application/pdf
Header: Content-Disposition: attachment; filename="grupo-turma-5a-202606.pdf"
```

---

## APIs de Permissões

### 1. GET /permissoes
**Listar todas as permissões do usuário**

```http
GET /api/v1/permissoes?tipo=recebido
Authorization: Bearer <jwt_token>
```

**Query Parameters**
| Param | Type | Default | Descrição |
|-------|------|---------|-----------|
| tipo | enum | todos | recebido, concedido, todos |
| status | enum | ativo | ativo, expirado, revogado, todos |

**Response 200 OK**
```json
{
  "compartilhado_comigo": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "usuario_dono_id": "550e8400-e29b-41d4-a716-446655440005",
      "usuario_dono_nome": "Maria Santos",
      "crianca_nome": "Felipe",
      "tipo_acesso": "readonly",
      "consentimentos": ["registros_glicemia"],
      "criado_em": "2026-06-01T10:00:00Z",
      "expira_em": null,
      "status": "ativo"
    }
  ],
  "que_eu_compartilhei": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440012",
      "usuario_acesso_id": "550e8400-e29b-41d4-a716-446655440003",
      "usuario_acesso_nome": "Dra. Ana Silva",
      "crianca_nome": "Marina",
      "tipo_acesso": "comment",
      "criado_em": "2026-06-15T14:00:00Z",
      "expira_em": "2026-12-31T23:59:59Z",
      "status": "ativo"
    }
  ]
}
```

---

### 2. DELETE /permissoes/{id}
**Revogar permissão**

```http
DELETE /api/v1/permissoes/550e8400-e29b-41d4-a716-446655440011
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "motivo": "Fim do atendimento" (opcional)
}
```

**Response 204 No Content**

---

### 3. POST /permissoes/{id}/estender
**Estender data de expiração**

```http
POST /api/v1/permissoes/550e8400-e29b-41d4-a716-446655440012/estender
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "nova_data_expiracao": "2027-12-31T23:59:59Z"
}
```

**Response 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440012",
  "expira_em_anterior": "2026-12-31T23:59:59Z",
  "expira_em": "2027-12-31T23:59:59Z",
  "atualizado_em": "2026-06-24T14:30:00Z"
}
```

---

## APIs de Convites

### 1. GET /convites/pendentes
**Listar convites pendentes**

```http
GET /api/v1/convites/pendentes
Authorization: Bearer <jwt_token>
```

**Response 200 OK**
```json
{
  "convites": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440030",
      "usuario_remetente_id": "550e8400-e29b-41d4-a716-446655440005",
      "usuario_remetente_nome": "Maria Santos",
      "tipo_convite": "compartilhar_dados",
      "dados": {
        "crianca_nome": "Felipe",
        "tipo_acesso": "readonly"
      },
      "criado_em": "2026-06-20T10:00:00Z",
      "expira_em": "2026-07-20T10:00:00Z",
      "token": "abc123xyz789"
    }
  ],
  "total": 2
}
```

---

### 2. POST /convites/{id}/aceitar
**Aceitar convite**

```http
POST /api/v1/convites/550e8400-e29b-41d4-a716-446655440030/aceitar
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "token": "abc123xyz789"
}
```

**Response 200 OK**
```json
{
  "convite_id": "550e8400-e29b-41d4-a716-446655440030",
  "aceito": true,
  "aceito_em": "2026-06-24T14:30:00Z",
  "permissao_id": "550e8400-e29b-41d4-a716-446655440011",
  "proximos_passos": "/profissional/dashboard"
}
```

**Response 400 Bad Request**
```json
{
  "error": {
    "code": "CONVITE_EXPIRADO",
    "message": "Este convite expirou",
    "details": {
      "expirado_em": "2026-07-20T10:00:00Z"
    }
  }
}
```

---

### 3. POST /convites/{token}/aceitar-anonimo
**Aceitar convite sem autenticação (criar conta)**

```http
POST /api/v1/convites/abc123xyz789/aceitar-anonimo
Content-Type: application/json

{
  "email": "profissional@clinic.com",
  "password": "senhaSegura123!",
  "nome": "Dr. João"
}
```

**Response 201 Created**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440031",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "convite_aceito": true,
  "permissao_id": "550e8400-e29b-41d4-a716-446655440011"
}
```

---

## APIs de Loja

### 1. GET /loja/items
**Listar itens disponíveis da loja**

```http
GET /api/v1/loja/items?tipo=avatar&limit=20&offset=0
Authorization: Bearer <jwt_token>
```

**Query Parameters**
| Param | Type | Default | Descrição |
|-------|------|---------|-----------|
| tipo | string | - | avatar, skin, emote, decoracao |
| limit | int | 20 | |
| offset | int | 0 | |

**Response 200 OK**
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440040",
      "nome": "Avatar Dinossauro",
      "descricao": "Um simpático dinossauro verde",
      "tipo": "avatar",
      "custo_moedas": 50,
      "imagem_url": "https://gamellito.com/avatares/dino.png",
      "imagem_preview_url": "https://gamellito.com/avatares/dino-preview.png",
      "quantidade_disponivel": null,
      "ordem_exibicao": 1
    }
  ],
  "total": 15,
  "moedas_usuario": 150
}
```

---

### 2. GET /loja/inventario
**Listar itens do inventário do usuário**

```http
GET /api/v1/loja/inventario
Authorization: Bearer <jwt_token>
```

**Response 200 OK**
```json
{
  "inventario": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440050",
      "item_id": "550e8400-e29b-41d4-a716-446655440040",
      "item_nome": "Avatar Dinossauro",
      "tipo": "avatar",
      "quantidade": 1,
      "adquirido_em": "2026-06-20T10:00:00Z",
      "ativo": true,
      "data_ativacao": "2026-06-20T10:05:00Z"
    }
  ],
  "total": 8,
  "moedas_totais": 150
}
```

---

### 3. POST /loja/comprar
**Comprar item da loja**

```http
POST /api/v1/loja/comprar
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "item_id": "550e8400-e29b-41d4-a716-446655440040",
  "quantidade": 1
}
```

**Response 201 Created**
```json
{
  "sucesso": true,
  "item_id": "550e8400-e29b-41d4-a716-446655440040",
  "item_nome": "Avatar Dinossauro",
  "moedas_gastas": 50,
  "saldo_novo": 100,
  "inventario_id": "550e8400-e29b-41d4-a716-446655440050",
  "adquirido_em": "2026-06-24T14:30:00Z"
}
```

**Response 400 Bad Request - Saldo insuficiente**
```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Saldo de moedas insuficiente",
    "details": {
      "moedas_necessarias": 50,
      "moedas_disponiveis": 30,
      "diferenca": 20
    }
  }
}
```

---

### 4. POST /loja/inventario/{id}/ativar
**Ativar item do inventário**

```http
POST /api/v1/loja/inventario/550e8400-e29b-41d4-a716-446655440050/ativar
Authorization: Bearer <jwt_token>
```

**Response 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440050",
  "ativo": true,
  "data_ativacao": "2026-06-24T14:35:00Z"
}
```

---

## Padrões e Convenções

### 1. Paginação

Todas as listagens devem usar este padrão:

```json
{
  "data": [...],
  "pagination": {
    "total": 500,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

---

### 2. Timestamps

Sempre usar ISO 8601 com timezone UTC:
```
"2026-06-24T14:30:00Z"
```

---

### 3. Códigos de Status HTTP

| Status | Uso |
|--------|-----|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado |
| 204 | No Content - Sucesso sem corpo |
| 400 | Bad Request - Validação falhou |
| 401 | Unauthorized - Autenticação necessária |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito de estado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

### 4. IDs

Sempre usar UUID v4:
```
550e8400-e29b-41d4-a716-446655440000
```

---

### 5. Headers Recomendados

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
X-Request-ID: <unique-request-id>
X-Client-Version: <version>
User-Agent: Gamellito-App/1.0.0
```

---

### 6. Exemplo: Fluxo de Compartilhamento Completo

```
1. Familia faz POST /familia/crianca/{id}/compartilhar
2. Sistema cria:
   - permissao (tipo='readonly')
   - convite (status='pendente')
   - consentimento_granular

3. Sistema envia email com link para profissional
4. Profissional abre link:
   - GET /convites/{token}/validar (sem auth)
   - Se autenticado: POST /convites/{id}/aceitar
   - Se novo: POST /convites/{token}/aceitar-anonimo

5. Profissional agora:
   - GET /profissional/dashboard
   - GET /profissional/paciente/{id}/registros
   - POST /profissional/paciente/{id}/notas (comentários)
```

---

**Próximas Etapas:**
- Implementar SDK cliente (JavaScript/React)
- Implementar SDK backend (Node.js, Python)
- Setup de documentação interativa (Swagger/OpenAPI)
- Testing com k6 para load testing
