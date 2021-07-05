# openwarehouse

A content management system base on the Keystone.js 5

## Database Migration

If any of the `lists` changes, the database schema must be changed accordingly.

When it happens, developers are responsible for following things:

1. In the same commit of `list` change, the commit should contain a migration sql script in the `lists/{project}/pq/migrations/`. The file must have a **prefix number** to it's filename to show the patch order. This file should be applied to the database from the last migration and the result must match the latest `lists`. To help you generate the migration script, you may use `keystone upgrade-relationships` and `keystone upgrade-relationships --migration` as a starting point. [Document for them](https://v5.keystonejs.com/guides/relationship-migration#postgresql)
