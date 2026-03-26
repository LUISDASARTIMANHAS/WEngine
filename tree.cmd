@echo off
echo Iniciando...
npx tree-node-cli -I "node_modules|.git|prototype" > tree.txt
echo Finalizado.
pause