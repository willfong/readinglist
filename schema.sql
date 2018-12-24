CREATE TYPE reading_states AS ENUM ('listed', 'started', 'completed', 'abandoned');

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

CREATE INDEX idx_userid_state ON books (userid, state);
