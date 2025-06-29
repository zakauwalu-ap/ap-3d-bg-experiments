<script lang="ts">
  import HeroV1 from '$lib/components/heroes/HeroV1.svelte';
  import HeroV2 from '$lib/components/heroes/HeroV2.svelte';
  import HeroV3 from '$lib/components/heroes/HeroV3.svelte';
  import HeroV4 from '$lib/components/heroes/HeroV4.svelte';
  import HeroV5 from '$lib/components/heroes/HeroV5.svelte';
  import HeroV6 from '$lib/components/heroes/HeroV6.svelte';
  import HeroV7 from '$lib/components/heroes/HeroV7.svelte';
  import HeroV8 from '$lib/components/heroes/HeroV8.svelte';
  import HeroV9 from '$lib/components/heroes/HeroV9.svelte';
  import HeroV10 from '$lib/components/heroes/HeroV10.svelte';
  import HeroV11 from '$lib/components/heroes/HeroV11.svelte';
  import HeroV12 from '$lib/components/heroes/HeroV12.svelte';
  import HeroV13 from '$lib/components/heroes/HeroV13.svelte';
  import HeroV14 from '$lib/components/heroes/HeroV14.svelte';
  import HeroV15 from '$lib/components/heroes/HeroV15.svelte';
  import HeroV16 from '$lib/components/heroes/HeroV16.svelte';
  import HeroV17 from '$lib/components/heroes/HeroV17.svelte';
  import HeroV18 from '$lib/components/heroes/HeroV18.svelte';
  import HeroV19 from '$lib/components/heroes/HeroV19.svelte';
  import HeroV20 from '$lib/components/heroes/HeroV20.svelte';
  import HeroV21 from '$lib/components/heroes/HeroV21.svelte';
  
  let currentHero = 0;
  let isDemoBoxOpen = true;
  
  const toggleDemoBox = () => {
    isDemoBoxOpen = !isDemoBoxOpen;
  };
  
  const heroes = [
    { component: HeroV1, name: 'Hero V1 - Sand Ripples', description: 'Gentle beach sand ripples with enhanced mouse interaction' },
    { component: HeroV2, name: 'Hero V2 - Sand Ripples Dark', description: 'Dark background with peach yellow wave elements' },
    { component: HeroV3, name: 'Hero V3 - Wave Lines', description: 'Flowing golden wave lines with dark background and mouse interaction' },
    { component: HeroV4, name: 'Hero V4 - 3D Waves', description: 'Vanta-style 3D wave surface with mouse ripples and dynamic lighting' },
    { component: HeroV5, name: 'Hero V5 - Glow Waves', description: 'Flowing golden glow waves with ethereal animation effects' },
    { component: HeroV6, name: 'Hero V6 - Glow Waves V2', description: 'Ready for customization based on V5 golden glow waves' },
    { component: HeroV7, name: 'Hero V7 - Mouse Responsive Waves', description: 'Vertical golden waves that bend away from mouse cursor' },
    { component: HeroV8, name: 'Hero V8 - Flowing Curtains', description: 'Mesmerizing vertical curtains with wave interference patterns' },
    { component: HeroV9, name: 'Hero V9 - Professional Waves', description: 'Clean vertical waves conveying trust and sophistication' },
    { component: HeroV10, name: 'Hero V10 - Sophisticated Flow', description: 'Elegant vertical flows with sophisticated color palette and refined animations' },
    { component: HeroV11, name: 'Hero V11 - Crystal Facets', description: 'Geometric crystalline formations with prismatic light effects' },
    { component: HeroV12, name: 'Hero V12 - Flowing Ink', description: 'Organic flowing streams like liquid ink with smooth natural curves' },
    { component: HeroV13, name: 'Hero V13 - Professional Clean', description: 'Calm, sophisticated background with subtle geometric elements and gold accents' },
    { component: HeroV14, name: 'Hero V14 - Architectural', description: 'Layered geometric patterns with architectural grid elements and enhanced gold accents' },
    { component: HeroV15, name: 'Hero V15 - Sophisticated Patterns', description: 'Hexagonal grids, flowing intersections, and architectural elements with organic shapes' },
    { component: HeroV16, name: 'Hero V16 - Wave-Enhanced Patterns', description: 'Sophisticated patterns dynamically influenced by flowing wave dynamics' },
    { component: HeroV17, name: 'Hero V17 - Responsive Networks', description: 'Living architectural patterns that breathe and flow with mouse interaction' },
    { component: HeroV18, name: 'Hero V18 - Flowing Architecture', description: 'Artistic blend of golden flowing waves with sophisticated hexagonal and architectural patterns' },
    { component: HeroV19, name: 'Hero V19 - Dramatic Streaks', description: 'Minimalist dark background with subtle vertical streaks inspired by dramatic lighting' },
    { component: HeroV20, name: 'Hero V20 - Curved Gold Streaks', description: 'Elegant curved vertical lines with brighter gold color and matching typography' },
    { component: HeroV21, name: 'Hero V21 - Flowing Architecture', description: 'Clean animated lines flowing down with geometric patterns overlay for dark mode' }
  ];
  
  const switchHero = (index: number) => {
    currentHero = index;
  };
</script>

<svelte:head>
  <title>3D Shader Experiments</title>
  <meta name="description" content="Experimenting with 3D backgrounds using Svelte and Three.js" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
</svelte:head>

<div class="relative">
  <!-- Hero Section -->
  <section class="hero-section">
    <svelte:component this={heroes[currentHero].component} />
  </section>
  
  <!-- Demo Controls with mobile-friendly design -->
  <div class="demo-controls {isDemoBoxOpen ? 'open' : 'closed'}">
    <!-- Header with toggle button -->
    <div class="demo-toggle">
      {#if isDemoBoxOpen}
        <h3>Demo Controls</h3>
      {/if}
      <button
        on:click={toggleDemoBox}
        title={isDemoBoxOpen ? 'Minimize controls' : 'Show controls'}
        aria-label={isDemoBoxOpen ? 'Minimize controls' : 'Show controls'}
      >
        {#if isDemoBoxOpen}
          <!-- Minimize icon (dash) -->
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
          </svg>
        {:else}
          <!-- Expand icon (grid) -->
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        {/if}
      </button>
    </div>
    
    <!-- Demo selection buttons - only show when open -->
    {#if isDemoBoxOpen}
      <div class="demo-scroll">
        <div class="space-y-2">
          {#each heroes as hero, index}
            <button
              class="demo-button {currentHero === index ? 'active' : 'inactive'}"
              on:click={() => switchHero(index)}
              aria-pressed={currentHero === index}
            >
              <div class="font-medium">{hero.name}</div>
              <div class="text-xs opacity-75 mt-1">{hero.description}</div>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @import '$lib/styles/responsive.css';
  
  .space-y-2 > * + * {
    margin-top: 0.5rem;
  }
  
  .font-medium {
    font-weight: 500;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
  
  .opacity-75 {
    opacity: 0.75;
  }
  
  .mt-1 {
    margin-top: 0.25rem;
  }
</style> 