<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { formData } from "../stores.js";
    export let reset = false;
    // @ts-ignore
    let title, qty;
    $: {
        if (true) {
            // @ts-ignore
            $formData = [title, qty];
        }
    }

    $: {
        if (reset) {
            title = "";
            qty = "";
            dispatch("message", {
                resetFired : true,
            })
        }
    }


</script>


<main>
    <div class="forms-container">
        <input name="fname" type="text" placeholder="Title" bind:value={//@ts-ignore
        title} autocomplete="off" required>

        <input name="fnum" type="number" placeholder="Cost" bind:value={//@ts-ignore
        qty} autocomplete="off" required>
    </div>
</main>

<style>
    .forms-container {
        @apply flex;
        @apply flex-col;
        @apply gap-4;
    }

    input{
        @apply p-4;
        @apply box-border;
        @apply text-4xl;
        @apply border-b-2;
        @apply border-gray-600;
    }

    button[type="submit"]{
        @apply border-red-400;
        @apply p-2;
        @apply border-2;
        @apply box-border;
    }

    /* Input button styling */


/* To remove the arrow sidebar in the "Cost" input.
/* Other Browsers */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

/* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    }
</style>