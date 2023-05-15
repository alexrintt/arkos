export interface WithId {
  id: string;
}

// The insertedAt and the updatedAt field represents the moment when an entry in the [T] schema was created in the database.
// This field should not be defined by the user, but instead should always be set to the current time when a new entry is created.
// Note that this timestamp reflects the time the entry was created in the database, regardless of any other dates associated with the entry.
// For example, a [Transaction] entry may represent a transaction that occurred in the past, but the insertedAt field will always reflect the current time when the entry was created in the database.
// If a [Transaction] entry needs to point to a specific date in the past,
// that date should be defined in the model itself, using a separate field or a related entity.
// This separation of concerns ensures that the insertedAt field accurately reflects the time the
// entry was created in the database, and that any other dates associated with the entry are properly represented and managed.
export interface WithTimestamp {
  insertedAt: number;
  updatedAt: number;
}

export type Template<T> = WithId &
  WithTimestamp & {
    prefilled: Partial<T>;
  };

export interface Drawable {
  // Base 64 of this drawable. Do not load URLs directly as it is not safe and can be privacy harmful.
  // Show a warning when loading base64 larger than 1mb.
  base64?: string;

  // Subset of css colors that are cross-platform, maybe you are displaying this data in an environment like Android?
  hexColor?: string;

  // Kept for compatibility purposes.
  // This application doesn't have a remote image provider, so we don't use this field at all.
  // But we don't know the future, so I'm keeping this here.
  httpUrl?: string;

  // Safe as [httpUrl] but for user provided URLs.
  unsafeHttpUrl?: string;
}

export type Paginated<T> = {
  cursor: string;
  nodes: T[];
};
