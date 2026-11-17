import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { GraduationInfo } from '../../../../core/models/graduation-info.model';
import { ResolvedInvitation } from '../../../../core/models/invitation.model';
import { AppButton } from '../../../../shared/components/button/button';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

const DEFAULT_DURATION_HOURS = 3;

/** Ceremony details: date, time, place, map and calendar buttons. */
@Component({
  selector: 'app-details',
  imports: [DatePipe, SectionHeading, AppButton, RevealDirective],
  template: `
    <section appReveal class="bg-gradient-to-b from-soft to-ice px-4 py-20">
      <div class="mx-auto max-w-4xl">
        <div>
          <div data-reveal>
            <app-section-heading [heading]="event().heading" icon="fa-solid fa-calendar-days" />
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
