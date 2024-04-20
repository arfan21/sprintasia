<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
        'due_date',
        'completed_at',
        'user_id',
        'parent_id'
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'completed_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeOngoing($query)
    {
        return $query->where('status', 'ongoing');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCanceled($query)
    {
        return $query->where('status', 'canceled');
    }

    public function parent()
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }

    /**
     * Get Parent Task
     * @return Task
     */
    public function getParentTask()
    {
        return $this->where('id', $this->parent_id)->first();
    }

    /**
     * Get Parent Subtasks
     * @return Task[]
     */
    public function getParentSubtasks()
    {
        return $this->where('parent_id', $this->parent_id)->where('id', '!=', $this->id)->get();
    }

    /**
     * Get Subtasks
     * @return Task[]
     */
    public function getSubtasks()
    {
        return $this->where('parent_id', $this->id)->get();
    }
}
