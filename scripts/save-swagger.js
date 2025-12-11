import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sample API',
      version: '1.0.0',
      description: '겉보기용 샘플 API 문서',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: '로컬 개발 서버',
      },
    ],
  },
  apis: ['./server/index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('✅ Swagger JSON 파일이 생성되었습니다: ./swagger.json');

