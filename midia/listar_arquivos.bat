@echo off
setlocal

set "outputFile=Nomes_dos_Arquivos.txt"
set "tempFile=temp_file_list.txt"

echo Listando arquivos na pasta atual...

:: Get all files and redirect to a temporary file
dir /b /a-d > "%tempFile%"

:: Filter out the specified files (this batch file, the output file, and the temporary file)
findstr /V /I /L "%~nx0" "%tempFile%" | findstr /V /I /L "%outputFile%" | findstr /V /I /L "%tempFile%" > "%outputFile%"

:: Clean up the temporary file
del "%tempFile%"

echo.
echo Nomes dos arquivos salvos em "%outputFile%".

:: Open the output file
start "" "%outputFile%"

endlocal