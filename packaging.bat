@ECHO off

SET PATH="%LOCALAPPDATA%\Google\Chrome\Application";%PATH%
SET DISTDIR="%~dp0%1"
SET PEMFILE="%~dp0%3.pem"

ECHO %DISTDIR%
ECHO %PEMFILE%

IF exist %PEMFILE% (
  ECHO true
  chrome.exe --pack-extension=%DISTDIR% --pack-extension-key=%PEMFILE%
) ELSE (
  ECHO false
  chrome.exe --pack-extension=%DISTDIR%
  rename %1.pem %3.pem
)

rename %1.crx %2.crx
copy %2.crx %3.crx
ECHO END