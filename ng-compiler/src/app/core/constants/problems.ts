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
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/app.component.html',
        content: `<div class="container">
  <h1>My Todo App</h1>
  <app-todo-list />
</div>
`,
        language: 'html',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/app.component.css',
        content: `.container {
  max-width: 600px;
  margin: 20px auto;
}
`,
        language: 'css',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/todo-list/todo-list.component.ts',
        content: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent {
  // TODO: Implement todo list logic using signals
  // Hints:
  //   - Use signal<string[]>([]) for the todos list
  //   - Create addTodo() and removeTodo(index) methods
}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/todo-list/todo-list.component.html',
        content: `<!-- TODO: Implement the todo list template -->
<!-- Hints:
  - Add an <input> for typing new todos
  - Add a button to add the todo
  - Use @for to loop through todos and display each with a Remove button
-->
<p>Implement the todo list here!</p>
`,
        language: 'html',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/todo-list/todo-list.component.css',
        content: `/* TODO: Style the todo list */
`,
        language: 'css',
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
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/app.component.html',
        content: `<div class="container">
  <h1>Counter App</h1>
  <app-counter />
</div>
`,
        language: 'html',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/app.component.css',
        content: `.container {
  max-width: 400px;
  margin: 20px auto;
  text-align: center;
}
`,
        language: 'css',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/counter/counter.service.ts',
        content: `import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  // TODO: Implement counter service with signals
  // Requirements:
  //   - count: a writable signal initialized to 0
  //   - doubleCount: a computed signal that returns count * 2
  //   - increment(): increases count by 1
  //   - decrement(): decreases count by 1
  //   - reset(): sets count back to 0
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
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
})
export class CounterComponent {
  // TODO: Inject CounterService and wire up the template
}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/counter/counter.component.html',
        content: `<!-- TODO: Implement the counter template -->
<!-- Display count, doubleCount, and add Increment/Decrement/Reset buttons -->
<p>Implement the counter here!</p>
`,
        language: 'html',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/counter/counter.component.css',
        content: `/* TODO: Style the counter component */
`,
        language: 'css',
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
+------------------------+
| John Doe        Active |
| john@example.com       |
| Role: Admin            |
| [Toggle Status]        |
+------------------------+
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
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
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
        path: 'src/app/app.component.html',
        content: `<div class="container">
  <h1>User Directory</h1>
  <!-- TODO: Use @for to render a <app-user-card> for each user -->
</div>
`,
        language: 'html',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/app.component.css',
        content: `.container {
  max-width: 600px;
  margin: 20px auto;
}
`,
        language: 'css',
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
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  // TODO: Add input for user and output for toggle event
}
`,
        language: 'typescript',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/user-card/user-card.component.html',
        content: `<!-- TODO: Implement user card template -->
<!-- Display name, email, role, active/inactive badge, and toggle button -->
<p>Implement the user card here!</p>
`,
        language: 'html',
        readOnly: false,
        dirty: false,
      },
      {
        path: 'src/app/user-card/user-card.component.css',
        content: `/* TODO: Style the user card */
`,
        language: 'css',
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
  it('should use signals for state', function() {
    var fs = require('fs');
    var source = fs.readFileSync('src/app/todo-list/todo-list.component.ts', 'utf-8');
    expect(source).toContain('signal');
  });

  it('should use @for in the template', function() {
    var fs = require('fs');
    var template = fs.readFileSync('src/app/todo-list/todo-list.component.html', 'utf-8');
    expect(template).toContain('@for');
  });

  it('should have an input field in template', function() {
    var fs = require('fs');
    var template = fs.readFileSync('src/app/todo-list/todo-list.component.html', 'utf-8');
    expect(template).toContain('input');
  });

  it('should have add functionality', function() {
    var fs = require('fs');
    var source = fs.readFileSync('src/app/todo-list/todo-list.component.ts', 'utf-8');
    var hasAdd = source.includes('add') || source.includes('push') || source.includes('update');
    expect(hasAdd).toBeTruthy();
  });

  it('should have remove functionality', function() {
    var fs = require('fs');
    var source = fs.readFileSync('src/app/todo-list/todo-list.component.ts', 'utf-8');
    var template = fs.readFileSync('src/app/todo-list/todo-list.component.html', 'utf-8');
    var hasRemove = source.includes('remove') || source.includes('filter') || source.includes('splice')
                 || template.includes('remove') || template.includes('Remove');
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
    var fs = require('fs');
    var source = fs.readFileSync('src/app/counter/counter.service.ts', 'utf-8');
    expect(source).toContain('signal');
    expect(source).toContain('count');
  });

  it('should have increment method', function() {
    var fs = require('fs');
    var source = fs.readFileSync('src/app/counter/counter.service.ts', 'utf-8');
    expect(source).toContain('increment');
  });

  it('should have decrement method', function() {
    var fs = require('fs');
    var source = fs.readFileSync('src/app/counter/counter.service.ts', 'utf-8');
    expect(source).toContain('decrement');
  });

  it('should have reset method', function() {
    var fs = require('fs');
    var source = fs.readFileSync('src/app/counter/counter.service.ts', 'utf-8');
    expect(source).toContain('reset');
  });

  it('should have doubleCount computed signal', function() {
    var fs = require('fs');
    var source = fs.readFileSync('src/app/counter/counter.service.ts', 'utf-8');
    expect(source).toContain('computed');
    expect(source).toContain('doubleCount');
  });
});

describe('CounterComponent', function() {
  it('should inject CounterService', function() {
    var fs = require('fs');
    var source = fs.readFileSync('src/app/counter/counter.component.ts', 'utf-8');
    expect(source).toContain('inject');
    expect(source).toContain('CounterService');
  });

  it('should display count in template', function() {
    var fs = require('fs');
    var template = fs.readFileSync('src/app/counter/counter.component.html', 'utf-8');
    expect(template).toContain('count');
  });

  it('should have increment button', function() {
    var fs = require('fs');
    var template = fs.readFileSync('src/app/counter/counter.component.html', 'utf-8');
    var hasButton = template.includes('Increment') || template.includes('increment');
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
    var fs = require('fs');
    var source = fs.readFileSync('src/app/user-card/user-card.component.ts', 'utf-8');
    expect(source).toContain('input');
  });

  it('should use output for toggle event', function() {
    var fs = require('fs');
    var source = fs.readFileSync('src/app/user-card/user-card.component.ts', 'utf-8');
    expect(source).toContain('output');
  });

  it('should display user name in template', function() {
    var fs = require('fs');
    var template = fs.readFileSync('src/app/user-card/user-card.component.html', 'utf-8');
    expect(template).toContain('name');
  });

  it('should show active/inactive status', function() {
    var fs = require('fs');
    var template = fs.readFileSync('src/app/user-card/user-card.component.html', 'utf-8');
    var hasStatus = template.includes('Active') || template.includes('active') || template.includes('Inactive');
    expect(hasStatus).toBeTruthy();
  });

  it('should have toggle button', function() {
    var fs = require('fs');
    var template = fs.readFileSync('src/app/user-card/user-card.component.html', 'utf-8');
    var hasToggle = template.includes('Toggle') || template.includes('toggle');
    expect(hasToggle).toBeTruthy();
  });
});

describe('AppComponent', function() {
  it('should import UserCardComponent', function() {
    var fs = require('fs');
    var source = fs.readFileSync('src/app/app.component.ts', 'utf-8');
    expect(source).toContain('UserCardComponent');
  });

  it('should use @for to render cards', function() {
    var fs = require('fs');
    var template = fs.readFileSync('src/app/app.component.html', 'utf-8');
    expect(template).toContain('@for');
  });
});
`,
    },
  ],
};
