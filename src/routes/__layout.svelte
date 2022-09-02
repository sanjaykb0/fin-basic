<script>
    import '../reset.css'
    import '../app.css';
    // import {initializeApp} from "firebase/app";
    // import { getFirestore } from "firebase/firestore"


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