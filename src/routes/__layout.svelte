<script>
    import '../app.css';
    
</script>

<header>
  <div class="container">
    <div class="title"><b>finbasic</b> v1.0</div>
    <nav>
        <a href="/">Home</a>
        <a href="/database">Statistics</a>
    </nav>
  </div>
  <hr />
</header>


<slot><!-- optional fallback --></slot>

<style>

    .title {
        @apply text-5xl;
    }

    .container {
        @apply flex;
        @apply justify-between;
        @apply max-w-screen-xl;
        @apply px-8;
        @apply items-center;
    }

    nav {
        @apply flex;
        @apply gap-4;
    }

    nav a {
        @apply px-2;
        @apply mx-2;
        width: 3em;
    }

    nav a:hover {
        @apply font-bold;
    }

</style>