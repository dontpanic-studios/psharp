@echo off

:chkfolder
if  exist .\build\ (
    echo build folder exist, building it
    goto build
) else (
    echo build folder not found creating it.
    mkdir build
    mkdir /build/linux
    mkdir /build/mac
    mkdir /build/mac/aarch64
    mkdir /build/mac/x86_64
    mkdir /build/windows
    goto chkfolder
)

:build
cd build
cd windows
deno compile --allow-all --target x86_64-pc-windows-msvc main.ts
cd ..linux
deno compile --allow-all --target x86_64-unknown-linux-gnu main.ts
cd ..mac/x86_64
deno compile --allow-all --target x86_64-apple-darwin main.ts
cd ..aarch64
deno compile --allow-all --target aarch64-apple-darwin main.ts
echo build complete
pause
exit

chkfolder