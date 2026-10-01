# Anti-AI Design Guidelines

Rules for catching and rejecting patterns that AI code generation routinely introduces. Read before accepting any generated diff.

---

## The core problem

AI assistants optimise for looking correct, not being correct. They produce code that compiles, passes obvious checks, and reads plausibly — but routinely introduces abstractions that serve no purpose, comments that restate the obvious, and patterns borrowed from tutorials rather than this codebase's actual needs.

These rules exist so that generated code gets evaluated against *this* project's standards, not generic Angular templates.

---

## Naming

### No generic placeholder names
AI fills gaps with names that mean nothing in context.

```ts
// reject
const data = await this.service.getData();
const result = this.process(input);
const temp = user.name;

// require
const invoices = await this.invoiceService.fetchByUser(userId);
const filtered = this.filterByStatus(rawInvoices);
const displayName = user.fullName;
```

### No `Manager`, `Handler`, `Helper`, `Util`, `Service2`
These names signal that the author did not understand the domain. Push back until a real noun or verb can be found.

---

## Comments

### No comments that restate the code

```ts
// bad — AI loves this pattern
// Get the user by ID
const user = await this.userService.getById(id);

// bad — AI adds this to every method
/**
 * This method handles the login process for the user.
 * It takes an email and password and returns an Observable.
 */
login(email: string, password: string): Observable<AuthResult> { … }
```

The only acceptable comment is one that explains *why* something non-obvious must be done — a hidden constraint, a known bug workaround, or a domain rule that isn't obvious from the identifiers alone.

---

## Abstractions

### The rule of three
Do not introduce a shared abstraction unless the pattern appears in at least three separate call sites. AI creates helpers after seeing two.

```ts
// reject if called once
function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

// acceptable: inline it until three places need it
`${user.firstName} ${user.lastName}`
```

### No wrapper services around single methods

```ts
// reject — wraps one HttpClient call for no reason
@Injectable({ providedIn: 'root' })
export class ApiWrapperService {
  private http = inject(HttpClient);
  fetch<T>(url: string) { return this.http.get<T>(url); }
}
```

Call `HttpClient` from a domain service directly.

### No interfaces for a single implementation
If there is one `UserService` and it will never be swapped, do not create `IUserService`. The interface adds indirection with no payoff.

---

## Error handling

### No silent catch blocks

```ts
// reject — AI adds these everywhere
try {
  await this.save();
} catch (e) {
  console.error(e); // swallowed
}
```

Handle errors at system boundaries (HTTP interceptors, global error handlers). Inside a feature, let errors propagate or surface them to the user explicitly.

### No fallback values for impossible states
Do not add `?? 'Unknown'` or `|| []` to data that the API contract guarantees will always exist. It hides bugs.

---

## Over-engineering

### No base classes for unshared logic
AI frequently extracts a `BaseComponent` or `BaseService` after writing two components. Reject unless there is proven, non-trivial shared logic that cannot live in a service or utility function.

### No barrel `index.ts` files unless the folder is a published library
They make refactoring harder, not easier, in an application codebase.

### No `environment.ts` indirection for values that never change
Hard-code API base URLs in a single `app.config.ts` constant. Do not create two environment files and a lookup function for a value that is always the same.

---

## Typing

### No `any` even when "it's just temporary"
AI uses `any` to make TypeScript stop complaining. It stays. Use `unknown` and add a type guard, or create the interface.

### No overly-wide union types to handle "just in case" inputs

```ts
// reject — handles a case that never occurs
function render(value: string | number | null | undefined) { … }

// require — handle only what the real callers pass
function render(value: string) { … }
```

---

## Component patterns

### No `ngOnInit` for work that can happen at field initialisation
AI defaults to `ngOnInit` because it's familiar. Use field initialisation with `inject()` and signals instead.

```ts
// reject
ngOnInit() {
  this.user = this.userService.getCurrent();
}

// prefer
user = toSignal(inject(UserService).getCurrent$());
```

### No `*ngIf` / `*ngFor` when control flow syntax exists
Use `@if` / `@for` / `@switch` (Angular 17+ control flow, available in v22).

```html
<!-- reject -->
<div *ngIf="user">…</div>
<li *ngFor="let item of items">…</li>

<!-- require -->
@if (user()) { <div>…</div> }
@for (item of items(); track item.id) { <li>…</li> }
```

### No inline styles in templates
All styling belongs in the component's `.scss` file or a global utility class. AI adds `style="margin-top: 8px"` when it doesn't know the design system.

---

## Review checklist for AI-generated diffs

Before merging any AI-assisted change, confirm:

- [ ] No `any` or unexplained `unknown`
- [ ] No comments that restate variable names or method signatures
- [ ] No new abstractions that appear fewer than three times
- [ ] No silent error swallowing
- [ ] No `NgModule`, constructor injection, or `*ngIf` / `*ngFor`
- [ ] Signals used for state, not BehaviorSubject
- [ ] Names are domain-specific, not generic (`data`, `result`, `temp`)
- [ ] No new files created that duplicate existing patterns
- [ ] Change detection is `OnPush` on any new component
- [ ] Tests test observable behavior, not implementation details
