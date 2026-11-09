export interface GalleryImage {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
}

export interface InvitationContent {
  hero?: {
    greeting?: string;
    message?: string;
    subtitle?: string;
    image?: string;
  };

  profile?: {
    heading?: string;
    description?: string;
    personalMessage?: string;
    quote?: string;
    universityLabel?: string;
    majorLabel?: string;
    yearLabel?: string;
  };

  event?: {
    heading?: string;
    subtitle?: string;
    invitationMessage?: string;
    mapButtonLabel?: string;
    calendarButtonLabel?: string;
    dateLabel?: string;
    timeLabel?: string;
    locationLabel?: string;
  };

  gallery?: {
    heading?: string;
    description?: string;
    images?: GalleryImage[];
    closeLabel?: string;
    previousLabel?: string;
    nextLabel?: string;
  };

  rsvp?: {
    heading?: string;
    subtitle?: string;
    attendingButton?: string;
    attendingDescription?: string;
    decliningButton?: string;
    decliningDescription?: string;
    changeButton?: string;

    attendingConfirmation?: {
      title?: string;
      message?: string;
    };

    decliningConfirmation?: {
      title?: string;
      message?: string;
    };
  };

  closing?: {
    heading?: string;
    message?: string;
    signature?: string;
    additionalMessage?: string;
  };
}

/** Keys that stay optional even after merging with the default invitation. */
type OptionalContentKeys = 'image' | 'quote' | 'additionalMessage';

type DeepRequired<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T as K extends OptionalContentKeys ? never : K]-?: DeepRequired<NonNullable<T[K]>> } & {
        [K in keyof T as K extends OptionalContentKeys ? K : never]?: T[K];
      }
    : T;

/** A complete invitation: the default content merged with guest overrides. */
export type ResolvedInvitation = DeepRequired<InvitationContent>;
