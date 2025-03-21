export namespace ApiResponse {
  export interface Todo {
    id: number;
    name: string;
    description: string;
    cost: number | null;
    parentId: number | null;
    completed: boolean;
    children: Todo[];
  }

  export interface Error {
    message: string;
  }
}

export namespace ApiRequest {
  export interface Todo {
    id?: number;
    name?: string;
    description?: string;
    cost?: number | string | null;
    parentId?: number | null;
    completed?: boolean;
  }
}
