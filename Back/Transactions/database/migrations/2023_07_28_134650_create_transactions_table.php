<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('montant');
            $table->enum('type_trans', ['depot', 'retrait', 'CbyC']);
            $table->string('code');
            $table->foreignId('expediteur_compte_id')->constrained('comptes')->onDelete('cascade');
            $table->foreignId('destination_compte_id')->nullable()->constrained('comptes')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
