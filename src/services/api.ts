'use server';

import { ApiRequest, ApiResponse } from '../types';
import { API_PATH, BASE_URL, PROD_URL } from '../utils/constants';

const SERVER_URL = process.env.NODE_ENV === 'production' ? PROD_URL : BASE_URL;
const API_URL = `${SERVER_URL}${API_PATH}`;

const handleResponse = async (res: Response): Promise<any> => {
  if (res?.ok) {
    return res.json();
  } else {
    const json = await res.json();
    throw new Error((json as ApiResponse.Error).message);
  }
};

export const getTodos = async (parentId?: number): Promise<ApiResponse.Todo[]> => {
  const res = parentId ? await fetch(`${API_URL}?parentId=${parentId}`) : await fetch(API_URL);
  return handleResponse(res) as Promise<ApiResponse.Todo[]>;
};

export const getTodo = async (id: number): Promise<ApiResponse.Todo> => {
  const res = await fetch(`${API_URL}/${id}`);
  return handleResponse(res) as Promise<ApiResponse.Todo>;
};

export const addTodo = async (todo: ApiRequest.Todo): Promise<ApiResponse.Todo> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  });

  return handleResponse(res) as Promise<ApiResponse.Todo>;
};

export const updateTodo = async (id: number, todo: ApiRequest.Todo): Promise<ApiResponse.Todo> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  });

  return handleResponse(res) as Promise<ApiResponse.Todo>;
};

export const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!res?.ok) {
    const json = await res.json();
    throw new Error((json as ApiResponse.Error).message);
  }
};
