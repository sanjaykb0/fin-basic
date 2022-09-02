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

<div class="vcontainer bad-fix">
    <div class="hcontainer bad-fix">
        <div class="hcontainer w-full">
            {#each tags as tag}
                <div class="tag-selection border-green-600 hover:border-red-600" on:click={() => removeTag(tag)}>
                    {tag}
                </div>
            {/each}
        </div>

        <form on:submit|preventDefault={handleAddTag}>
            <input class="tag-input" type="text" on:focus|once={() => openDrawer = true} on:input={handleInput} bind:value={inputValue} placeholder={inputDisabled ? "INITIALIZING TAGS...": "+ ADD TAG"} disabled={inputDisabled} autocomplete="off">
        </form>
    </div>

    {#if openDrawer}
    <div class="hcontainer">
        <p class="text">Select a tag(s):</p>
        <div class="hcontainer">
            {#each displayOptions as tag}
            <div class="border-blue-600 tag-selection hover:border-green-600" on:click={() => {inputValue = tag; updateDisplayOptions(); handleAddTag();}}>{tag}</div> <!-- Extremely scuffed solution but werks -->
            {/each}
        </div>
    </div>
    {/if}
</div>

<style>
    .bad-fix {
        width: 495px;
    }

</style>