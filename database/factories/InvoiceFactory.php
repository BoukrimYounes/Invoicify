<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'number' => 'INV-' . $this->faker->unique()->numberBetween(1000, 9999),
            'user_id' => User::factory()->create()->id,
            'customer_id' => Customer::factory()->create()->id,
            'date' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'due_date' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['date'], '+30 days')->format('Y-m-d');
            },

            'currency' => $this->faker->randomElement(['USD', 'EUR', 'GBP', 'MAD']),
            'tax_rate' => $taxRate = $this->faker->randomElement([0, 5, 10, 20]),
            'status' => $this->faker->randomElement(['Unpaid', 'Pending', 'Paid', 'cancelled']),
            'notes' => $this->faker->optional(0.7)->paragraph(2), // 70% chance of having notes
            'subtotal' => $subTotal = $this->faker->numberBetween(1000, 10000),
            'discount' => $discount = $this->faker->numberBetween(0, 20),
            'total' => $subTotal - ($subTotal * ($discount / 100)) + ($subTotal * ($taxRate / 100)),
        ];
    }
}
