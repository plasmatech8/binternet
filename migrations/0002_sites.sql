-- Migration number: 0002  2024-09-08T05:36:15.833Z
/*
 * Sites table
 */
create table sites(
    number integer not null primary key,
    title text not null,
    created_at timestamptz default current_timestamp not null
);

create index idx_sites_created_at on sites(created_at);
