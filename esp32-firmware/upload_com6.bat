@echo off
cd /d "C:\Users\Terddy.LAPTOP-CVSRCLGL\Desktop\smart-sheet-mask\esp32-firmware"
pio run -e esp32dev -t upload --upload-port COM6
pause
