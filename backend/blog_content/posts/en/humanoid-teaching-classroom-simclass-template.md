# Humanoid Teaching Classroom: From a Render Demo to a Multi-Platform Education Template

The useful thing about the Humanoid Teaching Classroom project is that it does not stop at a teaching-page demo. It organizes student flows, teacher workflows, simulated classroom sessions, question banks, deployment checks, and a future migration path into an education software template. The README frames the current version as a Render-ready Node + Express + EJS + PostgreSQL foundation, while also reserving a route toward uni-app, Alibaba Cloud Serverless, MySQL, DeepSeek API integration, and authorized national education resource access.

This note is based only on low-risk material: `README.md`, `package.json`, and public documentation under `docs/`. It does not inspect implementation internals, publish local machine paths, disclose private repository details, expose environment variable values, reveal database content, or distribute binaries.

## Start With a Working Teaching Loop

The first layer of value is that the template turns the main teaching workflow into something runnable. The README lists student registration, login, parent authorization, membership access, teacher registration, teacher dashboards, student lists, assignment views, personalized homepages, learner diagnostics, real question-bank integration, practice package assignment, course paths, VIP tiers, teaching-research pages, hardware and parent-school collaboration pages, plus JSON APIs for both student and teacher clients.

That makes the project more than a single rendered page. It is organized around the boundaries of an education platform. Students need profiles, diagnostics, practice, and classroom history. Teachers need student views, assignment tools, and classroom dashboards. The platform itself needs membership, courses, resources, parent-school collaboration, and deployment operations. Even at the template stage, those boundaries give future work a place to land.

The stack is deliberately practical: Node.js 20+, Express, EJS, PostgreSQL, and a local memory mode when no database is available. The point is not novelty. The point is to make the classroom workflow startable, testable, and deployable early.

## The Simulated Classroom Has a Contract

`docs/simclass-api-contract.md` turns the simulated classroom into a reusable API surface instead of tying all behavior to one server-rendered page. Student APIs cover listing sessions, reading a single session, starting a classroom, answering or asking follow-up questions, and completing a session. Teacher APIs expose a classroom dashboard with filters for status and student.

The response shape is consistent: successful calls return `{ ok, data, meta }`, while failures return `{ ok, error }`. That matters for future mini-program, mobile, or uni-app clients. The frontend can handle success, failure, authorization, and classroom state through a stable contract instead of reverse-engineering page behavior.

The classroom flow also has explicit rules. Starting a session reads the learner profile, writes an attendance record, and chooses the first question from a real or fallback question bank. Correct answers advance the lesson. Wrong answers keep the current question and generate corrective feedback. Follow-up questions do not affect scoring. Empty submissions produce a nudge instead of corrupting the attempt count. Those details keep the simulated classroom from becoming just an AI teacher chat box; it remains a teaching system with questions, answers, feedback, metrics, and review.

## The Blackboard Experience Is Protected by Tests

The delivery report and API contract both emphasize one product rule: the classroom blackboard must show the fixed title "基于EMBER-Agent安全增强的仿真课堂", and the blackboard itself should contain only the classroom question, answer choices, and submit button. Knowledge-source labels, daily board notes, and AI teacher cards should not compete with the main blackboard.

That requirement is now captured by automated checks. `package.json` defines `test:classroom` for the blackboard title, question, choices, submit button, and empty state. `test:classroom-flow` verifies opening a session, correct answers, wrong answers, follow-up questions, and empty submissions. `test:auth-boundaries` checks student, teacher, and public API authorization boundaries. `test:store-contract` verifies the main storage chain for users, sessions, diagnostics, assignments, and classroom records.

`test:simclass` combines those checks into the baseline regression gate for the classroom module. That is stronger than relying on a visual inspection of a page. Future edits to the classroom UI, APIs, or storage layer have a concrete command that can catch broken product contracts.

## Production Readiness Is More Than Booting the App

The documentation does not reduce deployment to "it can run on Render." `docs/simclass-production-readiness.md` explains that `verify:production` checks the package metadata, Render Blueprint shape, environment variable documentation, health checks, Postgres persistence requirements, production cookie behavior, and preservation of the core validation scripts.

Those checks address a common template-project failure mode: the app still starts locally, but production configuration drifts over time. A health endpoint might exist without exposing enough storage or question-bank status for debugging. Environment variables might be present without a clear distinction between local defaults and platform-generated secrets. Encoding those assumptions as a command makes configuration drift easier to detect before release.

The local runner documentation also separates required checks from optional checks. Each runner cycle executes production readiness and the classroom regression suite. It can also check a local health URL and Render freshness. Optional failures require attention, but they are not the same thing as a local business regression. That distinction makes operational status easier to explain.

## The Migration Route Is Already Sketched

The Render version remains useful as a demo and transition environment, but the project also includes a more formal architecture template. uni-app is planned for mini-program, H5, and app frontends. Alibaba Cloud Function Compute and API Gateway form the backend layer. MySQL stores business data. DeepSeek APIs support lesson planning, Q&A, wrong-answer review, and learner analysis. National education platform resources are accessed only through authorized calls and display flows.

The most important part of `docs/uniapp-aliyun-serverless-blueprint.md` is not the list of technologies. It is the resource compliance boundary. National platform resources should not be copied into the application's own database as full text, videos, or complete explanations. The system should store resource IDs, source labels, access logs, bookmarks, and learning behavior metadata. Resource pages should mark the source, fetch details on demand, and use server-side rate limiting.

That boundary matters. Once an education platform touches external question banks, official resources, and large-model services, the biggest risks often move away from the page itself and into data retention, authorization, key handling, and secondary distribution. The migration document already separates what may be displayed from what may be stored.

## Summary

Humanoid Teaching Classroom currently looks like an engineering template for intelligent education software. The Render version supports a fast demo and deployment loop. The simulated classroom contract stabilizes the core experience. Automated tests prevent regressions. Production readiness checks guard deployment assumptions. The uni-app plus Alibaba Cloud Serverless blueprint points toward a more formal multi-platform product.

It is not a complete commercial education platform yet, and it should not be described as one. A more accurate view is that the project is turning "simulated classroom + teacher side + student side + question bank + AI capabilities + deployment operations" into a runnable, testable, and migratable template. The value of this stage is that future modules have clear places to attach, instead of being piled onto an unverifiable teaching demo.
