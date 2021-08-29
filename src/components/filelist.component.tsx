import classNames from "classnames";
import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

const reorder = <T extends any>(
  list: T[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const FileListDND: React.FC<{
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}> = ({ files, setFiles }) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = reorder(files, result.source.index, result.destination.index);
    setFiles(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={classNames(
              `grid grid-flow-col overflow-x-scroll shadow-lg`
            )}
          >
            {files.map((file, index) => (
              <Draggable
                key={file.size}
                draggableId={String(file.size)}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={classNames(
                      `md:h-64 md:w-64 w-48 h-48 rounded-lg m-3 select-none `,
                      {
                        "bg-gray-50 shadow-2xl ring-2 ring-indigo-400":
                          snapshot.isDragging,
                        "bg-gray-100 border-2 border-dashed border-indigo-400 ":
                          !snapshot.isDragging,
                      }
                    )}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      className="object-contain w-full h-full"
                    ></img>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
