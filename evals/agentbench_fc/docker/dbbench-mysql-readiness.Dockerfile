ARG BASE_IMAGE
FROM ${BASE_IMAGE}

# The temporary MySQL init server accepts socket pings while TCP port 3306 is still closed.
RUN grep -Fq "'ping', '-h', 'localhost'" /app/src/server/tasks/dbbench/environment.py \
    && sed -i "s/'ping', '-h', 'localhost'/'ping', '--protocol=tcp', '-h', '127.0.0.1'/" \
        /app/src/server/tasks/dbbench/environment.py
