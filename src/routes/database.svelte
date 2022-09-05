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
    let timestampData;
    // @ts-ignore
    let redundancyData;

    const updateAggregateSum = () => {
        try {
            aggregateSum = displayData.reduce((sum, dataObject) => {
                return sum + dataObject.amount;
            }, 0)
        } catch (err) {
            console.log(err);
        }
    }

    // @ts-ignore
    const parseTimestamps = (timestamps) => {
        let tmp;
        let res = {};
        // @ts-ignore
        timestamps.forEach(t => {
            tmp = new Date(t.seconds * 1000);
            let year = tmp.getFullYear();
            let month = tmp.getMonth();
            // @ts-ignore
            if (res[year] === undefined) {
                // @ts-ignore
                res[year] = [];
            }

            // @ts-ignore
            res[year].push(month);
        })

        for (const year in res) {
            // @ts-ignore
            res[year] = [... new Set(res[year])]
        }
        return res;
    }

    const getData = async () => {
        // @ts-ignore
        let tsData = [];
        // @ts-ignore
        let res = [];
        try {
            const col= collection(db, "records")
            const querySnapshot = await getDocs(query(col, orderBy("dateCreated", "desc")));
           
            querySnapshot.forEach(doc => {
                res.push(doc.data());
            })


           // @ts-ignore
            // @ts-ignore
            return Promise.resolve(res)
            .then(t => {
                data = t;
                redundancyData = t;
                data = redundancyData.filter(t => {
                    let dataEntryYear = new Date(t.dateCreated.seconds * 1000).getFullYear();
                    let currentYear = new Date().getFullYear();
                    return dataEntryYear === currentYear; 
                });
                displayData = data;
                aggregateSum = displayData.reduce((total, dataObject) => {
                    return total + dataObject.amount;
                }, 0);
                // @ts-ignore
                let timestamps = [];
                t.forEach(u => {
                    timestamps.push(u.dateCreated);
                })
                // @ts-ignore

                timestampData = parseTimestamps(timestamps);
                return Promise.resolve();
            })
        } catch (e) {
            return Promise.reject("Cannot access data!");
        }
    }

    // @ts-ignore
    const filterDataByTag = tag => {
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

    // @ts-ignore
    const handleFilterByData = e => {
        if (e.detail.month === -1) {
            // @ts-ignore
            data = redundancyData.filter(obj => {
                let tmp = new Date(obj.dateCreated.seconds * 1000).getFullYear();
                return e.detail.year == tmp;
            })
            filterDataByTag('') // this is to update displayData
        } else {
            // @ts-ignore
            data = redundancyData.filter(obj => {
                let objMonth = new Date(obj.dateCreated.seconds * 1000).getMonth();
                let objYear = new Date(obj.dateCreated.seconds * 1000).getFullYear();
                return ( objMonth == e.detail.month && objYear == e.detail.year)
            })
            filterDataByTag(''); // this is to update displayTags (shitty but works)
        }
    }

</script>

<main>
   {#await getData()}
    <div class="text-3xl">Loading data...</div>
   {:then}
    <div class="grid grid-cols-5 w-full px-8">
        <div class="overflow-screen container col-start-1 col-span-2">
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
            <Archives timestamps={
                // @ts-ignore
                timestampData
                }

            on:message={handleFilterByData}
            />
    
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

