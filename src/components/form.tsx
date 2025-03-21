'use client';

import { useState } from 'react';
import { addTodo, updateTodo } from '../services/api';
import { ApiRequest, ApiResponse } from '../types';

export default function Form({
  todo,
  parentId,
  addItem,
  updateItem
}: {
  todo?: ApiResponse.Todo;
  parentId?: number;
  addItem?: () => void;
  updateItem?: () => void;
}) {
  if (todo !== undefined && todo.name === undefined && todo.description == undefined && parentId === undefined) {
    return;
  }

  const [formData, setFormData] = todo
    ? useState<ApiRequest.Todo>(todo)
    : useState<ApiRequest.Todo>(parentId ? ({ parentId } as ApiRequest.Todo) : ({} as ApiRequest.Todo));

  const handleInputs = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (isFormInvalid()) {
      alert('Input fields should not be empty!');
      return;
    }

    if (formData.cost === '') {
      formData.cost = null;
    } else if (formData.cost !== undefined) {
      const cost = Number(formData.cost);

      if (isNaN(cost)) {
        alert('Cost should be a number!');
        return;
      }

      formData.cost = cost;
    }

    if (formData.id) {
      try {
        const res = await updateTodo(formData.id, formData);
        setFormData(res);
        updateItem!();
        alert('Item updated!');
      } catch (error) {
        alert((error as Error).message);
      }
    } else {
      try {
        await addTodo(formData);
        delete formData.name;
        delete formData.description;
        delete formData.cost;
        addItem!();
      } catch (error) {
        alert((error as Error).message);
      }
    }
  };

  const isFormInvalid = (): boolean => {
    return (
      formData.name === undefined ||
      formData.description === undefined ||
      formData.name === '' ||
      formData.description === ''
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input onChange={handleInputs} placeholder="Add name" id="name" value={formData.name ?? ''} />
      </div>
      <div>
        <textarea
          onChange={handleInputs}
          placeholder="Add description"
          id="description"
          value={formData.description ?? ''}
        />
      </div>
      <div>
        <input onChange={handleInputs} placeholder="Add cost (EUR)" id="cost" value={formData.cost ?? ''} />
      </div>
      <button type="submit" disabled={isFormInvalid()}>
        Save
      </button>
    </form>
  );
}
