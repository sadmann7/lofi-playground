import * as React from "react"
import { Fragment, useEffect, useState } from "react"
import type { Todo } from "@prisma/client"
import { useIsMutating } from "@tanstack/react-query"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { api } from "@/lib/api-beta"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const schema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
})
type Inputs = z.infer<typeof schema>

export function TodoList() {
  const apiUtils = api.useContext()
  // todos query
  const todosQuery = api.todo.getAll.useQuery(undefined, {
    staleTime: 3000,
  })

  // add todo mutation
  const addTodoMutation = api.todo.create.useMutation({
    onMutate: async () => {
      await apiUtils.todo.getAll.cancel()

      apiUtils.todo.getAll.setData(undefined, (oldTodos) => {
        if (!oldTodos) return
        return [...oldTodos]
      })
      toast.success("Todo added.")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // delete todos mutation
  const deleteTodosMutation = api.todo.deleteMany.useMutation({
    onMutate: async () => {
      await apiUtils.todo.getAll.cancel()
      const allTodos = apiUtils.todo.getAll.getData()
      if (!allTodos) return
      const newTodos = allTodos.filter((todo) => !todo.completed)
      apiUtils.todo.getAll.setData(undefined, newTodos)
      toast.success("Todos deleted.")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // refetch todos
  const number = useIsMutating()
  useEffect(() => {
    if (number === 0) {
      void apiUtils.todo.getAll.invalidate()
    }
  }, [number, apiUtils])

  // react-hook-form
  const [showInput, setShowInput] = useState(false)
  const { register, setFocus, handleSubmit, reset } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await addTodoMutation.mutateAsync(data.name)
    setShowInput(false)
    reset()
  }
  // setFocus on showInput change
  React.useEffect(() => {
    setFocus("name")
  }, [setFocus, showInput])

  return (
    <div className="space-y-2.5">
      <ul className="mt-5 grid gap-5">
        {todosQuery.isSuccess &&
          todosQuery.data.map((todo) => <TodoCard todo={todo} key={todo.id} />)}
      </ul>
      <form onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}>
        {showInput ? (
          <Fragment>
            <Input
              id="todo"
              type="text"
              placeholder="Type todo..."
              {...register("name", { required: true })}
            />
            <div className="mt-3 flex">
              <div className="ml-auto flex items-center space-x-3">
                <Button
                  type="button"
                  aria-label="Cancel"
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowInput(false)}
                >
                  Cancel
                </Button>
                <Button
                  aria-label="Add todo"
                  size="sm"
                  disabled={addTodoMutation.isLoading}
                >
                  {addTodoMutation.isLoading && (
                    <Icons.spinner
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Add Todo
                </Button>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className="flex items-center justify-between gap-5">
            <Button
              aria-label="Open add todo input"
              type="button"
              variant="ghost"
              className="p-0 hover:bg-transparent"
              onClick={() => setShowInput(true)}
            >
              <Icons.add
                className="mr-2 h-5 w-5 text-red-400"
                aria-hidden="true"
              />
              <p className="text-slate-400">Add todo</p>
            </Button>
            {todosQuery.isSuccess &&
              todosQuery.data.some((todo) => todo.completed) && (
                <div
                  role="button"
                  aria-label="delete completed todos"
                  className="flex cursor-pointer items-center space-x-2 text-xs text-gray-400 transition-opacity hover:opacity-80 active:opacity-100 md:text-sm"
                  onClick={() => void deleteTodosMutation.mutate()}
                >
                  Delete completed
                </div>
              )}
          </div>
        )}
      </form>
    </div>
  )
}

const TodoCard = ({ todo }: { todo: Todo }) => {
  const apiUtils = api.useContext()
  const [isHoverd, setIsHoverd] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [todoName, setTodoName] = React.useState(todo.name)

  // update todo mutation
  const updateTodoMutation = api.todo.update.useMutation({
    onMutate: async ({ id, completed, name }) => {
      await apiUtils.todo.getAll.cancel()
      const allTodos = apiUtils.todo.getAll.getData() ?? []
      const newTodos = allTodos.map((todo) =>
        todo.id === id ? { ...todo, completed, name } : todo
      )
      apiUtils.todo.getAll.setData(undefined, newTodos as Todo[])
      toast.success("Todo updated.")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // delete todo mutation
  const deleteTodoMutation = api.todo.delete.useMutation({
    onMutate: async (id) => {
      await apiUtils.todo.getAll.cancel()
      const allTodos = apiUtils.todo.getAll.getData() ?? []
      const newTodos = allTodos.filter((todo) => todo.id !== id)
      apiUtils.todo.getAll.setData(undefined, newTodos)
      toast.success("Todo deleted!")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <li
      className={cn(
        "flex h-5 cursor-pointer",
        isEditing ? "flex-col" : "flex-row items-center justify-between gap-2"
      )}
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
      onDoubleClick={() => setIsEditing(!isEditing)}
    >
      {isEditing ? (
        <Fragment>
          <Input
            id="editableTodo"
            type="text"
            className="w-full rounded-md bg-black/50 px-4"
            onChange={(e) => {
              setTodoName(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && todoName.length > 0) {
                updateTodoMutation.mutate({
                  id: todo.id,
                  completed: todo.completed,
                  name: todo.name,
                })
                setIsEditing(false)
              }
            }}
            defaultValue={todoName}
            autoFocus={isEditing}
          />
          <div className="mt-3 flex">
            <div className="ml-auto flex items-center space-x-3">
              <Button
                aria-label="Cancel"
                type="button"
                variant="destructive"
                onClick={() => setIsEditing(!isEditing)}
                disabled={updateTodoMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                aria-label="Save todo"
                size="sm"
                onClick={() => {
                  updateTodoMutation.mutate({
                    id: todo.id,
                    name: todo.name,
                  })
                  setIsEditing(false)
                }}
                disabled={todoName.length <= 0 || updateTodoMutation.isLoading}
              >
                {updateTodoMutation.isLoading && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Save
              </Button>
            </div>
          </div>
        </Fragment>
      ) : (
        <div className="flex items-center space-x-2">
          <Input
            aria-label="Check todo"
            id="progress"
            type="checkbox"
            className="h-4 w-4 rounded p-0"
            checked={todo.completed}
            onChange={(e) => {
              updateTodoMutation.mutate({
                id: todo.id,
                completed: e.currentTarget.checked,
              })
            }}
            autoFocus={isEditing}
          />
          <p
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              todo.completed && "text-slate-400 line-through"
            )}
          >
            {todoName}
          </p>
        </div>
      )}
      {isHoverd && !isEditing && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => setIsEditing(true)}
          >
            <Icons.edit className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Edit todo</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => deleteTodoMutation.mutate(todo.id)}
          >
            <Icons.trash className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Delete todo</span>
          </Button>
        </div>
      )}
    </li>
  )
}
