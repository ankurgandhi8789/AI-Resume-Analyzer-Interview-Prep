/**
 * A small curated knowledge base of role -> expected skills / competencies.
 * This is what gets embedded into the vector store and retrieved (RAG) to
 * ground the LLM's "skillGaps" output in real expectations for the target
 * role, instead of the model guessing from parametric memory alone.
 *
 * In production you'd swap this for a larger corpus (job postings, internal
 * hiring rubrics, etc.) and a persistent vector DB (Chroma/Pinecone/Weaviate).
 */
export const ROLE_KNOWLEDGE_DOCS = [
  {
    role: "Frontend Developer",
    text: `Frontend Developer role expectations: Strong JavaScript/TypeScript, React or
    Vue or Angular, state management (Redux/Zustand/Context), responsive CSS
    (Tailwind/SCSS), component testing (Jest/React Testing Library), accessibility (a11y),
    performance optimization (lazy loading, code splitting), REST/GraphQL API consumption,
    build tooling (Vite/Webpack), and familiarity with design systems.`,
  },
  {
    role: "Backend Developer",
    text: `Backend Developer role expectations: Server-side language proficiency (Node.js,
    Python, Java, Go), REST/GraphQL API design, relational and NoSQL databases (PostgreSQL,
    MongoDB), authentication/authorization (JWT, OAuth2), caching (Redis), message queues,
    containerization (Docker), CI/CD, testing (unit/integration), and system design fundamentals
    (scalability, load balancing, database indexing).`,
  },
  {
    role: "Full Stack Developer",
    text: `Full Stack Developer role expectations: Combination of frontend (React/Vue) and
    backend (Node.js/Express, Django, or similar) skills, database design, REST/GraphQL APIs,
    authentication, deployment/DevOps basics (Docker, CI/CD, cloud providers), version control
    workflows, and the ability to own a feature end to end.`,
  },
  {
    role: "Data Scientist / ML Engineer",
    text: `Data Scientist / ML Engineer role expectations: Python, pandas/numpy, statistics,
    machine learning frameworks (scikit-learn, PyTorch/TensorFlow), data visualization,
    feature engineering, model evaluation, SQL, experience with LLMs and vector databases
    for retrieval-augmented generation is increasingly expected, MLOps basics (model deployment,
    monitoring).`,
  },
  {
    role: "DevOps / Cloud Engineer",
    text: `DevOps / Cloud Engineer role expectations: Linux fundamentals, cloud platforms
    (AWS/GCP/Azure), Infrastructure as Code (Terraform/CloudFormation), containerization
    (Docker, Kubernetes), CI/CD pipelines (GitHub Actions, Jenkins), monitoring/observability
    (Prometheus, Grafana, ELK), scripting (Bash/Python), and security best practices.`,
  },
  {
    role: "Generative AI Engineer",
    text: `Generative AI Engineer role expectations: LLM fundamentals (prompt engineering,
    fine-tuning, RAG pipelines), orchestration frameworks (LangChain, LangGraph, LlamaIndex),
    vector databases (Pinecone, Chroma, Weaviate, FAISS), embeddings, evaluation of LLM outputs,
    API integration with providers (OpenAI, Google Gemini, Anthropic), and production concerns
    like latency, cost, and hallucination mitigation.`,
  },
];
