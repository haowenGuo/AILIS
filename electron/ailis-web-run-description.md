Public web discovery and page navigation. Execute exactly one supported operation per call.

Supported operations:

* `search_query`: discover candidate pages with one to four non-empty queries. Example: `{"search_query":[{"q":"OpenAI Codex app-server outputSchema"}],"response_length":"medium"}`
* `open`: open one search reference or HTTP(S) URL. Example: `{"open":[{"ref_id":"turn0search0"}]}`
* `click`: open one numbered link from a previously opened reference. Example: `{"click":[{"ref_id":"turn0view0","id":3}]}`
* `find`: find one non-empty pattern in a previously opened reference. Example: `{"find":[{"ref_id":"turn0view0","pattern":"Methods"}]}`

Do not combine operations in one call. Do not send empty objects, arrays, queries, reference ids, or patterns. `response_length` applies only to `search_query`. For capabilities outside the four operations above, discover a dedicated tool.

Search results return stable reference ids for later `open`, `click`, and `find` calls. Search is discovery; open a relevant candidate before treating it as evidence. When a search returns no candidates, broaden the query and remove optional recency/domain filters before trying another source or search formulation. A page's native ordering is not proof of global ordering across records. If page navigation identifies the entity but the answer still depends on structured identity, a join across records, global sorting or de-duplication, chronology, or a complete candidate-set boundary, use `tool_search` to discover a dedicated metadata, document, API, or data tool. Once that dependency is apparent, do not exhaust the work budget paging through the site or rewriting web queries to reconstruct the structure manually. Use returned source URLs in the final answer when citations are needed.
