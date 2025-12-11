import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/api/generated/**/*.ts');

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // 패턴: query.queryKey = queryOptions.queryKey; (공백 포함 가능)
  // 다음에 return query;가 오는 경우를 찾아서 수정
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || '';
    const nextNextLine = lines[i + 2] || '';
    
    // query.queryKey = queryOptions.queryKey; 패턴 찾기
    if (line.includes('query.queryKey = queryOptions.queryKey')) {
      // 다음 줄이 return query;인지 확인
      if (nextLine.trim() === '' && nextNextLine.trim().startsWith('return query;')) {
        // 수정: return { ...query, queryKey: queryOptions.queryKey }; 로 변경
        const indent = line.match(/^(\s*)/)[1];
        newLines.push(`${indent}return {`);
        newLines.push(`${indent}  ...query,`);
        newLines.push(`${indent}  queryKey: queryOptions.queryKey,`);
        newLines.push(`${indent}};`);
        i += 2; // return query; 줄도 건너뛰기
        modified = true;
        continue;
      } else {
        // return query가 없는 경우도 수정
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
    fs.writeFileSync(file, newLines.join('\n'), 'utf8');
    console.log(`✅ Fixed: ${file}`);
  }
});

console.log('🎉 All files processed!');
