# Humanoid Teaching uni-app: Turning the Classroom Product into a Multi-End Frontend Template

The `uniapp` subproject is the multi-end frontend template for the Humanoid Teaching Classroom platform. The main project has already validated the basic teaching flow, and the `aliyun-serverless` subproject defines the formal backend API boundary. This frontend template receives those student, teacher, classroom, parent, and AI teaching capabilities and organizes them into a client shape that can keep expanding toward H5, mini-program, and app targets.

This note is based only on low-risk material: the subproject `README.md` and `package.json`. It does not inspect page source code, environment variable samples, build outputs, account data, private keys, databases, installers, or local binaries.

## Multi-End Is More Than a Different Shell

The README describes the project as a multi-end frontend template for the simulated teaching platform, with room to keep expanding toward H5, mini-programs, and apps. The important part is not only that it uses uni-app. It also turns the teaching product into a set of stable page entry points.

The page list already covers a learning loop: login and quick registration, national platform resource filtering, simulated classroom, intelligent lesson preparation, online Q&A, wrong-question review, and parent-school collaboration. This is not just a classroom-page demo. It sketches the client-side product map across student, teacher, AI-assisted learning, and parent flows.

That structure matters for multi-end migration. H5, mini-programs, and apps run in different environments, but the user tasks remain the same. Students still need to enter the classroom, browse resources, ask questions, and review mistakes. Teachers still need lesson preparation. Parents still need a way to understand learning status. By stabilizing these entry points first, the frontend template can adapt platform-specific capabilities later without breaking the product flow.

## The Simulated Classroom Is the Core Scene

The classroom page is the clearest core scene in this template. The README says the blackboard homepage always shows “基于EMBER-Agent安全增强的仿真课堂” and supports knowledge-base card switching. When a knowledge base is selected, the blackboard content refreshes automatically, and the AI teacher explanation area works around that classroom context.

That means the classroom is not a plain chat window. It has at least four frontend states: current knowledge base, blackboard content, AI teacher explanation, and student-to-AI-teacher conversation. Keeping those states together in one classroom page gives the product a real classroom feel instead of splitting teaching into unrelated utility buttons.

The README also mentions system speech playback on H5 and a reserved voice-question entry. That is a practical boundary. The template keeps a runnable H5 speech playback path while leaving Alibaba Cloud or iFlytek speech-to-text integration as a later extension point. In a multi-end product, voice support often depends on platform permissions, SDKs, and review requirements. Reserving the entry point without forcing one implementation too early is the steadier route.

## The Pages Match Education Workflows

The page list divides the education product into several parallel workflows.

The first is the resource workflow. `pages/home/index` presents filtered national platform resources. It should connect to backend resource list, search, and detail capabilities so students or teachers can enter learning material from the official resource side.

The second is the classroom workflow. `pages/classroom/index` owns the simulated classroom, blackboard, knowledge base, AI teacher explanation, dialogue, and voice entry. This is the most distinctive interaction in the project, and it is also where EMBER-Agent safety enhancement needs to be clearly represented on the client side.

The third is the AI learning-assistance workflow. `pages/lesson-prep/index` maps to DeepSeek lesson preparation, `pages/qa/index` maps to online Q&A, and `pages/wrongbook/index` maps to wrong-question review. These are not isolated features. They connect preparation before class, questions during learning, and review after mistakes.

The fourth is the parent-school workflow. `pages/parent/index` reserves an entry for the parent side. For an education product, that page matters because it shows that learning results are not only for students and teachers. They also feed back into family-side observation and support.

## The Stack Stays Lightweight

`package.json` shows a private Node ESM project named `humanoid-teaching-uniapp` at version `0.1.0`. Its scripts focus on four targets: H5 development, H5 build, WeChat mini-program development, and WeChat mini-program build.

The dependency surface is also focused. `@dcloudio/uni-app`, `@dcloudio/uni-components`, `@dcloudio/uni-h5`, and Vue 3 form the runtime base. The development dependencies include uni-related types, the shared uni CLI package, the Vite uni plugin, and Vite 5. That matches the template stage: get the multi-end frontend running first, then connect concrete business pages, platform capabilities, and backend APIs.

The local flow is simple as well: enter the `uniapp` directory, install dependencies, prepare the environment file, and run the H5 dev command. The README says the local API base URL points to a development service entry, while production should switch to an Alibaba Cloud API Gateway or Function Compute HTTP trigger domain. That keeps the frontend-backend boundary clear. The frontend does not own production service addresses or secrets directly; it connects to backend entry points through environment configuration.

## It Pairs with the Serverless Backend

The earlier backend-template article described how the `aliyun-serverless` subproject organizes identity, resources, AI lesson plans, AI Q&A, wrong-question review, learner analysis, classroom blackboard, classroom dialogue, statistics, and parent APIs into a service boundary. The `uniapp` subproject is the multi-end client layer for those APIs.

Together, the route is clear. The backend owns keys, official-resource adapters, AI calls, data storage, and safety constraints. The frontend owns page organization, classroom interaction, voice entry points, and multi-end presentation. This separation avoids pushing AI keys, resource authorization details, or classroom safety policy into the client, and it also keeps the backend from having to know every platform-specific interaction detail.

For education software, that boundary matters more than the number of pages. Student and parent clients may start on H5 and later move into mini-programs. The teacher side may begin as a lightweight client as well. As long as API boundaries and page entry points stay stable, the product can migrate across clients incrementally.

## Summary

The value of the `uniapp` subproject is that it moves Humanoid Teaching Classroom from a single web demo toward a multi-end client template. It places login, resources, the simulated classroom, intelligent lesson preparation, online Q&A, wrong-question review, and parent-school collaboration inside one frontend structure, while keeping a technical path open for H5, mini-program, and app expansion.

It should currently be described as a multi-end frontend skeleton, not a complete production client. It already clarifies the page boundary, the core classroom interaction, the voice extension point, and the backend API integration path. The next important step is to align those pages with the formal Serverless backend so classroom data, AI responses, resource filtering, and learner feedback become a verifiable end-to-end flow.
