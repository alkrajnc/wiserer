
CREATE TABLE IF NOT EXISTS timetable_entry
(
    id text PRIMARY KEY,
    starts TIMESTAMP NOT NULL,
    ends TIMESTAMP NOT NULL,
    day text NOT NULL,
    location text NOT NULL,
    course
)
