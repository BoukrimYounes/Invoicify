<?php

namespace App\Http\Controllers;

use App\Models\Invoice;

use App\Models\Customer;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use Barryvdh\DomPDF\PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
    
        $validated = $request->validate([
            'number' => 'required|string|unique:invoices',
            'date' => 'required|date',
            'due_date' => 'required|date',
            'discount' => 'required|numeric',
            'currency' => 'required|string|size:3',
            'tax_rate' => 'required|numeric',
            'status' => 'required|string',
            'subtotal' => 'required|numeric',
            'total' => 'required|numeric',
            'notes' => 'nullable|string',
            'invoice_items' => 'required|array',
            'invoice_items.*.description' => 'required|string',
            'invoice_items.*.quantity' => 'required|integer|min:1',
            'invoice_items.*.unit_price' => 'required|numeric|min:0',
            'customer.name' => 'required|string',
            'customer.email' => 'required|email',
            'customer.address' => 'required|string',
        ]);
        return DB::transaction(function () use ($validated) {
            // Create or find the customer
            $customer = Customer::firstOrCreate(
                ['email' => $validated['customer']['email']],
                [
                    'name' => $validated['customer']['name'],
                    'address' => $validated['customer']['address']
                ]
            );
    
            // Create the invoice
            $invoice =  Auth::user()->invoices()->create([
                'number' => $validated['number'],
                'date' => $validated['date'],
                'due_date' => $validated['due_date'],
                'user_id' => auth()->user()->id,
                'customer_id' => $customer->id,
                'status' => $validated['status'],
                'subtotal' => $validated['subtotal'],
                'tax_rate' => ($validated['subtotal'] * $validated['tax_rate']) / 100,
                'discount' => ($validated['subtotal'] * $validated['discount']) / 100,
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
    
            return redirect()->route('dashbord')
            ->with('success', 'Invoice updated successfully');
        });
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
        dd('ok');
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
