"use client"

import React from 'react'

export function AnimatedBackground() {
  const icons = ['💉', '💊', '🩺', '🩹', '⚕️', '🔬', '🧬', '❤️', '🧠', '🩸'];
  
  // Create a larger array of icons to ensure variety
  const items = Array.from({ length: 12 }, (_, i) => icons[i % icons.length]);

  return (
    <div className="background-animation" aria-hidden="true">
      {items.map((icon, index) => (
        <span key={index}>{icon}</span>
      ))}
    </div>
  )
}
