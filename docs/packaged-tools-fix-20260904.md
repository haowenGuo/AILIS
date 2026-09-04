# Packaged execution and verbatim unified replies

Date: 2026-09-04

## Causes and fixes

- Code-mode `fork()` used `app.asar/electron` as an OS working directory. In the packaged Electron runtime this caused `ENOENT`; an immediate IPC write then masked it with `write EPIPE`. The worker path, cwd and exact filesystem read allowlist now use the real `app.asar.unpacked/electron` directory. Electron workers explicitly receive `ELECTRON_RUN_AS_NODE=1`; no VM or permission restriction was disabled. Missing workers fail closed. IPC starts only after successful spawn, retains the first error, and ignores late replies to closed cells.
- Unified results were still passed through legacy Persona text sanitation. This replaced `json`, `exec`, `mkdir` and configuration identifiers, and stripped code indentation. The unified surface now reuses only avatar metadata and preserves authored display/speech/bubble text. It does not replace failed/uncertain/approval answer text with legacy boilerplate. Input/output safety gates and tool permissions remain unchanged. Legacy split-agent presentation remains a compatibility path.

## Evidence

- Focused regression: 41/41 passed, including 7 new packaging/lifecycle/text-preservation tests.
- Expanded serial regression: 272/272 passed, 21 test files. Initial parallel run hit one Windows temporary-file rename `EPERM` in an existing memory test; no unrelated memory code was changed to mask it.
- Vite production build and Electron directory packaging passed. Eight critical packaged files match source SHA-256 values.
- Actual packaged Electron 41.2.0 + ASAR Gateway smoke passed: code-mode exec, native shell command, read of the packaged worker file, `apply_patch` into an isolated scratch file, verbatim technical Markdown final answer, and subsequent-turn recall of tool evidence and exact answer. Uses a loopback fake model; real provider calls: 0. Scratch workspace is removed after verification; live conversations and settings are not used by the probe.

Reproduce the packaged smoke:

```powershell
node scripts/smoke-ailis-packaged-tools.cjs F:\AILIS\Build\AILIS-unified-fix-20260904\win-unpacked
```

Fixed local package: `F:\AILIS\Build\AILIS-unified-fix-20260904\win-unpacked\AILIS.exe`.
Previous packages are retained. Existing shortcuts can still point to an older package. The user must use the fixed package for these fixes to take effect; restarting an old executable does not update it.
