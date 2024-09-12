'use client'

import { cn } from '@/lib/utils';
import type { CellProps, CheckboxProps, ColumnProps, RowProps, TableBodyProps, TableBodyRenderProps, TableHeaderProps, TableProps } from 'react-aria-components';
import { Button, Cell, Checkbox, Collection, Column, Row, Table, TableBody, TableHeader, useTableOptions } from 'react-aria-components';
import { LuCheck, LuMinus } from 'react-icons/lu';

export function MyTable(Props: TableProps) {
    return <Table {...Props} className="w-full caption-bottom text-sm" />
}
export function MyTableBody(Props: TableBodyProps<TableBodyRenderProps>) {
    return <TableBody {...Props} className="w-full caption-bottom text-sm" />
}
export function MyColumn({ className, ...props }: ColumnProps) {
    return (
        <Column className={cn("cursor-default border-l border-accent bg-foreground p-4 font-bold capitalize text-primary outline-none first-of-type:border-none [&:has([role=checkbox])]:p-2 [&:has([role=checkbox])]:text-center", className)} {...props}>
            {props.children}
        </Column>
    );
}
export function MyTableHeader<T extends object>(
    { columns, children }: TableHeaderProps<T>
) {
    const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();

    return (
        <TableHeader className='sticky top-0 z-10 h-10'>
            {/* Add extra columns for drag and drop and selection. */}
            {allowsDragging && <Column />}
            {selectionBehavior === 'toggle' && (
                <Column className="bg-foreground px-4">
                    {selectionMode === 'multiple' && <MyCheckbox slot="selection" />}
                </Column>
            )}
            <Collection items={columns}>
                {children}
            </Collection>
        </TableHeader>
    );
}

export function MyRow<T extends object>(
    { id, columns, children, ...otherProps }: RowProps<T>
) {
    const { selectionBehavior, allowsDragging } = useTableOptions();

    return (
        <Row id={id} {...otherProps} className="relative border-b border-accent outline-none selected:bg-foreground hover:bg-accent/20">
            {allowsDragging && (
                <Cell>
                    <Button slot="drag">≡</Button>
                </Cell>
            )}
            {selectionBehavior === 'toggle' && (
                <Cell>
                    <MyCheckbox slot="selection" />
                </Cell>
            )}
            <Collection items={columns}>
                {children}
            </Collection>
        </Row>
    );
}

export function MyCell(Props: CellProps) {
    return (
        <Cell {...Props} className={cn("border-l border-accent p-4 text-primary first-of-type:border-none")} />
    )
}

function MyCheckbox(props: CheckboxProps) {
    return (
        <Checkbox {...props} className="flex justify-center">
            {({ isSelected, isIndeterminate }) => (
                <>
                    <div className={cn(isSelected && "bg-foreground", "size-5 flex-shrink-0 rounded flex items-center justify-center border border-accent transition")}>
                        {isIndeterminate
                            ? <LuMinus aria-hidden className="size-4 text-secondary" />
                            : isSelected
                                ? <LuCheck aria-hidden className="size-4 text-secondary" />
                                : null
                        }
                    </div>
                    {props.children}
                </>
            )}
        </Checkbox>
    );
}
