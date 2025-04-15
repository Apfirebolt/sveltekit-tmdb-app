<script lang="ts">
  
</script>
  
<div class="fixed inset-0 flex justify-center items-center bg-gradient-to-r bg-opacity-75 z-50 animated-bg">
  <div class="loader">
  </div>
</div>
  
<style>
  @keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
  }

  @keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
  }

  .loader {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top: 4px solid white;
    border-right: 4px solid var(--tw-ring-color, var(--tw-ring-offset-color, var(--tw-gradient-stops, var(--tw-bg-opacity, rgba(251, 146, 60, var(--tw-bg-opacity, 1))))));
    animation: spin 1s linear infinite;
  }

  .animated-bg {
    background: linear-gradient(270deg, #ff7eb3, #ff758c, #ff6a5e, #ff7eb3);
    background-size: 400% 400%;
    animation: gradient 6s ease infinite;
  }
</style>