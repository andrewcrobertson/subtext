<script lang="ts">
  import { onMount } from 'svelte';

  // Props: list of movies to display
  export let movies: { id: string, title: string, posterFileName: string }[] = [];

  let carouselContainer: HTMLDivElement;
  let currentIndex = 0;

  // Move carousel left or right based on index
  const scrollToIndex = (index: number) => {
    const posterWidth = carouselContainer?.children[0]?.clientWidth || 200;
    carouselContainer.scrollTo({
      left: index * posterWidth,
      behavior: 'smooth'
    });
  };

  const next = () => {
    if (currentIndex < movies.length - 1) {
      currentIndex++;
      scrollToIndex(currentIndex);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      currentIndex--;
      scrollToIndex(currentIndex);
    }
  };

  // Handle swipe for mobile
  let startX: number;
  let scrollLeft: number;

  const handleTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].pageX;
    scrollLeft = carouselContainer.scrollLeft;
  };

  const handleTouchMove = (event: TouchEvent) => {
    const touchMove = startX - event.touches[0].pageX;
    carouselContainer.scrollLeft = scrollLeft + touchMove;
  };
</script>

<div class="relative">
  <!-- Left Arrow (visible on desktop) -->
  <button
    on:click={prev}
    class="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg">
    &larr;
  </button>

  <!-- Carousel Container -->
  <div
    bind:this={carouselContainer}
    class="flex space-x-2 overflow-x-scroll scroll-smooth scrollbar-hide touch-pan-x"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
  >
    {#each movies as { id, title, posterFileName }}
      <div class="shrink-0 w-40 md:w-52">
        <a href={`/movie/${id}`} class="block">
          <img
            src={`/posters/${posterFileName}`}
            alt={title}
            class="w-full h-full object-cover rounded-lg shadow-md"
          />
        </a>
      </div>
    {/each}
  </div>

  <!-- Right Arrow (visible on desktop) -->
  <button
    on:click={next}
    class="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg">
    &rarr;
  </button>
</div>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
