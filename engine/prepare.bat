@echo OFF
set f=%1
if %f:~-4% == .cpp (
	gcc %f% -o out.exe
	echo out.exe > run.bat
) else if %f:~-2% == .c (
	gcc -std=c99 %f% -o out.exe
	echo out.exe > run.bat
) else if %f:~-5% == .java (
	javac %f%
	echo java %f:~0,-5% > run.bat
) else if %f:~-5% == .ruby (
	echo ruby %f% > run.bat
) else if %f:~-6% == .scala (
	scalac %f%
	echo scala %f:~0,-6% > run.bat
) else if %f:~-7% == .python (
	echo python %f% > run.bat
)
