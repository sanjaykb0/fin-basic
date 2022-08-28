<script>
    import { tagsData } from "../stores.js";
    // @ts-ignore
    export let reset = false;

    // @ts-ignore
    $: tags = []; // Tags that are added to the "tags" section.
    // @ts-ignore
    $: displayOptions = [...testTags]; // Display options are the ones that show in the "select a tag" section.
    // @ts-ignore
    $: hideOptions = []; // Hide tag option when a tag is selected.
    // @ts-ignore;
    $: inputDisabled = testTags.length === 0 ? true : false;

    $: {
        if (true) {
            // @ts-ignore
            $tagsData = tags;
        }
    }

    $: {
        if (reset) {
            tags.forEach(tag => removeTag(tag));
            inputValue="";
            tags = [];
            updateDisplayOptions();
        }
    }

    // THIS needs to be replaced with a method that retrieves data from firebase.
    //@ts-ignore
    export let testTags = []; // Test tags that are already there; will be replaced by tags stored in some database.
    let openDrawer = false; // Decides if the "select a tag" section is shown or hidden.
    export let inputValue = ""; // Sets the input value to be reset after use

    const updateDisplayOptions = () => {
        //@ts-ignore
        displayOptions = testTags.filter(t => {
            if (t.match(inputValue.toLowerCase()) && !hideOptions.find(hiddenOption => hiddenOption === t)) {
                return true;
            } 
            return false;
        })
    }

    // @ts-ignore
    const handleInput = e => {
        inputValue = e.target.value;
        updateDisplayOptions();
    }
    // @ts-ignore
    const handleAddTag = e => { // Add Tag
        let tagToBeAdded = displayOptions[0];
        tagToBeAdded === undefined ? "" : tags = [...tags, tagToBeAdded];
        tagToBeAdded === undefined ? "" : hideOptions = [...hideOptions, tagToBeAdded];
        inputValue="";
        updateDisplayOptions();
    }

    // @ts-ignore
    const removeTag = str => { // Remove Tag 
        tags = tags.filter(t => t != str);
        hideOptions = hideOptions.filter(t => t != str);
        inputValue = "";
        updateDisplayOptions();
    }


</script>

<div class="container">
    <div class="tag-container">
        <div class="tags">
            {#each tags as tag}
                <div class="tag" on:click={() => removeTag(tag)}>
                    {tag}
                </div>
            {/each}
        </div>

        <form on:submit|preventDefault={handleAddTag}>
            <input type="text" name="fish" on:focus|once={() => openDrawer = true} on:input={handleInput} bind:value={inputValue} placeholder={inputDisabled ? "INITIALIZING TAGS...": "+ ADD TAG"} disabled={inputDisabled} autocomplete="off">
        </form>
    </div>

    {#if openDrawer}
        <div class="current-tags">
            <p class="text">Select a tag(s):</p>
            <div class="tags">
                {#each displayOptions as tag}
                    <div class="tag-selection" on:click={() => {inputValue = tag; updateDisplayOptions(); handleAddTag();}}>{tag}</div> <!-- Extremely scuffed solution but werks -->
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>

    .current-tags {
        @apply w-full;
    }
    .container {
        @apply flex;
        @apply gap-2;
        @apply flex-col;
        max-width: 554px; /* Shitty fix but werks */
    }

    input {
        @apply w-full;
    }

    .tag-selection {
        @apply px-2;
        @apply border-green-400;
        @apply border-2;
        @apply rounded-lg;
        @apply text-green-400;
        @apply cursor-pointer;
    }

    .tag:hover, .tag-selection:hover {
        @apply border-red-400;
        @apply text-red-400;
        @apply cursor-pointer;
    }

    .tag-container {
        @apply flex;
        @apply gap-2;
        @apply flex-row;
    }

</style>