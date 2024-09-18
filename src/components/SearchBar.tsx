import { useQueries, useResultTableCellIds } from '@/lib/schema'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { LuArrowDownZA, LuArrowUpAZ, LuChevronDown, LuLayoutGrid, LuLayoutList, LuSearch } from 'react-icons/lu'
import { useDebouncedCallback } from 'use-debounce'
import { Button } from './ui/Button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/Select'

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

    const handleSort = (sortBy: string) => {
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

    const selectOptions = useResultTableCellIds("imagesQuery")
        .filter((value) => !["imageUrl", "transformedImageUrl"].includes(value))
        .map((value) => value)

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
                    value={searchParams.get("query")?.toString()}
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
            <Select
                value={searchParams.get("sort-by") ? searchParams.get("sort-by") as string : "name"}
                onValueChange={handleSort}>
                <SelectTrigger asChild>
                    <Button type="button" variant={'outline'}>
                        <SelectValue placeholder="sort by" />
                        <LuChevronDown className="ml-2 size-4" />
                    </Button>
                </SelectTrigger>
                <SelectContent
                    ref={(ref) => {
                        if (!ref) return;
                        ref.ontouchstart = (e) => {
                            e.preventDefault();
                        };
                    }}>
                    <SelectGroup>
                        {selectOptions.map(option =>
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>)
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}