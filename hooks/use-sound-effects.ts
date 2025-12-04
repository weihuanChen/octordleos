"use client"

import { useRef, useCallback } from "react"

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContext()
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume()
    }
  }, [])

  const playTone = (freq: number, type: OscillatorType, duration: number, startTime = 0, volume = 0.1) => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime)

    gain.gain.setValueAtTime(volume, ctx.currentTime + startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + startTime)
    osc.stop(ctx.currentTime + startTime + duration)
  }

  const playClick = useCallback(() => {
    initAudio()
    if (!audioContextRef.current) return

    // Mechanical switch sound (high pitch short burst + lower thud)
    playTone(800, "square", 0.05, 0, 0.05)
    playTone(200, "sine", 0.1, 0, 0.1)

    // White noise burst for texture
    const ctx = audioContextRef.current
    const bufferSize = ctx.sampleRate * 0.05 // 50ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.05
    noise.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start()
  }, [initAudio])

  const playError = useCallback(() => {
    initAudio()
    if (!audioContextRef.current) return

    // Low buzzer
    playTone(150, "sawtooth", 0.3, 0, 0.1)
    playTone(140, "sawtooth", 0.3, 0.05, 0.1)
  }, [initAudio])

  const playSuccess = useCallback(() => {
    initAudio()
    if (!audioContextRef.current) return

    // Rising 8-bit arpeggio
    playTone(440, "square", 0.1, 0, 0.05) // A4
    playTone(554, "square", 0.1, 0.1, 0.05) // C#5
    playTone(659, "square", 0.2, 0.2, 0.05) // E5
  }, [initAudio])

  const playWin = useCallback(() => {
    initAudio()
    if (!audioContextRef.current) return

    // Victory fanfare
    const now = audioContextRef.current.currentTime
    playTone(523.25, "square", 0.1, 0, 0.1) // C
    playTone(659.25, "square", 0.1, 0.1, 0.1) // E
    playTone(783.99, "square", 0.1, 0.2, 0.1) // G
    playTone(1046.5, "square", 0.4, 0.3, 0.1) // High C
  }, [initAudio])

  const playBoot = useCallback(() => {
    initAudio()
    if (!audioContextRef.current) return

    // Computer startup sound (rising sine wave)
    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(110, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5)

    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 1.5)
  }, [initAudio])

  const playKeystroke = useCallback(() => {
    initAudio()
    if (!audioContextRef.current) return

    // Very short high pitched blip for typing
    playTone(1200, "square", 0.01, 0, 0.02)
  }, [initAudio])

  const playDataInput = useCallback(() => {
    initAudio()
    if (!audioContextRef.current) return
    // Rapid high-pitch chirp
    playTone(2000, "sawtooth", 0.03, 0, 0.02)
  }, [initAudio])

  const playDataProcess = useCallback(() => {
    initAudio()
    if (!audioContextRef.current) return
    // Modem-like handshake
    playTone(1200, "square", 0.1, 0, 0.05)
    playTone(2400, "square", 0.1, 0.05, 0.05)
  }, [initAudio])

  return { playClick, playError, playSuccess, playWin, playBoot, playKeystroke, playDataInput, playDataProcess }
}
