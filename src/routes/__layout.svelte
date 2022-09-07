<script>
    import cfg from "./firebaseConfig";
    import { initializeApp } from "firebase/app"
    import { getAuth, onAuthStateChanged} from "firebase/auth"
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    const app = initializeApp(cfg);

    import '../reset.css'
    import '../app.css';

    onMount(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                alert('allah')
            } else {
                goto('/login');
            }
        })
    })

</script>

<header>
    <div class="logo"><b>finbasic</b> v1.0</div>
    <nav>
        <a href="/">Home</a>
        <a href="/database">Statistics</a>
    </nav>
</header>
<hr>


<slot><!-- optional fallback --></slot>

<style>
    nav {
        @apply flex;
        @apply gap-4;
    }
</style>