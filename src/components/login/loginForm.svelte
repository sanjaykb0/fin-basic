<script>
// @ts-nocheck
    import { goto } from "$app/navigation";
    import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

	
    const auth = getAuth();
    const signIn = () => {
        const googleProvider =  new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
        .then(s => console.log)
        .catch(err => console.log)
    }
</script>

<main>
    <button on:click={signIn}>Sign in with Google</button>
</main>

<style>
    button {
        @apply underline;
    }
</style>