!include LogicLib.nsh
!include nsDialogs.nsh

!ifndef BUILD_UNINSTALLER

Var AILIS_COMPONENT_PYTHON_CHECKBOX
Var AILIS_COMPONENT_VOICE_CHECKBOX
Var AILIS_COMPONENT_ASR_CHECKBOX
Var AILIS_COMPONENT_WEB_CHECKBOX
Var AILIS_COMPONENT_PYTHON_SELECTED
Var AILIS_COMPONENT_VOICE_SELECTED
Var AILIS_COMPONENT_ASR_SELECTED
Var AILIS_COMPONENT_WEB_SELECTED

!macro customPageAfterChangeDir
  Page custom AilisRuntimeComponentsPage AilisRuntimeComponentsLeave
!macroend

Function AilisRuntimeComponentsPage
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}

  ${NSD_CreateLabel} 0 0u 100% 20u "AILIS 可选本地运行时"
  Pop $0
  ${NSD_CreateLabel} 0 22u 100% 24u "默认只安装核心应用。这里选择的组件会被 AILIS 记录，安装完成后再按需安装或导入。"
  Pop $0

  ${NSD_CreateCheckbox} 0 56u 100% 12u "AILIS 私有 Python 运行时（本地语音组件需要）"
  Pop $AILIS_COMPONENT_PYTHON_CHECKBOX
  ${NSD_SetState} $AILIS_COMPONENT_PYTHON_CHECKBOX ${BST_UNCHECKED}

  ${NSD_CreateCheckbox} 0 76u 100% 12u "CosyVoice3 本地 TTS（体积较大，高质量离线语音）"
  Pop $AILIS_COMPONENT_VOICE_CHECKBOX
  ${NSD_SetState} $AILIS_COMPONENT_VOICE_CHECKBOX ${BST_UNCHECKED}

  ${NSD_CreateCheckbox} 0 96u 100% 12u "本地 ASR 语音识别（体积较大，离线识别）"
  Pop $AILIS_COMPONENT_ASR_CHECKBOX
  ${NSD_SetState} $AILIS_COMPONENT_ASR_CHECKBOX ${BST_UNCHECKED}

  ${NSD_CreateCheckbox} 0 116u 100% 12u "AILIS Web/Search 本地运行时（可选检索能力）"
  Pop $AILIS_COMPONENT_WEB_CHECKBOX
  ${NSD_SetState} $AILIS_COMPONENT_WEB_CHECKBOX ${BST_UNCHECKED}

  ${NSD_CreateLabel} 0 142u 100% 28u "现在可以全部跳过，后续也能从控制面板安装。这样默认安装包会保持轻量。"
  Pop $0

  nsDialogs::Show
FunctionEnd

Function AilisRuntimeComponentsLeave
  ${NSD_GetState} $AILIS_COMPONENT_PYTHON_CHECKBOX $AILIS_COMPONENT_PYTHON_SELECTED
  ${NSD_GetState} $AILIS_COMPONENT_VOICE_CHECKBOX $AILIS_COMPONENT_VOICE_SELECTED
  ${NSD_GetState} $AILIS_COMPONENT_ASR_CHECKBOX $AILIS_COMPONENT_ASR_SELECTED
  ${NSD_GetState} $AILIS_COMPONENT_WEB_CHECKBOX $AILIS_COMPONENT_WEB_SELECTED

  ${If} $AILIS_COMPONENT_VOICE_SELECTED == ${BST_CHECKED}
  ${OrIf} $AILIS_COMPONENT_ASR_SELECTED == ${BST_CHECKED}
    StrCpy $AILIS_COMPONENT_PYTHON_SELECTED ${BST_CHECKED}
  ${EndIf}
FunctionEnd

!macro AilisWriteJsonBoolean VARIABLE
  ${If} ${VARIABLE} == ${BST_CHECKED}
    FileWrite $0 "true"
  ${Else}
    FileWrite $0 "false"
  ${EndIf}
!macroend

!macro customInstall
  CreateDirectory "$INSTDIR\resources"
  ${If} ${FileExists} "$EXEDIR\runtime-packs\*.*"
    CreateDirectory "$INSTDIR\resources\runtime-packs"
    CopyFiles /SILENT "$EXEDIR\runtime-packs\*.*" "$INSTDIR\resources\runtime-packs"
  ${EndIf}
  FileOpen $0 "$INSTDIR\resources\ailis-runtime-components.selected.json" w
  FileWrite $0 "{$\r$\n"
  FileWrite $0 '  "schemaVersion": 1,$\r$\n'
  FileWrite $0 '  "source": "nsis-installer",$\r$\n'
  FileWrite $0 '  "installMode": "deferred",$\r$\n'
  FileWrite $0 '  "components": {$\r$\n'
  FileWrite $0 '    "python-runtime": '
  !insertmacro AilisWriteJsonBoolean $AILIS_COMPONENT_PYTHON_SELECTED
  FileWrite $0 ',$\r$\n'
  FileWrite $0 '    "cosyvoice3-runtime": '
  !insertmacro AilisWriteJsonBoolean $AILIS_COMPONENT_VOICE_SELECTED
  FileWrite $0 ',$\r$\n'
  FileWrite $0 '    "asr-runtime": '
  !insertmacro AilisWriteJsonBoolean $AILIS_COMPONENT_ASR_SELECTED
  FileWrite $0 ',$\r$\n'
  FileWrite $0 '    "web-runtime": '
  !insertmacro AilisWriteJsonBoolean $AILIS_COMPONENT_WEB_SELECTED
  FileWrite $0 '$\r$\n'
  FileWrite $0 '  }$\r$\n'
  FileWrite $0 "}$\r$\n"
  FileClose $0
!macroend

!endif
