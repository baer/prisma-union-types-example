# Union Types + Prisma

## Problem Statement

Prisma currently doesn't support Union types in the Prisma schema.

## Why is this a problem?

Well, it depends on where you sit? If you're a Database engineer, you may shrug, but for application, this can be a little bit of an [impedance mismatch](https://en.wikipedia.org/wiki/Impedance_matching). Software applications typically work with denormalized Objects and Types that may be represented differently at the Database level. ORMs exist to translate one to the other, but some translations are much more complicated than others. While it is possible to _represent_ Union types in Prisma, as of this writing, it does not do so automatically.

More concretely, GraphQL and TypeScript allow you to create a Union type, which is useful pretty much any time you need to represent one of several possible types. Two common examples are Error sub-classing and Search results that may need to return different types of content. And as of April 2023, this is not something that Prisma supports.

For example, below is a Union type for an `Event` that could be a `Concert`, a `Play`, or a `Conference`.

```typescript
type Event = Concert | Play | Conference;

type Concert = {
  type: "concert";
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  ...
};

type Play = {
  type: "play";
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  ...
};

type Conference = {
  type: "conference";
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  ...
};
```

## How would you model a Union in SQL anyway?

There are pretty much four ways to get this done, and none of them is a perfect fit.

- Polymorphic Association: Use a source table with a Foreign Key and a type identifier.
- Single Table Inheritance (STI): Combine all columns from all tables in the Union into a single table.
- Class Table Inheritance (CTI): Use a separate table for the Union type and each member type, with common attributes in the parent table and a Foreign Key constraint in each member type.
- Concrete Table Inheritance (CoTI): Just like CTI, but with all attributes in each table, and no direct relationship between the Union type and member types.

### Polymorphic Association:

**Pros:**

- The schema is relatively simple, since a single table can have associations with multiple tables without the need for separate JOIN tables or Foreign Key columns on each related table.
- Easy to add new related tables in the future.

**Cons:**

- Querying is more complex since you'll need to JOIN with multiple tables.
- Enforcing referential integrity is more manual since you're using stringly typed data in place of Foreign Key constraints.

### Single Table Inheritance (STI):

While this sounds ugly, and it kinda is, it can work pretty well if your Types don't have many distinct attributes.

**Pros:**

- Simple schema. It's just one table.
- Fast queries. Again, it's just one table.

**Cons:**

- If the Types have (or accumulate) a lot of distinct attributes, you'll end up with a sparse table full of NULL values.
- Adding new sub-types usually requires a schema change.

### Class Table Inheritance (CTI)

**Pros:**

- More "correct" schema, complete with normalization and relationship constraints.
- Easy to add new types to the Union without requiring schema changes to existing tables.

**Cons:**

- Queries can become complex since there can be a lot of JOINS.
- The schema is more complex and requires more tables.

### Concrete Table Inheritance (CoTI)

Although it offers better performance, it has a lot of drawbacks, so it's a less common choice.

It's faster, but there are a lot of drawbacks, so this isn't that common.

Pros:
Better performance since there are no JOINs between superclass and subclass tables.
Each table is self-contained with all attributes for a specific class.

Cons:
Redundancy in the schema since inherited attributes are duplicated across subclass tables.
Adding new attributes to a superclass requires schema changes to all subclass tables.
Enforcing referential integrity and maintaining consistency across subclass tables can be challenging.

## Modeling a Union type in Prisma

The best method to model a Union type in Prisma depends on your specific use case and requirements, but for this example, we'll use an adapted version of the Class Table Inheritance approach since it provides a more structured schema and is easy to maintain and extend in the future.

1. Create a model for the Union type, including common fields.
2. Create a model for each type in the Union with their specific fields.
3. Create a relationship between the common model and each specific type model.

Here's an example Prisma schema for the Event Union type and each member type (Concert, Play, and Conference)

```prisma
model Event {
  id        Int      @id @default(autoincrement())
  name      String
  startsAt  DateTime
  endsAt    DateTime

  concert   Concert? @relation(fields: [id], references: [eventId])
  play      Play?    @relation(fields: [id], references: [eventId])
  conference Conference? @relation(fields: [id], references: [eventId])
}

model Concert {
  eventId Int    @id
  event   Event  @relation(fields: [eventId], references: [id])
  // additional Concert-specific fields
}

model Play {
  eventId Int    @id
  event   Event  @relation(fields: [eventId], references: [id])
  // additional Play-specific fields
}

model Conference {
  eventId Int    @id
  event   Event  @relation(fields: [eventId], references: [id])
  // additional Conference-specific fields
}
```
