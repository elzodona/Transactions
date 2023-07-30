<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Compte;
use App\Models\Transaction;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function getClientByNum($num){
        $client = Client::where('telephone', $num)->first();
        return $client;

    }

    public function transClient($num){
        $client = Client::where('telephone', $num)->first();
        $compts = Compte::where('client_id', $client->id)->get();

        $transactions_by_fournisseur = [];
        foreach ($compts as $compt) {
            $transactions = Transaction::select('montant', 'type_trans', 'code', 'expediteur_compte_id', 'destination_compte_id', 'frais', 'date_transaction')
            ->where('expediteur_compte_id', $compt->id)
                ->get();
            $transactions_by_fournisseur[$compt->fournisseur] = $transactions;
        }
        return $transactions_by_fournisseur;
    }

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }
}
