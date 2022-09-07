<script>
    //@ts-nocheck
    import Archives from "../components/Archives.svelte";
    import { collection, orderBy, getDocs, query, getFirestore, onSnapshot } from "firebase/firestore";

    const db = getFirestore();



    $: inputValue = "";
    $: aggregateSum = 0;

    $: data = [];
    $: tag = "";

    $: displayData = [];
    let timestampData;
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

    const parseTimestamps = (timestamps) => {
        let tmp;
        let res = {};
        timestamps.forEach(t => {
            tmp = new Date(t.seconds * 1000);
            let year = tmp.getFullYear();
            let month = tmp.getMonth();
            if (res[year] === undefined) {
                res[year] = [];
            }

            res[year].push(month);
        })

        for (const year in res) {
            res[year] = [... new Set(res[year])]
        }
        return res;
    }

    const getData = async () => {
        let tsData = [];
        let res = [];
        try {
            const col= collection(db, "records")
            const querySnapshot = await getDocs(query(col, orderBy("dateCreated", "desc")));
           
            querySnapshot.forEach(doc => {
                res.push(doc.data());
            })

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

                let timestamps = [];

                t.forEach(u => {
                    timestamps.push(u.dateCreated);
                })

                timestampData = parseTimestamps(timestamps);
                return Promise.resolve();
            })
        } catch (e) {
            return Promise.reject("Cannot access data!");
        }
    }

    const filterDataByTag = tag => {
        displayData = data.filter(dataObject => {
            let tmp = false;
            dataObject.tags.forEach(t=> {
                tmp = t.match(tag) ? true : false;
            })
            return tmp;
        })
        updateAggregateSum();
    }

    const handleFilterByData = e => {
        if (e.detail.month === -1) {
            data = redundancyData.filter(obj => {
                let tmp = new Date(obj.dateCreated.seconds * 1000).getFullYear();
                return e.detail.year == tmp;
            })
            filterDataByTag('') // this is to update displayData
        } else {
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
    <div class="loading">Loading data...</div>
   {:then}
    <div class="grid-container">
        <div class="col-start-1 col-span-2">
            {#each displayData as dataObject}
                <div class="amount">{dataObject.amount.toLocaleString('en-US')}</div>
                <div class="expenseData">
                    <div class="text-xl">{dataObject.title}</div>
                    {#each dataObject.tags as tag}
                    <div class="border-green-600 tag-selection">{tag}</div>
                    {/each}
                </div>
                <br><hr>
            {/each}
        </div>
        <div class="col-start-4 col-span-2">
            <div class="fixed flex flex-col gap-4">
                <div class="container">
                    <div class="subtext">TOTAL</div>
                    <div class="title">{aggregateSum.toLocaleString('en-US')}</div>
                </div>               
                <div class="container">
                    <input type="text" placeholder="SORT BY TAG"  bind:value={inputValue} on:input={() => filterDataByTag(inputValue.toLowerCase())}>
                    <Archives timestamps={
                        // @ts-ignore
                        timestampData
                        }
                    on:message={handleFilterByData}
                    />
                </div>
            </div>
    
        </div>
    </div>
   {/await}
</main>

<style>
    .subtext {
        @apply text-lg;
        @apply text-gray-500;
        @apply font-medium;
    }

    .title {
        @apply text-5xl;
        @apply font-bold;
    }
    .container {
        @apply flex;
        @apply flex-col;
        @apply gap-0;
    }
    .grid-container {

        @apply grid;
        @apply grid-cols-4;
        @apply w-full;
        @apply px-8;
    }
    .loading {
        @apply text-3xl;
        @apply uppercase;
        @apply font-medium;
    }

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

