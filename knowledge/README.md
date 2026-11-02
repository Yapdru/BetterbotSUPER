# Sourced coding library

Current shipped dataset: **1,000 accepted public Stack Overflow Q&A records**, approximately 4 MB of source JSON, with 1,050 distinct tags. This is a coding library, not all world knowledge. Accepted answers can still be outdated or incorrect. Original HTML, question and answer authors/profiles, URLs, content licenses, and retrieval timestamps are retained. Records have mixed CC BY-SA 2.5, 3.0, and 4.0 licenses; each record's own license governs it. Plain-text native presentation is an adaptation, with original-source and license attribution displayed.

## What is available

- Web/PWA, Android, Windows and Apple web bundles ship `generated/library.json` and search it locally. The larger dataset is downloaded on first web use and included in the offline cache; the page limits results to five and reports the true match count.
- Native Apple readers use `Shared/native-library.json`, generated from the same source, with plain text and attribution.
- `generated/import.sql` is an idempotent SQLite/D1-compatible full-text import. It was imported into local SQLite, searched, and verified to contain 1,000 records. The external-content FTS5 index is maintained by insert/update/delete triggers. Full original records are retained; searchable body text is capped at 16,000 characters per record.
- The Worker can query this database when bound as `KNOWLEDGE_DB`. Without that binding it still uses the existing KV pilot. **The live Cloudflare endpoint remains on its 20-record pilot; the D1 database is not provisioned or deployed.**

## Bounded, resumable imports

```sh
node knowledge/import-library.mjs --max-records=1000
node knowledge/export-index.mjs
sqlite3 /tmp/betterbot-library.sqlite < knowledge/generated/import.sql
```

The importer uses the official Stack Exchange API, accepted answers only, at most 30 requests per run, a quota reserve of 20, a delay between requests, and a 128 MiB local data cap. It stops on API backoff instead of hammering the service. Checkpoints retain records and the next source page. Imports deduplicate by source question ID. Incomplete attribution/license records and oversized entries are skipped. The requested record count is a ceiling, not a guarantee. To expand in stages, increase `--max-records` (maximum 100,000) and rerun only within source quotas. No automatic scheduled crawler, server writes, or paid API use is configured. The first expansion from 20 to 1,000 used 22 requests.

The exporter skips statements over 95 KB and reports any skipped records. Repeat imports upsert the same question IDs. Check `manifest.json` and the database count before advertising a larger library. The manifest measures local ingestion, not deployed server capacity.

## Path toward millions

This is the first measured stage, not a million-record launch. A million records at the current average source size would be roughly 4 GB before database/index overhead; full-text indexes require additional space. Current free D1 limits are 500 MB per database and 5 GB per account. A full million at this fidelity must not be promised inside those limits. Before scaling, measure index growth and actual read/write quotas, partition by source/topic if justified, define retention, and use source-approved bulk ingestion rather than repeatedly paging the public API. Stop at the free-tier ceiling; do not enable billing, paid vectors, paid AI indexing, or unbounded jobs.

To deploy the index later: verify Cloudflare Workers Free, create a D1 database, import the SQL in bounded batches within daily quotas, bind it as `KNOWLEDGE_DB` on satbot, deploy the tested Worker, and verify counts and searches. No private conversations or user-generated answers belong in this public index. This library is retrieval data; it does not train Gemini or create unlimited AI capability.

Sources:
- https://api.stackexchange.com/docs/paging
- https://api.stackexchange.com/docs/throttle
- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/d1/platform/pricing/
