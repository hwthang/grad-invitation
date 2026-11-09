# Graduation Invitation Website
## Product Requirements & Technical Specification

**Project Name:** Graduation Invitation Website
**Repository Name:** `graduation-invitation`
**Version:** 2.1
**Project Type:** Frontend-only Web Application
**Primary Language:** Vietnamese
**Documentation & Code Language:** English

---

# 1. Project Overview

## 1.1. Introduction

The Graduation Invitation Website is a personalized digital invitation platform designed to invite friends, family members, teachers, and other guests to a graduation celebration.

Visitors enter their names on the Welcome page. The application searches for a matching guest in a predefined guest configuration. If a match is found, the application loads that guest's personalized invitation. Otherwise, it displays the default invitation for a generic guest.

Every guest can have customized invitation content, including greetings, messages, profile descriptions, gallery images, RSVP text, and closing messages.

The application is initially developed as a frontend-only project. Guest data and invitation content are maintained locally in configuration files. RSVP responses are stored in the browser's LocalStorage.

**Important configuration requirement:** All Welcome page text content must be stored in a dedicated JSON file so that it can be modified without changing Angular components or application logic.

## 1.2. Objectives

- Create an elegant and modern digital graduation invitation.
- Provide personalized invitation content for individual guests.
- Allow guests to find their invitations using their names.
- Provide a simple RSVP experience.
- Maintain reusable and configurable invitation components.
- Separate UI content from application logic.
- Support responsive layouts across desktop, tablet, and mobile devices.
- Use smooth animations to create a memorable experience.

## 1.3. Core Principles

- **Personalization First:** Every guest can receive a different invitation experience.
- **Content Configuration First:** Text content should be separated from UI components.
- **Default Content:** Guests without custom configurations inherit the default invitation.
- **Reusable Components:** Invitation sections should be reusable and data-driven.
- **Frontend Only:** No backend or database is required for the initial release.
- **Mobile First:** The website must work well on mobile devices.

---

# 2. Technology Stack

| Technology | Purpose |
|---|---|
| Angular (2+) | Frontend framework and application architecture |
| TypeScript | Main development language |
| Tailwind CSS | Styling and responsive design |
| GSAP | Animations, transitions, and interactive motion |
| Font Awesome | Icon library |
| Angular Router | Application navigation |
| Angular Reactive Forms | Form validation and user input |
| HttpClient | Loading external JSON configuration files |
| LocalStorage | Persist RSVP responses in the current browser |
| Google Maps | External navigation to the graduation venue |

## 2.1. Angular

Use modern Angular (2+), not AngularJS (1.x).

Recommended architecture:

- Standalone components.
- Angular services for guest resolution and RSVP management.
- TypeScript interfaces for strongly typed configuration.
- Angular Router for navigation.
- Reactive Forms for the Welcome page input.
- Dependency injection for shared services.
- HttpClient for loading JSON content.

## 2.2. GSAP

Use GSAP for polished animations and visual interactions.

Expected use cases:

- Welcome page entrance animations.
- Background decorative animations.
- Hero section text and image reveal.
- Scroll-triggered section animations.
- Staggered gallery image appearances.
- RSVP interaction feedback.
- Invitation page transitions.
- Modal and lightbox transitions.

Use GSAP ScrollTrigger where necessary.

Requirements:

- Keep animations smooth and subtle.
- Avoid excessive motion.
- Clean up GSAP timelines and ScrollTriggers when components are destroyed.
- Respect `prefers-reduced-motion`.
- Avoid animations that interfere with user interaction.

## 2.3. Font Awesome

Use Font Awesome consistently throughout the application.

Potential icon use cases:

- Calendar and clock.
- Location and map navigation.
- Graduation cap.
- Camera and image gallery.
- Celebration and decorative elements.
- RSVP status.
- Navigation and utility buttons.

Use Font Awesome as the single icon system.

## 2.4. Styling

Use Tailwind CSS as the primary styling solution.

Requirements:

- Mobile-first responsive design.
- Reusable styling patterns.
- Consistent spacing and typography.
- Centralized theme configuration.
- Avoid excessive custom CSS when Tailwind utilities are sufficient.

---

# 3. Design System

## 3.1. Design Direction

**Elegant Blue Pastel – Modern – Minimalist – Personal**

The website should feel:

- Elegant and memorable.
- Soft and welcoming.
- Modern and youthful.
- Personal and warm.
- Clean and visually balanced.

Pastel blue should be the dominant visual direction. Navy and royal blue should provide contrast and maintain readability.

## 3.2. Color Palette

### Primary Blue Palette

| Color | Hex | Usage |
|---|---|---|
| Navy Blue | `#102A56` | Main headings and important text |
| Royal Blue | `#2563EB` | Primary buttons and highlights |
| Sky Blue | `#60A5FA` | Secondary accents |
| Pastel Blue | `#A7C7E7` | Decorative backgrounds |
| Ice Blue | `#DBEAFE` | Section backgrounds and cards |
| Soft Blue | `#EAF4FC` | Subtle backgrounds and gradients |

### Neutral Palette

| Color | Hex | Usage |
|---|---|---|
| Off White | `#F8FAFC` | Main background |
| White | `#FFFFFF` | Cards and content surfaces |
| Slate Gray | `#64748B` | Secondary text |
| Dark Slate | `#1E293B` | Main body text |

## 3.3. Color Usage Guidelines

- Use Pastel Blue, Ice Blue, and Soft Blue as primary background colors.
- Use White and Off White to create visual breathing space.
- Use Navy Blue for headings and important text.
- Use Royal Blue for primary CTA buttons.
- Use Sky Blue for secondary highlights.
- Use subtle blue gradients for decorative sections.
- Avoid large areas of dark blue that make the interface feel heavy.

Suggested gradients:

- `#EAF4FC` to `#FFFFFF`
- `#DBEAFE` to `#EAF4FC`
- `#A7C7E7` to `#DBEAFE`

## 3.4. Typography

Recommended font pairing:

- Playfair Display or Cormorant Garamond for major headings.
- Inter for body text, buttons, forms, and UI elements.

All fonts must support Vietnamese characters.

## 3.5. Visual Elements

Suggested elements:

- Soft blue gradients.
- Subtle light effects.
- Delicate decorative shapes.
- Rounded cards with restrained shadows.
- Thin borders and elegant dividers.
- Soft glow effects on interactive elements.
- Minimal graduation-themed decorations.

Avoid excessive decoration and unnecessary visual clutter.

---

# 4. Application Architecture

The application contains two primary pages:

1. Welcome Page.
2. Invitation Page.

The application also contains centralized configuration files for page content, guest data, and shared graduation information.

## 4.1. Content Configuration Strategy

Separate content into three categories:

| Content Category | Configuration Source | Purpose |
|---|---|---|
| Welcome page content | `welcome-content.json` | All text displayed on the Welcome page |
| Default invitation content | `default-invitation.config.ts` | Default content for the Invitation page |
| Guest-specific content | `guests.config.ts` | Individual guest data and content overrides |
| Shared graduation information | `graduation-info.config.ts` | Graduate and event facts shared across invitations |

### General Rules

- Do not hardcode user-facing text inside page components.
- Welcome page text must be loaded from its JSON configuration.
- Invitation page text must be resolved from the default invitation and guest overrides.
- Shared graduation information must remain separate from personalized invitation content.
- Components should focus on rendering data and handling interactions.

---

# 5. Welcome Page

**Route:** `/`

## 5.1. Purpose

Allow visitors to enter their names and retrieve their personalized invitations.

## 5.2. Main Components

- Decorative background.
- Main invitation heading.
- Introductory description.
- Name input.
- Submit button.
- Supporting text.
- Optional graduation illustration or decorative image.

## 5.3. Default Vietnamese Content

The following content represents the initial default values. Actual content must be read from `welcome-content.json`.

**Heading:**

"Bạn có một lời mời đặc biệt!"

**Subtitle:**

"Một cột mốc đáng nhớ sẽ trọn vẹn hơn khi có sự hiện diện của những người thân yêu."

**Input label:**

"Tên của bạn"

**Input placeholder:**

"Nhập tên của bạn..."

**Primary button:**

"Mở thư mời"

**Supporting text:**

"Hãy nhập tên để nhận lời mời dành riêng cho bạn nhé!"

**Required validation message:**

"Bạn chưa nhập tên kìa!"

**Not-found message:**

"Không tìm thấy tên của bạn. Mình sẽ gửi bạn lời mời chung nhé!"

## 5.4. Welcome Page Content Configuration

**[Required]** All Welcome page text content must be maintained in a dedicated JSON file.

**File location:**

`src/assets/config/welcome-content.json`

### Example JSON Configuration

```json
{
  "hero": {
    "heading": "Bạn có một lời mời đặc biệt!",
    "subtitle": "Một cột mốc đáng nhớ sẽ trọn vẹn hơn khi có sự hiện diện của những người thân yêu."
  },
  "form": {
    "label": "Tên của bạn",
    "placeholder": "Nhập tên của bạn...",
    "submitButton": "Mở thư mời",
    "supportingText": "Hãy nhập tên để nhận lời mời dành riêng cho bạn nhé!"
  },
  "validation": {
    "required": "Bạn chưa nhập tên kìa!",
    "notFound": "Không tìm thấy tên của bạn. Mình sẽ gửi bạn lời mời chung nhé!"
  },
  "decoration": {
    "enabled": true,
    "showGraduationIcon": true
  }
}
```

### JSON Configuration Requirements

The JSON file must contain all user-facing text and configurable decorative options for the Welcome page.

This includes:

- Hero heading.
- Hero subtitle.
- Input label.
- Input placeholder.
- Submit button label.
- Supporting text.
- Validation messages.
- Optional decorative settings.
- Any additional Welcome page text introduced during development.

Do not place duplicated text values in the Angular template or component TypeScript.

The JSON file should be the single source of truth for Welcome page content.

### TypeScript Interface

Create:

`src/app/features/welcome/models/welcome-content.model.ts`

```ts
export interface WelcomeContent {
  hero: {
    heading: string;
    subtitle: string;
  };

  form: {
    label: string;
    placeholder: string;
    submitButton: string;
    supportingText: string;
  };

  validation: {
    required: string;
    notFound: string;
  };

  decoration: {
    enabled: boolean;
    showGraduationIcon: boolean;
  };
}
```

The interface should be updated whenever the JSON configuration schema changes.

### WelcomeContentService

Create:

`src/app/features/welcome/services/welcome-content.service.ts`

Responsibilities:

- Load Welcome page content from JSON.
- Provide typed configuration data.
- Handle configuration loading errors.
- Avoid duplicating content values in components.

Example:

```ts
@Injectable({
  providedIn: 'root'
})
export class WelcomeContentService {
  private http = inject(HttpClient);

  getContent(): Observable<WelcomeContent> {
    return this.http.get<WelcomeContent>(
      '/assets/config/welcome-content.json'
    );
  }
}
```

Configure HttpClient using `provideHttpClient()` in the Angular application configuration.

### Component Integration

The Welcome page must consume the content service and render the loaded values.

Example template:

```html
<h1>{{ content.hero.heading }}</h1>

<p>{{ content.hero.subtitle }}</p>

<label>{{ content.form.label }}</label>

<input
  [placeholder]="content.form.placeholder"
/>

<button>
  {{ content.form.submitButton }}
</button>

<p>{{ content.form.supportingText }}</p>
```

This is an illustrative template. The actual implementation should use Angular Reactive Forms and proper loading and error states.

### Important Implementation Rules

1. Do not hardcode Welcome page text in HTML.
2. Do not hardcode Welcome page text in component TypeScript.
3. All user-facing text must come from `welcome-content.json`.
4. Keep the JSON file independent of Angular component implementation.
5. Keep the TypeScript interface synchronized with the JSON structure.
6. Decorative settings may also be stored in this file.
7. Do not put application logic, callbacks, or executable code inside JSON.
8. Do not put guest-specific Invitation content in this file.

### Configuration Loading States

The Welcome page should handle:

- Loading: display a simple loading state while JSON is being retrieved.
- Success: render the Welcome page using loaded content.
- Error: display a safe fallback message or a configuration loading error state.

If the JSON file cannot be loaded, do not leave the page in an indefinite loading state.

## 5.5. Interaction Flow

1. Visitor opens the Welcome page.
2. Visitor enters their name.
3. Application validates the input.
4. Application normalizes the entered name.
5. Application searches the predefined guest configuration.
6. If a guest is found, resolve that guest's invitation.
7. If no guest is found, resolve the default Guest invitation.
8. Navigate to the Invitation page.

## 5.6. Validation

- Empty input must not be submitted.
- Trim leading and trailing whitespace.
- Collapse consecutive spaces.
- Display validation messages from `welcome-content.json`.

## 5.7. Name Matching

Implement name normalization:

- Convert text to lowercase.
- Remove Vietnamese diacritics.
- Convert `đ` to `d`.
- Trim leading and trailing spaces.
- Collapse consecutive whitespace.

Use exact normalized matching against guest names and configured aliases.

Do not use unrestricted substring matching because it may resolve the wrong guest.

---

# 6. Invitation Page

**Route:** `/invitation?guest={guestId}`

## 6.1. Purpose

Display a complete graduation invitation personalized for the resolved guest.

## 6.2. Personalization Requirement

All content on the Invitation page must support guest-specific customization.

Personalization is not limited to the guest's name or profile image.

Each guest can override any supported invitation content field.

If a guest does not define a custom value, the application must inherit the corresponding value from the default invitation configuration.

## 6.3. Invitation Sections

The page contains:

1. Hero Section.
2. Graduate Profile Section.
3. Event Details Section.
4. Graduation Gallery Section.
5. RSVP Section.
6. Closing Section.

All sections must receive their content through configuration data.

---

# 7. Invitation Content Specification

## 7.1. Hero Section

### Purpose

Create the first impression and introduce the invitation.

### Content Fields

- Greeting.
- Main invitation message.
- Supporting subtitle.
- Optional personalized image.

### Default Vietnamese Content

**Greeting:**

"Thân gửi bạn,"

**Main message:**

"Mình trân trọng gửi đến bạn lời mời tham dự buổi lễ tốt nghiệp và cùng chia sẻ khoảnh khắc đáng nhớ này."

**Subtitle:**

"Hy vọng chúng ta sẽ có cơ hội gặp nhau trong ngày đặc biệt này nhé!"

### Visual Requirements

- Elegant typography.
- Prominent graduate portrait or decorative image.
- Soft blue background.
- Subtle entrance animations.
- Clear visual hierarchy.

## 7.2. Graduate Profile Section

### Purpose

Introduce the graduate and provide a personal reflection about the graduation journey.

### Content Fields

- Section heading.
- Description.
- Personal message.
- Optional quote.

### Default Vietnamese Content

**Heading:**

"Một hành trình, một dấu mốc"

**Description:**

"Những năm tháng học tập, những trải nghiệm và cả những thử thách đã góp phần tạo nên hành trình đáng nhớ này."

**Personal message:**

"Mỗi bước đi đều là một phần của hành trình trưởng thành."

Graduate name, university, major, graduation year, and portrait are shared information by default.

## 7.3. Event Details Section

### Shared Event Information

- Event title.
- Event date.
- Start time.
- Venue name.
- Full address.
- Google Maps URL.

### Personalized Content Fields

- Section heading.
- Subtitle.
- Invitation message.
- Map button label.

### Default Vietnamese Content

**Heading:**

"Thông tin buổi lễ"

**Subtitle:**

"Hẹn gặp bạn trong ngày đặc biệt này nhé!"

**Map button:**

"Xem đường đi"

### Interaction

- Clicking the map button opens the configured Google Maps URL in a new browser tab.
- Optionally provide an Add to Calendar action.

## 7.4. Graduation Gallery Section

### Purpose

Show memorable moments from the graduate's academic journey.

### Content Fields

- Section heading.
- Description.
- Gallery image collection.

### Default Vietnamese Content

**Heading:**

"Những khoảnh khắc đáng nhớ"

**Description:**

"Mỗi bức ảnh là một phần của hành trình."

### Gallery Requirements

- Responsive image grid.
- Consistent image presentation.
- Optional image captions.
- Image lightbox.
- Close button.
- Next and previous navigation when multiple images exist.
- Smooth entrance animations using GSAP.

Each guest can have a different gallery collection.

If a guest does not define a custom gallery, use the default gallery.

## 7.5. RSVP Section

### Purpose

Allow guests to respond to the graduation invitation.

### Default Vietnamese Content

**Heading:**

"Bạn sẽ đến chung vui cùng mình chứ?"

**Subtitle:**

"Mình rất mong được gặp bạn, nhưng dù thế nào cũng cảm ơn bạn đã dành thời gian ghé qua lời mời này nhé!"

### RSVP Options

**Attend**

Button:

"Đếm mình một chỗ nhé!"

Supporting text:

"Mình sẽ đến chung vui!"

**Cannot Attend**

Button:

"Lần này mình không tham gia được"

Supporting text:

"Gửi bạn thật nhiều lời chúc nhé!"

### Confirmation Messages

**When attending:**

Title:

"Tuyệt vời! 🎉"

Message:

"Mình rất vui khi biết bạn sẽ đến. Hẹn gặp bạn trong ngày đặc biệt nhé!"

**When unable to attend:**

Title:

"Không sao đâu!"

Message:

"Cảm ơn bạn đã phản hồi. Dù không thể gặp nhau lần này, mình vẫn rất trân trọng những lời chúc của bạn!"

### RSVP Behavior

- RSVP is optional.
- Initial RSVP status is `PENDING`.
- No response must never be interpreted as declining.
- Guests can change their RSVP response.
- No reason is required when declining.
- Display the appropriate confirmation message after a response.
- RSVP labels and confirmation messages can be customized per guest.

## 7.6. Closing Section

### Purpose

End the invitation with a warm and personal message.

### Content Fields

- Closing heading.
- Closing message.
- Signature.
- Optional additional message.

### Default Vietnamese Content

**Heading:**

"Cảm ơn bạn đã ghé thăm!"

**Message:**

"Sự hiện diện của bạn sẽ là một niềm vui trong ngày đặc biệt này. Hy vọng chúng ta sẽ có thêm một kỷ niệm thật đẹp cùng nhau!"

**Signature:**

"Thân mến,"

The graduate's name should appear below the signature.

### Visual Requirements

- Elegant closing typography.
- Soft pastel blue background.
- Optional decorative elements.
- Subtle fade-out animation.

---

# 8. Guest Personalization System

## 8.1. Core Concept

Implement a **Default Content + Guest-specific Overrides** configuration model.

The default invitation provides a complete baseline configuration.

Each named guest can override only the fields that need customization.

## 8.2. TypeScript Data Models

### Guest

```ts
export interface Guest {
  id: string;
  name: string;
  aliases?: string[];
  image?: string;
  relationship?: string;
  invitation?: InvitationContent;
}
```

### Gallery Image

```ts
export interface GalleryImage {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
}
```

### Invitation Content

```ts
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
  };

  event?: {
    heading?: string;
    subtitle?: string;
    invitationMessage?: string;
    mapButtonLabel?: string;
  };

  gallery?: {
    heading?: string;
    description?: string;
    images?: GalleryImage[];
  };

  rsvp?: {
    heading?: string;
    subtitle?: string;
    attendingButton?: string;
    attendingDescription?: string;
    decliningButton?: string;
    decliningDescription?: string;

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
```

### Graduation Information

```ts
export interface GraduationInfo {
  graduateName: string;
  university: string;
  major: string;
  graduationYear: number;
  portrait: string;

  event: {
    title: string;
    date: string;
    startTime: string;
    location: string;
    address: string;
    mapUrl: string;
  };
}
```

## 8.3. Default Invitation Configuration

File:

`src/app/core/config/default-invitation.config.ts`

This configuration must contain all default Vietnamese invitation content described in Section 7.

The default Guest must always use this configuration.

## 8.4. Guest Configuration

File:

`src/app/core/config/guests.config.ts`

Example:

```ts
export const guestMap: Record<string, Guest> = {
  "guest-001": {
    id: "guest-001",
    name: "Nguyễn Văn A",
    aliases: ["A", "Văn A"],
    image: "/assets/images/guests/nguyen-van-a.jpg",
    relationship: "Close Friend",

    invitation: {
      hero: {
        greeting: "Gửi A,",
        message:
          "Cuối cùng cũng đến ngày này rồi! Mình muốn mời bạn đến chung vui và cùng lưu giữ thêm một kỷ niệm đẹp nhé!"
      },

      profile: {
        heading: "Một chặng đường đã qua!",
        description:
          "Thật vui vì trong hành trình này có những người bạn như A."
      },

      rsvp: {
        heading: "Có mặt để chung vui với mình nhé?",
        attendingButton: "Chắc chắn rồi!",
        decliningButton: "Tiếc quá, lần này mình bận mất rồi!"
      }
    }
  }
};
```

This is an illustrative example. Actual guest data must be maintained in the local configuration.

## 8.5. Default Guest

```ts
export const defaultGuest: Guest = {
  id: "guest",
  name: "Bạn",
  relationship: "Guest",
  image: "/assets/images/default-guest.jpg",
  invitation: defaultInvitation
};
```

Use the default Guest when:

- The entered name does not match any configured guest.
- The guest ID is missing or invalid.
- The application needs a generic invitation.

## 8.6. Content Resolution

Implement a dedicated `GuestService`.

Responsibilities:

- Normalize guest names.
- Find guests by name or alias.
- Resolve guest IDs.
- Return the default Guest when no match is found.
- Merge default invitation content with guest-specific overrides.
- Resolve image fallbacks.

### Resolution Flow

1. Load the default invitation configuration.
2. Find the selected guest.
3. Retrieve the guest's custom invitation overrides.
4. Deep merge the overrides with the default invitation.
5. Resolve the guest image.
6. Return the final invitation configuration.
7. Render the Invitation page.

### Deep Merge Requirements

- Merge nested objects recursively.
- Preserve default values when custom fields are omitted.
- Replace primitive values when a custom value is provided.
- Replace arrays entirely when a custom array is provided.
- Preserve the default gallery when the custom gallery is omitted.
- Allow an explicitly empty gallery array to hide gallery images.
- Do not mutate the original default configuration.

Example:

```ts
export function resolveInvitation(
  guest: Guest
): InvitationContent {
  return deepMerge(
    defaultInvitation,
    guest.invitation ?? {}
  );
}
```

## 8.7. Image Fallback Rules

Every guest must have an image.

Resolution priority:

1. Guest-specific image.
2. Guest-specific hero image, when applicable.
3. Default guest image.
4. Shared graduate portrait when appropriate.

Ensure the UI never displays a broken image without a fallback.

---

# 9. Routing and Navigation

## 9.1. Routes

| Route | Description |
|---|---|
| `/` | Welcome page |
| `/invitation?guest=guest-001` | Personalized invitation |
| `/invitation?guest=guest` | Default invitation |

## 9.2. Navigation Rules

- Welcome page is the entry point.
- After name submission, resolve the guest and navigate to the Invitation page.
- Pass the guest ID through the query parameter.
- Invitation page resolves the guest using the ID.
- Invalid or missing guest IDs fall back to the default Guest.
- Refreshing the Invitation page must preserve the selected guest.
- Opening a valid invitation URL directly must work.

Do not rely solely on in-memory application state for guest identification.

---

# 10. RSVP Data Management

## 10.1. RSVP Status

```ts
export type RSVPStatus =
  | "PENDING"
  | "ATTENDING"
  | "NOT_ATTENDING";
```

## 10.2. RSVP Data Model

```ts
export interface RSVPResponse {
  guestId: string;
  guestName: string;
  status: RSVPStatus;
  updatedAt: string;
}
```

## 10.3. LocalStorage

Storage key:

`graduation-invitation-rsvp`

Suggested structure:

```ts
interface RSVPStorage {
  [guestId: string]: RSVPResponse;
}
```

## 10.4. RsvpService

Responsibilities:

- Retrieve the current guest's RSVP response.
- Save a new RSVP response.
- Update an existing response.
- Return `PENDING` when no response exists.
- Handle invalid or unavailable LocalStorage data gracefully.

## 10.5. Important Limitations

LocalStorage is specific to the current browser and device.

Therefore:

- RSVP responses are not centrally collected.
- Responses cannot be viewed from another device.
- Clearing browser data may remove saved responses.
- Multiple unknown visitors using the default Guest share the same guest identity if keyed only by `guest`.

A backend or external data service will be required for centralized RSVP collection in a future version.

---

# 11. User Experience & Interaction

## 11.1. General Requirements

- Smooth page navigation.
- Clear interaction feedback.
- Responsive layouts.
- Accessible buttons and inputs.
- Consistent hover and focus states.
- Loading and error states where appropriate.

## 11.2. Welcome Page Interactions

- Load content from JSON configuration.
- Display a loading state while content is retrieved.
- Handle JSON loading failures.
- Focus input when appropriate.
- Validate empty input.
- Submit using Enter or the primary button.
- Display text from JSON validation messages.
- Provide subtle input focus effects.
- Provide button hover and active states.

## 11.3. Invitation Page Interactions

- Smooth scrolling between sections.
- Animated section entrances.
- Interactive image gallery.
- Lightbox controls.
- External Google Maps navigation.
- Optional Add to Calendar action.
- RSVP selection and confirmation.
- Allow RSVP status changes.

## 11.4. RSVP Interaction States

| State | Expected UI |
|---|---|
| PENDING | Display both RSVP options |
| ATTENDING | Display attendance confirmation |
| NOT_ATTENDING | Display decline confirmation |

Provide a way to change an existing response.

---

# 12. Animation Specification

GSAP should enhance the experience without making the website feel overwhelming.

## 12.1. Welcome Page

- Background decorative elements appear gently.
- Main heading fades in.
- Subtitle slides up.
- Input and CTA appear with a small stagger.
- Button hover effects remain subtle.

## 12.2. Invitation Page

### Hero

- Background fades in.
- Heading and greeting reveal smoothly.
- Graduate image scales in.
- Supporting message appears with a stagger.

### Profile

- Section content reveals on scroll.
- Image and text use complementary entrance effects.

### Event Details

- Event information appears with a stagger.
- Icons and information cards use subtle transitions.

### Gallery

- Images reveal using staggered animations.
- Hover effects provide a slight scale or elevation.
- Lightbox opens and closes smoothly.

### RSVP

- RSVP cards fade and slide into view.
- Selected option receives clear visual feedback.
- Confirmation content uses a scale/fade transition.

### Closing

- Closing message fades in.
- Signature appears last.

## 12.3. Animation Performance

- Avoid unnecessary continuous animations.
- Clean up GSAP timelines and ScrollTriggers when components are destroyed.
- Avoid layout shifts during animation.
- Prefer transform and opacity animations.
- Respect reduced-motion preferences.
- Ensure animations do not interfere with Angular change detection.

---

# 13. Responsive Design

The website must support:

- Mobile phones.
- Tablets.
- Desktop screens.
- Large desktop screens.

## 13.1. Mobile

- Single-column layouts where appropriate.
- Comfortable text sizes.
- Full-width primary actions when useful.
- Touch-friendly controls.
- Responsive image sizing.
- No horizontal overflow.

## 13.2. Tablet

- Balanced two-column layouts where appropriate.
- Responsive gallery grid.
- Comfortable spacing.

## 13.3. Desktop

- Wider content containers.
- More generous spacing.
- Multi-column gallery layouts.
- Elegant visual composition.

Mobile must be treated as a first-class design target.

---

# 14. Suggested Angular Project Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── config/
│   │   │   ├── default-invitation.config.ts
│   │   │   ├── graduation-info.config.ts
│   │   │   └── guests.config.ts
│   │   ├── models/
│   │   │   ├── guest.model.ts
│   │   │   ├── invitation.model.ts
│   │   │   ├── graduation-info.model.ts
│   │   │   └── rsvp.model.ts
│   │   └── services/
│   │       ├── guest.service.ts
│   │       ├── invitation.service.ts
│   │       └── rsvp.service.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── button/
│   │   │   ├── section-heading/
│   │   │   ├── image-lightbox/
│   │   │   └── loading/
│   │   └── directives/
│   │
│   ├── features/
│   │   ├── welcome/
│   │   │   ├── components/
│   │   │   ├── models/
│   │   │   │   └── welcome-content.model.ts
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   │   └── welcome-content.service.ts
│   │   │   └── welcome.routes.ts
│   │   │
│   │   └── invitation/
│   │       ├── components/
│   │       │   ├── hero/
│   │       │   ├── graduate-profile/
│   │       │   ├── event-details/
│   │       │   ├── graduation-gallery/
│   │       │   ├── rsvp/
│   │       │   └── closing/
│   │       ├── pages/
│   │       └── invitation.routes.ts
│   │
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
│
├── assets/
│   ├── config/
│   │   └── welcome-content.json
│   ├── images/
│   │   ├── graduate/
│   │   ├── guests/
│   │   ├── gallery/
│   │   └── decorations/
│   └── fonts/
│
├── styles/
│   └── theme.css
│
└── styles.css
```

The structure is a recommended starting point and can be adjusted as the implementation evolves.

---

# 15. Component Responsibilities

| Component | Responsibility |
|---|---|
| WelcomePage | Render Welcome page and handle name input |
| InvitationPage | Resolve guest and coordinate invitation sections |
| HeroSection | Display personalized greeting and message |
| GraduateProfileSection | Display graduate information and profile content |
| EventDetailsSection | Display shared event information |
| GraduationGallerySection | Display personalized gallery |
| ImageLightbox | Display selected gallery images |
| RsvpSection | Handle RSVP interactions |
| ClosingSection | Display personalized closing content |
| SectionHeading | Reusable section title and description |
| AppButton | Reusable button with consistent styling |

### Component Design Rules

- Components should be focused and reusable.
- Components must receive data through inputs.
- Avoid hardcoding personalized content inside components.
- Welcome page components must receive text from the loaded JSON configuration.
- Invitation components must receive resolved invitation content through inputs.
- Keep guest resolution and RSVP persistence inside services.
- Keep animation logic organized and clean up animations appropriately.
- Prefer presentational components for invitation sections.

---

# 16. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Display Welcome page | High |
| FR-02 | Load Welcome page content from JSON | High |
| FR-03 | Handle Welcome JSON loading and error states | High |
| FR-04 | Accept guest name input | High |
| FR-05 | Validate empty input | High |
| FR-06 | Normalize Vietnamese names | High |
| FR-07 | Match guests using names and aliases | High |
| FR-08 | Fall back to default Guest | High |
| FR-09 | Resolve default invitation content | High |
| FR-10 | Merge guest-specific content overrides | High |
| FR-11 | Display all invitation sections | High |
| FR-12 | Support personalized gallery images | High |
| FR-13 | Display shared graduation and event information | High |
| FR-14 | Save RSVP responses in LocalStorage | High |
| FR-15 | Allow RSVP response changes | High |
| FR-16 | Display RSVP confirmation messages | High |
| FR-17 | Support responsive layouts | High |
| FR-18 | Support image lightbox | Medium |
| FR-19 | Support GSAP animations | Medium |
| FR-20 | Open Google Maps | Medium |
| FR-21 | Support Add to Calendar | Low |

---

# 17. Non-Functional Requirements

## 17.1. Performance

- Optimize image sizes.
- Use lazy loading for gallery images where appropriate.
- Avoid unnecessary Angular re-rendering.
- Keep animations performant.
- Avoid unnecessary dependencies.

## 17.2. Accessibility

- Use semantic HTML.
- Provide meaningful image alt text.
- Ensure keyboard navigation.
- Provide visible focus states.
- Use sufficient color contrast.
- Support reduced motion.
- Ensure lightbox controls are keyboard accessible.

## 17.3. Maintainability

- Use TypeScript interfaces.
- Keep configuration data separate from UI components.
- Centralize default invitation content.
- Centralize guest configuration.
- Keep Welcome page content in JSON.
- Use dedicated services for guest resolution, content loading, and RSVP.
- Avoid duplicated content and business logic.

## 17.4. Reliability

- Handle invalid guest IDs.
- Handle missing guest images.
- Handle missing optional content.
- Handle invalid LocalStorage data.
- Handle JSON loading failures.
- Prevent broken layouts when a custom field is omitted.

---

# 18. Scope and Constraints

## 18.1. Included in MVP

- Welcome page.
- Welcome page JSON content configuration.
- Guest name lookup.
- Default Guest fallback.
- Personalized invitation content.
- Default content inheritance.
- Guest-specific content overrides.
- Shared graduation and event information.
- Personalized image support.
- Gallery and lightbox.
- RSVP interaction.
- LocalStorage persistence.
- GSAP animations.
- Font Awesome icons.
- Responsive design.

## 18.2. Out of Scope

The following features are not included in the initial version:

- Backend API.
- Database.
- User authentication.
- Admin dashboard.
- Online guest management.
- Centralized RSVP collection.
- Email or SMS notifications.
- Real-time RSVP synchronization.
- Cloud image upload.
- Public guest registration.

These features can be considered for a future version.

---

# 19. Implementation Roadmap

## Phase 1 – Project Setup

- Initialize Angular application.
- Configure TypeScript and Tailwind CSS.
- Install and configure GSAP.
- Install and configure Font Awesome.
- Configure Angular Router.
- Configure HttpClient.
- Set up global theme and design tokens.
- Create initial folder structure.

## Phase 2 – Content and Data Architecture

- Define TypeScript interfaces.
- Create `welcome-content.json`.
- Create `WelcomeContentService`.
- Implement Welcome JSON loading and error handling.
- Create graduation information configuration.
- Create default invitation configuration.
- Create guest configuration.
- Implement GuestService.
- Implement guest name normalization.
- Implement deep merge logic.
- Implement image fallback logic.

## Phase 3 – Welcome Page

- Build Welcome page layout.
- Load all text from JSON.
- Implement name input.
- Implement form validation.
- Implement guest lookup.
- Implement navigation to Invitation page.
- Add entrance animations.
- Verify JSON content can be modified without changing components.

## Phase 4 – Invitation Page

- Build Invitation page.
- Implement Hero section.
- Implement Graduate Profile section.
- Implement Event Details section.
- Implement Graduation Gallery section.
- Implement RSVP section.
- Implement Closing section.
- Connect sections to resolved invitation content.

## Phase 5 – RSVP and Interactions

- Implement RsvpService.
- Integrate LocalStorage.
- Implement RSVP states.
- Implement confirmation messages.
- Allow response changes.
- Handle missing and invalid stored data.

## Phase 6 – Animation and Visual Polish

- Add GSAP entrance animations.
- Add scroll-triggered animations.
- Add gallery transitions.
- Add RSVP feedback animations.
- Add hover and focus states.
- Verify reduced-motion behavior.

## Phase 7 – Testing and Finalization

- Test Welcome JSON loading.
- Test Welcome JSON error handling.
- Test guest name matching.
- Test aliases.
- Test default Guest fallback.
- Test partial guest overrides.
- Test nested content merging.
- Test empty gallery overrides.
- Test image fallback.
- Test RSVP persistence.
- Test direct invitation URLs.
- Test responsive layouts.
- Test accessibility and performance.

---

# 20. Acceptance Criteria

The MVP is considered complete when:

1. A visitor can open the Welcome page.
2. Welcome page text is loaded from `welcome-content.json`.
3. Changing the JSON content changes the displayed Welcome page text without modifying Angular components.
4. The Welcome page handles JSON loading failures gracefully.
5. A visitor can enter a name and submit the form.
6. The application can find a guest by name or alias.
7. An unknown name resolves to the default Guest.
8. Each configured guest can have a different invitation experience.
9. A guest can override only selected content fields.
10. All omitted fields correctly inherit default content.
11. Shared graduation and event information is displayed consistently.
12. Every guest has a valid image fallback.
13. The Invitation page displays all configured sections.
14. Gallery images can be opened in a lightbox.
15. Guests can submit an RSVP response.
16. Guests can change their RSVP response.
17. RSVP data persists in the current browser.
18. The interface works on mobile, tablet, and desktop.
19. Animations work without disrupting usability.
20. Reduced-motion preferences are respected.
21. The application works without a backend.

---

# 21. Final Development Guidelines

- Build the application with modern Angular (2+), not AngularJS.
- Use TypeScript throughout the project.
- Use Tailwind CSS for styling.
- Use GSAP for carefully controlled animations.
- Use Font Awesome as the single icon system.
- Keep all website-facing content in Vietnamese.
- Keep code, identifiers, and technical documentation in English.
- Store all Welcome page text content in `welcome-content.json`.
- Do not hardcode Welcome page text in Angular templates or components.
- Treat the default invitation as the source of truth for fallback content.
- Treat guest-specific invitation content as partial overrides.
- Keep shared graduation and event facts separate from personalized prose.
- Do not hardcode invitation copy inside individual UI components.
- Ensure all invitation sections are data-driven.
- Prioritize responsive design, accessibility, and maintainability.
- Do not introduce backend dependencies in the MVP.

## Final Product Vision

A beautiful, responsive, and personalized digital graduation invitation where every guest receives an experience that feels thoughtfully prepared for them.

The graduate should be able to customize the Welcome page by editing a single JSON file and personalize individual invitations through simple guest configuration files, without having to modify the underlying Angular components or application logic.
