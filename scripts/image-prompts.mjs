// Prompts for scripts/generate-images.mjs. Every brand name is fictional.
const site = (brief) => `A flat, front-on screenshot of a premium, award-winning website homepage, filling the entire frame edge to edge. No browser window, no device, no mockup, no perspective. ${brief} Crisp modern typography, generous spacing, a clean navigation bar at the top with a logo and 4 menu links, one clear call-to-action button. Realistic UI design as seen on Awwwards, sharp legible text.`;

export const prompts = [
  { name: 'site-cafe', prompt: site('Specialty coffee roastery called "Brew Theory". Warm cream and espresso brown palette, large hero photo of latte art in a ceramic cup, headline "Slow coffee, bold mornings".') },
  { name: 'site-realty', prompt: site('Luxury real estate developer called "Aurelia Homes". Dark charcoal with gold accents, hero photo of a modern villa with an infinity pool at dusk, headline "Live above the ordinary".') },
  { name: 'site-fitness', prompt: site('Boutique fitness studio called "Pulse Lab". Black background with electric lime accents, hero photo of an athlete mid sprint with dramatic lighting, huge condensed headline "Train like you mean it".') },
  { name: 'site-skincare', prompt: site('Clean skincare brand called "Dewly". Soft blush pink and white palette, hero product photo of glass serum bottles on stone with water droplets, elegant serif headline "Skin, but softer".') },
  { name: 'site-dental', prompt: site('Modern dental clinic called "Smile Studio". Calm teal and white palette, hero photo of a smiling woman in a bright clinic, headline "Gentle care, brighter smiles", booking button.') },
  { name: 'site-travel', prompt: site('Travel agency called "Wanderlore". Hero photo of turquoise lagoon with a wooden boat between limestone cliffs, bold white headline "Go further than the map", search bar for destinations.') },
  { name: 'site-fashion', prompt: site('Fashion label called "NOIR ATELIER". Editorial black and white layout, model in a tailored oversized coat, giant serif wordmark, headline "The Autumn Edit".') },
  { name: 'site-restaurant', prompt: site('Modern Indian fine dining restaurant called "Saffron & Smoke". Deep burgundy and saffron palette, hero photo of plated food with dramatic dark lighting, headline "A table worth travelling for", reserve button.') },
  { name: 'site-architecture', prompt: site('Architecture studio called "Formline". Minimal light grey layout, big photo of a brutalist concrete house in a forest, thin sans headline "Spaces with intent", project grid below.') },
  { name: 'site-jewellery', prompt: site('Handcrafted jewellery brand called "Kaanch". Deep emerald green with gold, close-up photo of a gold necklace on velvet, elegant serif headline "Heirlooms, made today".') },
  { name: 'site-education', prompt: site('Online coaching academy called "Brightpath". Friendly indigo and sunny yellow palette, photo of a smiling student with a laptop, headline "Learn skills that open doors", stats row "12k learners".') },
  { name: 'site-organic', prompt: site('Organic farm-to-home grocery brand called "Greenroot". Fresh green and off-white palette, hero photo of a basket of vegetables in sunlight, headline "Picked this morning, at your door".') },
  { name: 'site-yoga', prompt: site('Yoga retreat called "Stillwater". Sand beige palette, hero photo of a woman in a yoga pose on a beach at sunrise, delicate serif headline "Breathe in. Begin again".') },
  { name: 'site-auto', prompt: site('Premium car rental service called "DriveLux". Dark cinematic layout, hero photo of a silver sports car on a coastal road at sunset, headline "Rent the drive you deserve", booking widget.') },
  { name: 'site-interiors', prompt: site('Interior design studio called "Casa Linea". Warm terracotta and cream, hero photo of a sunlit living room with arched windows and linen sofa, headline "Rooms that feel like you".') },
  { name: 'site-tech', prompt: site('SaaS analytics startup called "Northstar". Dark navy with glowing blue gradients, product dashboard screenshot with charts in the hero, headline "See every number that matters".') },

  { name: 'social-feed', size: '1024x1536', width: 1000, prompt: 'A photorealistic smartphone floating at a slight angle against a deep black background with soft electric blue rim light, its screen showing a beautiful, cohesive social media profile grid of nine colourful lifestyle posts for a fictional cafe brand, with like hearts and comment bubbles floating around the phone as glossy 3D icons. Premium product render, cinematic.' },
  { name: 'service-web', prompt: 'A cinematic, photorealistic render of a sleek laptop and a smartphone on a dark reflective surface, both screens showing a vibrant modern website with bold typography and imagery. Deep black studio background with electric blue and violet light streaks reflecting on the glass. Premium, high-end tech advertising look.' },

];
