import * as React from "react"
import type { Todo } from "@prisma/client"
import { useIsMutating } from "@tanstack/react-query"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { api } from "@/lib/api-beta"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const schema = z.object({
  name: z.string().min(1),
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
    onMutate: async (name) => {
      await apiUtils.todo.getAll.cancel()
      const todos = todosQuery.data ?? []
      apiUtils.todo.getAll.setData(undefined, [
        ...todos,
        {
          id: crypto.randomUUID(),
          name,
          completed: false,
        },
      ])

      toast.success("Todo added.")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // refetch todos
  const number = useIsMutating()
  React.useEffect(() => {
    if (number === 0) {
      void apiUtils.todo.getAll.invalidate()
    }
  }, [number, apiUtils])

  // react-hook-form
  const [showInput, setShowInput] = React.useState(false)

  const { register, setFocus, handleSubmit, reset } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    reset()
    setShowInput(true)
    await addTodoMutation.mutateAsync(data.name)
  }

  // setFocus on showInput change
  React.useEffect(() => {
    setFocus("name")
  }, [setFocus, showInput])

  // scroll to bottom of todos on todosQuery data change
  const todosRef = React.useRef<HTMLUListElement>(null)
  React.useEffect(() => {
    if (!todosRef.current) return
    todosRef.current.scrollTop = todosRef.current.scrollHeight
  }, [todosQuery.data])

  return (
    <div className="space-y-3">
      {todosQuery.isLoading ? (
        <div className="mt-2.5 grid gap-5 px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      ) : (
        todosQuery.isSuccess &&
        todosQuery.data?.length > 0 && (
          <ul
            ref={todosRef}
            className="grid max-h-[480px] gap-4 overflow-y-auto overflow-x-hidden px-6 pt-1"
          >
            {todosQuery.data.map((todo) => (
              <TodoCard todo={todo} key={todo.id} />
            ))}
          </ul>
        )
      )}
      <form
        className="px-6"
        onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
      >
        {showInput ? (
          <div className="flex flex-col space-y-3">
            <Input
              id="todoName"
              type="text"
              placeholder="Type todo..."
              {...register("name", { required: true })}
            />

            <div className="ml-auto flex items-center gap-2.5">
              <Button
                type="button"
                aria-label="Cancel"
                variant="destructive"
                size="sm"
                onClick={() => setShowInput(false)}
              >
                Cancel
              </Button>
              <Button aria-label="Add todo" size="sm">
                Add Todo
              </Button>
            </div>
          </div>
        ) : (
          <Button
            aria-label="Open add todo input"
            type="button"
            variant="ghost"
            className="p-0 hover:bg-transparent hover:opacity-80"
            onClick={() => setShowInput(true)}
          >
            <Icons.add
              className="mr-2 h-5 w-5 text-red-500"
              aria-hidden="true"
            />
            <p className="text-slate-400">Add todo</p>
          </Button>
        )}
      </form>
    </div>
  )
}

interface TodoCardProps {
  todo: Pick<Todo, "id" | "name" | "completed">
}

const TodoCard = ({ todo }: TodoCardProps) => {
  const apiUtils = api.useContext()

  const [isHoverd, setIsHoverd] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [todoName, setTodoName] = React.useState(todo.name ?? "")

  // update todo mutation
  const updateTodoMutation = api.todo.update.useMutation({
    onMutate: async ({ id, completed, name }) => {
      await apiUtils.todo.getAll.cancel()
      const allTodos = apiUtils.todo.getAll.getData() ?? []
      if (!allTodos) return

      const newTodos = allTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: completed ?? todo.completed,
              name: name ?? todo.name,
            }
          : todo
      )
      apiUtils.todo.getAll.setData(undefined, newTodos)

      toast.success(`Todo ${completed ? "completed" : "updated"}.`)
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
      if (!allTodos) return
      const newTodos = allTodos.filter((todo) => todo.id !== id)
      apiUtils.todo.getAll.setData(undefined, newTodos)
      toast.success("Todo deleted.")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <li className={cn(isEditing && "space-y-3")}>
      <div
        className={cn(
          "flex min-h-[40px] cursor-pointer",
          isEditing ? "flex-col" : "flex-row items-center justify-between gap-2"
        )}
        onMouseEnter={() => setIsHoverd(true)}
        onMouseLeave={() => setIsHoverd(false)}
        onDoubleClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? (
          <div className="z-10 flex flex-col gap-3">
            <Input
              id="editableTodoName"
              type="text"
              value={todoName}
              onChange={(e) => setTodoName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && todoName?.length > 0) {
                  updateTodoMutation.mutate({
                    id: todo.id,
                    name: todo.name,
                  })
                  setIsEditing(false)
                }
              }}
              autoFocus={isEditing}
            />
            <div className="ml-auto flex items-center gap-2.5">
              <Button
                aria-label="Cancel"
                type="button"
                variant="destructive"
                size="sm"
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
        ) : (
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="todoStatus"
              checked={todo.completed}
              onCheckedChange={(checked) => {
                updateTodoMutation.mutate({
                  id: todo.id,
                  completed: !!checked,
                })
              }}
            />
            <label
              htmlFor="todoStatus"
              className={cn(
                "line-clamp-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                todo.completed && "text-slate-400 line-through"
              )}
            >
              {todoName}
            </label>
          </div>
        )}
        {isHoverd && !isEditing && (
          <div className="z-10 flex items-center gap-2">
            <Button
              type="button"
              title="Edit todo"
              variant="ghost"
              className="p-0 hover:bg-transparent"
              onClick={() => setIsEditing(true)}
            >
              <Icons.edit className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Edit todo</span>
            </Button>
            <Button
              type="button"
              title="Delete todo"
              variant="ghost"
              className="p-0 hover:bg-transparent"
              onClick={() => deleteTodoMutation.mutate(todo.id)}
            >
              <Icons.trash className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Delete todo</span>
            </Button>
          </div>
        )}
      </div>
      <Separator className="w-full" />
    </li>
  )
}
