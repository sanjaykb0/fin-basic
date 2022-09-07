<script>
// @ts-nocheck

    import { goto } from "$app/navigation";
    import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
    import { useForm, Hint, HintGroup, validators, required, minLength, email } from "svelte-use-form";
	import { passwordMatch, containNumbers } from "./customValidators";

	
    export let title;
    const auth = getAuth();

    const login = () => {
        let email = document.getElementById("emailInput").value
        let password = document.getElementById("passInput").value

        if (title === 'Login') {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem("uid", user.uid);
                goto('/');
            })
            .catch(e => console.log(e));
        } else {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                        const user = userCredential.user;
                        localStorage.setItem("uid", user.uid);
                        goto('/');
            })
            .catch(e => console.log(e));
        }

    } 
	const form = useForm();
	const requiredMessage = "This field is required";
</script>

<main>
    <h1 class="text-3xl">
        {title}
    </h1>

    <form use:form>
		<label for="email">Email</label>
		<input type="email" name="email" use:validators={[required, email]} />
		<HintGroup for="email">
			<Hint on="required">{requiredMessage}</Hint>
			<Hint class="text-md" on="email" hideWhenRequired>This must be a valid email</Hint>	
		</HintGroup>

		<label for="name">Name</label>
		<input type="text" name="name"  />

		<label for="password">Password</label>
		<input type="password" name="password" use:validators={[required, minLength(5), containNumbers(2)]} />
		<HintGroup for="password">
			<Hint on="required">{requiredMessage}</Hint>
			<Hint on="minLength" hideWhenRequired let:value>This field must have at least {value} characters.</Hint>	
			<Hint on="containNumbers" hideWhen="minLength" let:value>
				This field must contain at least {value} numbers.
			</Hint>	
		</HintGroup>

		<label for="passwordConfirmation">Password Confirmation</label>
		<input type="password" name="passwordConfirmation" use:validators={[required, passwordMatch]} />
		<HintGroup for="passwordConfirmation">
			<Hint on="required">{requiredMessage}</Hint>
			<Hint on="passwordMatch" hideWhenRequired>Passwords do not match</Hint>	
		</HintGroup><br />

		<button disabled={!$form.valid} on:click|preventDefault>
			Submit
		</button>
	</form>
</main>


<style>
    form {
        width: 778px;
        @apply p-4;
        @apply border-black;
        @apply border-2;
    }
</style>