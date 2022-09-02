<script>
    import cfg from "./firebaseConfig";
    import Archives from "../components/Archives.svelte";
    import { initializeApp } from "firebase/app";
    import { collection, orderBy, getDocs, query, getFirestore, onSnapshot } from "firebase/firestore";
    const app = initializeApp(cfg);
    const db = getFirestore(app);



    $: inputValue = "";
    $: aggregateSum = 0;
    // @ts-ignore
    $: data = [];
    $: tag = "";
    // @ts-ignore
    $: displayData = [];
    // @ts-ignore
    let timestampData = [];

    const updateAggregateSum = () => {
        try {
            aggregateSum = displayData.reduce((sum, dataObject) => {
                return sum + dataObject.amount;
            }, 0)
        } catch (err) {
            console.log(err);
        }
    }

    const getData = async () => {
        // @ts-ignore
        let res = [];
        let months = new Set();
        try {
            const col= collection(db, "records")
            const querySnapshot = await getDocs(query(col, orderBy("dateCreated", "desc")));
            querySnapshot.forEach(doc => {
                res.push(doc.data());
                let month = new Date(doc.data().dateCreated.seconds  * 1000).getMonth();
                months.add(month)
            })

            months.forEach(m => timestampData.push(m))

           // @ts-ignore
            return Promise.resolve(res)
            .then(t => Promise.resolve(t))
            .then(t => {
                data = t;
                displayData = data;
                aggregateSum = displayData.reduce((total, dataObject) => {
                    return total + dataObject.amount;
                }, 0);
                return Promise.resolve();
            })
        } catch (e) {
            return Promise.reject("Cannot access data!");
        }
    }

    // @ts-ignore
    const filterDataByTag = tag => {
        console.log(`Filtering out tags == ${tag}`)
        // @ts-ignore
        displayData = data.filter(dataObject => {
            let tmp = false;
            // @ts-ignore
            dataObject.tags.forEach(t=> {
                tmp = t.match(tag) ? true : false;
            })
            return tmp;
        })
        updateAggregateSum();
    }

</script>

<main>
   {#await getData()}
    <div class="text-3xl">Loading data...</div>
   {:then}
    <div class="grid grid-cols-5 w-full px-8">
        <div class="container col-start-1 col-span-2">
            {#each displayData as dataObject}
                <div class="amount">{dataObject.amount.toLocaleString('en-US')}</div>
                <div class="expenseData">
                    <div class="title">{dataObject.title}</div>
                    {#each dataObject.tags as tag}
                    <div class="border-green-600 tag-selection">{tag}</div>
                    {/each}
                </div>
                <br><hr>
            {/each}
        </div>
        <div class="container items-end fixed max-w-fit justify-self-end">
            <div class="text-5xl">Total: {aggregateSum.toLocaleString('en-US')}</div>
            <input type="text" placeholder="SORT BY TAG"  bind:value={inputValue} on:input={() => filterDataByTag(inputValue.toLowerCase())}>
            <Archives months={
                // @ts-ignore
                timestampData
                }/>
    
        </div>
    </div>
   {/await}
</main>

<style>
    .amount {
        @apply text-xl;
        @apply font-bold;
    }

    .expenseData {
        @apply text-lg; 
        @apply flex;
        @apply flex-col;
    }
</style>

