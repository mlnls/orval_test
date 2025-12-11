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
