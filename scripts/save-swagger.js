/**
 * Swagger JSON 파일 저장 스크립트
 *
 * 역할:
 * - 서버 코드(server/index.js)에서 Swagger 스펙을 직접 생성
 * - 생성된 Swagger JSON을 ./swagger.json 파일로 저장
 *
 * 사용 시나리오:
 * - 서버가 실행되지 않아도 Swagger JSON을 생성할 수 있음
 * - CI/CD 파이프라인에서 서버 없이 API 클라이언트 생성 시 유용
 * - orval.config.ts의 target이 "./swagger.json"일 때 사용
 *
 * 실행 방법:
 *   npm run save:swagger
 */

import fs from "fs";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sample API",
      version: "1.0.0",
      description: "겉보기용 샘플 API 문서",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "로컬 개발 서버",
      },
    ],
  },
  apis: ["./server/index.js"],
};

try {
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));
  console.log("✅ Swagger JSON 파일이 생성되었습니다: ./swagger.json");
} catch (error) {
  console.error("❌ Swagger JSON 생성 실패:", error.message);
  process.exit(1);
}
