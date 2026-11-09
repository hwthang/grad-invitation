import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { prefersReducedMotion } from '../../animation';

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const FIRST_LAUNCH_S = 0.3;
const LAUNCH_INTERVAL_S = 0.55;
const RISE_TIME_S = 0.8;
const GRAVITY = 140;
const PARTICLES_PER_BURST = 70;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Fireworks over the page. By default it plays once when it appears; with [autoplay]="false" it
 * waits for play(). Pointer events are disabled, the canvas removes itself when the show is over,
 * and nothing runs when the visitor prefers reduced motion.
 */
@Component({
  selector: 'app-fireworks',
  template: `
    @if (active()) {
      <canvas #canvas aria-hidden="true" class="pointer-events-none fixed inset-0 z-[45] size-full"></canvas>
    }
  `,
})
export class Fireworks {
  /** Burst colors (any CSS color). */
  readonly colors = input.required<readonly string[]>();
  readonly autoplay = input(true);

  protected readonly active = signal(false);

  private readonly injector = inject(Injector);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private frame = 0;
  private stop?: () => void;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop?.());
    afterNextRender(() => {
      if (this.autoplay()) this.play();
    });
  }

  /** Starts (or restarts) the show. */
  play(): void {
    if (prefersReducedMotion()) return;
    if (this.active()) {
      const el = this.canvas()?.nativeElement;
      if (el) this.start(el);
      return;
    }
    this.active.set(true);
    afterNextRender(
      () => {
        const el = this.canvas()?.nativeElement;
        if (el) this.start(el);
        else this.active.set(false);
      },
      { injector: this.injector },
    );
  }

  private start(canvas: HTMLCanvasElement): void {
    this.stop?.();
    const ctx = canvas.getContext('2d');
    if (!ctx) return this.active.set(false);

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const launches = w < 640 ? 5 : 7;
    const rockets: Rocket[] = [];
    const particles: Particle[] = [];
    let launched = 0;
    let elapsed = 0;
    let last = performance.now();

    const palette = () => this.colors();
    const pick = () => palette()[Math.floor(Math.random() * palette().length)];

    const launch = () => {
      const targetY = rand(h * 0.15, h * 0.45);
      rockets.push({ x: rand(w * 0.15, w * 0.85), y: h, targetY, vy: -(h - targetY) / RISE_TIME_S, color: pick() });
    };

    const explode = (r: Rocket) => {
      const base = pick();
      for (let i = 0; i < PARTICLES_PER_BURST; i++) {
        const angle = (i / PARTICLES_PER_BURST) * Math.PI * 2 + rand(-0.05, 0.05);
        const speed = rand(70, 230);
        const life = rand(1.1, 1.8);
        particles.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          size: rand(1.4, 2.6),
          color: Math.random() < 0.25 ? pick() : base,
        });
      }
    };

    this.stop = () => {
      cancelAnimationFrame(this.frame);
      window.removeEventListener('resize', resize);
    };
    const cleanup = () => {
      this.stop?.();
      this.active.set(false);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;

      while (launched < launches && elapsed >= FIRST_LAUNCH_S + launched * LAUNCH_INTERVAL_S) {
        launch();
        launched++;
      }

      // Fade the previous frame instead of clearing it, which leaves soft trails.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy * dt;
        if (r.y <= r.targetY) {
          explode(r);
          rockets.splice(i, 1);
          continue;
        }
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      const drag = Math.pow(0.985, dt * 60);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.vx *= drag;
        p.vy = p.vy * drag + GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = Math.max(p.life / p.maxLife, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (launched >= launches && !rockets.length && !particles.length) return cleanup();
      this.frame = requestAnimationFrame(tick);
    };

    this.frame = requestAnimationFrame(tick);
  }
}
