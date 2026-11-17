import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { GraduationInfo } from '../../../../core/models/graduation-info.model';
import { ResolvedInvitation } from '../../../../core/models/invitation.model';
import { AppButton } from '../../../../shared/components/button/button';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

const DEFAULT_DURATION_HOURS = 3;

/** Graduate summary + ceremony details in a single section. */
@Component({
  selector: 'app-details',
  imports: [DatePipe, SectionHeading, AppButton, RevealDirective],
  template: `
    <section appReveal class="bg-gradient-to-b from-white to-soft px-4 py-20">
      <div class="mx-auto max-w-4xl">
        <div data-reveal>
          <app-section-heading [heading]="profile().heading" [description]="profile().description" icon="fa-solid fa-user-graduate" />
        </div>

        <p data-reveal class="mt-8 text-center font-display text-2xl text-navy">{{ profile().personalMessage }}</p>
        @if (profile().quote) {
          <blockquote data-reveal class="mx-auto mt-4 max-w-xl border-l-4 border-sky pl-4 italic text-muted">{{ profile().quote }}</blockquote>
        }

        <dl class="mt-10 grid gap-3 sm:grid-cols-3">
          <div data-reveal class="rounded-2xl bg-white p-4 text-center shadow-card">
            <i class="fa-solid fa-building-columns mb-2 text-royal" aria-hidden="true"></i>
            <dt class="text-sm text-muted">{{ profile().universityLabel }}</dt>
            <dd class="font-medium text-navy">{{ info().university }}</dd>
          </div>
          <div data-reveal class="rounded-2xl bg-white p-4 text-center shadow-card">
            <i class="fa-solid fa-book-open mb-2 text-royal" aria-hidden="true"></i>
            <dt class="text-sm text-muted">{{ profile().majorLabel }}</dt>
            <dd class="font-medium text-navy">{{ info().major }}</dd>
          </div>
          <div data-reveal class="rounded-2xl bg-white p-4 text-center shadow-card">
            <i class="fa-solid fa-award mb-2 text-royal" aria-hidden="true"></i>
            <dt class="text-sm text-muted">{{ profile().yearLabel }}</dt>
            <dd class="font-medium text-navy">{{ info().graduationYear }}</dd>
          </div>
        </dl>

        <div class="mt-16">
          <div data-reveal>
            <app-section-heading [heading]="event().heading" [description]="event().subtitle" icon="fa-solid fa-calendar-days" />
          </div>
          <p data-reveal class="mt-6 text-center font-display text-xl text-navy">{{ info().event.title }}</p>

          <div class="mt-8 grid gap-4 sm:grid-cols-3">
            <div data-reveal class="rounded-3xl bg-white p-6 text-center shadow-card">
              <i class="fa-regular fa-calendar mb-3 text-2xl text-royal" aria-hidden="true"></i>
              <p class="text-sm text-muted">{{ event().dateLabel }}</p>
              <p class="mt-1 font-medium text-navy">{{ start() | date: 'dd/MM/yyyy' }}</p>
            </div>
            <div data-reveal class="rounded-3xl bg-white p-6 text-center shadow-card">
              <i class="fa-regular fa-clock mb-3 text-2xl text-royal" aria-hidden="true"></i>
              <p class="text-sm text-muted">{{ event().timeLabel }}</p>
              <p class="mt-1 font-medium text-navy">{{ info().event.startTime }}</p>
            </div>
            <div data-reveal class="rounded-3xl bg-white p-6 text-center shadow-card">
              <i class="fa-solid fa-location-dot mb-3 text-2xl text-royal" aria-hidden="true"></i>
              <p class="text-sm text-muted">{{ event().locationLabel }}</p>
              <p class="mt-1 font-medium text-navy">{{ info().event.location }}</p>
              <p class="mt-1 text-sm text-muted">{{ info().event.address }}</p>
            </div>
          </div>

          <p data-reveal class="mx-auto mt-8 max-w-xl text-center text-lg text-muted">{{ event().invitationMessage }}</p>

          <div data-reveal class="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            <app-button [fullWidth]="true" [href]="info().event.mapUrl">
              <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
              {{ event().mapButtonLabel }}
            </app-button>
            <app-button variant="secondary" [fullWidth]="true" [href]="calendarUrl()">
              <i class="fa-regular fa-calendar-plus" aria-hidden="true"></i>
              {{ event().calendarButtonLabel }}
            </app-button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Details {
  readonly profile = input.required<ResolvedInvitation['profile']>();
  readonly event = input.required<ResolvedInvitation['event']>();
  readonly info = input.required<GraduationInfo>();

  protected readonly start = computed(() => {
    const { date, startTime } = this.info().event;
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = startTime.split(':').map(Number);
    return new Date(y, m - 1, d, hh || 0, mm || 0);
  });

  protected readonly calendarUrl = computed(() => {
    const { event } = this.info();
    const start = this.start();
    const end = new Date(start.getTime() + DEFAULT_DURATION_HOURS * 3_600_000);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${stamp(start)}/${stamp(end)}`,
      location: `${event.location}, ${event.address}`,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  });
}

/** Floating local time, e.g. 20261220T090000 */
function stamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}
