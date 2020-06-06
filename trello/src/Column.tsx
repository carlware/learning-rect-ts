import React, { useRef } from "react"
import { ColumnContainer, ColumnTitle } from "./styles"
import { Card } from "./Card"
import { AddNewItem } from "./AddNewItem"
import { useItemDrag } from "./useItemDrag"
import { useDrop } from "react-dnd"
import { DragItem } from "./DragItem"
import { isHidden } from "./utils/isHidden"
import { useAppState } from "./AppStateContext"

interface ColumnProps {
    text: string
    id: string
    index: number
}


export const Column = ({
    text,
    index,
    id
}: React.PropsWithChildren<ColumnProps>) => {
    const { state, dispatch } = useAppState()
    const ref = useRef<HTMLDivElement>(null)

    const [, drop] = useDrop({
        accept: "COLUMN",
        hover(item: DragItem) {
            if (item.type === "COLUMN") {
                const dragIndex = item.index
                const hoverIndex = index

                if (dragIndex === hoverIndex) {
                    return
                }

                dispatch({ type: "MOVE_LIST", payload: { dragIndex, hoverIndex } })
                item.index = hoverIndex
            }
        }
    })

    const { drag } = useItemDrag({ type: "COLUMN", id, index, text })
    drag(drop(ref))

    return (
        <ColumnContainer ref={ref} isHidden={isHidden(state.draggedItem, "COLUMN", id)}>
            <ColumnTitle>{text}</ColumnTitle>
            {state.lists[index].tasks.map((task, i) => (
                <Card text={task.text} key={task.id} index={i} />
            ))}
            <AddNewItem
                toggleButtonText="+ Add another task"
                onAdd={console.log}
                dark
            />
        </ColumnContainer>
    )
}
