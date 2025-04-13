<?php

namespace Database\Factories;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InvoiceItem>
 */
class InvoiceItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

            $unitPrice = $this->faker->randomFloat(2, 10, 500);
            $quantity = $this->faker->numberBetween(1, 20);
            
            return [
                'invoice_id' => Invoice::factory(),
                'description' => $this->faker->sentence(3),
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
            ];
    }
}
