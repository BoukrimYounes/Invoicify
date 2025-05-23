<?php

namespace App\Http\Controllers;

use App\Models\Invoice;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {  
        return Inertia::render('SignIn');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    return Inertia::render('NewInvoice');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        try {
            $validated = $request->validate([
                'number' => 'required|string|unique:invoices',
                'date' => 'required|date',
                'due_date' => 'required|date',
                'discount' => 'required|numeric', // This should be percentage (e.g., 20 for 20%)
                'currency' => 'required|string|size:3',
                'tax_rate' => 'required|numeric', // This should be percentage (e.g., 10 for 10%)
                'status' => 'required|string',
                'subtotal' => 'required|numeric',
                'total' => 'required|numeric',
                'notes' => 'nullable|string',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'invoice_items' => 'required|array',
                'invoice_items.*.description' => 'required|string',
                'invoice_items.*.quantity' => 'required|integer|min:1',
                'invoice_items.*.unit_price' => 'required|numeric|min:0',
                'customer.name' => 'required|string',
                'customer.email' => 'required|email',
                'customer.address' => 'required|string',
            ]);
    
            return DB::transaction(function () use ($validated, $request) {
            $user = Auth::user();
            
            // Handle logo upload if present
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('users/logos', 'public');
                $user->update(['logo' => $logoPath]);
            }

            // Create or find customer
            $customer = Customer::firstOrCreate(
                ['email' => $validated['customer']['email']],
                [
                    'name' => $validated['customer']['name'],
                    'address' => $validated['customer']['address']
                ]
            );

            // Create invoice
            $invoice = $user->invoices()->create([
                'number' => $validated['number'],
                'date' => $validated['date'],
                'due_date' => $validated['due_date'],
                'customer_id' => $customer->id,
                'status' => $validated['status'],
                'subtotal' => $validated['subtotal'],
                'tax_rate' => $validated['tax_rate'],
                'discount' => $validated['discount'],
                'total' => $validated['total'],
                'currency' => $validated['currency'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create invoice items
            foreach ($validated['invoice_items'] as $item) {
                $invoice->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price']
                ]);
            }
                return redirect('dashbord')->with('success', 'Your invoice was created!');
            });
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create invoice. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Fetch invoice with customer & items
        $invoice = Invoice::with(['customer', 'items'])->findOrFail($id);
        return Inertia::render('Print',['invoice' =>$invoice]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // Fetch invoice with customer & items
        $invoice = Invoice::with(['customer', 'items'])->findOrFail($id);
        return Inertia::render('EditInvoice',['invoice' =>$invoice]);
    }

 /**
 * Update the specified resource in storage.
 */
public function update(Request $request, Invoice $invoice)
{
    if (!auth()->check()) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    try {
        $validated = $request->validate([
            'number' => 'required|string|unique:invoices,number,'.$invoice->id,
            'date' => 'required|date',
            'due_date' => 'required|date',
            'discount' => 'required|numeric',
            'currency' => 'required|string|size:3',
            'tax_rate' => 'required|numeric',
            'status' => 'required|string',
            'subtotal' => 'required|numeric',
            'total' => 'required|numeric',
            'notes' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'invoice_items' => 'required|array',
            'invoice_items.*.description' => 'required|string',
            'invoice_items.*.quantity' => 'required|integer|min:1',
            'invoice_items.*.unit_price' => 'required|numeric|min:0',
            'customer.name' => 'required|string',
            'customer.email' => 'required|email',
            'customer.address' => 'required|string',
            'deleted_items' => 'sometimes|array',
            'deleted_items.*' => 'integer|exists:invoice_items,id',
            'logo_action' => 'sometimes|string|in:update,delete'
        ]);

        return DB::transaction(function () use ($validated, $request, $invoice) {
            $user = Auth::user();

            // Handle logo actions
            if ($request->has('logo_action')) {
                if ($validated['logo_action'] === 'delete') {
                    // Delete existing logo
                    if ($user->logo) {
                        Storage::disk('public')->delete($user->logo);
                        $user->update(['logo' => null]);
                    }
                } elseif ($validated['logo_action'] === 'update' && $request->hasFile('logo')) {
                    // Update logo with new file
                    $logoPath = $request->file('logo')->store('users/logos', 'public');
                    $user->update(['logo' => $logoPath]);
                }
            } elseif ($request->hasFile('logo')) {
                // Handle direct logo upload without action
                $logoPath = $request->file('logo')->store('users/logos', 'public');
                $user->update(['logo' => $logoPath]);
            }

            // Update or find the customer
            $customer = Customer::updateOrCreate(
                ['email' => $validated['customer']['email']],
                [
                    'name' => $validated['customer']['name'],
                    'address' => $validated['customer']['address']
                ]
            );

            // Update the invoice
            $invoice->update([
                'number' => $validated['number'],
                'date' => $validated['date'],
                'due_date' => $validated['due_date'],
                'customer_id' => $customer->id,
                'status' => $validated['status'],
                'subtotal' => $validated['subtotal'],
                'tax_rate' => $validated['tax_rate'],
                'discount' => $validated['discount'],
                'total' => $validated['total'],
                'currency' => $validated['currency'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // Handle deleted items
            if (!empty($validated['deleted_items'])) {
                $invoice->items()->whereIn('id', $validated['deleted_items'])->delete();
            }

            // Get all existing item IDs for this invoice
            $existingItemIds = $invoice->items()->pluck('id')->toArray();

            // Process each item from the request
            foreach ($validated['invoice_items'] as $item) {
                if (isset($item['id']) ){
                    // Update existing item
                    $invoice->items()->where('id', $item['id'])->update([
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price']
                    ]);

                    // Remove from existing items array
                    $existingItemIds = array_diff($existingItemIds, [$item['id']]);
                } else {
                    // Create new item
                    $invoice->items()->create([
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price']
                    ]);
                }
            }

            // Delete any remaining items that weren't in the request and weren't explicitly deleted
            if (!empty($existingItemIds)) {
                $invoice->items()->whereIn('id', $existingItemIds)->delete();
            }

            return redirect()->route('dashboard')->with([
                'success' => 'Invoice updated successfully!',
                'invoice' => $invoice->fresh(['customer', 'items'])
            ]);
        });

    } catch (\Illuminate\Validation\ValidationException $e) {
        return back()->withErrors($e->errors())->withInput();
    } catch (\Exception $e) {
        return back()->with('error', 'Failed to update invoice: ' . $e->getMessage());
    }
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return back()->with('delete', 'Your invoice was deleted!');
    }


    public function print($id)
{
    $invoice = Invoice::with('customer', 'items')->findOrFail($id);
    return Inertia::render('Print', [
        'invoice' => $invoice
    ]);
}
}
