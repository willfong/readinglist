CREATE TYPE reading_states AS ENUM ('listed', 'started', 'completed', 'abandoned');


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;


CREATE TABLE IF NOT EXISTS books ( 
  id BIGSERIAL PRIMARY KEY,
  userid VARCHAR(100),
  state reading_states DEFAULT 'listed',
  listed TIMESTAMPTZ DEFAULT NOW(),
  started TIMESTAMPTZ,
  completed TIMESTAMPTZ,
  title VARCHAR(100),
  rating SMALLINT,
  review TEXT
);
CREATE INDEX i_books_userid_state ON books (userid, state);


CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  userid VARCHAR(100),
  username VARCHAR(100),
  joined TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX u_users_userid ON users (userid);
CREATE UNIQUE INDEX u_users_username ON users (username);


CREATE TABLE IF NOT EXISTS minions (
  id BIGSERIAL PRIMARY KEY,
  userid VARCHAR(100),
  minionid VARCHAR(100)
);
CREATE UNIQUE INDEX u_minions_userid_minionid ON minions (userid, minionid);
CREATE INDEX i_minions_minionid ON minions (minionid);
