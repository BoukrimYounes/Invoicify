<?php

use App\Models\Customer;
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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            
            // Relationship to the seller/user
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Relationship to the customer
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            
            // Invoice dates
            $table->date('date');
            $table->date('due_date');
            $table->integer('discount');

            
            // Invoice details
            $table->string('currency', 3)->default('USD');
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->enum('status', ['Unpaid', 'Pending', 'Paid', 'Cancelled'])->default('Unpaid');
            
            // Financial amounts
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);
            $table->text('notes')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
