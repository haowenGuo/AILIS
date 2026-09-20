# Bounded raw-memory replay for profile curation

The September 16 crash investigation found whole-file synchronous replay of a
3.16 GB daily archive in the Electron main process. Curation start coincided with
rapid main-process private-memory growth and exit. No native exception code was
captured, so the precise native failure (OOM, allocation limit, etc.) is unproven.

## Reader contract

- Curation uses `readCurationPage`, not the legacy synchronous `replay`.
- Asynchronous positional reads are 64 KiB; default scan budget is 16 MiB per
  page (hard maximum 64 MiB). No entire archive is decoded into one string.
- At most 5000 entries / approximately 2 MiB of returned JSON per page.
- Full chat records have a 256 KiB limit. Oversize or malformed relevant records
  fail explicitly and remain in the source archive; no silent truncation.
- Canonical non-chat envelopes are parsed before `payload`, and their payload
  bytes are skipped without JSON decoding. This preserves diagnostic archives
  while excluding their large snapshots from curation working memory.
- A physical cursor stores filename, inode, byte offset, and (when a scan budget
  ends inside a skipped diagnostic record) its small envelope. Legacy semantic
  cursors still filter records during migration, including timestamp ties.
- A partial final line is not committed; replaced/truncated archives fail safely.
- Profiles and scan progress are checkpointed per successful extraction batch.
  Failed extraction does not advance past that batch. Scan-only pages also
  checkpoint progress and schedule a continuation; pending work survives the
  normal once-per-day skip guard.
- `remainingEntryCount` is a lower bound while unscanned data remains;
  `remainingEntryCountExact` explicitly distinguishes this from an exact count.
- Start/completion events report the read phase, bytes read and continuation state.
- Legacy synchronous diagnostic replay refuses files over 8 MiB instead of trying
  to allocate whole huge archives. Its callers must handle the explicit paging
  error; this change does not introduce a general-purpose archive viewer.

This is bounded asynchronous I/O in the existing process, not a worker-process
isolation change. No model prompts, extraction semantics, historical archives,
or stored user preferences are deliberately rewritten by this fix.

## Verification

Unit tests cover multi-page large diagnostic records, UTF-8, timestamp ties,
legacy cursor migration, partial appends, malformed/oversize records, truncated
archives, extraction failure checkpoints and scheduler continuation/error guards.

A read-only scan of the actual 3,158,263,472-byte September 16 archive completed
in 189 pages / 8.5 seconds in Node with a 128 MiB old-space limit. Sampled peak
RSS was 64 MiB, maximum 10-ms timer delay was 10 ms. No model calls were made and
production memory files were not changed. These are offline reader measurements,
not a claim that every desktop stall or native crash has been eliminated.
