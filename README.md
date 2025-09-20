### Flappy React — A Minimal Flappy Bird Clone Built with React and Canvas

This project is a simple Flappy Bird–style game implemented using React and the HTML5 `<canvas>` element. It leverages React's hooks and mutable refs to maintain a smooth 60 FPS game loop driven by `requestAnimationFrame`, avoiding expensive React state updates per frame.

## Features

- Single-canvas rendering for optimal performance (no per-frame React state updates)
- Realistic gravity and flap impulse mechanics
- Procedurally spawned pipes with scoring system
- Collision detection, game over state, and instant restart functionality
- Parallax scrolling background with three layers for depth effect
- Simple 3-frame wing sprite animation for the bird
- Persistent high score saved in `localStorage`

## Controls

- **Spacebar / Mouse Click / Touch** — Make the bird flap (jump upwards)
- When the game is over, pressing any of the above will restart the game instantly

## Quick Start

1. Clone the repository:
   ```
   git clone <repository-url>
   cd flappy_bird_clone
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser at `http://localhost:3000` (or the port specified in the terminal)

## Production Build

To create an optimized production build and preview it locally:

```
npm run build
npm run preview
```

## File Structure Overview

- `src/` — Contains the React components and game logic
- `public/` — Static assets such as images and icons
- `README.md` — This file, documentation and instructions
- `package.json` — Project metadata and scripts

## Core Game Constants Explained

- **Gravity:** Controls the acceleration pulling the bird downwards each frame, simulating gravity.
- **Jump (Flap Impulse):** The upward velocity applied to the bird when the player flaps.
- **Gap:** The vertical spacing between pipes through which the bird must fly.

These constants can be adjusted in the source code to tweak game difficulty and feel.

## High Score Persistence

The highest score achieved is saved in the browser's `localStorage`. This enables the game to remember your best performance across sessions without requiring a backend.
