"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
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
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  React.useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        void audioRef.current.play()
      } else {
        void audioRef.current.pause()
      }
    }
  }, [isPlaying])

  return (
    <div className="flex items-center gap-5">
      <sound.icon className="h-7 w-7" />
      <Button
        variant="ghost"
        className="h-auto p-1"
        onClick={() => {
          setIsPlaying(!isPlaying)
        }}
      >
        {isPlaying ? <Icons.volumne /> : <Icons.volumneMute />}
        <span className="sr-only">{`Toggle ${sound.title} sound`}</span>
      </Button>
      <audio ref={audioRef} src={sound.href} loop />
      <Slider />
    </div>
  )
}
