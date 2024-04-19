<?php

namespace App\Http\Controllers;

use App\Models\HttpResponse;
use App\Models\Task;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Validator;

class TaskController extends Controller
{

    // store task
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'description' => 'required|string',
                'due_date' => 'required|date_format:Y-m-d H:i:s|after:now',
                'parent_id' => 'nullable|integer'
            ]);

            if ($validator->fails()) {
                $res = new HttpResponse(
                    'Validation error',
                    [],
                    $validator->errors()->toArray()
                );

                return response()->json($res->toArray(), 400);
            }

            $task = new Task([
                'name' => $request->name,
                'description' => $request->description,
                'due_date' => $request->due_date,
                'parent_id' => $request->parent_id,
                'user_id' => auth()->user()->id
            ]);

            // check if parent have parent
            // only 1 nested subtask is allowed
            if ($request->parent_id) {
                $parent = Task::findOrFail($request->parent_id);
                if ($parent && $parent->parent_id) {
                    $res = new HttpResponse('Task creation failed', [], ['parent_id' => ['Only 1 nested subtask is allowed']]);

                    return response()->json($res->toArray(), 400);
                }

                // check if parent is completed
                if ($parent->status === 'completed') {
                    $res = new HttpResponse('Task creation failed', [], ['parent_id' => ['Parent task is completed']]);

                    return response()->json($res->toArray(), 400);
                }
            }

            $task->save();

            $res = new HttpResponse('Task created successfully', $task->toArray());

            return response()->json($res->toArray(), 201);
        } catch (ModelNotFoundException $e) {
            Log::channel('stderr')->error('Task creation failed', ['error' => $e->getMessage()]);
            $res = new HttpResponse('Task creation failed', [], ["Parent task not found"]);

            return response()->json($res->toArray(), 404);
        } catch (Exception $e) {
            Log::channel('stderr')->error('Task creation failed', ['error' => $e->getMessage()]);
            $res = new HttpResponse('An error occurred while creating task', [], ["internal server error"]);

            return response()->json($res->toArray(), 500);
        }
    }

    // update task
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'description' => 'required|string',
                'due_date' => 'required|date_format:Y-m-d H:i:s|after:now',
                'status' => 'required|string|in:ongoing,completed,canceled'
            ]);

            if ($validator->fails()) {
                $res = new HttpResponse(
                    'Validation error',
                    [],
                    $validator->errors()->toArray()
                );

                return response()->json($res->toArray(), 400);
            }

            $task = Task::where('user_id', auth()->user()->id)->findOrFail($id);
            $task->name = $request->name;
            $task->description = $request->description;
            $task->due_date = $request->due_date;
            if ($request->status === 'completed' && !$task->completed_at) {
                $task->completed_at = now();
            }
            $task->status = $request->status;
            $task->save();

            // check if task have parent
            if ($task->parent_id) {
                $parentSubtasks = $task->getParentSubtasks();

                // check if all subtasks are completed
                $completed = $parentSubtasks->every(function ($task) {
                    return $task->status === 'completed';
                });

                if ($completed) {
                    $parent = $task->getParentTask();
                    $parent->status = 'completed';
                    $parent->save();
                }
            }

            $res = new HttpResponse('Task updated successfully', $task->toArray());

            return response()->json($res->toArray(), 200);
        } catch (ModelNotFoundException $e) {
            Log::channel('stderr')->error('Task update failed', ['error' => $e->getMessage()]);
            $res = new HttpResponse('Task update failed', [], ["Task not found"]);

            return response()->json($res->toArray(), 404);
        } catch (Exception $e) {
            Log::channel('stderr')->error('Task update failed', ['error' => $e->getMessage()]);
            $res = new HttpResponse('An error occurred while updating task', [], ["internal server error"]);

            return response()->json($res->toArray(), 500);
        }
    }

    // delete task
    public function destroy($id)
    {
        try {
            $task = Task::where('user_id', auth()->user()->id)->findOrFail($id);
            $task->delete();

            $res = new HttpResponse('Task deleted successfully');

            return response()->json($res->toArray(), 200);
        } catch (ModelNotFoundException $e) {
            Log::channel('stderr')->error('Task deletion failed', ['error' => $e->getMessage()]);
            $res = new HttpResponse('Task deletion failed', [], ["Task not found"]);

            return response()->json($res->toArray(), 404);
        } catch (QueryException $e) {
            Log::channel('stderr')->error('Task deletion failed', ['error' => $e->getMessage()]);
            $res = new HttpResponse('Task deletion failed', [], ["Task has subtasks"]);

            return response()->json($res->toArray(), 400);
        } catch (Exception $e) {
            Log::channel('stderr')->error('Task deletion failed', ['error' => $e->getMessage()]);
            $res = new HttpResponse('An error occurred while deleting task', [], ["internal server error"]);

            return response()->json($res->toArray(), 500);
        }
    }

    // get all tasks of user
    // if task has parent_id, it is a subtask and shown under parent task
    public function index()
    {
        try {
            $tasks = DB::select("SELECT t.*, JSON_AGG (sub.* ORDER by sub.due_date ASC ) AS subtasks FROM tasks t LEFT JOIN tasks sub ON sub.parent_id = t.id WHERE t.parent_id IS NULL GROUP BY t.id ORDER BY t.due_date ASC");

            // convert subtasks to array
            // and check if null, set to empty array
            foreach ($tasks as $task) {
                $task->subtasks = $task->subtasks !== "[null]" ? json_decode($task->subtasks, true) : [];
            }

            $res = new HttpResponse('Tasks retrieved successfully', $tasks);

            return response()->json($res->toArray(), 200);
        } catch (Exception $e) {
            Log::channel('stderr')->error('Tasks retrieval failed', ['error' => $e->getMessage()]);
            $res = new HttpResponse('An error occurred while retrieving tasks', [], ["internal server error"]);

            return response()->json($res->toArray(), 500);
        }
    }

    // get task by id of user
    public function show($id)
    {
        try {
            $tasks = DB::select("SELECT t.*, JSON_AGG (sub.* ORDER by sub.due_date ASC ) AS subtasks FROM tasks t LEFT JOIN tasks sub ON sub.parent_id = t.id WHERE t.id = ? AND t.user_id = ? GROUP BY t.id", [$id, auth()->user()->id]);

            // if task not found, throw exception
            if (empty($tasks)) {
                throw new ModelNotFoundException();
            }
            $task = $tasks[0];
            // convert subtasks to array if not null
            if ($task->subtasks !== "[null]") {
                $task->subtasks = json_decode($task->subtasks, true);
            } else {
                // remove subtasks key if null
                unset($task->subtasks);
            }

            $res = new HttpResponse('Task retrieved successfully', $task);

            return response()->json($res->toArray(), 200);
        } catch (ModelNotFoundException $e) {
            Log::channel('stderr')->error('Task retrieval failed', ['error' => $e->getMessage()]);
            $res = new HttpResponse('Task retrieval failed', [], ["Task not found"]);

            return response()->json($res->toArray(), 404);
        } catch (Exception $e) {
            Log::channel('stderr')->error('Task retrieval failed', ['error' => $e->getMessage()]);
            $res = new HttpResponse('An error occurred while retrieving task', [], ["internal server error"]);

            return response()->json($res->toArray(), 500);
        }
    }
}
