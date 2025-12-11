# Scripts 설명

이 폴더에는 프로젝트에서 사용하는 유틸리티 스크립트들이 있습니다.

## 📁 파일 목록

### 1. `save-swagger.js`

**역할**: 서버 코드에서 Swagger JSON을 생성하여 파일로 저장

**사용 시나리오**:

- 서버가 실행되지 않아도 Swagger JSON을 생성하고 싶을 때
- CI/CD 파이프라인에서 서버 없이 API 클라이언트를 생성할 때
- `orval.config.ts`의 `target`이 `"./swagger.json"`일 때

**실행 방법**:

```bash
npm run save:swagger
```

**생성 파일**: `./swagger.json`

---

### 2. `fix-orval-query-key.js`

**역할**: Orval이 생성한 React Query hooks의 문제를 자동으로 수정

**문제점**:
Orval이 생성한 코드에서 React의 규칙을 위반하는 패턴이 있습니다:

```typescript
// ❌ 문제가 있는 코드
query.queryKey = queryOptions.queryKey;
return query;
```

**해결 방법**:
이 스크립트가 자동으로 다음과 같이 수정합니다:

```typescript
// ✅ 수정된 코드
return {
  ...query,
  queryKey: queryOptions.queryKey,
};
```

**사용 시나리오**:

- `npm run generate:api` 실행 후 자동으로 실행됨
- Orval이 생성한 모든 파일에서 `queryKey` 할당 문제를 일괄 수정

**실행 방법**:

```bash
# 자동 실행 (generate:api 실행 시)
npm run generate:api

# 수동 실행
node scripts/fix-orval-query-key.js
```

---

## 🔧 npm 스크립트

### `npm run save:swagger`

서버 코드에서 Swagger JSON을 생성하여 `./swagger.json` 파일로 저장합니다.

### `npm run generate:api`

1. Orval을 실행하여 API 클라이언트를 생성합니다
2. 생성된 코드의 문제를 자동으로 수정합니다

**참고**: 현재 `orval.config.ts`가 URL(`http://localhost:3001/api-docs.json`)을 사용하므로, 서버가 실행 중이어야 합니다.

### `npm run generate:api:from-file`

1. 서버 코드에서 Swagger JSON을 파일로 저장합니다
2. 저장된 파일을 사용하여 API 클라이언트를 생성합니다
3. 생성된 코드의 문제를 자동으로 수정합니다

**참고**: 서버가 실행되지 않아도 사용할 수 있습니다. `orval.config.ts`의 `target`을 `"./swagger.json"`으로 변경해야 합니다.

---

## 💡 사용 팁

### 서버가 실행 중일 때

```bash
npm run generate:api
```

### 서버가 실행되지 않을 때

1. `orval.config.ts`의 `target`을 `"./swagger.json"`으로 변경
2. `npm run generate:api:from-file` 실행
