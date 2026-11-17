import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { GraduationInfo } from '../../../../core/models/graduation-info.model';
import { ResolvedInvitation } from '../../../../core/models/invitation.model';
import { formatVnTime } from '../../../../core/utils/format-time';
import { AppButton } from '../../../../shared/components/button/button';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

const DEFAULT_DURATION_HOURS = 3;

/** Ceremony details (date, time, place, map and calendar buttons), meant to sit in a column. */
@Component({
  selector: 'app-details',
  imports: [DatePipe, SectionHeading, AppButton, RevealDirective],
  template: `
    <div appReveal>
      <div data-reveal>
        <app-section-heading [heading]="event().heading" icon="fa-solid fa-calendar-days" />
      </div>
      <p data-reveal class="mt-2 text-center font-display text-xl text-navy">{{ info().event.title }}</p>

      <ul class="mt-8 grid grid-cols-2 gap-3">
        <li data-reveal class="flex items-center justify-center gap-3 text-center rounded-2xl bg-white p-4 shadow-card">
          <i class="fa-regular fa-calendar w-6 text-center text-xl text-royal" aria-hidden="true"></i>
          <div>
            <p class="text-sm text-muted">{{ event().dateLabel }}</p>
            <p class="font-medium text-navy">{{ start() | date: 'dd/MM/yyyy' }}</p>
          </div>
        </li>
        <li data-reveal class="flex items-center justify-center gap-3 text-center rounded-2xl bg-white p-4 shadow-card">
          <i class="fa-regular fa-clock w-6 text-center text-xl text-royal" aria-hidden="true"></i>
          <div>
            <p class="text-sm text-muted">{{ event().timeLabel }}</p>
            <p class="font-medium text-navy">{{ timeLabel() }}</p>
          </div>
        </li>
        <li data-reveal class="col-span-2 flex items-center justify-center gap-3 text-center rounded-2xl bg-white p-4 shadow-card">
          <i class="fa-solid fa-location-dot w-6 text-center text-xl text-royal" aria-hidden="true"></i>
          <div>
            <p class="text-sm text-muted">{{ event().locationLabel }}</p>
            <p class="font-medium text-navy">{{ info().event.location }}</p>
            @if (info().event.address) {
              <p class="text-sm text-muted">{{ info().event.address }}</p>
            }
          </div>
        </li>
      </ul>

      <div data-reveal class="mt-6 grid gap-3 sm:grid-cols-2">
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
  `,
})
export class Details {
  readonly event = input.required<ResolvedInvitation['event']>();
  readonly info = input.required<GraduationInfo>();

  protected readonly start = computed(() => {
    const { date } = this.info().event;
    const startTime = this.event().startTime;
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = startTime.split(':').map(Number);
    return new Date(y, m - 1, d, hh || 0, mm || 0);
  });

  protected readonly timeLabel = computed(() => formatVnTime(this.event().startTime));

  protected readonly calendarUrl = computed(() => {
    const { event } = this.info();
    const start = this.start();
    const end = new Date(start.getTime() + DEFAULT_DURATION_HOURS * 3_600_000);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${stamp(start)}/${stamp(end)}`,
      location: [event.location, event.address].filter(Boolean).join(', '),
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  });
}

/** Floating local time, e.g. 20261220T090000 */
function stamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}
