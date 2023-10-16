CREATE DATABASE "job"

CREATE USER "job" with  PASSWORD 'job' SUPERUSER;

ALTER ROLE "job" WITH LOGIN;

\c "job";

-- psql -U job -d job -W
-- npx psql-shell
