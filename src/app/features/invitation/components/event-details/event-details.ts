import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { GraduationInfo } from '../../../../core/models/graduation-info.model';
import { ResolvedInvitation } from '../../../../core/models/invitation.model';
import { AppButton } from '../../../../shared/components/button/button';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

const DEFAULT_DURATION_HOURS = 3;

@Component({
  selector: 'app-event-details',
  imports: [DatePipe, SectionHeading, AppButton, RevealDirective],
  template: `
    <section appReveal class="bg-gradient-to-b from-soft to-ice px-4 py-20">
      <div class="mx-auto max-w-4xl">
        <div data-reveal>
          <app-section-heading [heading]="content().heading" [description]="content().subtitle" icon="fa-solid fa-calendar-days" />
        </div>

        <p data-reveal class="mt-6 text-center font-display text-xl text-navy">{{ info().event.title }}</p>

        <div class="mt-10 grid gap-4 sm:grid-cols-3">
          <div data-reveal class="rounded-3xl bg-white p-6 text-center shadow-card transition-[translate] duration-300 hover:-translate-y-1">
            <i class="fa-regular fa-calendar mb-3 text-2xl text-royal" aria-hidden="true"></i>
            <p class="text-sm text-muted">{{ content().dateLabel }}</p>
            <p class="mt-1 font-medium text-navy">{{ eventDate() | date: 'dd/MM/yyyy' }}</p>
          </div>
          <div data-reveal class="rounded-3xl bg-white p-6 text-center shadow-card transition-[translate] duration-300 hover:-translate-y-1">
            <i class="fa-regular fa-clock mb-3 text-2xl text-royal" aria-hidden="true"></i>
            <p class="text-sm text-muted">{{ content().timeLabel }}</p>
            <p class="mt-1 font-medium text-navy">{{ info().event.startTime }}</p>
          </div>
          <div data-reveal class="rounded-3xl bg-white p-6 text-center shadow-card transition-[translate] duration-300 hover:-translate-y-1">
            <i class="fa-solid fa-location-dot mb-3 text-2xl text-royal" aria-hidden="true"></i>
            <p class="text-sm text-muted">{{ content().locationLabel }}</p>
            <p class="mt-1 font-medium text-navy">{{ info().event.location }}</p>
            <p class="mt-1 text-sm text-muted">{{ info().event.address }}</p>
          </div>
        </div>

        <p data-reveal class="mx-auto mt-8 max-w-xl text-center text-lg text-muted">{{ content().invitationMessage }}</p>

        <div data-reveal class="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
          <app-button [fullWidth]="true" [href]="info().event.mapUrl">
            <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
            {{ content().mapButtonLabel }}
          </app-button>
          <app-button variant="secondary" [fullWidth]="true" [href]="calendarUrl()">
            <i class="fa-regular fa-calendar-plus" aria-hidden="true"></i>
            {{ content().calendarButtonLabel }}
          </app-button>
        </div>
      </div>
    </section>
  `,
})
export class EventDetails {
  readonly content = input.required<ResolvedInvitation['event']>();
  readonly info = input.required<GraduationInfo>();

  /** Local date-time built from the ISO date and HH:mm start time. */
  protected readonly eventDate = computed(() => this.start());

  protected readonly calendarUrl = computed(() => {
    const { event } = this.info();
    const start = this.start();
    const end = new Date(start.getTime() + DEFAULT_DURATION_HOURS * 3_600_000);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
      location: `${event.location}, ${event.address}`,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  });

  private start(): Date {
    const { date, startTime } = this.info().event;
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = startTime.split(':').map(Number);
    return new Date(y, m - 1, d, hh || 0, mm || 0);
  }
}

/** Floating local time, e.g. 20261220T090000 */
function toCalendarStamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}
