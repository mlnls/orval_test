/**
 * Orval 생성 코드 자동 수정 스크립트
 *
 * 역할:
 * - orval이 생성한 React Query hooks에서 발생하는 문제를 자동으로 수정
 * - React의 규칙 위반: hook 반환값을 직접 수정하는 코드를 수정
 *
 * 문제:
 *   query.queryKey = queryOptions.queryKey;  // ❌ React 규칙 위반
 *   return query;
 *
 * 해결:
 *   return {                              // ✅ 새 객체 반환
 *     ...query,
 *     queryKey: queryOptions.queryKey,
 *   };
 *
 * 사용 시나리오:
 * - npm run generate:api 실행 후 자동으로 실행됨
 * - orval이 생성한 모든 파일에서 queryKey 할당 문제를 일괄 수정
 *
 * 실행 방법:
 *   npm run generate:api  (자동 실행)
 *   또는
 *   node scripts/fix-orval-query-key.js  (수동 실행)
 */

import fs from "fs";
import { globSync } from "glob";

const files = globSync("src/api/generated/**/*.ts");
let fixedCount = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  let modified = false;

  const lines = content.split("\n");
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || "";
    const nextNextLine = lines[i + 2] || "";

    // query.queryKey = queryOptions.queryKey; 패턴 찾기
    if (line.includes("query.queryKey = queryOptions.queryKey")) {
      // 다음 줄이 빈 줄이고 그 다음이 return query;인지 확인
      if (
        nextLine.trim() === "" &&
        nextNextLine.trim().startsWith("return query;")
      ) {
        // 수정: return { ...query, queryKey: queryOptions.queryKey }; 로 변경
        const indent = line.match(/^(\s*)/)[1];
        newLines.push(`${indent}return {`);
        newLines.push(`${indent}  ...query,`);
        newLines.push(`${indent}  queryKey: queryOptions.queryKey,`);
        newLines.push(`${indent}};`);
        i += 2; // 빈 줄과 return query; 줄도 건너뛰기
        modified = true;
        continue;
      } else if (nextLine.trim().startsWith("return query;")) {
        // 바로 다음 줄이 return query;인 경우
        const indent = line.match(/^(\s*)/)[1];
        newLines.push(`${indent}return {`);
        newLines.push(`${indent}  ...query,`);
        newLines.push(`${indent}  queryKey: queryOptions.queryKey,`);
        newLines.push(`${indent}};`);
        i += 1; // return query; 줄 건너뛰기
        modified = true;
        continue;
      } else {
        // return query가 없는 경우도 수정 (중복 return 방지)
        const indent = line.match(/^(\s*)/)[1];
        newLines.push(`${indent}return {`);
        newLines.push(`${indent}  ...query,`);
        newLines.push(`${indent}  queryKey: queryOptions.queryKey,`);
        newLines.push(`${indent}};`);
        modified = true;
        continue;
      }
    }

    newLines.push(line);
  }

  if (modified) {
    fs.writeFileSync(file, newLines.join("\n"), "utf8");
    console.log(`✅ Fixed: ${file}`);
    fixedCount++;
  }
});

if (fixedCount > 0) {
  console.log(`\n🎉 ${fixedCount}개 파일이 수정되었습니다!`);
} else {
  console.log("✅ 수정할 파일이 없습니다.");
}
