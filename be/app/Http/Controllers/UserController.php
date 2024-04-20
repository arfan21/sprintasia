<?php

namespace App\Http\Controllers;

use App\Models\HttpResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Validator;

class UserController extends Controller
{
    // Register user
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6'
            ]);

            if ($validator->fails()) {
                $res = new HttpResponse(
                    'Validation error',
                    [],
                    $validator->errors()->toArray()
                );


                return response()->json($res->toArray(), 400);
            }

            $user = new User([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password)
            ]);

            $user->save();

            $res = new HttpResponse('User registered successfully');

            return response()->json($res->toArray(), 201);
        } catch (\Exception $e) {
            Log::channel('stderr')->error('An error occurred while registering user', ['error' => $e->getMessage()]);
            $res = new HttpResponse('An error occurred while registering user', [], ["internal server error"]);

            return response()->json($res->toArray(), 500);
        }
    }

    // Login user
    public function login(Request $request)
    {

        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string'
            ]);

            if ($validator->fails()) {
                $res = new HttpResponse(
                    'Validation error',
                    [],
                    $validator->errors()->toArray()
                );

                return response()->json($res->toArray(), 400);
            }

            $credentials = request(['email', 'password']);

            if (!$token = auth()->attempt($credentials)) {
                $res = new HttpResponse('invalid credentials');

                return response()->json($res->toArray(), 401);
            }

            return $this->respondWithToken($token);
        } catch (\Exception $e) {
            Log::channel('stderr')->error('An error occurred while logging in user', ['error' => $e->getMessage()]);
            $res = new HttpResponse('An error occurred while logging in user', [], ["internal server error"]);

            return response()->json($res->toArray(), 500);
        }
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'message' => 'Login successful',
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' =>  auth()->factory()->getTTL() * 60
            ]

        ]);
    }
}
