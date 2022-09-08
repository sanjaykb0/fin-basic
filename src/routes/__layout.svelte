<script>
    import cfg from "./firebaseConfig";
    import { initializeApp } from "firebase/app"
    import { getAuth, onAuthStateChanged} from "firebase/auth"
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { isLoggedIn, uid } from "../stores";

    const app = initializeApp(cfg);

    import '../reset.css'
    import '../app.css';

    /**
* @type {boolean}
*/
    let logged;
    isLoggedIn.subscribe(t => logged = t);

    onMount(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.uid);
                uid.set(user.uid);
                isLoggedIn.update(() => true)
                goto('/');
            } else {
                isLoggedIn.update(() => false)
                goto('/login');
            }
        })
    })

    const signOut = () => {
        const auth = getAuth();
        uid.set("")
        isLoggedIn.update(() => false)
        auth.signOut();
    }

</script>

<header>
    <div class="logo"><b>finbasic</b> v1.0</div>
    <nav>
        {#if logged}
            <button on:click={signOut} class="cta">Sign Out</button>
            <a href="/">Home</a>
            <a href="/database">Statistics</a>
        {/if}
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