# Angular Best Practices — Zaki Portal

Angular 22 · TypeScript 6 · Vitest

---

## Components

### Standalone only
All components, directives, and pipes are standalone. Never use `NgModule`.

```ts
@Component({
  selector: 'app-user-card',
  standalone: true,          // always explicit
  imports: [CommonModule],   // only what this component uses
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {}
```

### Change detection
Default to `OnPush` on every component. Only drop to `Default` if you have a concrete reason.

### Host bindings
Prefer `host` in the decorator over `@HostBinding` / `@HostListener`.

```ts
@Component({
  host: { class: 'block w-full', '(click)': 'onClick()' },
})
```

---

## Signals (state management)

Use signals everywhere state exists. Do not introduce RxJS BehaviorSubject, Subject, or ReplaySubject for local component state.

```ts
// good
count = signal(0);
doubled = computed(() => this.count() * 2);

// bad — BehaviorSubject for local state
count$ = new BehaviorSubject(0);
```

Use `effect()` only when you need a side effect tied to a signal change. Keep effects small and free of business logic.

RxJS is still valid for HTTP and event streams — use `toSignal()` to bridge into the signal graph.

---

## Dependency injection

Use `inject()` at the field level. No constructor injection.

```ts
// good
export class UserService {
  private http = inject(HttpClient);
}

// bad
constructor(private http: HttpClient) {}
```

Provide services at the appropriate level:
- `providedIn: 'root'` — singleton across the app
- `providers: [...]` on a component — scoped to that subtree
- Never use `providedIn: 'any'`

---

## Routing

Use `loadComponent` for lazy-loaded routes. Group related routes in a `routes` const next to the feature folder.

```ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
  },
];
```

Route guards are plain functions, not classes:

```ts
export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).isAuthenticated();
};
```

---

## HTTP

Use `HttpClient` via `inject()`. Keep HTTP calls in services, never in components.

For typed responses, always pass the generic:

```ts
getUser(id: string) {
  return this.http.get<User>(`/api/users/${id}`);
}
```

Use `httpResource` (Angular 22+) for declarative data fetching in components when the request depends on signals.

---

## Forms

Use `ReactiveFormsModule` for any form with validation or dynamic fields. Template-driven forms are only acceptable for trivially simple, read-only-style forms.

```ts
form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  name:  new FormControl('', Validators.required),
});
```

---

## Naming

| Thing | Convention | Example |
|---|---|---|
| Component class | PascalCase + `Component` suffix | `UserCardComponent` |
| Component file | kebab-case | `user-card.ts` |
| Signal | camelCase noun | `selectedUser` |
| Computed | camelCase noun | `userLabel` |
| Effect | `effect(() => ...)` inline, no variable unless you need cleanup |  |
| Service | PascalCase + `Service` suffix | `UserService` |
| Route guard | camelCase + `Guard` suffix | `authGuard` |
| Store/feature state | PascalCase + `Store` suffix | `CartStore` |

---

## File structure

```
src/
  app/
    core/           # singleton services, guards, interceptors
    features/
      <feature>/    # one folder per route/feature
        components/ # dumb components used only in this feature
        <feature>.ts
        <feature>.html
        <feature>.scss
        <feature>.routes.ts
    shared/
      components/   # reusable presentational components
      pipes/
      directives/
    app.ts
    app.routes.ts
    app.config.ts
```

---

## TypeScript

- `strict: true` — always.
- No `any`. Use `unknown` and narrow, or create an interface.
- Prefer `interface` over `type` for object shapes.
- Prefer `const` over `let`. Never use `var`.
- Short-circuit with early returns; avoid deep nesting.

---

## SCSS

- Use CSS custom properties for theming, not SCSS variables.
- Component styles are scoped by default — do not use `::ng-deep` except as a last resort for third-party widgets.
- Keep `styles.scss` for global resets and custom property definitions only.

---

## Testing (Vitest)

Unit-test services and pure functions. For components, test behavior via the DOM, not internal state.

```ts
it('increments count on click', async () => {
  const { getByRole } = render(CounterComponent);
  await userEvent.click(getByRole('button'));
  expect(getByRole('status')).toHaveTextContent('1');
});
```

Do not test implementation details (private methods, signal values directly). Test what the user sees.

---

## What to avoid

| Pattern | Why |
|---|---|
| `NgModule` | Replaced by standalone in Angular 15+; dead weight in v22 |
| `ngOnInit` for DI | Use `inject()` at field level instead |
| Constructor injection | Verbose, harder to tree-shake |
| `async` pipe in templates | Prefer `toSignal()` — cleaner, no subscription leak risk |
| `EventEmitter` for non-output events | Use a service or signal |
| Deeply nested subscriptions | Flatten with `switchMap` / `combineLatest` |
| `document.querySelector` in a component | Use `viewChild` / `ElementRef` via DI |
