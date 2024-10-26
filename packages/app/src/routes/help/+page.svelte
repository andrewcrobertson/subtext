<script lang="ts">
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import ChatBubbleLeftRightIcon from '$lib/ui.icons/ChatBubbleLeftRightIcon.svelte';

  const handleBackClick = ({}: MouseEvent) => history.back();
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between p-2 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500">
  <button class="btn btn-square text-white" on:click={handleBackClick}>
    <ArrowLeftIcon class="size-8" />
  </button>
</div>
<div class="mt-16"></div>
<div class="p-4 text-white text-xl mx-auto max-w-screen-md">
  <p class="text-4xl py-4">Welcome</p>
  <div class="flex items-center space-x-2">
    Hi! Thanks for checking out
    <div class="flex items-center ml-2">
      <ChatBubbleLeftRightIcon class="text-yellow-500 w-8 h-8 mr-1" />
      <p class="font-bold text-xl text-yellow-500">SubText</p>
    </div>
  </div>
  <p class="text-4xl py-4">About</p>
  This application was designed for people who would like to use subtitles in the cinema. The home screen has 2 sections on it: "My List" and "Recent".
  <p class="text-4xl py-4">My List</p>
  "My List" is where you should keep movies that you are planning to need subtitles for in the near future. It will always be at the top of the home screen, ready
  to play subtitles as soon as you open the app. To remove movies from "My List", you can click the "Edit " button to navigate to the "My List" edit screen, and
  click the "Remove from My List" button. To add movies to "My List", see the "Recent" section below.
  <p class="text-4xl py-4">Recent</p>
  The "Recent" section shows movies from our database which have been most recently released. To search for additional movies, you can click the "View All" button
  to navigate to the search screen. This screen will let you add or remove movies from your "My List".
  <p class="text-4xl py-4">Viewing Subtitles</p>
  Clicking on any movie poster in the app will load the subtitles for that movie.
</div>
