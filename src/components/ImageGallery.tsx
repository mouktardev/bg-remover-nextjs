"use client"

import { ResultCellProps, ResultCellView, ResultRowView, useDelRowCallback, useHasTable, useQueries, useResultCell, useResultSortedRowIds, useResultTableCellIds } from '@/lib/schema';
import { getSizeTrans } from '@/lib/utils';
import { default as NextImage } from "next/image";
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Key } from 'react-aria-components';
import { LuArrowDown, LuArrowUp, LuSearchX, LuZoomIn } from 'react-icons/lu';
import { toast } from 'sonner';
import RowActions from './RowActions';
import SearchBar from './SearchBar';
import SelectedToolBar from './SelectedToolBar';
import { MyCell, MyColumn, MyRow, MyTable, MyTableBody, MyTableHeader } from './ui/TableAria';

export default function ImageGallery() {
  const data = useHasTable("images");
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const queriesReference = useQueries();
  const queryTableCellIds = useResultTableCellIds("imagesQuery");
  const queryTableRowIds = useResultSortedRowIds(
    "imagesQuery",
    searchParams.get("sort-by") ? searchParams.get("sort-by") as string : "id",
    searchParams.get("order") ? true : false,
    0,
    undefined,
  );

  const handleSortAndToggleOrder = (sortBy: string) => {
    const params = new URLSearchParams(searchParams)
    if (sortBy) {
      params.set('sort-by', sortBy)
    } else {
      params.delete('sort-by')
    }
    if (!searchParams.get('order')) {
      params.set('order', 'descending')
    } else {
      params.delete('order')
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }


  const [selectedKeys, setSelectedKeys] = useState<"all" | Iterable<Key> | undefined>(new Set());


  return (
    <>
      {data ?
        <>
          <SearchBar />
          {searchParams.get("layout") === "table" ?
            <div className="space-y-3">
              <SelectedToolBar selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} />
              <div className="customScrollStyle relative max-h-[700px] rounded-lg border border-accent">
                <MyTable aria-label="images" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} selectionMode="multiple">
                  <MyTableHeader>
                    {queryTableCellIds.filter((value) => !["imageUrl", "transformedImageUrl"].includes(value)).map((value) => (
                      <MyColumn key={value} id={value} isRowHeader>
                        <button type="button" className="flex gap-2 outline-none" onClick={() => handleSortAndToggleOrder(value)}>
                          {value}
                          {(searchParams.get('sort-by') === value || (value === 'name' && !searchParams.get('sort-by'))) && (
                            searchParams.get('order') ? (
                              <LuArrowDown className="size-4" />
                            ) : (
                              <LuArrowUp className="size-4" />
                            )
                          )}
                        </button>
                      </MyColumn>
                    ))}
                    <MyColumn id="action" isRowHeader>actions</MyColumn>
                  </MyTableHeader>
                  <MyTableBody className="[&_tr:last-child]:border-0" renderEmptyState={() =>
                    <div className="col-span-full flex h-64 items-center justify-center gap-4 text-secondary">
                      <LuSearchX className="size-5" />
                      <p>Image not found</p>
                    </div>
                  }>
                    {queryTableRowIds.map((rowId) => {
                      const id = queriesReference?.getResultCell("imagesQuery", rowId, "id")
                      return (
                        <MyRow key={`${id}`} id={`${id}`}>
                          <ResultRowView
                            queryId="imagesQuery"
                            rowId={rowId}
                            resultCellComponent={TableCell} />
                          <MyCell>
                            <RowActions rowId={`${id}`} />
                          </MyCell>
                        </MyRow>
                      )
                    })}
                  </MyTableBody>
                </MyTable>
              </div>
            </div>
            :
            <div className="grid grid-cols-2 gap-3 rounded-md border border-accent bg-foreground p-5 md:grid-cols-3 lg:grid-cols-4">
              {queryTableRowIds.length > 0 ?
                queryTableRowIds.map((rowId) => (
                  <div key={rowId} className="group relative max-h-[200px] max-w-[200px] overflow-hidden rounded-md border border-accent shadow-lg">
                    <ResultRowView
                      queryId={"imagesQuery"}
                      rowId={rowId}
                      resultCellComponent={GridCell}
                    />
                  </div>
                ))
                :
                <div className="col-span-full flex h-64 items-center justify-center gap-4 text-secondary ">
                  <LuSearchX className="size-5" />
                  <p>search not found</p>
                </div>
              }
            </div>
          }
        </>
        :
        null // your own component for telling users no images dropped
      }
    </>
  )
}

const TableCell = (props: typeof ResultCellProps) => {
  const size = getSizeTrans(useResultCell("imagesQuery", props.rowId, "size") as number)

  if (props.cellId === "imageUrl" || props.cellId === "transformedImageUrl") {
    return null
  }
  return props.cellId === "size" ?
    <MyCell>
      {size}
    </MyCell>
    :
    <MyCell>
      <ResultCellView {...props} />
    </MyCell>

}
const GridCell = (props: typeof ResultCellProps) => {
  const id = useResultCell(props.queryId, props.rowId, "id", props.queries) as string
  const name = useResultCell(props.queryId, props.rowId, "name", props.queries) as string
  const width = useResultCell(props.queryId, props.rowId, "width", props.queries) as number
  const height = useResultCell(props.queryId, props.rowId, "height", props.queries) as number
  const imageUrl = useResultCell(props.queryId, props.rowId, "imageUrl", props.queries) as string
  const transformedImageUrl = useResultCell(props.queryId, props.rowId, "transformedImageUrl", props.queries) as string
  const searchParams = useSearchParams()

  const removeImage = useDelRowCallback(
    "images",
    id,
    undefined,
    () => {
      toast.message(`Deleted image:${name}`);
    }
  );
  return props.cellId === "imageUrl" ? (
    <>
      <NextImage
        src={transformedImageUrl || imageUrl}
        width={width}
        height={height}
        alt={name}
        className="size-full object-contain transition-all group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button
          type='button'
          onClick={removeImage}
          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-background/50 text-primary hover:bg-background/70"
          aria-label={`Remove image ${name}`}
        >
          &#x2715;
        </button>
        <Link href={`/images/${id}?${searchParams.toString()}`} scroll={false}>
          <LuZoomIn className="size-8 text-primary/50 hover:text-primary" />
        </Link>
      </div>
    </>
  ) : null
}