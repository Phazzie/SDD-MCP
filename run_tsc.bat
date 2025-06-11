@echo off
echo Running TypeScript compiler...
npx tsc > tsc_errors.txt 2>&1
echo TypeScript compilation finished. Output saved to tsc_errors.txt
