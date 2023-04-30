"use client"

import * as React from "react"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

const sounds = [
  {
    title: "Rain",
    href: "/audios/rain.mp3",
    icon: Icons.rain,
  },
  {
    title: "Rain on umbrella",
    href: "/audios/rain-on-umbrella.mp3",
    icon: Icons.umbrella,
  },
  {
    title: "Ocean",
    href: "/audios/ocean.mp3",
    icon: Icons.wave,
  },
  {
    title: "Forest",
    href: "/audios/forest.mp3",
    icon: Icons.forest,
  },
  {
    title: "Fireplace",
    href: "/audios/fireplace.mp3",
    icon: Icons.fire,
  },
  {
    title: "Night ambience",
    href: "/audios/night-ambience.mp3",
    icon: Icons.moon,
  },
  {
    title: "Keyboard",
    href: "/audios/keyboard.mp3",
    icon: Icons.keyboard,
  },
  {
    title: "Cafe",
    href: "/audios/cafe.mp3",
    icon: Icons.coffee,
  },
]

export function Ambient() {
  return (
    <div className="flex max-h-[420px] flex-col gap-2.5 overflow-y-auto overflow-x-hidden px-6">
      {sounds.map((sound, i) => (
        <SoundCard key={i} sound={sound} />
      ))}
    </div>
  )
}

interface SoundCardProps {
  sound: (typeof sounds)[0]
}

function SoundCard({ sound }: SoundCardProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [volume, setVolume] = React.useState([0])

  // control audio playbacks
  React.useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      void audioRef.current.play()
    } else {
      void audioRef.current.pause()
    }
  }, [isPlaying])

  // if volume is dragged from 0 to 1, play the audio
  React.useEffect(() => {
    if (!audioRef.current) return

    if (volume.some((v) => v === 0)) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
    }
  }, [volume])

  // set volume of the audio
  React.useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.volume = (volume[0] as number) / 100
  }, [volume])

  return (
    <div className="flex items-center gap-5">
      <div aria-label={sound.title}>
        <sound.icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <audio ref={audioRef} src={sound.href} loop />
      <Button
        variant="ghost"
        className="h-auto p-1"
        onClick={() => {
          setIsPlaying(!isPlaying)
          isPlaying ? setVolume([0]) : setVolume([25])
        }}
      >
        {isPlaying ? <Icons.volumne /> : <Icons.volumneMute />}
        <span className="sr-only">{`Toggle ${sound.title} sound`}</span>
      </Button>
      <Slider
        min={0}
        max={100}
        step={1}
        value={volume}
        onValueChange={(value) => setVolume(value)}
      />
    </div>
  )
}
