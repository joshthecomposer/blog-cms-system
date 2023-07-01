import { useState } from 'react'
import Draggable from 'react-draggable';

const ReorderableTextareaList = () => {
  const [textareas, setTextareas] = useState([
    { id: 1, text: 'Textarea 1' },
    { id: 2, text: 'Textarea 2' },
    { id: 3, text: 'Textarea 3' },
    // Add more textareas as needed
  ]);

  const handleDrag = (index : any, newPosition : any) => {
    const newOrder = [...textareas];
    const [removed] = newOrder.splice(index, 1);
    newOrder.splice(newPosition, 0, removed);
    setTextareas(newOrder);
  };

  return (
    <div className="flex flex-col">
      {textareas.map((textarea, index) => (
        <Draggable
          key={textarea.id}
          //@ts-ignore
          onStop={(e, data) => handleDrag(index, data.node.getBoundingClientRect().top)}
          axis="y"
        >
          <textarea
            value={textarea.text}
            onChange={(e) => {
              const updatedTextareas = [...textareas];
              updatedTextareas[index].text = e.target.value;
              setTextareas(updatedTextareas);
            }}
          />
        </Draggable>
      ))}
    </div>
  );
};

export default ReorderableTextareaList
