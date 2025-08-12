// src/components/SortableLinkItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Link } from '../services/api';

interface SortableLinkItemProps {
  link: Link;
  children: React.ReactNode;
}

export const SortableLinkItem: React.FC<SortableLinkItemProps> = ({ link, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};