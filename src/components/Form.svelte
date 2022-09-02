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
    <div class="vcontainer">
        <input class="form-input" name="fname" type="text" placeholder="Title" bind:value={//@ts-ignore
        title} autocomplete="off" required>

        <input class="form-input" name="fnum" type="number" placeholder="Cost" bind:value={//@ts-ignore
        qty} autocomplete="off" required>
    </div>
</main>

<style>
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