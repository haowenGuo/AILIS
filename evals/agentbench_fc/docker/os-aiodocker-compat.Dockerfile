ARG BASE_IMAGE
FROM ${BASE_IMAGE}

# AgentRL worker 0.4.0 passes integer exec timeouts; aiodocker 0.27 expects a timeout object.
RUN python -m pip install --no-cache-dir "aiodocker==0.24.0"
