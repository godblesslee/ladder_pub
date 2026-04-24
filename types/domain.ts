export type UserRole = "user" | "organizer" | "admin";

export type EventStatus = "draft" | "published" | "ongoing" | "ended";

export type ReviewFieldType =
  | "single_select"
  | "multi_select"
  | "text"
  | "textarea"
  | "score";

export type Beer = {
  id: string;
  breweryName: string;
  productName: string;
  styleName: string;
  countryCode: string;
  abv: number;
  volumeMl: number;
  imageUrl?: string;
};

export type Event = {
  id: string;
  title: string;
  status: EventStatus;
  startAt: string;
  endAt?: string;
  location: string;
  coverImageUrl?: string;
};
