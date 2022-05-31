<DragDropContext onDragEnd={onDragEnd}>
<Droppable droppableId="droppable">
  {(provided, snapshot) => (
    <div {...provided.droppableProps} ref={provided.innerRef}>
    

      {items.map((item, index) => (
        <Draggable key={item.id} draggableId={item.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              {item.text}
            </div>
          )}
        </Draggable>
      ))}


      {provided.placeholder}
    </div>
  )}
</Droppable>
</DragDropContext>