"use client";

import { useEffect, useRef } from "react";

type MusicNodes = {
  context: AudioContext;
  master: GainNode;
  echo: DelayNode;
  timer: number;
};

// Slow, open chords with a little pentatonic melody on top. Nothing is downloaded.
const CHORDS = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7
  [220.0, 261.63, 329.63, 392.0], // Am7
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [196.0, 246.94, 293.66, 392.0], // G
];

const MELODY = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 493.88, 523.25, 659.25];

function playNote(
  context: AudioContext,
  master: GainNode,
  echo: DelayNode,
  frequency: number,
  start: number,
  duration: number,
  level: number,
  type: OscillatorType,
) {
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  filter.type = "lowpass";
  filter.frequency.value = type === "sine" ? 1200 : 2100;

  const attack = type === "sine" ? 1.4 : 0.18;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(level, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(filter).connect(gain);
  gain.connect(master);
  gain.connect(echo);

  oscillator.start(start);
  oscillator.stop(start + duration + 0.15);
}

/**
 * A very quiet, generated little tune. Browsers block audible autoplay, so the
 * sound wakes up on the first tap or key press and can be hushed at any time.
 */
export function useAmbientMusic(enabled: boolean) {
  const nodesRef = useRef<MusicNodes | null>(null);

  useEffect(() => {
    if (!enabled) {
      const nodes = nodesRef.current;
      if (nodes) {
        window.clearInterval(nodes.timer);
        const now = nodes.context.currentTime;
        nodes.master.gain.cancelScheduledValues(now);
        nodes.master.gain.setValueAtTime(nodes.master.gain.value, now);
        nodes.master.gain.linearRampToValueAtTime(0, now + 0.9);
        window.setTimeout(() => {
          try {
            void nodes.context.close();
          } catch {
            // already closed
          }
        }, 1000);
      }
      nodesRef.current = null;
      return;
    }

    const AudioContextClass =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    const echo = context.createDelay(1);
    const feedback = context.createGain();
    const wet = context.createGain();

    master.gain.value = 0;
    echo.delayTime.value = 0.46;
    feedback.gain.value = 0.24;
    wet.gain.value = 0.28;

    echo.connect(feedback).connect(echo);
    echo.connect(wet).connect(master);
    master.connect(context.destination);

    let step = 0;
    const tick = () => {
      const start = context.currentTime + 0.06;
      if (step % 4 === 0) {
        const chord = CHORDS[Math.floor(step / 4) % CHORDS.length];
        chord.forEach((frequency, index) => {
          playNote(context, master, echo, frequency, start + index * 0.22, 10.5, 0.018, "sine");
        });
      }
      if (step % 3 !== 2) {
        playNote(context, master, echo, MELODY[step % MELODY.length], start + 0.3, 3.8, 0.03, "triangle");
      }
      step += 1;
    };

    const unlock = () => {
      void context.resume().then(() => {
        const now = context.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value, now);
        master.gain.linearRampToValueAtTime(0.42, now + 3.5);
      });
    };

    void context.resume();
    tick();
    const timer = window.setInterval(tick, 2600);
    nodesRef.current = { context, master, echo, timer };

    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.linearRampToValueAtTime(0, now + 0.5);
      window.setTimeout(() => {
        try {
          void context.close();
        } catch {
          // already closed
        }
      }, 600);
      nodesRef.current = null;
    };
  }, [enabled]);
}
