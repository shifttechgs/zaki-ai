# Design Spec — AI Chat Page

Reference: https://angular-material.fusetheme.com/admin/ai-chat

---

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  App Shell Header (full width)                                   │
├──────────────────┬──────────────────────────────────────────────┤
│                  │  Chat Header (new chat button, title)         │
│  Conversation    ├──────────────────────────────────────────────┤
│  Sidebar         │                                               │
│  ~280px          │  Message / Welcome Area (scrollable)          │
│                  │                                               │
│  ─────────────   │                                               │
│  [+ New Chat]    │                                               │
│  ─────────────   │                                               │
│  Today           ├──────────────────────────────────────────────┤
│    Chat item     │  Input Bar (sticky bottom)                    │
│    Chat item     │                                               │
│  Yesterday       │                                               │
│    Chat item     │                                               │
│  Previous 7d     │                                               │
│    Chat item     │                                               │
└──────────────────┴──────────────────────────────────────────────┘
```

**Breakpoints:**
- `≥ 1280px` — sidebar pinned open, main area fills remainder
- `960–1279px` — sidebar collapses to icon rail; overlay on demand
- `< 960px` — sidebar hidden; hamburger toggle opens as full overlay

---

## Conversation Sidebar

### Container
- Width: `280px` fixed
- Background: `white` (light) / `#1E293B` (dark)
- Right border: `1px solid` `rgba(0,0,0,0.08)`
- Overflow: `hidden` on container, `overflow-y: auto` on list

### New Chat Button
- Full-width, inside sidebar top
- Style: outlined button with `mat-stroked-button`
- Icon: `add` (Material Icons) left of label "New chat"
- Height: `44px`
- Margin: `16px` all sides
- Border radius: `8px`
- On hover: background tint of primary colour at 8% opacity

### Section Headers (Today / Yesterday / Previous 7 days)
- Font: `11px` / `500` weight
- Color: `text-secondary` (muted)
- Text transform: `uppercase`
- Letter spacing: `0.05em`
- Padding: `16px 16px 4px`
- No background — sits directly on sidebar

### Conversation List Item
- Height: `min 48px`, grows with text
- Padding: `10px 12px 10px 16px`
- Border radius: `8px`
- Margin: `2px 8px`
- Layout: single line truncated title + optional timestamp or action icon

**States:**
| State | Background | Text |
|---|---|---|
| Default | transparent | `text-primary` |
| Hover | `rgba(0,0,0,0.04)` | `text-primary` |
| Active / selected | `primary-50` or accent tint | `primary-700` |
| Focus-visible | outline ring `2px` offset `2px` |  |

- On hover: show a `more_vert` icon (three-dot) right-aligned, opacity transition `0 → 1`
- Title truncated with `text-overflow: ellipsis`
- No delete/rename inline — behind the three-dot menu

---

## Chat Main Area

### Chat Header
- Height: `64px`
- Padding: `0 24px`
- Border-bottom: `1px solid rgba(0,0,0,0.08)`
- Content: page title ("AI Chat") left, action buttons right (model selector badge, optional settings icon)

### Welcome / Empty State
Shown when no conversation is selected or a new chat is started.

**Layout:** vertically and horizontally centred in the scrollable area

**Elements (top → bottom):**
1. App logo or AI icon — `48px`, neutral fill
2. Heading — `"How can I help you today?"` — `24px` / `700`
3. Sub-text — `"Pick a suggestion below or start typing"` — `14px`, muted
4. **Suggestion cards grid** — `2 × 2` grid on desktop, `1 col` on mobile

#### Suggestion Cards
- Width: `calc(50% - 8px)` in a two-column flex row, max `260px` each
- Background: `white` (light) / `#1E2A3A` (dark)
- Border: `1px solid rgba(0,0,0,0.10)`
- Border radius: `12px`
- Padding: `20px`
- Box shadow: `0 1px 3px rgba(0,0,0,0.06)`
- On hover: `box-shadow` elevates to `0 4px 12px rgba(0,0,0,0.10)`, `translateY(-1px)`
- Cursor: `pointer`

**Card internals:**
- Title: `14px` / `600`, `text-primary`
- Description: `13px` / `400`, `text-secondary`, 2-line clamp
- Gap between title and description: `6px`
- Optional leading icon: `20px` Material icon, primary colour, `margin-bottom: 12px`

### Message Bubbles (active conversation)

**User message:**
- Alignment: `flex-end` (right side)
- Background: `primary` colour (e.g. indigo `#6366F1`) or `#E0E7FF`
- Text colour: white (on dark bg) or `#1E1B4B` (on light bg)
- Border radius: `18px 18px 4px 18px`
- Max width: `70%`
- Padding: `12px 16px`
- Margin-bottom: `8px`

**AI message:**
- Alignment: `flex-start` (left side)
- Background: `#F1F5F9` (light) / `#334155` (dark)
- Text colour: `text-primary`
- Border radius: `18px 18px 18px 4px`
- Max width: `70%`
- Padding: `12px 16px`
- Margin-bottom: `8px`
- Precede with AI avatar: `32px` circle, AI icon or model logo, `margin-right: 8px`

**Timestamp:**
- Below each message, `11px`, muted, `margin-top: 4px`
- Hidden until hover on the message group (opacity transition)

---

## Input Bar

### Container
- Position: sticky bottom of the chat panel
- Background: matches page background with `backdrop-filter: blur(8px)` if over messages
- Border-top: `1px solid rgba(0,0,0,0.08)`
- Padding: `16px 24px 20px`

### Input Field
- Full-width textarea, auto-grows from 1 line to max `5` lines
- Background: `white` or `#F8FAFC`
- Border: `1px solid rgba(0,0,0,0.15)`
- Border radius: `12px`
- Padding: `12px 52px 12px 16px` (right padding reserves space for send button)
- Font: `14px` / `400`
- Placeholder colour: `text-disabled`
- On focus: border colour shifts to `primary`, `box-shadow: 0 0 0 3px primary-100`
- Resize: `none`

### Send Button
- Position: absolute, inside input, right `8px`, vertically centred
- Style: `mat-icon-button` with `send` icon
- Size: `36px`
- Colour: `primary` when input has content; `text-disabled` when empty
- Transition: colour + opacity `150ms ease`

### Below Input
- Two items in a single row, centred:
  1. **Model pill** — small outlined chip: `"Nova 4.5"` with a model icon — `font-size: 11px`, `border-radius: 999px`, `padding: 2px 10px`
  2. **Disclaimer** — `"AI can make mistakes. Check important info."` — `11px`, muted, italic
- Gap between them: `12px`

---

## Color Tokens

| Token | Light value | Dark value |
|---|---|---|
| `bg-surface` | `#FFFFFF` | `#1E293B` |
| `bg-page` | `#F1F5F9` | `#0F172A` |
| `text-primary` | `#0F172A` | `#F1F5F9` |
| `text-secondary` | `#64748B` | `#94A3B8` |
| `text-disabled` | `#CBD5E1` | `#475569` |
| `border` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` |
| `primary` | `#6366F1` (indigo) | `#818CF8` |
| `primary-50` | `#EEF2FF` | `#1E1B4B` |

---

## Typography

| Role | Size | Weight | Line height |
|---|---|---|---|
| Welcome heading | `24px` | `700` | `1.3` |
| Body / messages | `14px` | `400` | `1.6` |
| Card title | `14px` | `600` | `1.4` |
| Card description | `13px` | `400` | `1.5` |
| Section label | `11px` | `500` | `1` |
| Meta / timestamp | `11px` | `400` | `1` |

Font family: system default via Angular Material (`Roboto, sans-serif` or configured theme font).

---

## Spacing Scale

Uses an `8px` base grid.

| Step | Value |
|---|---|
| `xs` | `4px` |
| `sm` | `8px` |
| `md` | `16px` |
| `lg` | `24px` |
| `xl` | `32px` |

---

## Icons (Material Icons)

| Location | Icon name |
|---|---|
| New chat button | `add` |
| Conversation item overflow | `more_vert` |
| Send button | `send` |
| Empty state | `auto_awesome` or `chat` |
| Model selector | `smart_toy` or `bolt` |
| Delete conversation | `delete_outline` |
| Rename conversation | `edit` |

---

## Angular Component Map

```
AiChatComponent (page shell)
├── AiChatSidebarComponent
│   ├── NewChatButtonComponent (or inline mat-stroked-button)
│   └── ConversationListComponent
│       └── ConversationItemComponent (×n)
└── AiChatMainComponent
    ├── AiChatHeaderComponent
    ├── AiChatWelcomeComponent          ← shown when no messages
    │   └── SuggestionCardComponent (×4)
    ├── AiChatMessagesComponent         ← shown during conversation
    │   └── ChatMessageComponent (×n)
    └── AiChatInputComponent
```

---

## Accessibility

- Sidebar toggle button: `aria-label="Toggle conversation sidebar"`, `aria-expanded`
- Conversation list: `role="list"`, items are `role="listitem"` with `<button>` inside
- Messages region: `role="log"`, `aria-live="polite"`, `aria-label="Conversation"`
- Send button: `aria-label="Send message"`, `disabled` when input empty
- Suggestion cards: `<button>` elements, not `<div>` — keyboard focusable
- Input: `aria-label="Message input"`, `aria-multiline="true"`

---

## Animation

| Trigger | Animation |
|---|---|
| New message appears | `fadeInUp` — `translateY(8px) → 0`, `opacity 0 → 1`, `200ms ease-out` |
| Sidebar open/close | `width` transition `300ms cubic-bezier(0.4, 0, 0.2, 1)` |
| Suggestion card hover | `translateY(-1px)` + shadow elevation, `150ms ease` |
| Send button enable | colour + opacity, `150ms ease` |
| Conversation item hover | background colour, `100ms ease` |

---

## What to avoid (Anti-AI notes)

- Do not use `*ngFor` — use `@for` with `track conversation.id`
- Do not bind styles inline — use CSS custom properties and component classes
- Do not manage scroll position with `setTimeout` — use `afterNextRender()` or `ViewChild` with `scrollIntoView`
- Do not create a `ChatService2` — keep one `AiChatService` with clear method names
- Do not use `BehaviorSubject` for message list — use a `signal<Message[]>`
- Sidebar open state is a `signal<boolean>`, not a Subject
