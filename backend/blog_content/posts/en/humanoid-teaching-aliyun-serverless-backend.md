# Humanoid Teaching Aliyun Serverless: Establishing the Formal Backend Template

The main Humanoid Teaching Classroom project already turns the Render demo, classroom flow, teacher side, and student side into a runnable education platform template. The `aliyun-serverless` subproject points to the next stage: a formal backend foundation for Alibaba Cloud Function Compute and MySQL, with APIs for authentication, resources, AI teaching features, simulated classrooms, statistics, and parent views.

This note is based only on low-risk material: the subproject `README.md` and `package.json`. It does not inspect full source code, expand database scripts, publish environment variable values, expose keys, describe deployment configuration internals, distribute installers, reveal local binaries, or disclose private data.

## From Demo Backend to Formal Backend

The README gives the subproject a clear role: it is the official backend template for the simulated teaching platform, targeting Alibaba Cloud Function Compute and MySQL deployment. In other words, it is not another page demo. It fixes the service surface that future frontend clients will depend on.

The API scope is broad enough to describe the product. It includes registration, login, current-user lookup, education resource lists, resource search, resource details, AI lesson-plan generation, AI Q&A, wrong-question review, learner analysis, classroom knowledge, classroom blackboard data, classroom dialogue, platform statistics, and parent-side learner reports. For an education platform, those endpoints map to the core tracks: identity, resource access, AI tutoring, classroom interaction, operating metrics, and parent-school collaboration.

That structure matters because formalization should not wait until every page is finished. The backend template draws the product boundary first. Later uni-app, mini-program, H5, or admin clients can integrate with these APIs instead of inventing one-off endpoints for each surface.

## The Classroom Is More Than Chat

The README describes the simulated classroom in three layers. `classroom_knowledge` stores teaching-owned blackboard summaries, key points, examples, and safety notes. The blackboard API returns the classroom homepage title and current knowledge-point board. The dialogue API sends the student question, current blackboard content, recent conversation, and EMBER-Agent safety constraints to the model so it can generate an AI teacher explanation.

That is meaningfully different from exposing a bare chat endpoint. The service layer owns the classroom context, blackboard material, knowledge points, and safety constraints before calling the model. The frontend receives a controlled classroom interaction instead of direct access to model keys and open-ended prompts.

The README also notes that classroom dialogue is recorded for later review and learner analysis. That is important. In an education system, dialogue should not be treated as a disposable message stream. It should connect back to learner profiles, wrong-answer review, teacher observation, and parent feedback. The backend template preserves that record chain early, which makes it look like a classroom workflow rather than a simple response generator.

## Keys and External Resources Stay Behind the Service Boundary

One of the strongest boundaries in the template is explicit: the DeepSeek key is not exposed to the frontend. AI lesson plans, online Q&A, wrong-question review, and learner analysis should all go through backend APIs, where key handling, logging, rate limits, safety prompts, and error responses can be managed consistently.

National education platform resources are also placed behind a backend adapter layer. The README lists environment variables for the resource API base URL, API key, list path, detail path, search path, and per-minute rate limit. Final endpoint paths, signing rules, and rate limits are expected to follow the official authorization documents, with service-side headers and path mapping adjusted once those documents are available.

The more important principle is data handling. The national platform resource body is not stored in the application's own database. The database stores only first-party data such as users, original content, access logs, AI call logs, and learner reports. Once an education product integrates official resources, the main engineering risks are not just whether a request succeeds. They are whether content is copied incorrectly, keys leak, rate limits fail, and calls remain traceable. Keeping this logic on the server side is the more durable route.

## The Stack Is Small and Deliberate

`package.json` shows a private Node ESM backend template at version `0.1.0`. The script surface is restrained: `check` runs `node --check` for syntax validation, and `start:local` starts a local server script for debugging.

The dependency list is also focused. `mysql2` handles MySQL access, `jsonwebtoken` supports login state, `bcryptjs` handles password hashing, `zod` validates inputs, `dotenv` manages local environment variables, and `uuid` generates business identifiers. The template does not bury itself under a large framework stack. It keeps the pieces needed for Serverless APIs, authentication, database access, and validation.

The local flow is similarly simple: install dependencies, prepare environment variables, and start the local service. The README says local APIs default to `http://127.0.0.1:8787`, which is straightforward enough for frontend integration, endpoint verification, and pre-deployment checks.

## The Deployment Shape Serves a Multi-Client Product

The main project documentation already points toward a future uni-app plus Alibaba Cloud Serverless plus MySQL route. This subproject is the backend template for that route. Function Compute can provide lightweight cloud API entry points, MySQL can store first-party business data, and the frontend can continue evolving toward mini-program, H5, or app clients.

More importantly, the backend template exposes capabilities as APIs instead of binding the business to one server-rendered page. Resource lists, resource details, AI explanations, blackboard data, classroom dialogue, statistics, and parent views can be reused by different clients. That means pages and client shells can change without forcing the backend business boundary to be rebuilt from scratch.

## Summary

The value of the `aliyun-serverless` subproject is that it moves Humanoid Teaching Classroom beyond the Render demo toward a formal backend template. It covers the main service surfaces of an education platform: identity, resources, AI, classroom interaction, statistics, and parent views. It also keeps model keys, national resource access, rate limits, and data-retention boundaries on the server side.

It should not be described as a complete production commercial backend yet. A more accurate view is that it is a deployment-oriented backend skeleton that fixes the API surface, data boundaries, and external-service adapter points early. For a product that needs to serve students, teachers, parents, and AI-assisted teaching flows at the same time, that is more important than continuing to add page features without a stable service boundary.
