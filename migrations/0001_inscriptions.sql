-- Migration number: 0001 	 2024-06-16T13:22:14.096Z
/*
 * Inscriptions table
 */
create table inscriptions(
    number integer not null primary key,
    id text not null,
    content_type text not null,
    created_at timestamptz not null,
    details_added_on timestamptz not null
);