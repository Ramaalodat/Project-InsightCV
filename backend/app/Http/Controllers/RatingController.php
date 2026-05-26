<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rating = Rating::create([
            'user_id' => $request->user_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => true, // Auto-approve all ratings
        ]);

        return response()->json([
            'message' => 'Thank you for your feedback! Your review is now live on our homepage.',
            'rating' => $rating
        ], 201);
    }

    public function index(Request $request)
    {
        // Get all approved ratings for public display
        $ratings = Rating::with(['user' => function($query) {
            $query->select('id', 'name', 'avatar', 'role');
            $query->with(['candidate:user_id,title', 'company:user_id,name']);
        }])
            ->where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->limit(20) // Show last 20 ratings
            ->get();

        return response()->json(['ratings' => $ratings]);
    }

    public function approve($id)
    {
        $rating = Rating::find($id);

        if (!$rating) {
            return response()->json(['message' => 'Rating not found'], 404);
        }

        $rating->update(['is_approved' => true]);

        return response()->json([
            'message' => 'Rating approved successfully',
            'rating' => $rating
        ]);
    }

    public function destroy($id)
    {
        $rating = Rating::find($id);

        if (!$rating) {
            return response()->json(['message' => 'Rating not found'], 404);
        }

        $rating->delete();

        return response()->json(['message' => 'Rating deleted successfully']);
    }
}
