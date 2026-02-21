import { Problem } from '../models/problem.model';

export const PROBLEMS: Problem[] = [
  {
    id: 'todo-list',
    title: 'Todo List Component',
    description: `# Todo List Component

## Objective
Create a **TodoListComponent** that allows users to add and remove todo items.

## Requirements

1. Display an input field and an "Add" button
2. When the user types a todo and clicks "Add", it should appear in the list below
3. Each todo item should have a "Remove" button that deletes it from the list
4. The input field should clear after adding a todo
5. Empty todos should not be added (ignore empty/whitespace-only input)

## Component Selector
\`app-todo-list\`

## Expected Behavior
- Component should use Angular signals for state management
- The template should use \`@for\` for rendering the list
- Use the \`AppComponent\` to render \`<app-todo-list>\`

## Example
\`\`\`
[_______________] [Add]

- Buy groceries  [Remove]
- Walk the dog   [Remove]
- Read a book    [Remove]
\`\`\`
`,
    starterFiles: [
      {
        path: 'src/app/app.component.ts',
        content: `import { Component } from '@angular/core';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoListComponent],
  template: \`
    <div style="max-width: 600px; margin: 20px auto;">
      <h1>My Todo App</h1>
      <app-todo-list />
    </div>
  \`,
})
export class AppComponent {}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/todo-list/todo-list.component.ts',
        content: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  template: \`
    <!-- TODO: Implement the todo list template -->
    <p>Implement the todo list here!</p>
  \`,
})
export class TodoListComponent {
  // TODO: Implement todo list logic using signals
}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
    ],
    testFiles: [
      {
        path: 'test-specs.json',
        content: '',
        language: 'json',
        readOnly: true,
        dirty: false,
      },
    ],
    maxScore: 100,
    timeLimit: 1800,
  },
  {
    id: 'counter-service',
    title: 'Counter with Service',
    description: `# Counter with Service

## Objective
Create a **CounterService** and **CounterComponent** that manages a simple counter.

## Requirements

1. Create a \`CounterService\` with:
   - A \`count\` signal initialized to \`0\`
   - An \`increment()\` method
   - A \`decrement()\` method
   - A \`reset()\` method
   - A \`doubleCount\` computed signal that returns \`count * 2\`

2. Create a \`CounterComponent\` that:
   - Displays the current count
   - Displays the double count
   - Has Increment, Decrement, and Reset buttons
   - Uses the \`CounterService\` via dependency injection

## Component Selector
\`app-counter\`

## Example
\`\`\`
Count: 5
Double: 10

[Increment] [Decrement] [Reset]
\`\`\`
`,
    starterFiles: [
      {
        path: 'src/app/app.component.ts',
        content: `import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CounterComponent],
  template: \`
    <div style="max-width: 400px; margin: 20px auto; text-align: center;">
      <h1>Counter App</h1>
      <app-counter />
    </div>
  \`,
})
export class AppComponent {}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/counter/counter.service.ts',
        content: `import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  // TODO: Implement counter service with signals
}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/counter/counter.component.ts',
        content: `import { Component, inject } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <!-- TODO: Implement the counter template -->
    <p>Implement the counter here!</p>
  \`,
})
export class CounterComponent {
  // TODO: Inject CounterService and wire up the template
}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
    ],
    testFiles: [
      {
        path: 'test-specs.json',
        content: '',
        language: 'json',
        readOnly: true,
        dirty: false,
      },
    ],
    maxScore: 100,
    timeLimit: 1200,
  },
  {
    id: 'user-card',
    title: 'User Card Component',
    description: `# User Card Component

## Objective
Create a **UserCardComponent** that displays user information using Angular's input signals.

## Requirements

1. Create a \`User\` interface with: \`name\` (string), \`email\` (string), \`role\` (string), \`active\` (boolean)

2. Create a \`UserCardComponent\` that:
   - Accepts a \`user\` input (required)
   - Displays the user's name, email, and role
   - Shows "Active" or "Inactive" badge based on the \`active\` property
   - Has a "Toggle Status" button that emits an event to parent

3. The \`AppComponent\` should:
   - Maintain a list of users using a signal
   - Render a \`UserCardComponent\` for each user
   - Handle the toggle event to flip the user's active status

## Component Selector
\`app-user-card\`

## Example
\`\`\`
┌──────────────────────┐
│ John Doe      Active │
│ john@example.com     │
│ Role: Admin          │
│ [Toggle Status]      │
└──────────────────────┘
\`\`\`
`,
    starterFiles: [
      {
        path: 'src/app/app.component.ts',
        content: `import { Component, signal } from '@angular/core';

// TODO: Import UserCardComponent and define the User interface

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: \`
    <div style="max-width: 600px; margin: 20px auto;">
      <h1>User Directory</h1>
      <!-- TODO: Render user cards -->
    </div>
  \`,
})
export class AppComponent {
  users = signal([
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', active: true },
    { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', active: false },
    { name: 'Carol White', email: 'carol@example.com', role: 'Viewer', active: true },
  ]);

  // TODO: Implement toggleStatus method
}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/user-card/user-card.component.ts',
        content: `import { Component, input, output } from '@angular/core';

// TODO: Define User interface

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: \`
    <!-- TODO: Implement user card template -->
    <p>Implement the user card here!</p>
  \`,
})
export class UserCardComponent {
  // TODO: Add input for user and output for toggle event
}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
    ],
    testFiles: [
      {
        path: 'test-specs.json',
        content: '',
        language: 'json',
        readOnly: true,
        dirty: false,
      },
    ],
    maxScore: 100,
    timeLimit: 1500,
  },
];

// Test specs for each problem — these get mounted as test-specs.json in the WebContainer
export const PROBLEM_TEST_SPECS: Record<string, object[]> = {
  'todo-list': [
    {
      name: 'todo-list.spec',
      content: `
describe('TodoListComponent', function() {
  it('should have an addTodo method or similar', function() {
    // We test the source code content since we can't run Angular TestBed in Node
    const fs = require('fs');
    const source = fs.readFileSync('src/app/todo-list/todo-list.component.ts', 'utf-8');
    expect(source).toContain('signal');
  });

  it('should use @for in the template', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/todo-list/todo-list.component.ts', 'utf-8');
    expect(source).toContain('@for');
  });

  it('should have an input field in template', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/todo-list/todo-list.component.ts', 'utf-8');
    expect(source).toContain('input');
  });

  it('should have add functionality', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/todo-list/todo-list.component.ts', 'utf-8');
    const hasAdd = source.includes('add') || source.includes('push') || source.includes('update');
    expect(hasAdd).toBeTruthy();
  });

  it('should have remove functionality', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/todo-list/todo-list.component.ts', 'utf-8');
    const hasRemove = source.includes('remove') || source.includes('filter') || source.includes('splice');
    expect(hasRemove).toBeTruthy();
  });
});
`,
    },
  ],
  'counter-service': [
    {
      name: 'counter.spec',
      content: `
describe('CounterService', function() {
  it('should have a count signal', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/counter/counter.service.ts', 'utf-8');
    expect(source).toContain('signal');
    expect(source).toContain('count');
  });

  it('should have increment method', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/counter/counter.service.ts', 'utf-8');
    expect(source).toContain('increment');
  });

  it('should have decrement method', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/counter/counter.service.ts', 'utf-8');
    expect(source).toContain('decrement');
  });

  it('should have reset method', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/counter/counter.service.ts', 'utf-8');
    expect(source).toContain('reset');
  });

  it('should have doubleCount computed signal', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/counter/counter.service.ts', 'utf-8');
    expect(source).toContain('computed');
    expect(source).toContain('doubleCount');
  });
});

describe('CounterComponent', function() {
  it('should inject CounterService', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/counter/counter.component.ts', 'utf-8');
    expect(source).toContain('inject');
    expect(source).toContain('CounterService');
  });

  it('should display count in template', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/counter/counter.component.ts', 'utf-8');
    expect(source).toContain('count');
  });

  it('should have increment button', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/counter/counter.component.ts', 'utf-8');
    const hasButton = source.includes('Increment') || source.includes('increment');
    expect(hasButton).toBeTruthy();
  });
});
`,
    },
  ],
  'user-card': [
    {
      name: 'user-card.spec',
      content: `
describe('UserCardComponent', function() {
  it('should use input signal for user', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/user-card/user-card.component.ts', 'utf-8');
    expect(source).toContain('input');
  });

  it('should use output for toggle event', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/user-card/user-card.component.ts', 'utf-8');
    expect(source).toContain('output');
  });

  it('should display user name in template', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/user-card/user-card.component.ts', 'utf-8');
    expect(source).toContain('name');
  });

  it('should show active/inactive status', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/user-card/user-card.component.ts', 'utf-8');
    const hasStatus = source.includes('Active') || source.includes('active') || source.includes('Inactive');
    expect(hasStatus).toBeTruthy();
  });

  it('should have toggle button', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/user-card/user-card.component.ts', 'utf-8');
    const hasToggle = source.includes('Toggle') || source.includes('toggle');
    expect(hasToggle).toBeTruthy();
  });
});

describe('AppComponent', function() {
  it('should import UserCardComponent', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/app.component.ts', 'utf-8');
    expect(source).toContain('UserCardComponent');
  });

  it('should use @for to render cards', function() {
    const fs = require('fs');
    const source = fs.readFileSync('src/app/app.component.ts', 'utf-8');
    expect(source).toContain('@for');
  });
});
`,
    },
  ],
};
