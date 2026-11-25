"""Builds audio/accordion.mp3 and audio/piano.mp3, the note samples Rhythm tap plays.

Each file is a row of single notes, one every SLOT seconds, starting at LEAD seconds into
each slot (rhythm.js knows this layout). Notes come from the FluidR3 GM SoundFont as rendered
in github.com/gleitz/midi-js-soundfonts (FluidR3_GM folder, CC BY 3.0, Frank Wen).
Usage: python3 scripts/build-music.py <folder with accordion-mp3/ and acoustic_grand_piano-mp3/ and woodblock-mp3/>
Needs ffmpeg and numpy.
"""
import subprocess, sys, os
import numpy as np

SR, SLOT, LEAD, KEEP = 44100, 1.25, 0.05, 1.15
NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
def name(m): return NAMES[m % 12] + str(m // 12 - 1)

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], check=True, capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).copy()
    on = int(np.argmax(np.abs(a) > 0.02 * np.abs(a).max()))  # start right at the attack
    a = a[on:on + int(KEEP * SR)]
    a = np.pad(a, (0, int(KEEP * SR) - len(a)))
    fade = int(0.08 * SR); a[-fade:] *= np.linspace(1, 0, fade)
    return a / (np.abs(a).max() + 1e-9)

def build(src, files, out):
    row = np.zeros(int(SLOT * SR * len(files)), dtype=np.float32)
    for i, f in enumerate(files):
        a = load(os.path.join(src, f)); s = int((i * SLOT + LEAD) * SR); row[s:s + len(a)] = a * 0.9
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-b:a", "80k", out], input=row.tobytes(), check=True)
    print(out, len(files), "notes")

src = sys.argv[1]
here = os.path.join(os.path.dirname(__file__), "..", "audio")
# Accordion: D4 (MIDI 62) to D6 (86). Piano: D2 (38) to A4 (69), then one woodblock for the count-in.
build(src, [f"accordion-mp3/{name(m)}.mp3" for m in range(62, 87)], os.path.join(here, "accordion.mp3"))
build(src, [f"acoustic_grand_piano-mp3/{name(m)}.mp3" for m in range(38, 70)] + ["woodblock-mp3/C5.mp3"], os.path.join(here, "piano.mp3"))
