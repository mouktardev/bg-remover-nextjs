import { useQueries, useResultTableCellIds } from '@/lib/schema'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Button as ButtonAria, Key, ListBox, ListBoxItem, ListBoxItemProps, Popover, Select, SelectValue } from 'react-aria-components'
import { LuArrowDownZA, LuArrowUpAZ, LuCheck, LuChevronsUpDown, LuLayoutGrid, LuLayoutList, LuSearch } from 'react-icons/lu'
import { useDebouncedCallback } from 'use-debounce'
import { Button } from './ui/Button'

export default function SearchBar() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const queriesReference = useQueries();

    const handleSearch = useDebouncedCallback((searchTerm: string) => {
        const params = new URLSearchParams(searchParams)
        if (searchTerm) {
            params.set("query", searchTerm);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 300);

    const handleSort = (sortBy: Key) => {
        const params = new URLSearchParams(searchParams)
        if (sortBy) {
            params.set("sort-by", sortBy.toString());
        } else {
            params.delete("sort-by");
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const toggleOrder = () => {
        const params = new URLSearchParams(searchParams)
        if (!searchParams.get("order")) {
            params.set("order", "descending");
        } else {
            params.delete("order");
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const toggleLayout = () => {
        const params = new URLSearchParams(searchParams)
        if (!searchParams.get("layout")) {
            params.set("layout", `table`);
        } else {
            params.delete("layout");
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false })
    }


    useEffect(() => {
        queriesReference?.setQueryDefinition(
            "imagesQuery", //queryId
            "images", //tableId
            ({ select, having, join }) => {
                //columns add
                select((_, rowId) => parseInt(rowId)).as("id");
                select("name")
                select("imageUrl")
                select("transformedImageUrl")
                select("size");
                select("mediaType");
                select("height");
                select("width");
                having((getCell) =>
                    (getCell("name") as string)
                        .includes(searchParams.get("query") || "")
                );
            }
        );
        return () => {
            queriesReference?.destroy()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    const queryTableCellIds = useResultTableCellIds("imagesQuery");

    return (
        <div className="flex flex-wrap justify-center gap-3">
            <Button type='button' variant={'outline'} onClick={toggleLayout}>
                {searchParams.get("layout") === "table" ? (
                    <LuLayoutGrid className="size-5" />
                ) : (
                    <LuLayoutList className="size-5" />
                )}
            </Button>
            <div className="relative">
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <input className="peer rounded-md border border-accent bg-foreground py-[9px] pl-10 text-sm text-primary placeholder:text-secondary focus:border-actionForeground focus:outline-none"
                    placeholder="search"
                    defaultValue={searchParams.get("query")?.toString()}
                    onChange={(e) => {
                        handleSearch(e.target.value)
                    }}
                />
                <LuSearch className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-secondary peer-focus:text-primary" />
            </div>
            <Button type='button' variant={'outline'} onClick={toggleOrder}>
                {searchParams.get("order") === "descending" ? (
                    <LuArrowDownZA className="size-4" />
                ) : (
                    <LuArrowUpAZ className="size-4" />
                )}
            </Button>
            <Select aria-label='sort-by' onSelectionChange={handleSort}>
                <ButtonAria className="inline-flex size-full cursor-default items-center gap-2 rounded-lg border border-accent bg-foreground px-2 py-1 text-left text-base leading-normal shadow-md transition pressed:bg-foreground/50 focus:outline-none">
                    <SelectValue className="flex-1 truncate">
                        {({ defaultChildren, isPlaceholder }) => {
                            return isPlaceholder ? <p className='text-secondary'>sort by</p> : defaultChildren;
                        }}
                    </SelectValue>
                    <LuChevronsUpDown className='size-4' />
                </ButtonAria>
                <Popover className="max-h-60 overflow-auto rounded-md border border-accent bg-foreground text-base shadow-lg entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out">
                    {queryTableCellIds.length > 0 &&
                        <ListBox className="p-1 outline-none">
                            {queryTableCellIds.filter((value) => !["imageUrl", "transformedImageUrl"].includes(value)).map((value) => (
                                <StatusItem key={value} id={value} textValue={value}>
                                    {value}
                                </StatusItem>
                            ))}
                        </ListBox>}
                </Popover>
            </Select>
        </div>
    )
}

function StatusItem(props: ListBoxItemProps & { children: React.ReactNode }) {
    return (
        <ListBoxItem
            {...props}
            className="group flex cursor-default select-none items-center gap-2 rounded px-4 py-2 text-primary outline-none focus:bg-background focus:text-action"
        >
            {({ isSelected }) => (
                <>
                    <span className="flex flex-1 items-center gap-2 truncate font-normal group-selected:font-medium">
                        {props.children}
                    </span>
                    <span className="flex w-5 items-center text-primary group-focus:text-action">
                        {isSelected && <LuCheck className='size-4' />}
                    </span>
                </>
            )}
        </ListBoxItem>
    );
}