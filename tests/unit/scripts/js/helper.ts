import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export function expectDateParts(
    date: Date,
    year: number,
    monthIndex: number,
    day: number,
    hour = 0,
    minute = 0,
    second = 0,
    ms = 0
) {
  expect(date.getFullYear()).toBe(year);
  expect(date.getMonth()).toBe(monthIndex);
  expect(date.getDate()).toBe(day);
  expect(date.getHours()).toBe(hour);
  expect(date.getMinutes()).toBe(minute);
  expect(date.getSeconds()).toBe(second);
  expect(date.getMilliseconds()).toBe(ms);
}

export function loadBrowserScripts(
    relativePaths: string[],
    additions: Record<string, unknown> = {}
): Record<string, unknown> {
  const context = vm.createContext({
    ...additions,
  }) as Record<string, unknown>;

  context.globalThis = context;

  for (const relativePath of relativePaths) {
    const absolutePath = path.resolve(process.cwd(), relativePath);
    const source = fs.readFileSync(absolutePath, "utf8");
    vm.runInContext(source, context, {filename: absolutePath});
  }

  return context;
}
