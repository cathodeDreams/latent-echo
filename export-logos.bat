@echo off
REM Path to Inkscape - modify if needed
set INKSCAPE="C:\Program Files\Inkscape\bin\inkscape.exe"

REM Create img directory if it doesn't exist
mkdir img 2>nul

REM Export main favicon and touch icons
%INKSCAPE% "reframed-squares-4.svg" --export-width=32 --export-height=32 --export-type=png --export-filename=img/favicon.png
%INKSCAPE% "reframed-squares-4.svg" --export-width=180 --export-height=180 --export-type=png --export-filename=img/apple-touch-icon.png
%INKSCAPE% "reframed-squares-4.svg" --export-width=192 --export-height=192 --export-type=png --export-filename=img/android-chrome-192.png

REM Export header logo SVG (optimized version)
%INKSCAPE% "reframed-squares-4.svg" --export-type=svg --export-plain-svg --export-filename=img/logo.svg

REM Export PNG fallback for header
%INKSCAPE% "reframed-squares-4.svg" --export-width=400 --export-height=400 --export-type=png --export-filename=img/logo.png

echo Export complete! Generated all required assets in img/ directory