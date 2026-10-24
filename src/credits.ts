// Who made The Last Apostate, for the Credits page (Settings → Save and credits → Credits).
// Empty sections are simply left out.

export const CREDITS: { heading: string; lines: string[] }[] = [
  // The four who came up with it together, prompting the first version in Figma Make, and where.
  {
    heading: 'Original concept',
    lines: ['Kelvin, Jon, Danny and Vic', 'Made together at the Friends of Figma Los Angeles AI Impact Workshop'],
  },
  // Everything since.
  { heading: 'Design and development', lines: ['Kelvin Man'] },
  {
    heading: 'Built with',
    lines: ['First prototyped in Figma Make', 'Claude (Anthropic): code, pixel art generation, writing', 'React, Vite and TypeScript'],
  },
  {
    heading: 'Art',
    lines: [
      'Horror Fantasy Assets by stealthix (CC0), via OpenGameArt',
      "The apostate's face: a Sprite-AI gallery sprite",
      'Everything else drawn in code',
    ],
  },
  {
    heading: 'Fonts',
    lines: ['Pixelify Sans by Stefie Justprince', 'Silkscreen by Jason Kottke', 'VT323 by Peter Hull', 'All under the SIL Open Font License'],
  },
  { heading: 'Palette', lines: ['Endesga 32 by ENDESGA'] },
  { heading: 'Sound', lines: ['Original synthesized sound effects and generative organ music'] },
]
