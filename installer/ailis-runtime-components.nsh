; One fixed payload: hosted TTS + bundled local ASR. No optional component page.
!ifndef BUILD_UNINSTALLER
!macro customInstall
  ; Only discard the obsolete installer-owned receipt, never user preferences.
  Delete "$INSTDIR\resources\ailis-runtime-components.selected.json"
!macroend
!endif
