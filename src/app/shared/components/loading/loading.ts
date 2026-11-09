import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="flex min-h-48 items-center justify-center text-sky" role="status" aria-live="polite">
      <i class="fa-solid fa-graduation-cap fa-bounce text-4xl motion-reduce:animate-none" aria-hidden="true"></i>
    </div>
  `,
})
export class Loading {}
