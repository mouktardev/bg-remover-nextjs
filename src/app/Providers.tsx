'use client'

import { Toaster } from "@/components/ui/Toaster";
import { Provider, TablesSchema, useCreateQueries, useCreateStore } from "@/lib/schema";
import { ThemeProvider } from "next-themes";
// import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";
import { createQueries, createStore } from 'tinybase/with-schemas';

export default function Providers({ children }: { children: React.ReactNode }) {
    const store = useCreateStore(() => createStore()
        .setTablesSchema(TablesSchema)
    );

    //create Persister in IndexedDb 
    // useCreatePersister(
    //     store,
    //     (store) => {
    //         return createIndexedDbPersister(store, "store");
    //     },
    //     [],
    //     async (persister) => {
    //         await persister?.startAutoLoad();
    //         await persister?.startAutoSave();
    //     }
    // );

    const queries = useCreateQueries(store, createQueries, []);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
        >
            <Provider store={store} queries={queries}>
                {children}
                <Toaster richColors closeButton />
            </Provider>
        </ThemeProvider>
    )
}