"use client";

import { useEffect, useRef } from "react";

type HushNodes = {
  context: AudioContext;
  source: AudioBufferSourceNode;
  gain: GainNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
};

function createSoftNoiseBuffer(context: AudioContext): AudioBuffer {
  const length = context.sampleRate * 3;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = last * 0.94 + white * 0.06;
    data[i] = last * 3.2;
  }
  return buffer;
}

/**
 * A very soft, generated hush. Nothing is downloaded or autoplayed;
 * the sound is created only after the listener switches it on.
 */
export function useAmbientSound(enabled: boolean) {
  const nodesRef = useRef<HushNodes | null>(null);

  useEffect(() => {
    if (!enabled) {
      const nodes = nodesRef.current;
      if (nodes) {
        const now = nodes.context.currentTime;
        nodes.gain.gain.cancelScheduledValues(now);
        nodes.gain.gain.setValueAtTime(nodes.gain.gain.value, now);
        nodes.gain.gain.linearRampToValueAtTime(0, now + 0.8);
        window.setTimeout(() => {
          try {
            nodes.source.stop();
            nodes.lfo.stop();
            void nodes.context.close();
          } catch {
            // already stopped
          }
        }, 900);
        nodesRef.current = null;
      }
      return;
    }

    let cancelled = false;
    const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const source = context.createBufferSource();
    source.buffer = createSoftNoiseBuffer(context);
    source.loop = true;

    const lowpass = context.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 950;
    const highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 180;

    const gain = context.createGain();
    gain.gain.value = 0;

    const lfo = context.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoGain = context.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(gain.gain);

    source.connect(highpass).connect(lowpass).connect(gain).connect(context.destination);
    void context.resume().then(() => {
      if (cancelled) return;
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.055, context.currentTime + 2.4);
    });

    source.start();
    lfo.start();
    nodesRef.current = { context, source, gain, lfo, lfoGain };

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    return () => {
      const nodes = nodesRef.current;
      if (!nodes) return;
      try {
        nodes.source.stop();
        nodes.lfo.stop();
        void nodes.context.close();
      } catch {
        // already stopped
      }
    };
  }, []);
}
