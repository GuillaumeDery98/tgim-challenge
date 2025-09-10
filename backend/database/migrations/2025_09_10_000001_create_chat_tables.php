<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('chat_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->unique();
            $table->string('title')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_session_id')->constrained('chat_sessions')->cascadeOnDelete();
            $table->enum('role', ['user', 'assistant', 'system']);
            $table->longText('content');
            $table->json('sources')->nullable();
            $table->json('follow_up_questions')->nullable();
            $table->unsignedInteger('response_time_ms')->nullable();
            $table->float('confidence_score')->nullable();
            $table->timestamps();
        });

        Schema::create('rag_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('original_filename');
            $table->string('mime_type')->nullable();
            $table->string('storage_path');
            $table->string('category')->nullable();
            $table->string('difficulty_level')->nullable();
            $table->unsignedInteger('estimated_read_time')->default(5);
            $table->json('tags')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('rag_document_chunks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rag_document_id')->constrained('rag_documents')->cascadeOnDelete();
            $table->unsignedInteger('chunk_index');
            $table->longText('content');
            $table->json('embedding')->nullable();
            $table->timestamps();

            $table->unique(['rag_document_id', 'chunk_index']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rag_document_chunks');
        Schema::dropIfExists('rag_documents');
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_sessions');
    }
};
