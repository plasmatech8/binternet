-- Migration number: 0001  2024-06-16T13:22:14.096Z
/*
 * Inscriptions table
 */
create table inscriptions(
    number integer not null primary key,
    id text not null,
    content_type text not null,
    created_at timestamptz default current_timestamp not null,
    inscribed_at timestamptz not null
);

-- Create an index for the `id` column
create index idx_inscriptions_id on inscriptions(id);
