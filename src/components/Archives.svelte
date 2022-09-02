<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // @ts-ignore
    const monthKeys = ['JAN', 'FEB', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    // @ts-ignore
    /**
* @type {any[]}
*/
    export let months= [];

    // @ts-ignore
    const handleMonthSelection = (m, y) => {
        try {
            dispatch("message", {
                month: m,
                year: y
            })
        } catch (err) {
            console.log(`Internal error : ${err}`)
        }
    }


</script>

<!-- <main> -->
    <div class="vcontainer">
        <div class="box">
            {#each months as month}
                <button class="month-selection" on:click={() => handleMonthSelection(month)}>
                    <div class="hcontainer">
                        <div class="month">{monthKeys[month]}</div>
                        <!-- <div class="purchase-count">{month.count}</div> -->
                    </div>
                </button>
            {/each}
        </div>
    </div>
<!-- </main> -->